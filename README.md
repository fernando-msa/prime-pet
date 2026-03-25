# 🐾 Prime Pet — Plataforma de Agendamento

Aplicação web estática da **Prime Pet** com:
- formulário público de contratação/agendamento (`index.html`);
- portal do cliente com autenticação Google (`client.html`);
- painel administrativo (`admin.html`).

Projeto hospedado no Vercel e integrado ao Firebase (Auth + Realtime Database).

---

## ✨ Funcionalidades

### 1) Formulário público (Home)
- Coleta dados do tutor e do pet.
- Agenda data/horário com regras de disponibilidade.
- Bloqueia finais de semana e horários fora da janela configurada.
- Salva pré-cadastro no `localStorage` para continuar fluxo no portal.

### 2) Portal do cliente
- Login com Google (`signInWithPopup`).
- Visualização de solicitações vinculadas ao `ownerUid`.
- Edição de dados e remarcação (quando status pendente).
- Filtros rápidos de solicitações por status.

### 3) Portal admin
- Login administrativo via Firebase Auth.
- Gestão de agendamentos (confirmar, cancelar, liberar).
- Busca e filtros por status/data/hora.
- Histórico de clientes e ações administrativas.

---

## 🧱 Stack

- **Frontend:** HTML, CSS e JavaScript (vanilla, sem framework)
- **Auth:** Firebase Authentication (Google Sign-In)
- **Banco:** Firebase Realtime Database
- **Hospedagem:** Vercel

---

## 📁 Estrutura

```txt
.
├── index.html                    # Formulário público
├── client.html                   # Portal do cliente
├── admin.html                    # Portal administrativo
├── firebase.realtime.rules.json  # Regras sugeridas do Realtime Database
├── favicon.svg                   # Ícone do projeto
└── README.md
```

---

## 🚀 Rodando localmente

Como é um projeto estático, você pode abrir os arquivos diretamente no navegador.

```bash
git clone https://github.com/fernando-msa/prime-pet.git
cd prime-pet
```

Depois, abra `index.html` (ou use uma extensão/live server no VSCode).

---

## 🔐 Configuração Firebase (essencial)

### Authentication
1. Habilite **Google** em `Authentication > Sign-in method`.
2. Adicione domínios em `Authentication > Settings > Authorized domains`:
   - `localhost` (desenvolvimento)
   - seu domínio de produção (ex.: `prime-pet.vercel.app`)

### Realtime Database
1. Publique as regras de `firebase.realtime.rules.json`.
2. Confirme que os dados de cliente usam `ownerUid` para vincular registros ao usuário logado.

---

## ✅ Fluxo recomendado

1. Cliente preenche o formulário na home.
2. Sistema cria `pre-cadastro` no navegador.
3. Cliente é direcionado ao portal para autenticar com Google.
4. Após login, cliente acompanha e gerencia suas solicitações.
5. Admin gerencia agenda e confirma/cancela atendimentos.

---

## 🧭 Observações importantes

- Se aparecer erro de domínio no login Google:
  - revise **Authorized domains** no Firebase Auth.
- Se autenticar e não carregar dados:
  - revise regras do Realtime Database e vínculo `ownerUid`.
- O projeto é frontend estático; toda segurança de dados depende das regras do Firebase.

---

## 📄 Licença

MIT © [fernando-msa](https://github.com/fernando-msa)
