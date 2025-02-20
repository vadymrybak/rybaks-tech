export interface IDoLoginResponse {
  message: string;
}

export interface IUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
}

export interface IUserGame {
  id: number;
  name: string;
  icon: string;
}

export interface IScreenshotResponse {
  screenshots: {
    byDay: IScreenshotByDay
  };
  total: number;
}

export interface IScreenshotByDay {
  [byDay: string]: IScreenshot[];
}

export interface IScreenshot {
  id: number;
  base64: string;
  name: string;
  description: string;
  updatedat: string;
  createdat: string;
  filename: string;
}
