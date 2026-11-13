# Frontend Agent Guidelines

## Module Context

This scope covers browser interactions and execution of generated JSX. Apply the root guide first; use the server guide when changing the generation contract.

## Tech Stack & Constraints

React 19, TypeScript, react-live 4, plain CSS. Preserve strict compiler settings and type-only imports (`tsconfig.app.json:14`, `tsconfig.app.json:20`). Generated JSX follows a different syntax contract from application TypeScript.

## Implementation Patterns

Keep network state in the generation hook and UI actions in component callbacks. Extend existing CSS variables and responsive breakpoints rather than adding competing global styles. Maintain keyboard focus and reduced-motion behavior when changing interactions (`src/App.tsx:30`, `src/App.css:130`).

## Testing Strategy

Run `bun run test -- src/components/PromptInput.test.tsx` for existing form behavior. Add colocated behavior tests for changed interactions; use Testing Library roles and user-event, following `src/components/PromptInput.test.tsx:12`.

The shared setup installs jest-dom matchers and cleans up after each test (`src/test/setup.ts:1`). Current UI tests cover the prompt form, not the hook, app configuration, or live execution. Mock `/api/config` and `/api/generate` when adding request-flow tests; confirm actual preview rendering separately when relevant.

## Local Golden Rules

- **Double defense:** Preserve both the form-submit guard and disabled button. Keyboard submission uses the same handler, so button disabling alone is insufficient. Evidence: `src/components/PromptInput.tsx:18`, `src/components/PromptInput.tsx:32`, `src/components/PromptInput.tsx:35`.
- **Provider asymmetry:** UI defaults to Google while an omitted API provider defaults to Anthropic. Always send the selected provider; clear manually entered keys when switching providers. Evidence: `src/App.tsx:16`, `src/App.tsx:53`, `src/hooks/useComponentGenerator.ts:26`, `server/index.ts:161`.
- **State semantics:** Regeneration adds a new result; preview refresh only remounts the existing code. Do not replace either behavior unintentionally. Evidence: `src/components/ComponentCard.tsx:33`, `src/components/ComponentCard.tsx:41`, `src/components/ComponentCard.tsx:70`, `src/hooks/useComponentGenerator.ts:42`.
- **Execution boundary:** Preserve runtime error display and do not describe the current preview as an iframe sandbox. It directly renders through react-live. Evidence: `src/components/LivePreview.tsx:14`, `src/components/LivePreview.tsx:18`.
- **Data contract:** Keep `createdAt` as a `Date` in frontend state. Any future persistence must restore dates before rendering time labels. Evidence: `src/types/index.ts:7`, `src/hooks/useComponentGenerator.ts:39`, `src/components/ComponentCard.tsx:18`.
