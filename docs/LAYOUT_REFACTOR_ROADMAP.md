# Roadmap de refactor de layout (PrimePet)

## Entregue agora
- Novo passo aplicado: sidebar única global integrada ao shell (substitui sidebars soltas das páginas).
- Novo passo aplicado: ações rápidas globais (FAB), alternância de tema persistida e painel de atalhos.
- Novo passo aplicado: camada de componentes visuais compartilhados (`layout-v2-components.css`) em todas as páginas principais.
- Shell visual unificado (topbar v2) aplicado em:
  - `index.html`
  - `client.html`
  - `admin.html`
  - `dashboard.html`
- Arquivos de design compartilhado:
  - `assets/css/layout-v2-shell.css`
  - `assets/js/layout-v2-shell.js`

## Quanto falta para concluir layout novo
Estimativa atual do refactor visual global: **~32% restante**.

### Fases restantes
1. Padronizar componentes (cards, botões, inputs, tabelas): **30%**
2. Responsividade mobile/tablet em todas as páginas: **20%**
3. Tokens de tema claro/escuro centralizados: **10%**
4. Ajuste fino UX (microinterações, hierarquia visual, acessibilidade): **10%**

## Recomendação de execução
- Fechar primeiro o layout do fluxo crítico:
  1) Cliente (listagem/agendamento)
  2) Admin (agenda + ações)
  3) Dashboard
- Em paralelo, trocar chamadas para `/api/v2` por feature flag.
