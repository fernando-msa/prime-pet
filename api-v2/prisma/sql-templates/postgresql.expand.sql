-- PostgreSQL template for EXPAND phase
-- Safe for additive rollout before backfill/cutover.

ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(191);
ALTER TABLE IF EXISTS pets ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(191);
ALTER TABLE IF EXISTS appointments ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(191);

-- Example: after backfill, enforce constraints in controlled window:
-- ALTER TABLE clients ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE clients ADD CONSTRAINT fk_clients_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);
