# 🐾 Prime Pet

[![Deploy na Vercel](https://img.shields.io/badge/deploy-vercel-black?style=flat-square&logo=vercel)](https://prime-pet.vercel.app)
![HTML](https://img.shields.io/badge/html-100%25-orange?style=flat-square&logo=html5&logoColor=white)
![Licença MIT](https://img.shields.io/badge/licença-MIT-green?style=flat-square)

## 📌 Visão geral

O **Prime Pet** é uma aplicação web com:

- **Formulário público (`index.html`)** para pré-cadastro e solicitação de agendamento;
- **Portal do cliente (`client.html`)** com login, histórico, perfil, status de pedidos e assistente de dúvidas;
- **Painel admin (`admin.html`)** com controle de agenda, confirmações/cancelamentos, histórico e exportações.

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
- **Firebase Realtime Database**
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
├── privacy.html                # Política de privacidade e LGPD
├── manifest.webmanifest        # Manifesto PWA
├── sw.js                       # Service Worker (cache offline)
├── firebase.realtime.rules.json
├── favicon.svg
├── LICENSE
└── README.md
```

## ⚙️ Configuração rápida (Firebase)

O projeto usa Firebase diretamente no front-end. Confira:

- credenciais no bloco `firebaseConfig` de `index.html`, `client.html` e `admin.html`;
- regras do Realtime Database em `firebase.realtime.rules.json`;
- e-mails autorizados de admin em `admin.html` (`ADMINS_AUTORIZADOS`).

Também é possível customizar:

- telefone/links de WhatsApp;
- textos de cabeçalho e rodapé;
- política de privacidade;
- FAQ do assistente via nó `assistente_faq` no Realtime Database.

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
