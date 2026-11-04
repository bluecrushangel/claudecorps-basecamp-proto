# CLAUDE.md: AT Handoff Prototype

## What this is

A small prototype for Black Hills Works (BHWS), a provider of services for adults with intellectual and developmental disabilities. It shows how notes about a person could support the process of getting that person assistive technology (AT), and how the handoff of that request could be visible to everyone involved.

This is a proof-of-concept prototype. Keep it simple, visual, and easy to demo. Do not overengineer.

## Scope: three elements only

1. **Profile**
2. **Notes** (including an on-demand summary)
3. **Handoff tracker** (visual only)

Do not add features beyond these three without asking first.

---

## 1. Profile

Each patient gets one profile card built from the dataset `dummy_notes_200.csv`.

A profile contains only:

- **Name**
- **Picture** (a placeholder image is fine; use a generic avatar, never a real photo)
- **Notes** (see section 2)

Build the list of profiles from the unique `ID` and `Name` values in the CSV. Five people are in the dataset: BHW-1001 through BHW-1005.

## 2. Notes

Notes are shown **exactly as stored**, with no modification:

- Show each row's `DateTime` and `Note` text as they appear in the CSV.
- Do not rewrite, correct, capitalize, or clean up note text. The rough, lowercase wording is intentional and part of the realism.
- Keep notes in chronological order within each profile.

**Summarize button:**

- Add one button labeled something like "Summarize notes."
- It runs **only when clicked**. Never summarize automatically.
- It calls the **Claude Haiku** model (the fast, efficient model) to produce a short summary of all of that person's notes.
- The summary should only describe what the notes say. It must not infer diagnoses, recommend specific devices, or make decisions about the person's supports.
- Show the summary in its own panel, separate from the raw notes, so the raw notes always remain visible and unchanged.

## 3. Handoff tracker

A visual-only tracker at the top of the page, showing the progress of one AT request through its steps.

- Clean, simple UI. A horizontal row of stages with the current stage highlighted.
- Stage names are placeholders and should be easy to change. Suggested starting stages: Need identified, Summary reviewed, Evaluation, Funding review, Decision, Delivered.
- **Animation:** a marker or highlight moves slowly from left to right across the stages, looping or stopping at the end. Keep it smooth and unhurried.
- It does not need to read real data or save state. Hardcode the position or drive the animation with simple timing.

---

## Data

- Source file: `dummy_notes_200.csv` (200 rows, 5 people, 40 notes each).
- Columns: `ID`, `Name`, `DateTime`, `Note`.
- `DateTime` uses ISO 8601 format: `YYYY-MM-DD HH:MM:SS`, for example `2026-10-05 11:00:00`.
- The data is entirely synthetic. Names and IDs are invented.
- Parse the CSV properly. Quoted fields may contain commas in future data, so do not split on commas naively.

## Guardrails

- **AI surfaces, humans decide.** Nothing in this prototype makes a decision about a person's supports, restrictions, or AT. The summary describes notes; it does not recommend or approve anything.
- **Use only synthetic data.** Never add real names, real IDs, or real health information.
- **Human-readable first.** Language on screen should be plain and clear, since the people this is about are the intended readers.
- **No automatic AI calls.** The only model call is the user-triggered summary button.

## Tech

- Keep the stack minimal. A single static page (HTML, CSS, and a small amount of JavaScript) is preferred unless there is a reason to add more.
- Read the CSV at runtime or embed it as a constant. Either is fine for a prototype.
- The summary button needs an API call to Claude Haiku. Read the API key from an environment variable; never hardcode it or commit it.

## Working in this repo

- Ask before adding dependencies, features, or files beyond the three elements above.
- When unsure about the real BHWS process, make a labeled assumption and note it in a comment instead of guessing silently.
- Keep changes small and easy to review.
