export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  DB_NAME: string; 
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      // Consulta de prueba a la base de datos del entorno actual
      const { results } = await env.DB.prepare("SELECT 1 as test").all();
      const estadoDb = results ? "Activa y Conectada" : "Sin respuesta";
      
      return new Response(
        `¡Hola desde Cloudflare con TypeScript!\n\n` +
        `RAMA: (Gestionada en servidor)\n` +
        `Repositorio: google\n` +
        `WORKER: ${env.ENVIRONMENT || 'desconocido'}\n` +
        `BASE: ${env.DB_NAME || 'no-definida'} - [${estadoDb}]`
      );
    } catch (e: any) {
      return new Response(`Error al conectar con la base de datos: ${e.message}`, { status: 500 });
    }
  },
};