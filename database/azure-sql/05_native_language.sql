/* FreelanceHub - Idioma nativo del freelancer.
   Ejecutar manualmente (Azure Portal Query Editor / SSMS / Azure Data Studio / sqlcmd)
   DESPUES de 01_schema.sql, 02_seed.sql, 03_profile_extensions.sql y 04_language_certificates.sql. */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

IF COL_LENGTH('dbo.profiles', 'native_language') IS NULL
    ALTER TABLE dbo.profiles ADD native_language NVARCHAR(100) NULL;
GO
