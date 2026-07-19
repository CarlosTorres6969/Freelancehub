import "server-only"
import sql from "mssql"

const config: sql.config = {
  server: process.env.AZURE_SQL_SERVER!,
  database: process.env.AZURE_SQL_DATABASE!,
  user: process.env.AZURE_SQL_USER!,
  password: process.env.AZURE_SQL_PASSWORD!,
  options: { encrypt: true, trustServerCertificate: false },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
  connectionTimeout: 15000,
  requestTimeout: 30000,
}

declare global { var azureSqlPool: Promise<sql.ConnectionPool> | undefined }

export function getPool() {
  if (!process.env.AZURE_SQL_SERVER || !process.env.AZURE_SQL_DATABASE ||
      !process.env.AZURE_SQL_USER || !process.env.AZURE_SQL_PASSWORD) {
    throw new Error("Faltan variables de Azure SQL")
  }
  global.azureSqlPool ??= new sql.ConnectionPool(config).connect()
  return global.azureSqlPool
}

export { sql }
