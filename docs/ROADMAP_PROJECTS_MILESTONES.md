# Roadmap operacional com Milestones + GitHub Projects

Este guia padroniza a execução do roadmap em **fases**, com rastreabilidade de prazo, escopo e release.

## 1) Milestones por fase

Crie as milestones no GitHub com data-alvo e descrição de pronto.

### Fase 1 — Fundação e Governança
- **Milestone:** `Fase 1 - Fundação`
- **Objetivo:** organizar backlog, padrões de release e qualidade mínima.
- **Entregas sugeridas:**
  - Estrutura do Projects configurada;
  - Changelog versionado;
  - Checklist de release validado.

### Fase 2 — Fluxo Cliente/Admin
- **Milestone:** `Fase 2 - Fluxo operacional`
- **Objetivo:** estabilizar ciclo ponta-a-ponta (cadastro → decisão admin → acompanhamento cliente).
- **Entregas sugeridas:**
  - Regras de validação e status;
  - Cobertura de cenários críticos no smoke QA;
  - Prints atualizados do fluxo real.

### Fase 3 — Automações e Integrações
- **Milestone:** `Fase 3 - Automações`
- **Objetivo:** consolidar webhook, outbox e rotinas em Functions.
- **Entregas sugeridas:**
  - Webhook com observabilidade mínima;
  - Reprocessamento seguro de eventos;
  - Alertas e auditoria operacional.

### Fase 4 — Escala e Inteligência
- **Milestone:** `Fase 4 - Escala e BI`
- **Objetivo:** maturidade de métricas, performance e decisões por dados.
- **Entregas sugeridas:**
  - Dashboard com KPIs de funil e SLA;
  - Otimizações de índices Firestore;
  - Rotina de revisão quinzenal do roadmap.

## 2) GitHub Projects para roadmap (visão única)

Use um único Project (tipo board) com os seguintes campos:

- **Status:** Backlog / Planned / In Progress / In Review / Done
- **Fase:** F1 / F2 / F3 / F4
- **Prioridade:** P0 / P1 / P2
- **Tipo:** Feature / Bug / Tech Debt / Ops / Docs
- **Release alvo:** `vX.Y.Z`
- **Owner:** responsável técnico

### Views recomendadas
- **Roadmap por Fase:** agrupado por `Fase`, ordenado por `Prioridade`.
- **Execução Semanal:** filtrado em `In Progress` + `In Review`.
- **Release Train:** agrupado por `Release alvo`.

## 3) Convenções de issue/tarefa

Título:
- `[{Fase}] {tipo}: {resumo}`
- Ex.: `[F2] feature: remarcação com validação de conflito`

Checklist dentro da issue:
- Critério de aceite funcional;
- Critério de teste;
- Evidência (print/log/link);
- Impacto em release/changelog.

## 4) Cadência operacional

- **Planejamento:** semanal (30 min)
- **Refino do backlog:** quinzenal
- **Fechamento de milestone:** ao atingir critérios de pronto + release publicada

## 5) Definição de pronto por fase

Uma fase só é considerada concluída quando:
1. Todas as issues críticas da milestone estão em `Done`.
2. Release correspondente foi publicada.
3. Changelog do release foi atualizado.
4. Evidências de fluxo (prints) estão versionadas no repositório.
