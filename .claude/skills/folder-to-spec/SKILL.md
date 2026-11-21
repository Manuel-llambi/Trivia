---
name: folder-to-spec
description: "Trigger: folder to spec, repo to spec, spec from folder, PRD from repo. Read a folder or repository and synthesize a spec, then publish it to the issue tracker."
argument-hint: "<path-to-folder-or-repo>"
disable-model-invocation: true
license: Apache-2.0
metadata:
  author: "manue"
  version: "1.0"
---

## Activation Contract

Load when the user invokes `/folder-to-spec <path>` to turn the contents of a folder or repository into a spec. The source of truth is the folder at `$ARGUMENTS`, not the conversation.

## Hard Rules

- If `$ARGUMENTS` is empty, ask for the path and stop.
- Do NOT interview the user. The only allowed question is the seam check in step 4.
- Build the spec only from what the folder states or clearly implies. Never present an assumption as fact; every gap goes to Open Questions.
- Reuse the folder's own domain vocabulary. Respect any ADRs found.
- Do NOT include file paths or code snippets in the spec, except decision-rich snippets from the source (state machine, schema, type shape, animation timing), trimmed and marked as coming from the source folder.
- If the issue tracker and triage labels were not provided, tell the user to run `/setup-matt-pocock-skills` and stop before publishing.

## Decision Gates

| Situation | Action |
|---|---|
| Folder too large to read inline (roughly 4+ files to understand) | Delegate mapping to an exploration sub-agent; work from its summary |
| Code exists | Prefer existing test seams, highest possible |
| No code yet | Propose seams at the highest level the material allows |
| Open Questions has blocking items | Label `needs-info` |
| No blocking Open Questions | Label `ready-for-agent` |
| Documents contradict each other | Follow the most specific one; record the contradiction in Further Notes |

## Execution Steps

1. Map the folder structure.
2. Read in order: intent docs (README, briefs, PRDs, definitions, notes, mockups), then domain glossary and ADRs, then code and existing tests. Stop expanding when new files stop changing your understanding.
3. Keep two lists while reading: **Facts** (explicitly defined rules, flows, screens, data, constraints) and **Gaps** (needed by the spec but not settled by the material).
4. Sketch the test seams, fewest possible (ideal: one). Confirm them with the user.
5. Write the spec using [assets/spec-template.md](assets/spec-template.md).
6. Publish it to the project issue tracker with the label chosen in Decision Gates.

## Output Contract

Return:
- The issue link or ID and the applied label.
- The seams confirmed with the user.
- The number of Open Questions, and which ones are blocking.

## References

- [assets/spec-template.md](assets/spec-template.md) — spec structure to fill.
