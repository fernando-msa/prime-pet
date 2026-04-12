# Próximos passos → issues sugeridas

Baseado em `AUDITORIA_MELHORIAS_2026.md`, este arquivo já deixa os títulos e escopos prontos para abertura de issues.

## Prioridade Alta (0–30 dias)
- [ ] **[Roadmap] Modularizar front-end sem quebrar deploy estático**
  - Separar HTML/CSS/JS em módulos (`styles/`, `scripts/`, `components/`).
  - Criar `config/app-config.js` para telefone, links e versão.
- [ ] **[Roadmap] Melhorar acessibilidade (A11y) e UX de formulários**
  - Contraste, foco visível, `aria-live`, navegação por teclado.
  - Máscaras/validações amigáveis e `autocomplete`.
- [ ] **[Roadmap] Endurecimento de segurança e governança de acesso**
  - Remover e-mails fixos de regra e usar custom claims + lista admin.
  - Processo de rotação de acesso e revisão de logs.

## Prioridade Média (31–60 dias)
- [ ] **[Roadmap] Implementar design system leve (tokens + componentes)**
  - Tokens de tipografia, espaçamento, radius, elevação.
  - Componentes base: botão, card, badge, tabs, toast, modal.
  - Incluir modo escuro.
- [ ] **[Roadmap] Entregar recursos de produto de alto impacto**
  - Reagendamento/cancelamento assistido.
  - Timeline de atendimento.
  - Lembretes automáticos.
  - Carteira do pet.
- [ ] **[Roadmap] Instrumentar métricas e crescimento**
  - Eventos de funil (início, abandono, envio, login, reagendamento).
  - KPIs e experimentos A/B simples.

## Prioridade Estratégica (61–90 dias)
- [ ] **[Roadmap] Evoluir experiência PWA**
  - Revisar manifest/service worker, cache crítico e fallback offline.
- [ ] **[Roadmap] Construir backoffice operacional**
  - Agenda com visão diária/semanal, ocupação por faixa e SLA.
  - Filtros avançados e exportações para auditoria/financeiro.
- [ ] **[Roadmap] Implantar qualidade e entrega contínua**
  - Lint/format, regressão visual, E2E crítico e CI pré-merge.

## Como abrir rapidamente
1. Crie uma issue por item acima.
2. Use o template `.github/ISSUE_TEMPLATE/proximo-passo.yml`.
3. Copie os entregáveis como checklist para facilitar acompanhamento.
