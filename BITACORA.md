# Bitácora de Iteración con IA — FreelanceHub

**Curso:** Industria del Software
**Estudiante:** [Nombre del estudiante]
**Herramienta principal:** opencode (DeepSeek v4) + Next.js 16 + Tailwind CSS v4
**Plataforma:** FreelanceHub — Marketplace de servicios freelance centroamericano

---

## Índice de iteraciones

| Iteración | Descripción | Estado |
|-----------|-------------|--------|
| 1 | Inicialización del proyecto Next.js | ✅ |
| 2 | Creación de datos mock iniciales | ✅ |
| 3 | Landing Page (Hero, Features, Categorías, Testimonios) | ✅ |
| 4 | Marketplace con búsqueda y filtros básicos | ✅ |
| 5 | Página de detalle de servicio con SSG | ✅ |
| 6 | Dashboard con estadísticas y órdenes | ✅ |
| 7 | Chatbot flotante con respuestas predefinidas | ✅ |
| 8 | **Expansión masiva de datos** (10 freelancers, 26 servicios, reseñas) | ✅ |
| 9 | **Página de categoría** con SSG y listado de servicios | ✅ |
| 10 | **Perfil de freelancer** con bio, skills y servicios | ✅ |
| 11 | **Página "Cómo funciona"** con pasos, beneficios y planes | ✅ |
| 12 | **Modal de Login/Registro** con diseño profesional | ✅ |
| 13 | **Sección de reseñas** en detalle de servicio | ✅ |
| 14 | **Filtros avanzados** (rango precio, calificación mínima) | ✅ |
| 15 | **Página de checkout** simulado con 3 pasos | ✅ |
| 16 | **Mejoras en landing page** (stats, FAQ, newsletter, CTA) | ✅ |

---

## Iteración 1: Inicialización del proyecto

### Prompt utilizado
```
Crea un proyecto Next.js con TypeScript, Tailwind CSS, App Router y estructura src/
```

### Resultado
Proyecto `freelancehub` creado con Next.js 16.2.9, Tailwind CSS v4, TypeScript, App Router, estructura `src/`, alias `@/*`.

### Problemas encontrados
- Next.js 16 tiene breaking changes vs versiones anteriores: `params` y `searchParams` ahora son Promesas.
- El comando `create-next-app` dejó advertencias de limpieza de paquetes (EPERM en Windows por permisos).

### Aprendizaje
Se identificó que en Next.js 16 se debe usar `async/await` para acceder a `params` en layouts y pages.

---

## Iteración 2: Creación de datos mock

### Prompt utilizado
```
Crea archivos de datos mock para una plataforma freelance: servicios, freelancers, categorías y testimonios. Datos en español, enfocados en Centroamérica.
```

### Archivos generados
- `src/data/categories.ts` — 8 categorías con iconos y conteo
- `src/data/freelancers.ts` — 6 freelancers con perfil completo
- `src/data/services.ts` — 12 servicios con descripciones detalladas
- `src/data/testimonials.ts` — 3 testimonios de clientes

### Cambios solicitados
Se pidió incluir helpers como `getServiceById()` y `getFreelancerForService()` para facilitar las consultas desde las páginas.

### Problemas encontrados
- Ninguno significativo.

---

## Iteración 3: Landing Page

### Prompt utilizado
```
Crea una landing page para FreelanceHub con Hero, sección de características, categorías y testimonios. Diseño moderno con gradientes oscuros.
```

### Componentes creados
- `Navbar.tsx` — Barra de navegación responsive con menú móvil
- `Footer.tsx` — Footer completo con enlaces y redes sociales
- `Hero.tsx` — Hero section con gradiente, stats y CTAs
- `Features.tsx` — Grid de 4 características principales
- `Categories.tsx` — Grid de categorías con enlace al marketplace
- `Testimonials.tsx` — Tarjetas de testimonios con estrellas

### Cambios solicitados
Se solicitó añadir animaciones sutiles (pulse en badge de "talento centroamericano") y mejor responsive.

### Problemas encontrados
- Tailwind v4 usa sintaxis diferente para `@theme`, `@import "tailwindcss"` en lugar de `@tailwind`. Se investigó la documentación local para confirmar la sintaxis correcta.

