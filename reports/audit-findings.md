# Auditoria de Segurança e Boas Práticas — Prime Pet

Data: 2026-05-02

Resumo

- Objetivo: identificar usos inseguros de DOM, pontos de armazenamento local e
  chamadas a funções remotas que merecem revisão.
- Escopo: todo workspace; foco inicial no frontend. Correções críticas
  aplicadas em `admin.html` para mitigar XSS.

Principais achados

<!-- markdownlint-disable MD013 -->

| Arquivo | Linha | Padrão | Risco | Observação | Recomendação |
| --- | ---: | --- | --- | --- | --- |
| [admin.html](admin.html#L1431) | 1431 | `innerHTML` (substituído) | Alto | Construção dinâmica de HTML com dados do banco — mitigado (substituído por DOM seguro). | Usar `textContent`/createElement; manter testes. |
| [admin.html](admin.html#L1503) | 1503 | `innerHTML` (substituído) | Alto | Card de histórico montado com template (mitigado). | Verificar restantes. |
| [admin.html](admin.html#L1856) | 1856 | `innerHTML` (substituído) | Alto | Cards de agendamento com atributos `onclick` convertidos para `addEventListener`. | Manter padrão de event listeners. |
| [client.html](client.html#L448) | 448 | `innerHTML` | Médio | Montagem de componentes UI com HTML template e variáveis. | Preferir `textContent`/createElement; escapar dados do usuário. |
| [client.html](client.html#L452) | 452 | `innerHTML` | Médio | Templates multi-linha com interpolação. | Modularizar e sanitizar. |
| [index.html](index.html#L1512) | 1512 | `innerHTML` | Médio | Calendário/grade gerada por strings. | Reescrever como DOM builder. |
| [dashboard.html](dashboard.html#L118) | 118 | `innerHTML` | Médio | `tbody.innerHTML = ''` e reconstrução por string. | Usar `removeChild`/createElement para linhas. |
| [assets/js/layout-v2-shell.js](assets/js/layout-v2-shell.js#L15) | 15 | `innerHTML` | Baixo | Marca do shell usa `innerHTML` com marcação conhecida. | OK se controlado; preferir `textContent` + element creation para spans. |
| [assets/js/api-v2-migration-bridge.js](assets/js/api-v2-migration-bridge.js#L8) | 8 | `localStorage.setItem` | Médio | Armazenamento de modo/tenant/token (verificar sensibilidade). | Garantir que tokens sensíveis NÃO fiquem em localStorage. |
| [admin.html](admin.html#L1067) | 1067 | `localStorage.getItem` | Médio | Métricas locais em storage (`METRICS_KEY`). | Limitar retenção; não armazenar dados sensíveis. |
| [admin.html](admin.html#L991-L994) | 991-994 | `httpsCallable` | Médio | Chamadas a Callables do Functions: `getOperationalWebhook`, `setOperationalWebhook`, `testOperationalWebhook`, `notifyOperationalEvent`. | Validar regras e tratamento de erros; rate limiting no backend. |
| [admin.html](admin.html#L1262) | 1262 | `signInWithPopup` | Médio | Fluxo de login com Google. | Validar isAdminAutorizado; tratar rejeições e timeout UX. |

<!-- markdownlint-enable MD013 -->

Observações adicionais

- Não foram encontrados usos de `eval`, `new Function` ou `document.write` no
  workspace.
- Há múltiplos usos de `localStorage` em `client.html`, `admin.html`, e
  `assets/js/*`. Revisar o que é armazenado - evitar tokens de auth.
- Firebase Functions `httpsCallable` devem ter validação no servidor
  (autorização, sanitização).

Ações recomendadas (prioridade)

- P0 (crítico): Garantir que todo `innerHTML` dinâmico seja removido ou use
  escapes. (já aplicado em `admin.html`).
- P1 (alta): Auditar `client.html` e `index.html` para reescrever templates que
  montam HTML via strings.
- P2 (média): Revisar uso de `localStorage` para sensíveis, adicionar
  documentação e limpar retenção histórica (metrics).
- P2 (média): Adicionar CSP no `index.html` e headers no backend para reduzir
  risco de XSS/external script injection.
- P3 (baixa): Modularizar scripts inline em `admin.html` para `assets/js` e
  adicionar JSDoc (parte iniciada).

Próximos passos sugeridos

1. Gerar PR com as mudanças aplicadas em `admin.html` (posso criar o commit/PR
   se desejar).
2. Refatorar `client.html` e `index.html` como tarefas separadas (posso
   automatizar alterações repetitivas).
3. Rodar `npm run lint` em `api-v2` e `npm audit` para dependências; revisar
   callables do Functions.

Arquivo CSV com detalhes também gerado: `reports/audit-findings.csv`.

---
Se quiser, gero já o PR com estas mudanças críticas e agendo as refatorações
por arquivo (sugiro começar por `client.html`).
