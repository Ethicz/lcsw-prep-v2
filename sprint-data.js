/* ═══════════════════════════════════════════════════════════════
   Exam Sprint — a guided, time-boxed plan built from the personalized
   Two-Day Pass Plan (prepared July 2026 from the user's missed questions).

   Design rules baked in (ADHD + short-timeline learning):
   • One screen = one task. No menus mid-block.
   • Every block is time-boxed with a visible countdown.
   • Learn → Contrast → Recall from memory → Drill real questions.
     (Contrast pairs target the #1 diagnosed weakness: confusable concepts.)
   • Blank-page recall before any rereading — generation beats review.
   • Immediate completion feedback; movement break between blocks.
   • A brain-dump pad so intrusive thoughts leave working memory.
   ═══════════════════════════════════════════════════════════════ */

window.SPRINT_VISUALS = {
  safec: `
    <div class="viz">
      <div class="viz-title">SAFE C — your decision ladder</div>
      <div class="ladder">
        <div class="rung r1"><span class="rk">S</span><div><b>Safety</b><small>Imminent danger, abuse, medical instability? → Protect life first.</small></div></div>
        <div class="rung r2"><span class="rk">A</span><div><b>Assess</b><small>Information missing? → Clarify before reporting, diagnosing, referring, confronting.</small></div></div>
        <div class="rung r3"><span class="rk">F</span><div><b>Feelings</b><small>Distressed, guarded, wants to be understood? → Acknowledge and start where they are.</small></div></div>
        <div class="rung r4"><span class="rk">E</span><div><b>Empower</b><small>Can they act for themselves? → Teach and preserve self-determination. Don't take over.</small></div></div>
        <div class="rung r5"><span class="rk">C</span><div><b>Consult / channel</b><small>Needs expertise, legal advice, supervision, HR? → Least drastic appropriate channel.</small></div></div>
      </div>
      <div class="viz-note">A ladder, not a formula. Safety only wins when danger is actually in the stem.</div>
    </div>`,

  qualifiers: `
    <div class="viz">
      <div class="viz-title">The four qualifiers</div>
      <table class="viz-table">
        <tr><td class="qk">FIRST</td><td>Earliest appropriate step — usually engagement or assessment, <b>unless</b> safety or a clear mandate controls.</td></tr>
        <tr><td class="qk">NEXT</td><td>What follows what's <b>already done</b>. Never repeat an assessment the stem says is complete.</td></tr>
        <tr><td class="qk">BEST / MOST</td><td>Strongest among plausible options: ethical, person-centered, addresses the actual problem.</td></tr>
        <tr><td class="qk">EXCEPT</td><td>Name the category <b>before</b> reading choices, then eliminate the outsider.</td></tr>
      </table>
      <div class="viz-note">Read the last sentence first and circle the qualifier mentally.</div>
    </div>`,

  ethics: `
    <div class="viz">
      <div class="viz-title">Your ethics situations — the exam response</div>
      <table class="viz-table">
        <tr><td><b>Supervisor makes a sexual advance</b></td><td>Report through the agency harassment process / HR.<small>You are not required to confront a harasser across a power differential.</small></td></tr>
        <tr><td><b>Colleague's conduct seems unethical</b></td><td>Discuss directly when feasible → then internal supervisory channel.<small>Don't involve the client; don't jump to the board when a lower channel exists.</small></td></tr>
        <tr><td><b>Subpoena / legal demand</b></td><td>Consult an attorney.<small>Never guess about privilege or whether you must appear.</small></td></tr>
        <tr><td><b>Consultation in a small community</b></td><td>Get authorization when recognition is likely.<small>Removing names may not prevent identification.</small></td></tr>
        <tr><td><b>Foreseeable dual relationship</b></td><td>Avoid entering it when the conflict is preventable.<small>Discussing a conflict does not neutralize it.</small></td></tr>
        <tr><td><b>Client asks you to tell their spouse something</b></td><td>Teach and rehearse strategies they can use.<small>Avoid triangulation and dependence.</small></td></tr>
        <tr><td><b>Possible violence, threat not established</b></td><td>Assess the threat before reporting, when time and safety permit.<small>No premature report based only on concern.</small></td></tr>
        <tr><td><b>Searching a client online</b></td><td>Only for a compelling safety reason, within ethical limits.<small>Never out of curiosity.</small></td></tr>
        <tr><td><b>High suicide risk: plan, means, history</b></td><td>Explore <b>voluntary</b> hospitalization first when feasible.<small>Involuntary only if voluntary safety can't be achieved.</small></td></tr>
      </table>
    </div>`,

  erikson: `
    <div class="viz">
      <div class="viz-title">Erikson — match the behavior first, age second</div>
      <div class="stairs">
        <div class="step"><span class="sn">1</span><b>Trust vs. Mistrust</b><em>0–1</em><small>"Can I trust the world?"</small></div>
        <div class="step"><span class="sn">2</span><b>Autonomy vs. Shame</b><em>1–3</em><small>"Can I do it myself?" — the toddler saying NO</small></div>
        <div class="step"><span class="sn">3</span><b>Initiative vs. Guilt</b><em>3–6</em><small>"Is it okay to start things?" — play, imagination</small></div>
        <div class="step"><span class="sn">4</span><b>Industry vs. Inferiority</b><em>6–12</em><small>"Can I master skills?" — school, peer comparison</small></div>
        <div class="step"><span class="sn">5</span><b>Identity vs. Role Confusion</b><em>Adolescence</em><small>"Who am I?"</small></div>
        <div class="step"><span class="sn">6</span><b>Intimacy vs. Isolation</b><em>Young adult</em><small>"Can I share myself with another?"</small></div>
        <div class="step"><span class="sn">7</span><b>Generativity vs. Stagnation</b><em>Middle adult</em><small>"What am I giving to others?" — contribution NOW</small></div>
        <div class="step"><span class="sn">8</span><b>Integrity vs. Despair</b><em>Older adult</em><small>"Was my life worthwhile?" — looking BACK</small></div>
      </div>
      <div class="viz-note">Trust and autonomy <b>initiate industry</b>. Identity and intimacy <b>generate integrity</b>.<br>
      Unresolved-stage question? Match the <b>behavior</b>, not the chronological age.</div>
    </div>`,

  attachment: `
    <div class="viz">
      <div class="viz-title">Attachment — separation + reunion together</div>
      <div class="cards4">
        <div class="c4"><b>Secure</b><small><i>Separation:</i> may show distress<br><i>Reunion:</i> seeks and is comforted</small><em>Secure settles</em></div>
        <div class="c4"><b>Avoidant</b><small><i>Separation:</i> little visible distress<br><i>Reunion:</i> ignores / turns away</small><em>Avoidant avoids</em></div>
        <div class="c4"><b>Resistant / Ambivalent</b><small><i>Separation:</i> intense distress<br><i>Reunion:</i> seeks but resists soothing</small><em>Resistant resists comfort</em></div>
        <div class="c4"><b>Disorganized</b><small><i>Separation:</i> variable<br><i>Reunion:</i> contradictory, fearful, frozen</small><em>Disorganized is disoriented</em></div>
      </div>
      <div class="viz-note"><b>Your corrected rule:</b> little distress + ignoring at reunion = <b>avoidant</b>.
      Disorganized is contradictory / fearful / frozen — no coherent strategy.</div>
      <div class="viz-title" style="margin-top:14px;">Theorists</div>
      <table class="viz-table">
        <tr><td><b>John Bowlby</b></td><td>Attachment <b>theory</b> — secure base, internal working model.<small>Bowlby <b>built</b> the theory</small></td></tr>
        <tr><td><b>Mary Ainsworth</b></td><td>Strange Situation, classification.<small>Ainsworth <b>assessed</b> attachment</small></td></tr>
        <tr><td><b>Margaret Mahler</b></td><td>Separation–individuation, rapprochement.<small>Mahler <b>maps</b> separation</small></td></tr>
      </table>
    </div>`,

  theories: `
    <div class="viz">
      <div class="viz-title">Therapy theories — spot the signature word</div>
      <table class="viz-table">
        <tr><td><b>Strategic</b><small>Haley</small></td><td><span class="chip">directives</span><span class="chip">paradox</span><span class="chip">prescribe the symptom</span><span class="chip">positioning</span><em>Strategy and paradox</em></td></tr>
        <tr><td><b>Bowen</b></td><td><span class="chip">genogram</span><span class="chip">triangles</span><span class="chip">differentiation</span><span class="chip">emotional cutoff</span><em>Bloodline and triangles</em></td></tr>
        <tr><td><b>Structural</b><small>Minuchin</small></td><td><span class="chip">joining</span><span class="chip">enactment</span><span class="chip">hierarchy</span><span class="chip">boundaries</span><em>Structure and boundaries</em></td></tr>
        <tr><td><b>REBT</b><small>Ellis</small></td><td><span class="chip">ABC model</span><span class="chip">musts / shoulds</span><span class="chip">disputing</span><span class="chip">unconditional self-acceptance</span><em>Extreme expectations</em></td></tr>
        <tr><td><b>CBT</b><small>Beck</small></td><td><span class="chip">automatic thoughts</span><span class="chip">cognitive distortions</span><span class="chip">evidence testing</span><em>Automatic thoughts</em></td></tr>
        <tr><td><b>Solution‑Focused</b></td><td><span class="chip">miracle question</span><span class="chip">scaling</span><span class="chip">exceptions</span><em>Solutions, not problem history</em></td></tr>
        <tr><td><b>Narrative</b></td><td><span class="chip">externalizing</span><span class="chip">unique outcomes</span><span class="chip">re-authoring</span><em>The person is not the problem</em></td></tr>
        <tr><td><b>Psychodynamic</b></td><td><span class="chip">transference</span><span class="chip">defenses</span><span class="chip">unconscious conflict</span><em>Past patterns in the present</em></td></tr>
      </table>
    </div>`,

  meds: `
    <div class="viz">
      <div class="viz-title">Medications — home category only</div>
      <div class="medcols">
        <div class="medcol"><b>SSRIs</b><small>Depression / anxiety</small>
          <span class="chip">Prozac (fluoxetine)</span><span class="chip hot">Zoloft (sertraline)</span><span class="chip">Lexapro</span><span class="chip">Celexa</span><span class="chip">Paxil</span><span class="chip">Luvox</span></div>
        <div class="medcol"><b>Mood stabilizers</b><small>Bipolar</small>
          <span class="chip">Lithium</span><span class="chip hot">Depakote (divalproex)</span><span class="chip">Lamictal</span><span class="chip">Tegretol</span></div>
        <div class="medcol"><b>Benzodiazepines</b><small>Short-term anxiety</small>
          <span class="chip hot">Xanax (alprazolam)</span><span class="chip">Ativan</span><span class="chip">Klonopin</span><span class="chip">Valium</span><small class="tip">generics end in <b>-pam / -lam</b></small></div>
        <div class="medcol"><b>Antipsychotics</b><small>Psychosis + some mood</small>
          <span class="chip">Abilify</span><span class="chip">Risperdal</span><span class="chip">Seroquel</span><span class="chip">Zyprexa</span><span class="chip">Haldol</span><span class="chip">Clozaril</span><small class="tip">tardive dyskinesia</small></div>
        <div class="medcol"><b>Stimulants</b><small>ADHD</small>
          <span class="chip hot">Adderall</span><span class="chip">Ritalin / Concerta</span><span class="chip">Dexedrine</span></div>
      </div>
      <div class="viz-note">🔴 Your exact misses: <b>Zoloft = SSRI</b>. <b>Depakote = mood stabilizer</b>. <b>Xanax = benzo</b>. <b>Adderall = stimulant</b>.</div>
    </div>`,

  validity: `
    <div class="viz">
      <div class="viz-title">Validity — five-second recall</div>
      <table class="viz-table">
        <tr><td><b>Construct</b></td><td>Does it measure the intended <b>concept</b>?<small>Construct = concept</small></td></tr>
        <tr><td><b>Concurrent</b></td><td>Correlates with an established measure given at the <b>same time</b>?<small>Concurrent = compare now</small></td></tr>
        <tr><td><b>Predictive</b></td><td>Predicts a <b>future</b> outcome?<small>Predictive = later</small></td></tr>
        <tr><td><b>Content</b></td><td>Do items cover the full domain?<small>Content = coverage</small></td></tr>
        <tr><td><b>Internal</b></td><td>Can we conclude <b>cause and effect</b>?<small>Internal = causation</small></td></tr>
        <tr><td><b>External</b></td><td>Generalizes to other people / settings?<small>External = generalization</small></td></tr>
        <tr><td><b>Reliability</b></td><td>Consistent results?<small>Reliable = repeatable</small></td></tr>
      </table>
      <div class="viz-title" style="margin-top:14px;">Treatment stages</div>
      <table class="viz-table">
        <tr><td><b>Early</b></td><td>Engagement, rapport, assessment, contracting, goals, <b>partialization</b><small>Build the map</small></td></tr>
        <tr><td><b>Middle</b></td><td>Active change work, interventions, <b>resistance</b>, monitoring<small>Change pressure evokes resistance</small></td></tr>
        <tr><td><b>Ending</b></td><td>Review gains, termination reactions, referrals, follow-up<small>Consolidate and separate</small></td></tr>
      </table>
      <div class="viz-note">🔴 Your corrected pair: <b>partialization = early</b>. <b>Resistance = middle</b>.</div>
    </div>`,

  cleanup: `
    <div class="viz">
      <div class="viz-title">High-yield cleanup</div>
      <table class="viz-table">
        <tr><td><b>Projection</b></td><td>My unacceptable feeling → attributed to you.<small>"I feel it, but I say <b>you</b> feel it"</small></td></tr>
        <tr><td><b>Displacement</b></td><td>Emotion redirected to a safer target.<small>Boss → spouse → child</small></td></tr>
        <tr><td><b>Early remission</b></td><td>3 to &lt;12 months<small>Early = the 3–12 window</small></td></tr>
        <tr><td><b>Sustained remission</b></td><td>12+ months (craving excepted)<small>Sustained starts at 12</small></td></tr>
        <tr><td><b>Antisocial PD</b></td><td>Disregard for rights, deceit, impulsivity<small><b>Lack of remorse</b> is the giveaway</small></td></tr>
        <tr><td><b>Narcissistic PD</b></td><td>Grandiosity, entitlement, limited empathy<small>Admiration and entitlement</small></td></tr>
        <tr><td><b>Social planning</b></td><td>Forums, focus groups, community input<small>Planning <b>gathers</b></small></td></tr>
        <tr><td><b>Policy activism</b></td><td>Advocacy and pressure to change policy<small>Activism <b>acts</b></small></td></tr>
        <tr><td><b>Cultural humility</b></td><td>Ask the person/family how beliefs shape this<small>Learn from the people in the room first</small></td></tr>
      </table>
    </div>`,

  cram: `
    <div class="viz">
      <div class="viz-title">📄 The one page — screenshot this</div>
      <table class="viz-table">
        <tr><td><b>Order</b></td><td>Safety when danger is clear. Otherwise: assess → acknowledge → empower → consult/escalate.</td></tr>
        <tr><td><b>Erikson</b></td><td>Trust, Autonomy, Initiative, Industry, Identity, Intimacy, Generativity, Integrity</td></tr>
        <tr><td><b>Attachment</b></td><td>Secure settles. Avoidant avoids. Resistant resists soothing. Disorganized is disoriented.</td></tr>
        <tr><td><b>Theorists</b></td><td>Bowlby built it. Ainsworth assessed it. Mahler mapped separation.</td></tr>
        <tr><td><b>Families</b></td><td>Strategic = directives/paradox. Bowen = generations/triangles. Structural = boundaries/hierarchy.</td></tr>
        <tr><td><b>REBT vs CBT</b></td><td>REBT disputes musts/shoulds. CBT tests automatic thoughts/distortions.</td></tr>
        <tr><td><b>Meds</b></td><td>Zoloft &amp; Prozac = SSRI. Depakote &amp; lithium = mood stabilizer. Xanax = benzo. Adderall = stimulant.</td></tr>
        <tr><td><b>Validity</b></td><td>Construct=concept. Concurrent=compare now. Content=coverage. Internal=causation. External=generalization.</td></tr>
        <tr><td><b>Stages</b></td><td>Early partializes. Middle meets resistance. Ending reviews and terminates.</td></tr>
        <tr><td><b>Risk</b></td><td>Voluntary hospitalization before involuntary, when feasible and safe.</td></tr>
        <tr><td><b>Ethics</b></td><td>Avoid foreseeable conflicts. Correct internal channel. Counsel for legal process. Empower, don't take over.</td></tr>
        <tr><td><b>Other</b></td><td>Projection puts it on another. Sustained remission = 12 months. Lack of remorse = antisocial.</td></tr>
      </table>
      <div class="viz-note"><b>At the testing station:</b> write <b>SAFE C</b> and the <b>Erikson sequence</b> on your scratch material the moment you're allowed.</div>
    </div>`
};

