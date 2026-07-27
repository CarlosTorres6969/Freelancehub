const fs = require("fs");
const path = require("path");
const sql = require("mssql");

function loadEnv(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnv(path.join(__dirname, ".env"));

const config = {
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

async function main() {
  console.log(`Conectando a ${config.server}/${config.database} como ${config.user}...`);
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT @@VERSION AS version, GETDATE() AS fecha");
    console.log("Conexion exitosa.");
    console.log(result.recordset[0]);
    await pool.close();
    process.exit(0);
  } catch (err) {
    console.error("Fallo la conexion:", err.message);
    process.exit(1);
  }
}

main();
