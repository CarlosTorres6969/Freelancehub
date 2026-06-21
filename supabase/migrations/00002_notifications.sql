-- Tabla de notificaciones
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

-- Trigger: notificación al crear orden
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

-- Trigger: notificación al crear mensaje
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

-- Trigger: notificación al crear reseña
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
