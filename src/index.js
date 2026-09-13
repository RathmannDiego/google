// Variables que actualizará el script de Node.js
const branch = "dev";
const repo = "google-qr";
const worker = "google";
const base = "google-db-dev";
export default {
    async fetch(request, env, ctx) {
        try {
            const { results } = await env.DB.prepare("SELECT 1 as test").all();
            const estadoDb = results ? "Activa y Conectada" : "Sin respuesta";
            return new Response(`¡Hola desde Cloudflare con TypeScript!\n\n` +
                `RAMA: ${branch}\n` +
                `Repositorio: ${repo}\n` +
                `WORKER: ${env.ENVIRONMENT || worker}\n` +
                `BASE: ${env.DB_NAME || base} - [${estadoDb}]`);
        }
        catch (e) {
            return new Response(`Error al conectar con la base de datos: ${e.message}`, { status: 500 });
        }
    },
};
