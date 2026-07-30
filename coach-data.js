/* Test Ready coach — evidence-rated study techniques.
   Ratings follow Dunlosky et al. 2013 (Psychological Science in the Public Interest)
   plus later meta-analyses and RCTs. Each technique maps to a concrete action in this app. */

window.STUDY_TECHNIQUES = [
  {
    id: "retrieval", icon: "🧪", name: "Practice Testing (Retrieval Practice)", grade: "HIGH utility",
    what: "Answering questions from memory beats re-reading, re-watching, and highlighting — testing IS studying, not just measurement.",
    how: "Most of your study time should be answering questions and recalling from memory, with feedback right after. Struggling to retrieve is the point — it strengthens the memory.",
    inApp: "Every mode here is retrieval practice with immediate feedback. Quick 10 and Due Today are the purest forms.",
    action: "App.quick(10)", actionLabel: "Do a Quick 10",
    cite: "Dunlosky et al. 2013 (HIGH utility); Adesope et al. 2017 meta-analysis (188 experiments: beats restudying, g=0.51); Donoghue & Hattie 2021 (d=0.74)",
    yt: "retrieval practice testing effect study technique"
  },
  {
    id: "spacing", icon: "📅", name: "Spaced (Distributed) Practice", grade: "HIGH utility",
    what: "The same minutes spread across days beat the same minutes massed in one sitting — by a lot, and the advantage grows with time.",
    how: "Short daily sessions, revisiting material at expanding intervals. The optimal gap grows with how long you need to remember (roughly 10–40% of the time until test) — days from an exam, that means daily touches.",
    inApp: "The Due Today queue schedules every question you've answered at expanding intervals automatically. Clearing it daily IS spaced practice.",
    action: "App.dueDrill()", actionLabel: "Clear Due Today",
    cite: "Dunlosky et al. 2013 (HIGH utility); Cepeda et al. 2006 (317 experiments: spaced 47.3% vs massed 36.7% recall) & 2008 ridgeline; Donoghue & Hattie 2021 (d=0.85 — the largest effect of any technique)",
    yt: "spaced repetition evidence distributed practice"
  },
  {
    id: "successive", icon: "🔂", name: "Successive Relearning", grade: "HIGH (combines the top two)",
    what: "Retrieve each item correctly to a criterion (e.g., once correct today), then RE-learn it to criterion again in later spaced sessions. Dramatically outperforms single-session mastery.",
    how: "Don't retire a fact after one good day. It's 'known' only after ~3 correct retrievals across separate days.",
    inApp: "The mastery counter uses exactly this: a question counts as mastered only after consecutive correct answers across sessions, and lapses put it back in rotation.",
    action: "App.missed()", actionLabel: "Re-drill misses",
    cite: "Rawson & Dunlosky 2011; Rawson et al. 2013 (real courses, exam gains)",
    yt: "successive relearning study strategy"
  },
  {
    id: "interleaving", icon: "🔀", name: "Interleaving", grade: "MODERATE utility",
    what: "Mixing topics in one session (ethics → DSM → meds → theories) beats blocking one topic at a time — because the exam never tells you which topic a question is from. Caveat: the benefit is for discriminating look-alike categories (exactly what MC practice is); it's weak or reversed for plain reading material.",
    how: "Practice discriminating between confusable categories — mixed-topic question sessions, not single-topic reading marathons.",
    inApp: "Quick 10, Mock, and Full Exam are fully interleaved. The Medication category drill and Theorist drill train exactly the discrimination skill interleaving builds.",
    action: "App.mock()", actionLabel: "Mixed Mock 50",
    cite: "Dunlosky et al. 2013 (MODERATE); Brunmair & Richter 2019 meta-analysis (g=0.42, strongly material-dependent)",
    yt: "interleaving practice learning science"
  },
  {
    id: "selfexplain", icon: "✍️", name: "Self-Explanation", grade: "MODERATE utility",
    what: "Explaining WHY an answer is right, in your own words, beats reading someone else's explanation — generation makes it stick.",
    how: "After each miss (and each lucky guess), write one sentence: the rule that decides the question. Not the answer — the rule.",
    inApp: "The ✍️ note box under every question's feedback. Notes reappear whenever you see that question again.",
    action: "App.missed()", actionLabel: "Review misses + write notes",
    cite: "Dunlosky et al. 2013 (moderate); Chi et al. 1994; Bisra et al. 2018 meta-analysis",
    yt: "self explanation learning technique"
  },
  {
    id: "calibration", icon: "🎚", name: "Confidence Calibration", grade: "Evidence-backed metacognition",
    what: "Knowing what you don't know is a skill. Uncalibrated confidence means lucky guesses get retired as 'known' and fail you on exam day.",
    how: "Flag answers you weren't sure of — even correct ones. Treat unsure-but-right as unfinished business.",
    inApp: "The '⚑ I was guessing' button reschedules a lucky hit for tomorrow instead of a week out, and lists it in 'Lucky guesses to lock in' on results.",
    action: "App.quick(10)", actionLabel: "Practice with honest flagging",
    cite: "Dunlosky & Rawson 2012 (overconfidence hurts learning); Couchman et al. 2016",
    yt: "metacognition confidence calibration studying"
  },
  {
    id: "anticipate", icon: "🔮", name: "Pretesting / Answer Anticipation", grade: "Evidence-backed",
    what: "Attempting an answer BEFORE you see the options (even attempting and failing) improves learning versus passively reading options first.",
    how: "Cover the options. Answer the stem in your head. Then look — you'll spot the match and resist near-miss distractors.",
    inApp: "ASWB's own five-step method (Strategy page) starts with exactly this; the Anticipate-then-Eliminate lesson drills it.",
    action: "App.lesson('eliminate-anticipate')", actionLabel: "Train anticipation",
    cite: "Richland et al. 2009; Kornell et al. 2009 (errorful generation); 2025 ASWB Guidebook step 1",
    yt: "pretesting effect learning"
  },
  {
    id: "expressive", icon: "📝", name: "Expressive Writing (test anxiety)", grade: "MIXED — failed a major replication",
    what: "The famous finding (10 minutes writing about your worries before an exam boosts anxious test-takers' scores) came from real RCTs — but it failed a large preregistered replication. Honest verdict: uncertain benefit.",
    how: "It costs 10 minutes and can't hurt: if you feel real exam-morning anxiety, try it. Just don't expect magic — sleep and retrieval practice are where the real points are.",
    inApp: "Listed on your exam-day plan as an optional item, labeled honestly.",
    action: null, actionLabel: null,
    cite: "Ramirez & Beilock 2011 (Science); failed replication in Camerer et al. 2018 (Nature Human Behaviour, Social Sciences Replication Project)",
    yt: "expressive writing test anxiety Beilock"
  },
  {
    id: "reappraisal", icon: "💓", name: "Arousal Reappraisal", grade: "Promising RCTs (smaller literature)",
    what: "A racing heart before an exam is arousal, not doom. Test-takers taught to reinterpret arousal as performance fuel ('I'm excited / my body is ready') scored higher than those told to calm down.",
    how: "When the adrenaline hits in the testing center: don't fight it. Say 'this is my body getting ready to perform.' Slow exhale, then begin.",
    inApp: "Free. Also pairs with the exam's built-in 10-minute break — use it to reset with slow breathing (longer exhale than inhale).",
    action: null, actionLabel: null,
    cite: "Jamieson et al. 2010/2016; Brooks 2014 ('get excited')",
    yt: "anxiety reappraisal excitement performance"
  },
  {
    id: "sleep", icon: "😴", name: "Sleep Is Consolidation", grade: "Strong evidence",
    what: "Memory consolidates during sleep. All-night cramming trades a small amount of extra exposure for a large loss of retention, reasoning, and attention — a terrible trade on a reasoning-heavy exam.",
    how: "Protect 7–9 hours the final two nights (the night BEFORE the night before matters too). Nothing new after dinner on exam eve.",
    inApp: "The coach's final-days plan stops introducing new material and shifts to light review + logistics.",
    action: null, actionLabel: null,
    cite: "Rasch & Born 2013 review; Walker & Stickgold consolidation literature",
    yt: "sleep memory consolidation exam"
  },
  {
    id: "exercise", icon: "🏃", name: "Acute Exercise Primer", grade: "Meta-analytic evidence (small-moderate)",
    what: "A single bout of moderate exercise (20–30 min walk/jog) modestly improves attention and executive function for a period afterward.",
    how: "A brisk walk before a study block — or the morning of the exam — is a cheap, real boost. Don't exhaust yourself; moderate is the dose.",
    inApp: "TDC's own How-to-Study list includes exercise. Schedule it before your daily session.",
    action: null, actionLabel: null,
    cite: "Chang et al. 2012 meta-analysis (acute exercise & cognition)",
    yt: "exercise before studying brain"
  }
];

