# Validação Pós-Deploy (Abril/2026)

## Objetivo

Garantir que as mudanças de segurança e migração foram aplicadas sem regressão funcional.

## Escopo

- Autorização admin (custom claim + fallback controlado por rules)
- Hardening web Firebase (hosts autorizados e comportamento em host inválido)
- Configuração operacional sensível movida para Functions
- Migração legado para padrão v2

## Pré-requisitos

- Deploy concluído de rules e functions
- Usuário de teste com claim `admin=true`
- Usuário de teste sem claim admin
- Endpoint de webhook de teste HTTPS ativo

## Comandos de Deploy (referência)

```bash
firebase deploy --only firestore:rules,firestore:indexes
firebase deploy --only functions
```

## Checklist de Validação

## 1) Autorização Admin

1. Login em [admin.html](../../admin.html) com usuário `admin=true`.
2. Confirmar acesso ao painel sem erro de permissão.
3. Login com usuário sem claim admin.
4. Confirmar bloqueio com mensagem de acesso negado.
5. Validar operação protegida (ex.: alteração de manutenção) com admin.
6. Confirmar que operação falha para usuário sem claim.

Critério de aceite:

- Apenas usuário admin acessa e opera o painel.

## 2) Firestore Rules

1. Verificar leitura/escrita em coleção protegida via app com usuário comum.
2. Confirmar que `ops_config/*` não é legível/escrevível no cliente.
3. Validar fluxo padrão de cliente (`historico_clientes`, `clientes_perfis`) sem regressão.

Critério de aceite:

- Restrições aplicadas conforme papel sem quebrar fluxo legítimo.

## 3) Hardening Web (Hosts)

1. Acessar app em host autorizado (`localhost` ou domínio oficial).
2. Confirmar inicialização normal do Firebase.
3. Acessar em host não autorizado (ambiente de teste alternativo).
4. Confirmar bloqueio de autenticação/inicialização conforme página.

Critério de aceite:

- Host fora da allowlist não opera autenticação Firebase.

## 4) Webhook Operacional em Backend

1. Em [admin.html](../../admin.html), salvar webhook HTTPS válido.
2. Executar teste de webhook no painel.
3. Confirmar recebimento do payload no endpoint.
4. Criar evento operacional (novo pendente) e verificar envio.
5. Remover URL e confirmar resposta de "não configurado".

Critério de aceite:

- URL não fica mais em localStorage e envios ocorrem via Functions.

## 5) Migração v2 Padrão

1. Abrir [dashboard.html](../../dashboard.html) e validar bridge em modo padrão `v2`.
2. Validar chamadas principais com token `primepet_v2_access_token`.
3. Forçar rollback para `legacy` apenas em teste controlado.
4. Restaurar `v2` e repetir smoke básico (home, client, admin, dashboard).

Critério de aceite:

- `v2` é padrão estável; `legacy` funciona apenas como contingência.

## 6) Smoke Técnico Rápido

1. Home carrega, formulário envia, sem erro JS crítico.
2. Portal cliente autentica e carrega histórico/perfil.
3. Painel admin autentica e renderiza agenda/logs.
4. Functions callable respondem sem erro de permissão indevida.

Critério de aceite:

- Fluxos essenciais funcionam ponta a ponta.

## Evidências Recomendadas

- Captura de tela do painel admin autenticado
- Captura do bloqueio de usuário sem claim
- Log do endpoint webhook com payload recebido
- Trecho de logs do Firebase Functions (teste + evento)
- Resultado de smoke por fluxo (home/client/admin/dashboard)

## Plano de Rollback (se necessário)

1. Reverter deploy de functions para versão anterior estável.
2. Reverter rules para versão anterior validada.
3. Definir bridge temporariamente para `legacy` apenas em contingência.
4. Abrir incidente com causa raiz e janela de correção.
