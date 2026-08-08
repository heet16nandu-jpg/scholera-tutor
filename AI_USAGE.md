# AI usage

## Tools used

- **Claude Code** — used for the majority of implementation: component code,
  CSS, data-parsing logic, and debugging.
- **Claude (chat)** — used for planning, reviewing Claude Code's output before
  accepting it, understanding unfamiliar parts of the codebase, and deciding
  between design directions (e.g. citation UX approach).

## What Claude Code was used for

- Initial static rendering of `conversation.json` (markdown, code blocks,
  tables, LaTeX math, citation badges)
- Fixing a mobile layout overflow bug
- Wiring the mock streaming endpoint (`mock-stream.mjs`) to the chat UI,
  including the Stop/cancel flow and both failure-mode states (fails before
  first token, fails mid-stream)
- Building the inline expandable citation feature — joining citation
  references to real lecture slide content, since the two data files share no
  ID field
- Diagnosing and fixing a math-rendering bug where display-mode LaTeX (`$$...$$`)
  was silently being parsed as cramped inline math because the fences sat on a
  single line rather than their own lines

## Where it helped

- **The mobile overflow bug**: correctly diagnosed a non-obvious flexbox
  sizing issue — a flex child with `align-items: flex-start/flex-end` sizing
  itself off a long unwrapped code line's content width, ignoring the
  parent's `max-width`. It isolated the actual cause by testing several
  candidate explanations individually rather than guessing, and fixed the
  real problem (`max-width: 100%` on the bubble) instead of masking it with
  `overflow-x: hidden`.
- **The citation-to-lecture join**: recognized that citations and lecture
  files had no shared ID and needed a reconstructed match (composing
  `Week {n} — {title}` as a join key), then verified all 16 citations across
  both data files resolved correctly before writing any UI around it.
- **The display-math bug**: traced a rendering issue back to its actual root
  cause (a markdown-parser requirement that `$$` fences sit on their own
  lines to count as display mode) rather than treating the symptom with a
  CSS spacing patch, which would not have actually fixed it.
- **Streaming cancellation design**: identified that the mock stream's
  internal `sleep()` isn't interruptible, and designed the Stop button to
  settle UI state immediately rather than waiting on the generator to notice
  an abort signal — Stop now returns to idle in under 100ms instead of
  potentially waiting several seconds.

## Where it was wrong / needed correction

- **Overstated a performance number.** Claude Code initially reported that
  streaming ran "2–9.6x slower" under a certain condition. On being asked to
  verify this properly against a production build with a fresh page, the real
  figure was 1.2–1.9x — a real issue worth fixing, but nowhere near as severe
  as first claimed. This is a useful reminder that AI-reported metrics need
  re-verification, not just acceptance.
- **A failed first approach to throttling.** It initially tried using
  `requestAnimationFrame` to throttle chunk rendering, which silently doesn't
  fire when a tab isn't in the foreground/painting — it switched to a plain
  timer once this was caught.
- **Scope drift, caught and corrected.** When fixing the display-math bug, it
  proposed applying the fix app-wide (both message bubbles and citation
  panels) rather than just the two spots originally flagged. This was
  reasonable and was kept, but it was a deviation from the literal ask that
  had to be reviewed and consciously approved, not assumed correct.
- **A feature added without being asked.** Bottom-anchored auto-scroll during
  streaming was added on its own initiative. Reasonable, but not something
  requested — reviewed and kept deliberately rather than left in by default.

## My own role

Every non-trivial change was reviewed manually before being accepted — read
the diff, tested the actual behavior in the browser (all scenario paths,
both failure modes, mobile width via DevTools), and in a few cases asked
Claude Code to explain its own code back to me before moving on. Design
decisions (e.g. which citation UX pattern to build, whether to keep
auto-scroll) were made by me, with Claude Code implementing and Claude (chat)
helping me reason through the tradeoffs beforehand.
