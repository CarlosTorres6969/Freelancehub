-- =====================================================
-- FREELANCEHUB - Datos iniciales (seed)
-- =====================================================

-- CATEGORIES
INSERT INTO categories (id, name, slug, icon, description, services_count) VALUES
  ('c1', 'Desarrollo Web', 'desarrollo-web', '🌐', 'Sitios web, aplicaciones web, landing pages y plataformas personalizadas.', 0),
  ('c2', 'Diseño Gráfico', 'diseno-grafico', '🎨', 'Logotipos, branding, diseños para redes sociales y material impreso.', 0),
  ('c3', 'Marketing Digital', 'marketing-digital', '📊', 'SEO, redes sociales, email marketing y publicidad digital.', 0),
  ('c4', 'Redacción y Traducción', 'redaccion-traduccion', '✍️', 'Copywriting, traducción profesional, corrección de estilo y contenido.', 0),
  ('c5', 'Video y Animación', 'video-animacion', '🎬', 'Edición de video, animación 2D/3D, motion graphics y producción.', 0),
  ('c6', 'Música y Audio', 'musica-audio', '🎵', 'Producción musical, mezcla, masterización y diseño sonoro.', 0),
  ('c7', 'Programación y Tech', 'programacion-tech', '💻', 'APIs, automatización, ciencia de datos y consultoría tecnológica.', 0),
  ('c8', 'Negocios', 'negocios', '💼', 'Consultoría empresarial, planes de negocio y asesoría financiera.', 0);

-- TESTIMONIALS
INSERT INTO testimonials (id, name, role, avatar, content, rating) VALUES
  ('t1', 'Ricardo Paz', 'Founder, TechStart HN', 'RP', 'FreelanceHub me permitió encontrar al desarrollador perfecto para mi startup. El proceso fue rápido y la calidad del trabajo excepcional.', 5),
  ('t2', 'Sofía Rivera', 'CMO, Grupo Nova', 'SR', 'Los profesionales de marketing en FreelanceHub transformaron nuestra estrategia digital. Resultados visibles desde el primer mes.', 5),
  ('t3', 'Mario Andrade', 'CEO, BuildCorp', 'MA', 'Como contratista de proyectos de construcción, necesitaba diseños 3D de calidad. Encontré talento increíble aquí.', 4),
  ('t4', 'Gabriela Torres', 'Directora de Marketing, EcoShop', 'GT', 'La calidad de los freelancers en FreelanceHub es impresionante. Contratamos a una diseñadora gráfica para nuestro branding y el resultado superó todas las expectativas.', 5),
  ('t5', 'Fernando Castillo', 'CTO, FinTech CR', 'FC', 'Necesitábamos una API compleja para nuestro producto financiero. El desarrollador que encontramos aquí no solo cumplió los requisitos, sino que sugirió mejoras.', 5),
  ('t6', 'Andrea Mejía', 'Fundadora, Agencia Crea+', 'AM', 'Como agencia, usamos FreelanceHub para escalar nuestro equipo según la demanda. Es una herramienta indispensable para nuestro crecimiento.', 4);
