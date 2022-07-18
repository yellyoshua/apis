import {Router, createResponse} from '../../shared';
import movies from "./data/movies.json";

const handlerMovies = (_: any, headers: any) => {
  const body = JSON.stringify(movies);
  return createResponse({ body, response: { headers } })
};

addEventListener("fetch", (event) => {
  const router = new Router(event);

  router.GET("/", handlerMovies);
  router.serve();
});
