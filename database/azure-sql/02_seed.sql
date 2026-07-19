/* Datos demo idempotentes para FreelanceHub. No usar estas credenciales en producción.
   Formato del hash: pbkdf2_sha256$iteraciones$sal_base64$hash_base64 */
SET NOCOUNT ON;
SET XACT_ABORT ON;
BEGIN TRANSACTION;

MERGE dbo.users AS t
USING (VALUES
 (CAST('f47ac10b-58cc-4372-a567-0e02b2c3d479' AS UNIQUEIDENTIFIER), N'maria.garcia@email.com', N'pbkdf2_sha256$210000$tzOgL4wkr97eiF8Y53FM/Q==$X6tL/NOxf3bCrSATYW2w5Q+U5LJ6qokOQYOxcTUMpIM='),
 (CAST('f47ac10b-58cc-4372-a567-0e02b2c3d480' AS UNIQUEIDENTIFIER), N'juan.perez@email.com', N'pbkdf2_sha256$210000$HjMmisF6hY2msjeLaD+FaA==$7XyzAeQlArUQxagNbfuNEsPi5y9LndUr1+9qUQIO2zs='),
 (CAST('f47ac10b-58cc-4372-a567-0e02b2c3d481' AS UNIQUEIDENTIFIER), N'ana.lopez@email.com', N'pbkdf2_sha256$210000$V/7bTdXO7U0lp9Q/g9Qt4w==$ptRuRhikC3c8Lylinj+azIT6+MRsDlmN88W3RtIKs8Y='),
 (CAST('f47ac10b-58cc-4372-a567-0e02b2c3d482' AS UNIQUEIDENTIFIER), N'pedro.ramirez@email.com', N'pbkdf2_sha256$210000$RWYvleuT0phZIQK1QibgDQ==$x79AuOeKa2eIPYDtA8AJHPEv9zJpRxPMmmyjA65eB6o=')
) AS s(id,email,password_hash) ON t.id=s.id
WHEN MATCHED THEN UPDATE SET email=s.email, password_hash=s.password_hash,
    disabled=0, email_verified=1, updated_at=SYSUTCDATETIME()
WHEN NOT MATCHED THEN INSERT(id,email,password_hash,disabled,email_verified)
    VALUES(s.id,s.email,s.password_hash,0,1);

MERGE dbo.profiles AS t
USING (VALUES
 ('f47ac10b-58cc-4372-a567-0e02b2c3d479',N'María García','freelancer',N'Desarrolladora Full Stack',N'Especialista en React, Node.js y arquitectura cloud. Más de 8 años creando aplicaciones web escalables.',N'Apasionada por la tecnología y la enseñanza.',45.00,N'Tegucigalpa, Honduras',4.90,127,84,1),
 ('f47ac10b-58cc-4372-a567-0e02b2c3d480',N'Juan Pérez','freelancer',N'Diseñador UI/UX & Branding',N'Diseño interfaces modernas y memorables.',N'Creativo con pasión por el diseño minimalista y funcional.',38.00,N'San Pedro Sula, Honduras',4.80,93,61,1),
 ('f47ac10b-58cc-4372-a567-0e02b2c3d481',N'Ana López','freelancer',N'Marketing Digital & SEO',N'Estrategias basadas en datos para hacer crecer tu negocio online.',N'Máster en Marketing Digital.',35.00,N'San José, Costa Rica',4.70,156,102,1),
 ('f47ac10b-58cc-4372-a567-0e02b2c3d482',N'Pedro Ramírez','client',N'Emprendedor',N'Buscando talento para mi startup de tecnología educativa.',N'Fundador de EduTech HN.',NULL,N'Tegucigalpa, Honduras',0,0,0,0)
) s(id,name,role,title,description,bio,hourly_rate,location,rating,reviews_count,completed_projects,verified)
ON t.id=CAST(s.id AS UNIQUEIDENTIFIER)
WHEN NOT MATCHED THEN INSERT(id,name,role,title,description,bio,hourly_rate,location,rating,reviews_count,completed_projects,verified)
VALUES(CAST(s.id AS UNIQUEIDENTIFIER),s.name,s.role,s.title,s.description,s.bio,s.hourly_rate,s.location,s.rating,s.reviews_count,s.completed_projects,s.verified);

