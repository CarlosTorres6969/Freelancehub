/* FreelanceHub - Ediciones de resena y respuesta del freelancer.
   Ejecutar manualmente (Azure Portal Query Editor / SSMS / Azure Data Studio / sqlcmd)
   DESPUES de 01_schema.sql hasta 05_native_language.sql. */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

IF COL_LENGTH('dbo.reviews', 'updated_at') IS NULL
    ALTER TABLE dbo.reviews ADD updated_at DATETIME2(3) NULL;
GO

IF COL_LENGTH('dbo.reviews', 'freelancer_reply') IS NULL
    ALTER TABLE dbo.reviews ADD freelancer_reply NVARCHAR(2000) NULL;
GO

IF COL_LENGTH('dbo.reviews', 'freelancer_reply_at') IS NULL
    ALTER TABLE dbo.reviews ADD freelancer_reply_at DATETIME2(3) NULL;
GO
