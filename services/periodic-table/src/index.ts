import { Router, createResponse } from "../../shared";
import periodicTable from "./data/periodic-table.json";
import newPeriodicTable from "./data/periodic-table-new.json";

const handlerPeriodicTable = (_: any, headers: any) => {
  const body = JSON.stringify(periodicTable);
  return createResponse({ body, response: { headers } });
};

const handlerNewPeriodicTable = (_: any, headers: any) => {
  const body = JSON.stringify(newPeriodicTable);
  return createResponse({ body, response: { headers } });
};

addEventListener("fetch", (event) => {
  const router = new Router(event);

  router.GET("/previous", handlerPeriodicTable);
  router.GET("/latest", handlerNewPeriodicTable);

  router.serve();
});
