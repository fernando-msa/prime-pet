# Changelog

Todas as mudanças relevantes deste projeto devem ser registradas neste arquivo.

O formato segue o padrão **Keep a Changelog** e versionamento semântico (**SemVer**).

## [Unreleased]

### Added

- Sem mudanças registradas.

### Fixed

- Sem mudanças registradas.

## [2026.4.2] - 2026-04-20

### Added

- Seção de clareza da proposta no README (problema, público e uso real).
- Seção visual no README com screenshots e GIF de execução do produto.
- Script de smoke QA para Windows PowerShell (`scripts/qa_smoke.ps1`).
- Documento de hardening com evidências de segurança e validação ponta a ponta (`docs/planning/SECURITY_HARDENING_2026-04.md`).

### Changed

- Atualização da API v2 para `bcrypt@^6.0.0` e `typescript@^5.5.4`.
- README atualizado com comandos de validação da API v2 no PowerShell usando `npm.cmd`.

### Fixed

- Ajuste de ownership nos slots de agendamento para reduzir risco de alteração indevida por usuário autenticado.
- Validação robusta de URL de webhook no admin (HTTPS público, sem localhost/rede interna).
- Renderização segura no dashboard para mitigar injeção de HTML em dados dinâmicos.

### Security

- Vulnerabilidades transitivas de `tar` removidas após upgrade de `bcrypt`.
- Resultado atual de auditoria na API v2: `npm audit` sem vulnerabilidades.

## [2026.4.0] - 2026-04-04

### Added (2026.4.0)

- Organização inicial do roadmap em fases com critérios de pronto.
- Base de documentação de release orientada por changelog.

---

## Template para próximas releases

```md
## [X.Y.Z] - YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Security
- ...
```
