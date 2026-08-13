# CLAUDE.md

## Project
Environment and AI Toolchain capstone project.

## Stack
- Language: TBD
- Framework/libraries: TBD
- Version control: Git, Conventional Commits

## Conventions
- Commit format: Conventional Commits (feat:, fix:, docs:, refactor:, test:, chore:)
- Code style: Use clear, readable, and consistent code.
- Folder structure: Keep project files organized into appropriate folders.

## Notes for Claude Code
- This is a capstone under academic evaluation — favor clear, well-commented,
  defensible code over cleverness, since I need to explain design choices to examiners.
- Ask before making sweeping structural changes.

## Development Rules

1. **Form validation:** All forms must use explicit validation rules for required fields and relevant edge cases. For name fields, numeric-only input must be rejected.

2. **Accessibility:** Every form input must have an associated label, appropriate input type/autocomplete attributes, accessible validation errors, and a visible keyboard focus state.

3. **Testing and verification:** Every new form feature must include automated tests for valid input, invalid input, required fields, important edge cases, and successful submission. Tests and the production build must be run before the feature is considered complete.