/* Contrast pairs — the diagnosed #1 weakness: discriminating confusable concepts.
   Format: prompt shown, then the two (or three) options; user picks. */
window.SPRINT_CONTRASTS = {
  ethics: [
    { q: "A supervisee reports the supervisor made an unwanted sexual advance. Initial organizational action?", a: ["Report through the agency harassment process / HR", "Confront the supervisor privately"], correct: 0, why: "You're not required to confront a harasser across a power differential." },
    { q: "A colleague's conduct appears unethical and the situation is discussable.", a: ["Discuss directly, then internal channel if unresolved", "Report to the licensing board immediately"], correct: 0, why: "Use the least drastic appropriate channel first." },
    { q: "You receive a subpoena and aren't sure whether privilege applies.", a: ["Consult an attorney", "Release the records — a subpoena is a court order"], correct: 0, why: "A subpoena is not a court order. Never guess about privilege." },
    { q: "Client asks you to tell their spouse what they need.", a: ["Teach and rehearse strategies the client can use", "Bring the spouse in and deliver the message"], correct: 0, why: "Empower; avoid triangulation and dependence." },
    { q: "Client mentions vague anger at a coworker. No plan, no target established.", a: ["Assess the threat further", "Notify the coworker now"], correct: 0, why: "Assess before reporting when time and safety permit." },
    { q: "High suicide risk — plan, means, and history all present.", a: ["Explore voluntary hospitalization first", "Initiate involuntary hold immediately"], correct: 0, why: "Least restrictive that still keeps them safe — involuntary only if voluntary can't achieve safety." }
  ],
  erikson: [
    { q: "A 68-year-old reviews her life and asks whether it mattered.", a: ["Integrity vs. Despair", "Generativity vs. Stagnation"], correct: 0, why: "Looking BACK and evaluating = Integrity. Contributing NOW = Generativity." },
    { q: "A 45-year-old feels his work no longer contributes anything to anyone.", a: ["Generativity vs. Stagnation", "Integrity vs. Despair"], correct: 0, why: "'What am I giving?' = Generativity. Middle adulthood." },
    { q: "A 2-year-old constantly says 'no' and insists on dressing himself.", a: ["Autonomy vs. Shame and Doubt (normal)", "Initiative vs. Guilt"], correct: 0, why: "The toddler insisting on doing it himself IS autonomy — and it's developmentally normal." },
    { q: "A 9-year-old avoids schoolwork, says he's worse than everyone.", a: ["Industry vs. Inferiority", "Identity vs. Role Confusion"], correct: 0, why: "School mastery and peer comparison = Industry." },
    { q: "A 30-year-old cannot sustain any close relationship and describes deep loneliness.", a: ["Intimacy vs. Isolation", "Identity vs. Role Confusion"], correct: 0, why: "Young adult, reciprocal closeness = Intimacy." },
    { q: "A 40-year-old client cannot trust anyone at all, pervasively, since childhood.", a: ["Unresolved Trust vs. Mistrust", "Intimacy vs. Isolation"], correct: 0, why: "Match the BEHAVIOR, not the age — pervasive mistrust points back to the unresolved first stage." }
  ],
  attachment: [
    { q: "Little distress at separation; ignores and turns away at reunion.", a: ["Avoidant", "Disorganized"], correct: 0, why: "Organized turning away = avoidant. This was your miss." },
    { q: "Freezes, approaches then backs away, looks fearful of the caregiver.", a: ["Disorganized", "Avoidant"], correct: 0, why: "Contradictory / fearful / frozen with no coherent strategy = disorganized." },
    { q: "Intense distress, then seeks contact but arches away and can't be soothed.", a: ["Resistant / Ambivalent", "Secure"], correct: 0, why: "Seeks contact but resists comfort = resistant." },
    { q: "Who developed the Strange Situation classification?", a: ["Mary Ainsworth", "John Bowlby"], correct: 0, why: "Bowlby BUILT the theory; Ainsworth ASSESSED it." },
    { q: "Rapprochement and object constancy belong to whom?", a: ["Margaret Mahler", "Mary Ainsworth"], correct: 0, why: "Mahler maps separation–individuation." }
  ],
  theories: [
    { q: "Therapist gives a directive and prescribes the symptom to interrupt a pattern.", a: ["Strategic", "Bowen"], correct: 0, why: "Directives + paradox = Strategic. Bowen would ask what multigenerational process maintains it." },
    { q: "Therapist maps three generations and explores emotional cutoff and triangles.", a: ["Bowen", "Structural"], correct: 0, why: "Genogram, triangles, differentiation = Bowen." },
    { q: "Therapist realigns parental hierarchy and firms up boundaries between subsystems.", a: ["Structural", "Strategic"], correct: 0, why: "Joining, hierarchy, boundaries, enactment = Structural (Minuchin)." },
    { q: "Therapist disputes the client's rigid 'I MUST be perfect' demand.", a: ["REBT", "CBT"], correct: 0, why: "Musts/shoulds + disputation + unconditional self-acceptance = REBT (Ellis)." },
    { q: "Therapist has the client log automatic thoughts and test the evidence.", a: ["CBT", "REBT"], correct: 0, why: "Automatic thoughts, distortions, evidence testing = CBT (Beck)." },
    { q: "Therapist asks when the problem was absent and what was different then.", a: ["Solution‑Focused", "Narrative"], correct: 0, why: "Exceptions and the miracle question = Solution‑Focused." },
    { q: "Therapist helps the client describe 'the Depression' as separate from himself.", a: ["Narrative", "Psychodynamic"], correct: 0, why: "Externalizing = Narrative." }
  ],
  meds: [
    { q: "Zoloft (sertraline)", a: ["SSRI antidepressant", "Mood stabilizer"], correct: 0, why: "🔴 Your miss. Zoloft and Prozac are SSRIs." },
    { q: "Depakote (divalproex)", a: ["Mood stabilizer", "SSRI antidepressant"], correct: 0, why: "🔴 Your miss. Depakote stabilizes mood — bipolar." },
    { q: "Xanax (alprazolam)", a: ["Benzodiazepine", "Antipsychotic"], correct: 0, why: "Generics ending -pam / -lam are benzos." },
    { q: "Adderall (amphetamine salts)", a: ["Stimulant", "Mood stabilizer"], correct: 0, why: "Stimulant — ADHD." },
    { q: "Abilify (aripiprazole)", a: ["Antipsychotic", "Benzodiazepine"], correct: 0, why: "Antipsychotic; also an add-on for mood." },
    { q: "Lithium", a: ["Mood stabilizer", "SSRI"], correct: 0, why: "The original mood stabilizer." },
    { q: "Lamictal (lamotrigine)", a: ["Mood stabilizer", "Stimulant"], correct: 0, why: "Mood stabilizer — watch Stevens-Johnson rash." },
    { q: "Risperdal (risperidone)", a: ["Antipsychotic", "SSRI"], correct: 0, why: "Antipsychotic — tardive dyskinesia risk with long-term use." }
  ],
  validity: [
    { q: "Does this new resilience scale actually measure resilience?", a: ["Construct validity", "Concurrent validity"], correct: 0, why: "🔴 Construct = concept." },
    { q: "New depression scale given at the same time as an established one; do they correlate?", a: ["Concurrent validity", "Predictive validity"], correct: 0, why: "Concurrent = compare NOW. Predictive = predicts LATER." },
    { q: "Do the findings generalize to other populations and settings?", a: ["External validity", "Internal validity"], correct: 0, why: "External = generalization. Internal = causation confidence." },
    { q: "Breaking an overwhelming problem into smaller manageable pieces.", a: ["Early stage (partialization)", "Middle stage"], correct: 0, why: "🔴 Your miss. Partialization = early." },
    { q: "Client pushes back as change pressure increases.", a: ["Middle stage (resistance)", "Early stage"], correct: 0, why: "Resistance lives in the middle stage." }
  ],
  cleanup: [
    { q: "A man furious at his boss goes home and yells at his kids.", a: ["Displacement", "Projection"], correct: 0, why: "Emotion moved to a safer target = displacement." },
    { q: "A woman attracted to a coworker accuses her partner of flirting.", a: ["Projection", "Displacement"], correct: 0, why: "'I feel it but I say YOU feel it' = projection." },
    { q: "14 months without meeting criteria (craving aside).", a: ["Sustained remission", "Early remission"], correct: 0, why: "Sustained starts at 12 months." },
    { q: "5 months without meeting criteria.", a: ["Early remission", "Sustained remission"], correct: 0, why: "Early = the 3–12 month window." },
    { q: "Repeated deceit, impulsivity, and no remorse whatsoever.", a: ["Antisocial PD", "Narcissistic PD"], correct: 0, why: "Lack of remorse is the giveaway." },
    { q: "Community forums and focus groups to design a response.", a: ["Social planning", "Policy activism"], correct: 0, why: "Planning gathers; activism acts." }
  ]
};

