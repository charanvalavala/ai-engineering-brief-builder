# Taskframe: AI Engineering Brief Builder

Taskframe turns an engineering request into a reviewable Markdown handoff. It asks for the goal, acceptance criteria, verification plan, and constraints, then provides a local preview, copy action, and Markdown download.

## Why it is useful

Coding agents and teammates do better when a task has an observable outcome and a way to check it. Taskframe makes those pieces explicit and includes a completion report that asks for checks actually run and limitations observed.

## Run locally

Open `index.html` in a current browser. The builder uses native browser APIs and has no backend, account, API key, or network request for task content. The Google Fonts stylesheet is optional; system fallbacks remain available if it cannot load.

## Verify

```sh
node --test
```

The test suite covers readiness scoring, generated structure, and incomplete input rejection.

## Limits

This is a task-structuring utility, not an AI model or autonomous coding agent. It does not inspect a repository or validate whether generated criteria are technically correct. Review the handoff before sharing it.

## License

MIT. See [LICENSE](LICENSE).
