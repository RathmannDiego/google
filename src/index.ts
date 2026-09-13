export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  DB_NAME: string;
}

// Variables inyectadas automáticamente por update-git-info.js
let branch = "unknown";
const repo = "google";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    let dbStatus = "Desconocido";
    let dbResult: any = null;
    let errorMessage = "";

    // Comprobación de la base de datos D1
    try {
      if (env.DB) {
        // Ejecutamos una consulta de prueba (por ejemplo, obtener la hora actual de la base o una simple selección)
        const queryResult = await env.DB.prepare("SELECT datetime('now') as current_time").first();
        dbStatus = "Conectado y Operativo 🟢";
        dbResult = queryResult;
      } else {
        dbStatus = "No se encontró el binding de la Base de Datos 🔴";
      }
    } catch (error: any) {
      dbStatus = "Error en la comprobación de la Base de Datos 🔴";
      errorMessage = error.message || String(error);
    }

    // Estructuramos la leyenda con toda la información solicitada
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Cloudflare Worker Status - ${env.ENVIRONMENT || 'DEV'}</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f4f6f9; color: #333; padding: 40px; }
          .container { max-width: 700px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          h1 { color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
          .section { margin-top: 20px; }
          .label { font-weight: bold; color: #475569; }
          .value { background: #f8fafc; padding: 8px 12px; border-radius: 4px; border: 1px solid #e2e8f0; margin-top: 5px; font-family: monospace; }
          .status-ok { color: #16a34a; font-weight: bold; }
          .status-error { color: #dc2626; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Cloudflare Worker Dashboard</h1>
          
          <div class="section">
            <div class="label">Repositorio:</div>
            <div class="value">${repo}</div>
          </div>

          <div class="section">
            <div class="label">Rama Git:</div>
            <div class="value">${branch}</div>
          </div>

          <div class="section">
            <div class="label">Entorno (ENVIRONMENT):</div>
            <div class="value">${env.ENVIRONMENT || 'No definido'}</div>
          </div>

          <div class="section">
            <div class="label">Base de Datos (DB_NAME):</div>
            <div class="value">${env.DB_NAME || 'No definido'}</div>
          </div>

          <div class="section">
            <div class="label">Estado de la Comprobación de Base de Datos:</div>
            <div class="value">
              <span class="${env.DB ? 'status-ok' : 'status-error'}">${dbStatus}</span>
              ${dbResult ? `<br>Resultado D1: ${JSON.stringify(dbResult)}` : ''}
              ${errorMessage ? `<br><span style="color:red;">Error: ${errorMessage}</span>` : ''}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return new Response(htmlContent, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};