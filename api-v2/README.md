# Prime Pet API v2 (SaaS Multi-tenant)

Esta pasta introduz a **v2 da API** sem alterar o frontend legado atual, permitindo migração progressiva.

## Estrutura de pastas

```text
api-v2/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── modules/
│   │   ├── auth/
│   │   ├── tenants/
│   │   ├── clients/
│   │   ├── pets/
│   │   ├── appointments/
│   │   ├── medical-records/
│   │   ├── dashboard/
│   │   ├── notifications/
│   │   ├── audit/
│   │   └── plans/
│   ├── prisma/
│   ├── app.module.ts
│   └── main.ts
└── package.json
```

## Requisitos atendidos

- API v2 em Node.js + NestJS
- Prisma ORM
- Multi-tenant com `tenantId`
- JWT + refresh token
- Roles `admin` e `user`
- Módulos de clientes, pets, agendamentos e prontuário
- Dashboard de métricas básicas
- Outbox de notificações (WhatsApp/e-mail)
- Auditoria
- Planos e limites por tenant

## Endpoints principais

### Auth
- `POST /api/v2/auth/login`
- `POST /api/v2/auth/refresh`

### Tenants
- `POST /api/v2/tenants` (admin)

### Clientes
- `GET /api/v2/clients`
- `POST /api/v2/clients`

### Pets
- `GET /api/v2/pets`
- `POST /api/v2/pets`

### Agendamentos
- `GET /api/v2/appointments`
- `POST /api/v2/appointments`

### Prontuário
- `GET /api/v2/medical-records`
- `POST /api/v2/medical-records`

### Dashboard
- `GET /api/v2/dashboard/summary`

### Notificações
- `POST /api/v2/notifications/enqueue`

### Auditoria
- `GET /api/v2/audit/:entityType/:entityId` (admin)

### Planos
- `GET /api/v2/plans/catalog`
- `GET /api/v2/plans/limits`

## Estratégia de migração progressiva (zero downtime)

1. **Expandir**: criar tabelas novas (`tenants`, `plans`, `audit_logs`, `notification_outbox`) e colunas `tenant_id` como nullable nas tabelas legadas SQL.
2. **Backfill por lote**: popular `tenant_id` com chave de mapeamento sem bloquear escrita.
3. **Dual-write controlado**: novos fluxos escrevem em v2 e legado temporariamente.
4. **Leitura gradativa**: mover endpoints por módulo para leitura v2 por feature flag.
5. **Constrain**: após cobertura total, tornar `tenant_id` NOT NULL + índices finais.

## Compatibilidade de dados existentes

- Campos `externalLegacyId` foram adicionados nas entidades principais para referência cruzada com IDs legados.
- A API v2 foi isolada em pasta própria sem quebrar o frontend atual.
