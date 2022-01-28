import { Router } from "repo-packages-route";
import * as api from "./api";

addEventListener("fetch", (event) => {
  const router = new Router(event);

  router.GET("/api/periodic-table", api.handlerPeriodicTable);
  router.GET("/api/new-periodic-table", api.handlerNewPeriodicTable);

  router.serve();
});
