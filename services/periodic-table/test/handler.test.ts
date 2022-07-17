import { handlerPeriodicTable, handlerNewPeriodicTable } from "../src";
import makeServiceWorkerEnv from "service-worker-mock";
import { createCORSHeaders } from "../../shared";

declare var global: any;

describe("handle", () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  test("handle periodic-table GET", async () => {
    const headers = createCORSHeaders();

    const result = await handlerPeriodicTable(
      new Request("/previous", { method: "GET" }),
      headers
    );

    expect(result.status).toEqual(200);
    expect(result.headers.has("Access-Control-Allow-Origin")).toBeTruthy();
    expect(result.headers.has("Access-Control-Allow-Methods")).toBeTruthy();
    expect(result.headers.has("Access-Control-Max-Age")).toBeTruthy();

    const movies = await result.json();
    expect(Array.isArray(movies)).toBeTruthy();
  });

  test("handle new-periodic-table GET", async () => {
    const headers = createCORSHeaders();

    const result = await handlerNewPeriodicTable(
      new Request("/latest", { method: "GET" }),
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
