# Server Agent Guidelines

## Module Context

This scope covers AI requests and conversion of responses into preview-compatible code. Provider-specific behavior belongs here; preserve the frontend contract defined by the root guide.

## Tech Stack & Constraints

Bun runtime, TypeScript, native `fetch`. Use `Bun.serve` for routing and keep network-free helpers separate from server startup. Do not import the serving entrypoint into pure unit tests (`server/index.ts:138`, `server/generator.test.ts:2`, `server/fallback.test.ts:2`).

## Implementation Patterns

Keep provider request/response handling explicit. Preserve the `{ code }` success and `{ error }` failure shapes consumed by the frontend (`server/index.ts:190`, `server/index.ts:209`, `src/hooks/useComponentGenerator.ts:29`). Retain CORS headers on new responses and OPTIONS handling (`server/index.ts:51`, `server/index.ts:141`).

## Testing Strategy

Run `bun run test -- server/generator.test.ts server/fallback.test.ts`. Test normalization through pure inputs and fallback through an injected attempt callback. Existing tests cover those helpers, not API routes or upstream response parsing. For route/provider changes, use mocked fetch responses and report any unverified integration behavior. Do not claim live-provider compatibility from unit tests.

## Local Golden Rules

- **Asymmetry:** Google alone uses the ordered model list and fallback helper. Preserve sequential attempts, first-success return, and last-error propagation; do not silently add the same policy to Anthropic. Evidence: `server/index.ts:5`, `server/index.ts:68`, `server/index.ts:135`, `server/fallback.ts:12`, `server/fallback.test.ts:27`.
- **Truncation:** Preserve Google's `MAX_TOKENS` rejection so truncated code does not reach normalization as a successful generation. This check is provider-specific. Evidence: `server/index.ts:123`.
- **Credential precedence:** A client-provided key overrides the environment key. Environment keys are captured at module load; restart the API after changing them. Never log Google's full request URL because it includes the key. Evidence: `server/index.ts:59`, `server/index.ts:65`, `server/index.ts:99`.
- **Double defense:** Keep missing-key and missing-prompt checks on the server even though the UI validates inputs. Direct callers bypass frontend checks. Evidence: `server/index.ts:169`, `server/index.ts:176`, `src/App.tsx:28`, `src/components/PromptInput.tsx:18`.
- **Output contract:** Request import-free JavaScript/JSX with inline styles. Preserve fence removal before render-call repair; the regex helper is not a full parser or sanitizer. Evidence: `server/index.ts:10`, `server/index.ts:20`, `server/index.ts:188`, `server/generator.ts:7`, `server/generator.ts:19`.
- **Error mapping:** Upstream status numbers currently reach the route through error messages. Preserve 429/503 classification when changing error types or text, or update both ends together. Evidence: `server/index.ts:85`, `server/index.ts:112`, `server/index.ts:194`, `server/index.ts:201`.
