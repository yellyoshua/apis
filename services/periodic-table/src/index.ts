import { routesSetup, NewHandler } from "../../shared";
import periodicTable from "./data/periodic-table.json";
import newPeriodicTable from "./data/periodic-table-new.json";

const handlerPeriodicTable: NewHandler = (_: any, response) => {
  return response.json(periodicTable, 200);
};

const handlerNewPeriodicTable: NewHandler = (_, response) => {
  return response.json(newPeriodicTable, 200);
};

addEventListener("fetch", routesSetup([
  { path: "/previous", method: 'get', handler: handlerPeriodicTable },
  { path: "/latest", method: 'get', handler: handlerNewPeriodicTable },
]));
