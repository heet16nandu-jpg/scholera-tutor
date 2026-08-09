# AI usage

I used Claude Code for most of the implementation, and Claude (chat) alongside
it for planning, reviewing what Claude Code built before accepting it, and
figuring out things I didn't understand well enough to just take on faith.

I don't think of this as "I wrote the code" in the traditional sense, but I
also didn't just accept whatever came out. Below is what that actually looked
like — what I asked for, what I pushed back on, and where AI got things
wrong.

## What I actually did

- Set up the repo and git myself by hand — didn't let Claude Code touch this,
  wanted to know exactly what state my project was in from the start.
- Read through the provided data (`mock-stream.mjs`, `responses.json`,
  `conversation.json`) before building anything against it, so I wasn't
  blindly trusting whatever Claude Code inferred about the shape of the data.
- Every feature was built in small chunks, not one big prompt for the whole
  app — after each chunk I actually opened the browser and clicked through
  it myself before moving on: all 8 scenarios, both directions of Stop
  (early/late), both failure modes, mobile width in DevTools.
- I chose the inline-expand citation design over a side panel myself, after
  weighing it out — a side panel is annoying on mobile and doesn't add
  anything on desktop either, so there was no real reason to build the more
  complex version.
- I decided to keep the mobile suggestion-chip drawer after actually looking
  at the numbers (the chip strip ate up to ~9% of a small phone's screen
  permanently) rather than just accepting whatever was proposed.
- When Claude Code built a smooth-scroll version of auto-scroll, I tested it
  and it genuinely felt worse than the original instant jump — so I asked to
  revert it, even though the "smoother" version was more technically
  sophisticated. Feel mattered more than cleverness here.
- I reviewed and edited this exact file and the README myself — the framing,
  what to include, what to cut, is mine, not generated wholesale.

## Where AI helped

- Diagnosed a mobile layout bug that wasn't obvious: a flex-aligned message
  bubble was sizing itself off a long unbroken line of code inside it,
  ignoring the parent's `max-width`. It tested a few different theories
  before landing on the real cause instead of guessing, and fixed the root
  issue instead of just hiding the symptom with `overflow-x: hidden`.
- Figured out that citations and lecture slide data had no shared ID, and
  built a join by reconstructing a label from separate `week` and `title`
  fields — then actually verified all 16 citations across both data files
  resolved correctly before writing any UI around it.
- Traced a math-rendering bug back to its real cause: the source data had
  `$$...$$` math written on a single line, which a markdown parser silently
  treats as small inline math instead of the larger display-mode math it was
  supposed to be. It fixed the actual parsing issue rather than papering over
  it with CSS spacing, which wouldn't have solved it.
- Designed the Stop/cancel button to feel instant (~80ms) by settling UI
  state itself immediately instead of waiting for the underlying stream to
  notice it had been told to stop, which could otherwise take several
  seconds.

## Where it was wrong, or I had to step in

- It once reported streaming was "2–9.6x slower" under some condition. I
  asked it to actually verify that against a clean production build instead
  of taking the number at face value, and the real number was 1.2–1.9x —
  still worth fixing, just nowhere near as dramatic as first claimed.
- It tried `requestAnimationFrame` for a rendering throttle first, which
  silently doesn't run when the browser tab isn't in focus — it caught this
  and switched to a plain timer.
- It built a smooth-scroll version of auto-scroll that technically fixed a
  real bug (the page could get yanked back to the bottom mid-read), but the
  smooth animation itself made the experience worse, not better — the text
  streaming in every ~60ms kept restarting a ~300ms animation, so the view
  visibly lagged behind the text. I noticed this felt off before I could
  fully explain why, asked for it to be reverted, and kept only the
  underlying bug fix (which didn't depend on smooth scrolling to work).
- At one point it described a smooth-scroll implementation as still being in
  the codebase after I asked to revert it, when it actually wasn't there at
  all — a mix-up somewhere along the way. I caught this because the app
  genuinely didn't feel like what was being described, not because I checked
  the code myself, which is a good reminder to actually verify claims against
  what's real rather than just the explanation given.
