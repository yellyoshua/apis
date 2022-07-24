// @ts-nocheck
export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
}

const services = {
  '/globish': 'globish',
  '/periodic-table': 'periodic-table',
  '/films': 'films',
  '/badbunnyconcertecuador': 'badbunnyconcertecuador',
};

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
    const url = new URL(request.url);
    const service = getService(env, url.pathname);

    if (service) {
      return await service.fetch(request, env, ctx);
    }

		return new Response("What do you mean?", { status: 200 });
	},
};

function getService(env: Env, path: string) {
  const basePath = cleanPath(path);

  if (services[basePath] && env[services[basePath]]) {
    return env[services[basePath]];
  }

  return null;
}

function cleanPath(path: string) {
  const firstPath = path.split('/').slice(0, 2).join('/');
  return firstPath.split('?').shift();
}
