import {Router, createResponse} from '../../shared';
import movies from "./data/movies.json";

export const handlerMovies = (_: any, headers: any) => {
  const body = JSON.stringify(movies);
  return createResponse({ body, response: { headers } })
};

// @ts-ignore
if (globalThis.addEventListener) {
  addEventListener("fetch", (event) => {
    const router = new Router(event);

    router.GET("/", handlerMovies);
    router.serve();
  });
}
