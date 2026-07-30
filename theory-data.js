/* Theory Trainer data — sourced from TDC Quick Studies:
   "Developmental Stages" (LCSW_CE_Developmental-Stages_02_23.pdf)
   "Therapy Theories" (LCSW_CE_Therapy-Theories_02_23.pdf)
   plus the Theory Recognition Guide (Kohlberg, Bronfenbrenner, Maslow,
   Tuckman, Stages of Change, Ainsworth, theorist roster, mnemonics). */

window.DEV_FRAMEWORKS = [
  {
    id: "erikson", name: "Erikson — Psychosocial Stages", theorist: "Erik Erikson",
    note: "8 stages, each a psychosocial task. Mnemonic: 'Trust and autonomy initiate industry. Identity and intimacy generate integrity.' Key exam trick: a person hasn't 'failed' a stage until they reach the END of its age range — a 38-year-old cannot have failed Intimacy vs. Isolation yet. Erikson asks: what emotional-social conflict occurs at this stage?",
    stages: [
      {name:"Trust vs. Mistrust", age:"0–18 months", desc:"'Can I trust you?' Basic trust develops through the infant–caregiver relationship; foundation for all later stages. Failure → pervasive mistrust OR rigid, unthinking adulation of others."},
      {name:"Autonomy vs. Shame & Doubt", age:"18 months–3 years", desc:"'Can I do things myself?' Toddler achieves independence over their own body (walking, exploring). Overcontrol → doubt of own abilities and excessive shame."},
      {name:"Initiative vs. Guilt", age:"3–6 years", desc:"'Can I start things?' Set goals and carry out plans without infringing on others' rights. Overstepping brings adult disapproval → guilt that inhibits future goal-setting."},
      {name:"Industry vs. Inferiority", age:"6–12 years", desc:"'Can I accomplish things competently?' Competence through school and doing things independently; peer group boosts self-esteem. Unsupported initiative → sense of inferiority."},
      {name:"Identity vs. Role Confusion", age:"12–18 years", desc:"'Who am I?' Learn adult roles while forming personal identity; peers help explore identities. Success → fidelity. Failure → role confusion, weakened sense of self."},
      {name:"Intimacy vs. Isolation", age:"18–40 years", desc:"'Can I form a close relationship?' Form committed intimate relationships. Failure → isolation, loneliness, feeling of exclusion."},
      {name:"Generativity vs. Stagnation", age:"40–65 years", desc:"'What can I contribute?' Sense of purpose via career, raising children, benefiting others. Failure → uselessness, little connection, rejection."},
      {name:"Ego Integrity vs. Despair", age:"65–death", desc:"'Was my life worthwhile?' Look back with fulfillment; wisdom to accept successes, failures, aging, loss. Regret → despair, guilt, depression/hopelessness."}
    ]
  },
  {
    id: "piaget", name: "Piaget — Cognitive Development", theorist: "Jean Piaget",
    note: "Mnemonics: 'Senses, Pretend, Concrete, Future' or 'Some People Can Fly.' Development is driven by disequilibrium, resolved through assimilation (fit new info into existing schemas) + accommodation (modify schemas) → adaptation. Piaget asks: HOW is this person capable of thinking?",
    stages: [
      {name:"Sensorimotor", age:"birth–2 years", desc:"Learning through senses and action. Three achievements: object permanence (hidden toy still exists), causality (my hand can move the toy), symbolic thought (words stand for objects)."},
      {name:"Preoperational", age:"2–7 years", desc:"Symbolic function — pretend play, mental images, language; egocentrism and magical thinking; does NOT yet understand conservation."},
      {name:"Concrete Operational", age:"7–11 years", desc:"Mental operations using logic on concrete information; CONSERVATION understood (amount unchanged when shape changes); classification and problem-solving."},
      {name:"Formal Operational", age:"11+ years", desc:"Abstract, hypothetical, relativistic thinking; competing hypotheses and strategies to test them; 'thinking about thinking'; some return of egocentrism."}
    ]
  },
  {
    id: "freud", name: "Freud — Psychosexual Stages", theorist: "Sigmund Freud",
    note: "Mnemonic: 'Old Adults Prefer Long Games.' Id = basic pleasure-seeking drives; Ego = mediates id and reality; Superego = internalized cultural rules (from parents). Freud asks: WHERE is psychological energy focused?",
    stages: [
      {name:"Oral", age:"birth–1 year", desc:"World engaged through the mouth — tasting, sucking, feeding, dependency."},
      {name:"Anal", age:"1–3 years", desc:"Libido focused on bladder/bowel control; toilet training central. Too much pressure → anal retentive (excessive order/cleanliness); too little → anal expulsive (messy, destructive)."},
      {name:"Phallic", age:"3–6 years", desc:"Id's energy focused on the genitals; children become aware of gender identity; identification."},
      {name:"Latent", age:"6–puberty", desc:"Sexual feelings dormant (quiet period); social skills, values, school, and peer/adult relationships outside the family develop."},
      {name:"Genital", age:"puberty–adult", desc:"Libido active again; mature sexuality and relationships; successful prior development → well-balanced person."}
    ]
  },
  {
    id: "mahler", name: "Mahler — Object Relations / Separation-Individuation", theorist: "Margaret Mahler",
    note: "Mnemonic: 'A Symbiotic Baby Separates: Differentiates, Practices, Returns, Owns' — Returns = rapprochement (toddler returns for emotional refueling); Owns = object constancy (stable internal image of caregiver). Mahler asks: how does an infant develop a separate psychological identity?",
    stages: [
      {name:"Autistic (Normal Autistic)", age:"newborn–1 month", desc:"Infant focused purely on self; unresponsive to external stimuli."},
      {name:"Symbiotic", age:"1–5 months", desc:"Infant perceives the 'need-satisfying object'; mother's ego functions for the infant; begins to sense mother is separate."},
      {name:"Separation-Individuation", age:"5–24+ months", desc:"Separation = understanding boundaries of self, seeing mother as separate. Individuation = developing a sense of self. Has 4 substages."},
      {name:"— Differentiation substage", age:"5–9 months", desc:"Attention shifts from inward to outward (e.g., crawling)."},
      {name:"— Practicing substage", age:"9–14 months", desc:"Continued separation; autonomous ego functions more apparent (walking, playing)."},
      {name:"— Rapprochement substage", age:"14–24 months", desc:"Wants to act independently — moves away from mother but regularly RETURNS to make sure she's still there (emotional refueling)."},
      {name:"— Object Constancy substage", age:"after 24 months", desc:"Internalizes mother; understands she still exists for them despite her absence."}
    ]
  },
  {
    id: "kohlberg", name: "Kohlberg — Moral Development", theorist: "Lawrence Kohlberg", noAge: true,
    note: "Levels mnemonic: 'Me, We, Principles.' Stages mnemonic: 'Punishment, Payoff, Pleasing, Police, Pact, Principles.' Kohlberg asks how a person REASONS about morality — not whether the final decision is right.",
    stages: [
      {name:"Stage 1: Punishment & Obedience", age:"Preconventional — 'Me'", desc:"Follows rules primarily to avoid punishment. Main concern: what will happen to me?"},
      {name:"Stage 2: Self-Interest & Exchange", age:"Preconventional — 'Me'", desc:"Choices based on personal benefit, reward, or exchange ('Payoff' — what's in it for me?)."},
      {name:"Stage 3: Interpersonal Approval", age:"Conventional — 'We'", desc:"Wants to be seen as good, helpful, acceptable to others ('Pleasing'). Concern: what will others think?"},
      {name:"Stage 4: Law & Order", age:"Conventional — 'We'", desc:"Follows laws and rules to preserve social order ('Police')."},
      {name:"Stage 5: Social Contract", age:"Postconventional — 'Principles'", desc:"Laws should protect rights and may need to change ('Pact')."},
      {name:"Stage 6: Universal Ethical Principles", age:"Postconventional — 'Principles'", desc:"Follows internal ethical principles even when they conflict with laws."}
    ]
  },
  {
    id: "bronfenbrenner", name: "Bronfenbrenner — Ecological Systems", theorist: "Urie Bronfenbrenner", noAge: true,
    note: "Asks: at what environmental LEVEL is the influence occurring? Contrast with general systems theory ('how do parts affect one another?') and person-in-environment ('how does THIS person's fit with THIS environment affect functioning?').",
    stages: [
      {name:"Microsystem", age:"'Micro meets me'", desc:"Settings and people the person interacts with DIRECTLY: family, friends, school, work, therapist, peers."},
      {name:"Mesosystem", age:"'Meso mixes my micros'", desc:"Relationships BETWEEN two or more microsystems: parent–teacher communication, therapist–physician coordination."},
      {name:"Exosystem", age:"'Exo excludes me'", desc:"The person does NOT participate in the setting, but it still affects them: a parent's workplace affecting the child, an agency policy affecting a client."},
      {name:"Macrosystem", age:"'Macro means culture'", desc:"Cultural values, laws, policies, economic systems, racism, social norms, societal beliefs."},
      {name:"Chronosystem", age:"'Chrono changes over time'", desc:"Historical events, life transitions, developmental changes, and the timing of important events."}
    ]
  },
  {
    id: "maslow", name: "Maslow — Hierarchy of Needs", theorist: "Abraham Maslow", noAge: true,
    note: "A basic survival or safety need normally takes priority over a higher-level growth need — on the exam, meet the lower need first.",
    stages: [
      {name:"1. Physiological Needs", age:"base of the pyramid", desc:"Food, water, sleep, shelter — survival itself. Address before anything above."},
      {name:"2. Safety Needs", age:"second level", desc:"Physical safety, stability, security, freedom from fear."},
      {name:"3. Love & Belonging", age:"third level", desc:"Relationships, connection, acceptance, group membership."},
      {name:"4. Esteem", age:"fourth level", desc:"Respect, recognition, competence, self-worth."},
      {name:"5. Self-Actualization", age:"top of the pyramid", desc:"Reaching one's fullest potential — a growth need, last in priority when basic needs are unmet."}
    ]
  },
  {
    id: "changestages", name: "Prochaska & DiClemente — Stages of Change", theorist: "Prochaska & DiClemente", noAge: true,
    note: "Asks: how READY is the client to change? Match the clinical approach to the stage — pushing action on a precontemplative client is the classic exam trap.",
    stages: [
      {name:"Precontemplation", age:"not considering change", desc:"Client doesn't recognize a problem. Approach: raise awareness, explore concerns, do NOT argue."},
      {name:"Contemplation", age:"ambivalent", desc:"Recognizes the problem but feels torn ('I know it's a problem, but I'm not ready'). Approach: explore ambivalence, costs, benefits, values."},
      {name:"Preparation", age:"intends to act", desc:"Planning to act soon; may take small initial steps. Approach: help develop a specific, achievable plan."},
      {name:"Action", age:"actively changing", desc:"Actively changing behavior. Approach: support the plan, strengthen coping skills."},
      {name:"Maintenance", age:"sustaining change", desc:"Working to sustain change and prevent recurrence. Approach: reinforce progress, plan for high-risk situations."},
      {name:"Relapse", age:"return to behavior", desc:"Returns to the earlier behavior. Approach: no judgment, identify triggers, help re-enter the change process."}
    ]
  },
  {
    id: "tuckman", name: "Tuckman — Group Development", theorist: "Bruce Tuckman", noAge: true,
    note: "Forming → Storming → Norming → Performing → Adjourning. Asks: what developmental stage is the GROUP in?",
    stages: [
      {name:"Forming", age:"stage 1", desc:"Members cautious, polite, dependent on the leader, uncertain about expectations."},
      {name:"Storming", age:"stage 2", desc:"Conflict, competition, resistance, challenges to leadership emerge."},
      {name:"Norming", age:"stage 3", desc:"Cohesion, roles, expectations, and trust are established."},
      {name:"Performing", age:"stage 4", desc:"The group works effectively toward its goals."},
      {name:"Adjourning", age:"stage 5", desc:"The group prepares for termination and processes reactions to ending."}
    ]
  }
];

