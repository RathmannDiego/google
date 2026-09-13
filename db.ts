export async function obtenerNombreAmbiente(db: D1Database): Promise<string> {
  try {
    // Consulta a la tabla ambiente solicitada
    const { results } = await db.prepare("SELECT nombre_del_ambiente FROM ambiente LIMIT 1").all();
    
    if (results && results.length > 0) {
      return (results[0] as any).nombre_del_ambiente;
    }
    return "Ambiente no configurado en tabla";
  } catch (e: any) {
    return `Error al consultar la BD: ${e.message}`;
  }
}