INSERT dbo.profile_skills(profile_id,skill)
SELECT CAST(v.id AS UNIQUEIDENTIFIER),v.skill FROM (VALUES
 ('f47ac10b-58cc-4372-a567-0e02b2c3d479',N'React'),('f47ac10b-58cc-4372-a567-0e02b2c3d479',N'Node.js'),('f47ac10b-58cc-4372-a567-0e02b2c3d479',N'TypeScript'),
 ('f47ac10b-58cc-4372-a567-0e02b2c3d480',N'Figma'),('f47ac10b-58cc-4372-a567-0e02b2c3d480',N'UI/UX'),
 ('f47ac10b-58cc-4372-a567-0e02b2c3d481',N'SEO'),('f47ac10b-58cc-4372-a567-0e02b2c3d481',N'Google Ads')
) v(id,skill)
WHERE NOT EXISTS(SELECT 1 FROM dbo.profile_skills x WHERE x.profile_id=CAST(v.id AS UNIQUEIDENTIFIER) AND x.skill=v.skill);

INSERT dbo.profile_languages(profile_id,language)
SELECT CAST(v.id AS UNIQUEIDENTIFIER),v.language FROM (VALUES
 ('f47ac10b-58cc-4372-a567-0e02b2c3d479',N'Español'),('f47ac10b-58cc-4372-a567-0e02b2c3d479',N'Inglés'),
 ('f47ac10b-58cc-4372-a567-0e02b2c3d480',N'Español'),('f47ac10b-58cc-4372-a567-0e02b2c3d480',N'Inglés'),
 ('f47ac10b-58cc-4372-a567-0e02b2c3d481',N'Español'),('f47ac10b-58cc-4372-a567-0e02b2c3d481',N'Inglés'),
 ('f47ac10b-58cc-4372-a567-0e02b2c3d482',N'Español')
) v(id,language)
WHERE NOT EXISTS(SELECT 1 FROM dbo.profile_languages x WHERE x.profile_id=CAST(v.id AS UNIQUEIDENTIFIER) AND x.language=v.language);

MERGE dbo.categories t USING (VALUES
 ('00000000-0000-0000-0000-000000000001',N'Desarrollo Web','desarrollo-web',N'🌐',N'Creación de sitios web y aplicaciones web modernas'),
 ('00000000-0000-0000-0000-000000000002',N'Diseño Gráfico','diseno-grafico',N'🎨',N'Diseño visual, branding y comunicación gráfica'),
 ('00000000-0000-0000-0000-000000000003',N'Marketing Digital','marketing-digital',N'📊',N'Estrategias digitales para hacer crecer tu negocio'),
 ('00000000-0000-0000-0000-000000000004',N'Redacción y Traducción','redaccion',N'✍️',N'Contenido de calidad en múltiples idiomas'),
 ('00000000-0000-0000-0000-000000000005',N'Video y Animación','video-animacion',N'🎬',N'Producción audiovisual y animaciones profesionales'),
 ('00000000-0000-0000-0000-000000000006',N'Música y Audio','musica-audio',N'🎵',N'Producción musical, edición y diseño de sonido'),
 ('00000000-0000-0000-0000-000000000007',N'Programación y Tech','programacion-tech',N'💻',N'Soluciones tecnológicas a medida'),
 ('00000000-0000-0000-0000-000000000008',N'Consultoría','consultoria',N'💼',N'Asesoría profesional para tu negocio')
) s(id,name,slug,icon,description) ON t.id=CAST(s.id AS UNIQUEIDENTIFIER)
WHEN NOT MATCHED THEN INSERT(id,name,slug,icon,description) VALUES(CAST(s.id AS UNIQUEIDENTIFIER),s.name,s.slug,s.icon,s.description);

