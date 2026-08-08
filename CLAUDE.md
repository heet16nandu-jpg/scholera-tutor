# scholera-tutor

Take-home build: a chat surface for a course-specific AI tutor. React + Vite, no
TypeScript. All data is local — there is no backend and no API key.

## Two documentation files, different jobs

These are not the same audience. Keep them separate.

### `INTERVIEW_NOTES.md` — personal prep, not a deliverable

Log **every** completed task here, appended under the `## Progress log` heading:

- **what** was built or fixed
- **why** — the underlying cause, not just the symptom
- **for the review call** — what to be able to explain if asked live, including
  tradeoffs and anything deliberately left out

Raw and detailed is right here — mechanism-level specifics, measured numbers,
file and line references. A few bullets, not an essay. Append only; never
rewrite or reflow existing content.

Applies to completed pieces of work — not to answering a question, a quick
lookup, or changes to these documentation conventions themselves.

### `AI_USAGE.md` — a submission deliverable Scholera will read

**Default to not touching this file.** Add only when something is genuinely
worth a reviewer's attention: a real "AI helped here" or "AI got this wrong
here" moment. Not every task, and not a running log. When unsure, leave it out —
the raw material is in `INTERVIEW_NOTES.md` and gets pulled across by hand.

When something does qualify:

- Keep it short and reader-facing. Plain language, first person, matching the
  voice already in the file. No AI-assistant register, no hedging, no
  scaffolding phrases.
- Slot it into the existing section it belongs to (`Where it helped`, `Where it
  was wrong / needed correction`, etc.). Do not append a dated log at the
  bottom — the file is organised by theme, not chronology.
- Say what happened and what it cost or saved. Skip the moral.

## Verifying UI work

Changes to rendering or layout are checked in a real browser before being called
done — `npm run build && npm run preview`, driven headlessly via `puppeteer-core`
against the installed Chrome. Measure against a **production build**: the dev
server's StrictMode double-renders inflate timings several-fold. Check mobile
(400px) as well as desktop; most of this app's users are on phones.
