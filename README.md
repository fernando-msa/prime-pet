# 🐾 Prime Pet

Aplicação web estática para formalizar contratos de prestação de serviços de pet shop e enviar os dados preenchidos diretamente para o WhatsApp.

[![Deploy na Vercel](https://img.shields.io/badge/deploy-vercel-black?style=flat-square&logo=vercel)](https://prime-pet.vercel.app)
![HTML](https://img.shields.io/badge/html-100%25-orange?style=flat-square&logo=html5&logoColor=white)
![Licença MIT](https://img.shields.io/badge/licença-MIT-green?style=flat-square)

## 📌 Visão geral

O **Prime Pet** foi desenvolvido para simplificar o cadastro de clientes e pets em serviços como banho, tosa e visita domiciliar.

O fluxo é simples:
1. O tutor preenche o formulário.
2. O sistema valida os campos obrigatórios.
3. O conteúdo é formatado automaticamente em texto.
4. O WhatsApp é aberto com a mensagem pronta para envio.

> Projeto sem backend e sem banco de dados: tudo acontece no navegador.

## ✨ Funcionalidades

- Cadastro completo do tutor (nome, telefone, endereço e data).
- Cadastro do pet (nome, raça, idade, peso e sexo).
- Perguntas condicionais para saúde (vacinas, doenças, medicações e alergias).
- Informações comportamentais (agressividade e tendência de fuga).
- Seleção de serviços e preferências de atendimento.
- Autorizações importantes (emergência veterinária e uso de imagem).
- Exibição da política de cancelamento no próprio formulário.
- Geração e envio da mensagem via `wa.me`.

## 🧱 Stack utilizada

- **HTML5**
- **CSS3** (responsivo, com variáveis CSS)
- **JavaScript puro (Vanilla JS)**
- **Google Fonts**
- **WhatsApp API (`wa.me`)**

## 🚀 Executando localmente

Como é um projeto estático, não há instalação de dependências.

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
├── index.html                  # Formulário principal
├── admin.html                  # Página administrativa auxiliar
├── client.html                 # Página de cliente
├── privacy.html                # Política de privacidade
├── manifest.webmanifest        # Manifesto PWA
├── sw.js                       # Service Worker (cache offline)
├── firebase.realtime.rules.json
├── favicon.svg
├── LICENSE
└── README.md
```

## ⚙️ Personalização rápida

No `index.html`, você pode ajustar:

- **Número de WhatsApp de destino** (`const numero = '...'`).
- **Nome da marca** (título e textos de cabeçalho/rodapé).
- **Links de contato** (Instagram e telefone).
- **Textos de política e termos** conforme o seu negócio.

## 🧭 Auditoria e roadmap de evolução

Para uma visão objetiva de melhorias de recursos e layout alinhadas ao mercado, consulte:

- [Auditoria do repositório (Abril/2026)](./AUDITORIA_MELHORIAS_2026.md)

## 🌐 Deploy

O projeto está publicado em:

- https://prime-pet.vercel.app

Para novo deploy, você pode usar Vercel com integração direta ao GitHub.

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja [LICENSE](LICENSE) para mais informações.
