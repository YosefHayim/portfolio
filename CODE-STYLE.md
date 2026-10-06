# Code style

Applies to `client/`, including its deployment code and tests.

- Prefer readable, simple code. Extend existing components before adding abstractions.
- Named arrow functions; `const` by default; flat guards. No nested ifs, nested ternaries,
  nested calls, nullish coalescing, or type assertions that hide errors.
- Name domain values precisely. Avoid generic names such as data, result, row, and record.
- One component per file. PascalCase component filenames; camelCase source filenames.
- Inline named exports and direct imports. No barrels, index.ts/tsx, or re-exports.
  Tool configuration and the Worker entry may use required default exports.
- Interfaces for component props; types for domain shapes. Use `import type` for types.
- Keep React UI state local. Use Effect for browser storage and Worker asset I/O, with
  observable failures. Use Effect Schema when decoding external values.
- Use CSS logical properties and root `dir`. Isolate mixed-language phrases with `dir="auto"`.
- Use Tailwind theme tokens and semantic classes. Keep colors centralized in the stylesheet
  or decorative SVG. CSS specificity checks are disabled because independent component
  selectors do not overlap; other recommended Biome checks remain enabled.
- Every interactive element needs an accessible name, visible keyboard focus, and adequate
  touch area. Native elements take precedence over equivalent ARIA roles.
- Effects return cleanup functions. No animation may prevent reading or selecting content.
- Colocate Vitest unit tests. Browser behavior belongs in `client/e2e/` and runs against
  the production build through Wrangler, including real 404 behavior.
- No narrating comments or TSDoc. Use comments only for a necessary constraint or example.
- Biome: single quotes, semicolons, 100 columns, two spaces, trailing commas.