---

## Iteración 4: Marketplace con búsqueda y filtros

### Prompt utilizado
```
Crea la página de Marketplace con búsqueda en tiempo real, filtro por categoría y ordenamiento por precio/rating/ventas. Usar componentes "use client".
```

### Componentes creados/actualizados
- `app/marketplace/page.tsx` — Página de marketplace con filtros
- `components/ServiceCard.tsx` — Tarjeta de servicio reutilizable

### Funcionalidades
- Búsqueda por texto en título, descripción y tags
- Filtro por categoría (dropdown)
- Ordenamiento: precio (asc/desc), calificación, más vendidos
- Estado vacío cuando no hay resultados
- Diseño responsive (1/2/3 columnas)

### Cambios solicitados
Se solicitó que los filtros usen `useMemo` para buen rendimiento en lugar de recalcular en cada render.

### Problemas encontrados
- Al ser página cliente, no se puede usar `generateStaticParams`. Se dejó como CSR.

---

## Iteración 5: Página de detalle de servicio

### Prompt utilizado
```
Crea la página de detalle de servicio /services/[id] con información completa del servicio y freelancer, sidebar de contratación, y generateStaticParams para SSG.
```

### Componentes creados/actualizados
- `app/services/[id]/page.tsx` — Página dinámica con SSG

### Funcionalidades
- Generación estática de todas las páginas de servicio
- Breadcrumb de navegación
- Información detallada del servicio y freelancer
- Sidebar sticky con precio, tiempo de entrega y botones de acción
- Tags del servicio

### Cambios solicitados
Se corrigió el uso de `params` como Promise (requerido en Next.js 16).

### Problemas encontrados
- Next.js 16 requiere `params: Promise<{id: string}>` con `await`. Sin esto, TypeScript daba error de tipo.

---

## Iteración 6: Dashboard

### Prompt utilizado
```
Crea la página de Dashboard con cards de estadísticas, tabla de órdenes recientes, y sección de servicios publicados. Diseño con tabs.
```

### Componentes creados/actualizados
- `app/dashboard/page.tsx` — Dashboard completo con tabs

### Funcionalidades
- 4 cards de estadísticas (ganancias, completados, activos, freelancers)
- 3 tabs: Resumen (gráfico de barras por categoría), Órdenes (tabla), Mis Servicios (grid)
- Tabla de órdenes con estados coloreados
- Scroll horizontal en tabla responsive

### Cambios solicitados
Se añadió el tab "Resumen" con barras de progreso visuales por categoría.

### Problemas encontrados
- En pantallas pequeñas, la tabla de órdenes necesitaba overflow-x. Se solucionó con `overflow-x-auto`.

---

## Iteración 7: Chatbot flotante

### Prompt utilizado
```
Crea un chatbot flotante en la esquina inferior derecha con respuestas predefinidas sobre la plataforma. Diseño moderno con animación.
```

### Componentes creados/actualizados
- `components/Chatbot.tsx` — Chatbot integrado en el layout global

### Funcionalidades
- Botón flotante para abrir/cerrar
- Ventana de chat con historial y scroll automático
- Respuestas predefinidas según palabras clave (hola, servicios, freelancer, pago, etc.)
- Fallback con respuesta genérica
- Diseño responsive (full-width en mobile, 384px en desktop)

### Cambios solicitados
Se añadió soporte para Enter como envío de mensaje y se mejoró el diseño del header.

### Problemas encontrados
- El chatbot se renderiza en el layout, visible en todas las páginas. Asegurar que no interfiera con el contenido fue clave.

---

## Iteración 8: Expansión masiva de datos

### Prompt utilizado
```
Expande los datos mock: agrega más freelancers con biografías detalladas, más servicios con descripciones largas, y un archivo de reseñas separado. Datos realistas enfocados en Centroamérica.
```

### Archivos actualizados/creados
- `src/data/freelancers.ts` — De 6 a 10 freelancers con bio, skills, idiomas y verificación
- `src/data/services.ts` — De 12 a 26 servicios con descripciones extendidas
- `src/data/reviews.ts` — Nuevo: 20 reseñas detalladas para los servicios
- `src/data/testimonials.ts` — De 3 a 6 testimonios
- `src/data/categories.ts` — Descripciones añadidas a cada categoría

