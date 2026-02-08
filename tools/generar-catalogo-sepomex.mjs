import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";

const ROOT = process.cwd();
const inputXlsx = path.join(ROOT, "tools", "sepomex.xlsx");
const outputJson = path.join(ROOT, "src", "assets", "mx-catalogo.json");

if (!fs.existsSync(inputXlsx)) {
  console.error("❌ No se encontró tools/sepomex.xlsx");
  process.exit(1);
}

const wb = xlsx.readFile(inputXlsx);

const municipiosPorEstado = {};
const ciudadesPorEstadoMunicipio = {};

const norm = (v) =>
  String(v ?? "")
    .trim()
    .replace(/\s+/g, " ");

let total = 0;
let usadas = 0;

for (const sheetName of wb.SheetNames) {
  const ws = wb.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(ws, { defval: "" });

  console.log(`📄 Procesando hoja: ${sheetName} (${rows.length} filas)`);

  for (const r of rows) {
    total++;

    const estado = norm(r["d_estado"]);
    const municipio = norm(r["D_mnpio"]);

    // ciudad a veces viene vacía → fallback a colonia
    let ciudad = norm(r["d_ciudad"]);
    if (!ciudad) ciudad = norm(r["d_asenta"]) || "Sin ciudad";

    if (!estado || !municipio) continue;

    usadas++;

    // Estado → Municipios
    municipiosPorEstado[estado] ??= new Set();
    municipiosPorEstado[estado].add(municipio);

    // Estado → Municipio → Ciudades
    ciudadesPorEstadoMunicipio[estado] ??= {};
    ciudadesPorEstadoMunicipio[estado][municipio] ??= new Set();
    ciudadesPorEstadoMunicipio[estado][municipio].add(ciudad);
  }
}

console.log(`📊 Filas totales leídas: ${total}`);
console.log(`✅ Filas válidas usadas: ${usadas}`);

const out = {
  municipiosPorEstado: {},
  ciudadesPorEstadoMunicipio: {},
};

// Convertir Set → Array ordenado
for (const estado of Object.keys(municipiosPorEstado).sort()) {
  out.municipiosPorEstado[estado] =
    [...municipiosPorEstado[estado]].sort((a, b) => a.localeCompare(b, "es"));
}

for (const estado of Object.keys(ciudadesPorEstadoMunicipio).sort()) {
  out.ciudadesPorEstadoMunicipio[estado] = {};
  for (const mun of Object.keys(ciudadesPorEstadoMunicipio[estado]).sort((a, b) =>
    a.localeCompare(b, "es")
  )) {
    out.ciudadesPorEstadoMunicipio[estado][mun] =
      [...ciudadesPorEstadoMunicipio[estado][mun]].sort((a, b) =>
        a.localeCompare(b, "es")
      );
  }
}

// Guardar archivo
fs.mkdirSync(path.dirname(outputJson), { recursive: true });
fs.writeFileSync(outputJson, JSON.stringify(out, null, 2), "utf8");

console.log("🎉 CATÁLOGO GENERADO CORRECTAMENTE");
console.log("📍 Estados:", Object.keys(out.municipiosPorEstado).length);
console.log("📍 Archivo:", outputJson);
