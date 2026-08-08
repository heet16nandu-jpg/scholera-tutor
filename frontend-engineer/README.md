# Take-Home Assignment: Frontend Engineer Intern

> **Note:** This repository is for reading the assignment only. Do not push your code here.
> Create your own repository and send us that link.

**Effort: 10–12 hours.** Please don't spend more. We would rather see one thing finished than
five things started.

---

## What you're building

**A chat surface that teaches.**

Not ChatGPT. Not Claude. Those are general assistants and they are very good at being general.
This one is a tutor for a single university course. It only knows the lectures one professor
uploaded, and it always shows which lecture an answer came from.

Here is the part that matters. It looks like every other chat app — a list of messages and a box
to type in. Underneath it is doing a completely different job.

**Your task is to make that difference obvious through the design itself.**

---

## Think past the chat log

A chat box flattens everything into one column, in the order it was said. That is fine for
asking a question. It is a poor way to *learn* something, and it is where every AI chat product
currently stops.

A student revising for an exam has different needs. They asked about gradient descent three
weeks ago and want it again. They half-understand two ideas and want to know how they connect.
They want to know what they haven't covered yet.

None of that is a message in a list.

**So: what should a tutor screen be, that a chat log isn't?**

One example, to show the *kind* of thinking we mean — not a spec to follow: a knowledge graph of
the conversation, where the concepts a student has asked about become nodes, linked to the
lectures they came from, so revision becomes something you can *see* rather than something you
scroll back through.

That is one idea. It might not be the best one. We are far more interested in yours.

Other directions worth a thought, none of them required: what the student sees before they've
asked anything; how an answer connects to the lecture it came from; what happens to an
explanation a student wants to keep; how the screen changes the night before an exam versus
during week 3.

**Pick the ideas you believe in and build those.** We would rather see one opinionated idea you
can argue for than a careful imitation of ChatGPT.

---

## The one rule

**Depth beats breadth.** A screen that does four things beautifully scores far higher than one
doing twelve at 60%.

If you catch yourself adding something because it sounds impressive, delete it and go polish
something instead. A tutor screen should feel calm and obvious, not busy. Every control you put
on screen has to earn its place.

---

## What we give you

Everything is in `data/`. **No API key, no backend, no AI model.**

```
data/
  conversation.json         A conversation that already happened
  conversation-empty.json   A student who has never asked anything
  mock-stream.mjs           A fake version of our streaming endpoint
  responses.json            The answers it plays back
  lectures/                 The three lectures this course is made of
```

**`conversation.json`** is a real-shaped chat between a student and the tutor. The messages
between them cover what you'll need to display: bold text, code, a table, maths, and
**citations** — the lecture and slide each answer came from. Those citations are what make this
a tutor rather than a chatbot, so they're worth your attention.

**`lectures/`** holds the three lecture decks the tutor draws on — slides with bullets, the
professor's speaker notes, LaTeX formulas, and figures described in words. **Every citation in
the data points at a real slide in here**, so an answer can be traced back to the exact thing
the professor said. What you do with that is one of the more interesting decisions in this
assignment, and you are not obliged to do anything with it at all.

**`mock-stream.mjs`** pretends to be our streaming endpoint. Answers arrive a few characters at
a time, the way they do in any AI product, and it behaves the same way every run. Open the file
— it explains itself, and it supports cancelling.

There are eight answers to play with, and they are not all well behaved. One is a table. One is
full of maths. One is long. One takes over four seconds to start. One is the tutor admitting it
doesn't know. One dies halfway through.

That last group is there because real products face it. How much you engage with it is your
call — but a screen that only works when everything goes right isn't finished.

---

## What has to be true

Only four things. Everything else is yours.

1. **It runs.** A stranger clones your repo and reaches a working screen in under five minutes,
   using only your README.
2. **It uses the real data.** Both files, rendered properly — including code, maths, tables and
   citations.
3. **A student can ask something and get an answer back**, using the mock stream.
4. **It works on a phone.** Most of our students are on mobile.

---

## What we're actually looking at

