export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      // Prueba rápida para verificar que la base de datos responde
      const { results } = await env.DB.prepare("SELECT 1 as test").all();
      
      const rama = env.DB ? "Conectado" : "Desconocida";
      
      return new Response(
        `¡Hola desde Cloudflare con TypeScript!\n\n` +
        `RAMA: ${rama}\n` +
        `Repositorio: google\n` +
        `WORKER: dev\n` +
        `BASE: ${results ? "Activa (google-db-dev)" : "Sin conexión"}`
      );
    } catch (e: any) {
      return new Response(`Error al conectar con la base de datos: ${e.message}`, { status: 500 });
    }
  },
};