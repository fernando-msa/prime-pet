<h1 align="center">
  🐾 Prime Pet
</h1>

<p align="center">
  Formulário de contrato de prestação de serviços para pet shop, com envio direto via WhatsApp.
</p>

<p align="center">
  <a href="https://prime-pet.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/deploy-vercel-black?style=flat-square&logo=vercel" alt="Deploy na Vercel">
  </a>
  <img src="https://img.shields.io/badge/html-100%25-orange?style=flat-square&logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/licença-MIT-green?style=flat-square" alt="Licença MIT">
</p>

---

## 📋 Sobre o projeto

O **Prime Pet** é uma página web que funciona como um contrato digital de prestação de serviços para donos de pet shop. O tutor preenche os dados do seu animal e, ao finalizar, todas as informações são formatadas automaticamente e enviadas ao responsável pelo WhatsApp — sem necessidade de backend ou banco de dados.

🔗 **Demo ao vivo:** [prime-pet.vercel.app](https://prime-pet.vercel.app)

---

## ✨ Funcionalidades

- **Dados do tutor** — nome, telefone, endereço e data
- **Dados do pet** — nome, raça, idade, peso e sexo
- **Condições de saúde** — vacinação, doenças, medicações e alergias (com campos condicionais)
- **Comportamento** — perfil do animal, histórico agressivo, tendência de fuga
- **Serviços contratados** — banho e/ou visita domiciliar, dias, horário e forma de pagamento
- **Autorizações** — atendimento veterinário emergencial e uso de imagem
- **Política de cancelamento** — exibição das regras de vigência e aviso prévio
- **Envio via WhatsApp** — gera uma mensagem formatada e abre direto no WhatsApp do responsável

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura e marcação semântica |
| CSS3 | Estilização com variáveis CSS e design responsivo |
| JavaScript (Vanilla) | Lógica de campos condicionais, validação e formatação da mensagem |
| Google Fonts | Tipografia (`Playfair Display` + `DM Sans`) |
| WhatsApp API (`wa.me`) | Envio do contrato preenchido |
| Vercel | Hospedagem e deploy contínuo |

---

## 🚀 Como usar localmente

Não há dependências nem build necessário. Basta clonar e abrir o arquivo:

```bash
git clone https://github.com/fernando-msa/prime-pet.git
cd prime-pet
# Abra o index.html no navegador
```

---

## 📁 Estrutura

```
prime-pet/
├── index.html   # Aplicação completa (HTML + CSS + JS em arquivo único)
├── README.md
└── LICENSE
```

---

## ⚙️ Personalização

Para adaptar o formulário ao seu pet shop, edite as seguintes linhas no `index.html`:

| O que alterar | Onde encontrar no código |
|---|---|
| Número de WhatsApp | `const numero = '5579996623050'` |
| Nome do estabelecimento | Tag `<title>` e `.header-title` |
| Instagram | Link `@Prime_Pet` no rodapé |
| Telefone de contato | Link `tel:` no rodapé |

---

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Feito por <a href="https://github.com/fernando-msa">@fernando-msa</a>
</p>
