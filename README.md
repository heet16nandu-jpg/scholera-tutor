# CS 4780 Tutor — Scholera Frontend Assignment

A chat interface for an AI tutor scoped to a single course (CS 4780 — Machine
Learning for Engineers). Unlike a general-purpose chatbot, every answer here
traces back to a specific lecture and slide, since the whole point of this
tool is helping a student study *this course's* material, not answer
anything.

There is no real model behind this — per the assignment, it replays canned
responses from a mock streaming endpoint with realistic timing (including
failure cases), so the interaction feels like a live tutor without needing
an API key or backend.

## Setup

```bash
git clone https://github.com/heet16nandu-jpg/scholera-tutor.git
cd scholera-tutor
npm install
npm run dev
```

Then open the URL Vite prints in the terminal (usually
`http://localhost:5173`, but Vite will use the next available port, e.g.
`5174`, if that one's already in use) in a browser. No API key, account, or
backend required.

- To see the first-time/empty state instead of the seeded conversation, add
  `?empty` to whatever URL Vite printed (e.g.
  `http://localhost:5173/?empty` — adjust the port if yours differs)

## What I built and why

**Core chat interface** — renders a conversation with full markdown support:
code blocks, GitHub-flavored tables, and LaTeX math (both inline and display
mode), plus citations linking each tutor answer back to its source
lecture/slide.

**Streaming** — questions (typed or picked from the suggestion chips) stream
back a response chunk-by-chunk via the provided mock endpoint, with a Stop
button that cancels cleanly, and correct handling of both failure modes the
assignment calls out (fails before any text arrives, fails partway through
with partial text preserved).

**Distinctive feature: inline expandable citations.** Rather than building a
separate side panel, each citation badge expands in place to show the actual
lecture content it references — title, bullets, formulas, or figure
description, whichever the source slide actually has. I chose this over a
side-panel approach because it's genuinely the better design here, not just
the easier one: a side panel is actively annoying on mobile (it either
crowds the screen or needs to become a bottom sheet, adding a whole separate
layout to maintain), and even on a laptop-sized screen there's no real
upside to a side panel over seeing the source content expand right where you
asked about it. Since mobile responsiveness is a hard requirement here,
inline expansion gets the same result with no tradeoff either way.

**Empty/first-visit state** — since there's no backend to determine whether
a student has asked anything before, this is reachable via `?empty` in the
URL rather than automatically detected. It shows a short welcome and the
same suggestion chips used elsewhere, rather than a second onboarding system.

**Smaller craft details**, each added deliberately rather than for its own
sake:
- Copy button on tutor responses (copies the underlying markdown, not
  rendered text, so tables/math stay intact)
- Input auto-resizes as you type a longer question, with Enter to send and
  Shift+Enter for a newline
- Typing or pasting anywhere on the page (when nothing else is focused)
  automatically focuses the input, rather than losing the keystroke
- On narrow screens, suggestion chips collapse into a toggleable drawer
  instead of a permanently-visible strip, so they don't eat into the space
  available for actually reading the conversation
- Input/suggestion chips are disabled while a response is streaming, to
  avoid overlapping/tangled response state — Stop is the way out of that if
  you want to redirect

## What I deliberately left out

- **No real language understanding.** Typed questions are matched against
  the available scenarios by keyword overlap, not semantic understanding —
  there's no model behind this by design (per the assignment), so this is
  an honest, visible limitation rather than something disguised. The
  suggestion chips exist specifically to give a reliable way to trigger
  every scenario.
- **No persistence.** The empty vs. seeded conversation state is a manual
  URL toggle, not real returning-user detection — there's no backend to
  determine that, so I didn't fake it with localStorage.
- **No answer regeneration.** If a response isn't useful, there's no "try
  again" — you'd need to rephrase the question and resend it.
- **No way to jump directly from a citation to the full lecture**, only to
  the specific cited slide's content — there's no "view the whole lecture"
  path from inside a citation panel.

## Known issues / honest limitations

- The `fails_before_first_token` failure path (error before any text
  streams) exists in the code and is handled correctly, but no scenario in
  the provided data actually triggers it — I verified it manually by
  temporarily flipping the flag during development, then reverted the
  change, so it's untested by the shipped data itself.
- Keyword-based question matching will occasionally miss a reasonably
  phrased question that overlaps enough in meaning but not in exact words
  with one of the eight scenarios — the honest fallback response covers
  this rather than guessing wrong.
- Accessibility testing covered keyboard navigation only (tab order,
  Enter/Space activation on citations and chips) — I did not test with a
  screen reader, so I can't speak to that experience specifically.

## What I'd do next with more time

Real semantic matching for typed questions (even something lightweight like
embedding similarity against the eight scenario prompts) instead of keyword
overlap, so a wider range of phrasing reliably reaches the right answer.

## AI usage

See `AI_USAGE.md` for a detailed account of where AI tools helped, where they
were wrong, and how I reviewed their output throughout.
