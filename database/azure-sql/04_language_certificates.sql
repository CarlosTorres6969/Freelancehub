/* FreelanceHub - Certificados de idioma de freelancers.
   Ejecutar manualmente (Azure Portal Query Editor / SSMS / Azure Data Studio / sqlcmd)
   DESPUES de 01_schema.sql, 02_seed.sql y 03_profile_extensions.sql. */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

IF OBJECT_ID('dbo.language_certificates') IS NULL
BEGIN
    CREATE TABLE dbo.language_certificates (
        id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_language_certificates PRIMARY KEY
            CONSTRAINT DF_language_certificates_id DEFAULT NEWSEQUENTIALID(),
        profile_id UNIQUEIDENTIFIER NOT NULL,
        language NVARCHAR(100) NULL,
        certificate_url NVARCHAR(2048) NOT NULL,
        created_at DATETIME2(3) NOT NULL CONSTRAINT DF_language_certificates_created_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_language_certificates_profile FOREIGN KEY(profile_id) REFERENCES dbo.profiles(id) ON DELETE CASCADE
    );
    CREATE INDEX IX_language_certificates_profile_created ON dbo.language_certificates(profile_id, created_at DESC);
END
GO
