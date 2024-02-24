import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";

type Bindings = {
  [key: string]: {
    fetch: (
      req: Request,
      env: Record<string, any>,
      ctx: any
    ) => Promise<Response>;
  };
};

const app = new Hono<{ Bindings: Bindings }>({});

app.use(prettyJSON());

// const servicesList = [
//   {path: '/globish', name: 'globish'},
//   {path: '/random', name: 'random'},
//   {path: '/periodic-table', name: 'periodic-table'},
//   {path: '/films', name: 'films'},
//   {path: '/badbunnyconcertecuador', name: 'badbunnyconcertecuador'},
//   {path: '/service-tweets', name: 'tweets'},
// ];

const services = {
  globish: "/service-globish",
  random: "/service-random",
  periodicTable: "/service-periodic-table",
  films: "/service-films",
  badBunnyConcertEcuador: "/service-badbunnyconcertecuador",
  tweets: "/service-tweets",
};

type Service = keyof typeof services;

app.get("/:service", (c) => {
  const service = c.req.param("service");

  if (service || c.env[service]) {
    return c.env[service].fetch(c.req.raw, c.env, c.executionCtx);
  }

  const { pathname } = new URL(c.req.url);

  const serviceName = Object.keys(services).find((name) => {
    return pathname.startsWith(services[name as Service]);
  });

  if (serviceName && c.env[serviceName]) {
    return c.env[serviceName].fetch(c.req.raw, c.env, c.executionCtx);
  }

  return c.json({ error: "Service not found" }, { status: 404 });
});

app.get("/", (c) => {
  return c.json(
    {
      services: Object.keys(c.env),
      connectedServices: Object.keys(services),
    },
    200
  );
});

export default app;
