# Prime Pet

[![Deploy na Vercel](https://img.shields.io/badge/deploy-vercel-black?style=flat-square&logo=vercel)](https://prime-pet.vercel.app)
![HTML](https://img.shields.io/badge/html-100%25-orange?style=flat-square&logo=html5&logoColor=white)
![Licenca MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-green?style=flat-square)

Plataforma web para agendamento e gestao de servicos pet (passeios e banhos). Conecta tutores a equipe operacional por meio de um fluxo completo: pre-cadastro publico, portal do cliente, painel administrativo e dashboard de metricas.

O projeto esta em migracao progressiva para uma arquitetura SaaS multi-tenant (API v2 com NestJS + Prisma), enquanto o frontend legado permanece ativo com uma camada de bridge para alternancia gradual entre os modos.

---

## Funcionalidades

**Formulario publico (`index.html`)**
- Pre-cadastro completo (tutor, pet, saude, comportamento e servicos)
- Calendario com bloqueio de finais de semana, datas passadas e feriados de Sergipe
- Integracao com WhatsApp via `wa.me`

**Portal do cliente (`client.html`)**
- Autenticacao Google ou e-mail/senha
- Historico de pedidos com numeracao amigavel
- Fluxo visual de etapa (pendente / confirmado / cancelado)
- Edicao e remarquacao quando permitido
- Assistente de duvidas (FAQ + fallback suporte)

**Painel administrativo (`admin.html`)**
- Leitura de agendamentos em tempo real
- Confirmacao, cancelamento e liberacao de slots
- Historico de clientes, acoes e erros
- Exportacao em CSV, JSON e Google Agenda
- Webhook de notificacao para automacoes externas (n8n, Make, Zapier)
- Sessao com timeout idle de 15min e limite maximo de 8h

**Dashboard de metricas (`dashboard.html`)**
- KPIs operacionais: total, pendentes, confirmados, cancelados, taxa de confirmacao

---

## Arquitetura

```
                          ┌─────────────────┐
  Tutor / Cliente         │  index.html      │
  (formulario publico) ──▶│  client.html     │──▶ Firebase Auth
                          │  admin.html      │──▶ Firestore
  Admin                   │  dashboard.html  │──▶ Cloud Functions
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │  api-v2 (NestJS) │──▶ PostgreSQL
                          │  JWT + Prisma    │    (multi-tenant)
                          └──────────────────┘
```

O frontend legado e composto por paginas HTML estaticas com JavaScript vanilla, sem build step. A API v2 (`api-v2/`) e um backend NestJS com Prisma ORM que suporta PostgreSQL e MySQL, com autenticacao JWT e isolamento por tenant.

A camada de bridge (`assets/js/api-v2-migration-bridge.js`) permite alternar entre o modo legado (Firebase direto) e o modo v2 (API NestJS) via localStorage ou parametro de URL.

---

## Stack tecnica

| Camada | Tecnologias |
|---|---|
| **Frontend** | HTML5, CSS3 (variaveis, responsivo), JavaScript vanilla, PWA (manifest + service worker) |
| **Autenticacao** | Firebase Auth (Google + e-mail/senha), JWT (API v2) |
| **Banco de dados** | Cloud Firestore (legado), PostgreSQL via Prisma (v2) |
| **Backend** | Firebase Cloud Functions (Node.js 20), NestJS 11 (v2) |
| **Infraestrutura** | Vercel (frontend), Firebase Hosting, Firebase Functions |

---

## Inicio rapido

### Frontend (estatico, sem build)

```bash
git clone https://github.com/fernando-msa/prime-pet.git
cd prime-pet
# Abra index.html no navegador
```

### Smoke QA

```bash
# Linux / macOS
./scripts/qa_smoke.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File .\scripts\qa_smoke.ps1
```

### API v2

```bash
cd api-v2
npm install
cp .env.example .env    # Configure DATABASE_URL e JWT_SECRET
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

No Windows PowerShell, use `npm.cmd` em vez de `npm` para evitar bloqueio de politica de execucao.

---

## Estrutura do projeto

```text
prime-pet/
├── index.html                    # Formulario publico + pre-cadastro
├── client.html                   # Portal do cliente
├── admin.html                    # Painel administrativo
├── dashboard.html                # Dashboard de metricas
├── privacy.html                  # Politica de privacidade / LGPD
├── demo.html                     # Landing page de demonstracao
├── maintenance.html              # Pagina de manutencao
├── manifest.webmanifest          # Manifesto PWA
├── sw.js                         # Service Worker
├── firestore.rules               # Regras de seguranca do Firestore
├── firestore.indexes.json        # Indices compostos
├── firebase.json                 # Configuracao do Firebase
├── scripts/
│   ├── firestore-rtdb-compat.js  # Compatibilidade RTDB → Firestore
│   ├── set-admin-claim.js        # CLI para definir claim admin
│   ├── check-claims.js           # CLI para inspecionar claims
│   └── qa_smoke.*                # Scripts de smoke test
├── functions/
│   ├── index.js                  # Cloud Functions (webhook, vacinas)
│   └── package.json
├── assets/
│   ├── css/                      # Layout v2 CSS
│   ├── js/                       # Layout v2 JS + migration bridge
│   └── screenshots/              # Screenshots do produto
├── api-v2/                       # Backend NestJS + Prisma (v2)
│   ├── src/
│   │   ├── modules/              # Modulos: auth, tenants, clients, pets, appointments, etc.
│   │   ├── common/               # Guards, interceptors, decorators
│   │   └── main.ts               # Bootstrap da aplicacao
│   ├── prisma/schema.prisma      # Schema do banco de dados
│   └── package.json
├── docs/                         # Documentacao organizada
│   ├── legacy/                   # Documentacao do legado
│   ├── planning/                 # Roadmap e planejamento
│   └── v2/                       # Documentacao da API v2
├── reports/                      # Relatorios de auditoria
└── LICENSE
```

---

## Seguranca

### Autenticacao e autorizacao

- **Frontend legado**: Firebase Auth com custom claim `admin=true` para acesso administrativo. Verificacao de host autorizado (allowlist de dominios). Timeout idle de 15 minutos e sessao maxima de 8 horas no painel admin.
- **API v2**: JWT com access token (15min) e refresh token (7d). Senhas hasheadas com bcrypt. RBAC via decorator `@Roles('admin')` e `RolesGuard`.

### Regras de banco de dados

- Firestore rules com controle por proprietario (`ownerUid`) e admin (custom claim + fallback em `admin_users/{uid}`).
- Colecoes sensiveis (`ops_config`, `metrics_daily`) com escrita bloqueada no nivel de regras.
- Webhook URLs validadas no backend (HTTPS obrigatorio, bloqueio de IPs privados).

### Headers de seguranca (API v2)

- Helmet habilitado (CSP, X-Frame-Options, X-Content-Type-Options, etc.)
- CORS com origens restritas (whitelist de dominios autorizados)
- Tenant ID validado contra o JWT (prevencao de spoofing cross-tenant)
- JWT secret obrigatorio via variavel de ambiente (sem fallback hardcoded)

### LGPD

Politica de privacidade dedicada em `privacy.html`.

---

## Deploy

### Frontend (Vercel)

O frontend e hospedado na Vercel em [prime-pet.vercel.app](https://prime-pet.vercel.app). Deploy automatico via integracao com GitHub.

### Firebase

```bash
firebase deploy --only firestore:rules,firestore:indexes
firebase deploy --only functions
```

### API v2

A API v2 requer configuracao manual de deploy (Dockerfile ou servico de nuvem). Configure as variaveis de ambiente:

| Variavel | Descricao |
|---|---|
| `PORT` | Porta do servidor (default: 3001) |
| `DATABASE_PROVIDER` | `postgresql` ou `mysql` |
| `DATABASE_URL` | String de conexao do banco de dados |
| `JWT_SECRET` | Chave secreta para assinatura JWT (obrigatoria) |

---

## Documentacao

| Documento | Descricao |
|---|---|
| [CHANGELOG.md](CHANGELOG.md) | Registro de mudancas por release |
| [AUDITORIA_MELHORIAS_2026.md](AUDITORIA_MELHORIAS_2026.md) | Auditoria e roadmap de evolucao |
| [docs/legacy/](docs/legacy/) | Arquitetura, checklist de release, prints de fluxo |
| [docs/planning/](docs/planning/) | Roadmap, proximos passos, evidencias de maturidade |
| [reports/](reports/) | Relatorios de auditoria de seguranca |
| [api-v2/README.md](api-v2/README.md) | Documentacao da API v2 |

---

## Licenca

Este projeto esta sob a licenca MIT. Veja [LICENSE](LICENSE) para detalhes.