MERGE dbo.services t USING (VALUES
 ('a1b2c3d4-0000-4000-8000-000000000001',N'Desarrollo de App Web con React y Node.js',N'App web completa con autenticación, panel administrativo y API REST.',N'Creación completa de una aplicación web moderna con frontend, backend, base de datos, despliegue y soporte.','00000000-0000-0000-0000-000000000001','f47ac10b-58cc-4372-a567-0e02b2c3d479',2500.00,N'30 días',4.90,45,120),
 ('a1b2c3d4-0000-4000-8000-000000000002',N'API RESTful con Node.js y TypeScript',N'API escalable y documentada con TypeScript y SQL Server.',N'API profesional con autenticación, documentación OpenAPI, pruebas, Docker y CI/CD.','00000000-0000-0000-0000-000000000007','f47ac10b-58cc-4372-a567-0e02b2c3d479',1800.00,N'21 días',5.00,32,78),
 ('a1b2c3d4-0000-4000-8000-000000000003',N'Landing Page Moderna con Next.js',N'Landing page optimizada para conversión, SEO y dispositivos móviles.',N'Landing page profesional con Next.js, diseño responsivo, animaciones, formulario y analítica.','00000000-0000-0000-0000-000000000001','f47ac10b-58cc-4372-a567-0e02b2c3d479',800.00,N'10 días',4.80,28,95),
 ('a1b2c3d4-0000-4000-8000-000000000004',N'Diseño de Marca Completo',N'Identidad visual, logo, colores, tipografías y guía de marca.',N'Paquete de branding con investigación, propuestas, papelería y archivos fuente.','00000000-0000-0000-0000-000000000002','f47ac10b-58cc-4372-a567-0e02b2c3d480',1200.00,N'15 días',4.90,38,67),
 ('a1b2c3d4-0000-4000-8000-000000000005',N'Diseño UI/UX para App Móvil',N'Diseño de interfaz y experiencia para aplicaciones iOS y Android.',N'Research, wireframes, prototipos, design system y pruebas de usabilidad en Figma.','00000000-0000-0000-0000-000000000002','f47ac10b-58cc-4372-a567-0e02b2c3d480',2000.00,N'25 días',4.80,22,48),
 ('a1b2c3d4-0000-4000-8000-000000000006',N'Rediseño de Sitio Web Corporativo',N'Transformación completa de un sitio corporativo.',N'Auditoría, estrategia, nuevo diseño, implementación responsive y migración de contenido.','00000000-0000-0000-0000-000000000002','f47ac10b-58cc-4372-a567-0e02b2c3d480',3000.00,N'30 días',4.70,18,35),
 ('a1b2c3d4-0000-4000-8000-000000000007',N'Estrategia de Marketing Digital 360',N'Plan de SEO, publicidad, redes sociales y email marketing.',N'Estrategia integral con auditoría, campañas, contenido, reportes y optimización.','00000000-0000-0000-0000-000000000003','f47ac10b-58cc-4372-a567-0e02b2c3d481',1500.00,N'Mensual',4.80,42,89),
 ('a1b2c3d4-0000-4000-8000-000000000008',N'Gestión de Redes Sociales',N'Creación y gestión de contenido con estrategia personalizada.',N'Calendario editorial, contenido, copywriting, programación y reportes mensuales.','00000000-0000-0000-0000-000000000003','f47ac10b-58cc-4372-a567-0e02b2c3d481',900.00,N'Mensual',4.70,35,120),
 ('a1b2c3d4-0000-4000-8000-000000000009',N'Consultoría SEO Técnico',N'Análisis y optimización técnica para buscadores.',N'Auditoría técnica, rendimiento, datos estructurados y corrección de errores de rastreo.','00000000-0000-0000-0000-000000000003','f47ac10b-58cc-4372-a567-0e02b2c3d481',700.00,N'14 días',4.60,15,45),
 ('a1b2c3d4-0000-4000-8000-000000000010',N'Automatización de Procesos con Python',N'Scripts y bots para automatizar tareas repetitivas.',N'Automatización de reportes, integraciones, archivos y procesos empresariales.','00000000-0000-0000-0000-000000000007','f47ac10b-58cc-4372-a567-0e02b2c3d479',1200.00,N'20 días',4.90,25,56)
) s(id,title,description,long_description,category_id,freelancer_id,price,delivery_time,rating,reviews_count,sales)
ON t.id=CAST(s.id AS UNIQUEIDENTIFIER)
WHEN NOT MATCHED THEN INSERT(id,title,description,long_description,category_id,freelancer_id,price,delivery_time,rating,reviews_count,sales)
VALUES(CAST(s.id AS UNIQUEIDENTIFIER),s.title,s.description,s.long_description,CAST(s.category_id AS UNIQUEIDENTIFIER),CAST(s.freelancer_id AS UNIQUEIDENTIFIER),s.price,s.delivery_time,s.rating,s.reviews_count,s.sales);

INSERT dbo.service_images(service_id,image_url,sort_order)
SELECT s.id,N'/placeholder.svg',0 FROM dbo.services s
WHERE NOT EXISTS(SELECT 1 FROM dbo.service_images i WHERE i.service_id=s.id AND i.image_url=N'/placeholder.svg');

