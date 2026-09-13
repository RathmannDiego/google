interface Env {}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const branch = ""; 
    const repo = "";   
    const worker = ""; 
    const base = "";   

    const mensaje = `¡Hola desde Cloudflare con TypeScript! y\nRAMA: ${branch}\nRepositorio: ${repo}\nWORKER: ${worker}\nBASE: ${base}`;

    return new Response(mensaje, {
      headers: { "content-type": "text/plain;charset=UTF-8" },
    });
  },
};