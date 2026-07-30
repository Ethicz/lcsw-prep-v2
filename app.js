/* LCSW Exam Prep — app logic v3. No dependencies, works from file://.
   Question banks register themselves on window.LCSW_BANKS (see data/*.js).
   v3 adds: spaced repetition (due queue), ASWB readiness score, trap-pattern
   diagnosis, pacing training, confidence marking, progress export/import. */
"use strict";

const App = (() => {
  const LS_KEY = "lcsw-study-v2";   // kept for backwards compatibility; records migrate in place
  const GOAL = 93;
  const PACE_SEC = 84;              // real exam budget: 170 Q / 4 hrs ≈ 84 sec/question
  const DAY = 86400000;

  // ── data ──────────────────────────────────────────────
  const banks = (window.LCSW_BANKS || []);
  const allQuestions = [];
  banks.forEach(b => b.questions.forEach(q => { q.bankId = b.id; q.bankTitle = b.title; allQuestions.push(q); }));
  const byId = Object.fromEntries(allQuestions.map(q => [q.id, q]));

  // ── ASWB clinical exam blueprint ──────────────────────
  const ASWB_AREAS = [
    { key: "HD", name: "Human Development, Diversity & Behavior", w: 0.24 },
    { key: "AD", name: "Assessment & Diagnosis", w: 0.30 },
    { key: "IN", name: "Interventions & Case Management", w: 0.27 },
    { key: "ET", name: "Professional Values & Ethics", w: 0.19 }
  ];
  const AREA_BY_KEY = Object.fromEntries(ASWB_AREAS.map(a => [a.key, a]));
  function areaOf(q) {
    const t = (q.topic || "") + " " + (q.bankId || "");
    if (/ethic|confidential|informed consent|dual relation|termination|colleague|self-determination|subpoena|legal|supervision|technology|fees|boundar|values/i.test(t)) return "ET";
    if (/develop|defense|human behavior|diversity|attachment|lgbtq|child abuse|elder|domestic violence|human dev|theorist|moral|ecological|systems theory|group development/i.test(t)) return "HD";
    if (/stages of change|exam strategy|safer/i.test(t)) return "IN";
    if (/dsm|diagnos|psychotic|mood|anxiety|trauma & stressor|personality|neurocognitive|substance-related|dissociative|somatic|eating|sleep|childhood|neurodevelopmental|sexual & gender|mental status|assessment|psychological test|medical|mimic|suicide risk|danger|research/i.test(t)) return "AD";
    if (/therap|treatment|intervention|crisis|medication|meds|macro|program|case management|social worker role|advocacy|planning/i.test(t)) return "IN";
    return "IN";
  }

  // ── persistent store ──────────────────────────────────
  let store = load();
  function load() {
    let s;
    try { s = JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { s = {}; }
    s.q = s.q || {}; s.sessions = s.sessions || []; s.starred = s.starred || {}; s.traps = s.traps || {}; s.notes = s.notes || {};
    // migrate v2 records → give previously-answered questions a due date
    Object.values(s.q).forEach(r => {
      if (r.due === undefined) {
        r.ivl = r.streak > 1 ? 3 : r.streak === 1 ? 1 : 0;
        r.due = r.streak > 0 ? (r.last || Date.now()) + r.ivl * DAY : Date.now();
      }
    });
    return s;
  }
  function save() { localStorage.setItem(LS_KEY, JSON.stringify(store)); scheduleSync(); }
  function rec(id) { return store.q[id] || (store.q[id] = { seen: 0, right: 0, streak: 0, last: 0, due: Date.now(), ivl: 0 }); }
  function starCount() { return Object.keys(store.starred).filter(id => store.starred[id] && byId[id]).length; }
  function masteredCount() { return allQuestions.filter(q => { const r = store.q[q.id]; return r && r.streak >= 2; }).length; }


  // ── spaced repetition ─────────────────────────────────
  function schedule(r, ok, guessed) {
    if (!ok) { r.ivl = 0; r.due = Date.now(); }              // stays in the Due queue until answered right
    else if (guessed) { r.ivl = 1; r.due = Date.now() + DAY; } // lucky guess ≠ mastered
    else {
      r.ivl = r.ivl > 0 ? Math.min(60, Math.round(r.ivl * 2.4)) : 3;
      r.due = Date.now() + r.ivl * DAY;
    }
  }
  function dueQuestions() {
    const now = Date.now();
    return allQuestions.filter(q => { const r = store.q[q.id]; return r && r.seen && r.due <= now; })
      .sort((a, b) => store.q[a.id].due - store.q[b.id].due);
  }

  // ── stats helpers ─────────────────────────────────────
  function topicStats() {
    const map = {};
    allQuestions.forEach(q => {
      const t = q.topic || q.bankTitle;
      const m = map[t] || (map[t] = { seen: 0, right: 0, total: 0, covered: 0, mastered: 0 });
      m.total++;
      const r = store.q[q.id];
      if (r && r.seen) { m.seen += r.seen; m.right += r.right; m.covered++; if (r.streak >= 2) m.mastered++; }
    });
    return map;
  }
  function overallPct() {
    let s = 0, r = 0;
    Object.values(store.q).forEach(x => { s += x.seen; r += x.right; });
    return s ? Math.round(100 * r / s) : null;
  }
  function recentPct(n = 100) {
    const answered = store.sessions.flatMap(s => s.answers || []).slice(-n);
    if (!answered.length) return null;
    return Math.round(100 * answered.filter(a => a.ok).length / answered.length);
  }
  // Readiness: per attempted question, "known now" = current streak > 0.
  // Area accuracy = share known; projected score = Σ blueprint-weight × area accuracy.
  function readiness() {
    const areas = {};
    ASWB_AREAS.forEach(a => areas[a.key] = { known: 0, attempted: 0, total: 0 });
    allQuestions.forEach(q => {
      const a = areas[areaOf(q)];
      a.total++;
      const r = store.q[q.id];
      if (r && r.seen) { a.attempted++; if (r.streak > 0) a.known++; }
    });
    let projected = 0, anyData = false;
    const overallKnown = Object.values(areas).reduce((s, a) => s + a.known, 0);
    const overallAtt = Object.values(areas).reduce((s, a) => s + a.attempted, 0);
    const fallback = overallAtt ? overallKnown / overallAtt : 0;
    ASWB_AREAS.forEach(a => {
      const d = areas[a.key];
      d.acc = d.attempted ? d.known / d.attempted : null;
      if (d.attempted) anyData = true;
      projected += a.w * (d.acc == null ? fallback : d.acc);
      d.pointsLost = Math.round(a.w * (1 - (d.acc == null ? fallback : d.acc)) * 1000) / 10; // % points left on table
    });
    return { areas, projected: anyData ? Math.round(projected * 100) : null, coverage: Math.round(100 * overallAtt / allQuestions.length) };
  }
  const TRAP_INFO = {
    "acts-before-assessing": "Acting before assessing — you chose an intervention before gathering information or assessing risk. Rule: assess/clarify FIRST.",
    "premature-reporting": "Reporting too fast — filing or breaking confidentiality before the threshold or clarification. Rule: reasonable suspicion needs clarifying first when ambiguous.",
    "fails-duty": "Missing a duty — maintaining confidentiality or staying passive when a duty to report/warn/protect exists.",
    "too-restrictive": "Over-escalating — choosing the most intrusive option (hospitalize, 911) when a lesser step meets the risk. Rule: least restrictive that keeps people safe.",
    "self-determination": "Overriding autonomy — advising, deciding for, or pressuring the client absent imminent risk.",
    "right-but-later": "Right action, wrong turn — a good step, but not the FIRST/NEXT the question asked for. Watch the sequencing word.",
    "wrong-role": "Out of role — medical/legal advice or an inappropriate handoff instead of social work action.",
    "near-diagnosis": "Near-miss differential — the adjacent DSM diagnosis. Re-check durations and criteria.",
    "term-confusion": "Adjacent term — the concept next door to the right one. Drill definitions.",
    "knowledge": "Knowledge gap — a factual miss rather than a reasoning trap."
  };

  // ── sampling ──────────────────────────────────────────
  function weight(q) {
    const r = store.q[q.id];
    let w;
    if (!r || !r.seen) w = 5;
    else if (r.streak <= 0) w = 8 + Math.min(6, -r.streak * 2);
    else if (r.streak === 1) w = 4;
    else if (r.streak === 2) w = 2;
    else w = 1;
    if (store.starred[q.id]) w *= 2;
    if (r && r.last && r.streak > 0) {
      const hrs = (Date.now() - r.last) / 3600000;
      if (hrs < 6) w *= 0.25;
      else if (hrs < 24) w *= 0.6;
    }
    return w;
  }
  // Hard anti-repeat: drop questions answered recently (12h if you got them
  // right, 30min if wrong — misses still come back via Due/Missed) as long as
  // enough fresh material remains to fill the session.
  function excludeRecent(pool, n) {
    const now = Date.now();
    const fresh = pool.filter(q => {
      const r = store.q[q.id];
      if (!r || !r.last) return true;
      return (now - r.last) > (r.streak > 0 ? 12 * 3600e3 : 1800e3);
    });
    return fresh.length >= n ? fresh : pool;
  }
  function weightedSample(pool, n) {
    const items = excludeRecent(pool, n).map(q => ({ q, w: weight(q) }));
    const out = [];
    while (out.length < n && items.length) {
      let tot = items.reduce((a, x) => a + x.w, 0);
      let roll = Math.random() * tot, idx = 0;
      for (let i = 0; i < items.length; i++) { roll -= items[i].w; if (roll <= 0) { idx = i; break; } }
      out.push(items[idx].q); items.splice(idx, 1);
    }
    return shuffle(out);
  }
  // Exams prefer material you haven't faced: unseen first, then questions not
  // touched in 24h, then (only if needed) recent ones. Random within each tier.
  function freshSample(pool, n) {
    const now = Date.now();
    const unseen = [], stale = [], recent = [];
    pool.forEach(q => {
      const r = store.q[q.id];
      if (!r || !r.seen) unseen.push(q);
      else if (now - (r.last || 0) > 24 * 3600e3) stale.push(q);
      else recent.push(q);
    });
    const out = shuffle(unseen).slice(0, n);
    if (out.length < n) out.push(...shuffle(stale).slice(0, n - out.length));
    if (out.length < n) out.push(...shuffle(recent).slice(0, n - out.length));
    return shuffle(out);
  }
  function uniformSample(pool, n) { return shuffle([...pool]).slice(0, n); }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }

  // ── quiz session ──────────────────────────────────────
  let session = null;
  function startQuiz(questions, opts) {
    if (!questions.length) { toast("No questions match that selection"); return; }
    const live = resumableInfo();
    if (live && !confirm(`You have a test in progress (${live.i + 1} of ${live.n}).\n\nStarting a new one will discard it. Continue?`)) {
      resumeTest(); return;
    }
    clearSavedSession();
    session = {
      qs: questions, i: 0, answers: [], mode: opts.mode || "practice",
      immediate: opts.immediate !== false, title: opts.title || "Quiz",
      started: Date.now(), qStart: Date.now(), shuffledOpts: {}, paced: !!opts.paced,
      sectioned: !!opts.sectioned && questions.length > 100,
      breakAt: Math.floor(questions.length / 2), breakTaken: false
    };
    questions.forEach(q => { session.shuffledOpts[q.id] = shuffle(q.options.map((_, i) => i)); });
    go("quiz");
  }

  function answer(q, chosenOrigIdx, ms) {
    const ok = chosenOrigIdx === q.answer;
    const r = rec(q.id);
    r.seen++; r.last = Date.now();
    if (ok) { r.right++; r.streak = Math.max(1, r.streak + 1); }
    else { r.streak = Math.min(-1, r.streak - 1); }
    schedule(r, ok, false);
    if (!ok && Array.isArray(q.traps) && q.traps[chosenOrigIdx]) {
      const tag = q.traps[chosenOrigIdx];
      store.traps[tag] = (store.traps[tag] || 0) + 1;
    }
    if (ok) {
      session.combo = (session.combo || 0) + 1;
      session.maxCombo = Math.max(session.maxCombo || 0, session.combo);
    } else session.combo = 0;
    session.answers.push({ id: q.id, ok, chosen: chosenOrigIdx, ms });
    save();
    return ok;
  }

  function markGuess() {
    const a = session.answers[session.answers.length - 1];
    if (!a || a.guess) return;
    a.guess = true;
    const r = rec(a.id);
    schedule(r, a.ok, true);      // right-by-guess → back tomorrow, not in 3+ days
    save();
    const b = el("guess-btn");
    if (b) { b.textContent = "⚑ Marked as a guess — it'll come back tomorrow"; b.disabled = true; }
    toast("Marked as a guess");
  }

  function finishQuiz() {
    clearInterval(timerInt);
    const s = session;
    s.finished = true;
    clearSavedSession();
    store.sessions.push({
      when: Date.now(), title: s.title, mode: s.mode,
      n: s.answers.length, right: s.answers.filter(a => a.ok).length,
      answers: s.answers, secs: Math.round((Date.now() - s.started) / 1000)
    });
    if (store.sessions.length > 200) store.sessions = store.sessions.slice(-200);
    save();
    go("result");
  }

  // ── view plumbing ─────────────────────────────────────
  const V = {};
  const el = id => document.getElementById(id);
  const view = () => el("view");
  // ── in-progress test: survive accidental navigation AND reloads ──
  // The session object already survives a view change; what was missing was a
  // way back to it. We add (a) a resume banner on every non-quiz screen and
  // (b) localStorage persistence so a reload or crash doesn't lose the test.
  const SESS_KEY = "lcsw-active-test-v1";
  let renderingQuiz = false;
  function persistSession() {
    if (!session || !session.qs || session.finished || session.i >= session.qs.length) return;
    try {
      localStorage.setItem(SESS_KEY, JSON.stringify({
        qids: session.qs.map(q => q.id), i: session.i, answers: session.answers,
        mode: session.mode, immediate: session.immediate, title: session.title,
        started: session.started, savedAt: Date.now(), shuffledOpts: session.shuffledOpts,
        paced: !!session.paced, sectioned: !!session.sectioned, breakAt: session.breakAt,
        breakTaken: !!session.breakTaken, combo: session.combo || 0, maxCombo: session.maxCombo || 0,
        sprintReturn: session.sprintReturn || null, graded: !!session.graded
      }));
    } catch (e) { /* quota — resume simply won't survive a reload */ }
  }
  function clearSavedSession() { try { localStorage.removeItem(SESS_KEY); } catch (e) {} }
  function loadSavedSession() {
    let raw;
    try { raw = JSON.parse(localStorage.getItem(SESS_KEY)); } catch (e) { return null; }
    if (!raw || !Array.isArray(raw.qids) || !raw.qids.length) return null;
    if (raw.i >= raw.qids.length) { clearSavedSession(); return null; }
    const qs = raw.qids.map(id => byId[id]);
    if (qs.some(q => !q)) { clearSavedSession(); return null; }   // bank changed under us
    return { ...raw, qs };
  }
  function resumableInfo() {
    if (session && session.qs && !session.finished && session.i < session.qs.length) {
      return { title: session.title, i: session.i, n: session.qs.length };
    }
    const p = loadSavedSession();
    return p ? { title: p.title, i: p.i, n: p.qids.length } : null;
  }
  function resumeTest() {
    if (session && session.qs && !session.finished && session.i < session.qs.length) { go("quiz"); return; }
    const p = loadSavedSession();
    if (!p) { toast("That test is no longer available"); go("home"); return; }
    // Time spent away doesn't count against pace — this is an accidental exit, not a break.
    const away = Date.now() - (p.savedAt || Date.now());
    // If the current question was already graded before they left, don't ask it
    // again — it's already recorded in their history.
    if (p.graded) p.i = Math.min(p.i + 1, p.qs.length - 1);
    session = {
      qs: p.qs, i: p.i, answers: p.answers || [], mode: p.mode, immediate: p.immediate,
      title: p.title, started: (p.started || Date.now()) + away, qStart: Date.now(),
      shuffledOpts: p.shuffledOpts || {}, paced: p.paced, sectioned: p.sectioned,
      breakAt: p.breakAt, breakTaken: p.breakTaken, combo: p.combo, maxCombo: p.maxCombo,
      sprintReturn: p.sprintReturn || null, pending: null, graded: false
    };
    p.qs.forEach(q => { if (!session.shuffledOpts[q.id]) session.shuffledOpts[q.id] = shuffle(q.options.map((_, i) => i)); });
    toast("Picking up where you left off");
    go("quiz");
  }
  function resumeBanner() {
    const r = resumableInfo();
    if (!r) return "";
    return `<div class="card resume-banner" onclick="App.resumeTest()">
      <div class="rb-left"><span class="rb-dot"></span>
        <div><div class="rb-title">Test in progress — ${r.i + 1} of ${r.n}</div>
        <div class="rb-sub">${esc(r.title)} · your place is saved</div></div></div>
      <button class="primary rb-btn" onclick="event.stopPropagation(); App.resumeTest()">Resume →</button>
    </div>`;
  }
  function h(html) {
    view().innerHTML = (renderingQuiz ? "" : resumeBanner()) + html;
    window.scrollTo(0, 0);
    renderingQuiz = false;
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
  function escA(s) { return esc(s).replace(/'/g, "&#39;"); }
  function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2200);
  }
  function pctClass(p) { return p == null ? "" : p >= GOAL ? "goal-good" : p >= 85 ? "goal-mid" : "goal-bad"; }

  // ── home ──────────────────────────────────────────────
  V.home = () => {
    const rd = readiness();
    const due = dueQuestions().length;
    const missed = allQuestions.filter(q => { const x = store.q[q.id]; return x && x.seen && x.streak <= 0; }).length;
    const unseen = allQuestions.filter(q => !store.q[q.id] || !store.q[q.id].seen).length;
    const stars = starCount();
    h(`
    <div class="statbar">
      <div class="stat"><div class="v ${pctClass(rd.projected)}">${rd.projected == null ? "–" : rd.projected + "%"}</div><div class="l">Projected</div></div>
      <div class="stat"><div class="v ${pctClass(recentPct(100))}">${recentPct(100) == null ? "–" : recentPct(100) + "%"}</div><div class="l">Last 100</div></div>
      <div class="stat"><div class="v">${masteredCount()}</div><div class="l">Mastered</div></div>
    </div>
    ${(() => {
      // ONE next action, chosen for you: finish the sprint block, clear the
      // queue, or start a smart set. Replaces the old hero + sprint CTA pair.
      const sp = sprintState(), bl = sprintBlocks(), nx = nextSprintBlock();
      const spDone = bl.filter(b => sp.done[b.id]).length;
      const inSprint = bl.length && spDone > 0 && nx;
      if (inSprint) return `<div class="card focus-card" onclick="App.startBlock('${nx.id}')">
        <div class="fc-eyebrow">EXAM SPRINT · ${spDone}/${bl.length} blocks</div>
        <div class="fc-row"><div class="fc-icon">${nx.icon}</div>
          <div class="fc-body"><div class="fc-title">${esc(nx.title)}</div>
          <div class="fc-sub">${nx.mins} min · ${esc(nx.tag)}</div></div>
          <button class="primary fc-btn" onclick="event.stopPropagation(); App.startBlock('${nx.id}')">Start →</button></div>
        <div class="sprint-progress" style="margin-top:11px;"><div style="width:${Math.round(100 * spDone / bl.length)}%"></div></div></div>`;
      return `<div class="card focus-card">
        <div class="fc-eyebrow">${due ? "UP NEXT" : "READY WHEN YOU ARE"}</div>
        <div class="fc-row"><div class="fc-icon">${due ? "📅" : "⚡"}</div>
          <div class="fc-body"><div class="fc-title">${due ? `${due} question${due === 1 ? "" : "s"} due` : "Queue clear"}</div>
          <div class="fc-sub">${due ? "Spaced repetition pays off when you clear it daily." : `${unseen} questions you haven't seen yet.`}</div></div>
          <button class="primary fc-btn" onclick="${due ? "App.dueDrill()" : "App.quick(10)"}">${due ? "Review →" : "Quick 10 →"}</button></div></div>`;
    })()}
    <div class="grid">
      <button class="mode-btn" onclick="App.quick(10)"><h3>⚡ Quick 10</h3><p>Smart set, weighted to what you're missing.</p></button>
      <button class="mode-btn" onclick="App.go('sprint')"><h3>🎯 Exam Sprint</h3><p>Your guided plan, built from the questions you missed.</p></button>
      <button class="mode-btn" onclick="App.go('practice')"><h3>📚 Practice &amp; Exams</h3><p>Full exam, mock, by bank, by subject, missed, starred.</p></button>
      <button class="mode-btn" onclick="App.go('learn')"><h3>🧠 Learn</h3><p>Medications, theories, and exam strategy.</p></button>
    </div>
    `);
  };

  // ── hub: everything that serves questions ─────────────
  V.practice = () => {
    const due = dueQuestions().length;
    const missed = allQuestions.filter(q => { const x = store.q[q.id]; return x && x.seen && x.streak <= 0; }).length;
    const stars = starCount();
    h(`
    <div class="section-title">Smart practice</div>
    <div class="grid">
      <button class="mode-btn" onclick="App.dueDrill()"><h3>📅 Due Today <span class="em">(${due})</span></h3><p>Your spaced-repetition queue.</p></button>
      <button class="mode-btn" onclick="App.quick(25)"><h3>🎯 Focused 25</h3><p>Longer smart set — unseen, missed and starred come up more.</p></button>
      <button class="mode-btn" onclick="App.missed()"><h3>🔁 Missed <span class="em">(${missed})</span></h3><p>Re-drill what you've gotten wrong until it sticks.</p></button>
      <button class="mode-btn" onclick="App.starred()"><h3>⭐ Starred <span class="em">(${stars})</span></h3><p>Questions you marked as difficult.</p></button>
    </div>
    <div class="section-title">Exams &amp; custom sets</div>
    <div class="grid">
      <button class="mode-btn" onclick="App.fullExam()"><h3>🏁 Full Exam (170)</h3><p>Two 85-question sections, Section 1 locks, pace tracked.</p></button>
      <button class="mode-btn" onclick="App.mock()"><h3>📝 Mock Exam (50)</h3><p>Exam conditions, feedback at the end.</p></button>
      <button class="mode-btn" onclick="App.go('topics')"><h3>📚 By Bank</h3><p>Crisis, DSM, Ethics, Final Mocks, ASWB samples…</p></button>
      <button class="mode-btn" onclick="App.go('subjects')"><h3>🔎 By Subject</h3><p>Any subjects across all banks.</p></button>
    </div>`);
  };

  // ── hub: everything that teaches ──────────────────────
  V.learn = () => {
    h(`
    <div class="section-title">Trainers</div>
    <div class="grid">
      <button class="mode-btn" onclick="App.go('meds')"><h3>💊 Medications</h3><p>Drug → category, brand ↔ generic, cheat sheet.</p></button>
      <button class="mode-btn" onclick="App.go('theory')"><h3>🧠 Theories</h3><p>9 frameworks, theorist ID, attachment drills.</p></button>
    </div>
    <div class="section-title">Exam strategy</div>
    <div class="grid">
      <button class="mode-btn" onclick="App.go('howtotest')"><h3>🎓 How to Test</h3><p>The 9 strategies behind <span class="em">80–85% of the exam</span>, with drills.</p></button>
      <button class="mode-btn" onclick="App.go('strategy')"><h3>🧭 Reference Card</h3><p>SAFER ladder, qualifier rules, official ASWB guidance.</p></button>
    </div>
    <div class="section-title">Study method</div>
    <div class="grid">
      <button class="mode-btn" onclick="App.go('coach')"><h3>🏆 Test Ready</h3><p>Your daily plan, generated from your own stats.</p></button>
      <button class="mode-btn" onclick="App.go('techniques')"><h3>📖 What Works</h3><p>Evidence-graded study techniques — and the myths.</p></button>
    </div>`);
  };

  // ── study by bank ─────────────────────────────────────
  V.topics = () => {
    const rows = banks.map(b => {
      const qs = b.questions;
      let seen = 0, right = 0, covered = 0, mastered = 0;
      qs.forEach(q => {
        const r = store.q[q.id];
        if (r && r.seen) { seen += r.seen; right += r.right; covered++; if (r.streak >= 2) mastered++; }
      });
      const pct = seen ? Math.round(100 * right / seen) : null;
      return `<label class="topic-check"><input type="checkbox" value="${b.id}">
        <span>${esc(b.title)}</span>
        <span class="cnt">${covered}/${qs.length} seen · <span style="color:var(--good)">${mastered} ✓</span>${pct != null ? ` · <span class="${pctClass(pct)}">${pct}%</span>` : ""}</span></label>`;
    }).join("");
    h(`<div class="card"><h2 style="margin-bottom:12px;">Study by Bank</h2>${rows}
      <div class="row" style="margin-top:14px;">
        <label style="font-size:.85rem;color:var(--muted)"><input type="checkbox" id="t-exam-mode"> Exam mode (no feedback until end)</label>
        <label style="font-size:.85rem;color:var(--muted)">How many: <select id="t-count"><option>10</option><option selected>20</option><option>40</option><option value="all">All</option></select></label>
      </div>
      <div class="row" style="margin-top:14px;">
        <button class="ghost" onclick="App.go('home')">Back</button>
        <button class="primary" onclick="App.topicStart()">Start</button>
      </div></div>`);
  };
  function topicStart() {
    const ids = [...view().querySelectorAll("input[type=checkbox]:checked")].map(c => c.value).filter(v => v !== "on");
    const pool = allQuestions.filter(q => ids.includes(q.bankId));
    if (!pool.length) { toast("Pick at least one bank"); return; }
    const cntSel = el("t-count").value;
    const n = cntSel === "all" ? pool.length : Math.min(+cntSel, pool.length);
    const immediate = !el("t-exam-mode").checked;
    startQuiz(weightedSample(pool, n), { title: "Bank drill", immediate, mode: "topic", paced: !immediate });
  }

  // ── custom test by subject ────────────────────────────
  V.subjects = () => {
    const ts = topicStats();
    const subjects = Object.entries(ts).sort((a, b) => a[0].localeCompare(b[0]));
    const rows = subjects.map(([t, m]) => {
      const pct = m.seen ? Math.round(100 * m.right / m.seen) : null;
      return `<label class="topic-check"><input type="checkbox" value="${escA(t)}">
        <span>${esc(t)}</span>
        <span class="cnt">${m.covered}/${m.total} seen · <span style="color:var(--good)">${m.mastered} ✓</span>${pct != null ? ` · <span class="${pctClass(pct)}">${pct}%</span>` : ""}</span></label>`;
    }).join("");
    h(`<div class="card"><h2 style="margin-bottom:4px;">Custom Test by Subject</h2>
      <p style="color:var(--muted); font-size:.82rem; margin-bottom:12px;">Subjects span every bank — picking "Therapy Theories" pulls theory questions from all exams at once.</p>
      ${rows}
      <div class="row" style="margin-top:14px;">
        <label style="font-size:.85rem;color:var(--muted)"><input type="checkbox" id="s-starred"> Starred questions only</label>
        <label style="font-size:.85rem;color:var(--muted)"><input type="checkbox" id="s-exam-mode"> Exam mode</label>
        <label style="font-size:.85rem;color:var(--muted)">How many: <select id="s-count"><option>10</option><option selected>20</option><option>40</option><option value="all">All</option></select></label>
      </div>
      <div class="row" style="margin-top:14px;">
        <button class="ghost" onclick="App.go('home')">Back</button>
        <button class="primary" onclick="App.subjectStart()">Start</button>
      </div></div>`);
  };
  function subjectStart() {
    const picked = [...view().querySelectorAll(".topic-check input:checked")].map(c => c.value);
    let pool = allQuestions.filter(q => picked.includes(q.topic || q.bankTitle));
    if (el("s-starred").checked) pool = pool.filter(q => store.starred[q.id]);
    if (!picked.length) { toast("Pick at least one subject"); return; }
    if (!pool.length) { toast("No questions match (no starred in those subjects yet?)"); return; }
    const cntSel = el("s-count").value;
    const n = cntSel === "all" ? pool.length : Math.min(+cntSel, pool.length);
    const immediate = !el("s-exam-mode").checked;
    startQuiz(weightedSample(pool, n), { title: "Custom test", immediate, mode: "subject", paced: !immediate });
  }

  // ── quiz rendering ────────────────────────────────────
  V.quiz = () => renderQuestion();

  let timerInt = null;
  function fmtSec(t) { return `${Math.floor(t / 60)}:${String(Math.floor(t) % 60).padStart(2, "0")}`; }
  function paceHtml() {
    const s = session;
    if (!s.paced) return `<span class="timer">${fmtSec((Date.now() - s.started) / 1000)}</span>`;
    const elapsed = (Date.now() - s.started) / 1000;
    const budget = s.answers.length * PACE_SEC;
    const delta = budget - elapsed;
    const cls = delta >= 0 ? "goal-good" : (delta > -120 ? "goal-mid" : "goal-bad");
    return `<span class="timer">${fmtSec(elapsed)} · <span class="${cls}">${delta >= 0 ? "▲" : "▼"} ${fmtSec(Math.abs(delta))} vs pace</span></span>`;
  }
  function starBtnHtml(id) {
    const on = !!store.starred[id];
    return `<span id="star-${id}" onclick="App.toggleStar('${id}')" title="Mark as difficult"
      style="cursor:pointer; font-size:1.25rem; color:${on ? "var(--warn)" : "var(--muted)"};">${on ? "★" : "☆"}</span>`;
  }
  function renderQuestion() {
    const s = session, q = s.qs[s.i];
    const order = s.shuffledOpts[q.id];
    const letters = "ABCDEF";
    renderingQuiz = true;
    persistSession();
    s.qStart = Date.now();
    s.pending = null;
    s.graded = false;
    clearInterval(timerInt);
    timerInt = setInterval(() => {
      const t = view().querySelector(".pace-slot");
      if (t && session) t.innerHTML = paceHtml(); else clearInterval(timerInt);
    }, 1000);
    h(`
    <div class="progressbar"><div style="width:${(s.i / s.qs.length) * 100}%"></div></div>
    <div class="q-meta"><span>${esc(s.title)}${s.sectioned ? ` · Section ${s.i < s.breakAt ? 1 : 2} · ${(s.i < s.breakAt ? s.i : s.i - s.breakAt) + 1} / ${s.i < s.breakAt ? s.breakAt : s.qs.length - s.breakAt}` : ` · ${s.i + 1} / ${s.qs.length}`}</span>
      <span style="display:flex; gap:10px; align-items:center;"><span id="combo-chip" class="${(s.combo || 0) >= 2 ? "combo-chip" : ""}">${(s.combo || 0) >= 2 ? `🔥 ×${s.combo}` : ""}</span><span class="pace-slot">${paceHtml()}</span></span></div>
    <div class="card">
      <div class="q-meta"><span>
        <span class="badge">${esc(q.topic || q.bankTitle)}</span>${(() => {
          const r0 = store.q[q.id];
          if (!r0 || !r0.seen) return `<span class="badge" style="color:var(--accent)">NEW</span>`;
          if (r0.streak >= 2) return `<span class="badge" style="color:var(--good)">✓ mastered</span>`;
          return `<span class="badge">seen ×${r0.seen}${r0.streak <= 0 ? " · missed last time" : ""}</span>`;
        })()}</span>${starBtnHtml(q.id)}</div>
      <div class="q-stem">${esc(q.stem)}</div>
      <div id="opts">${order.map((origIdx, i) =>
        `<button class="opt" data-orig="${origIdx}" onclick="App.pick(this)"><b>${letters[i]}.</b> ${esc(q.options[origIdx])}</button>`).join("")}
      </div>
      <div id="feedback"></div>
      <div class="row" style="margin-top:10px;">
        <button class="ghost" onclick="App.quitQuiz()">End quiz</button>
        <span style="display:flex; gap:8px;">
          ${!s.immediate && s.i < s.qs.length - 1 && !(s.sectioned && !s.breakTaken && s.i === s.breakAt - 1) ? `<button class="ghost" id="skip-btn" onclick="App.skipQuestion()" title="ASWB tip: answer what you're sure of first, then come back">Skip for now ↷</button>` : ""}
          <button class="primary hidden" id="next-btn" onclick="App.next()">Next →</button>
        </span>
      </div>
    </div>`);
  }

  // ASWB "multiple passes" technique: unanswered question moves to the end of the
  // CURRENT section (skips can't cross the section lock, matching the real exam).
  function skipQuestion() {
    const s = session;
    if (!s || s.i >= s.qs.length - 1) return;
    const inSection1 = s.sectioned && !s.breakTaken && s.i < s.breakAt;
    if (inSection1 && s.i === s.breakAt - 1) return;
    const [q] = s.qs.splice(s.i, 1);
    if (inSection1) s.qs.splice(s.breakAt - 1, 0, q);
    else s.qs.push(q);
    toast(inSection1 ? "Skipped — it'll come back before Section 1 locks" : "Skipped — it'll come back at the end");
    renderQuestion();
  }

  function toggleStar(id) {
    store.starred[id] = !store.starred[id];
    if (!store.starred[id]) delete store.starred[id];
    save();
    const elx = el("star-" + id);
    if (elx) { const on = !!store.starred[id]; elx.textContent = on ? "★" : "☆"; elx.style.color = on ? "var(--warn)" : "var(--muted)"; }
  }

  // Click = provisional selection. Nothing is recorded until Next/Check is pressed,
  // so you can change your answer freely mid-question.
  function pick(btn) {
    const s = session;
    if (!s || s.graded) return;
    s.pending = +btn.dataset.orig;
    [...view().querySelectorAll(".opt")].forEach(o => o.classList.toggle("sel", o === btn));
    const nb = el("next-btn");
    nb.classList.remove("hidden");
    nb.textContent = s.immediate ? "Check ✓" : (s.i + 1 >= s.qs.length ? "Finish ✓" : "Next →");
  }

  function noteUI(qid) {
    const existing = store.notes[qid];
    return `<div id="note-area-${qid}" style="margin-top:8px;">
      ${existing ? `<div class="expl" style="border-color:var(--warn);">✍️ Your note: ${esc(existing)}</div>` : ""}
      <button class="ghost" style="font-size:.8rem;" onclick="App.editNote('${qid}')">✍️ ${existing ? "Edit your note" : "Explain it in your own words"}</button>
      <div id="note-edit-${qid}" class="hidden" style="margin-top:6px;">
        <textarea id="note-text-${qid}" rows="2" style="width:100%; background:var(--card2); color:var(--text); border:1px solid var(--card2); border-radius:8px; padding:8px; font-family:inherit; font-size:.88rem;" placeholder="Why is the right answer right? What rule decides it?">${esc(existing || "")}</textarea>
        <button class="ghost" style="font-size:.8rem; margin-top:4px;" onclick="App.saveNote('${qid}')">Save note</button>
      </div></div>`;
  }
  function editNote(qid) { const e = el("note-edit-" + qid); if (e) { e.classList.toggle("hidden"); const t = el("note-text-" + qid); if (t && !e.classList.contains("hidden")) t.focus(); } }
  function saveNote(qid) {
    const t = el("note-text-" + qid);
    if (!t) return;
    const v = t.value.trim();
    if (v) store.notes[qid] = v; else delete store.notes[qid];
    save();
    toast(v ? "Note saved — it'll show whenever you review this question" : "Note removed");
    const area = el("note-area-" + qid);
    if (area) area.outerHTML = noteUI(qid);
  }

  function commit() {
    const s = session, q = s.qs[s.i];
    const chosen = s.pending;
    const ms = Date.now() - s.qStart;
    const ok = answer(q, chosen, ms);
    s.graded = true;
    const cc = el("combo-chip");
    if (cc) {
      if ((s.combo || 0) >= 2) {
        cc.className = "combo-chip"; cc.textContent = `🔥 ×${s.combo}`;
        requestAnimationFrame(() => { cc.classList.add("pop"); setTimeout(() => cc.classList.remove("pop"), 180); });
      } else { cc.className = ""; cc.textContent = ""; }
    }
    if (!s.immediate) return true;  // exam mode: advance right away
    const opts = [...view().querySelectorAll(".opt")];
    const trapTag = (!ok && Array.isArray(q.traps)) ? q.traps[chosen] : null;
    opts.forEach(o => {
      o.disabled = true; o.classList.remove("sel");
      const oi = +o.dataset.orig;
      if (oi === q.answer) o.classList.add("correct");
      else if (oi === chosen && !ok) o.classList.add("wrong");
    });
    // Every question, every time: which strategies decide it — win or lose.
    const strats = applicableStrategies(q);
    // Compact by default: strategy NAMES stay visible on every question (that's
    // the point of them), but the full rules sit one tap away so they don't
    // push the explanation off screen.
    const strategyBlock = strats.length ? `<details class="strat-chip">
      <summary>🧭 ${strats.map(st => `${st.icon} ${esc(st.name)}`).join(" · ")}</summary>
      <div class="strat-rules">${strats.map(st => `<div><b>${st.icon} ${esc(st.name)}</b> — ${esc(st.rule)}</div>`).join("")}</div>
    </details>` : "";
    el("feedback").innerHTML = `
      <div class="expl"><b style="color:${ok ? "var(--good)" : "var(--bad)"}">${ok ? "✓ Correct" : "✗ Not quite"}</b> — ${esc(q.explanation || "")}
      ${trapTag ? `<div class="flagnote" style="color:var(--accent2)">🪤 ${esc(TRAP_INFO[trapTag] || trapTag)}</div>` : ""}
      ${q.flag ? `<div class="flagnote">⚠ Answer key derived by AI with lower confidence — verify against your materials.</div>` : ""}
      <span class="src">Source: ${esc(q.source || q.bankTitle)}</span></div>
      ${strategyBlock}
      ${ok ? `<button class="ghost" id="guess-btn" style="margin-top:6px; font-size:.82rem; margin-right:6px;" onclick="App.markGuess()">⚑ I was guessing</button>` : ""}
      ${noteUI(q.id)}`;
    const nb = el("next-btn");
    nb.textContent = (s.i + 1 >= s.qs.length) ? "Finish ✓" : "Next →";
    return false;  // stay: show the feedback, advance on the next press
  }

  function next() {
    const s = session;
    if (!s || !view().querySelector("#next-btn") || el("next-btn").classList.contains("hidden")) return;
    if (!s.graded) {
      if (s.pending == null) return;
      if (!commit()) return;
    }
    s.i++;
    if (s.i >= s.qs.length) { finishQuiz(); return; }
    if (s.sectioned && !s.breakTaken && s.i === s.breakAt) { s.breakStart = Date.now(); go("sectionBreak"); return; }
    renderQuestion();
  }

  V.sectionBreak = () => {
    const s = session;
    clearInterval(timerInt);
    renderingQuiz = true;
    persistSession();
    h(`<div class="card" style="text-align:center; padding:30px 18px;">
      <h2 style="margin-bottom:8px;">✅ Section 1 complete — and locked</h2>
      <p style="color:var(--muted); font-size:.9rem; line-height:1.6; margin-bottom:6px;">
        ${s.breakAt} questions submitted in ${fmtSec((s.breakStart - s.started) / 1000)}. Just like the real exam, Section 1 can no longer be reviewed or changed.</p>
      <p style="font-size:.9rem; line-height:1.6; margin-bottom:18px;">
        On exam day you get an optional break of up to <b>10 minutes</b> here with the clock stopped — stand up, water, breathe. The app pauses your pace clock the same way.</p>
      <button class="primary" onclick="App.beginSection2()">Begin Section 2 (${s.qs.length - s.breakAt} questions) →</button>
    </div>`);
  };
  function beginSection2() {
    const s = session;
    s.started += Date.now() - s.breakStart;   // break time doesn't count against pace
    s.breakTaken = true;
    renderQuestion();
  }
  function quitQuiz() {
    clearInterval(timerInt);
    clearSavedSession();
    if (session.answers.length) finishQuiz();
    else { session = null; go("home"); }
  }

  // ── results ───────────────────────────────────────────
  V.result = () => {
    const s = session;
    renderingQuiz = true;
    const right = s.answers.filter(a => a.ok).length;
    const pct = Math.round(100 * right / s.answers.length);
    const wrong = s.answers.filter(a => !a.ok);
    const mins = Math.round((Date.now() - s.started) / 60000);
    const avgSec = Math.round(s.answers.reduce((a, x) => a + (x.ms || 0), 0) / s.answers.length / 1000);
    const slow = s.answers.filter(a => (a.ms || 0) > 150000);
    const guesses = s.answers.filter(a => a.guess).length;
    // One card of expandable rows — a 170-question exam used to render 50+
    // stacked cards here. Summary shows enough to triage; tap to open.
    const reviewRow = (a, headline) => {
      const q = byId[a.id];
      const trapTag = Array.isArray(q.traps) ? q.traps[a.chosen] : null;
      const gist = (q.stem || "").replace(/\s+/g, " ").slice(0, 88);
      return `<details class="acc">
        <summary><b style="font-weight:600; font-size:.87rem;">${esc(gist)}${q.stem.length > 88 ? "…" : ""}</b>
          <span class="acc-tag">${esc(q.topic || q.bankTitle)}${trapTag ? ` · 🪤 ${esc(trapTag)}` : ""}</span></summary>
        <div class="acc-body">
          <div class="q-meta" style="margin-bottom:6px;"><span class="badge">${esc(q.topic || q.bankTitle)}</span>${starBtnHtml(q.id)}</div>
          <div class="q-stem" style="font-size:.9rem">${esc(q.stem)}</div>
          ${headline ? `<div style="font-size:.82rem; color:var(--warn); margin-bottom:6px;">${headline}</div>` : ""}
          ${!a.ok ? `<div style="font-size:.88rem; margin-bottom:6px;"><span style="color:var(--bad)">Your answer:</span> ${esc(q.options[a.chosen])}</div>` : ""}
          <div style="font-size:.88rem;"><span style="color:var(--good)">Correct:</span> ${esc(q.options[q.answer])}</div>
          ${(() => { const sts = applicableStrategies(q); return sts.length ? `<div style="font-size:.8rem; color:var(--warn); margin-top:6px;">🧭 ${sts.map(st => `${st.icon} ${esc(st.name)}`).join(" · ")}</div>` : ""; })()}
          <div class="expl">${esc(q.explanation || "")}<span class="src">Source: ${esc(q.source || q.bankTitle)}</span></div>
          ${noteUI(q.id)}
        </div></details>`;
    };
    const wrongHtml = wrong.length ? `<div class="card sheet">
      <h3 style="margin-bottom:4px;">Review your misses</h3>
      <p class="sheet-hint">${wrong.length} to review · tap one to open it, ☆ to star, ✍️ to write the rule</p>
      ${wrong.map(a => reviewRow(a, null)).join("")}</div>` : "";
    const guessedRight = s.answers.filter(a => a.ok && a.guess);
    const guessedHtml = guessedRight.length ? `<div class="card sheet">
      <h3 style="margin-bottom:4px;">Lucky guesses to lock in</h3>
      <p class="sheet-hint">Right, but you flagged it — not yours yet.</p>
      ${guessedRight.map(a => reviewRow(a, "⚑ You marked this a guess.")).join("")}</div>` : "";
    // session patterns: where did the misses cluster?
    const mt = {}, mtr = {};
    wrong.forEach(a => {
      const q = byId[a.id];
      const t = q.topic || q.bankTitle;
      mt[t] = (mt[t] || 0) + 1;
      const tag = Array.isArray(q.traps) ? q.traps[a.chosen] : null;
      if (tag) mtr[tag] = (mtr[tag] || 0) + 1;
    });
    const topTopics = Object.entries(mt).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const topTraps = Object.entries(mtr).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const patternsHtml = (wrong.length >= 2 && (topTopics.length || topTraps.length)) ? `
      <div class="card"><h3 style="margin-bottom:8px;">📌 Patterns this session</h3>
        ${topTopics.length ? `<p style="font-size:.85rem; margin-bottom:6px;"><b>Misses clustered in:</b> ${topTopics.map(([t, n]) => `${esc(t)} (${n})`).join(" · ")}</p>` : ""}
        ${topTraps.length ? `<p style="font-size:.85rem; margin-bottom:6px;"><b>Traps that caught you:</b> ${topTraps.map(([t, n]) => `🪤 ${esc(t)} ×${n}`).join(" · ")}</p>` : ""}
        <p style="color:var(--muted); font-size:.8rem;">Before re-drilling, say the rule out loud for each trap above — then use "Re-drill these misses" to test it.</p>
      </div>` : "";
    h(`<div class="card" style="text-align:center;">
      <div style="font-size:2.6rem; font-weight:800;" class="${pctClass(pct)}">${pct}%</div>
      <p style="color:var(--muted); font-size:.8rem; margin:2px 0 4px;">${masteredCount()} / ${allQuestions.length} questions mastered overall${(s.maxCombo || 0) >= 5 ? ` · <span class="combo-chip">🔥 best run ×${s.maxCombo}</span>` : ""}</p>
      <p style="color:var(--muted); margin:6px 0 4px;">${right} / ${s.answers.length} correct · ${mins} min · avg ${avgSec}s/Q (budget ${PACE_SEC}s)${guesses ? ` · ${guesses} guessed` : ""}</p>
      ${slow.length ? `<p style="color:var(--warn); font-size:.85rem; margin:4px 0;">🐢 ${slow.length} question${slow.length > 1 ? "s" : ""} took over 2½ minutes</p>` : ""}
      <p style="margin:10px 0 16px; font-size:.9rem;">${pct >= GOAL ? "🎉 At goal — keep this up!" : pct >= 85 ? "Close — drill the misses below." : "Focus session: review every miss below, then re-drill."}</p>
      <div class="row" style="justify-content:center; gap:10px;">
        ${s.sprintReturn ? `<button class="primary" onclick="App.resumeSprint('${s.sprintReturn.blockId}', ${s.sprintReturn.stepIdx})">← Back to my sprint block</button>` : `<button class="ghost" onclick="App.go('home')">Home</button>`}
        ${wrong.length ? `<button class="${s.sprintReturn ? "ghost" : "primary"}" onclick="App.redrillLast()">Re-drill these ${wrong.length} misses</button>` : ""}
      </div>
    </div>
    ${patternsHtml}
    ${wrongHtml}
    ${guessedHtml}`);
    session = { ...s, lastWrongIds: wrong.map(a => a.id) };
  };
  function redrillLast() {
    const qs = shuffle(session.lastWrongIds.map(id => byId[id]));
    startQuiz(qs, { title: "Re-drill misses", immediate: true, mode: "redrill" });
  }

  // ── stats ─────────────────────────────────────────────
  V.stats = () => {
    const rd = readiness();
    const areaRows = ASWB_AREAS.map(a => {
      const d = rd.areas[a.key];
      const pct = d.acc == null ? null : Math.round(d.acc * 100);
      return `<tr><td>${esc(a.name)}</td><td class="num">${Math.round(a.w * 100)}%</td>
        <td class="num">${d.attempted}/${d.total}</td>
        <td class="num ${pctClass(pct)}">${pct == null ? "–" : pct + "%"}</td>
        <td class="num" style="color:var(--warn)">${d.pointsLost != null ? "-" + d.pointsLost : "–"}</td></tr>`;
    }).join("");
    const trapEntries = Object.entries(store.traps).sort((a, b) => b[1] - a[1]);
    const trapRows = trapEntries.map(([tag, n]) =>
      `<tr><td><b>${esc(tag)}</b><br><span style="color:var(--muted); font-size:.78rem;">${esc((TRAP_INFO[tag] || "").split(" — ")[1] || TRAP_INFO[tag] || "")}</span></td><td class="num" style="vertical-align:top;">${n}×</td></tr>`).join("");
    const ts = topicStats();
    const rows = Object.entries(ts).filter(([, m]) => m.seen > 0).sort((a, b) => {
      const pa = a[1].right / a[1].seen, pb = b[1].right / b[1].seen;
      return pa - pb;
    }).slice(0, 12).map(([t, m]) => {
      const pct = m.seen ? Math.round(100 * m.right / m.seen) : null;
      return `<tr><td>${esc(t)}</td><td class="num">${m.total}</td><td class="num">${m.seen}</td>
        <td class="num ${pctClass(pct)}">${pct == null ? "–" : pct + "%"}</td></tr>`;
    }).join("");
    const hist = store.sessions.slice(-12).reverse().map(s =>
      `<tr><td>${new Date(s.when).toLocaleDateString()} ${new Date(s.when).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
      <td>${esc(s.title)}</td><td class="num">${s.n}</td><td class="num ${pctClass(Math.round(100 * s.right / s.n))}">${Math.round(100 * s.right / s.n)}%</td></tr>`).join("");
    h(`
    <div class="card"><h2 style="margin-bottom:4px;">🎯 Exam readiness ${rd.projected != null ? `— <span class="${pctClass(rd.projected)}">${rd.projected}%</span>` : ""}</h2>
      <p style="color:var(--muted); font-size:.82rem; margin-bottom:10px;">Accuracy per ASWB clinical-exam content area, weighted by the real blueprint. "Left on table" = projected % points lost in that area — spend study time where it's biggest. Coverage: ${rd.coverage}% of the bank attempted.</p>
      <table><tr><th>Content area</th><th style="text-align:right">Weight</th><th style="text-align:right">Tried</th><th style="text-align:right">Known</th><th style="text-align:right">Left on table</th></tr>${areaRows}</table></div>
    <div class="card"><h2 style="margin-bottom:4px;">🪤 Your traps</h2>
      <p style="color:var(--muted); font-size:.82rem; margin-bottom:10px;">Which distractor patterns catch you when you miss. High counts = a reasoning habit to fix, not a knowledge gap.</p>
      ${trapRows ? `<table><tr><th>Pattern</th><th style="text-align:right">Caught</th></tr>${trapRows}</table>` : `<p style="color:var(--muted); font-size:.88rem;">No trap data yet — it builds as you answer.</p>`}</div>
    <div class="card"><h2 style="margin-bottom:4px;">Weakest topics first</h2>
      <table><tr><th>Topic</th><th style="text-align:right">Qs</th><th style="text-align:right">Attempts</th><th style="text-align:right">Acc.</th></tr>${rows}</table></div>
    <div class="card"><h2 style="margin-bottom:10px;">Recent sessions</h2>
      ${hist ? `<table><tr><th>When</th><th>Type</th><th style="text-align:right">Qs</th><th style="text-align:right">Score</th></tr>${hist}</table>` : `<p style="color:var(--muted)">No sessions yet.</p>`}</div>
    <div class="card sheet">
      <details class="acc"><summary><b>Backup &amp; sharing</b><span class="acc-tag">export / import</span></summary>
        <div class="acc-body">
        <p style="color:var(--muted); font-size:.82rem; margin-bottom:10px;">Export moves your progress between devices; "stars only" lets study-group members swap their hardest-question lists.</p>
        <div class="row" style="gap:8px; justify-content:flex-start;">
          <button class="ghost" onclick="App.exportProgress()">⬇ Export</button>
          <button class="ghost" onclick="App.importProgress('all')">⬆ Import (replace)</button>
          <button class="ghost" onclick="App.importProgress('stars')">⭐ Stars only</button>
          <input type="file" id="import-file" accept=".json" class="hidden">
        </div></div></details>
      <details class="acc"><summary><b>Account &amp; sync</b><span class="acc-tag">${authInfo() ? esc(authInfo().email) : "not signed in"}</span></summary>
        <div class="acc-body"><button class="ghost" onclick="App.go('account')">Open account settings →</button></div></details>
      <details class="acc"><summary><b style="color:var(--bad);">Reset progress</b><span class="acc-tag">danger zone</span></summary>
        <div class="acc-body"><button class="ghost" onclick="App.resetStats()" style="color:var(--bad)">Reset all progress…</button></div></details>
    </div>`);
  };

  function resetStats() {
    if (confirm("Erase ALL saved progress on this device? (Starred questions and your notes are kept.)")) {
      store = { q: {}, sessions: [], starred: store.starred, traps: {}, notes: store.notes }; save(); toast("Progress reset"); go("home");
    }
  }

  // ── export / import ───────────────────────────────────
  function exportProgress() {
    const blob = new Blob([JSON.stringify({ v: 3, exported: Date.now(), store })], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `lcsw-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Progress file downloaded");
  }
  function importProgress(mode) {
    const inp = el("import-file");
    inp.onchange = () => {
      const f = inp.files[0];
      if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try {
          const data = JSON.parse(rd.result);
          const inc = data.store || data;
          if (!inc.q && !inc.starred) throw new Error("not a progress file");
          if (mode === "stars") {
            let added = 0;
            Object.keys(inc.starred || {}).forEach(id => { if (byId[id] && !store.starred[id]) { store.starred[id] = true; added++; } });
            save(); toast(`Imported ${added} new starred questions`); go("stats");
          } else {
            if (!confirm("Replace ALL progress on this device with the imported file?")) return;
            store = { q: inc.q || {}, sessions: inc.sessions || [], starred: inc.starred || {}, traps: inc.traps || {}, notes: inc.notes || {} };
            load.call ? null : null;
            // re-run due migration on imported records
            Object.values(store.q).forEach(r => { if (r.due === undefined) { r.ivl = r.streak > 1 ? 3 : r.streak === 1 ? 1 : 0; r.due = Date.now(); } });
            save(); toast("Progress imported"); go("home");
          }
        } catch (e) { toast("Import failed: " + e.message); }
        inp.value = "";
      };
      rd.readAsText(f);
    };
    inp.click();
  }

  // ── medication trainer (unchanged core) ───────────────
  let med = null;
  V.meds = () => {
    h(`<div class="card"><h2 style="margin-bottom:8px;">💊 Medication Trainer</h2>
      <p style="color:var(--muted); font-size:.88rem; margin-bottom:14px; line-height:1.5;">
      From the TDC Medications Quick Study. Two drills — do Category until it's automatic, then Brand↔Generic.</p>
      <div class="grid">
        <button class="mode-btn" onclick="App.medDrill('cat')"><h3>🗂 Which category?</h3><p>See a drug → pick its diagnostic category. The exam's favorite angle.</p></button>
        <button class="mode-btn" onclick="App.medDrill('pair')"><h3>🔤 Brand ↔ Generic</h3><p>Match brand and generic names — either can show up on the exam.</p></button>
        <button class="mode-btn" onclick="App.go('medsheet')"><h3>📋 Cheat sheet</h3><p>Full category table + must-know facts (MAOIs, tardive dyskinesia…)</p></button>
        <button class="mode-btn" onclick="App.medQuizBank()"><h3>❓ Meds MC questions</h3><p>Exam-style multiple choice on medications &amp; side effects.</p></button>
      </div>
      <div style="margin-top:14px;"><button class="ghost" onclick="App.go('home')">Back</button></div></div>`);
  };
  function medDrill(kind) { med = { kind, order: shuffle([...window.MEDS]), i: 0, right: 0 }; go("meddrill"); }
  V.meddrill = () => {
    const m = med;
    if (m.i >= m.order.length) {
      h(`<div class="card med-drill-card">
        <div style="font-size:2.4rem; font-weight:800;" class="${pctClass(Math.round(100 * m.right / m.order.length))}">${m.right} / ${m.order.length}</div>
        <p style="color:var(--muted); margin:8px 0 18px;">${m.kind === "cat" ? "Category drill" : "Brand↔Generic drill"} complete</p>
        <div class="row" style="justify-content:center; gap:10px;">
          <button class="ghost" onclick="App.go('meds')">Back</button>
          <button class="primary" onclick="App.medDrill('${m.kind}')">Again</button>
        </div></div>`);
      return;
    }
    const drug = m.order[m.i];
    const showBrand = Math.random() < 0.5;
    if (m.kind === "cat") {
      med.current = drug;
      h(`<div class="progressbar"><div style="width:${(m.i / m.order.length) * 100}%"></div></div>
      <div class="card med-drill-card">
        <div class="q-meta" style="justify-content:center;">${m.i + 1} / ${m.order.length} · score ${m.right}</div>
        <div class="med-name">${esc(showBrand ? drug.brand : drug.generic)}</div>
        <div class="med-sub">${showBrand ? "(brand name)" : "(generic name)"} — which category?</div>
        <div class="cat-grid">${window.MED_CATEGORIES.map(c =>
        `<button class="opt" style="text-align:center;" onclick="App.medAnswer(this,'${c}')">${c}</button>`).join("")}</div>
        <div id="med-fb"></div>
        <div style="margin-top:12px;"><button class="ghost" onclick="App.go('meds')">End</button></div>
      </div>`);
    } else {
      const pool = window.MEDS.filter(x => x !== drug);
      const distract = shuffle(pool).slice(0, 3).map(x => showBrand ? x.generic : x.brand);
      const correct = showBrand ? drug.generic : drug.brand;
      const choices = shuffle([correct, ...distract]);
      med.current = drug; med.correctText = correct;
      h(`<div class="progressbar"><div style="width:${(m.i / m.order.length) * 100}%"></div></div>
      <div class="card med-drill-card">
        <div class="q-meta" style="justify-content:center;">${m.i + 1} / ${m.order.length} · score ${m.right}</div>
        <div class="med-name">${esc(showBrand ? drug.brand : drug.generic)}</div>
        <div class="med-sub">${showBrand ? "brand — pick the GENERIC" : "generic — pick the BRAND"}</div>
        ${choices.map(c => `<button class="opt" onclick="App.medPairAnswer(this,'${escA(c)}')">${esc(c)}</button>`).join("")}
        <div id="med-fb"></div>
        <div style="margin-top:12px;"><button class="ghost" onclick="App.go('meds')">End</button></div>
      </div>`);
    }
  };
  function medAnswer(btn, cat) {
    const d = med.current, ok = cat === d.cat;
    if (ok) med.right++;
    [...view().querySelectorAll(".opt")].forEach(o => {
      o.disabled = true;
      if (o.textContent === d.cat) o.classList.add("correct");
      else if (o === btn && !ok) o.classList.add("wrong");
    });
    el("med-fb").innerHTML = `<div class="expl" style="text-align:left;"><b>${esc(d.brand)} (${esc(d.generic)})</b> → ${esc(d.cat)} · ${esc(d.cls)}${d.note ? "<br>" + esc(d.note) : ""}</div>
      <button class="primary" style="margin-top:8px;" onclick="App.medNext()">Next →</button>`;
  }
  function medPairAnswer(btn, text) {
    const ok = text === med.correctText;
    if (ok) med.right++;
    const d = med.current;
    [...view().querySelectorAll(".opt")].forEach(o => {
      o.disabled = true;
      if (o.textContent === med.correctText) o.classList.add("correct");
      else if (o === btn && !ok) o.classList.add("wrong");
    });
    el("med-fb").innerHTML = `<div class="expl" style="text-align:left;"><b>${esc(d.brand)} = ${esc(d.generic)}</b> — ${esc(d.cat)} (${esc(d.cls)})</div>
      <button class="primary" style="margin-top:8px;" onclick="App.medNext()">Next →</button>`;
  }
  function medNext() { med.i++; go("meddrill"); }
  V.medsheet = () => {
    const rows = `<div class="card sheet"><h3 style="margin-bottom:10px;">📋 Medications by category</h3>
      <p class="sheet-hint">Tap a category to open its drug list.</p>` +
      window.MED_CATEGORIES.map(cat => {
      const meds = window.MEDS.filter(m => m.cat === cat);
      return `<details class="acc"><summary><b>${esc(cat)}</b><span class="acc-tag">${meds.length} drugs</span></summary>
        <div class="acc-body">
        <table>${meds.map(m => `<tr><td><b>${esc(m.brand)}</b></td><td>${esc(m.generic)}</td><td style="color:var(--muted); font-size:.8rem;">${esc(m.cls)}</td></tr>`).join("")}</table>
        ${meds.filter(m => m.note).map(m => `<p style="font-size:.8rem; color:var(--warn); margin-top:6px;">⚠ ${esc(m.brand)}: ${esc(m.note)}</p>`).join("")}
        </div></details>`;
    }).join("") + `</div>`;
    h(`${rows}<div class="card"><h3 style="margin-bottom:8px;">Must-know facts</h3>
      <ul style="padding-left:18px; font-size:.88rem; line-height:1.7;">${window.MED_FACTS.map(f => `<li>${esc(f)}</li>`).join("")}</ul></div>
      <button class="ghost" onclick="App.go('meds')">Back</button>`);
  };
  function medQuizBank() {
    const pool = allQuestions.filter(q => q.bankId === "medications");
    if (!pool.length) { toast("Medication question bank not loaded"); return; }
    startQuiz(weightedSample(pool, Math.min(15, pool.length)), { title: "Medication MC", immediate: true, mode: "meds" });
  }

  // ── theory trainer (unchanged core) ───────────────────
  let th = null;
  V.theory = () => {
    h(`<div class="card"><h2 style="margin-bottom:8px;">🧠 Theory Trainer</h2>
      <p style="color:var(--muted); font-size:.88rem; margin-bottom:14px; line-height:1.5;">
      From the TDC Developmental Stages and Therapy Theories Quick Studies.</p>
      <div class="grid">
        <button class="mode-btn" onclick="App.thStages('desc')"><h3>🧩 Stage by Description</h3><p>All 9 frameworks: Erikson, Piaget, Freud, Mahler, Kohlberg, Bronfenbrenner, Maslow, Stages of Change, Tuckman.</p></button>
        <button class="mode-btn" onclick="App.thStages('age')"><h3>🎂 Stage by Age</h3><p>"A client is 38 — which Erikson stage?" Age-range recall.</p></button>
        <button class="mode-btn" onclick="App.thTheorist()"><h3>👤 Who's the Theorist?</h3><p>Beck vs Ellis, Minuchin vs Haley, Bowlby vs Ainsworth… 23 names.</p></button>
        <button class="mode-btn" onclick="App.thTherapy()"><h3>🛋 Which Therapy?</h3><p>"Empty chair", "miracle question", "joining"… concept → theory.</p></button>
        <button class="mode-btn" onclick="App.thAttach()"><h3>🤝 Attachment Types</h3><p>Adult styles + Ainsworth's child classifications (SAAD).</p></button>
        <button class="mode-btn" onclick="App.go('devsheet')"><h3>📋 Stages cheat sheet</h3><p>All frameworks side by side, with mnemonics.</p></button>
        <button class="mode-btn" onclick="App.go('therapysheet')"><h3>📋 Theories cheat sheet</h3><p>Every theory: theorist, change mechanism, signatures.</p></button>
        <button class="mode-btn" onclick="App.theoryQuizBank()"><h3>❓ Theory MC questions</h3><p>Exam-style recognition questions from the Theory Recognition bank.</p></button>
      </div>
      <div style="margin-top:14px;"><button class="ghost" onclick="App.go('home')">Back</button></div></div>`);
  };
  function buildStageItems(kind) {
    const items = [];
    window.DEV_FRAMEWORKS.forEach(fw => {
      if (kind === "age" && fw.noAge) return;   // Kohlberg/Maslow/etc. have no age ranges
      const names = fw.stages.map(s => s.name);
      fw.stages.forEach(st => {
        if (kind === "age") items.push({ prompt: st.age, sub: `${fw.name} — which stage covers this age range?`, correct: st.name, pool: names, expl: `${st.name} (${st.age}): ${st.desc}` });
        else items.push({ prompt: st.desc, sub: `${fw.name} — which stage?`, correct: st.name, pool: names, expl: `${st.name} (${st.age}).` });
      });
    });
    return items;
  }
  function thTheorist() {
    const items = [];
    const roster = window.THEORISTS;
    const others = t => shuffle(roster.filter(x => x.name !== t.name)).slice(0, 3).map(x => x.name);
    roster.forEach(t => {
      items.push({ prompt: t.q, sub: "Whose central question is this?", correct: t.name, pool: [t.name, ...others(t)], expl: `${t.name} — ${t.theory}. Clues: ${t.clues.join("; ")}.` });
      items.push({ prompt: t.theory, sub: "Which theorist?", correct: t.name, pool: [t.name, ...others(t)], expl: `${t.name}: ${t.theory}. Clues: ${t.clues.join("; ")}.` });
      const clue = t.clues[Math.floor(Math.random() * t.clues.length)];
      items.push({ prompt: clue, sub: "This concept belongs to which theorist?", correct: t.name, pool: [t.name, ...others(t)], expl: `${t.name} — ${t.theory}. ${t.q}` });
    });
    th = { items: shuffle(items).slice(0, 25), i: 0, right: 0, title: "Who's the Theorist?", retry: "App.thTheorist()" };
    go("thdrill");
  }
  function thStages(kind) {
    th = { items: shuffle(buildStageItems(kind)), i: 0, right: 0, title: kind === "age" ? "Stage by Age" : "Stage by Description", retry: "App.thStages('" + kind + "')" };
    go("thdrill");
  }
  function thTherapy() {
    const items = [];
    window.THERAPIES.forEach(t => {
      const others = () => shuffle(window.THERAPIES.filter(x => x.name !== t.name)).slice(0, 3).map(x => x.name);
      items.push({ prompt: `Change occurs through: ${t.change}.`, sub: "Which therapy?", correct: t.name, pool: [t.name, ...others()], expl: `${t.name} — good for: ${t.goodFor}.` });
      t.concepts.forEach(c => {
        items.push({ prompt: c, sub: "Which therapy does this belong to?", correct: t.name, pool: [t.name, ...others()], expl: `${t.name}: change occurs through ${t.change.toLowerCase()}. Good for: ${t.goodFor}.` });
      });
    });
    th = { items: shuffle(items).slice(0, 25), i: 0, right: 0, title: "Which Therapy?", retry: "App.thTherapy()" };
    go("thdrill");
  }
  function thAttach() {
    const adultNames = window.ATTACHMENT_TYPES.map(a => a.name);
    const childNames = window.CHILD_ATTACHMENT.map(a => a.name);
    const items = [
      ...window.ATTACHMENT_TYPES.map(a => ({ prompt: a.desc, sub: "ADULT attachment style — which one?", correct: a.name, pool: adultNames, expl: `${a.name} (adult style, TDC quick study).` })),
      ...window.CHILD_ATTACHMENT.map(a => ({ prompt: a.desc, sub: "CHILD attachment (Ainsworth's Strange Situation) — which classification?", correct: a.name, pool: childNames, expl: `${a.name} — Ainsworth's Strange Situation. Mnemonic: SAAD (Secure, Avoidant, Ambivalent, Disorganized). Bowlby = theory; Ainsworth = classification.` }))
    ];
    th = { items: shuffle(items), i: 0, right: 0, title: "Attachment Types", retry: "App.thAttach()" };
    go("thdrill");
  }
  V.thdrill = () => {
    const m = th;
    if (m.i >= m.items.length) {
      h(`<div class="card med-drill-card">
        <div style="font-size:2.4rem; font-weight:800;" class="${pctClass(Math.round(100 * m.right / m.items.length))}">${m.right} / ${m.items.length}</div>
        <p style="color:var(--muted); margin:8px 0 18px;">${esc(m.title)} complete</p>
        <div class="row" style="justify-content:center; gap:10px;">
          <button class="ghost" onclick="App.go('theory')">Back</button>
          <button class="primary" onclick="${m.retry}">Again</button>
        </div></div>`);
      return;
    }
    const it = m.items[m.i];
    const choices = it.pool.length > 4 ? shuffle([it.correct, ...shuffle(it.pool.filter(p => p !== it.correct)).slice(0, 3)]) : shuffle([...it.pool]);
    m.current = it;
    h(`<div class="progressbar"><div style="width:${(m.i / m.items.length) * 100}%"></div></div>
    <div class="card">
      <div class="q-meta" style="justify-content:center;">${esc(m.title)} · ${m.i + 1} / ${m.items.length} · score ${m.right}</div>
      <div class="q-stem" style="text-align:center;">${esc(it.prompt)}</div>
      <div class="med-sub" style="text-align:center;">${esc(it.sub)}</div>
      ${choices.map(c => `<button class="opt" onclick="App.thAnswer(this)">${esc(c)}</button>`).join("")}
      <div id="th-fb"></div>
      <div style="margin-top:12px;"><button class="ghost" onclick="App.go('theory')">End</button></div>
    </div>`);
  };
  function thAnswer(btn) {
    const it = th.current, ok = btn.textContent === it.correct;
    if (ok) th.right++;
    [...view().querySelectorAll(".opt")].forEach(o => {
      o.disabled = true;
      if (o.textContent === it.correct) o.classList.add("correct");
      else if (o === btn && !ok) o.classList.add("wrong");
    });
    el("th-fb").innerHTML = `<div class="expl">${esc(it.expl)}</div>
      <button class="primary" style="margin-top:8px;" onclick="App.thNext()">Next →</button>`;
  }
  function thNext() { th.i++; go("thdrill"); }
  V.devsheet = () => {
    const cards = `<div class="card sheet"><h3 style="margin-bottom:10px;">📋 Developmental frameworks</h3>
      <p class="sheet-hint">Tap a framework to open its stages.</p>` +
      window.DEV_FRAMEWORKS.map(fw => `
      <details class="acc"><summary><b>${esc(fw.name)}</b>${fw.theorist ? `<span class="acc-tag">${esc(fw.theorist)}</span>` : ""}</summary>
      <div class="acc-body">
      <p style="font-size:.8rem; color:var(--muted); margin-bottom:10px;">${esc(fw.note)}</p>
      <table>${fw.stages.map(s => `<tr><td style="vertical-align:top;"><b>${esc(s.name)}</b><br><span style="color:var(--muted); font-size:.78rem;">${esc(s.age)}</span></td><td style="font-size:.85rem;">${esc(s.desc)}</td></tr>`).join("")}</table>
      </div></details>`).join("") + `</div>`;
    const att = `<div class="card"><h3 style="margin-bottom:8px; color:var(--accent);">Adult Attachment Styles</h3>
      <table>${window.ATTACHMENT_TYPES.map(a => `<tr><td style="white-space:nowrap; vertical-align:top;"><b>${esc(a.name)}</b></td><td style="font-size:.85rem;">${esc(a.desc)}</td></tr>`).join("")}</table></div>
      <div class="card"><h3 style="margin-bottom:2px; color:var(--accent);">Child Attachment — Ainsworth's Strange Situation</h3>
      <p style="font-size:.78rem; color:var(--muted); margin-bottom:8px;">Mnemonic: SAAD. Bowlby = attachment theory; Ainsworth = the Strange Situation research and classification.</p>
      <table>${window.CHILD_ATTACHMENT.map(a => `<tr><td style="white-space:nowrap; vertical-align:top;"><b>${esc(a.name)}</b></td><td style="font-size:.85rem;">${esc(a.desc)}</td></tr>`).join("")}</table></div>
      <div class="card"><h3 style="margin-bottom:8px; color:var(--accent);">Three "systems" lenses — know the contrast</h3>
      <table>
        <tr><td style="vertical-align:top;"><b>General systems theory</b><br><span style="color:var(--muted); font-size:.78rem;">von Bertalanffy</span></td><td style="font-size:.85rem;">"How do the parts affect one another?" Moving one part moves the others. Homeostasis = the system pulls back to its familiar (even unhealthy) pattern. Equifinality = different paths, same outcome.</td></tr>
        <tr><td style="vertical-align:top;"><b>Ecological systems</b><br><span style="color:var(--muted); font-size:.78rem;">Bronfenbrenner</span></td><td style="font-size:.85rem;">"At what environmental LEVEL is the influence occurring?" Micro meets me · Meso mixes my micros · Exo excludes me · Macro means culture · Chrono changes over time.</td></tr>
        <tr><td style="vertical-align:top;"><b>Person-in-environment</b></td><td style="font-size:.85rem;">"How does the interaction between THIS person and THIS environment affect functioning?" Housing, transportation, poverty, discrimination, supports — not just internal pathology.</td></tr>
      </table></div>`;
    h(cards + att + `<button class="ghost" onclick="App.go('theory')">Back</button>`);
  };
  V.therapysheet = () => {
    const rows = window.THERAPIES.map(t => `
      <details class="acc"><summary><b>${esc(t.name)}</b>${t.theorist ? `<span class="acc-tag">${esc(t.theorist)}</span>` : ""}</summary>
      <div class="acc-body">
        <p style="font-size:.85rem; margin-bottom:6px;"><b>Change:</b> ${esc(t.change)}.</p>
        <p style="font-size:.82rem; color:var(--muted); margin-bottom:6px;"><b>Signatures:</b> ${t.concepts.map(esc).join(" · ")}</p>
        <p style="font-size:.8rem; color:var(--warn);">Good for: ${esc(t.goodFor)}</p>
      </div></details>`).join("");
    h(`<div class="card sheet"><h3 style="margin-bottom:10px;">📋 Therapy theories</h3>
      <p class="sheet-hint">Tap any theory to open it. ${window.THERAPIES.length} total.</p>${rows}</div>
      <button class="ghost" onclick="App.go('theory')">Back</button>`);
  };

  function theoryQuizBank() {
    const pool = allQuestions.filter(q => q.bankId === "theoryrec");
    if (!pool.length) { toast("Theory Recognition bank not loaded"); return; }
    startQuiz(weightedSample(pool, Math.min(15, pool.length)), { title: "Theory Recognition", immediate: true, mode: "theoryrec" });
  }

  // ── Test Ready coach ──────────────────────────────────
  function ytLink(q) { return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`; }
  function examDaysLeft() {
    if (!store.examDate) return null;
    const d = new Date(store.examDate + "T09:00:00");
    if (isNaN(d)) return null;
    return Math.ceil((d - Date.now()) / DAY);
  }
  function setExamDate() {
    const v = el("exam-date-input").value;
    if (v) { store.examDate = v; } else { delete store.examDate; }
    save(); go("coach");
  }
  function coachState() {
    const today = new Date().toDateString();
    if (!store.coach || store.coach.date !== today) { store.coach = { date: today, done: {} }; save(); }
    return store.coach;
  }
  function coachToggle(id) {
    const c = coachState();
    c.done[id] = !c.done[id];
    if (!c.done[id]) delete c.done[id];
    save(); go("coach");
  }
  function startAreaDrill(areaKey) {
    const pool = allQuestions.filter(q => areaOf(q) === areaKey);
    startQuiz(weightedSample(pool, Math.min(15, pool.length)), { title: "Weak-area drill", immediate: true, mode: "area" });
  }
  function todaysPlan() {
    const items = [];
    const due = dueQuestions().length;
    const rd = readiness();
    const days = examDaysLeft();
    const c = coachState();
    // 1. spaced retrieval first — always
    items.push({ id: "due", label: due ? `Clear the Due queue (${due} questions)` : "Due queue — already clear ✓", why: "Spaced retrieval: the highest-value minutes in the app (HIGH-utility evidence).", action: due ? "App.dueDrill()" : null, auto: due === 0 });
    // 2. weakest ASWB area
    const worst = ASWB_AREAS.map(a => ({ a, d: rd.areas[a.key] })).filter(x => x.d.pointsLost != null)
      .sort((x, y) => y.d.pointsLost - x.d.pointsLost)[0];
    if (worst && worst.d.pointsLost > 0.5) {
      items.push({ id: "area", label: `Drill your weakest area: ${worst.a.name} (15 Qs)`, why: `Currently costing you ~${worst.d.pointsLost} projected points — the biggest bang per minute.`, action: `App.startAreaDrill('${worst.a.key}')` });
    }
    // 3. strategy lesson of the day (rotates)
    const sts = window.TEST_STRATEGIES || [];
    if (sts.length) {
      const st = sts[Math.floor(Date.now() / DAY) % sts.length];
      items.push({ id: "lesson", label: `Strategy of the day: ${st.icon} ${st.name}`, why: "Reasoning questions are 80–85% of the exam — one strategy a day keeps them all warm.", action: `App.lesson('${st.id}')` });
    }
    // 4. notes on recent misses
    items.push({ id: "notes", label: "Write one-line notes on today's misses", why: "Self-explanation (moderate-utility evidence): the rule, in your own words, under each miss.", action: "App.missed()" });
    // 5. phase-dependent exam work
    const lastExam = [...store.sessions].reverse().find(s => s.mode === "mock" || s.mode === "full");
    const daysSinceExam = lastExam ? (Date.now() - lastExam.when) / DAY : Infinity;
    if (days == null) {
      items.push({ id: "mock", label: "Mock 50 under exam conditions (every 2–3 days)", why: "Practice testing at full difficulty; set your exam date below for a phase-tuned plan.", action: "App.mock()" });
    } else if (days > 3) {
      if (daysSinceExam >= 2) items.push({ id: "mock", label: "Mock 50 under exam conditions", why: "Every 2–3 days until the final stretch — interleaved retrieval at exam pace.", action: "App.mock()" });
    } else if (days === 3 || days === 2) {
      if (daysSinceExam >= 2) items.push({ id: "full", label: "LAST full two-section exam (170)", why: "One full-length dress rehearsal, then taper. No full exams after this.", action: "App.fullExam()" });
      else items.push({ id: "light", label: "Light review only: cheat sheets + starred questions", why: "Taper phase — consolidate, don't exhaust.", action: "App.starred()" });
    } else if (days === 1) {
      items.push({ id: "taper", label: "Taper day: 20-minute skim of cheat sheets, then STOP by dinner", why: "Sleep is consolidation — nothing new tonight. Prep logistics: route, ID, snacks, arrive early.", action: "App.go('medsheet')" });
    } else if (days <= 0) {
      items.push({ id: "examday", label: "Exam day: 10-min expressive writing, brisk walk, reframe nerves as readiness", why: "Ramirez & Beilock 2011: writing out worries before the exam raised scores for anxious test-takers.", action: null });
    }
    // 6. video for weakest topic (optional)
    const ts = topicStats();
    const weakTopic = Object.entries(ts).filter(([, m]) => m.seen >= 4).sort((a, b) => (a[1].right / a[1].seen) - (b[1].right / b[1].seen))[0];
    if (weakTopic) {
      items.push({ id: "video", label: `Optional: watch a refresher on "${weakTopic[0]}" — then re-drill it`, why: "Video is fine for clearing confusion — as long as you test yourself right after (passive watching alone is a myth).", href: ytLink("ASWB LCSW clinical exam " + weakTopic[0]) });
    }
    return items.map(it => ({ ...it, done: !!c.done[it.id] || !!it.auto }));
  }

  V.coach = () => {
    const days = examDaysLeft();
    const plan = todaysPlan();
    const doneN = plan.filter(p => p.done).length;
    const rd = readiness();
    h(`
    <div class="card"><div class="row">
      <div><h2 style="margin-bottom:2px;">🏆 Test Ready</h2>
      <p style="color:var(--muted); font-size:.82rem;">Your evidence-based daily plan, generated from your actual stats.</p></div>
      <div style="text-align:right;">
        ${rd.projected != null ? `<div style="font-size:1.3rem; font-weight:800;" class="${pctClass(rd.projected)}">${rd.projected}%</div><div style="font-size:.68rem; color:var(--muted);">PROJECTED</div>` : ""}
      </div></div>
      <div class="row" style="margin-top:8px;">
        <label style="font-size:.82rem; color:var(--muted);">My exam date: <input type="date" id="exam-date-input" value="${esc(store.examDate || "")}" style="background:var(--card2); color:var(--text); border:1px solid var(--card2); border-radius:6px; padding:4px 8px;"></label>
        <button class="ghost" style="font-size:.8rem;" onclick="App.setExamDate()">Save</button>
        ${days != null ? `<span style="font-weight:700; color:${days <= 3 ? "var(--warn)" : "var(--accent)"};">${days <= 0 ? "Exam day!" : days + " day" + (days === 1 ? "" : "s") + " left"}</span>` : ""}
      </div></div>
    <div class="card"><h3 style="margin-bottom:8px;">📋 Today's plan <span style="color:var(--muted); font-size:.78rem; font-weight:400;">${doneN}/${plan.length} done</span></h3>
      ${plan.map(p => `
        <div style="display:flex; gap:10px; align-items:flex-start; padding:9px 0; border-bottom:1px solid var(--card2);">
          <input type="checkbox" ${p.done ? "checked" : ""} onchange="App.coachToggle('${p.id}')" style="width:18px; height:18px; accent-color:var(--good); margin-top:2px; ${p.auto ? "pointer-events:none;" : ""}">
          <div style="flex:1;">
            <div style="font-size:.92rem; ${p.done ? "text-decoration:line-through; color:var(--muted);" : ""}">${esc(p.label)}</div>
            <div style="font-size:.76rem; color:var(--muted); margin-top:2px;">${esc(p.why)}</div>
          </div>
          ${p.action ? `<button class="ghost" style="font-size:.78rem; white-space:nowrap;" onclick="${p.action}">Go →</button>` : ""}
          ${p.href ? `<a href="${p.href}" target="_blank" rel="noopener" class="ghost" style="font-size:.78rem; white-space:nowrap; text-decoration:none; padding:10px 18px; border:1px solid var(--card2); border-radius:10px;">🎬 Watch</a>` : ""}
        </div>`).join("")}
    </div>
    <div class="grid">
      <button class="mode-btn" onclick="App.go('techniques')"><h3>📚 What Actually Works</h3><p>Every proven study technique, evidence-graded, with the one-tap way to do it here.</p></button>
      <button class="mode-btn" onclick="App.go('howtotest')"><h3>🎓 How to Test</h3><p>The 9 answer-selection strategies with lessons and drills.</p></button>
    </div>
    <button class="ghost" onclick="App.go('home')">Back</button>`);
  };

  V.techniques = () => {
    const cards = `<div class="card sheet"><h3 style="margin-bottom:10px;">📖 Techniques that work</h3>
      <p class="sheet-hint">Evidence-graded. Tap one to open it.</p>` +
      (window.STUDY_TECHNIQUES || []).map(t => `
      <details class="acc"><summary><b>${t.icon} ${esc(t.name)}</b><span class="acc-tag" style="color:var(--good);">${esc(t.grade)}</span></summary>
      <div class="acc-body">
      <p style="font-size:.88rem; margin-bottom:6px;">${esc(t.what)}</p>
      <p style="font-size:.85rem; color:var(--muted); margin-bottom:6px;"><b>Do it:</b> ${esc(t.how)}</p>
      <p style="font-size:.85rem; margin-bottom:8px;"><b>In this app:</b> ${esc(t.inApp)}</p>
      <div class="row" style="justify-content:flex-start; gap:8px;">
        ${t.action ? `<button class="ghost" style="font-size:.8rem;" onclick="${t.action}">${esc(t.actionLabel)} →</button>` : ""}
        <a href="${ytLink(t.yt)}" target="_blank" rel="noopener" style="font-size:.8rem; color:var(--accent);">🎬 Watch on YouTube</a>
      </div>
      <p style="font-size:.72rem; color:var(--muted); margin-top:8px;">Evidence: ${esc(t.cite)}</p>
      </div></details>`).join("") + `</div>`;
    const myths = `<div class="card"><h3 style="margin-bottom:8px;">🚫 Popular but NOT supported</h3>
      ${(window.STUDY_MYTHS || []).map(m => `<div style="padding:7px 0; border-bottom:1px solid var(--card2);">
        <b style="font-size:.88rem;">${esc(m.name)}</b>
        <p style="font-size:.82rem; color:var(--muted);">${esc(m.verdict)} <span style="font-size:.72rem;">(${esc(m.cite)})</span></p></div>`).join("")}</div>`;
    h(`<div class="card"><h2 style="margin-bottom:4px;">📚 What Actually Works</h2>
      <p style="color:var(--muted); font-size:.82rem;">Techniques with real causal evidence, graded by the research. Everything green is built into this app.</p></div>
      ${cards}${myths}<button class="ghost" onclick="App.go('coach')">Back</button>`);
  };

  // ── How to Test: strategy trainer ─────────────────────
  function stratById(sid) { return (window.TEST_STRATEGIES || []).find(s => s.id === sid); }

  // Detect every strategy that applies to a question, from its stem, correct
  // answer, topic, and trap tags. Order = priority (safety always leads).
  const SAFETY_TOPICS = /crisis|suicide|danger|tarasoff|child abuse|elder|domestic violence/i;
  const ETHICS_TOPICS = /ethic|confidential|subpoena|legal|consent|dual relation|termination|supervision|colleague|fees|technology/i;
  function applicableStrategies(q) {
    const out = [];
    const stem = q.stem || "", corr = q.options[q.answer] || "", topic = q.topic || "";
    const traps = (q.traps || []).filter(Boolean);
    const hasQualifier = /\b(FIRST|NEXT|BEST|MOST)\b/.test(stem);
    const vignette = /social worker|client|therapist/i.test(stem);
    if (SAFETY_TOPICS.test(topic) || (/suicid|homicid|hurt|harm|danger|abuse|neglect|weapon|overdose|intoxicat|withdraw|barricad|threat|command/i.test(stem) && /assess|safety|risk|danger|report|determine|suicid/i.test(corr))) out.push("safety-first");
    if (traps.includes("acts-before-assessing") || /^(assess|explore|clarify|determine|ask|gather|evaluate|find out|identify)/i.test(corr)) out.push("assess-first");
    if (/acknowledg|validat|empathi|reflect|feeling/i.test(corr)) out.push("feelings-first");
    if (traps.includes("premature-reporting") || traps.includes("fails-duty") || ETHICS_TOPICS.test(topic)) out.push("ethics-threshold");
    if (traps.includes("too-restrictive") || traps.includes("self-determination")) out.push("least-intrusive");
    if (hasQualifier && (traps.includes("right-but-later") || vignette)) out.push("qualifier-reading");
    if (/\balready\b|has been (assessed|explored|completed|filed|conducted)|after (exploring|assessing|discussing|hearing)/i.test(stem)) out.push("stem-only");
    if (!vignette || (!hasQualifier && traps.every(t => t === "term-confusion" || t === "knowledge") )) out.push("eliminate-anticipate");
    // dedupe, keep priority order, cap at 3 so feedback stays readable
    return [...new Set(out)].slice(0, 3).map(stratById).filter(Boolean);
  }

  V.howtotest = () => {
    const ex = window.STRATEGY_EXEMPLARS || {};
    const cards = (window.TEST_STRATEGIES || []).map(st => {
      const n = (ex[st.id] || []).filter(id => byId[id]).length;
      return `<button class="mode-btn" onclick="App.lesson('${st.id}')">
        <h3>${st.icon} ${esc(st.name)}</h3><p>${esc(st.rule.split(".")[0])}.${n ? ` <span class="em">${n} practice Qs</span>` : ""}</p></button>`;
    }).join("");
    h(`<div class="card"><h2 style="margin-bottom:4px;">🎓 How to Test</h2>
      <p style="color:var(--muted); font-size:.85rem; line-height:1.5; margin-bottom:6px;">
      Per TDC's How to Think: reasoning questions are <b>80–85% of the LCSW exam</b> — at high practice scores, most remaining misses are strategy errors, not knowledge gaps.
      <b>Every practice question in the app now shows which strategies apply</b> in its feedback, right or wrong. Use the lessons below to learn each strategy, then drill it on its clearest examples.</p>
    </div>
    <div class="grid">${cards}</div>
    <div class="card" style="margin-top:12px;">
      <div class="row">
        <div><h3 style="margin-bottom:2px;">🎲 Name That Strategy</h3>
        <p style="color:var(--muted); font-size:.82rem;">Mixed drill across all 8 — before answering, ask yourself which strategy applies. The feedback tells you if you diagnosed it right.</p></div>
        <button class="primary" onclick="App.strategyDrill('mixed')">Start</button>
      </div></div>
    <button class="ghost" onclick="App.go('home')">Back</button>`);
  };

  V.lessonView = () => {
    const st = stratById(session && session.lessonId ? session.lessonId : null) || stratById(lessonId);
    if (!st) { go("howtotest"); return; }
    const n = ((window.STRATEGY_EXEMPLARS || {})[st.id] || []).filter(id => byId[id]).length;
    h(`<div class="card">
      <h2 style="margin-bottom:6px;">${st.icon} ${esc(st.name)}</h2>
      <div class="expl" style="margin-bottom:10px;"><b>The rule:</b> ${esc(st.rule)}</div>
      <p style="font-size:.88rem; margin-bottom:6px;"><b>Spot it by:</b></p>
      <ul style="padding-left:18px; font-size:.86rem; line-height:1.6; margin-bottom:10px;">${st.cues.map(c => `<li>${esc(c)}</li>`).join("")}</ul>
      <p style="font-size:.88rem; margin-bottom:8px;"><b>How to apply it:</b> ${esc(st.apply)}</p>
      <p style="font-size:.85rem; color:var(--warn); margin-bottom:8px;">🪤 <b>The classic mistake:</b> ${esc(st.mistake)}</p>
      <p style="font-size:.75rem; color:var(--muted);">Source: ${esc(st.source)}</p>
      <div class="row" style="margin-top:14px;">
        <button class="ghost" onclick="App.go('howtotest')">Back</button>
        ${n ? `<button class="primary" onclick="App.strategyDrill('${st.id}')">Practice it (${n} Qs) →</button>` : ""}
      </div></div>`);
  };
  let lessonId = null;
  function lesson(id) { lessonId = id; go("lessonView"); }

  function strategyDrill(which) {
    const ex = window.STRATEGY_EXEMPLARS || {};
    let pool;
    if (which === "mixed") {
      pool = shuffle(Object.values(ex).flat().filter(id => byId[id]).map(id => byId[id])).slice(0, 16);
    } else {
      // curated purest examples first, then every other question the strategy applies to
      const curated = (ex[which] || []).filter(id => byId[id]).map(id => byId[id]);
      const curatedIds = new Set(curated.map(q => q.id));
      const rest = shuffle(allQuestions.filter(q => !curatedIds.has(q.id) && applicableStrategies(q).some(st => st.id === which))).slice(0, 12);
      pool = [...shuffle(curated), ...rest];
    }
    if (!pool.length) { toast("No matching questions found"); return; }
    const st = which === "mixed" ? null : stratById(which);
    startQuiz(pool, { title: st ? `Strategy: ${st.name}` : "Name That Strategy", immediate: true, mode: "strategy" });
  }

  // ── exam strategy (SAFER) ─────────────────────────────
  V.strategy = () => {
    const S = window.SAFER;
    const trapCounts = store.traps || {};
    h(`
    <div class="card"><h2 style="margin-bottom:4px;">🧭 SAFER — the FIRST/NEXT/BEST/MOST checklist</h2>
      <p style="color:var(--muted); font-size:.82rem; margin-bottom:12px;">${esc(S.intro)}</p>
      ${S.steps.map(s => `<div style="display:flex; gap:12px; margin-bottom:10px;">
        <div style="font-size:1.4rem; font-weight:800; color:var(--accent); min-width:1.4em;">${s.k}</div>
        <div><b style="font-size:.92rem;">${esc(s.t)}</b><p style="font-size:.85rem; color:var(--muted); line-height:1.45;">${esc(s.d)}</p></div>
      </div>`).join("")}</div>
    <div class="card sheet">
      <details class="acc"><summary><b>The four keywords</b><span class="acc-tag">FIRST · NEXT · BEST · MOST</span></summary>
        <div class="acc-body"><table>${S.keywords.map(k => `<tr><td style="white-space:nowrap;"><b>${k.w}</b></td><td style="font-size:.85rem;">${esc(k.d)}</td></tr>`).join("")}</table></div></details>
      <details class="acc"><summary><b>Exam rules</b><span class="acc-tag">${S.rules.length} rules</span></summary>
        <div class="acc-body"><ul style="padding-left:18px; font-size:.88rem; line-height:1.7;">${S.rules.map(r => `<li>${esc(r)}</li>`).join("")}</ul></div></details>
      <details class="acc"><summary><b>Distractor patterns</b><span class="acc-tag">your trap record</span></summary>
        <div class="acc-body">
        <p style="color:var(--muted); font-size:.82rem; margin-bottom:8px;">The shapes wrong answers take. Live counts show which ones actually catch you.</p>
        <table>${S.distractors.map(d => {
          const n = trapCounts[d.trap] || 0;
          return `<tr><td style="font-size:.85rem;">${esc(d.p)}</td><td class="num" style="white-space:nowrap; ${n ? "color:var(--warn); font-weight:700;" : "color:var(--muted);"}">${n ? n + "× you" : "—"}</td></tr>`;
        }).join("")}</table></div></details>
      ${window.ASWB_OFFICIAL ? `
      <details class="acc"><summary><b>Official ASWB guidance</b><span class="acc-tag">2025 Guidebook</span></summary>
        <div class="acc-body">
        <p style="font-size:.85rem; margin-bottom:6px;"><b>The three question types:</b></p>
        <table style="margin-bottom:10px;">${window.ASWB_OFFICIAL.levels.map(l => `<tr><td style="white-space:nowrap; vertical-align:top;"><b>${esc(l.name)}</b></td><td style="font-size:.84rem;">${esc(l.d)}</td></tr>`).join("")}</table>
        <p style="font-size:.85rem; margin-bottom:6px;"><b>ASWB's five steps:</b></p>
        <ol style="padding-left:20px; font-size:.86rem; line-height:1.65; margin-bottom:10px;">${window.ASWB_OFFICIAL.steps.map(x => `<li>${esc(x)}</li>`).join("")}</ol>
        <p style="font-size:.85rem; margin-bottom:6px;"><b>Test-day tips:</b></p>
        <ul style="padding-left:18px; font-size:.86rem; line-height:1.65;">${window.ASWB_OFFICIAL.tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
        <p style="color:var(--muted); font-size:.82rem; margin-top:10px;">${esc(window.ASWB_OFFICIAL.format)}</p>
        </div></details>` : ""}
    </div>
    <button class="ghost" onclick="App.go('learn')">Back</button>`);
  };

  // ── mode shortcuts ────────────────────────────────────
  function quick(n) { startQuiz(weightedSample(allQuestions, n), { title: `Quick ${n}`, immediate: true, mode: "quick" }); }
  function mock() { startQuiz(freshSample(allQuestions, Math.min(50, allQuestions.length)), { title: "Mock Exam", immediate: false, mode: "mock", paced: true }); }
  function fullExam() { startQuiz(freshSample(allQuestions, Math.min(170, allQuestions.length)), { title: "Full Exam", immediate: false, mode: "full", paced: true, sectioned: true }); }
  function dueDrill() {
    const pool = dueQuestions();
    if (!pool.length) { toast("Nothing due — you're ahead of schedule 🎉"); return; }
    startQuiz(pool.slice(0, 40), { title: "Due Today", immediate: true, mode: "due" });
  }
  function missed() {
    const pool = allQuestions.filter(q => { const r = store.q[q.id]; return r && r.seen && r.streak <= 0; });
    if (!pool.length) { toast("Nothing missed right now — nice!"); return; }
    startQuiz(shuffle(pool), { title: "Missed questions", immediate: true, mode: "missed" });
  }
  function starred() {
    const pool = allQuestions.filter(q => store.starred[q.id]);
    if (!pool.length) { toast("No starred questions yet — tap ☆ on any question"); return; }
    startQuiz(shuffle(pool), { title: "Starred drill", immediate: true, mode: "starred" });
  }

  function go(name) {
    const v = view();
    v.classList.add("refade"); void v.offsetWidth; v.classList.remove("refade");
    (V[name] || V.home)();
    const tabMap = {
      home: "home",
      practice: "practice", topics: "practice", subjects: "practice",
      sprint: "sprint", sprintBlock: "sprint",
      learn: "learn", meds: "learn", medsheet: "learn", theory: "learn", devsheet: "learn", therapysheet: "learn",
      howtotest: "learn", lessonView: "learn", strategy: "learn", coach: "learn", techniques: "learn",
      stats: "progress", account: "progress"
    };
    const active = tabMap[name] || null;
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === active));
  }

  // ── account & cloud sync (Netlify Functions + Netlify DB) ──
  const AUTH_KEY = "lcsw-auth-v1";
  let lastSync = 0, syncTimer = null;
  function authInfo() { try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; } }
  function authToken() { const a = authInfo(); return a && a.token; }
  function setChip(txt, on) {
    const c = el("sync-chip");
    if (c) { c.textContent = txt; c.classList.toggle("on", !!on); }
  }
  function initChip() {
    const a = authInfo();
    // "Sign in" — not "offline". The old wording read like a connection error
    // when it only ever meant "no account signed in on this device".
    setChip(a ? "🟢 " + a.email.split("@")[0] : "Sign in", !!a);
  }
  // A 502/504 means the serverless function never ran (build failed, or it crashed
  // while loading — usually a missing NETLIFY_DATABASE_URL/JWT_SECRET), so there's
  // no JSON error body to show. Say what to check instead of a bare status code.
  function gatewayMessage(status) {
    if (status === 502 || status === 504) return "Server not responding — the accounts function didn't start. Open /api/health to see what's missing.";
    if (status === 404) return "Accounts aren't deployed on this copy of the site (no server functions). Everything else still works offline.";
    return "Request failed (" + status + ")";
  }
  async function api(path, opts = {}) {
    const headers = { "Content-Type": "application/json" };
    if (authToken()) headers.Authorization = "Bearer " + authToken();
    const res = await fetch("/api/" + path, { ...opts, headers });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && authToken()) { localStorage.removeItem(AUTH_KEY); initChip(); }
    if (!res.ok) throw new Error(data.error || gatewayMessage(res.status));
    return data;
  }
  // Merge two progress stores: per-question newest wins, stars/notes union,
  // sessions dedup by timestamp, trap counts take the max.
  function mergeStores(a, b) {
    a = a || {}; b = b || {};
    const m = { q: {}, sessions: [], starred: { ...(b.starred || {}), ...(a.starred || {}) },
      traps: {}, notes: { ...(b.notes || {}), ...(a.notes || {}) },
      coach: (a.coach && b.coach) ? ((a.coach.date >= b.coach.date) ? a.coach : b.coach) : (a.coach || b.coach),
      examDate: a.examDate || b.examDate };
    new Set([...Object.keys(a.q || {}), ...Object.keys(b.q || {})]).forEach(id => {
      const x = (a.q || {})[id], y = (b.q || {})[id];
      m.q[id] = !x ? y : !y ? x : ((x.last || 0) >= (y.last || 0) ? x : y);
    });
    new Set([...Object.keys(a.traps || {}), ...Object.keys(b.traps || {})]).forEach(k => {
      m.traps[k] = Math.max((a.traps || {})[k] || 0, (b.traps || {})[k] || 0);
    });
    const seenWhen = new Set();
    m.sessions = [...(a.sessions || []), ...(b.sessions || [])]
      .filter(s => s && s.when && !seenWhen.has(s.when) && seenWhen.add(s.when))
      .sort((x, y) => x.when - y.when).slice(-200);
    return m;
  }
  function scheduleSync() {
    if (!authToken()) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(pushProgress, 4000);
  }
  async function pushProgress() {
    if (!authToken()) return;
    try {
      setChip("🔄 syncing…", true);
      await api("progress", { method: "PUT", body: JSON.stringify({ data: store }) });
      lastSync = Date.now(); initChip();
    } catch (e) { setChip("⚠ sync error"); }
  }
  async function syncNow(rerenderHome) {
    if (!authToken()) return;
    try {
      setChip("🔄 syncing…", true);
      const remote = await api("progress");
      if (remote && remote.data) {
        store = mergeStores(store, remote.data);
        localStorage.setItem(LS_KEY, JSON.stringify(store));
      }
      await api("progress", { method: "PUT", body: JSON.stringify({ data: store }) });
      lastSync = Date.now(); initChip();
      toast("Progress synced");
      if (rerenderHome) go("home");
    } catch (e) { setChip("⚠ sync error"); toast("Sync failed: " + e.message); }
  }
  async function doAuth(action) {
    const email = (el("auth-email").value || "").trim().toLowerCase();
    const pw = el("auth-pw").value || "";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast("Enter a valid email"); return; }
    if (pw.length < 8) { toast("Password must be at least 8 characters"); return; }
    try {
      const d = await api("auth", { method: "POST", body: JSON.stringify({ action, email, password: pw }) });
      localStorage.setItem(AUTH_KEY, JSON.stringify({ token: d.token, email: d.email }));
      initChip();
      toast(action === "register" ? "Account created" : "Signed in");
      await syncNow();
      go("account");
    } catch (e) { toast(e.message || "Something went wrong"); }
  }
  function logout() {
    localStorage.removeItem(AUTH_KEY);
    initChip();
    toast("Signed out — progress stays on this device");
    go("account");
  }
  V.account = () => {
    const a = authInfo();
    if (!a) {
      h(`<div class="card">
        <h2 style="margin-bottom:4px;">👤 Account</h2>
        <p style="color:var(--muted); font-size:.85rem; margin-bottom:14px;">Create an account to back up your progress and sync it between your phone and computer. Optional — the app works fully without one, saving to this device.</p>
        <p style="font-size:.8rem; margin-bottom:12px;"><a href="/api/health" target="_blank" rel="noopener">Check server status →</a> <span style="color:var(--muted);">(confirms accounts are wired up before you try)</span></p>
        <input class="auth-field" id="auth-email" type="email" placeholder="Email" autocomplete="email">
        <input class="auth-field" id="auth-pw" type="password" placeholder="Password (8+ characters)" autocomplete="current-password">
        <div class="row" style="margin-top:6px;">
          <button class="ghost" onclick="App.doAuth('register')">Create account</button>
          <button class="primary" onclick="App.doAuth('login')">Sign in</button>
        </div>
      </div>
      <div class="card" style="font-size:.8rem; color:var(--muted); line-height:1.6;">
        🔒 Passwords are stored only as a salted hash; progress is visible only to your account. Local export/import lives under <b>Progress</b>.<br><br>
        ⚠️ Accounts require the GitHub-connected deploy (the server functions have to be built). If this copy was uploaded as a zip, sign-in will fail — everything else works normally and your progress is saved on this device. Export a backup any time from <b>Progress</b>.
      </div>`);
      return;
    }
    h(`<div class="card">
      <div class="row" style="justify-content:flex-start; gap:14px;">
        <div class="account-avatar">${esc(a.email[0].toUpperCase())}</div>
        <div><div style="font-weight:700;">${esc(a.email)}</div>
        <div style="color:var(--muted); font-size:.8rem;">${lastSync ? "Last synced " + new Date(lastSync).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Sync runs automatically after you answer questions"}</div></div>
      </div>
      <div class="row" style="margin-top:16px;">
        <button class="ghost" onclick="App.logout()">Sign out</button>
        <button class="primary" onclick="App.syncNow(true)">Sync now</button>
      </div></div>
    <div class="card" style="font-size:.82rem; color:var(--muted); line-height:1.6;">
      Signing in on another device pulls this progress down and merges it — nothing is lost in either direction. Local Export/Import in Stats still works as an extra backup.
    </div>`);
  };

  // ── Exam Sprint (guided two-day plan) ─────────────────
  function sprintState() {
    store.sprint = store.sprint || { done: {}, steps: {}, notes: "" };
    store.sprint.plans = store.sprint.plans || {};
    return store.sprint;
  }
  // If-then (implementation intention) — the best-evidenced task-initiation
  // lever there is: d≈.65 overall, d≈.61 specifically for failures to GET
  // STARTED (Gollwitzer & Sheeran 2006). The literal conditional wording is
  // the active ingredient, so the UI forces "If <cue>, then I <action>".
  function savePlan(blockId) {
    const cue = el("plan-cue");
    if (!cue) return;
    const v = cue.value.trim();
    const s = sprintState();
    if (v) s.plans[blockId] = v; else delete s.plans[blockId];
    save();
    toast(v ? "Plan locked in" : "Plan cleared");
    go("sprint");
  }
  function sprintBlocks() {
    return (window.SPRINT_PLAN ? window.SPRINT_PLAN.phases : []).flatMap(p => p.blocks.map(b => ({ ...b, phaseTitle: p.title, phaseSub: p.subtitle })));
  }
  function nextSprintBlock() {
    const s = sprintState();
    return sprintBlocks().find(b => !s.done[b.id]) || null;
  }
  function sprintPool(match) {
    if (!match) return allQuestions;
    if (match.all) return allQuestions;
    if (match.missed) {
      const p = allQuestions.filter(q => { const r = store.q[q.id]; return r && r.seen && r.streak <= 0; });
      return p.length ? p : allQuestions;
    }
    const p = allQuestions.filter(q => {
      if (match.banks && match.banks.includes(q.bankId)) return true;
      if (match.topics && match.topics.some(t => (q.topic || "").toLowerCase().includes(t.toLowerCase()))) return true;
      if (match.strategies && applicableStrategies(q).some(s => match.strategies.includes(s.id))) return true;
      return false;
    });
    return p.length >= 5 ? p : allQuestions;
  }

  // block clock
  let blockClock = null, blockTimerInt = null;
  function fmtClock(ms) {
    const t = Math.max(0, Math.round(ms / 1000));
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  }
  function startBlockClock(mins) {
    blockClock = { remaining: mins * 60000, paused: false, last: Date.now() };
    clearInterval(blockTimerInt);
    blockTimerInt = setInterval(tickBlock, 1000);
  }
  function tickBlock() {
    if (!blockClock) { clearInterval(blockTimerInt); return; }
    if (!blockClock.paused) {
      const now = Date.now();
      blockClock.remaining -= (now - blockClock.last);
      blockClock.last = now;
    } else blockClock.last = Date.now();
    const eln = el("block-clock");
    if (!eln) { clearInterval(blockTimerInt); return; }
    const over = blockClock.remaining <= 0;
    eln.textContent = (over ? "+" : "") + fmtClock(Math.abs(blockClock.remaining));
    eln.style.color = over ? "var(--warn)" : "var(--muted)";
  }
  function pauseBlock() {
    if (!blockClock) return;
    blockClock.paused = !blockClock.paused;
    blockClock.last = Date.now();
    const b = el("pause-btn");
    if (b) b.textContent = blockClock.paused ? "▶ Resume" : "⏸ Pause";
  }

  function celebrate(msg) {
    const wrap = document.createElement("div");
    wrap.className = "celebrate";
    wrap.innerHTML = `<div class="celebrate-card"><div class="celebrate-big">✓</div><div class="celebrate-msg">${esc(msg)}</div></div>`;
    document.body.appendChild(wrap);
    if (!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      const bits = ["🎉", "⭐", "✨", "🎊", "💙", "🏆"];
      for (let i = 0; i < 30; i++) {
        const b = document.createElement("span");
        b.className = "confetti-bit";
        b.textContent = bits[Math.floor(Math.random() * bits.length)];
        b.style.left = Math.random() * 100 + "vw";
        b.style.animationDuration = (1.5 + Math.random() * 1.5) + "s";
        b.style.animationDelay = (Math.random() * 0.4) + "s";
        document.body.appendChild(b);
        setTimeout(() => b.remove(), 3600);
      }
    }
    setTimeout(() => wrap.remove(), 2200);
  }

  // ── sprint dashboard ──
  V.sprint = () => {
    const P = window.SPRINT_PLAN;
    if (!P) { toast("Sprint plan not loaded"); go("home"); return; }
    const s = sprintState();
    const blocks = sprintBlocks();
    const doneN = blocks.filter(b => s.done[b.id]).length;
    const next = nextSprintBlock();
    const totalMins = blocks.filter(b => !s.done[b.id]).reduce((a, b) => a + b.mins, 0);
    const phaseHtml = `<div class="card sheet"><h3 style="margin-bottom:4px;">All blocks</h3>
      <p class="sheet-hint">${doneN} of ${blocks.length} complete</p>` + P.phases.map(ph => `
      <div class="section-title" style="margin:14px 0 8px;">${esc(ph.subtitle)} — ${esc(ph.title)}</div>
      ${ph.blocks.map(b => {
        const isDone = !!s.done[b.id];
        const isNext = next && next.id === b.id;
        return `<div class="sprint-row ${isDone ? "done" : ""} ${isNext ? "next" : ""}" onclick="App.startBlock('${b.id}')">
          <span class="sr-icon">${isDone ? "✅" : b.icon}</span>
          <div class="sr-body">
            <div class="sr-title">${esc(b.title)}${isNext ? ` <span class="sr-now">START HERE</span>` : ""}</div>
            <div class="sr-tag">${esc(b.tag)}</div>
          </div>
          <span class="sr-mins">${b.mins}m</span>
        </div>`;
      }).join("")}`).join("") + `</div>`;
    h(`
    <div class="card sprint-hero">
      <div class="sh-label">EXAM SPRINT</div>
      <h2 style="margin:2px 0 6px;">${esc(P.title)}</h2>
      <p style="color:var(--muted); font-size:.84rem; line-height:1.5;">${esc(P.source)}</p>
      <div class="sprint-progress"><div style="width:${Math.round(100 * doneN / blocks.length)}%"></div></div>
      <div style="display:flex; justify-content:space-between; font-size:.78rem; color:var(--muted); margin-top:6px;">
        <span><b style="color:var(--text)">${doneN}/${blocks.length}</b> blocks complete</span>
        <span>${totalMins > 0 ? `~${Math.round(totalMins / 60 * 10) / 10} hrs of work left` : "Plan complete 🎉"}</span>
      </div>
    </div>
    ${next ? `
    <div class="card next-block" onclick="App.startBlock('${next.id}')">
      <div style="font-size:.72rem; letter-spacing:.08em; color:var(--accent); font-weight:800;">YOUR NEXT BLOCK</div>
      <div style="display:flex; align-items:center; gap:14px; margin:10px 0 8px;">
        <div style="font-size:2.4rem; line-height:1;">${next.icon}</div>
        <div style="flex:1;">
          <div style="font-weight:800; font-size:1.15rem; letter-spacing:-.01em;">${esc(next.title)}</div>
          <div style="color:var(--muted); font-size:.8rem;">${next.mins} minutes · ${esc(next.tag)}</div>
        </div>
      </div>
      <p style="font-size:.86rem; line-height:1.5; color:var(--muted); margin-bottom:14px;">${esc(next.why)}</p>
      <button class="primary" style="width:100%;" onclick="event.stopPropagation(); App.startBlock('${next.id}')">Start this block →</button>
      <div class="ifthen-inline" onclick="event.stopPropagation()">
      <b style="font-size:.9rem;">🔒 Lock in when you'll start</b>
      <p style="color:var(--muted); font-size:.79rem; line-height:1.5; margin:4px 0 10px;">
        Naming a specific trigger beats intending to "get to it" — the strongest finding in the task-initiation literature, and the conditional wording itself is the active part.</p>
      <div class="ifthen-line">
        <span>If it is</span>
        <input id="plan-cue" class="auth-field ifthen-input" placeholder="8:30 and I've poured my coffee" value="${esc(s.plans[next.id] || "")}">
      </div>
      <div class="ifthen-line" style="margin-top:6px;">
        <span>then I start <b>${esc(next.title)}</b> — nothing else first.</span>
      </div>
      <button class="ghost" style="margin-top:10px;" onclick="App.savePlan('${next.id}')">Save my plan</button>
      ${s.plans[next.id] ? `<div class="expl" style="border-color:var(--good); margin-top:10px; font-size:.86rem;">
        <b>Your plan:</b> If it is ${esc(s.plans[next.id])}, then I start ${esc(next.title)}.</div>` : ""}
      </div>
    </div>` : `
    <div class="card" style="text-align:center; padding:28px 18px;">
      <div style="font-size:2.6rem;">🏆</div>
      <h3 style="margin:8px 0;">Every block is done.</h3>
      <p style="color:var(--muted); font-size:.88rem;">You worked the whole plan. Rest is now the highest-value activity available to you.</p>
    </div>`}
    <div class="card sheet">
      <details class="acc" open><summary><b>🧠 Brain dump</b><span class="acc-tag">offload it, don't hold it</span></summary>
        <div class="acc-body"><textarea id="sprint-notes" class="brain-dump" rows="2" placeholder="Anything pulling at your attention — write it here and let it go…" oninput="App.saveSprintNotes()">${esc(s.notes || "")}</textarea></div>
      </details>
      <details class="acc"><summary><b>Where your points are</b><span class="acc-tag">priority split</span></summary>
        <div class="acc-body">${P.priorities.map(p => `<div class="prio-row">
          <div class="prio-bar"><div style="width:${p.pct * 2.4}%"></div></div>
          <div class="prio-txt"><b>${p.pct}%</b> ${esc(p.label)}<small>${esc(p.why)}</small></div>
        </div>`).join("")}</div>
      </details>
      ${window.SPRINT_EVIDENCE ? `<details class="acc"><summary><b>What this plan rests on</b><span class="acc-tag">evidence</span></summary>
        <div class="acc-body">
        <p style="color:var(--good); font-size:.76rem; font-weight:800; letter-spacing:.06em; margin-bottom:6px;">SOLID</p>
        <ul style="padding-left:18px; font-size:.84rem; line-height:1.6;">${window.SPRINT_EVIDENCE.solid.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        <p style="color:var(--warn); font-size:.76rem; font-weight:800; letter-spacing:.06em; margin:12px 0 6px;">REASONABLE, NOT PROVEN</p>
        <ul style="padding-left:18px; font-size:.84rem; line-height:1.6;">${window.SPRINT_EVIDENCE.weak.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        </div></details>` : ""}
    </div>
    ${phaseHtml}
    <div class="row" style="margin-top:14px;">
      <button class="ghost" onclick="App.go('home')">Back</button>
      ${doneN ? `<button class="ghost" onclick="App.resetSprint()" style="color:var(--bad)">Reset sprint progress</button>` : ""}
    </div>`);
  };
  function saveSprintNotes() {
    const t = el("sprint-notes");
    if (!t) return;
    sprintState().notes = t.value;
    localStorage.setItem(LS_KEY, JSON.stringify(store));
  }
  function resetSprint() {
    if (!confirm("Clear sprint block progress? (Your question history and notes stay.)")) return;
    store.sprint = { done: {}, steps: {}, notes: sprintState().notes };
    save(); go("sprint");
  }

  // ── block focus mode ──
  let curBlock = null, curStep = 0;
  function startBlock(id) {
    const b = sprintBlocks().find(x => x.id === id);
    if (!b) return;
    curBlock = b; curStep = 0;
    startBlockClock(b.mins);
    go("sprintBlock");
  }
  function blockStep(n) {
    if (!curBlock) { go("sprint"); return; }
    if (n >= curBlock.steps.length) { finishBlock(); return; }
    curStep = Math.max(0, n);
    go("sprintBlock");
  }
  function finishBlock() {
    if (!curBlock) { go("sprint"); return; }
    const s = sprintState();
    s.done[curBlock.id] = Date.now();
    save();
    clearInterval(blockTimerInt); blockClock = null;
    const remaining = sprintBlocks().filter(b => !s.done[b.id]).length;
    celebrate(remaining ? `${curBlock.title} — done!` : "Sprint complete!");
    const finished = curBlock;
    curBlock = null;
    setTimeout(() => {
      h(`<div class="card" style="text-align:center; padding:30px 18px;">
        <div style="font-size:3rem;">${finished.icon}</div>
        <h2 style="margin:10px 0 4px;">${esc(finished.title)} complete</h2>
        <p style="color:var(--muted); font-size:.88rem; margin-bottom:6px;">That block is closed. ${remaining ? `${remaining} to go.` : "That was the last one."}</p>
        <div class="break-card">
          <b>🚶 Break — and pick the right kind</b>
          <small>A few minutes to stand up and get water is for <i>you</i>, not for your scores: short micro-breaks don't measurably improve cognitive performance.<br><br>
          What <b>does</b> have real evidence in adults with ADHD is a <b>20–30 minute moderate walk or jog</b> — meaningful gains in inhibitory control afterward. If you're going to move at all today, make one break that one.</small>
        </div>
        <div class="row" style="justify-content:center; gap:10px; margin-top:16px;">
          <button class="ghost" onclick="App.go('home')">Home</button>
          <button class="primary" onclick="App.go('sprint')">${remaining ? "Back to sprint →" : "See the plan"}</button>
        </div>
      </div>`);
    }, 900);
  }

  V.sprintBlock = () => {
    if (!curBlock) { go("sprint"); return; }
    const b = curBlock, st = b.steps[curStep];
    const pct = Math.round(100 * curStep / b.steps.length);
    const head = `
      <div class="block-bar">
        <button class="ghost bb-back" onclick="App.go('sprint')">✕</button>
        <div class="bb-mid">
          <div class="bb-title">${b.icon} ${esc(b.title)}</div>
          <div class="bb-steps">Step ${curStep + 1} of ${b.steps.length}</div>
        </div>
        <div class="bb-clock"><span id="block-clock">${fmtClock(blockClock ? blockClock.remaining : b.mins * 60000)}</span>
          <button class="ghost bb-pause" id="pause-btn" onclick="App.pauseBlock()">⏸ Pause</button></div>
      </div>
      <div class="progressbar" style="margin-bottom:14px;"><div style="width:${pct}%"></div></div>`;
    const nav = (label = "Next step →") => `
      <div class="row" style="margin-top:16px;">
        <button class="ghost" onclick="App.blockStep(${curStep - 1})" ${curStep === 0 ? 'style="visibility:hidden"' : ""}>← Back</button>
        <button class="primary" onclick="App.blockStep(${curStep + 1})">${label}</button>
      </div>`;

    if (st.type === "learn") {
      h(`${head}<div class="card">
        <h3 style="margin-bottom:10px;">${esc(st.title)}</h3>
        ${(window.SPRINT_VISUALS || {})[st.visual] || ""}
        ${nav(curStep + 1 >= b.steps.length ? "Finish block ✓" : "Got it →")}
      </div>`);
      return;
    }
    if (st.type === "action") {
      h(`${head}<div class="card">
        <h3 style="margin-bottom:10px;">${esc(st.title)}</h3>
        <div class="expl" style="font-size:.9rem;">${st.body || ""}</div>
        ${st.action ? `<button class="ghost" style="margin-top:10px;" onclick="${st.action}">${esc(st.actionLabel || "Open")}</button>` : ""}
        ${nav(curStep + 1 >= b.steps.length ? "Finish block ✓" : "Done →")}
      </div>`);
      return;
    }
    if (st.type === "checklist") {
      const s = sprintState();
      h(`${head}<div class="card">
        <h3 style="margin-bottom:10px;">${esc(st.title)}</h3>
        ${st.items.map((it, i) => {
          const key = `${b.id}.${curStep}.${i}`;
          return `<label class="topic-check" style="cursor:pointer;">
            <input type="checkbox" ${s.steps[key] ? "checked" : ""} onchange="App.toggleSprintStep('${key}')">
            <span style="font-size:.9rem;">${esc(it)}</span></label>`;
        }).join("")}
        ${nav(curStep + 1 >= b.steps.length ? "Finish block ✓" : "Next →")}
      </div>`);
      return;
    }
    if (st.type === "recall") {
      const R = (window.SPRINT_RECALL || {})[st.set];
      h(`${head}<div class="card">
        <h3 style="margin-bottom:4px;">${esc(st.title)}</h3>
        <p style="color:var(--muted); font-size:.84rem; margin-bottom:10px;">Write it from memory <b>before</b> revealing. Struggling to retrieve is what makes it stick.</p>
        <div class="expl" style="border-color:var(--warn); margin-bottom:10px;">${esc(R ? R.prompt : "")}</div>
        <textarea id="recall-box" class="brain-dump" rows="7" placeholder="Type what you can remember… don't peek."></textarea>
        <button class="ghost" style="margin-top:8px;" onclick="App.revealRecall()">Reveal the answer</button>
        <div id="recall-answer"></div>
        ${nav(curStep + 1 >= b.steps.length ? "Finish block ✓" : "Next →")}
      </div>`);
      return;
    }
    if (st.type === "contrast") {
      contrastRun = { set: st.set, i: 0, right: 0, items: shuffle([...(window.SPRINT_CONTRASTS[st.set] || [])]) };
      renderContrast();
      return;
    }
    if (st.type === "drill") {
      const pool = sprintPool(st.match);
      const n = Math.min(st.n || 15, pool.length);
      h(`${head}<div class="card" style="text-align:center; padding:26px 18px;">
        <div style="font-size:2.2rem;">🎯</div>
        <h3 style="margin:8px 0 4px;">${esc(st.title)}</h3>
        <p style="color:var(--muted); font-size:.86rem; margin-bottom:16px;">
          ${n} questions${st.exam ? " · <b>exam conditions</b> — no feedback until the end. Commit, flag, continue." : " · feedback after each one"}.</p>
        <button class="primary" onclick="App.runSprintDrill(${curStep})">Start the drill →</button>
        <div class="row" style="justify-content:center; margin-top:14px;">
          <button class="ghost" onclick="App.blockStep(${curStep + 1})">Skip this drill</button>
        </div>
      </div>`);
      return;
    }
    // fallback
    h(`${head}<div class="card"><p>Unknown step.</p>${nav()}</div>`);
  };

  function toggleSprintStep(key) {
    const s = sprintState();
    s.steps[key] = !s.steps[key];
    if (!s.steps[key]) delete s.steps[key];
    save();
  }
  function revealRecall() {
    const st = curBlock.steps[curStep];
    const R = (window.SPRINT_RECALL || {})[st.set];
    const box = el("recall-answer");
    if (!box || !R) return;
    box.innerHTML = `<div class="expl" style="border-color:var(--good); white-space:pre-wrap; margin-top:10px;">${esc(R.answer)}</div>
      <div class="row" style="justify-content:flex-start; gap:8px; margin-top:8px;">
        <button class="ghost" onclick="App.gradeRecall(true)">✓ I had it</button>
        <button class="ghost" onclick="App.gradeRecall(false)">✗ Missed some — review again</button>
      </div>`;
  }
  function gradeRecall(got) {
    if (got) { celebrate("Locked in."); }
    else { toast("Reread it, then write it again — that's the whole trick."); }
  }

  // contrast drill
  let contrastRun = null;
  function renderContrast() {
    const b = curBlock, C = contrastRun;
    const pct = Math.round(100 * curStep / b.steps.length);
    const head = `
      <div class="block-bar">
        <button class="ghost bb-back" onclick="App.go('sprint')">✕</button>
        <div class="bb-mid"><div class="bb-title">${b.icon} ${esc(b.title)}</div>
        <div class="bb-steps">Step ${curStep + 1} of ${b.steps.length} · contrast ${Math.min(C.i + 1, C.items.length)}/${C.items.length}</div></div>
        <div class="bb-clock"><span id="block-clock">${fmtClock(blockClock ? blockClock.remaining : 0)}</span>
          <button class="ghost bb-pause" id="pause-btn" onclick="App.pauseBlock()">${blockClock && blockClock.paused ? "▶ Resume" : "⏸ Pause"}</button></div>
      </div>
      <div class="progressbar" style="margin-bottom:14px;"><div style="width:${pct}%"></div></div>`;
    if (C.i >= C.items.length) {
      const all = C.right === C.items.length;
      h(`${head}<div class="card" style="text-align:center; padding:26px 18px;">
        <div style="font-size:2.4rem;">${all ? "🎯" : C.right / C.items.length >= 0.8 ? "👏" : "🔁"}</div>
        <h3 style="margin:8px 0 4px;">${C.right} / ${C.items.length}</h3>
        <p style="color:var(--muted); font-size:.86rem; margin-bottom:16px;">
          ${all ? "Perfect — that distinction is yours." : C.right / C.items.length >= 0.8 ? "Close. One more pass and it's automatic." : "Run it again — this is exactly the kind of miss that's costing you points."}</p>
        <div class="row" style="justify-content:center; gap:10px;">
          <button class="ghost" onclick="App.redoContrast()">Run it again</button>
          <button class="primary" onclick="App.blockStep(${curStep + 1})">${curStep + 1 >= b.steps.length ? "Finish block ✓" : "Next step →"}</button>
        </div>
      </div>`);
      return;
    }
    const it = C.items[C.i];
    h(`${head}<div class="card">
      <div class="q-meta"><span class="badge">CONTRAST DRILL</span></div>
      <div class="q-stem">${esc(it.q)}</div>
      <div id="contrast-opts">
        ${it.a.map((opt, i) => `<button class="opt" onclick="App.pickContrast(${i})"><b>${"AB"[i]}.</b> ${esc(opt)}</button>`).join("")}
      </div>
      <div id="contrast-fb"></div>
    </div>`);
  }
  function pickContrast(i) {
    const C = contrastRun, it = C.items[C.i];
    const ok = i === it.correct;
    if (ok) C.right++;
    [...view().querySelectorAll(".opt")].forEach((o, idx) => {
      o.disabled = true;
      if (idx === it.correct) o.classList.add("correct");
      else if (idx === i) o.classList.add("wrong");
    });
    el("contrast-fb").innerHTML = `<div class="expl" style="border-color:${ok ? "var(--good)" : "var(--bad)"}">
      <b style="color:${ok ? "var(--good)" : "var(--bad)"}">${ok ? "✓ Yes" : "✗ Not this time"}</b> — ${esc(it.why)}</div>
      <button class="primary" style="margin-top:8px; width:100%;" onclick="App.nextContrast()">Next →</button>`;
  }
  function nextContrast() { contrastRun.i++; renderContrast(); }
  function redoContrast() { contrastRun.i = 0; contrastRun.right = 0; contrastRun.items = shuffle(contrastRun.items); renderContrast(); }

  function runSprintDrill(stepIdx) {
    const b = curBlock, st = b.steps[stepIdx];
    const pool = sprintPool(st.match);
    const n = Math.min(st.n || 15, pool.length);
    const qs = st.exam ? freshSample(pool, n) : weightedSample(pool, n);
    const ret = { blockId: b.id, stepIdx };
    startQuiz(qs, { title: `${b.title}`, immediate: !st.exam, mode: "sprint", paced: !!st.exam });
    if (session) session.sprintReturn = ret;
  }
  function resumeSprint(blockId, stepIdx) {
    const b = sprintBlocks().find(x => x.id === blockId);
    if (!b) { go("sprint"); return; }
    curBlock = b;
    if (!blockClock) startBlockClock(b.mins);
    blockStep(stepIdx + 1);
  }

  // ── keyboard shortcuts ────────────────────────────────
  document.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    const opts = [...view().querySelectorAll(".opt:not(:disabled)")];
    if (opts.length && "abcdef".includes(k)) { const i = "abcdef".indexOf(k); if (opts[i]) { opts[i].click(); e.preventDefault(); } return; }
    if (opts.length && "123456".includes(e.key)) { const i = +e.key - 1; if (opts[i]) { opts[i].click(); e.preventDefault(); } return; }
    if (k === "enter" || k === " ") {
      const nb = el("next-btn");
      if (nb && !nb.classList.contains("hidden")) { nb.click(); e.preventDefault(); return; }
      const fb = view().querySelector("#med-fb .primary, #th-fb .primary");
      if (fb) { fb.click(); e.preventDefault(); }
      return;
    }
    if (k === "s" && session && session.qs && session.qs[session.i]) {
      const st = view().querySelector('[id^="star-"]');
      if (st) toggleStar(st.id.replace("star-", ""));
    }
  });

  // ── swipe to advance (mobile) ─────────────────────────
  let touchX = null, touchY = null;
  document.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; }, { passive: true });
  document.addEventListener("touchend", e => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX, dy = e.changedTouches[0].clientY - touchY;
    touchX = null;
    if (dx < -60 && Math.abs(dy) < 50) {
      const nb = el("next-btn");
      if (nb && !nb.classList.contains("hidden")) nb.click();
      else { const fb = view().querySelector("#med-fb .primary, #th-fb .primary"); if (fb) fb.click(); }
    }
  }, { passive: true });

  // ── init ──────────────────────────────────────────────
  if (!banks.length) {
    document.getElementById("view").innerHTML = `<div class="card">No question banks loaded. Check that the data/*.js files exist and are listed in index.html.</div>`;
  } else {
    go("home");
    initChip();
    if (authToken() && navigator.onLine) syncNow(true);
  }

  return { go, quick, mock, fullExam, dueDrill, missed, starred, pick, next, quitQuiz, skipQuestion, beginSection2, topicStart, subjectStart, redrillLast, resetStats, toggleStar, markGuess, editNote, saveNote, lesson, strategyDrill, setExamDate, coachToggle, startAreaDrill, doAuth, logout, syncNow, resumeTest,
           startBlock, blockStep, pauseBlock, toggleSprintStep, revealRecall, gradeRecall, pickContrast, nextContrast, redoContrast, runSprintDrill, resumeSprint, saveSprintNotes, resetSprint, savePlan,
           exportProgress, importProgress,
           medDrill, medAnswer, medPairAnswer, medNext, medQuizBank, thStages, thTherapy, thTheorist, thAttach, thAnswer, thNext, theoryQuizBank };
})();
