/* FreelanceHub - Azure SQL Database / SQL Server 2022+
   Ejecutar sobre una base vacia. El script no elimina objetos existentes. */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

CREATE TABLE dbo.users (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_users PRIMARY KEY
        CONSTRAINT DF_users_id DEFAULT NEWSEQUENTIALID(),
    email NVARCHAR(320) NOT NULL,
    password_hash NVARCHAR(500) NULL,
    external_provider NVARCHAR(50) NULL,
    external_subject NVARCHAR(255) NULL,
    email_verified BIT NOT NULL CONSTRAINT DF_users_email_verified DEFAULT 0,
    disabled BIT NOT NULL CONSTRAINT DF_users_disabled DEFAULT 0,
    created_at DATETIME2(3) NOT NULL CONSTRAINT DF_users_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(3) NOT NULL CONSTRAINT DF_users_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_users_email UNIQUE (email),
    CONSTRAINT CK_users_identity CHECK (
        password_hash IS NOT NULL OR
        (external_provider IS NOT NULL AND external_subject IS NOT NULL) OR
        disabled = 1
    )
);
GO

CREATE UNIQUE INDEX UX_users_external_identity
ON dbo.users(external_provider, external_subject)
WHERE external_provider IS NOT NULL AND external_subject IS NOT NULL;
GO

CREATE TABLE dbo.profiles (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_profiles PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    avatar_url NVARCHAR(2048) NULL,
    role VARCHAR(20) NOT NULL CONSTRAINT DF_profiles_role DEFAULT 'client',
    title NVARCHAR(150) NULL,
    rating DECIMAL(3,2) NOT NULL CONSTRAINT DF_profiles_rating DEFAULT 0,
    reviews_count INT NOT NULL CONSTRAINT DF_profiles_reviews_count DEFAULT 0,
    completed_projects INT NOT NULL CONSTRAINT DF_profiles_completed_projects DEFAULT 0,
    description NVARCHAR(1000) NULL,
    bio NVARCHAR(MAX) NULL,
    hourly_rate DECIMAL(12,2) NULL,
    location NVARCHAR(200) NULL,
    verified BIT NOT NULL CONSTRAINT DF_profiles_verified DEFAULT 0,
    created_at DATETIME2(3) NOT NULL CONSTRAINT DF_profiles_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(3) NOT NULL CONSTRAINT DF_profiles_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_profiles_users FOREIGN KEY (id) REFERENCES dbo.users(id) ON DELETE CASCADE,
    CONSTRAINT CK_profiles_role CHECK (role IN ('client','freelancer','admin')),
    CONSTRAINT CK_profiles_rating CHECK (rating BETWEEN 0 AND 5),
    CONSTRAINT CK_profiles_counts CHECK (reviews_count >= 0 AND completed_projects >= 0),
    CONSTRAINT CK_profiles_hourly_rate CHECK (hourly_rate IS NULL OR hourly_rate >= 0)
);
GO

