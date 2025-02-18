export class Logger {
  public static writeLogs: boolean = process.env.NODE_ENV === "development";

  public static info(message: string): void {    
    if (this.writeLogs) {
      console.log("%c INFO ", "background: #222; color: #bada55", message);
    }
  }

  public static debug(message: string): void {
    if (this.writeLogs) {
      console.log("%c DEBUG ", "background: #222; color: #90b9ef", message);
    }
  }

  public static error(message: string): void {
    if (this.writeLogs) {
      console.log("%c ERROR ", "background: #222; color: #dc3545", message);
    }
  }

  public static warn(message: string): void {
    if (this.writeLogs) {
      console.log("%c WARN ", "background: #222; color: #FFA500", message);
    }
  }
}
