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
- Migration (importação legada idempotente por `externalLegacyId`)

## Zero downtime
Estratégia expand/backfill/contract para evitar indisponibilidade durante a migração.


## Endpoints de migração entregues
- `GET /api/v2/migration/status`
- `GET /api/v2/migration/progress?tenantId=<id>`
- `GET /api/v2/migration/overall-status?tenantId=<id>`
- `POST /api/v2/migration/import/clients`
- `POST /api/v2/migration/import/pets`
- `POST /api/v2/migration/import/appointments`


## Pré-requisito resolvido antes da migração
- Alinhamento de dependências NestJS para `11.x` em todo o workspace `api-v2` (evita risco de incompatibilidade de runtime/DI por versões mistas).
- Inclusão de templates SQL separados por banco (`PostgreSQL` e `MySQL`) para execução segura da fase EXPAND.


## Runbook de backfill (executável)
- Script: `api-v2/scripts/backfill-legacy.js`
- Configuração: `api-v2/scripts/backfill-config.example.json`
- Fontes: `api-v2/scripts/data/*.json`

Fluxo recomendado:
1. Rodar dry-run: `npm --prefix api-v2 run migration:backfill:dry`
2. Validar contagens e referências não encontradas (`[skip]`).
3. Rodar efetivo: `npm --prefix api-v2 run migration:backfill`
4. Reexecutar incrementalmente sempre que houver novos dados legados (idempotência por `externalLegacyId`).


Referência para refactor de interface: `docs/LAYOUT_V2_COMPATIBILIDADE.md`.


Checklist operacional pós-refactor visual: `docs/MIGRACAO_API_V2_CHECKLIST.md`.
