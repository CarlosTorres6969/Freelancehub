# Base de datos de FreelanceHub en Azure SQL

Ejecuta los scripts en este orden sobre una base de datos vacía:

1. `01_schema.sql`
2. `02_seed.sql`

Puedes ejecutarlos desde Azure Portal Query Editor, SQL Server Management Studio,
Azure Data Studio o `sqlcmd`. Ambos scripts están diseñados para Azure SQL Database.

## Decisiones de migración

- Los UUID de PostgreSQL pasan a `UNIQUEIDENTIFIER`.
- `TIMESTAMPTZ` pasa a `DATETIME2(3)` y todos los valores se guardan en UTC.
- Los arreglos se normalizan en `profile_skills`, `profile_languages`,
  `service_images`, `service_tags` y `conversation_participants`.
- Se elimina la dependencia de `auth.users`; `dbo.users` almacena la identidad base.
- Los archivos no se guardan en SQL: `image_url` debe apuntar a Azure Blob Storage.
- Las reseñas ahora requieren una orden mediante `reviews.order_id`.
- Las vistas públicas evitan exponer email y datos de autenticación.

## Autenticación

Los usuarios demo están habilitados y sus hashes usan PBKDF2-SHA256 con 210,000
iteraciones, sal individual y codificación Base64. El backend debe validar el formato
`pbkdf2_sha256$iteraciones$sal$hash`. Para producción es preferible Microsoft Entra
External ID, Auth.js o Argon2id y las claves demo deben sustituirse.

| Usuario | Contraseña demo |
| --- | --- |
| `maria.garcia@email.com` | `MariaFH#2026` |
| `juan.perez@email.com` | `JuanFH#2026` |
| `ana.lopez@email.com` | `AnaFH#2026` |
| `pedro.ramirez@email.com` | `PedroFH#2026` |

## Seguridad importante

Azure SQL no conoce automáticamente al usuario web de Next.js. La autorización por
usuario debe verificarse en la API antes de cada consulta y mutación. La aplicación
debe conectarse con un usuario miembro del rol `freelancehub_app`, nunca como `dbo`.
Para operaciones críticas conviene añadir procedimientos almacenados y conceder
solo `EXECUTE`, retirando después los permisos directos de escritura.

## Trabajo que aún requiere la aplicación

Estos scripts crean la base, pero el código actual todavía usa el SDK de Supabase.
Hay que reemplazar autenticación, consultas, Realtime y Storage. Para Next.js se
puede usar `mssql` o Prisma con el proveedor `sqlserver`, y Azure Blob Storage para
avatares e imágenes.
