# Plano de Evolução Prime Pet para SaaS (API v2)

## Objetivo
Criar uma nova camada backend (NestJS + Prisma) para evolução SaaS multi-tenant sem alterar o fluxo atual em produção.

## Banco de dados
- Mantém PostgreSQL/MySQL (via `DATABASE_PROVIDER` no Prisma).
- Introduz `tenantId` nas tabelas de domínio.
- Tabela `tenants` para isolamento lógico.
- Tabela `plans` para limites comerciais.
- `audit_logs` e `notification_outbox` para rastreabilidade e integração assíncrona.

## Segurança
- JWT de acesso curto (15m).
- Refresh token com rotação persistida (`refreshTokenHash`).
- RBAC: `admin`, `user`.

## Módulos v2 entregues
- Auth
- Tenants
- Clients
- Pets
- Appointments
- Medical Records
- Dashboard
- Notifications
- Audit
- Plans

## Zero downtime
Estratégia expand/backfill/contract para evitar indisponibilidade durante a migração.
