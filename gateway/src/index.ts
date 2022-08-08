
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

const servicesList = [
  {path: '/globish', name: 'globish'},
  {path: '/periodic-table', name: 'periodic-table'},
  {path: '/films', name: 'films'},
  {path: '/badbunnyconcertecuador', name: 'badbunnyconcertecuador'},
  {path: '/service-tweets', name: 'tweets'},
];

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const {pathname} = new URL(request.url);
    const basePath = cleanPath(pathname);
    const service = servicesList.find(({path}) => basePath === path);

    return service
      // @ts-ignore
      ? env[service.name].fetch(request, env, ctx)
      : new Response("What do you mean?", { status: 200 })
	},
};

function cleanPath(path: string): string {
  const firstPath = path.split('/').slice(0, 2).join('/');
  return firstPath.split('?')[0] || '';
}
