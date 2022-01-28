import { Handler, createResponse } from "repo-packages-route";
import movies from "../data/movies.json";

export const handlerMovies: Handler = (_, headers) =>
  createResponse({ body: JSON.stringify(movies), response: { headers } });
