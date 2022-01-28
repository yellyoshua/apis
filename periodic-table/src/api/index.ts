import { Handler, createResponse } from "repo-packages-route";
import periodicTable from "../data/periodic-table.json";
import newPeriodicTable from "../data/periodic-table-new.json";

export const handlerPeriodicTable: Handler = (_, headers) =>
  createResponse({
    body: JSON.stringify(periodicTable),
    response: { headers },
  });

export const handlerNewPeriodicTable: Handler = (_, headers) =>
  createResponse({
    body: JSON.stringify(newPeriodicTable),
    response: { headers },
  });
