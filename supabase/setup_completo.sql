-- =====================================================
-- FREELANCEHUB - SETUP COMPLETO
-- Ejecuta cada PASO por separado en Supabase SQL Editor
-- =====================================================


-- =====================================================
-- PASO 1: SCHEMA - Tablas, índices, triggers y RLS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'freelancer', 'admin')),
  title TEXT,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0.00,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  completed_projects INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  bio TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  hourly_rate NUMERIC(10,2),
  location TEXT,
  languages TEXT[] NOT NULL DEFAULT '{}',
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  services_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  freelancer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  delivery_time TEXT NOT NULL,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0.00,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  sales INTEGER NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_freelancer ON services(freelancer_id);
CREATE INDEX idx_services_active ON services(active);
CREATE INDEX idx_services_rating ON services(rating DESC);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(service_id, user_id)
);

CREATE INDEX idx_reviews_service ON reviews(service_id);

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_ids UUID[] NOT NULL DEFAULT '{}',
  last_message TEXT,
  last_message_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_participants ON conversations USING GIN(participant_ids);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at ASC);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  price NUMERIC(10,2) NOT NULL,
  service_fee NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_freelancer ON orders(freelancer_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, service_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);

CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"    ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_select_public" ON profiles FOR SELECT USING (role = 'freelancer' OR true);
CREATE POLICY "profiles_update_own"    ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "categories_select_all" ON categories FOR SELECT USING (true);

CREATE POLICY "services_select_all"  ON services FOR SELECT USING (true);
CREATE POLICY "services_insert_own"  ON services FOR INSERT WITH CHECK (auth.uid() = freelancer_id);
CREATE POLICY "services_update_own"  ON services FOR UPDATE USING (auth.uid() = freelancer_id);

CREATE POLICY "reviews_select_all"   ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_auth"  ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "testimonials_select_all" ON testimonials FOR SELECT USING (true);

CREATE POLICY "conversations_select_participant" ON conversations
  FOR SELECT USING (auth.uid() = ANY(participant_ids));
CREATE POLICY "conversations_insert_auth" ON conversations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "conversations_update_participant" ON conversations
  FOR UPDATE USING (auth.uid() = ANY(participant_ids));

CREATE POLICY "messages_select_participant" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND auth.uid() = ANY(conversations.participant_ids)
    )
  );
CREATE POLICY "messages_insert_participant" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
      AND auth.uid() = ANY(conversations.participant_ids)
    )
  );

CREATE POLICY "orders_select_own" ON orders
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = freelancer_id);
CREATE POLICY "orders_insert_auth" ON orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "orders_update_status" ON orders
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = freelancer_id);

CREATE POLICY "favorites_select_own" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON favorites FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "contact_insert_anon" ON contact_messages FOR INSERT WITH CHECK (true);


-- =====================================================
-- PASO 2: NOTIFICACIONES
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('order', 'message', 'review', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message)
  VALUES (NEW.freelancer_id, 'order', 'Nuevo pedido',
    'Has recibido un nuevo pedido por L ' || NEW.total || ' HNL');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_created ON orders;
CREATE TRIGGER on_order_created
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_order();

CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  other_user UUID;
BEGIN
  SELECT unnest(participant_ids) INTO other_user
  FROM conversations
  WHERE id = NEW.conversation_id
    AND unnest(participant_ids) != NEW.sender_id
  LIMIT 1;

  IF other_user IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (other_user, 'message', 'Mensaje nuevo',
      'Tienes un nuevo mensaje en tu bandeja de entrada');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_message_created ON messages;
CREATE TRIGGER on_message_created
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_message();

CREATE OR REPLACE FUNCTION notify_new_review()
RETURNS TRIGGER AS $$
DECLARE
  service_owner UUID;
BEGIN
  SELECT freelancer_id INTO service_owner
  FROM services WHERE id = NEW.service_id;

  INSERT INTO notifications (user_id, type, title, message)
  VALUES (service_owner, 'review', 'Reseña recibida',
    NEW.user_name || ' calificó tu servicio con ' || NEW.rating || ' estrellas');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_created ON reviews;
CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_review();


