# Prova de maturidade do produto (Abr/2026)

Este documento consolida evidências objetivas de maturidade para apresentação de produto, operação e stakeholders.

## 1) Evidências visuais reais do fluxo

### Capturas atuais versionadas

- Cliente: `assets/screenshots/fluxo-cliente.svg`
- Admin: `assets/screenshots/fluxo-admin.svg`
- Dashboard: `assets/screenshots/fluxo-dashboard.svg`
- Materiais de demo: `assets/screenshots/checklist-demo.svg`, `assets/screenshots/score-demo.svg`, `assets/screenshots/pdf-demo.svg`

### Critério de qualidade de screenshot

- Mostrar dados plausíveis (sem lorem ipsum) e estado real de operação.
- Incluir cabeçalho com data da captura e versão do release na legenda da imagem.
- Atualizar screenshots no fechamento de cada release funcional.

## 2) Ambiente de demo destacado

### Endpoints de demonstração

- Produção (demo pública): [prime-pet.vercel.app](https://prime-pet.vercel.app)
- Entrada pública: `index.html`
- Portal cliente: `client.html`
- Painel admin: `admin.html`
- Dashboard: `dashboard.html`
- Página de pitch visual: `demo.html`

### Roteiro curto da demo (7 minutos)

1. Abrir `demo.html` e contextualizar proposta de valor.
2. Executar fluxo de entrada em `index.html`.
3. Mostrar acompanhamento do cliente em `client.html`.
4. Fechar ciclo operacional em `admin.html`.
5. Encerrar com indicadores em `dashboard.html`.

## 3) Releases versionadas (cadência)

### Política mínima

- Versionamento semântico em trilha `MAJOR.MINOR.PATCH`.
- Todo release deve ter:
  - tag de versão;
  - atualização do `CHANGELOG.md`;
  - checklist operacional concluído (`docs/legacy/RELEASE_MINIMO_CHECKLIST.md`);
  - evidências visuais atualizadas.

### Exemplo de janela de release

- Janela semanal: sexta-feira, 16h-18h.
- Hotfix: sob demanda com entrada direta em patch.

## 4) Quadro simples de métricas de produto

### Snapshot sugerido (preencher por release)

| Métrica | Definição | Fonte | Meta inicial | Atual (release) |
| --- | --- | --- | --- | --- |
| Conversão formulário -> pedido enviado | % de sessões que enviam pré-cadastro | Eventos de funil | >= 35% | _preencher_ |
| Confirmação operacional em 24h | % de pedidos pendentes resolvidos em 24h | Appointments + status | >= 85% | _preencher_ |
| Taxa de remarcação | % de pedidos remarcados por período | Histórico de pedidos | <= 20% | _preencher_ |
| SLA de resposta admin | Tempo mediano até primeira decisão | Timeline operacional | <= 4h | _preencher_ |
| Reativação de clientes | % de clientes com novo pedido em 60 dias | Base clientes + pedidos | >= 18% | _preencher_ |

## 5) Roadmap entregue com rastreabilidade

### Fonte de execução

- Roadmap por fases: `docs/planning/ROADMAP_PROJECTS_MILESTONES.md`
- Backlog executável: `docs/planning/NEXT_STEPS_ISSUES.md`
- Changelog por release: `CHANGELOG.md`

### Definição de entregue por fase

Uma fase é considerada entregue quando:

1. Itens críticos da milestone estão em Done.
2. Release publicada e registrada.
3. Evidências visuais atualizadas.
4. Snapshot de métricas preenchido.
