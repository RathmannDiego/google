export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  DB_NAME: string;
}

// Variables que actualizará el script de Node.js
const branch = "desconocida";
const repo = "google";
const worker = "desconocido";
const base = "no-definida";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const { results } = await env.DB.prepare("SELECT 1 as test").all();
      const estadoDb = results ? "Activa y Conectada" : "Sin respuesta";
      
      return new Response(
        `¡Hola desde Cloudflare con TypeScript!\n\n` +
        `RAMA: ${branch}\n` +
        `Repositorio: ${repo}\n` +
        `WORKER: ${env.ENVIRONMENT || worker}\n` +
        `BASE: ${env.DB_NAME || base} - [${estadoDb}]`
      );
    } catch (e: any) {
      return new Response(`Error al conectar con la base de datos: ${e.message}`, { status: 500 });
    }
  },
};