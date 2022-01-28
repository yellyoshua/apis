import { Handler, Route, ResponseFormat } from "../types";
import { parseUrl } from "../utils";

export const createResponse = ({ body, response }: ResponseFormat): Response =>
  new Response(body, response);

export const createCORSHeaders = (): Headers => {
  const headers = new Headers({});

  headers.append("Access-Control-Allow-Origin", "*");
  headers.append("Access-Control-Allow-Methods", "GET,HEAD,POST,OPTIONS");
  headers.append("Access-Control-Max-Age", "86400");

  return headers;
};

const handlerServerError: Handler = (_, headers) =>
  new Response("Error with the server", { status: 500, headers });

export class Router {
  private fetchEvent: FetchEvent;
  private routes: Route[];

  constructor(event: FetchEvent) {
    this.fetchEvent = event;
    this.routes = [];
  }

  GET(path: string, handler: Handler) {
    this.routes = [...this.routes, { path, method: "GET", handler }];
  }

  POST(path: string, handler: Handler) {
    this.routes = [...this.routes, { path, method: "POST", handler }];
  }

  async serve() {
    const url = parseUrl(this.fetchEvent.request.url);
    const method = this.fetchEvent.request.method;

    const request = this.fetchEvent.request;
    const headers = createCORSHeaders();

    const pathWithMethodExist = this.routes.find(
      (route) => url.includes(route.path) && route.method.includes(method)
    );

    if (pathWithMethodExist) {
      for (const route of this.routes) {
        if (url.includes(route.path) && route.method.includes(method)) {
          this.fetchEvent.respondWith(route.handler(request, headers));
          break;
        }
      }
    } else {
      this.fetchEvent.respondWith(handlerServerError(request, headers));
    }
  }
}