/* Adult attachment styles (TDC Therapy Theories quick study) */
window.ATTACHMENT_TYPES = [
  {name:"Secure", desc:"Easy access to a wide range of feelings and memories, positive and negative; balanced view of parents; worked through past hurt/anger; strong sense of self and empathy."},
  {name:"Preoccupied / Anxious", desc:"Still overwhelmed by anger and hurt toward caregivers; values intimacy to the point of over-dependence; recalls role reversal in childhood; fears abandonment."},
  {name:"Dismissive / Avoidant", desc:"Dismisses the importance of love, connection, and emotions generally; idealizes caregivers but memories don't corroborate; very independent; difficulty tolerating others' emotions."},
  {name:"Fearful / Avoidant", desc:"Usually a history of trauma or loss; dismisses love/connection out of fear of unworthiness; difficulty trusting; uncomfortable with emotional closeness."}
];

/* Child attachment classifications — Ainsworth's Strange Situation (mnemonic: SAAD).
   Bowlby = attachment THEORY; Ainsworth = Strange Situation RESEARCH + classification. */
window.CHILD_ATTACHMENT = [
  {name:"Secure", desc:"May become distressed when the caregiver leaves but is COMFORTED when the caregiver returns; uses the caregiver as a secure base."},
  {name:"Avoidant", desc:"Avoids or ignores the caregiver; shows little visible distress during separation or reunion."},
  {name:"Ambivalent / Resistant", desc:"Seeks contact but is angry, resistant, clingy, or difficult to soothe after the caregiver returns."},
  {name:"Disorganized", desc:"Contradictory, confused, fearful, frozen, or disoriented behavior — often associated with a frightening or unpredictable caregiver."}
];

