export type IError<H = unknown> = Error & {
  response?: { data?: { code?: string; hint?: H } };
};
