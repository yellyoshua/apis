import { Router, createResponse } from "../../shared";
import periodicTable from "./data/periodic-table.json";
import newPeriodicTable from "./data/periodic-table-new.json";

export const handlerPeriodicTable = (_: any, headers: any) => {
  const body = JSON.stringify(periodicTable);
  return createResponse({ body, response: { headers } });
};

export const handlerNewPeriodicTable = (_: any, headers: any) => {
  const body = JSON.stringify(newPeriodicTable);
  return createResponse({ body, response: { headers } });
};

// @ts-ignore
if (globalThis.addEventListener) {
  addEventListener("fetch", (event) => {
    const router = new Router(event);

    router.GET("/previous", handlerPeriodicTable);
    router.GET("/latest", handlerNewPeriodicTable);

    router.serve();
  });
}
