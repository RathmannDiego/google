import { obtenerNombreAmbiente } from './db';

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  DB_NAME: string;
}

// Variables actualizadas automáticamente por el script de git
let branch = "desconocida";
const repo = "RetwetLavoro GitHub (google)";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    let nombreAmbienteResultado = "";

    // Si el usuario hace clic en el botón (envío del formulario o acción POST)
    if (request.method === "POST" || url.searchParams.get("consultar") === "true") {
      const ambienteBD = await obtenerNombreAmbiente(env.DB);
      nombreAmbienteResultado = `
        <div style="margin-top: 20px; padding: 15px; background: #eef2f7; border-left: 4px solid #0070f3;">
          <p style="font-size: 18px; margin: 0;">Base: <strong>${ambienteBD}</strong></p>
        </div>
      `;
    }

    return new Response(`
      <html>
        <head><meta charset="UTF-8"><title>Consulta de Ambiente</title></head>
        <body style="font-family: Arial, sans-serif; padding: 40px; background: #f9f9f9;">
          <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2>Panel de Control Cloudflare Worker DEV</h2>
            <p style="color: #666;">Repositorio: <strong>${repo}</strong> | Rama: <strong>${branch}</strong></p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            
            <form method="POST" action="/">
              <button type="submit" style="background: #0070f3; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 4px; cursor: pointer;">
                Consultar Ambiente
              </button>
            </form>

            ${nombreAmbienteResultado}
          </div>
        </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html;charset=UTF-8" }
    });
  },
};