MERGE dbo.[orders] t USING (VALUES
 ('b1b2c3d4-0000-4000-8000-000000000001','a1b2c3d4-0000-4000-8000-000000000001','f47ac10b-58cc-4372-a567-0e02b2c3d482','f47ac10b-58cc-4372-a567-0e02b2c3d479',N'Necesitamos una aplicación para administrar cursos.',2500.00,125.00,2625.00),
 ('b1b2c3d4-0000-4000-8000-000000000002','a1b2c3d4-0000-4000-8000-000000000004','f47ac10b-58cc-4372-a567-0e02b2c3d482','f47ac10b-58cc-4372-a567-0e02b2c3d480',N'Identidad visual para una empresa educativa.',1200.00,60.00,1260.00),
 ('b1b2c3d4-0000-4000-8000-000000000003','a1b2c3d4-0000-4000-8000-000000000007','f47ac10b-58cc-4372-a567-0e02b2c3d482','f47ac10b-58cc-4372-a567-0e02b2c3d481',N'Estrategia para el lanzamiento de una plataforma.',1500.00,75.00,1575.00)
) s(id,service_id,buyer_id,freelancer_id,requirements,price,service_fee,total)
ON t.id=CAST(s.id AS UNIQUEIDENTIFIER)
WHEN NOT MATCHED THEN INSERT(id,service_id,buyer_id,freelancer_id,status,price,service_fee,total,requirements,delivery_note,delivered_at)
VALUES(CAST(s.id AS UNIQUEIDENTIFIER),CAST(s.service_id AS UNIQUEIDENTIFIER),CAST(s.buyer_id AS UNIQUEIDENTIFIER),CAST(s.freelancer_id AS UNIQUEIDENTIFIER),'completed',s.price,s.service_fee,s.total,s.requirements,N'Entrega demo aprobada.',SYSUTCDATETIME());

MERGE dbo.reviews t USING (VALUES
 ('c1b2c3d4-0000-4000-8000-000000000001','b1b2c3d4-0000-4000-8000-000000000001','a1b2c3d4-0000-4000-8000-000000000001',5,N'Excelente trabajo. La aplicación superó nuestras expectativas.'),
 ('c1b2c3d4-0000-4000-8000-000000000002','b1b2c3d4-0000-4000-8000-000000000002','a1b2c3d4-0000-4000-8000-000000000004',5,N'El branding capturó perfectamente la esencia de nuestra marca.'),
 ('c1b2c3d4-0000-4000-8000-000000000003','b1b2c3d4-0000-4000-8000-000000000003','a1b2c3d4-0000-4000-8000-000000000007',5,N'La estrategia produjo resultados medibles desde el primer mes.')
) s(id,order_id,service_id,rating,content) ON t.id=CAST(s.id AS UNIQUEIDENTIFIER)
WHEN NOT MATCHED THEN INSERT(id,order_id,service_id,user_id,rating,content)
VALUES(CAST(s.id AS UNIQUEIDENTIFIER),CAST(s.order_id AS UNIQUEIDENTIFIER),CAST(s.service_id AS UNIQUEIDENTIFIER),CAST('f47ac10b-58cc-4372-a567-0e02b2c3d482' AS UNIQUEIDENTIFIER),s.rating,s.content);

MERGE dbo.testimonials t USING (VALUES
 ('00000000-0000-0000-0000-000000000101',N'Carlos Mendoza',N'CEO, TechCorp HN',N'CM',N'FreelanceHub me conectó con el talento perfecto para nuestro proyecto.',5),
 ('00000000-0000-0000-0000-000000000102',N'Sofía Rivera',N'Founder, DesignLab',N'SR',N'Como freelancer, esta plataforma me ha dado acceso a clientes increíbles.',5),
 ('00000000-0000-0000-0000-000000000103',N'Roberto Mejía',N'CTO, InnovaTech',N'RM',N'La calidad de los profesionales en FreelanceHub es excepcional.',5)
) s(id,name,role,avatar,content,rating) ON t.id=CAST(s.id AS UNIQUEIDENTIFIER)
WHEN NOT MATCHED THEN INSERT(id,name,role,avatar,content,rating) VALUES(CAST(s.id AS UNIQUEIDENTIFIER),s.name,s.role,s.avatar,s.content,s.rating);

MERGE dbo.platform_settings t
USING (VALUES('commission_rate',N'0.05',N'Tasa de comisión de la plataforma: 0.05 = 5%')) s([key],value,description)
ON t.[key]=s.[key]
WHEN NOT MATCHED THEN INSERT([key],value,description) VALUES(s.[key],s.value,s.description);

UPDATE c SET services_count=x.total
FROM dbo.categories c
CROSS APPLY(SELECT COUNT(*) total FROM dbo.services s WHERE s.category_id=c.id AND s.active=1)x;

COMMIT TRANSACTION;
GO
