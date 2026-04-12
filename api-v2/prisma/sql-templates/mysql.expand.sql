-- MySQL 8+ template for EXPAND phase
-- Safe for additive rollout before backfill/cutover.

ALTER TABLE clients ADD COLUMN tenant_id VARCHAR(191) NULL;
ALTER TABLE pets ADD COLUMN tenant_id VARCHAR(191) NULL;
ALTER TABLE appointments ADD COLUMN tenant_id VARCHAR(191) NULL;

-- Example: after backfill, enforce constraints in controlled window:
-- ALTER TABLE clients MODIFY tenant_id VARCHAR(191) NOT NULL;
-- ALTER TABLE clients ADD CONSTRAINT fk_clients_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);
