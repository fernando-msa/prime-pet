# Checklist de migração para API v2 (pós-refactor visual)

## 1) Ativar bridge no frontend
- Arquivo: `assets/js/api-v2-migration-bridge.js`
- Modo padrão: `legacy`
- Modo novo: `v2`

### Como alternar
- Via querystring: `?apiMode=v2`
- Via console:
```js
PrimePetApiBridge.setMode('v2')
```

## 2) Configurar tenant e token v2
- Salvar tenant:
```js
localStorage.setItem('primepet_tenant_id', 'tenant_legacy_clinica_01')
```
- Salvar access token:
```js
localStorage.setItem('primepet_v2_access_token', '<jwt>')
```

## 3) Migrar chamadas por fluxo (feature flag)
1. Dashboard ✅ (já com fallback legado/v2)
2. Cliente
3. Admin
4. Contrato/formulário

## 4) Validar critérios antes de cutover
- `GET /api/v2/migration/overall-status?tenantId=<id>` para medir quanto falta no plano total.
- `GET /api/v2/migration/progress?tenantId=<id>` com cobertura >=95%
- Backfill final concluído
- Dual-write estável
- Logs/auditoria sem erros críticos

## 5) Cutover
- Alternar modo para `v2` por padrão
- Manter fallback `legacy` temporário
- Após estabilidade: iniciar phase CONTRACT no banco legado
