-- Buckets de Storage
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('services', 'services', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para avatars
CREATE POLICY "avatars_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "avatars_update_own" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Políticas para services
CREATE POLICY "services_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'services');

CREATE POLICY "services_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'services' AND auth.role() = 'authenticated');

-- Permitir SELECT público en orders para stats globales
DROP POLICY IF EXISTS "orders_select_own" ON orders;
CREATE POLICY "orders_select_all" ON orders FOR SELECT USING (true);
