# Roadmap de refactor de layout (PrimePet)

## Entregue agora
- Novo passo aplicado: ajustes de acessibilidade (focus states), dark mode consolidado e melhorias de responsividade mobile no shell/FAB.
- Novo passo aplicado: remoção da sidebar global; navegação única no cabeçalho superior.
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
Estimativa atual do refactor visual global: **~18% restante**.

### Fases restantes
1. Ajuste fino por página (tipografia/spacing): **8%**
2. Revisão final mobile/tablet por fluxo: **5%**
3. QA visual e acessibilidade (contraste/teclado): **5%**

## Recomendação de execução
- Fechar primeiro o layout do fluxo crítico:
  1) Cliente (listagem/agendamento)
  2) Admin (agenda + ações)
  3) Dashboard
- Em paralelo, trocar chamadas para `/api/v2` por feature flag.
