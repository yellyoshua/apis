import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";

const app = new Hono({
  getPath: (req) => {
    const { pathname } = new URL(req.url);

    if (pathname.startsWith("/random")) {
      return pathname.replace("/random", "/").replace(/^\/\/+/, "/");
    }

    if (pathname.startsWith("/service-random")) {
      return pathname
        .replace("/service-random", "/random")
        .replace(/^\/\/+/, "/");
    }

    return pathname;
  },
});

app.use(prettyJSON());
app.use(logger());

app.get("/username", (c) => {
  const username = Math.random().toString(36).substring(2, 15);
  return c.json({ username });
});

app.get("/email", (c) => {
  const email = `${Math.random().toString(36).substring(2, 15)}@example.com`;
  return c.json({ email });
});

app.get("/phone", (c) => {
  const phone = `+1${Math.random().toString().substring(2, 12)}`;
  return c.json({ phone });
});

app.get("/", (c) => {
  return c.json({
    services: [
      { name: "username", path: "/username" },
      { name: "email", path: "/email" },
      { name: "phone", path: "/phone" },
    ],
  });
});

export default app;