window.STUDY_MYTHS = [
  { name: "Matching your 'learning style' (visual/auditory/kinesthetic)", verdict: "REFUTED — decades of tests find no benefit to style-matched instruction. Use retrieval + spacing instead, whatever your 'style'.", cite: "Pashler et al. 2008" },
  { name: "Never change your first answer", verdict: "REFUTED — wrong-to-right changes outnumber right-to-wrong ~2:1 across 70+ years of studies. Change when you can name a reason.", cite: "Kruger et al. 2005; Benjamin et al. 1984" },
  { name: "Re-reading, highlighting, summarizing", verdict: "LOW VALUE per hour — not zero (d≈0.44–0.47), but testing and spacing deliver roughly double the effect (d≈0.74–0.85) for the same time. With days left, every re-reading hour is an expensive hour.", cite: "Dunlosky et al. 2013; Donoghue & Hattie 2021" },
  { name: "Building your studying around mnemonics and imagery", verdict: "LOW utility as a primary strategy per Dunlosky — quick hooks for ordered lists (Me-We-Principles) are fine as accents, but drilling retrieval of the actual material is what earns points.", cite: "Dunlosky et al. 2013 (keyword mnemonic & imagery-for-text: low)" },
  { name: "Passively watching videos/lectures", verdict: "Passive review without retrieval is weak. Videos are fine for FIRST exposure or clearing a confusion — then immediately test yourself on it.", cite: "Retrieval-practice literature applied to video" },
  { name: "Cramming the night before", verdict: "Massed practice + sleep loss is the worst combination for a reasoning exam. The final 24 hours are for light review, logistics, and sleep.", cite: "Cepeda et al. 2006; sleep-consolidation literature" }
];
