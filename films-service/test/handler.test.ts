import { handlerMovies } from "../src/api";
import makeServiceWorkerEnv from "service-worker-mock";
import { createCORSHeaders } from "repo-packages-route";

declare var global: any;

describe("handle", () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  test("handle movies GET", async () => {
    const headers = createCORSHeaders();

    const result = await handlerMovies(
      new Request("/api/movies", { method: "GET" }),
      headers
    );

    expect(result.status).toEqual(200);
    expect(result.headers.has("Access-Control-Allow-Origin")).toBeTruthy();
    expect(result.headers.has("Access-Control-Allow-Methods")).toBeTruthy();
    expect(result.headers.has("Access-Control-Max-Age")).toBeTruthy();

    const movies = await result.json();
    expect(Array.isArray(movies)).toBeTruthy();
  });
});
