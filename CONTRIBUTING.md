## General

- ALWAYS keep local development fast to start and reflect changes.
- NEVER contribute changes that increase start or change-reflection time.
- ALWAYS use ESM-first and TypeScript-first code.
- ALWAYS keep code simple.
- ALWAYS write code readable without comments.
- ONLY solve current problem.
- NEVER future-proof.
- NEVER use Chinese boxes.
- NEVER solve absent problems.
- NEVER add unneeded features.
- NEVER add unneeded abstractions.
- ONLY add comments when clarity absolutely requires them.
- ALWAYS use descriptive variable and function names.
- UNLESS otherwise specified, ALWAYS write all text in English, including README files, UI copy, comments, and symbols.
- IF requirements are unclear THEN ask for clarification.
- ALWAYS ask confirmation for design decisions.
- ALWAYS answer and code in English.
- ALWAYS use ASD-STE100 Simplified Technical English.
- NEVER be chatty or verbose.
- ALWAYS state point directly.
- NEVER use dashes.
- NEVER use emojis.
- NEVER write walls of text.
- IF plan is too complex THEN use HTML to visualize changes.
- IF user asks for clarification THEN use ELI12 mode.
- NEVER install dependencies without user confirmation.

## Code

- ALWAYS follow current `biome` configuration.
- NEVER repeat code.
- NEVER over-complicate or over-engineer code.
- IF simple helper solves problem THEN use simple helper.
- NEVER use optional chaining to silence access to possibly falsy object properties.
- NEVER use nested ternaries.
- NEVER use `readonly`, `private`, or `override`.
- ALWAYS prefer `async`/`await` with `try`/`catch` over explicit promises.
- NEVER use promise chaining.
- IF explicit promise is strictly necessary THEN use `Promise.withResolvers()`.
- ALWAYS assign call result to dedicated local variable or constant before returning it.
- NEVER directly return inline calls.
- ALWAYS leave one blank line between class methods.
- ALWAYS leave one blank line between distinct route definitions.
- ALWAYS leave one blank line before control blocks.
- ALWAYS leave one blank line before block explanatory comments.
- ALWAYS use `import`/`export`.
- NEVER use CommonJS, `require`, or `module.exports`.
- ALWAYS use TypeScript `type` over `interface`.
- IF type is shared across layers THEN use Zod type inference.
- IF type is layer-internal THEN use dedicated type.
- ALWAYS prefer arrow functions over classes.
- ONLY use classes to maintain internal state.
- ALWAYS prefer named exports.
- ONLY use default exports for app entrypoint, singletons, and database connection.
- ALWAYS prefer pure functions.
- ALWAYS make functions do one thing.
- IF function exceeds about 40 lines THEN consider splitting it.
- NEVER use callbacks.
- IF callback is forced THEN wrap it with `node:util` `promisify`.
- ALWAYS use object-destructured named parameters.
- ALWAYS define named input type for function parameters.
- IF return value is multiple values or complex object THEN define named return type.
- IF function returns single primitive THEN NEVER use named types.
- Entity: ALWAYS define type in `services/types`.
- Controller request payload: ALWAYS define type in `services/types`.
- Controller response payload: ALWAYS define type in `services/types`.
- ALWAYS prefer typing readability.
- Table: ALWAYS use plural name.
- Entity type: ALWAYS use singular name.
- Entity: ALWAYS define `Row` type for raw `select` data.
- Entity: ALWAYS define `RowInsert` type for allowed and required raw `insert` data.
- Entity: ALWAYS define `RowUpdate` type for allowed raw `update` data.
- Entity: ALWAYS define entity type for joined data or computed attributes.
- Entity: ALWAYS define `FormValues` type for browser-collected raw insertion data.

## Frontend

- ALWAYS use functional React components and hooks.
- Component: ALWAYS use filename matching component name.
- Component: ALWAYS use `export const Component = () => {}` export syntax.
- Component: ALWAYS define and use `<ComponentName>Props` type above component.
- Component: ALWAYS import built-in React hooks through `React` namespace.
- ONLY use `useMemo` or `useCallback` when React Compiler does not optimize them and performance benefit outweighs
  maintenance overhead.
- ONLY use custom hooks when reuse or performance benefit outweighs maintenance overhead.
- ONLY use external libraries when strictly necessary.
- ALWAYS evaluate external-library bundle-size impact.
- JSX: NEVER use nested ternaries.
- JSX: NEVER use ternaries with `null` branch; use `{!!condition && <Element />}` for conditional rendering.
- JSX ternaries: ONLY use simple, single-line binary rendering: `{condition ? <A /> : <B />}`.
- Complex, multiline, or multi-branch JSX rendering: ALWAYS use guard clauses or early returns.
- ALWAYS use Tailwind utility classes.
- Frequently reused Tailwind utilities: ALWAYS compose classes with `@apply` in `theme.css`.
- NEVER use inline `style` unless dynamically computed.
- NEVER use CSS-in-JS.
- Component: ALWAYS accept `className` prop.
- Component root: ALWAYS receive `className` as first prop.
- ALWAYS use `cx` from `clsx-tw` to combine class names.
- NEVER use string interpolation to combine class names.
- ALWAYS dedupe Tailwind classes.
- Icons: ALWAYS reside in individually re-exporting `icons.tsx`.
- UI copy: ALWAYS use minimal copy.
- UI copy: NEVER add eyebrow, overline, kicker, section labels, decorative microcopy, or invented microcopy unless
  explicitly requested.