CREATE TABLE dbo.profile_skills (
    profile_id UNIQUEIDENTIFIER NOT NULL,
    skill NVARCHAR(100) NOT NULL,
    CONSTRAINT PK_profile_skills PRIMARY KEY (profile_id, skill),
    CONSTRAINT FK_profile_skills_profile FOREIGN KEY (profile_id) REFERENCES dbo.profiles(id) ON DELETE CASCADE
);
CREATE TABLE dbo.profile_languages (
    profile_id UNIQUEIDENTIFIER NOT NULL,
    language NVARCHAR(100) NOT NULL,
    CONSTRAINT PK_profile_languages PRIMARY KEY (profile_id, language),
    CONSTRAINT FK_profile_languages_profile FOREIGN KEY (profile_id) REFERENCES dbo.profiles(id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.categories (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_categories PRIMARY KEY
        CONSTRAINT DF_categories_id DEFAULT NEWSEQUENTIALID(),
    name NVARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    icon NVARCHAR(20) NOT NULL,
    description NVARCHAR(500) NOT NULL,
    services_count INT NOT NULL CONSTRAINT DF_categories_services_count DEFAULT 0,
    created_at DATETIME2(3) NOT NULL CONSTRAINT DF_categories_created_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_categories_slug UNIQUE (slug),
    CONSTRAINT CK_categories_services_count CHECK (services_count >= 0)
);
GO

CREATE TABLE dbo.services (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_services PRIMARY KEY
        CONSTRAINT DF_services_id DEFAULT NEWSEQUENTIALID(),
    title NVARCHAR(100) NOT NULL,
    description NVARCHAR(300) NOT NULL,
    long_description NVARCHAR(MAX) NOT NULL,
    category_id UNIQUEIDENTIFIER NOT NULL,
    freelancer_id UNIQUEIDENTIFIER NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    delivery_time NVARCHAR(100) NOT NULL,
    rating DECIMAL(3,2) NOT NULL CONSTRAINT DF_services_rating DEFAULT 0,
    reviews_count INT NOT NULL CONSTRAINT DF_services_reviews_count DEFAULT 0,
    sales INT NOT NULL CONSTRAINT DF_services_sales DEFAULT 0,
    active BIT NOT NULL CONSTRAINT DF_services_active DEFAULT 1,
    created_at DATETIME2(3) NOT NULL CONSTRAINT DF_services_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(3) NOT NULL CONSTRAINT DF_services_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_services_category FOREIGN KEY (category_id) REFERENCES dbo.categories(id),
    CONSTRAINT FK_services_freelancer FOREIGN KEY (freelancer_id) REFERENCES dbo.profiles(id),
    CONSTRAINT CK_services_price CHECK (price > 0 AND price <= 1000000),
    CONSTRAINT CK_services_rating CHECK (rating BETWEEN 0 AND 5),
    CONSTRAINT CK_services_counts CHECK (reviews_count >= 0 AND sales >= 0)
);
CREATE INDEX IX_services_category ON dbo.services(category_id);
CREATE INDEX IX_services_freelancer ON dbo.services(freelancer_id);
CREATE INDEX IX_services_active_rating ON dbo.services(active, rating DESC);
GO

CREATE TABLE dbo.service_images (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_service_images PRIMARY KEY,
    service_id UNIQUEIDENTIFIER NOT NULL,
    image_url NVARCHAR(2048) NOT NULL,
    sort_order SMALLINT NOT NULL CONSTRAINT DF_service_images_sort DEFAULT 0,
    CONSTRAINT FK_service_images_service FOREIGN KEY (service_id) REFERENCES dbo.services(id) ON DELETE CASCADE,
    CONSTRAINT UQ_service_images UNIQUE(service_id, image_url)
);
CREATE TABLE dbo.service_tags (
    service_id UNIQUEIDENTIFIER NOT NULL,
    tag NVARCHAR(80) NOT NULL,
    CONSTRAINT PK_service_tags PRIMARY KEY(service_id, tag),
    CONSTRAINT FK_service_tags_service FOREIGN KEY(service_id) REFERENCES dbo.services(id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.[orders] (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_orders PRIMARY KEY
        CONSTRAINT DF_orders_id DEFAULT NEWSEQUENTIALID(),
    service_id UNIQUEIDENTIFIER NOT NULL,
    buyer_id UNIQUEIDENTIFIER NOT NULL,
    freelancer_id UNIQUEIDENTIFIER NOT NULL,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_orders_status DEFAULT 'pending',
    price DECIMAL(12,2) NOT NULL,
    service_fee DECIMAL(12,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    requirements NVARCHAR(MAX) NULL,
    delivery_note NVARCHAR(MAX) NULL,
    delivered_at DATETIME2(3) NULL,
    dispute_reason NVARCHAR(2000) NULL,
    created_at DATETIME2(3) NOT NULL CONSTRAINT DF_orders_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(3) NOT NULL CONSTRAINT DF_orders_updated_at DEFAULT SYSUTCDATETIME(),
    row_version ROWVERSION NOT NULL,
    CONSTRAINT FK_orders_service FOREIGN KEY(service_id) REFERENCES dbo.services(id),
    CONSTRAINT FK_orders_buyer FOREIGN KEY(buyer_id) REFERENCES dbo.profiles(id),
    CONSTRAINT FK_orders_freelancer FOREIGN KEY(freelancer_id) REFERENCES dbo.profiles(id),
    CONSTRAINT CK_orders_status CHECK(status IN ('pending','in_progress','delivered','completed','cancelled','disputed')),
    CONSTRAINT CK_orders_amounts CHECK(price > 0 AND service_fee >= 0 AND total = price + service_fee),
    CONSTRAINT CK_orders_parties CHECK(buyer_id <> freelancer_id)
);
CREATE INDEX IX_orders_buyer_created ON dbo.[orders](buyer_id, created_at DESC);
CREATE INDEX IX_orders_freelancer_created ON dbo.[orders](freelancer_id, created_at DESC);
CREATE INDEX IX_orders_status ON dbo.[orders](status);
GO

CREATE TABLE dbo.reviews (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_reviews PRIMARY KEY
        CONSTRAINT DF_reviews_id DEFAULT NEWSEQUENTIALID(),
    order_id UNIQUEIDENTIFIER NOT NULL,
    service_id UNIQUEIDENTIFIER NOT NULL,
    user_id UNIQUEIDENTIFIER NOT NULL,
    rating TINYINT NOT NULL,
    content NVARCHAR(2000) NOT NULL,
    created_at DATETIME2(3) NOT NULL CONSTRAINT DF_reviews_created_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_reviews_order FOREIGN KEY(order_id) REFERENCES dbo.[orders](id),
    CONSTRAINT FK_reviews_service FOREIGN KEY(service_id) REFERENCES dbo.services(id),
    CONSTRAINT FK_reviews_user FOREIGN KEY(user_id) REFERENCES dbo.profiles(id),
    CONSTRAINT UQ_reviews_order UNIQUE(order_id),
    CONSTRAINT CK_reviews_rating CHECK(rating BETWEEN 1 AND 5)
);
CREATE INDEX IX_reviews_service ON dbo.reviews(service_id, created_at DESC);
GO

CREATE TABLE dbo.testimonials (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_testimonials PRIMARY KEY
        CONSTRAINT DF_testimonials_id DEFAULT NEWSEQUENTIALID(),
    name NVARCHAR(150) NOT NULL,
    role NVARCHAR(150) NOT NULL,
    avatar NVARCHAR(2048) NOT NULL,
    content NVARCHAR(2000) NOT NULL,
    rating TINYINT NOT NULL,
    created_at DATETIME2(3) NOT NULL CONSTRAINT DF_testimonials_created_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_testimonials_rating CHECK(rating BETWEEN 1 AND 5)
);
GO

CREATE TABLE dbo.conversations (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_conversations PRIMARY KEY
        CONSTRAINT DF_conversations_id DEFAULT NEWSEQUENTIALID(),
    last_message NVARCHAR(2000) NULL,
    last_message_time DATETIME2(3) NULL,
    created_at DATETIME2(3) NOT NULL CONSTRAINT DF_conversations_created_at DEFAULT SYSUTCDATETIME()
);
CREATE TABLE dbo.conversation_participants (
    conversation_id UNIQUEIDENTIFIER NOT NULL,
    profile_id UNIQUEIDENTIFIER NOT NULL,
    joined_at DATETIME2(3) NOT NULL CONSTRAINT DF_conversation_participants_joined DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_conversation_participants PRIMARY KEY(conversation_id, profile_id),
    CONSTRAINT FK_conversation_participants_conversation FOREIGN KEY(conversation_id) REFERENCES dbo.conversations(id) ON DELETE CASCADE,
    CONSTRAINT FK_conversation_participants_profile FOREIGN KEY(profile_id) REFERENCES dbo.profiles(id)
);
CREATE INDEX IX_conversation_participants_profile ON dbo.conversation_participants(profile_id, conversation_id);
GO

CREATE TABLE dbo.messages (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_messages PRIMARY KEY
        CONSTRAINT DF_messages_id DEFAULT NEWSEQUENTIALID(),
    conversation_id UNIQUEIDENTIFIER NOT NULL,
    sender_id UNIQUEIDENTIFIER NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2(3) NOT NULL CONSTRAINT DF_messages_created_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_messages_conversation FOREIGN KEY(conversation_id) REFERENCES dbo.conversations(id) ON DELETE CASCADE,
    CONSTRAINT FK_messages_sender FOREIGN KEY(sender_id) REFERENCES dbo.profiles(id)
);
CREATE INDEX IX_messages_conversation_created ON dbo.messages(conversation_id, created_at);
GO

CREATE TABLE dbo.favorites (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_favorites PRIMARY KEY
        CONSTRAINT DF_favorites_id DEFAULT NEWSEQUENTIALID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    service_id UNIQUEIDENTIFIER NOT NULL,
    created_at DATETIME2(3) NOT NULL CONSTRAINT DF_favorites_created_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_favorites_user FOREIGN KEY(user_id) REFERENCES dbo.profiles(id) ON DELETE CASCADE,
    CONSTRAINT FK_favorites_service FOREIGN KEY(service_id) REFERENCES dbo.services(id),
    CONSTRAINT UQ_favorites_user_service UNIQUE(user_id, service_id)
);
CREATE INDEX IX_favorites_user ON dbo.favorites(user_id);
GO

CREATE TABLE dbo.notifications (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_notifications PRIMARY KEY
        CONSTRAINT DF_notifications_id DEFAULT NEWSEQUENTIALID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    type VARCHAR(20) NOT NULL,
    title NVARCHAR(200) NOT NULL,
    message NVARCHAR(1000) NOT NULL,
    [read] BIT NOT NULL CONSTRAINT DF_notifications_read DEFAULT 0,
    created_at DATETIME2(3) NOT NULL CONSTRAINT DF_notifications_created_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_notifications_user FOREIGN KEY(user_id) REFERENCES dbo.profiles(id) ON DELETE CASCADE,
    CONSTRAINT CK_notifications_type CHECK(type IN ('order','message','review','system'))
);
CREATE INDEX IX_notifications_user_created ON dbo.notifications(user_id, created_at DESC);
GO

CREATE TABLE dbo.contact_messages (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_contact_messages PRIMARY KEY
        CONSTRAINT DF_contact_messages_id DEFAULT NEWSEQUENTIALID(),
    name NVARCHAR(150) NOT NULL,
    email NVARCHAR(320) NOT NULL,
    subject NVARCHAR(200) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2(3) NOT NULL CONSTRAINT DF_contact_messages_created_at DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.platform_settings (
    [key] VARCHAR(100) NOT NULL CONSTRAINT PK_platform_settings PRIMARY KEY,
    value NVARCHAR(500) NOT NULL,
    description NVARCHAR(500) NULL,
    updated_at DATETIME2(3) NOT NULL CONSTRAINT DF_platform_settings_updated_at DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.portfolio_items (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_portfolio_items PRIMARY KEY
        CONSTRAINT DF_portfolio_items_id DEFAULT NEWSEQUENTIALID(),
    freelancer_id UNIQUEIDENTIFIER NOT NULL,
    title NVARCHAR(150) NOT NULL,
    description NVARCHAR(1000) NULL,
    image_url NVARCHAR(2048) NOT NULL,
    url NVARCHAR(2048) NULL,
    created_at DATETIME2(3) NOT NULL CONSTRAINT DF_portfolio_items_created_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_portfolio_items_freelancer FOREIGN KEY(freelancer_id) REFERENCES dbo.profiles(id) ON DELETE CASCADE
);
CREATE INDEX IX_portfolio_freelancer_created ON dbo.portfolio_items(freelancer_id, created_at DESC);
GO

/* Registro de cambios sensibles para investigacion y soporte. */
CREATE TABLE dbo.audit_log (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_audit_log PRIMARY KEY,
    actor_id UNIQUEIDENTIFIER NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UNIQUEIDENTIFIER NULL,
    old_values NVARCHAR(MAX) NULL,
    new_values NVARCHAR(MAX) NULL,
    ip_address VARCHAR(45) NULL,
    created_at DATETIME2(3) NOT NULL CONSTRAINT DF_audit_log_created_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_audit_log_actor FOREIGN KEY(actor_id) REFERENCES dbo.profiles(id),
    CONSTRAINT CK_audit_log_old_json CHECK(old_values IS NULL OR ISJSON(old_values) = 1),
    CONSTRAINT CK_audit_log_new_json CHECK(new_values IS NULL OR ISJSON(new_values) = 1)
);
CREATE INDEX IX_audit_log_entity ON dbo.audit_log(entity_type, entity_id, created_at DESC);
GO

/* Vistas publicas: no exponen email, credenciales ni informacion privada. */
CREATE VIEW dbo.v_public_freelancers AS
SELECT p.id, p.name, p.avatar_url, p.title, p.rating, p.reviews_count,
       p.completed_projects, p.description, p.bio, p.hourly_rate,
       p.location, p.verified, p.created_at
FROM dbo.profiles p
WHERE p.role = 'freelancer';
GO

CREATE VIEW dbo.v_service_catalog AS
SELECT s.id, s.title, s.description, s.long_description, s.category_id,
       c.name AS category_name, c.slug AS category_slug, s.freelancer_id,
       p.name AS freelancer_name, p.avatar_url AS freelancer_avatar,
       p.verified AS freelancer_verified, s.price, s.delivery_time,
       s.rating, s.reviews_count, s.sales, s.created_at
FROM dbo.services s
JOIN dbo.categories c ON c.id = s.category_id
JOIN dbo.profiles p ON p.id = s.freelancer_id
WHERE s.active = 1;
GO

/* Notificaciones internas; no realizan llamadas externas. */
CREATE TRIGGER dbo.TR_orders_notify_insert ON dbo.[orders]
AFTER INSERT AS
BEGIN
    SET NOCOUNT ON;
    INSERT dbo.notifications(user_id, type, title, message)
    SELECT freelancer_id, 'order', N'Nuevo pedido',
           CONCAT(N'Has recibido un nuevo pedido por L ', CONVERT(NVARCHAR(30), total), N' HNL')
    FROM inserted;
END;
GO

CREATE TRIGGER dbo.TR_messages_after_insert ON dbo.messages
AFTER INSERT AS
BEGIN
    SET NOCOUNT ON;
    UPDATE c SET last_message = i.content, last_message_time = i.created_at
    FROM dbo.conversations c JOIN inserted i ON i.conversation_id = c.id;

    INSERT dbo.notifications(user_id, type, title, message)
    SELECT cp.profile_id, 'message', N'Mensaje nuevo', N'Tienes un nuevo mensaje en tu bandeja de entrada'
    FROM inserted i
    JOIN dbo.conversation_participants cp ON cp.conversation_id = i.conversation_id
    WHERE cp.profile_id <> i.sender_id;
END;
GO

CREATE TRIGGER dbo.TR_reviews_after_insert ON dbo.reviews
AFTER INSERT AS
BEGIN
    SET NOCOUNT ON;
    INSERT dbo.notifications(user_id, type, title, message)
    SELECT s.freelancer_id, 'review', N'Reseña recibida',
           CONCAT(p.name, N' calificó tu servicio con ', i.rating, N' estrellas')
    FROM inserted i
    JOIN dbo.services s ON s.id = i.service_id
    JOIN dbo.profiles p ON p.id = i.user_id;

    UPDATE s SET rating = x.average_rating, reviews_count = x.review_count
    FROM dbo.services s
    JOIN (
        SELECT r.service_id, CAST(AVG(CAST(r.rating AS DECIMAL(10,2))) AS DECIMAL(3,2)) average_rating,
               COUNT(*) review_count
        FROM dbo.reviews r
        WHERE r.service_id IN (SELECT service_id FROM inserted)
        GROUP BY r.service_id
    ) x ON x.service_id = s.id;
END;
GO

/* Permisos: la aplicacion debe conectarse con este rol, no como dbo. */
CREATE ROLE freelancehub_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO freelancehub_app;
DENY SELECT, INSERT, UPDATE, DELETE ON dbo.users TO freelancehub_app;
DENY SELECT, INSERT, UPDATE, DELETE ON dbo.audit_log TO freelancehub_app;
GRANT SELECT ON dbo.v_public_freelancers TO freelancehub_app;
GRANT SELECT ON dbo.v_service_catalog TO freelancehub_app;
GO