/* Theorist roster for the "Who's the theorist?" drill.
   Mnemonic: "Pavlov pairs. Skinner shapes. Bandura models." */
window.THEORISTS = [
  {name:"Erik Erikson", theory:"Psychosocial development", q:"What emotional and social conflict occurs at this stage of life?", clues:["trust vs. mistrust","identity vs. role confusion","generativity","eight psychosocial stages"]},
  {name:"Jean Piaget", theory:"Cognitive development", q:"How is this person capable of thinking?", clues:["object permanence","egocentrism and magical thinking","conservation","abstract reasoning develops last"]},
  {name:"Lawrence Kohlberg", theory:"Moral development", q:"How does this person decide what is morally right?", clues:["punishment vs. self-interest reasoning","law and order stage","social contract","universal ethical principles"]},
  {name:"Sigmund Freud", theory:"Psychosexual development", q:"Where is psychological energy focused during development?", clues:["oral, anal, phallic, latency, genital","id, ego, superego","toilet training and control"]},
  {name:"Margaret Mahler", theory:"Separation-individuation (object relations)", q:"How does an infant develop a separate psychological identity from the caregiver?", clues:["symbiosis","rapprochement — returning for emotional refueling","object constancy"]},
  {name:"John Bowlby", theory:"Attachment theory", q:"How does a child form and maintain an emotional attachment to a caregiver?", clues:["attachment bond","separation distress","secure base","internal working model"]},
  {name:"Mary Ainsworth", theory:"Attachment research & classification", q:"How does a child respond to separation from and reunion with a caregiver?", clues:["the Strange Situation","secure / avoidant / resistant / disorganized classification"]},
  {name:"Urie Bronfenbrenner", theory:"Ecological systems theory", q:"At what environmental level is the influence occurring?", clues:["microsystem, mesosystem, exosystem","macrosystem and chronosystem","nested environmental levels"]},
  {name:"Ludwig von Bertalanffy", theory:"General systems theory", q:"How do interconnected parts of a system affect one another?", clues:["feedback loops and boundaries","homeostasis","equifinality","open and closed systems"]},
  {name:"Albert Bandura", theory:"Social learning theory", q:"What behavior was learned through observing or modeling another person?", clues:["modeling and imitation","observational learning","self-efficacy"]},
  {name:"Ivan Pavlov", theory:"Classical conditioning", q:"What two stimuli became associated?", clues:["conditioned stimulus and response","association of stimuli","'Pavlov pairs'"]},
  {name:"B. F. Skinner", theory:"Operant conditioning", q:"How are consequences increasing or decreasing a behavior?", clues:["reinforcement and punishment","shaping","'Skinner shapes'"]},
  {name:"Abraham Maslow", theory:"Hierarchy of needs", q:"Which basic needs require attention before higher-level growth needs?", clues:["physiological and safety needs first","self-actualization at the top"]},
  {name:"Prochaska & DiClemente", theory:"Stages of change", q:"How ready is the client to change?", clues:["precontemplation and contemplation","preparation, action, maintenance","relapse as part of the cycle"]},
  {name:"Bruce Tuckman", theory:"Group development", q:"What developmental stage is the group experiencing?", clues:["forming, storming, norming","performing and adjourning"]},
  {name:"Murray Bowen", theory:"Bowen family systems therapy", q:"How do multigenerational patterns shape this family?", clues:["differentiation of self","triangles","emotional cutoff","genograms"]},
  {name:"Salvador Minuchin", theory:"Structural family therapy", q:"How is this family's structure organized?", clues:["boundaries and hierarchy","enmeshment and disengagement","subsystems","joining"]},
  {name:"Jay Haley", theory:"Strategic family therapy", q:"What problem-maintaining interaction needs interrupting?", clues:["directives","paradoxical interventions","power and communication patterns"]},
  {name:"Aaron Beck", theory:"Cognitive therapy", q:"What automatic thoughts and distortions drive the problem?", clues:["automatic thoughts","cognitive distortions","schemas","negative cognitive triad"]},
  {name:"Albert Ellis", theory:"Rational emotive behavior therapy", q:"What irrational belief connects the event to the consequence?", clues:["ABC model (Activating event, Belief, Consequence)","disputing irrational beliefs","unconditional self-acceptance"]},
  {name:"Carl Rogers", theory:"Person-centered therapy", q:"Are the core conditions for growth present?", clues:["unconditional positive regard","congruence/genuineness","empathy","non-directive stance"]},
  {name:"Steve de Shazer & Insoo Kim Berg", theory:"Solution-focused therapy", q:"What does the preferred future look like?", clues:["miracle question","exceptions","scaling questions"]},
  {name:"Michael White & David Epston", theory:"Narrative therapy", q:"How can the problem be separated from the person?", clues:["externalizing the problem","unique outcomes","re-authoring the story"]}
];

