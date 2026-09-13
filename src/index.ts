export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  DB_NAME: string;
}

// Variables actualizadas automáticamente por el script update-git-info.js
const branch = "desconocida";
const repo = "google";
const worker = "desconocido";
const base = "no-definida";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      // La base de datos queda disponible mediante env.DB para futuros usos,
      // pero se remueve la consulta automática de prueba para evitar fallos de despliegue.
      
      return new Response(
        `¡Hola desde Cloudflare con TypeScript!\n\n` +
        `RAMA: ${branch}\n` +
        `Repositorio: ${repo}\n` +
        `WORKER: ${env.ENVIRONMENT || worker}\n` +
        `BASE CONFIGURADA: ${env.DB_NAME || base}\n` +
        `ESTADO: Worker ejecutándose correctamente.`
      );
    } catch (e: any) {
      return new Response(`Error en el Worker: ${e.message}`, { status: 500 });
    }
  },
};