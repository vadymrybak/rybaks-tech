import { init, inject, injectable, Types } from "@biorate/inversion";
import { Logger } from "@nestjs/common";
import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { IConfig } from "@biorate/config";

@injectable()
export class S3Helper {
  private s3Client: S3Client;

  @inject(Types.Config) private config: IConfig;

  private readonly logger: Logger = new Logger(S3Helper.name);

  @init()
  public async moduleInit() {
    this.s3Client = new S3Client({
      region: this.config.get("s3.region"),
      endpoint: this.config.get("s3.endpoint"),
      credentials: {
        accessKeyId: this.config.get("s3.credentials.accessKeyId"),
        secretAccessKey: this.config.get("s3.credentials.secretAccessKey"),
      },
    });

    const bucketExists: boolean = await this.checkBucketExists(this.config.get("s3.bucketName"));
    if (!bucketExists) {
      const bucketCreation = await this.s3Client.send(
        new CreateBucketCommand({
          Bucket: this.config.get("s3.bucketName"),
        }),
      );
      this.logger.debug(
        `(uploadFiles) No bucket existed. Status for ${this.config.get("s3.bucketName")} creation: ${bucketCreation.$metadata.httpStatusCode}`,
      );
    }
  }

  public async checkBucketExists(bucketName: string) {
    try {
      const command = new HeadBucketCommand({
        Bucket: bucketName,
      });

      await this.s3Client.send(command);
      return true; // Bucket exists
    } catch (error) {
      if (error.name === "NotFound") {
        this.logger.debug(`(checkBucketExists) Bucket "${bucketName}" does not exist.`);
        return false; // Bucket does not exist
      } else {
        this.logger.error("Error checking bucket existence:", error);
        throw error; // Rethrow the error for further handling
      }
    }
  }

  public async checkKeyExists(bucketName: string, key: string) {
    try {
      const command = new HeadObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true; // Key exists
    } catch (error) {
      if (error.name === "NotFound") {
        this.logger.debug(`(checkKeyExists) Key "${key}" does not exist in bucket "${bucketName}".`);
        return false; // Key does not exist
      } else {
        this.logger.error("Error checking key existence:", error);
        throw error; // Rethrow the error for further handling
      }
    }
  }

  public async uploadScreenshot(gameFolder: string, file: Express.Multer.File) {
    const userFolderExists: boolean = await this.checkKeyExists(this.config.get("s3.bucketName"), gameFolder);
    if (!userFolderExists) {
      const objectCreation = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.config.get("s3.bucketName"),
          Key: `${gameFolder}`,
        }),
      );
      this.logger.debug(`(uploadScreenshot) No folder existed. Status for ${gameFolder} creation: ${objectCreation.$metadata.httpStatusCode}`);
    }

    const objectCreationResult = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.config.get("s3.bucketName"),
        Key: `${gameFolder}/${file.originalname}`, // The name of the file in S3
        Body: file.buffer, // The file stream
        ContentType: "image/jpeg", // Set the content type (adjust as necessary)
      }),
    );
    return objectCreationResult;
  }
}