- UI copy: ALWAYS make every text element necessary.
- UI: ONLY use the heading, required supporting text, and controls.
- UI: ALWAYS prefer the minimum semantic DOM.
- UX: ALWAYS provide board composed of application UI kit.
- UX board: ALWAYS include typography.
- UX board: ALWAYS include `react-icons` icon set.
- UX board: ALWAYS include buttons with statuses and interactions.
- UX board: ALWAYS include inputs with statuses and interactions by input type.
- UX board: ALWAYS include snackbar feedback for success, warning, and error actions.
- UX board: ALWAYS include confirmation prompts for yes/no user input.
- UX board: ALWAYS include table with search bar and available filters.
- UX board: ALWAYS provide desktop view at 1280 x 700.
- UX board: ALWAYS provide tablet view at 768 x 1024.
- UX board: ALWAYS provide smartphone view at 390 x 844.
- Responsive UI: ONLY stack or hide elements as viewport shrinks.
- Responsive UI: NEVER change HTML DOM structure between resolutions or users.
- ALWAYS use `zustand` with plain objects for application/domain state.
- NEVER use React Context for global state.
- Compound UI components: MAY use scoped React Context.
- ALWAYS use `useSWR` for data retrieval.
- ALWAYS use `useSWRMutation` for backend mutations.
- NEVER combine `fetch` or `axios` with manual `useState` and `useEffect` for data fetching.
- ALWAYS use meaningful cache-friendly fetcher keys.
- Async operations: ALWAYS display loading spinners or skeletons.
- ALWAYS use `react-hook-form` for forms.
- ALWAYS use native `<form>` elements.
- Form inputs and buttons: ALWAYS use proper types for Enter submission.
- Entity full page: ALWAYS name component `<Entity>`.
- Entity card-grid explorer: ALWAYS name component `<Entity>Grid`.
- Entity card-grid item: ALWAYS name component `<Entity>GridItem`.
- Entity table dashboard: ALWAYS name component `<Entity>List`.
- Entity table row: ALWAYS name component `<Entity>ListItem`.
- Entity forms: ALWAYS name components `<Entity>CreationForm` and `<Entity>UpdateForm`.
- React root element: ALWAYS use `main.tsx`.
- React-router routes: ALWAYS use `Router.tsx`.
- Components: ALWAYS reside in `components/`.
- Hooks: ALWAYS reside in `hooks/`.
- Reused UI primitives: ALWAYS reside in `ui/`.
- Route-level components except shared layouts: ALWAYS reside in `views/`.

## Testing

- ALWAYS add proper unit and integration testing.
- ALWAYS add proper interaction testing.
- ALWAYS add proper happy-path end-to-end testing.
- ONLY add unit tests for complex pure functions or algorithms.
- ALWAYS add integration tests for feature flows.
- NEVER write clever test helpers.
- ALWAYS make test setup explicit.
- IF possible THEN load required fixture inside test.
- NEVER set default fixture in `beforeEach` when only some tests need it.
- ALWAYS make test input visible without hidden setup search.
- NEVER modify seeded data in tests.
- `describe` or `it`: ALWAYS prepare required data when seeds do not provide it.
- Database tests: ALWAYS begin a transaction in `beforeEach` and roll it back in `afterEach`.
- ALWAYS avoid mocking when possible and use real calls to persistence layers.
- ONLY mock email sending.
- NEVER write redundant expectations.
- Expectation: ALWAYS prove one behavior.
- IF first expectation proves same result THEN remove second expectation.
- IF exclusion is behavior under test THEN keep explicit exclusion check.
- NEVER write meaningless tests without coverage or behavior value.
- ALWAYS prefer Vitest `expect.matchObject` to group expectations or compare expected object properties.
- ALWAYS prefer Vitest `expect.toEqual`.
- NEVER use Vitest `expect.toBe` for single assertions.

## Environment

- ALWAYS centralize environment variables in `.env`.
- ALWAYS list available environment variables in root `sample.env`.
- Service: ALWAYS provide `env.ts` to read, parse, and export `process.env` with Zod.
- NodeJS service: ALWAYS import and read exported `ENV` object.
- IF adding environment variable THEN update root `sample.env`.
- `NODE_ENV=test`: service runs test build.
- `NODE_ENV=development`: service runs unminified, unoptimized development build.
- `NODE_ENV=production`: service runs minified, optimized production build.
- Business logic: ALWAYS remain agnostic to `NODE_ENV`.
- `APP_ENV=local`: service runs on developer local machine.
- `APP_ENV=development`: service runs in deployed development environment.
- `APP_ENV=staging`: service runs in deployed staging environment.
- `APP_ENV=production`: service runs in deployed production environment.

## Git

- Branch name: ALWAYS use `<type>-<ticker-number>-<summary>`.
- PR name: ALWAYS use `<type> <number>: <summary>`.
- Code change type: ONLY use `feat`, `fix`, `chore`, or `perf`.
- PR: ALWAYS squash-merge into `main`.
- PR description: ALWAYS include `Problem` section.
- PR description: ALWAYS include `Solution` section.
- CI: ALWAYS use GitHub Actions workflow `.github/workflows/ci.yml`.
- PR targeting `main`: ALWAYS test and NEVER deploy.
- Commit on `main`: ALWAYS test then deploy to development.
- Commit on `staging`: ALWAYS test then deploy to staging.
- Commit on `production`: ALWAYS test then deploy to production.

## Specs

- Specs: ALWAYS assume exclusive AI coding-agent consumer.
- Specs: ALWAYS maximize token efficiency and density.
- Specs: ALWAYS write for LLM parser.
- Specs: ALWAYS use English and ASD-STE100 Simplified Technical English.
- Specs: NEVER write prose, introductions, or background explanations.
- Specs: ALWAYS omit articles, conversational filler, and passive voice.
- Specs: ONLY use H2 headings, bullets, and code blocks.
- Specs: ALWAYS list required changes in bullets.

## Generated Assets

- Generated images: ALWAYS use WebP format.
- Generated images: ALWAYS limit the longest side to 600 px.
