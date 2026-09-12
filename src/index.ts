
interface Env {}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return new Response("¡Hola desde Cloudflare con TypeScript! y", {
      headers: { "content-type": "text/plain;charset=UTF-8" },
    });
  },
};  