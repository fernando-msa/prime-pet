# Compatibilidade de Layout com API v2

## Objetivo
Guiar o redesenho de layout para consumir a API v2 sem bloquear a migração.

## Contrato mínimo para o novo layout
1. Enviar `Authorization: Bearer <JWT>` em todas as rotas protegidas.
2. Enviar `x-tenant-id` em todas as chamadas multi-tenant.
3. Consumir endpoints v2 (clientes, pets, agendamentos, dashboard, notificações).
4. Herdar a camada visual compartilhada (`layout-v2-shell.css` + `layout-v2-components.css`).
5. Opcional: habilitar atalhos globais e toggle de tema (`layout-v2-enhancements.js`).
6. Usar apenas navegação no cabeçalho global (sem sidebar fixa).
7. Garantir UX de ações rápidas (fechar com clique fora e tecla Esc).
8. Respeitar `prefers-reduced-motion` para animações/transições.

## Ordem recomendada de telas
1. Login e seleção de tenant
2. Clientes
3. Pets
4. Agendamentos
5. Dashboard
6. Prontuário

## Métrica de prontidão
- Endpoint: `GET /api/v2/migration/progress?tenantId=<id>`
- `domainCoverage >= 70%`: já dá para começar refactor de layout com dados reais.
- `domainCoverage >= 95%`: pronto para fase contract no banco legado.

## O que ainda falta (macro)
- Finalizar backfill até cobertura >=95%.
- Ativar dual-write em produção (período controlado).
- Virar leituras do frontend para `/api/v2` por feature flag.
- Executar contract phase (NOT NULL/FK para `tenant_id` no legado).
