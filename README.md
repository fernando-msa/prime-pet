# 🐾 Prime Pet

[![Deploy na Vercel](https://img.shields.io/badge/deploy-vercel-black?style=flat-square&logo=vercel)](https://prime-pet.vercel.app)
![HTML](https://img.shields.io/badge/html-100%25-orange?style=flat-square&logo=html5&logoColor=white)
![Licença MIT](https://img.shields.io/badge/licença-MIT-green?style=flat-square)

## 📌 Visão geral

O **Prime Pet** é uma aplicação web com:

- **Formulário público (`index.html`)** para pré-cadastro e solicitação de agendamento;
- **Portal do cliente (`client.html`)** com login, histórico, perfil, status de pedidos e assistente de dúvidas;
- **Painel admin (`admin.html`)** com controle de agenda, confirmações/cancelamentos, histórico e exportações.
- **Dashboard de métricas (`dashboard.html`)** com KPIs operacionais em Firestore.

O fluxo é simples:
1. O tutor preenche o pré-cadastro no formulário.
2. O sistema valida campos, bloqueia datas indisponíveis e abre WhatsApp com resumo.
3. O cliente conclui no portal (login Google/e-mail), acompanha e gerencia pedidos.
4. O admin acompanha pendências e decide confirmar/cancelar/liberar agenda.

## ✨ Funcionalidades

- Pré-cadastro completo (tutor, pet, saúde, comportamento e serviços).
- Calendário com bloqueio de finais de semana, datas passadas e feriados relevantes.
- Portal cliente com:
  - login Google/e-mail,
  - histórico de pedidos,
  - numeração amigável de pedidos,
  - fluxo visual de etapa (pendente/confirmado/cancelado),
  - edição/remarcação quando permitido,
  - assistente rápido (intenção + FAQ no Firebase + fallback suporte).
- Painel admin com:
  - leitura de agendamentos em tempo real,
  - confirmação/cancelamento/liberação de slots,
  - histórico de clientes, ações e erros,
  - exportação em CSV/JSON/Google Agenda,
  - webhook de notificação para automações externas (n8n/Make/Zapier),
  - métricas locais de funil.
- Política de privacidade/LGPD dedicada (`privacy.html`).

## 🧱 Stack utilizada

- **HTML5**
- **CSS3** (responsivo, com variáveis CSS)
- **JavaScript puro (Vanilla JS)**
- **Firebase Authentication** (Google/e-mail)
- **Cloud Firestore** (nova camada recomendada)
- **Camada de compatibilidade RTDB API → Firestore** (`scripts/firestore-rtdb-compat.js`)
- **Firebase Cloud Functions** (automações agendadas)
- **Google Fonts**
- **WhatsApp API (`wa.me`)**
- **PWA** (manifest + service worker)

## 🚀 Executando localmente

Como é um projeto front-end estático, não há instalação de dependências de build.

```bash
git clone https://github.com/fernando-msa/prime-pet.git
cd prime-pet
```

Depois, abra o `index.html` no navegador.

### Verificação rápida (Smoke QA)

```bash
./scripts/qa_smoke.sh
```

## 📁 Estrutura do projeto

```text
prime-pet/
├── index.html                  # Formulário público + pré-cadastro
├── client.html                 # Portal do cliente (login, pedidos, perfil, assistente)
├── admin.html                  # Painel admin (agenda, histórico, exportações, webhook)
├── dashboard.html              # Dashboard de métricas (Firestore)
├── privacy.html                # Política de privacidade e LGPD
├── manifest.webmanifest        # Manifesto PWA
├── sw.js                       # Service Worker (cache offline)
├── firestore.rules
├── firestore.indexes.json
├── scripts/firestore-rtdb-compat.js
├── functions/
│   ├── index.js                # Cloud Functions (alerta de vacina + dispatcher)
│   └── package.json
├── favicon.svg
├── LICENSE
└── README.md
```

## ⚙️ Configuração rápida (Firebase)

O projeto usa Firebase diretamente no front-end. Confira:

- credenciais no bloco `firebaseConfig` de `index.html`, `client.html` e `admin.html`;
- permissão administrativa por **custom claim** `admin=true` no Firebase Auth.

Também é possível customizar:

- telefone/links de WhatsApp;
- textos de cabeçalho e rodapé;
- política de privacidade;
- FAQ do assistente via nó `assistente_faq` no Realtime Database.

## 🔐 Migração concluída: aplicação em Firestore

- `firestore.rules` com regras por usuário autenticado (ownerUid) e perfil admin por custom claim;
- `firestore.indexes.json` com índices para consultas do dashboard e agenda;
- `scripts/firestore-rtdb-compat.js` para manter o código de `client.html` e `admin.html` sem dependência do Realtime Database;
- `dashboard.html` para leitura de métricas usando coleção `appointments`;
- `functions/index.js` com:
  - `enqueueVaccineAlert` (callable) para agendar alerta de vacina;
  - `dispatchVaccineAlerts` (schedule) para enviar alertas pendentes para `notification_outbox`.

### Modelo mínimo sugerido no Firestore

- `admin_users/{uid}`: controle de acesso admin por usuário (`enabled: true`) sem depender apenas de custom claim
- `appointments/{id}`: `ownerUid`, `ownerName`, `petName`, `date`, `hour`, `status`, `createdAt`
- `profiles/{uid}`: preferências do cliente
- `vaccine_alerts/{id}`: fila de lembretes
- `notification_outbox/{id}`: integração com WhatsApp/e-mail via worker externo

### Acesso ao `admin.html` após migração

Você pode liberar acesso de duas formas:

1. **Custom claim** no Auth: `admin=true`; ou
2. Criar documento `admin_users/{uid}` no Firestore com:

```json
{ "enabled": true, "email": "seu-email@dominio.com" }
```

### Deploy (Firestore + Functions)

```bash
firebase deploy --only firestore:rules,firestore:indexes
firebase deploy --only functions
```


## 🎬 Landing/demo visual

Foi adicionada uma página de demonstração mais visual para apresentação comercial e validação do fluxo mínimo:

- `demo.html` (hero, cards de fluxo, galeria de screenshots e próximos passos)
- screenshots em `assets/screenshots/`:
  - `checklist-demo.svg`
  - `score-demo.svg`
  - `pdf-demo.svg`

Abra o arquivo localmente no navegador. Exemplos:

```bash
# macOS
open demo.html

# Linux
xdg-open demo.html

# Windows
start demo.html
```

## 🗂️ Próximos passos em formato de issue

Para transformar o roadmap da auditoria em execução:

- backlog pronto em `docs/NEXT_STEPS_ISSUES.md`
- template de issue em `.github/ISSUE_TEMPLATE/proximo-passo.yml`

## 🚢 Release quando fechar o fluxo mínimo

Checklist operacional para liberação em:

- `docs/RELEASE_MINIMO_CHECKLIST.md`

## 🧭 Auditoria e roadmap de evolução

Para uma visão objetiva de melhorias de recursos e layout alinhadas ao mercado, consulte:

- [Auditoria do repositório (Abril/2026)](./AUDITORIA_MELHORIAS_2026.md)

## 🔔 Notificações e automação

No painel admin, você pode configurar uma URL de webhook para disparar eventos de novos agendamentos pendentes para:

- n8n
- Make
- Zapier
- ou outro endpoint compatível com `POST` JSON.

## 🌐 Deploy

Publicado em: https://prime-pet.vercel.app  
Sugestão de deploy: Vercel com integração ao GitHub.

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja [LICENSE](LICENSE) para mais informações.