-- =====================================================
-- PASO 3: STORAGE
-- =====================================================

INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('services', 'services', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatars_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "avatars_update_own" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "services_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'services');

CREATE POLICY "services_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'services' AND auth.role() = 'authenticated');

-- Reemplazar política de orders para permitir lectura pública (stats globales)
DROP POLICY IF EXISTS "orders_select_own" ON orders;
CREATE POLICY "orders_select_all" ON orders FOR SELECT USING (true);


-- =====================================================
-- PASO 4: SEED - Usuarios de prueba
-- password para todos: "password123"
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Usuarios
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_sso_user, is_anonymous)
VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maria.garcia@email.com',  crypt('password123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"María García"}',  NOW(), NOW(), false, false),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d480', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'juan.perez@email.com',     crypt('password123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Juan Pérez"}',    NOW(), NOW(), false, false),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d481', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ana.lopez@email.com',      crypt('password123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Ana López"}',     NOW(), NOW(), false, false),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d482', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pedro.ramirez@email.com',  crypt('password123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Pedro Ramírez"}', NOW(), NOW(), false, false)
ON CONFLICT (id) DO NOTHING;

-- Identities para que signInWithPassword funcione
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '{"sub":"f47ac10b-58cc-4372-a567-0e02b2c3d479","email":"maria.garcia@email.com"}',  'email', 'maria.garcia@email.com',  now(), now(), now()),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d480', '{"sub":"f47ac10b-58cc-4372-a567-0e02b2c3d480","email":"juan.perez@email.com"}',    'email', 'juan.perez@email.com',    now(), now(), now()),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d481', '{"sub":"f47ac10b-58cc-4372-a567-0e02b2c3d481","email":"ana.lopez@email.com"}',     'email', 'ana.lopez@email.com',     now(), now(), now()),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d482', '{"sub":"f47ac10b-58cc-4372-a567-0e02b2c3d482","email":"pedro.ramirez@email.com"}', 'email', 'pedro.ramirez@email.com', now(), now(), now())
ON CONFLICT (provider, provider_id) DO NOTHING;


-- =====================================================
-- PASO 5: SEED - Profiles
-- (inserta primero por si el trigger no los creó)
-- =====================================================

INSERT INTO profiles (id, email, name)
VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'maria.garcia@email.com', 'María García'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d480', 'juan.perez@email.com',   'Juan Pérez'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d481', 'ana.lopez@email.com',    'Ana López'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d482', 'pedro.ramirez@email.com','Pedro Ramírez')
ON CONFLICT (id) DO NOTHING;

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
-- PASO 6: SEED - Categorías
-- =====================================================

INSERT INTO categories (id, name, slug, icon, description, services_count) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Desarrollo Web',        'desarrollo-web',    '🌐', 'Creación de sitios web y aplicaciones web modernas', 0),
  ('00000000-0000-0000-0000-000000000002', 'Diseño Gráfico',        'diseno-grafico',    '🎨', 'Diseño visual, branding y comunicación gráfica', 0),
  ('00000000-0000-0000-0000-000000000003', 'Marketing Digital',     'marketing-digital', '📊', 'Estrategias digitales para hacer crecer tu negocio', 0),
  ('00000000-0000-0000-0000-000000000004', 'Redacción y Traducción','redaccion',         '✍️', 'Contenido de calidad en múltiples idiomas', 0),
  ('00000000-0000-0000-0000-000000000005', 'Video y Animación',     'video-animacion',   '🎬', 'Producción audiovisual y animaciones profesionales', 0),
  ('00000000-0000-0000-0000-000000000006', 'Música y Audio',        'musica-audio',      '🎵', 'Producción musical, edición y diseño de sonido', 0),
  ('00000000-0000-0000-0000-000000000007', 'Programación y Tech',   'programacion-tech', '💻', 'Soluciones tecnológicas a medida', 0),
  ('00000000-0000-0000-0000-000000000008', 'Consultoría',           'consultoria',       '💼', 'Asesoría profesional para tu negocio', 0)
ON CONFLICT (id) DO NOTHING;


