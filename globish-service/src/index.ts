import { Router } from "repo-packages-route";
import * as api from "./api";

addEventListener("fetch", (event) => {
  const router = new Router(event);

  router.GET("/api/globish-words", api.handlerGlobishWords);

  router.serve();
});