### Cambios solicitados
Se añadió helper `getFreelancerById()` y `getReviewsByService()`.

---

## Iteración 9: Página de categoría

### Prompt utilizado
```
Crea la página /categories/[slug] que muestre todos los servicios de una categoría, con SSG e información de la categoría.
```

### Componentes creados
- `app/categories/[slug]/page.tsx` — Página SSG por categoría

### Funcionalidades
- Generación estática para las 8 categorías
- Encabezado con icono, nombre y descripción
- Grid de servicios usando ServiceCard
- Breadcrumb de navegación
- Manejo de categoría no encontrada (404)

---

## Iteración 10: Perfil de freelancer

### Prompt utilizado
```
Crea la página /freelancers/[id] con perfil completo del freelancer incluyendo bio, skills, estadísticas y sus servicios publicados.
```

### Componentes creados
- `app/freelancers/[id]/page.tsx` — Perfil con SSG

### Funcionalidades
- Avatar, nombre, título y ubicación
- Badge de verificación
- Estadísticas: calificación, reseñas, proyectos
- Biografía extendida
- Skills con tags visuales
- Información adicional (tarifa por hora, ubicación, idiomas)
- Grid de servicios del freelancer

---

## Iteración 11: Página "Cómo funciona"

### Prompt utilizado
```
Crea una página informativa /how-it-works con pasos, beneficios, planes de precios y CTA final. Diseño completo con secciones.
```

### Componentes creados
- `app/how-it-works/page.tsx` — Página completa con múltiples secciones

### Secciones
- **Header** con gradiente oscuro
- **4 pasos** para usar la plataforma (Explorar, Contactar, Contratar, Recibir)
- **6 beneficios** con iconos y descripciones
- **3 planes de precios** (Básico, Profesional, Empresarial) con diseño comparativo
- **CTA final** con enlaces a marketplace

---

## Iteración 12: Modal de Login/Registro

### Prompt utilizado
```
Crea un modal de autenticación con login y registro, diseño moderno con tabs y opciones de redes sociales.
```

### Componentes creados
- `components/AuthModal.tsx` — Modal reutilizable
- Navbar actualizado para abrir el modal

### Funcionalidades
- Tabs de Login/Registro
- Campos de email y contraseña
- Botones de Google y Apple
- Términos y condiciones
- Overlay con blur
- Cierre al hacer clic fuera

---

## Iteración 13: Sección de reseñas

### Prompt utilizado
```
Agrega una sección de reseñas en la página de detalle de servicio, mostrando reseñas de clientes anteriores con estrellas y fechas.
```

### Componentes actualizados
- `app/services/[id]/page.tsx` — Sección de reseñas añadida

### Funcionalidades
- Lista de reseñas con avatar, nombre y fecha
- Estrellas de calificación visuales
- Texto de reseña con comillas
- Las reseñas se filtran por servicioId

---

## Iteración 14: Filtros avanzados en Marketplace

### Prompt utilizado
```
Mejora el Marketplace con filtros avanzados: rango de precio mínimo/máximo y filtro por calificación mínima.
```

### Componentes actualizados
- `app/marketplace/page.tsx` — Filtros expandidos

### Funcionalidades
- Filtro de precio mínimo y máximo
- Filtro por calificación mínima (4.5+, 4+, 3.5+)
- Panel de filtros colapsable
- Botón "Limpiar filtros"
- Conteo dinámico de resultados

---

## Iteración 15: Checkout simulado

### Prompt utilizado
```
Crea una página de checkout con 3 pasos: revisar pedido, procesar pago, confirmación. Incluye resumen y método de pago.
```

### Componentes creados
- `app/checkout/page.tsx` — Página de checkout con estados

### Funcionalidades
- 3 pasos visuales con indicador de progreso
- Resumen del pedido con subtotal, tarifa y total
- Selección de método de pago (Visa/Mastercard)
- Estado de carga simulado (spinner animado)
- Confirmación con animación de check
- Enlaces a dashboard y marketplace
- Diseño responsive

