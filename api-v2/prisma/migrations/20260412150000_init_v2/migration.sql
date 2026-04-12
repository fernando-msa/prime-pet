-- Migração base v2 (zero-downtime): apenas criação de novas tabelas e colunas opcionais.
-- Compatível com rollout progressivo: front atual continua intacto.

CREATE TABLE IF NOT EXISTS tenants (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  slug VARCHAR(191) NOT NULL UNIQUE,
  plan_code VARCHAR(191) NOT NULL,
  max_users INTEGER NOT NULL DEFAULT 3,
  max_appointments_month INTEGER NOT NULL DEFAULT 150,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plans (
  code VARCHAR(191) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  monthly_price DECIMAL(10,2) NOT NULL,
  max_users INTEGER NOT NULL,
  max_appointments_month INTEGER NOT NULL
);

-- Observação: para bases legadas SQL existentes, adicionar tenant_id como nullable,
-- backfill em lotes, e só depois tornar NOT NULL em janela controlada.
