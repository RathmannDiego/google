export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/login" && request.method === "POST") {
      try {
        const { nombre, password } = await request.json() as { nombre?: string; password?: string };

        const userQuery = await env.DB.prepare(
          "SELECT * FROM usuarios WHERE nombre = ?"
        ).bind(nombre).first();

        if (!userQuery) {
          return Response.json({ success: false, message: "El usuario no existe." }, { status: 401 });
        }

        if (userQuery.password !== password) {
          return Response.json({ success: false, message: "Contraseña incorrecta." }, { status: 401 });
        }

        const qrVirgenes = await env.DB.prepare(
          "SELECT * FROM qr_virgen WHERE id_usuario = ?"
        ).bind(userQuery.id).all();

        const qrsActivos = await env.DB.prepare(
          "SELECT * FROM qrs WHERE id_usuario = ? AND valido = 1"
        ).bind(userQuery.id).all();

        return Response.json({
          success: true,
          user: userQuery,
          qrVirgenes: qrVirgenes.results,
          qrsActivos: qrsActivos.results
        });

      } catch (err: any) {
        return Response.json({ success: false, error: err.message }, { status: 500 });
      }
    }

    const html = `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Login y Gestión QR</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f4f9; padding: 20px; }
            .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 600px; margin: auto; }
            input, button { width: 100%; padding: 10px; margin: 8px 0; box-sizing: border-box; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 14px; }
            th { background-color: #007bff; color: white; }
            .hidden { display: none; }
            .error { color: red; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="card">
            <div id="login-section">
                <h2>Iniciar Sesión</h2>
                <input type="text" id="nombre" placeholder="Usuario">
                <input type="password" id="password" placeholder="Contraseña">
                <button onclick="login()">Ingresar</button>
                <p id="error-msg" class="error"></p>
            </div>

            <div id="dashboard-section" class="hidden">
                <h2>Bienvenido, <span id="user-title"></span></h2>
                
                <h3>Mis QR Vírgenes / Estado</h3>
                <table>
                    <thead><tr><th>ID</th><th>QR</th><th>Vendido</th><th>Fecha</th></tr></thead>
                    <tbody id="tabla-virgenes"></tbody>
                </table>

                <h3>Mis QR Activos (Modificar Place ID)</h3>
                <table>
                    <thead><tr><th>ID</th><th>QR_Virgen</th><th>Place ID</th><th>Nombre Lugar</th><th>Acción</th></tr></thead>
                    <tbody id="tabla-activos"></tbody>
                </table>
            </div>
        </div>

        <script>
            async function login() {
                const nombre = document.getElementById('nombre').value;
                const password = document.getElementById('password').value;
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, password })
                });
                const data = await res.json();
                if(!data.success) {
                    document.getElementById('error-msg').innerText = data.message;
                    return;
                }
                
                document.getElementById('login-section').classList.add('hidden');
                document.getElementById('dashboard-section').classList.remove('hidden');
                document.getElementById('user-title').innerText = data.user.nombre;

                let htmlVirgenes = '';
                data.qrVirgenes.forEach(q => {
                    htmlVirgenes += \`<tr><td>\${q.id}</td><td>\${q.id}</td><td>\${q.vendido ? 'Sí' : 'No'}</td><td>\${q.fecha || ''}</td></tr>\`;
                });
                document.getElementById('tabla-virgenes').innerHTML = htmlVirgenes;

                let htmlActivos = '';
                data.qrsActivos.forEach(q => {
                    htmlActivos += \`<tr>
                        <td>\${q.id}</td>
                        <td>\${q.QR_Virgen}</td>
                        <td><input type="text" value="\${q.Place_id || ''}" id="place-\${q.id}"></td>
                        <td><input type="text" value="\${q.nombre_lugar || ''}" id="name-\${q.id}"></td>
                        <td><button onclick="guardarQR(\${q.id})">Guardar</button></td>
                    </tr>\`;
                });
                document.getElementById('tabla-activos').innerHTML = htmlActivos;
            }

            function guardarQR(id) {
                alert('Implementar lógica de guardado para el ID: ' + id);
            }
        </script>
    </body>
    </html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html;charset=UTF-8" }
    });
  },
};