---

## Iteración 16: Mejoras en landing page

### Prompt utilizado
```
Mejora la landing page con más secciones: estadísticas detalladas, CTA principal, FAQ acordeón y newsletter.
```

### Componentes creados/actualizados
- `components/CTASection.tsx` — Nuevo componente con 4 secciones
- `app/page.tsx` — Actualizado para incluir CTASection

### Secciones añadidas
- **Stats**: 6 métricas clave (proyectos, freelancers, calificación, clientes, países, soporte)
- **CTA**: Banner degradado con llamada a la acción
- **FAQ**: Acordeón interactivo con 6 preguntas frecuentes
- **Newsletter**: Formulario de suscripción por correo

---

## Iteración 17: Backend con Supabase (Migración completa)

### Prompt utilizado
```
Migrar todo el proyecto a Supabase: auth real, base de datos PostgreSQL, RLS, real-time para chat, storage para imágenes, y reemplazar todos los datos mock con consultas a Supabase.
```

### Archivos creados (12)
| Archivo | Propósito |
|---|---|
| `src/types/index.ts` | Interfaces compartidas (Profile, Service, Order, etc.) |
| `src/lib/supabase/client.ts` | Cliente Supabase para el browser |
| `src/lib/supabase/server.ts` | Cliente Supabase para server components |
| `src/lib/supabase/middleware.ts` | Middleware de autenticación para rutas protegidas |
| `src/lib/supabase/queries.ts` | Funciones de consulta reutilizables (getServices, getCategories, etc.) |
| `src/middleware.ts` | Middleware de Next.js que protege /dashboard, /messages, /checkout, etc. |
| `src/contexts/AuthContext.tsx` | Contexto de autenticación (user, profile, signOut) |
| `src/actions/orders.ts` | Server Actions: createOrder, updateOrderStatus |
| `src/actions/messages.ts` | Server Actions: sendMessage, createConversation |
| `src/actions/favorites.ts` | Server Actions: toggleFavorite |
| `src/actions/reviews.ts` | Server Actions: addReview |
| `src/actions/contact.ts` | Server Actions: submitContact |
| `src/actions/profile.ts` | Server Actions: updateProfile |
| `src/app/auth/callback/route.ts` | Ruta de callback OAuth (Google/Apple) |
| `src/components/AddToFavorites.tsx` | Botón de favoritos en detalle de servicio |
| `supabase/migrations/00001_schema.sql` | Esquema completo: 10 tablas + RLS + triggers |
| `supabase/seed.sql` | Datos iniciales: 8 categorías, 6 testimonios |
| `.env.example` | Template de variables de entorno |

### Archivos modificados (13)
- `src/app/layout.tsx` — AuthProvider añadido
- `src/components/Navbar.tsx` — Avatar de usuario, menú dropdown, sesión real
- `src/components/AuthModal.tsx` — Auth real con Supabase (email/password + Google + Apple)
- `src/app/services/[id]/page.tsx` — Datos desde Supabase con ISR
- `src/app/marketplace/page.tsx` — Servicios desde Supabase con skeleton loading
- `src/app/categories/[slug]/page.tsx` — Datos desde Supabase con ISR
- `src/app/freelancers/[id]/page.tsx` — Perfiles desde Supabase con ISR
- `src/app/checkout/page.tsx` — Orden real con datos del servicio desde URL params
- `src/app/dashboard/page.tsx` — Órdenes y servicios reales del usuario
- `src/app/messages/page.tsx` — Mensajes con real-time subscriptions
- `src/app/favorites/page.tsx` — Favoritos desde Supabase
- `src/app/profile/page.tsx` — Edición de perfil real con persistencia
- `src/app/contact/page.tsx` — Mensajes guardados en Supabase
- `src/components/Categories.tsx` — Categorías desde Supabase
- `src/components/Testimonials.tsx` — Testimonios desde Supabase
- `src/components/ReviewForm.tsx` — Reseñas persistentes en Supabase
- `src/components/ServiceCard.tsx` — Tipos actualizados a schema Supabase
- `src/contexts/FavoritesContext.tsx` — Favoritos desde Supabase
- `src/components/FavoriteButton.tsx` — Integrado con Supabase + AuthContext
- `next.config.ts` — Remote patterns para imágenes de Supabase Storage

