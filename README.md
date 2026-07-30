# LCSW Exam Prep — Personal Study Platform

A self-contained study app built from your Therapist Development Center materials:
your quiz results (Crisis, DSM, Ethics, Mock 1, Pretest), the Quiz Yourself packets
(with TDC's official answer key), the Quick Studies, and a purpose-built
medication trainer. No internet or install needed.

## How to use

Double-click **index.html** — it opens in your browser and works offline.
Progress is saved automatically in the browser (per device/browser).

**Recommended routine to get from ~85% to 93%+:**
1. **Quick 10** a few times a day (waiting room, coffee, etc.) — it automatically
   feeds you the questions you've been missing plus ones you haven't seen.
2. **Medication Trainer → Which category?** and **Theory Trainer** drills daily.
3. Tap **☆** on any question that felt hard — starred questions get double weight
   in smart sessions and have their own drill (⭐ Starred).
4. Check **Stats** — it sorts your weakest topics to the top. Drill anything weak
   with **Custom Test by Subject** (subjects span all banks, e.g. all
   Therapy Theories questions at once).
5. **Missed Questions** until the list is empty, then a full-length
   **Full Exam (170)** under exam conditions to confirm you're at goal.

**Modes:** Due Today (spaced repetition), Quick 10 (smart-weighted), Full Exam 170 &amp;
Mock 50 (pure random, pace-tracked, feedback at the end), Study by Bank, Custom Test
by Subject (+ starred-only option), Missed, Starred, Medication Trainer, Theory
Trainer (Erikson/Piaget/Freud/Mahler stage drills, which-therapy drills, attachment
types, cheat sheets).

## The study system (v3)

- **📅 Due Today** — every answered question gets a due date (spaced repetition).
  Miss it → due immediately and it stays in the queue until you get it right.
  Get it right → due in 3 days, then ~a week, then longer (max 60 days). Mark
  "⚑ I was guessing" on a lucky hit and it comes back tomorrow instead.
- **🎯 Projected score** — the home-screen number weights your per-content-area
  accuracy by the real ASWB clinical blueprint (Assessment/Diagnosis 30%,
  Interventions 27%, Human Development 24%, Ethics 19%). Stats shows "points left
  on the table" per area — study where that number is biggest.
- **🪤 Trap analysis** — distractors on the scenario banks are tagged with the
  reasoning trap they represent (acting-before-assessing, right-but-later,
  premature reporting…). When you miss, the app tells you which trap caught you,
  and Stats shows your recurring patterns.
- **⏱ Pacing** — exam modes show live pace vs the real 84 sec/question budget;
  results flag questions that took over 2½ minutes.
- **Backup / group sharing** — Stats → Export/Import. "Import stars only" lets
  group members swap hardest-question lists without touching each other's progress.
- **Install as an app** — on the hosted (Netlify) version, use your browser's
  "Add to Home Screen" / "Install" — it runs offline after the first load.
- **Shortcuts** — keys A–D (or 1–4) answer, Enter/Space next, S stars; swipe left
  advances on mobile.

## Where the answers came from

Your TDC quiz-result PDFs contain the questions but not the answer key, so the
correct answers were derived from your Quick Studies, the NASW Code of Ethics,
DSM-5-TR criteria, and standard ASWB reasoning (safety first, assess-before-act,
least intrusive option, mandated reporting rules). Questions where the derived
answer is less certain are marked with a ⚠ flag in the feedback so you can verify
them against TDC's rationales. The Quiz Yourself banks use TDC's official answer key.

## Adding more questions later

Each question bank is one file in `data/`. To add a new bank (e.g., after you take
Mock 2):

1. Create `data/bank-mock2.js` with this structure:

```js
window.LCSW_BANKS = window.LCSW_BANKS || [];
window.LCSW_BANKS.push({
  id: "mock2",                        // unique, no spaces
  title: "Full Mock Exam II (TDC)",
  questions: [
    {
      id: "mock2-1",                  // unique per question
      topic: "DSM Diagnosis",         // used for stats grouping
      stem: "The question text…",
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: 2,                      // 0-based index of the correct option (0=A, 1=B, 2=C, 3=D)
      explanation: "Why it's correct and why the tempting distractor is wrong.",
      source: "Quick Study: …",
      flag: false                     // true = answer needs verification
    }
    // …more questions
  ]
});
```

2. Add one line to `index.html` in the QUESTION BANKS section:

```html
<script src="data/bank-mock2.js"></script>
```

That's it — the new bank appears in Study by Topic and joins the Quick 10 /
Mock Exam pools automatically.

**Easiest path:** save your new TDC quiz results as a "Print Friendly" PDF into
`My Quiz Results`, then ask Claude to "add my new quiz results to the study
platform" — the same pipeline (parse → answer → explain) can be rerun.

## Adding medications

Edit `meds-data.js` — add a row to `window.MEDS` and it appears in both drills
and the cheat sheet.

## Files

- `index.html` — the app shell; lists which banks to load
- `app.js` — quiz logic, smart weighting, stats (no dependencies)
- `meds-data.js` — medication trainer data (from the Medications Quick Study)
- `data/bank-*.js` — question banks