-- =====================================================
-- PASO 7: SEED - Servicios
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
    2500.00, '30 días', 4.9, 45, 120,
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
    1800.00, '21 días', 5.0, 32, 78,
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
    800.00, '10 días', 4.8, 28, 95,
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
    1200.00, '15 días', 4.9, 38, 67,
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
    2000.00, '25 días', 4.8, 22, 48,
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
    3000.00, '30 días', 4.7, 18, 35,
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
    1500.00, 'Mensual', 4.8, 42, 89,
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
    900.00, 'Mensual', 4.7, 35, 120,
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
    700.00, '14 días', 4.6, 15, 45,
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
    1200.00, '20 días', 4.9, 25, 56,
    ARRAY['/placeholder.svg'],
    ARRAY['python', 'automatización', 'scripts', 'bots'],
    true
  );


-- =====================================================
-- PASO 8: SEED - Reseñas, contadores y testimonials
-- =====================================================

INSERT INTO reviews (service_id, user_id, user_name, user_avatar, rating, content) VALUES
  ('a1b2c3d4-0000-4000-8000-000000000001', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Pedro Ramírez', 'PR', 5, 'Excelente trabajo. María entendió perfectamente lo que necesitábamos y entregó una aplicación increíble. Muy recomendada.'),
  ('a1b2c3d4-0000-4000-8000-000000000004', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Pedro Ramírez', 'PR', 5, 'El branding superó nuestras expectativas. Juan capturó la esencia de nuestra marca a la perfección.'),
  ('a1b2c3d4-0000-4000-8000-000000000007', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Pedro Ramírez', 'PR', 5, 'Nuestras ventas online aumentaron un 40% en los primeros 3 meses. Ana es una verdadera experta en marketing digital.'),
  ('a1b2c3d4-0000-4000-8000-000000000002', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Pedro Ramírez', 'PR', 5, 'API perfectamente documentada y funcionando. La integración fue pan comido gracias al código limpio y bien estructurado.'),
  ('a1b2c3d4-0000-4000-8000-000000000005', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Pedro Ramírez', 'PR', 5, 'El diseño UI/UX para nuestra app quedó espectacular. Los prototipos interactivos nos ayudaron mucho a visualizar el producto final.'),
  ('a1b2c3d4-0000-4000-8000-000000000008', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Pedro Ramírez', 'PR', 4, 'Muy buena gestión de redes, el contenido es creativo y consistente. Los reportes mensuales son muy útiles.')
ON CONFLICT (service_id, user_id) DO NOTHING;

UPDATE categories SET services_count = (
  SELECT COUNT(*) FROM services WHERE category_id = categories.id
);

INSERT INTO testimonials (id, name, role, avatar, content, rating) VALUES
  ('00000000-0000-0000-0000-000000000101', 'Carlos Mendoza',   'CEO, TechCorp HN',        'CM', 'FreelanceHub me conectó con el talento perfecto para nuestro proyecto. El proceso fue rápido y profesional.', 5),
  ('00000000-0000-0000-0000-000000000102', 'Sofia Rivera',     'Founder, DesignLab',      'SR', 'Como freelancer, esta plataforma me ha dado acceso a clientes increíbles. Los pagos son seguros y puntuales.', 5),
  ('00000000-0000-0000-0000-000000000103', 'Roberto Mejía',    'CTO, InnovaTech',         'RM', 'La calidad de los profesionales en FreelanceHub es excepcional. Encontramos a nuestro desarrollador líder aquí.', 5),
  ('00000000-0000-0000-0000-000000000104', 'Laura Castillo',   'Marketing Director, Corp','LC', 'La herramienta de seguimiento de proyectos facilita mucho la colaboración. Muy recomendada.', 4),
  ('00000000-0000-0000-0000-000000000105', 'Diego Hernández',  'Freelancer Full Stack',   'DH', 'Trabajar desde FreelanceHub me ha permitido crecer profesionalmente y llegar a clientes internacionales.', 5),
  ('00000000-0000-0000-0000-000000000106', 'Valentina Paz',    'CEO, Startup Edu',        'VP', 'La seguridad en los pagos y la atención al cliente son de primer nivel. Una plataforma que inspira confianza.', 5)
ON CONFLICT (id) DO NOTHING;