/* Therapy theories: how change occurs + signature concepts. Now with theorists. */
window.THERAPIES = [
  {name:"Trauma-Informed Therapy", change:"Integrating the impact of trauma into every aspect of treatment; safety must be established before trauma work begins", concepts:["safety first — no trauma treatment while trauma is actively occurring","client regaining control and empowerment","psychological + neurological + interpersonal effects of trauma"], goodFor:"any client affected by trauma"},
  {name:"EMDR", change:"Reprocessing traumatic memories during bilateral stimulation / controlled eye movements", concepts:["bilateral stimulation","highly structured 8-step protocol","recalling distressing images while tracking eye movements","desensitization techniques"], goodFor:"trauma with lasting emotional impact"},
  {name:"TF-CBT", change:"Three stages — stabilization, trauma narrative, integration/consolidation — with caregivers involved", concepts:["trauma narrative","stabilization skills","joint parent-child sessions","8–25 sessions"], goodFor:"children and adolescents affected by trauma"},
  {name:"Prolonged Exposure Therapy", change:"Gradually approaching trauma-related memories, feelings, and avoided situations", concepts:["imaginal exposure (retelling the trauma memory)","in-vivo exposure"], goodFor:"PTSD (evidence-based)"},
  {name:"Behavioral Therapy", theorist:"B. F. Skinner (operant) / Ivan Pavlov (classical)", change:"Reinforcement (increases behavior) and punishment (decreases behavior)", concepts:["positive reinforcement — ADD something rewarding","negative reinforcement — REMOVE something aversive","positive punishment — ADD something aversive","negative punishment — REMOVE something desired","token economy (contingency management)","shaping — reinforcing closer approximations"], goodFor:"children with behavioral problems. Mnemonic: 'Pavlov pairs. Skinner shapes. Bandura models.'"},
  {name:"Cognitive Therapy", theorist:"Aaron Beck", change:"Learning to modify dysfunctional thought patterns", concepts:["automatic thoughts","schemas","cognitive distortions","link between thoughts and feelings"], goodFor:"anxiety and depression"},
  {name:"CBT", theorist:"Aaron Beck (foundations)", change:"Modifying dysfunctional thoughts → shift in emotions → change in behavior", concepts:["negative cognitive triad (self, world, future)","thought record","cognitive restructuring","reframing","collaborative teacher + homework"], goodFor:"anxiety, depression; structured, short-term"},
  {name:"DBT", theorist:"Marsha Linehan", change:"Mindfulness plus skills for distress tolerance, emotion regulation, and interpersonal effectiveness", concepts:["four modules: mindfulness, distress tolerance, interpersonal effectiveness, emotion regulation","wise mind (balance reason + emotion)","coaching calls between sessions","accepting uncomfortable feelings"], goodFor:"Borderline Personality Disorder (evidence-based); chronic SI/self-injury, eating disorders, SUD"},
  {name:"REBT", theorist:"Albert Ellis", change:"Replacing self-defeating rigid thoughts and behaviors with ones that serve the client's goals", concepts:["ABC model: Activating event → Belief → Consequence","disputing irrational beliefs","unconditional self-acceptance","looks at WHY people jump to conclusions, not just the distortion"], goodFor:"depression, anxiety, substance use, life goals"},
  {name:"Exposure Therapies", change:"Exposure to the feared object/situation in a safe environment", concepts:["systematic desensitization — progressive exposure + relaxation skills (phobias)"], goodFor:"phobias, PTSD, social anxiety, GAD"},
  {name:"Attachment Theory", theorist:"John Bowlby (theory) / Mary Ainsworth (Strange Situation)", change:"Understanding how early caregiver attachment shapes long-term functioning", concepts:["caregiver response to cues shapes the child's view of the world","secure base and internal working model","observing child's response when caregiver leaves and returns","secure / avoidant / ambivalent-resistant / disorganized (child), secure / preoccupied / dismissive / fearful (adult)"], goodFor:"assessing caregiver–child bond"},
  {name:"Structural Family Therapy", theorist:"Salvador Minuchin", change:"Remodeling the family's organization — boundaries, subsystems, hierarchies", concepts:["joining — first task: blend with family's style and language","enmeshed boundaries (higher incidence of incest)","disengaged boundaries (greater prevalence of substance abuse)","family map — therapist's tool, NOT shared with family"], goodFor:"conflict between in-laws, parents, spouses, siblings"},
  {name:"Strategic Family Therapy", theorist:"Jay Haley", change:"Action-oriented directives and paradoxical interventions from an active, directive therapist", concepts:["paradoxical directives — prescribe the symptom","positioning — exaggerate the problem so family rebels","restraining — discourage change to elicit desire for it"], goodFor:"changing dysfunctional communication patterns"},
  {name:"Bowen Family Systems", theorist:"Murray Bowen", change:"Understanding multigenerational dynamics and patterns", concepts:["genogram — created IN session and shared with the family","differentiation of self","triangulation","emotional cutoff","family projection process"], goodFor:"multigenerational family patterns"},
  {name:"Systems Theory", theorist:"Ludwig von Bertalanffy (general systems theory)", change:"Strengthening all the systems contributing to a person's behavior and wellbeing", concepts:["person-in-environment","'moving one part moves the other parts'","homeostasis — the system pulls back to its familiar pattern, even an unhealthy one","equifinality — different starting points can reach the same outcome","feedback loops, boundaries, open/closed systems"], goodFor:"what makes social work unique — beyond family therapy"},
  {name:"Psychodynamic Therapy", theorist:"rooted in Sigmund Freud", change:"Insight into early, unresolved issues and their influence on current behavior", concepts:["transference explored in session","free association","identifying defense mechanisms","non-directive, open-ended"], goodFor:"high-functioning, insightful clients; relationship problems"},
  {name:"Person-Centered Therapy", theorist:"Carl Rogers", change:"Conditions for growth through the therapeutic relationship: congruence, unconditional positive regard, empathy", concepts:["unconditional positive regard","congruence/genuineness","empathy","self-actualization","non-directive — client leads"], goodFor:"clients who can direct their own growth"},
  {name:"Solution-Focused Therapy", theorist:"Steve de Shazer & Insoo Kim Berg", change:"Brief, goal-directed focus on strengths and the preferred future, not the problem", concepts:["miracle question","scaling questions","identifying exceptions to problems","cheerleading small changes"], goodFor:"brief, goal-directed work"},
  {name:"Task-Centered / Problem-Solving", change:"Client and social worker carry out agreed tasks outside sessions that address client-defined problems", concepts:["explicit client-defined problems, goals, duration","task rehearsal and practice","corrective feedback on accomplishments"], goodFor:"schizophrenia; homelessness"},
  {name:"Gestalt Therapy", theorist:"Fritz Perls", change:"Increased awareness of the here-and-now experience", concepts:["empty chair technique","present-moment focus (client AND therapist)","process over content"], goodFor:"bringing outside issues into the present moment"},
  {name:"Narrative Therapy", theorist:"Michael White & David Epston", change:"Externalizing the problem and re-authoring a story that emphasizes competencies", concepts:["externalizing — the problem is separate from the person","unique outcomes","re-authoring — client as expert; non-blaming"], goodFor:"individual and community work"},
  {name:"Logotherapy", theorist:"Viktor Frankl", change:"Finding meaning in life and gaining a sense of purpose", concepts:["striving for personal meaning as the primary driving force"], goodFor:"clients lacking meaning/purpose"},
  {name:"Feminist Therapy", change:"Recognizing disempowering social forces and empowering the client", concepts:["client is their own rescuer, equal to the therapist","every symptom holds a strength"], goodFor:"eating disorders"},
  {name:"Social Learning Theory", theorist:"Albert Bandura", change:"Learning through observing and modeling others", concepts:["modeling and imitation","observational learning","self-efficacy","'Bandura models'"], goodFor:"understanding learned behavior without direct reinforcement"}
];