/* Recall prompts — blank-page reconstruction (generation effect). */
window.SPRINT_RECALL = {
  safec: { prompt: "Write the SAFE C ladder from memory — all five rungs and what each one asks.", answer: "S — Safety: imminent danger, abuse, medical instability? Protect life first.\nA — Assess: information missing? Clarify before reporting/diagnosing/referring/confronting.\nF — Feelings: distressed or guarded? Acknowledge, validate, start where they are.\nE — Empower: can they act for themselves? Teach; preserve self-determination.\nC — Consult/channel: needs expertise, legal advice, supervision, HR? Least drastic appropriate channel." },
  erikson: { prompt: "Write all 8 Erikson stages in order. Then write the one-line difference between Generativity and Integrity.", answer: "1 Trust vs. Mistrust (0–1)\n2 Autonomy vs. Shame & Doubt (1–3)\n3 Initiative vs. Guilt (3–6)\n4 Industry vs. Inferiority (6–12)\n5 Identity vs. Role Confusion (adolescence)\n6 Intimacy vs. Isolation (young adult)\n7 Generativity vs. Stagnation (middle adult)\n8 Integrity vs. Despair (older adult)\n\nGenerativity = what am I contributing NOW. Integrity = looking BACK, was my life worthwhile." },
  attachment: { prompt: "Write the 4 attachment styles with separation + reunion behavior. Then: Bowlby vs. Ainsworth vs. Mahler.", answer: "Secure — distress possible at separation; seeks and IS comforted at reunion. (Secure settles)\nAvoidant — little distress; ignores/turns away at reunion. (Avoidant avoids)\nResistant/Ambivalent — intense distress; seeks contact but resists soothing. (Resistant resists comfort)\nDisorganized — variable; contradictory, fearful, frozen, no coherent strategy. (Disorganized is disoriented)\n\nBowlby BUILT attachment theory. Ainsworth ASSESSED it (Strange Situation). Mahler MAPPED separation–individuation." },
  theories: { prompt: "Write the signature words for Strategic, Bowen, Structural, REBT, and CBT.", answer: "Strategic (Haley) — directives, paradox, prescribing the symptom, positioning\nBowen — genogram, triangles, differentiation, emotional cutoff, multigenerational\nStructural (Minuchin) — joining, enactment, hierarchy, subsystems, boundaries\nREBT (Ellis) — ABC model, musts/shoulds, disputing, unconditional self-acceptance\nCBT (Beck) — automatic thoughts, cognitive distortions, evidence testing, experiments" },
  meds: { prompt: "Sort from memory: Zoloft, Depakote, Xanax, Adderall, Abilify, Lithium, Prozac, Risperdal.", answer: "Zoloft — SSRI\nDepakote — mood stabilizer\nXanax — benzodiazepine\nAdderall — stimulant\nAbilify — antipsychotic\nLithium — mood stabilizer\nProzac — SSRI\nRisperdal — antipsychotic" },
  validity: { prompt: "Define construct, concurrent, predictive, internal, external validity — one line each. Then the 3 treatment stages.", answer: "Construct — does it measure the intended concept?\nConcurrent — correlates with an established measure given at the same time?\nPredictive — predicts a future outcome?\nInternal — can we conclude cause and effect?\nExternal — do findings generalize?\n\nEarly — engagement, assessment, contracting, goals, PARTIALIZATION\nMiddle — active change, interventions, RESISTANCE, monitoring\nEnding — review gains, termination reactions, referrals, follow-up" },
  cleanup: { prompt: "Projection vs. displacement. Early vs. sustained remission. The antisocial giveaway. Planning vs. activism.", answer: "Projection — my unacceptable feeling attributed to you ('I feel it but I say YOU feel it')\nDisplacement — emotion redirected to a safer target (boss → spouse → child)\nEarly remission — 3 to <12 months. Sustained remission — 12+ months (craving excepted)\nAntisocial PD — lack of remorse is the giveaway\nSocial planning GATHERS (forums, focus groups); policy activism ACTS (advocacy, pressure)" },
  everything: { prompt: "Closed-book reconstruction: write every cheat sheet you can from memory — SAFE C, Erikson, attachment, theories, meds, validity, stages, cleanup. Don't peek. Whatever you can't produce is tomorrow's only study list.", answer: "Compare against the one-page cram sheet in the next step. Anything you couldn't write is your remaining gap — everything else is done." }
};

