-- =====================================================
-- FREELANCEHUB - Datos Demo Completos
-- Pega esto en el SQL Editor de Supabase (Dashboard → SQL Editor)
-- =====================================================

-- Extensión para bcrypt
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- 1. USUARIOS DE PRUEBA (auth.users)
-- password para todos: "password123"
-- =====================================================
DO $$
DECLARE
  freelancer1_id UUID := 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  freelancer2_id UUID := 'f47ac10b-58cc-4372-a567-0e02b2c3d480';
  freelancer3_id UUID := 'f47ac10b-58cc-4372-a567-0e02b2c3d481';
  client1_id UUID    := 'f47ac10b-58cc-4372-a567-0e02b2c3d482';
BEGIN
  -- Solo insertar si no existen
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = freelancer1_id) THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_sso_user, is_anonymous)
    VALUES
      (freelancer1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maria.garcia@email.com',  crypt('password123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"María García"}',  NOW(), NOW(), false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = freelancer2_id) THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_sso_user, is_anonymous)
    VALUES
      (freelancer2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'juan.perez@email.com',   crypt('password123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Juan Pérez"}',   NOW(), NOW(), false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = freelancer3_id) THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_sso_user, is_anonymous)
    VALUES
      (freelancer3_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ana.lopez@email.com',    crypt('password123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Ana López"}',    NOW(), NOW(), false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = client1_id) THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_sso_user, is_anonymous)
    VALUES
      (client1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pedro.ramirez@email.com',  crypt('password123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Pedro Ramírez"}', NOW(), NOW(), false, false);
  END IF;

  -- Add identities records so signInWithPassword works
  IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = freelancer1_id AND provider = 'email') THEN
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), freelancer1_id, jsonb_build_object('sub', freelancer1_id, 'email', 'maria.garcia@email.com'), 'email', 'maria.garcia@email.com', now(), now(), now());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = freelancer2_id AND provider = 'email') THEN
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), freelancer2_id, jsonb_build_object('sub', freelancer2_id, 'email', 'juan.perez@email.com'), 'email', 'juan.perez@email.com', now(), now(), now());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = freelancer3_id AND provider = 'email') THEN
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), freelancer3_id, jsonb_build_object('sub', freelancer3_id, 'email', 'ana.lopez@email.com'), 'email', 'ana.lopez@email.com', now(), now(), now());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = client1_id AND provider = 'email') THEN
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), client1_id, jsonb_build_object('sub', client1_id, 'email', 'pedro.ramirez@email.com'), 'email', 'pedro.ramirez@email.com', now(), now(), now());
  END IF;
END $$;

-- =====================================================
-- 2. ACTUALIZAR PROFILES (creados por el trigger)
-- =====================================================
UPDATE profiles SET
  role = 'freelancer',
  title = 'Desarrolladora Full Stack',
  description = 'Especialista en React, Node.js y arquitectura cloud. Más de 8 años creando aplicaciones web escalables.',
  bio = 'Apasionada por la tecnología y la enseñanza. He trabajado con startups y empresas Fortune 500.',
  skills = ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
  hourly_rate = 45.00,
  location = 'Tegucigalpa, Honduras',
  languages = ARRAY['Español', 'Inglés'],
  rating = 4.9,
  reviews_count = 127,
  completed_projects = 84,
  verified = true
WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

UPDATE profiles SET
  role = 'freelancer',
  title = 'Diseñador UI/UX & Branding',
  description = 'Diseño interfaces modernas y memorables. Experto en Figma, Adobe Creative Suite y diseño de marca.',
  bio = 'Creativo con pasión por el diseño minimalista y funcional. Premio Latin American Design Awards 2024.',
  skills = ARRAY['Figma', 'Adobe XD', 'Illustrator', 'Photoshop', 'UI/UX'],
  hourly_rate = 38.00,
  location = 'San Pedro Sula, Honduras',
  languages = ARRAY['Español', 'Inglés', 'Portugués'],
  rating = 4.8,
  reviews_count = 93,
  completed_projects = 61,
  verified = true
WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d480';

UPDATE profiles SET
  role = 'freelancer',
  title = 'Marketing Digital & SEO',
  description = 'Estrategias basadas en datos para hacer crecer tu negocio online. Experta en Google Ads, SEO y redes sociales.',
  bio = 'Máster en Marketing Digital. He ayudado a más de 50 marcas a aumentar su presencia online significativamente.',
  skills = ARRAY['SEO', 'Google Ads', 'Content Marketing', 'Analytics', 'Social Media'],
  hourly_rate = 35.00,
  location = 'San José, Costa Rica',
  languages = ARRAY['Español', 'Inglés'],
  rating = 4.7,
  reviews_count = 156,
  completed_projects = 102,
  verified = true
WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d481';

UPDATE profiles SET
  role = 'client',
  title = 'Emprendedor',
  description = 'Buscando talento para mi startup de tecnología educativa.',
  bio = 'Fundador de EduTech HN.',
  skills = ARRAY['Gestión de proyectos', 'Productividad'],
  location = 'Tegucigalpa, Honduras',
  languages = ARRAY['Español', 'Inglés'],
  verified = false
WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d482';

-- =====================================================
-- 3. CATEGORIAS (solo si no existen)
-- =====================================================
INSERT INTO categories (id, name, slug, icon, description, services_count) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Desarrollo Web',     'desarrollo-web',     '🌐', 'Creación de sitios web y aplicaciones web modernas', 0),
  ('00000000-0000-0000-0000-000000000002', 'Diseño Gráfico',     'diseno-grafico',     '🎨', 'Diseño visual, branding y comunicación gráfica', 0),
  ('00000000-0000-0000-0000-000000000003', 'Marketing Digital',  'marketing-digital',  '📊', 'Estrategias digitales para hacer crecer tu negocio', 0),
  ('00000000-0000-0000-0000-000000000004', 'Redacción y Traducción', 'redaccion',       '✍️', 'Contenido de calidad en múltiples idiomas', 0),
  ('00000000-0000-0000-0000-000000000005', 'Video y Animación',  'video-animacion',    '🎬', 'Producción audiovisual y animaciones profesionales', 0),
  ('00000000-0000-0000-0000-000000000006', 'Música y Audio',     'musica-audio',       '🎵', 'Producción musical, edición y diseño de sonido', 0),
  ('00000000-0000-0000-0000-000000000007', 'Programación y Tech','programacion-tech',  '💻', 'Soluciones tecnológicas a medida', 0),
  ('00000000-0000-0000-0000-000000000008', 'Consultoría',        'consultoria',        '💼', 'Asesoría profesional para tu negocio', 0)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 4. SERVICIOS
