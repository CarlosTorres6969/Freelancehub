-- =====================================================
-- ADMIN: Configuración de plataforma
-- =====================================================

CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Valor inicial de comisión: 5%
INSERT INTO platform_settings (key, value, description)
VALUES ('commission_rate', '0.05', 'Tasa de comisión de la plataforma (ej: 0.05 = 5%)')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden leer y modificar settings
CREATE POLICY "settings_select_admin" ON platform_settings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "settings_update_admin" ON platform_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins pueden leer todos los profiles
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT USING (
    auth.uid() = id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins pueden actualizar cualquier profile
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE USING (
    auth.uid() = id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins pueden leer todos los servicios (ya hay select público, pero por claridad)
-- Admins pueden desactivar servicios
CREATE POLICY "services_update_admin" ON services
  FOR UPDATE USING (
    auth.uid() = freelancer_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins pueden leer todas las órdenes
CREATE POLICY "orders_select_admin" ON orders
  FOR SELECT USING (
    auth.uid() = buyer_id
    OR auth.uid() = freelancer_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