Not a feature checklist. Four things:

**Product judgement** — can you tell the difference between a feature that matters and one that
demos well?

**Craft** — does it feel good to use? Does it fail gracefully, or does it show a spinner
forever?

**Originality** — given that everyone knows what a chat app looks like, do you copy it or think
past it?

**Restraint** — did you finish what you started, or spread yourself across five half-things?

---

## Using AI coding tools

Use them. We do, and we'd find it strange if you didn't. Two conditions:

**One:** keep a short `AI_USAGE.md` — which tools, for which parts, and an honest paragraph on
where they helped and where they led you wrong.

**Two:** in the review call you must be able to explain any line in your repository, justify
your decisions, and make a small change we ask for. **Code you cannot explain is worth less than
code you did not write.**

---

## What to send us

1. **A public GitHub repo**, with readable incremental commits. A single "initial commit"
   containing everything gets questioned in the review call.
2. **`README.md`** — setup in under five minutes, what you decided to build and why, what you
   deliberately left out, and what's still broken. Limitations you name yourself are never held
   against you.
3. **`AI_USAGE.md`** — see above.
4. **A video of you presenting the project** — see below.

Send the repo link to **proscio@scholera-inc.com**, or reply to the email that sent you this assignment.
Check the video opens in a private browser window.

**Deadline: 14 August 2026, 23:59 IST.** Later commits are ignored, so if you finish early just send it.

---

## The video — please take this seriously

Every candidate records one, whatever role they applied for. It is the fastest way for us to
understand not just what you built but how you think about it, and it is the part of your
submission we spend the most time with.

**Length: 5–8 minutes.** Unlisted link — Loom, an unlisted YouTube video, Drive, anything.
**Open it in a private browser window and check it plays** before you send it. A link we can't
open is the single most common reason a good submission stalls.

**Please appear on camera**, at least to introduce yourself. We are not scoring presentation
skills or production value — a webcam and a screen recording is exactly right, and a rough
single take is completely fine. We would simply rather meet you than watch an anonymous screen.

### What to cover

In whatever order suits your project:

1. **Who you are.** Thirty seconds. Your name, where you're studying, what you're interested in.
2. **What you built, and why that.** The assignment deliberately left room for choices. Tell us
   the ones you made and the reasoning behind them.
3. **Show it actually working.** A real walkthrough of the running thing, not slides and not a
   tour of your source files.
4. **Show something that isn't perfect.** An edge case, an error state, a corner you didn't
   finish. Every real project has them, and we trust a demo more when it includes one.
5. **The hardest decision you made.** What you were choosing between, what you picked, and what
   you gave up to get it.
6. **Where the AI tools helped, and where they were wrong.** Same ground as your `AI_USAGE.md`,
   but say it out loud — the specific thing a tool got wrong and how you caught it.
7. **What you'd do next** with another week, and why that would be the right next thing.

### What we're listening for

Whether you understand your own work. Whether you can explain a technical decision to someone
who wasn't in your head when you made it. Whether you know where your project is weak.

**Being honest about a limitation always reads better than glossing over it.** If something is
broken, show us and tell us why — a candidate who says "this falls over on long inputs and here
is what I'd change" is telling us far more than one whose demo only ever walks the happy path.

Don't script it word for word. We would rather hear you think.
---

## The review call

Shortlisted candidates get a 25-minute call: you demo it, we walk through code we pick, and we
ask you to make one small change while we watch. Then your questions for us.

---

## Getting stuck

If something in this document is ambiguous, that is usually deliberate — make a call and write
down why in your README.

If something is actually broken, or you're blocked on hardware or setup, reply to the email that sent you this assignment, or write to **proscio@scholera-inc.com**. We would
much rather help than read a submission quietly compromised by a problem we could have fixed in
five minutes.

**Setup problems are always worth writing about — that's on us.** Please don't decide a question isn't important enough to ask; we would much rather answer it than read a submission quietly compromised by something we could have fixed in five minutes.

---

**Build the small thing. Make it good. Tell us what you found — including what didn't work.**
