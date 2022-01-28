export type ResponseFormat = {
  body: BodyInit | null;
  response?: ResponseInit;
};

export type Handler = (
  request: Request,
  headers?: Headers
) => Promise<Response> | Response;

export interface Route {
  path: string;
  method: "POST" | "GET";
  handler: Handler;
}
