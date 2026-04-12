# Checklist de release (fluxo mínimo)

Publicar release **somente** após todos os itens abaixo.

## 1) Fluxo principal
- [ ] Pré-cadastro no `index.html` enviado sem erro.
- [ ] Login/consulta no `client.html` funcionando.
- [ ] Confirmação/cancelamento no `admin.html` funcionando.
- [ ] Dashboard básico (`dashboard.html`) com KPIs essenciais.

## 2) Operação e qualidade
- [ ] Checklist operacional validado no fluxo de atendimento.
- [ ] Score de atendimento exibido e registrado.
- [ ] Exportação/preview de PDF validada.
- [ ] Smoke QA (`./scripts/qa_smoke.sh`) sem falhas.

## 3) Segurança e documentação
- [ ] Regras (`firestore.rules`) revisadas.
- [ ] Webhook/admin claims revisados para ambiente alvo.
- [ ] README atualizado com mudanças do fluxo mínimo.
- [ ] Registro de riscos conhecidos (se houver).

## 4) Publicação
- [ ] Criar tag semântica (`vX.Y.Z`).
- [ ] Publicar release notes (o que entrou, riscos, rollback).
- [ ] Validar build/deploy pós-release.
