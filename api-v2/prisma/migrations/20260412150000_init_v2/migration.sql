-- Script base no dialeto PostgreSQL. Para MySQL usar sql-templates/mysql.expand.sql
-- Prime Pet v2 (SaaS) - fase EXPAND
-- Objetivo: criar estrutura v2 sem tocar no sistema legado em produção.

CREATE TABLE IF NOT EXISTS plans (
  code VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  monthly_price DECIMAL(10,2) NOT NULL,
  max_users INTEGER NOT NULL,
  max_appointments_month INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tenants (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  slug VARCHAR(191) NOT NULL UNIQUE,
  plan_code VARCHAR(50) NOT NULL,
  max_users INTEGER NOT NULL DEFAULT 3,
  max_appointments_month INTEGER NOT NULL DEFAULT 150,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tenants_plan FOREIGN KEY (plan_code) REFERENCES plans(code)
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(191) PRIMARY KEY,
  tenant_id VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  refresh_token_hash VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT uq_users_tenant_email UNIQUE (tenant_id, email)
);

CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(191) PRIMARY KEY,
  tenant_id VARCHAR(191) NOT NULL,
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191),
  phone VARCHAR(50),
  external_legacy_id VARCHAR(191),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_clients_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT uq_clients_legacy UNIQUE (tenant_id, external_legacy_id)
);

CREATE TABLE IF NOT EXISTS pets (
  id VARCHAR(191) PRIMARY KEY,
  tenant_id VARCHAR(191) NOT NULL,
  client_id VARCHAR(191) NOT NULL,
  name VARCHAR(191) NOT NULL,
  species VARCHAR(100) NOT NULL,
  breed VARCHAR(100),
  external_legacy_id VARCHAR(191),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pets_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_pets_client FOREIGN KEY (client_id) REFERENCES clients(id),
  CONSTRAINT uq_pets_legacy UNIQUE (tenant_id, external_legacy_id)
);

CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(191) PRIMARY KEY,
  tenant_id VARCHAR(191) NOT NULL,
  client_id VARCHAR(191) NOT NULL,
  pet_id VARCHAR(191) NOT NULL,
  starts_at TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  external_legacy_id VARCHAR(191),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_appointments_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_appointments_client FOREIGN KEY (client_id) REFERENCES clients(id),
  CONSTRAINT fk_appointments_pet FOREIGN KEY (pet_id) REFERENCES pets(id),
  CONSTRAINT uq_appointments_legacy UNIQUE (tenant_id, external_legacy_id)
);

CREATE TABLE IF NOT EXISTS medical_records (
  id VARCHAR(191) PRIMARY KEY,
  tenant_id VARCHAR(191) NOT NULL,
  pet_id VARCHAR(191) NOT NULL,
  diagnosis TEXT,
  notes TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_medical_records_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_medical_records_pet FOREIGN KEY (pet_id) REFERENCES pets(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(191) PRIMARY KEY,
  tenant_id VARCHAR(191) NOT NULL,
  actor_user_id VARCHAR(191),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(191) NOT NULL,
  old_data TEXT,
  new_data TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE TABLE IF NOT EXISTS notification_outbox (
  id VARCHAR(191) PRIMARY KEY,
  tenant_id VARCHAR(191) NOT NULL,
  channel VARCHAR(30) NOT NULL,
  "to" VARCHAR(191) NOT NULL,
  template_code VARCHAR(120) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP,
  CONSTRAINT fk_outbox_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE INDEX IF NOT EXISTS idx_clients_tenant ON clients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pets_tenant_client ON pets(tenant_id, client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_starts_at ON appointments(tenant_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_records_tenant_pet_created_at ON medical_records(tenant_id, pet_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_tenant_entity ON audit_logs(tenant_id, entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_outbox_tenant_status_created_at ON notification_outbox(tenant_id, status, created_at);

INSERT INTO plans (code, name, monthly_price, max_users, max_appointments_month)
VALUES
  ('starter', 'Starter', 99.90, 3, 150),
  ('pro', 'Pro', 199.90, 10, 1000),
  ('enterprise', 'Enterprise', 499.90, 100, 10000)
ON CONFLICT (code) DO NOTHING;

-- Fase BACKFILL (executar em janelas controladas):
-- 1) adicionar tenant_id NULL em tabelas legadas
-- 2) preencher em lotes por chave de negócio
-- 3) ativar dual-write
-- 4) depois promover para NOT NULL + FK
