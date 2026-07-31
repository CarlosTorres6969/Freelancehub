/* FreelanceHub - Extension de perfil: departamento/municipio (Honduras)
   y comprobante de titulo profesional.
   Ejecutar manualmente (Azure Portal Query Editor / SSMS / Azure Data Studio / sqlcmd)
   DESPUES de 01_schema.sql y 02_seed.sql, contra la base de datos ya existente. */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

IF COL_LENGTH('dbo.profiles', 'department') IS NULL
    ALTER TABLE dbo.profiles ADD department NVARCHAR(100) NULL;
GO

IF COL_LENGTH('dbo.profiles', 'municipality') IS NULL
    ALTER TABLE dbo.profiles ADD municipality NVARCHAR(100) NULL;
GO

IF COL_LENGTH('dbo.profiles', 'title_document_url') IS NULL
    ALTER TABLE dbo.profiles ADD title_document_url NVARCHAR(2048) NULL;
GO