/* Official ASWB guidance — from the 2025 ASWB Examination Guidebook */
window.ASWB_OFFICIAL = {
  levels: [
    {name:"Recall", d:"Remembering a definition or fact, sometimes dressed in a setting. Answer fast and bank the time."},
    {name:"Application", d:"Using knowledge in a concrete situation — recall the rule, then apply it to the vignette."},
    {name:"Reasoning", d:"Sorting competing information with a qualifier (FIRST/NEXT/BEST/MOST). More than one option may be good practice; the context and qualifier point to exactly one. The Clinical exam uses reasoning questions most heavily."}
  ],
  steps: [
    "Anticipate the answer BEFORE looking at the options.",
    "If no option matches, reread the stem and take it apart: pull out the key facts, identify exactly what's being asked, and add nothing that isn't there.",
    "The qualifier matters — and so does what follows it. FIRST what? MOST what? Answer that question, not one you created by assumption.",
    "Eliminate the one or two options you know are wrong (the real exam lets you strike through options).",
    "Always answer. Unanswered = wrong, and there's no penalty for guessing — eliminating even one option improves your odds."
  ],
  tips: [
    "TWO SECTIONS: the exam runs as two 85-question sections, each with its own 2-hour clock (~84 seconds per question). Once you submit Section 1, it locks permanently — all flagging, review, and answer changes must finish inside each section.",
    "An optional break of up to 10 minutes (testing clock stopped) sits between sections; you can end it early.",
    "Make multiple passes WITHIN each section: answer what you're sure of, flag the rest, then sweep back. Don't linger on any single question.",
    "Changing answers: the 'trust your first instinct' rule is a myth — across 70+ years of research (33+ studies), wrong-to-right changes outnumber right-to-wrong about 2:1. The evidence-based rule: revise when you have a concrete reason or low confidence on THAT item; keep when confident.",
    "There are NO answer-letter patterns and no easy-to-hard ordering — questions arrive in random order, so a brutal early stretch means nothing.",
    "Questions aren't designed to trick you; they measure entry-level competence. Preparation is mostly reviewing what you rarely use, not learning new material.",
    "Every question is a self-contained unit — never add facts to the stem.",
    "No one answers every question correctly. Finish a section early? Check that section's work before submitting — you can't come back.",
    "Self-care is test prep: sleep, don't cram, and use the stress-management skills you'd teach a client."
  ],
  format: "Official format: 170 questions in TWO 85-question sections, 2 hours each (Section 1 locks on submission; optional 10-min clock-stopped break between). 150 scored + 20 unscored pretest items you can't identify. Clinical content weights: Human Development 24%, Assessment & Diagnosis 30%, Interventions 27%, Ethics 19%."
};

