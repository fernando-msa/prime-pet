# 🐾 Prime Pet — Formulário de Contrato

> Formulário digital de prestação de serviços para a **Prime Pet – Passeios & Banhos**, hospedado no Vercel e integrado com WhatsApp.

[![Deploy](https://img.shields.io/badge/Vercel-Live-black?style=flat-square&logo=vercel)](https://prime-pet.vercel.app)
[![HTML](https://img.shields.io/badge/HTML-100%25-orange?style=flat-square&logo=html5)](https://github.com/fernando-msa/prime-pet)
[![License](https://img.shields.io/github/license/fernando-msa/prime-pet?style=flat-square)](LICENSE)

---

## ✨ Funcionalidades

- **Formulário completo** com dados do tutor, do pet, condições de saúde, comportamento, serviços e autorizações
- **Campos condicionais** — campos extras aparecem dinamicamente conforme as respostas (doença, medicação, alergia)
- **Envio via WhatsApp** — ao clicar em "Enviar", abre o WhatsApp com a mensagem já formatada com todos os dados preenchidos
- **Validação** — impede envio sem os campos obrigatórios (nome do tutor e do pet)
- **100% estático** — sem backend, sem banco de dados, sem custos

---

## 🚀 Demo

Acesse o formulário em produção:
**[prime-pet.vercel.app](https://prime-pet.vercel.app)**

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 + CSS3 | Interface e estilização |
| JavaScript (Vanilla) | Lógica do formulário e integração WhatsApp |
| Google Fonts | Tipografia (Playfair Display + DM Sans) |
| WhatsApp API (`wa.me`) | Envio dos dados ao dono |
| Vercel | Hospedagem estática gratuita |

---

## 📋 Seções do Formulário

1. **Dados do Tutor** — nome, telefone, endereço
2. **Dados do Pet** — nome, raça, idade, peso, sexo
3. **Condições de Saúde** — vacinação, doenças, medicação, alergias
4. **Comportamento** — perfil, histórico de agressividade, observações
5. **Serviços Contratados** — banho, visita, dias, horário, pagamento
6. **Responsabilidades** — obrigações da Prime Pet e do tutor
7. **Autorizações** — emergência veterinária, uso de imagem

---

## 📦 Como usar localmente

Basta clonar e abrir o `index.html` no navegador — não requer instalação nem servidor:

```bash
git clone https://github.com/fernando-msa/prime-pet.git
cd prime-pet
# abra o index.html no seu navegador
```

---

## 🔄 Deploy

O projeto é deployado automaticamente no **Vercel** a cada push na branch `main`.

Para fazer o deploy manualmente:
1. Faça fork/clone deste repositório
2. Conecte ao Vercel via [vercel.com/new](https://vercel.com/new)
3. Importe o repositório — o Vercel detecta automaticamente que é um site estático

---

## 📱 Fluxo de uso

```
Cliente acessa o link  →  Preenche o formulário
      →  Clica em "Enviar pelo WhatsApp"
      →  WhatsApp abre com mensagem formatada
      →  Cliente envia para o dono da Prime Pet
      →  Dono recebe os dados e entra em contato ✅
```

---

## 📄 Licença

MIT © [fernando-msa](https://github.com/fernando-msa)
