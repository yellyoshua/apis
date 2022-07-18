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
};

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (services[path] && env[services[path]]) {
      return await env[services[path]].fetch(request, ctx);
    }
		return new Response("404 Not Found", { status: 404 });
	},
};
