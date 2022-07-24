
export interface CustomResponse {
  json: (data: Record<string, any>, status: number) => Response;
}

export interface CustomRequest extends Request {
  data: Record<string, any>;
  query: Record<string, string>;
}

export type NewHandler = (request: CustomRequest, response: CustomResponse) => Promise<Response> | Response;

interface Route {
  path: string;
  method: 'post' | 'get' | 'put' | 'delete';
  handler: NewHandler;
}

function handleServerError(event: FetchEvent) {
  return new Response('Error with the server', { status: 500 });
}

function removeQueryString(url: string) {
  return url.split('?').shift();
}

function cleanPath(url: string) {
  const parts = url.split('/');
  if (parts[parts.length - 1] === '') {
    parts.pop();
  }

  const partsWithourQueries = parts.map(part => {
    return removeQueryString(part);
  });

  const cleanedPath = partsWithourQueries.join('/');
  if (!cleanedPath.startsWith('/')) {
    const urlWithPrefix = cleanedPath.startsWith('http') ?
      cleanedPath :
      'http://'.concat(cleanedPath);

    return new URL(urlWithPrefix).pathname;
  }

  return cleanedPath;
}

interface RoutesObj {
  [url: string]: {
    [method: string]: NewHandler;
  };
}

function composeQueries(url: string): Record<string, string> {
  const queries = url.split('?');
  if (queries.length < 2) {
    return {};
  }

  const queryString = queries[1];
  const queryParts = queryString.split('&');
  const queryObject = queryParts.reduce((acc, query) => {
    const [key, value] = query.split('=');
    // @ts-ignore
    acc[key] = value;
    return acc;
  }, {});

  return queryObject;
}

const routesObj: RoutesObj = {};

export function routesSetup(routes: Route[]) {
  routes.forEach(route => {
    const { path, method, handler } = route;
    const url = cleanPath(path);
    if (!routesObj[url]) {
      routesObj[url] = {};
    }
    routesObj[url][method] = handler;
  });

  return function (fetchEvent: FetchEvent) {

    const url = cleanPath(fetchEvent.request.url);
    const method = fetchEvent.request.method.toLowerCase();
    const handler = getRouteHandler(url, method);

    if (!handler) {
      console.log(`No route found for ${url} ${method}`);
      return fetch(fetchEvent.request);
    }

    const response: CustomResponse = {
      json: (data, status) => {
        return new Response(JSON.stringify(data), { status });
      }
    };

    const query = composeQueries(fetchEvent.request.url);
    if (method === 'get') {
      const request: CustomRequest = {...fetchEvent.request, data: {}, query};

      fetchEvent.respondWith(
        Promise.resolve(handler(request, response)).
        catch(handleServerError)
      );
    } else {

      const resolvePost = async () => {
        const data = await fetchEvent.request.json();
        const request: CustomRequest = {...fetchEvent.request, data, query};
        return Promise.resolve(handler(request, response)).
        catch(handleServerError);
      };

      fetchEvent.respondWith(resolvePost());
    }
  }
}

function getRouteHandler(urlCleaned: string, method: string) {
  for (const path in routesObj) {
    if (urlCleaned.endsWith(path)) {
      return routesObj[path][method];
    }
  }
  return null;
}