-- =====================================================
INSERT INTO services (id, title, description, long_description, category_id, freelancer_id, price, delivery_time, rating, reviews_count, sales, images, tags, active) VALUES
  (
    'a1b2c3d4-0000-4000-8000-000000000001',
    'Desarrollo de App Web con React y Node.js',
    'App web completa con React, Node.js, PostgreSQL. Incluye autenticación, panel admin, API REST y despliegue.',
    'Creación completa de aplicación web moderna usando React 19 para el frontend, Node.js con Express para el backend, y PostgreSQL como base de datos. Incluye:
- Sistema de autenticación con JWT
- Panel de administración
- API REST documentada
- Despliegue en Vercel/Railway
- 1 mes de soporte post-entrega
- Código fuente completo con git',
    '00000000-0000-0000-0000-000000000001',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    2500.00,
    '30 días',
    4.9, 45, 120,
    ARRAY['/placeholder.svg'],
    ARRAY['react', 'node.js', 'full-stack', 'web-app'],
    true
  ),
  (
    'a1b2c3d4-0000-4000-8000-000000000002',
    'API RESTful con Node.js y TypeScript',
    'API escalable y bien documentada con Node.js, TypeScript, PostgreSQL y despliegue cloud.',
    'API REST profesional construida con Node.js, TypeScript y Express. Incluye:
- TypeScript estricto
- Base de datos PostgreSQL con Prisma ORM
- Autenticación JWT + refresh tokens
- Documentación Swagger/OpenAPI
- Tests unitarios y de integración
- Docker compose para desarrollo local
- CI/CD con GitHub Actions',
    '00000000-0000-0000-0000-000000000007',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    1800.00,
    '21 días',
    5.0, 32, 78,
    ARRAY['/placeholder.svg'],
    ARRAY['node.js', 'typescript', 'api', 'backend'],
    true
  ),
  (
    'a1b2c3d4-0000-4000-8000-000000000003',
    'Landing Page Moderna con Next.js',
    'Landing page optimizada para conversión con Next.js, animaciones y diseño responsivo.',
    'Landing page profesional construida con Next.js 16 y Tailwind CSS. Incluye:
- Diseño responsivo mobile-first
- Animaciones con Framer Motion
- Optimización SEO
- Formulario de contacto
- Analytics integrado
- Despliegue en Vercel',
    '00000000-0000-0000-0000-000000000001',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    800.00,
    '10 días',
    4.8, 28, 95,
    ARRAY['/placeholder.svg'],
    ARRAY['next.js', 'landing-page', 'react', 'tailwind'],
    true
  ),
  (
    'a1b2c3d4-0000-4000-8000-000000000004',
    'Diseño de Marca Completo (Branding)',
    'Identidad visual completa: logo, paleta de colores, tipografía, tarjetas y guía de marca.',
    'Paquete completo de branding que incluye:
- Investigación de marca y competencia
- 3 propuestas de logo a color
- Paleta de colores principal y secundaria
- Selección tipográfica
- Tarjetas de presentación digitales
- Papelería corporativa básica
- Guía de marca PDF
- Archivos fuente (Illustrator, Figma)',
    '00000000-0000-0000-0000-000000000002',
    'f47ac10b-58cc-4372-a567-0e02b2c3d480',
    1200.00,
    '15 días',
    4.9, 38, 67,
    ARRAY['/placeholder.svg'],
    ARRAY['branding', 'logo', 'identidad-visual', 'diseño'],
    true
  ),
  (
    'a1b2c3d4-0000-4000-8000-000000000005',
    'Diseño UI/UX para App Móvil',
    'Diseño de interfaz y experiencia de usuario para aplicación móvil (iOS/Android).',
    'Diseño completo de UI/UX para aplicación móvil que incluye:
- Research y análisis de usuarios
- Arquitectura de información
- Wireframes y prototipos interactivos
- Diseño visual completo en Figma
- Design system con componentes reutilizables
- Animaciones y micro-interacciones
- Pruebas de usabilidad',
    '00000000-0000-0000-0000-000000000002',
    'f47ac10b-58cc-4372-a567-0e02b2c3d480',
    2000.00,
    '25 días',
    4.8, 22, 48,
    ARRAY['/placeholder.svg'],
    ARRAY['ui/ux', 'app-móvil', 'figma', 'prototipo'],
    true
  ),
  (
    'a1b2c3d4-0000-4000-8000-000000000006',
    'Rediseño de Sitio Web Corporativo',
    'Transformación completa de sitio web corporativo con diseño moderno y funcional.',
    'Rediseño completo que incluye:
- Auditoría del sitio actual
- Estrategia de contenido
- Nuevo diseño visual
- Implementación responsive
- Optimización de rendimiento
- Migración de contenido
- Formularios y CTAs optimizados',
    '00000000-0000-0000-0000-000000000002',
    'f47ac10b-58cc-4372-a567-0e02b2c3d480',
    3000.00,
    '30 días',
    4.7, 18, 35,
    ARRAY['/placeholder.svg'],
    ARRAY['rediseño', 'web', 'corporativo', 'ui'],
    true
  ),
  (
    'a1b2c3d4-0000-4000-8000-000000000007',
    'Estrategia de Marketing Digital 360',
    'Plan completo de marketing digital: SEO, Google Ads, redes sociales y email marketing.',
    'Estrategia integral de marketing digital que cubre:
- Auditoría de presencia digital actual
- Investigación de palabras clave
- Optimización SEO on-page y off-page
- Campañas de Google Ads
- Estrategia de contenido para redes sociales
- Email marketing automatizado
- Reportes mensuales con métricas
- Optimización continua basada en datos',
    '00000000-0000-0000-0000-000000000003',
    'f47ac10b-58cc-4372-a567-0e02b2c3d481',
    1500.00,
    'Mensual',
    4.8, 42, 89,
    ARRAY['/placeholder.svg'],
    ARRAY['marketing-digital', 'seo', 'google-ads', 'redes-sociales'],
    true
  ),
  (
    'a1b2c3d4-0000-4000-8000-000000000008',
    'Gestión de Redes Sociales',
    'Creación y gestión de contenido para redes sociales con estrategia personalizada.',
    'Servicio completo de gestión de redes sociales:
- Análisis de audiencia y competencia
- Calendario editorial mensual
- Creación de contenido visual
- Copywriting profesional
- Programación de publicaciones
- Interacción con la comunidad
- Reportes mensuales de rendimiento
- Optimización de campañas',
    '00000000-0000-0000-0000-000000000003',
    'f47ac10b-58cc-4372-a567-0e02b2c3d481',
    900.00,
    'Mensual',
    4.7, 35, 120,
    ARRAY['/placeholder.svg'],
    ARRAY['redes-sociales', 'contenido', 'community-manager'],
    true
  ),
  (
    'a1b2c3d4-0000-4000-8000-000000000009',
    'Consultoría SEO Técnico',
    'Análisis profundo y optimización técnica para mejorar el posicionamiento en buscadores.',
    'Consultoría SEO técnica avanzada:
- Auditoría técnica completa
- Análisis de Core Web Vitals
- Optimización de velocidad de carga
- Estructura de datos estructurados
- Sitemap y robots.txt optimizados
- Corrección de errores de rastreo
- Implementación de mejoras
- Reporte detallado con recomendaciones',
    '00000000-0000-0000-0000-000000000003',
    'f47ac10b-58cc-4372-a567-0e02b2c3d481',
    700.00,
    '14 días',
    4.6, 15, 45,
    ARRAY['/placeholder.svg'],
    ARRAY['seo', 'consultoría', 'posicionamiento', 'técnico'],
    true
  ),
  (
    'a1b2c3d4-0000-4000-8000-000000000010',
    'Automatización de Procesos con Python',
    'Scripts y bots para automatizar tareas repetitivas y optimizar flujos de trabajo.',
    'Automatización de procesos empresariales usando Python:
- Análisis de procesos actuales
- Diseño de solución de automatización
- Scripts para scraping de datos
- Automatización de reportes
- Integración con APIs
- Procesamiento de archivos
- Documentación y capacitación',
    '00000000-0000-0000-0000-000000000007',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    1200.00,
    '20 días',
    4.9, 25, 56,
    ARRAY['/placeholder.svg'],
    ARRAY['python', 'automatización', 'scripts', 'bots'],
    true
  );