/* SAFER exam-strategy content (FIRST/NEXT/BEST/MOST reasoning) */
window.SAFER = {
  intro: "A reasoning checklist for FIRST / NEXT / BEST / MOST questions — not a rigid sequence once immediate safety is addressed.",
  steps: [
    {k:"S", t:"Safety & legal mandates", d:"Check for suicide risk, homicide risk, abuse, neglect, medical emergencies, intoxication, withdrawal, or other immediate danger. Safety always wins."},
    {k:"A", t:"Assess what remains unknown", d:"Don't intervene, refer, confront, or educate when critical information hasn't been assessed yet. Assessment comes before intervention."},
    {k:"F", t:"Feelings & the client's stated concern", d:"Acknowledge the client's emotion when fear, resistance, shame, grief, or the therapeutic relationship is central. Start where the client is."},
    {k:"E", t:"Ethics", d:"Does the answer respect confidentiality, informed consent, competence, boundaries, and reporting duties?"},
    {k:"R", t:"Respect self-determination · least intrusive response", d:"Don't take control from a capable client. No third-party contact without valid reason or authorization. Choose the least restrictive option that meets the risk."}
  ],
  keywords: [
    {w:"FIRST", d:"What must happen before the other options can."},
    {w:"NEXT", d:"Depends on what has already occurred — don't repeat completed steps."},
    {w:"BEST", d:"The strongest overall response among defensible options."},
    {w:"MOST", d:"The answer most strongly supported by the facts actually stated."}
  ],
  rules: [
    "Assessment before intervention — unless immediate safety or a legal mandate overrides.",
    "Don't reassess what the stem says has already been assessed.",
    "Acknowledge feelings before advice when emotion is prominent.",
    "No unnecessary referrals when the social worker can competently address it.",
    "No contact with third parties without consent unless a confidentiality exception applies.",
    "No hospitalization / police / CPS unless the facts support that level of restriction.",
    "Never confront aggressively; never impose your values.",
    "Don't assume anything from demographics, diagnosis, or family structure alone.",
    "Answer the question being asked — not every issue in the scenario.",
    "When two answers are both reasonable, prefer the one earlier in the helping process."
  ],
  distractors: [
    {p:"Intervention before adequate assessment", trap:"acts-before-assessing"},
    {p:"Advice before acknowledging the client's concern", trap:"right-but-later"},
    {p:"Referral when direct clinical work is appropriate", trap:"wrong-role"},
    {p:"Breaking confidentiality without sufficient justification", trap:"premature-reporting"},
    {p:"More restrictive action than necessary", trap:"too-restrictive"},
    {p:"Answering a different problem than the one asked", trap:"knowledge"},
    {p:"Assuming facts not stated in the scenario", trap:"knowledge"},
    {p:"Repeating something already done", trap:"right-but-later"},
    {p:"Overriding a capable client's choice", trap:"self-determination"},
    {p:"Staying passive when a duty to report/warn exists", trap:"fails-duty"}
  ]
};