/* The blocks. `mins` is the packet's time-box; `match` selects real questions
   from the loaded banks for the drill step. */
window.SPRINT_PLAN = {
  title: "Two-Day Pass Plan",
  source: "Built from your personalized packet (July 2026) — the questions you actually missed.",
  priorities: [
    { label: "Ethics & action sequencing", pct: 35, why: "Highest point-recovery potential" },
    { label: "Development, attachment, theorists", pct: 25, why: "Largest recall cluster" },
    { label: "Therapy theories", pct: 15, why: "Signature-word discrimination" },
    { label: "Medication categories", pct: 10, why: "Fast memorization points" },
    { label: "Validity & treatment stages", pct: 10, why: "Highly drillable definitions" },
    { label: "Single-concept cleanup", pct: 5, why: "Remission, defenses, personality, macro" }
  ],
  phases: [
    {
      id: "repair", title: "Repair the rules and distinctions", subtitle: "Day 1",
      blocks: [
        { id: "b1", icon: "⚖️", title: "Ethics & Sequencing", mins: 90, tag: "35% of your recovery points",
          why: "Your misses here weren't knowledge — they were acting too early, too restrictively, or through the wrong channel. This block is worth more than any other.",
          steps: [
            { type: "learn", title: "The SAFE C decision ladder", visual: "safec" },
            { type: "learn", title: "Qualifier rules", visual: "qualifiers" },
            { type: "contrast", title: "Ethics contrast drill", set: "ethics" },
            { type: "learn", title: "Your ethics situations", visual: "ethics" },
            { type: "recall", title: "Write SAFE C from memory", set: "safec" },
            { type: "drill", title: "25 FIRST / NEXT / BEST questions", n: 25, match: { strategies: ["qualifier-reading", "ethics-threshold", "assess-first", "least-intrusive"] } }
          ] },
        { id: "b2", icon: "🌱", title: "Erikson & Attachment", mins: 75, tag: "25% — largest recall cluster",
          why: "Four direct misses on Erikson. The fix is matching behavior before age, and separating Generativity from Integrity.",
          steps: [
            { type: "learn", title: "The Erikson staircase", visual: "erikson" },
            { type: "contrast", title: "Stage recognition drill", set: "erikson" },
            { type: "learn", title: "Attachment + theorists", visual: "attachment" },
            { type: "contrast", title: "Attachment contrast drill", set: "attachment" },
            { type: "recall", title: "Write all 8 stages from memory", set: "erikson" },
            { type: "recall", title: "Write the 4 attachment styles", set: "attachment" },
            { type: "drill", title: "20 development & attachment questions", n: 20, match: { topics: ["Developmental Stages", "Attachment", "Theorist ID", "Human Behavior"] } }
          ] },
        { id: "b3", icon: "🛋️", title: "Therapy Theories", mins: 60, tag: "15% — signature words",
          why: "Two direct misses: Strategic vs. Bowen, and REBT vs. CBT. These are won by spotting one signature word.",
          steps: [
            { type: "learn", title: "Signature words by theory", visual: "theories" },
            { type: "contrast", title: "Theory recognition drill", set: "theories" },
            { type: "recall", title: "Write the signature words", set: "theories" },
            { type: "drill", title: "Therapy theory questions", n: 18, match: { topics: ["Therapy Theories"] } }
          ] },
        { id: "b4", icon: "💊", title: "Medication Categories", mins: 45, tag: "10% — fastest points on the board",
          why: "Two direct misses (Zoloft, Depakote). Pure recognition — the cheapest points you can recover today.",
          steps: [
            { type: "learn", title: "The five categories", visual: "meds" },
            { type: "contrast", title: "Rapid sorting drill", set: "meds" },
            { type: "recall", title: "Sort 8 drugs from memory", set: "meds" },
            { type: "drill", title: "Medication questions", n: 15, match: { banks: ["medications"], topics: ["Medications"] } }
          ] },
        { id: "b5", icon: "📏", title: "Validity & Treatment Stages", mins: 45, tag: "10% — five-second definitions",
          why: "Construct vs. concurrent, and partialization vs. resistance. These should be reflexes, not deductions.",
          steps: [
            { type: "learn", title: "Validity + stages", visual: "validity" },
            { type: "contrast", title: "Definition speed drill", set: "validity" },
            { type: "recall", title: "Define all five validities", set: "validity" },
            { type: "drill", title: "Research & treatment-planning questions", n: 15, match: { topics: ["Research", "Treatment Planning"] } }
          ] },
        { id: "b6", icon: "🎯", title: "Mixed Timed Set", mins: 60, tag: "Interleaved — like the real thing",
          why: "Now mix it all together. No checking answers until the end — that's the point.",
          steps: [
            { type: "drill", title: "45 mixed questions, exam conditions", n: 45, exam: true, match: { all: true } }
          ] }
      ]
    },
    {
      id: "simulate", title: "Simulate, diagnose, consolidate", subtitle: "Day 2",
      blocks: [
        { id: "b7", icon: "🏁", title: "Morning Timed Set", mins: 75, tag: "Commit, flag, continue",
          why: "Full exam conditions. Do not stop to research anything during the set — that's the discipline being trained.",
          steps: [
            { type: "drill", title: "70 questions, exam conditions", n: 70, exam: true, match: { all: true } }
          ] },
        { id: "b8", icon: "🔍", title: "Error Review", mins: 60, tag: "The highest-value hour of the sprint",
          why: "Classify every miss: knowledge gap, term confusion, missed qualifier, or sequencing. Naming the error type is what stops it repeating.",
          steps: [
            { type: "action", title: "Review your misses with the 5-step method", body: "For each question you missed:<br><b>1.</b> Name the controlling fact in the stem.<br><b>2.</b> Identify the qualifier (FIRST / NEXT / BEST / MOST / EXCEPT).<br><b>3.</b> Say why yours was wrong: <i>too early, too late, too restrictive, or wrong concept</i>.<br><b>4.</b> Write one sentence distinguishing the right answer from the strongest distractor.<br><b>5.</b> Answer a new question on the same distinction within 10 minutes.", action: "App.missed()", actionLabel: "Open my missed questions" },
            { type: "drill", title: "Re-test the same distinctions", n: 20, match: { missed: true } }
          ] },
        { id: "b9", icon: "📝", title: "Closed-Book Reconstruction", mins: 60, tag: "Whatever you can't write is your gap",
          why: "Reproduce every sheet from memory. This both tests and strengthens — and it produces your final study list automatically.",
          steps: [
            { type: "recall", title: "Reconstruct everything", set: "everything" },
            { type: "learn", title: "Now check against the one-pager", visual: "cram" }
          ] },
        { id: "b10", icon: "🧹", title: "High-Yield Cleanup", mins: 45, tag: "5% — easy points still on the table",
          why: "Projection vs. displacement, remission windows, the antisocial giveaway, planning vs. activism.",
          steps: [
            { type: "learn", title: "The cleanup list", visual: "cleanup" },
            { type: "contrast", title: "Cleanup contrast drill", set: "cleanup" },
            { type: "recall", title: "Write the distinctions", set: "cleanup" },
            { type: "drill", title: "Mixed cleanup questions", n: 15, match: { topics: ["Defense Mechanisms", "Personality Disorders", "Substance", "Macro Practice", "Diversity"] } }
          ] }
      ]
    },
    {
      id: "taper", title: "Taper and walk in ready", subtitle: "Final day",
      blocks: [
        { id: "b11", icon: "📄", title: "One-Page Review", mins: 20, tag: "Light — this is a taper, not a cram",
          why: "Read it once. Screenshot it. You are consolidating, not learning new material.",
          steps: [
            { type: "learn", title: "The night-before page", visual: "cram" },
            { type: "contrast", title: "Final confidence check", set: "meds" }
          ] },
        { id: "b12", icon: "✅", title: "Logistics & Exam-Day Plan", mins: 15, tag: "Remove every decision from exam morning",
          why: "Decision fatigue is real and you don't need any of it on Saturday. Decide it all now.",
          steps: [
            { type: "checklist", title: "Set it up tonight", items: [
              "ID ready (name matches registration exactly)",
              "Route planned + travel time doubled; arrive 30 min early",
              "Clothes out, layers (testing rooms run cold)",
              "Water + a protein-heavy snack packed for the break",
              "Alarm set — and a backup alarm",
              "Know your break plan: at the section split, stand up, walk, water",
              "First move at the station: write SAFE C + the Erikson sequence on scratch material",
              "Phone/notifications handled so nothing pulls at you tomorrow"
            ] }
          ] },
        { id: "b13", icon: "😴", title: "Stop. Sleep.", mins: 5, tag: "This is a study task, not a break from one",
          why: "Sleep is when today's work consolidates. On a reasoning-heavy exam, an extra hour of cramming costs more than it gains.",
          steps: [
            { type: "action", title: "Close the books", body: "You've done the work. Nothing new tonight.<br><br>Tomorrow morning: <b>brisk 10-minute walk</b>, protein breakfast, arrive early. When the adrenaline hits in the testing center, name it: <i>that's my body getting ready to perform.</i><br><br>Then read the last sentence of each question first, circle the qualifier, and trust the ladder.", action: null }
          ] }
      ]
    }
  ]
};