-- =====================================================
-- 5. RESEÑAS
-- =====================================================
INSERT INTO reviews (service_id, user_id, user_name, user_avatar, rating, content) VALUES
  ('a1b2c3d4-0000-4000-8000-000000000001', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Pedro Ramírez', 'PR', 5, 'Excelente trabajo. María entendió perfectamente lo que necesitábamos y entregó una aplicación increíble. Muy recomendada.'),
  ('a1b2c3d4-0000-4000-8000-000000000004', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Pedro Ramírez', 'PR', 5, 'El branding superó nuestras expectativas. Juan capturó la esencia de nuestra marca a la perfección.'),
  ('a1b2c3d4-0000-4000-8000-000000000007', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Pedro Ramírez', 'PR', 5, 'Nuestras ventas online aumentaron un 40% en los primeros 3 meses. Ana es una verdadera experta en marketing digital.'),
  ('a1b2c3d4-0000-4000-8000-000000000002', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Pedro Ramírez', 'PR', 5, 'API perfectamente documentada y funcionando. La integración fue pan comido gracias al código limpio y bien estructurado.'),
  ('a1b2c3d4-0000-4000-8000-000000000005', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Pedro Ramírez', 'PR', 5, 'El diseño UI/UX para nuestra app quedó espectacular. Los prototipos interactivos nos ayudaron mucho a visualizar el producto final.'),
  ('a1b2c3d4-0000-4000-8000-000000000008', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Pedro Ramírez', 'PR', 4, 'Muy buena gestión de redes, el contenido es creativo y consistente. Los reportes mensuales son muy útiles.')
ON CONFLICT (service_id, user_id) DO NOTHING;

-- =====================================================
-- 6. ACTUALIZAR CATEGORIAS CON CONTADORES
-- =====================================================
UPDATE categories SET services_count = (
  SELECT COUNT(*) FROM services WHERE category_id = categories.id
);

-- =====================================================
-- 7. TESTIMONIALS (si no existen ya)
-- =====================================================
INSERT INTO testimonials (id, name, role, avatar, content, rating) VALUES
  ('00000000-0000-0000-0000-000000000101', 'Carlos Mendoza',    'CEO, TechCorp HN',        'CM', 'FreelanceHub me conectó con el talento perfecto para nuestro proyecto. El proceso fue rápido y profesional.', 5),
  ('00000000-0000-0000-0000-000000000102', 'Sofia Rivera',     'Founder, DesignLab',       'SR', 'Como freelancer, esta plataforma me ha dado acceso a clientes increíbles. Los pagos son seguros y puntuales.', 5),
  ('00000000-0000-0000-0000-000000000103', 'Roberto Mejía',    'CTO, InnovaTech',          'RM', 'La calidad de los profesionales en FreelanceHub es excepcional. Encontramos a nuestro desarrollador líder aquí.', 5),
  ('00000000-0000-0000-0000-000000000104', 'Laura Castillo',   'Marketing Director, Corp', 'LC', 'La herramienta de seguimiento de proyectos facilita mucho la colaboración. Muy recomendada.', 4),
  ('00000000-0000-0000-0000-000000000105', 'Diego Hernández',  'Freelancer Full Stack',    'DH', 'Trabajar desde FreelanceHub me ha permitido crecer profesionalmente y llegar a clientes internacionales.', 5),
  ('00000000-0000-0000-0000-000000000106', 'Valentina Paz',    'CEO, Startup Edu',         'VP', 'La seguridad en los pagos y la atención al cliente son de primer nivel. Una plataforma que inspira confianza.', 5)
ON CONFLICT (id) DO NOTHING;
