import {describe, beforeEach, jest, test, expect} from '@jest/globals';
import { Miniflare } from "miniflare";

describe("handle", () => {
  let mf: Miniflare;
  beforeEach(() => {
    mf = new Miniflare({
      envPath: true,
      packagePath: true,
      wranglerConfigPath: true,
      buildCommand: undefined,
    });
  });

  test("handle previous words GET", async () => {
    const response = await mf.dispatchFetch('http://localhost/previous')
    const body = await response.json<[]>();

    expect(response.status).toBe(200);
    expect(body.length).toBe(118);
  });

  test("handle latest words GET", async () => {
    const response = await mf.dispatchFetch('http://localhost/latest')
    const body = await response.json<[]>();

    expect(response.status).toBe(200);
    expect(body.length).toBe(118);
  });
});
