# Repository Guidelines

## Operational Commands

Use Bun and preserve `bun.lock`; do not introduce another package-manager lockfile.

- `bun install`: install dependencies.
- `bun run dev`: launch the watched API and Vite together.
- `bun run server`: launch only the watched API.
- `bun run build`: check configured TypeScript projects and build the frontend.
- `bun run lint`: run ESLint, including Hooks and refresh rules.
- `bun run test`: run Vitest once; `bun run test:watch` starts watch mode.
- `bun run preview`: serve the frontend build; the API must run separately.

For code changes, run applicable checks before completion. Documentation-only changes need link, command, and evidence validation rather than an application rebuild.

## Golden Rules

- **Security boundary:** Keep environment credentials server-side and out of commits. `/api/config` must expose availability booleans, never key values. Evidence: `server/index.ts:59`, `server/index.ts:147`, `.gitignore:32`.
- **Runtime contract:** Coordinate generation-prompt, normalization, and preview changes. The preview uses `noInline` and requires executable `render(...)` output. Evidence: `server/index.ts:12`, `server/index.ts:188`, `src/components/LivePreview.tsx:14`.
- **Validation boundary:** Do not describe a successful build as server type-checking or end-to-end validation. TypeScript includes only `src` and Vite configuration; Vitest explicitly includes server unit tests. Evidence: `tsconfig.app.json:27`, `tsconfig.node.json:25`, `vite.config.ts:20`.
- **Development routing:** Change API port and proxy target together; production hosting requires its own routing. Evidence: `server/index.ts:139`, `vite.config.ts:11`.

## TDD Rule

**이 규칙은 Rigid — 상황에 맞게 변형하지 마라.**

### 적용 기준 및 우선순위

- **반드시 적용:** 비즈니스 로직, API 요청·응답·검증, 유틸리티 함수, 동작 오류를 고치는 버그 수정.
- **TDD 불필요:** 타입 정의만 변경, 설정 파일, 로직 없는 순수 UI·스타일·레이아웃, SQL 작성·수정. 필요한 빌드·정적 검사·화면·쿼리 검증까지 생략한다는 뜻은 아니다.
- 파일 확장자가 아닌 **변경 동작**으로 판단한다. UI 파일 안의 비즈니스 로직이나 API 처리는 적용 대상이다. 적용·제외 대상이 섞이면 적용 대상에 TDD를 수행한다.
- 이 섹션은 **전역 기본값(fallback)** 이다. 작업 대상에 적용되는 **하위 디렉토리 `AGENTS.md`에 별도 TDD 규칙이 있으면 그 규칙을 우선**한다. 일반 테스트 안내만으로 이 기본값이 해제되지는 않는다.

### RED-GREEN-REFACTOR

1. **RED — 실패하는 테스트부터 작성한다.**
   - **하나의 동작 = 하나의 테스트.** 기대 결과를 명확히 하고, 버그 수정은 재현 테스트부터 작성한다.
   - 테스트를 **반드시 실행해 실패를 확인**한다. 실패 이유는 **기능 미구현**, 즉 요청한 동작이 아직 구현되지 않았기 때문이어야 한다.
   - 문법 오류, 잘못된 import, 환경·테스트 설정 문제로 인한 실패는 RED로 인정하지 않는다. 이를 해결하고 동작 검증의 실패를 다시 확인한다.
   - 처음부터 통과하면 테스트가 새 동작을 검증하는지 확인하고 올바른 RED를 만든다.
2. **GREEN — 통과에 필요한 최소 코드만 작성한다.**
   - 현재 실패한 테스트를 만족하는 구현에 한정한다. **YAGNI:** 미래 기능, 불필요한 추상화, 요청하지 않은 옵션을 추가하지 않는다.
   - 테스트를 약화하거나 건너뛰어 통과시키지 않는다. **신규 테스트와 기존 테스트가 모두 통과**하는지 실행해 확인한다.
3. **REFACTOR — 동작을 유지하며 정리한다.**
   - 중복 제거, 이름 개선, 헬퍼 추출만 수행한다. **새 동작 추가는 금지**한다.
   - 변경 후 테스트를 실행해 **GREEN을 유지**한다. 실패하면 다음 동작으로 넘어가기 전에 복구한다.
4. **반복:** 다음 동작 하나를 선택하고 **RED로 돌아간다**. 모든 동작이 완료될 때까지 반복한다.

### 삭제 강제 규칙

TDD 적용 대상에서 **테스트 전에 프로덕션 코드를 먼저 작성했다면 해당 선행 구현을 삭제하고 RED부터 재시작**한다. 주석, 별도 파일, 복사본 등 **"참고용"으로 남기는 것도 금지**한다. 기존 코드나 사용자의 별도 변경이 아닌, 이번 작업에서 테스트보다 먼저 작성한 구현에 적용한다.

### 변명 차단표

| 변명 | 반론 |
|---|---|
| "너무 단순해서 테스트 불필요" | 단순함은 제외 기준이 아니다. 적용 대상이면 작은 테스트 하나로 시작한다. |
| "나중에 추가하겠다" | 사후 테스트는 TDD가 아니다. 지금 RED부터 시작한다. |
| "시간이 없다" | 범위를 동작 하나로 줄인다. RED 확인을 생략하지 않는다. |
| "삭제하면 낭비" | 선행 구현을 보존할 이유가 되지 않는다. 삭제하고 검증 가능한 순서로 다시 구현한다. |
| "프로토타입이다" | 프로토타입도 적용 대상이면 동일하다. 이름으로 예외를 만들지 않는다. |

## Project Context

React 19, TypeScript, Vite 8, Bun, react-live, Vitest. Product behavior and setup are documented in [README.md](README.md).

## Standards & References

Use two-space indentation, single quotes, functional components, explicit prop types, and type-only imports. Match local semicolon style; no formatter is configured. Name components `PascalCase.tsx`, hooks `useCamelCase.ts`, and colocated tests `*.test.ts(x)`.

Commit independent purposes separately using `feat/fix/refactor/chore: 한국어 요약`. When a commit is requested, follow [.agents/skills/commit/SKILL.md](.agents/skills/commit/SKILL.md) without an additional approval step. Do not infer a commit request from file creation. PRs should state behavior, verification, related issues, and UI screenshots when relevant.

Maintenance: when rules diverge from code, propose a focused update and refresh evidence locations. Evidence paths below and in nested guides are repository-relative.

## Context Map

- **[Changing UI, state, or previews](src/AGENTS.md)** — apply frontend constraints and interaction checks.
- **[Changing API calls or response normalization](server/AGENTS.md)** — apply provider-specific behavior and server test boundaries.
