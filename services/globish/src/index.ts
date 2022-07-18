import { Router, createResponse } from "../../shared";
import globishWords from "./data/1500-globish-words.json";

const handlerGlobishWords = (_: any, headers: any) => {
  const body = JSON.stringify(globishWords);
  return createResponse({ body, response: { headers } });
};

addEventListener("fetch", (event) => {
  const router = new Router(event);

  router.GET("/", handlerGlobishWords);
  router.serve();
});