### Funcionalidades implementadas
- **Auth real**: registro, login, Google OAuth, Apple OAuth, sesión persistente
- **Protección de rutas**: /dashboard, /messages, /checkout, /favorites, /profile redirigen si no hay sesión
- **Perfil automático**: al registrarse, se crea un profile con trigger SQL
- **RLS (Row Level Security)**: políticas por tabla para datos públicos/privados
- **Órdenes reales**: con cálculo de tarifa de servicio (5%) y estados
- **Real-time**: los mensajes del chat aparecen en vivo sin recargar
- **Favoritos persistentes**: por usuario, sincronizados con Supabase
- **Reseñas**: actualizan rating y conteo del servicio automáticamente
- **ISR**: páginas de servicios, categorías y freelancers con revalidate=60s

### Pendiente (requiere acción del usuario)
1. **Crear proyecto en supabase.com**
2. **Ejecutar `supabase/migrations/00001_schema.sql`** en SQL Editor
3. **Ejecutar `supabase/seed.sql`** para datos iniciales
4. **Copiar `.env.example` a `.env.local`** con las credenciales reales
5. **Configurar OAuth** (Google, Apple) en Supabase Auth settings
6. **Activar Realtime** en la tabla `messages` desde Supabase Dashboard

## Evolución del producto

1. **Versión 1 (Iteraciones 1-3)**: Base del proyecto + datos simulados + landing page
2. **Versión 2 (Iteraciones 4-5)**: Núcleo funcional — explorar, buscar y ver servicios
3. **Versión 3 (Iteraciones 6-7)**: Dashboard de control + asistente virtual
4. **Versión 4 (Iteraciones 8-10)**: Expansión de datos, categorías y perfiles de freelancers
5. **Versión 5 (Iteraciones 11-12)**: Páginas informativas y autenticación simulada
6. **Versión 6 (Iteraciones 13-15)**: Reseñas, filtros avanzados y checkout
7. **Versión Final (Iteración 16)**: Landing page completa con FAQ, stats y newsletter

## Archivos del proyecto (final)

```
src/
├── app/
│   ├── layout.tsx                    # Layout global con Navbar, Footer, Chatbot
│   ├── page.tsx                      # Landing page completa
│   ├── globals.css                   # Estilos globales Tailwind v4
│   ├── categories/[slug]/page.tsx    # Página de categoría (SSG, 8 páginas)
│   ├── checkout/page.tsx             # Checkout simulado (3 pasos)
│   ├── dashboard/page.tsx            # Dashboard con tabs y stats
│   ├── freelancers/[id]/page.tsx     # Perfil de freelancer (SSG, 10 páginas)
│   ├── how-it-works/page.tsx         # Página informativa
│   ├── marketplace/page.tsx          # Marketplace con filtros avanzados
│   └── services/[id]/page.tsx        # Detalle de servicio con reseñas (SSG, 26 páginas)
├── components/
│   ├── AuthModal.tsx                 # Modal de login/registro
│   ├── Categories.tsx                # Grid de categorías
│   ├── Chatbot.tsx                   # Chatbot flotante
│   ├── CTASection.tsx                # Stats, CTA, FAQ, Newsletter
│   ├── Features.tsx                  # Características
│   ├── Footer.tsx                    # Footer completo
│   ├── Hero.tsx                      # Hero section
│   ├── Navbar.tsx                    # Navbar responsive
│   ├── ServiceCard.tsx               # Tarjeta de servicio
│   └── Testimonials.tsx              # Testimonios
└── data/
    ├── categories.ts                # 8 categorías
    ├── freelancers.ts               # 10 freelancers
    ├── reviews.ts                   # 20 reseñas
    ├── services.ts                  # 26 servicios
    └── testimonials.ts              # 6 testimonios
```

---

*Documentación generada como parte de la Práctica: Desarrollo Asistido por IA y Vibecoding — UNAH*
