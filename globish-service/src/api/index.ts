import { Handler, createResponse } from "repo-packages-route";
import globishWords from "../data/1500-globish-words.json";

export const handlerGlobishWords: Handler = (_, headers) =>
  createResponse({ body: JSON.stringify(globishWords), response: { headers } });
