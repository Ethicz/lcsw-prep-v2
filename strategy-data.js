/* "How to Test" strategy curriculum.
   Sources: TDC "How to Think About the LCSW Exam" (reasoning = 80-85% of the exam),
   2025 ASWB Examination Guidebook (official five-step method, qualifier guidance),
   NASW Code of Ethics, and corroborated test-prep doctrine. */

window.TEST_STRATEGIES = [
  {
    id: "safety-first", icon: "🚨", name: "Safety First",
    rule: "Any hint of danger — suicide, homicide, abuse, medical emergency, intoxication, command hallucinations — outranks every other consideration. Assess the risk before anything else.",
    cues: ["FIRST/NEXT + any risk signal in the stem", "\"things keep going downhill\" + loss", "threats, weapons, marks, burns", "aggression toward animals or siblings", "hearing commands to hurt someone"],
    apply: "Scan every stem for danger before you even compare options. If a risk signal exists, the correct answer assesses THAT risk — not the presenting problem, not the referral, not the paperwork.",
    mistake: "Picking a clinically good option (build rapport, explore history) while a safety signal sits unaddressed in the stem.",
    source: "Prep doctrine (TDC), demonstrated in ASWB's official sample rationales ('evaluate potential danger to the family FIRST')"
  },
  {
    id: "assess-first", icon: "🔍", name: "Assess Before You Act",
    rule: "With no immediate danger, gather information before intervening, referring, reporting, confronting, or educating. You can't treat what you haven't assessed.",
    cues: ["FIRST/NEXT questions with an ambiguous statement to clarify", "a vague client quote (\"I know how to get back at him\")", "options that jump to interventions or referrals"],
    apply: "When a stem leaves something ambiguous, the answer that clarifies or explores it usually wins. Interventions come after understanding.",
    mistake: "Choosing action verbs (refer, teach, report, confront) when the stem hasn't given you enough to justify them yet.",
    source: "Prep doctrine (TDC), demonstrated in ASWB's official sample rationales ('assessment should precede treatment recommendations')"
  },
  {
    id: "feelings-first", icon: "💬", name: "Start Where the Client Is",
    rule: "When the client just expressed emotion — fear, anger, grief, shame, resistance — acknowledge and explore the feeling before any problem-solving, education, or planning.",
    cues: ["a client quote carrying affect", "\"to build the therapeutic alliance…\"", "nonverbal cues (trembling lip, no eye contact)", "client doubts the worker or the process"],
    apply: "Emotion in the stem is the question's center of gravity. Acknowledge → explore → then work. Advice given before the feeling is heard is a wrong answer.",
    mistake: "Reassuring, educating, or fixing while the feeling goes unacknowledged — the 'advice before empathy' trap.",
    source: "Prep doctrine (TDC), demonstrated in ASWB's official sample rationales ('acknowledge the client's anger FIRST')"
  },
  {
    id: "ethics-threshold", icon: "⚖️", name: "Know the Line",
    rule: "Confidentiality holds until a real threshold is crossed — imminent risk, mandated reporting, court order. Then the duty flips. The question tests whether you know exactly where the line sits.",
    cues: ["disclosure of past vs. ongoing abuse", "third parties asking for information", "subpoenas vs. court orders", "\"the social worker must…\" framings"],
    apply: "Ask two questions: (1) Is the threshold actually met on the facts stated? (2) If yes, duty wins; if no, confidentiality and clarification win. Both over- and under-reacting are traps.",
    mistake: "Twin failure modes: breaking confidentiality on ambiguous facts (report too fast), or clinging to it when the duty has clearly triggered.",
    source: "NASW Code 1.07; TDC subpoena/reporting guides; ASWB confidentiality samples"
  },
  {
    id: "least-intrusive", icon: "🕊️", name: "Least Intrusive That Works",
    rule: "Choose the least restrictive option that still meets the risk, and preserve a capable client's right to decide — even decisions you think are unwise.",
    cues: ["a capable adult making a concerning-but-legal choice", "options escalating from talk → involve others → hospitalize", "family members asking the worker to override the client"],
    apply: "Rank the options by intrusiveness. Take the lowest rung that genuinely handles the risk. Overriding autonomy requires incapacity or imminent danger — nothing less.",
    mistake: "Hospitalizing, calling police/CPS, or contacting third parties when a safety plan, exploration, or informed discussion is enough.",
    source: "NASW Code 1.02 self-determination (primary source); prep doctrine (TDC danger-to-self hierarchy)"
  },
  {
    id: "qualifier-reading", icon: "🎯", name: "Obey the Qualifier",
    rule: "In FIRST/NEXT/BEST/MOST questions, several options are usually good practice. The capitalized word — and the words right after it — pick the winner. FIRST = what must precede the rest. NEXT = what follows what's already done. MOST = best supported by the stated facts.",
    cues: ["capitalized FIRST, NEXT, BEST, MOST", "multiple options you'd genuinely do", "ASWB: reasoning items are the bulk of the Clinical exam"],
    apply: "Read the qualifier, then ask 'FIRST what? MOST what?' Sequence the good options along the helping process — engage → assess → plan → intervene → evaluate — and take the earliest one the stem hasn't completed yet.",
    mistake: "The 'right-but-later' trap: choosing a genuinely correct action that belongs two steps down the road.",
    source: "2025 ASWB Examination Guidebook (official); TDC How to Think (reasoning = 80-85% of exam)"
  },
  {
    id: "stem-only", icon: "📄", name: "The Stem Is the Whole World",
    rule: "Answer only what's on the screen. Never add facts, assume from demographics, or redo a step the stem says already happened. ASWB writes each question as a self-contained unit.",
    cues: ["\"after exploring the client's feelings…\" (that step is DONE)", "demographic details that tempt assumptions", "options addressing problems the stem never stated"],
    apply: "Inventory what the stem establishes and what it rules out. If an option repeats a completed step or needs an invented fact to be right, kill it.",
    mistake: "Re-assessing what was assessed, or picking an answer that solves a problem you imagined into the vignette.",
    source: "2025 ASWB Examination Guidebook — 'never add information to the stem'"
  },
  {
    id: "revise-with-reason", icon: "🔁", name: "Revise with Reason",
    rule: "\"Always trust your first instinct\" is a myth: across 70+ years of research, answer changes go wrong-to-right about 2:1 over right-to-wrong. The real rule: change when you have a concrete reason or low confidence on that specific item; keep when you're confident.",
    cues: ["second thoughts on a reasoning question", "you spotted something in the stem you missed the first time", "vague unease with no identifiable reason (that's when you KEEP)"],
    apply: "When rechecking flagged questions, ask: can I name what I missed? If yes — revise (the research is on your side, and ASWB itself says don't fear changing answers). If it's just nerves with no new reason, keep your answer and move on.",
    mistake: "Refusing to change a wrong answer because of the first-instinct myth — or churning answers on pure anxiety with no new information.",
    source: "Kruger et al. 2005 (JPSP, 1,561 real exams); Benjamin et al. 1984 review (33 studies); Couchman et al. 2016 on item-level confidence; 2025 ASWB Guidebook 'Don't be afraid to change your answers'"
  },
  {
    id: "eliminate-anticipate", icon: "✂️", name: "Anticipate, Then Eliminate",
    rule: "For recall and definition items: answer the question in your head BEFORE reading the options, then match. If unsure, eliminate the one or two options you know are wrong and pick from the rest — there's no penalty for guessing.",
    cues: ["definition/term questions (defense mechanisms, theorists, DSM criteria)", "near-synonym option sets", "you feel the pull of a familiar-sounding wrong term"],
    apply: "Cover the options, answer from memory, then look. Near-miss terms (Introjection vs. Identification, GAD vs. Adjustment Disorder) lose their pull when you've already committed to an answer.",
    mistake: "Reading options first and letting a familiar near-miss term hijack your memory — the term-confusion trap.",
    source: "2025 ASWB Examination Guidebook official 5-step method; test-science on answer anticipation"
  }
];

/* Filled by data/strategy-exemplars.js — {strategyId: [questionIds]} */
window.STRATEGY_EXEMPLARS = window.STRATEGY_EXEMPLARS || null;
