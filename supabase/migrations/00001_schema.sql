-- =====================================================
-- FREELANCEHUB - Esquema Completo de Base de Datos
-- =====================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES (extiende auth.users)
-- =====================================================
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

-- Trigger: crear profile automáticamente al registrarse
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

-- =====================================================
-- 2. CATEGORIES
-- =====================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  services_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 3. SERVICES
-- =====================================================
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

-- =====================================================
-- 4. REVIEWS
-- =====================================================
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

-- =====================================================
-- 5. TESTIMONIALS
-- =====================================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 6. CONVERSATIONS
-- =====================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_ids UUID[] NOT NULL DEFAULT '{}',
  last_message TEXT,
  last_message_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_participants ON conversations USING GIN(participant_ids);

-- =====================================================
-- 7. MESSAGES
-- =====================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at ASC);

-- =====================================================
-- 8. ORDERS
-- =====================================================
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

-- =====================================================
-- 9. FAVORITES
-- =====================================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, service_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);

-- =====================================================
-- 10. CONTACT MESSAGES
-- =====================================================
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
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

-- Profiles: cada quien ve/edita su propio perfil
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_select_public" ON profiles FOR SELECT USING (role = 'freelancer' OR true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Categories: lectura pública
CREATE POLICY "categories_select_all" ON categories FOR SELECT USING (true);

-- Services: lectura pública, solo freelancer crea/edita propios
CREATE POLICY "services_select_all" ON services FOR SELECT USING (true);
CREATE POLICY "services_insert_own" ON services FOR INSERT WITH CHECK (auth.uid() = freelancer_id);
CREATE POLICY "services_update_own" ON services FOR UPDATE USING (auth.uid() = freelancer_id);

-- Reviews: lectura pública, inserción solo autenticado
CREATE POLICY "reviews_select_all" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_auth" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Testimonials: lectura pública
CREATE POLICY "testimonials_select_all" ON testimonials FOR SELECT USING (true);

-- Conversations: solo participantes
CREATE POLICY "conversations_select_participant" ON conversations
  FOR SELECT USING (auth.uid() = ANY(participant_ids));
CREATE POLICY "conversations_insert_auth" ON conversations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "conversations_update_participant" ON conversations
  FOR UPDATE USING (auth.uid() = ANY(participant_ids));

-- Messages: solo participantes de la conversación
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

-- Orders: comprador y freelancer ven sus órdenes
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = freelancer_id);
CREATE POLICY "orders_insert_auth" ON orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "orders_update_status" ON orders
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = freelancer_id);

-- Favorites: solo el usuario dueño
CREATE POLICY "favorites_select_own" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Contact messages: solo insert público (admin lee aparte)
CREATE POLICY "contact_insert_anon" ON contact_messages FOR INSERT WITH CHECK (true);
