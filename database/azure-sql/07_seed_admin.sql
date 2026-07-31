/* Cuenta admin demo idempotente para FreelanceHub. No usar estas credenciales en producción.
   Formato del hash: pbkdf2_sha256$iteraciones$sal_base64$hash_base64
   Correo: admin@freelancehub.local — la contraseña se compartió por separado con el equipo. */
SET NOCOUNT ON;
SET XACT_ABORT ON;
BEGIN TRANSACTION;

MERGE dbo.users AS t
USING (VALUES
 (CAST('33248689-D817-4635-A000-6CD1A8BF4F97' AS UNIQUEIDENTIFIER), N'admin@freelancehub.local', N'pbkdf2_sha256$210000$q8+qgSe7AFePbCZDcftbiQ==$4HUnVPMixH40kvEwvzbVY8oJgl6gv4y9lyvJSixu84Y=')
) AS s(id,email,password_hash) ON t.id=s.id
WHEN MATCHED THEN UPDATE SET email=s.email, password_hash=s.password_hash,
    disabled=0, email_verified=1, updated_at=SYSUTCDATETIME()
WHEN NOT MATCHED THEN INSERT(id,email,password_hash,disabled,email_verified)
    VALUES(s.id,s.email,s.password_hash,0,1);

MERGE dbo.profiles AS t
USING (VALUES
 ('33248689-D817-4635-A000-6CD1A8BF4F97',N'admin','admin')
) s(id,name,role)
ON t.id=CAST(s.id AS UNIQUEIDENTIFIER)
WHEN MATCHED THEN UPDATE SET role=s.role, updated_at=SYSUTCDATETIME()
WHEN NOT MATCHED THEN INSERT(id,name,role) VALUES(CAST(s.id AS UNIQUEIDENTIFIER),s.name,s.role);

COMMIT TRANSACTION;
