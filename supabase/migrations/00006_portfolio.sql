-- Tabla de portafolio para freelancers
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  freelancer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_freelancer ON portfolio_items(freelancer_id, created_at DESC);

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "portfolio_select_all" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "portfolio_insert_own" ON portfolio_items FOR INSERT WITH CHECK (auth.uid() = freelancer_id);
CREATE POLICY "portfolio_delete_own" ON portfolio_items FOR DELETE USING (auth.uid() = freelancer_id);
