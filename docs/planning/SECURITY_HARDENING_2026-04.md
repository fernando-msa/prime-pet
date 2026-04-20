# Hardening de fluxo ponta a ponta (Abr/2026)

## Objetivo

Fechar o fluxo operacional (index -> client -> admin -> dashboard) com controle de acesso mais rígido, mitigação de riscos de injeção e checklist de validação executável.

## Vulnerabilidades identificadas e corrigidas

## 1) Alto risco: alteração indevida de slots por qualquer usuário autenticado

Contexto:
- Em `agendamentos`, usuários autenticados podiam criar/alterar/excluir slots sem ownership explícito.

Correção aplicada:
- `firestore.rules` passou a exigir `ownerUid` no create por usuário comum.
- Usuário comum só cria slot `pending` do próprio `uid`.
- Update de slot ficou restrito a admin.
- Delete por usuário comum só é permitido no próprio slot `pending`.
- Admin mantém poderes operacionais de confirmação/cancelamento/liberação.

Arquivos:
- `firestore.rules`
- `scripts/firestore-rtdb-compat.js`
- `client.html`

## 2) Médio risco: injeção de HTML no dashboard

Contexto:
- `dashboard.html` montava tabela com `innerHTML` a partir de dados de banco.

Correção aplicada:
- Renderização migrada para criação de elementos (`createElement`) + `textContent`.
- Dados são tratados por função de texto seguro antes de exibir.

Arquivos:
- `dashboard.html`

## 3) Médio risco: webhook sem validação forte de URL

Contexto:
- URL do webhook no admin era persistida sem normalização/validação robusta.

Correção aplicada:
- Inclusão de validação de URL com:
  - protocolo obrigatório `https`
  - bloqueio de `localhost`, `127.0.0.1`, `::1`
  - bloqueio de faixas privadas (`10.x`, `192.168.x`, `172.16-31.x`)
- URL normalizada antes de salvar e antes de disparar.

Arquivos:
- `admin.html`

## Testes do fluxo (evidência)

## Smoke QA (frontend estático)

Linux/macOS:
- `./scripts/qa_smoke.sh`

Windows PowerShell:
- `powershell -ExecutionPolicy Bypass -File .\scripts\qa_smoke.ps1`

## Testes funcionais manuais mínimos

1. Index:
- Submeter pré-cadastro e garantir armazenamento local e redirecionamento esperado.

2. Client:
- Login do usuário.
- Importar pré-cadastro.
- Remarcar slot em status pendente (deve funcionar).
- Tentar remarcar sem sessão válida (deve bloquear com mensagem).

3. Admin:
- Login admin por claim ou `admin_users/{uid}`.
- Confirmar, cancelar e liberar slot.
- Salvar webhook inválido (http/localhost) deve falhar.
- Salvar webhook https público deve aceitar.

4. Dashboard:
- Carregar métricas sem quebra de layout.
- Confirmar que campos de tutor/pet são exibidos como texto (sem interpretar HTML).

## Riscos residuais

- Ambiente agora validado com Node + npm + Git Bash no Windows.
- Comandos executados na API v2:
  - `npm.cmd run lint`
  - `npm.cmd run build`
  - `npm.cmd audit --audit-level=moderate`
- Vulnerabilidade transitiva resolvida com upgrade de dependência raiz:
  - `bcrypt` atualizado de `5.1.1` para `6.0.0`.
  - Cadeia removida: `@mapbox/node-pre-gyp` -> `tar`.
  - Resultado atual: `npm.cmd audit --audit-level=moderate` sem vulnerabilidades.

## Próximo passo recomendado

- Criar suíte E2E do fluxo crítico (index -> client -> admin -> dashboard) para validação pré-release automática.
