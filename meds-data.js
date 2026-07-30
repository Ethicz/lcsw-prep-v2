/* Medication drill data — sourced from TDC "Quick Study: Psychotropic Medications
   by Diagnostic Category" (LCSW_CE_Medications_02_23.pdf).
   To add a medication: add a row {brand, generic, cat, cls, note} */
window.MEDS = [
  // ── Depressive Disorders ──
  {brand:"Prozac",   generic:"Fluoxetine",    cat:"Depressive Disorders", cls:"SSRI"},
  {brand:"Celexa",   generic:"Citalopram",    cat:"Depressive Disorders", cls:"SSRI"},
  {brand:"Zoloft",   generic:"Sertraline",    cat:"Depressive Disorders", cls:"SSRI"},
  {brand:"Lexapro",  generic:"Escitalopram",  cat:"Depressive Disorders", cls:"SSRI"},
  {brand:"Paxil",    generic:"Paroxetine",    cat:"Depressive Disorders", cls:"SSRI"},
  {brand:"Luvox",    generic:"Fluvoxamine",   cat:"Depressive Disorders", cls:"SSRI"},
  {brand:"Wellbutrin", generic:"Bupropion",   cat:"Depressive Disorders", cls:"NDRI",
   note:"Also sold as Zyban/Aplenzin; all three can be used as a smoking-cessation aid."},
  // ── Anxiety Disorders (Benzodiazepines) ──
  {brand:"Valium",   generic:"Diazepam",      cat:"Anxiety Disorders", cls:"Benzodiazepine"},
  {brand:"Xanax",    generic:"Alprazolam",    cat:"Anxiety Disorders", cls:"Benzodiazepine"},
  {brand:"Ativan",   generic:"Lorazepam",     cat:"Anxiety Disorders", cls:"Benzodiazepine"},
  {brand:"Klonopin", generic:"Clonazepam",    cat:"Anxiety Disorders", cls:"Benzodiazepine"},
  // ── Mood Disorders (Bipolar) ──
  {brand:"Lithium",  generic:"Lithium",       cat:"Mood Disorders", cls:"Mood stabilizer"},
  {brand:"Depakote", generic:"Divalproex Sodium", cat:"Mood Disorders", cls:"Mood stabilizer"},
  {brand:"Lamictal", generic:"Lamotrigine",   cat:"Mood Disorders", cls:"Mood stabilizer",
   note:"Stevens-Johnson syndrome: rare but serious rash side effect — contact MD immediately if rash forms."},
  {brand:"Abilify",  generic:"Aripiprazole",  cat:"Mood Disorders", cls:"Atypical antipsychotic (add-on)",
   note:"Add-on treatment used WITH another medication for Depression, Bipolar, or Schizophrenia."},
  // ── ADHD (Stimulants) ──
  {brand:"Ritalin/Concerta", generic:"Methylphenidate",   cat:"ADHD", cls:"Stimulant"},
  {brand:"Adderall",  generic:"Amphetamine",              cat:"ADHD", cls:"Stimulant"},
  {brand:"Dexedrine", generic:"Dextroamphetamine",        cat:"ADHD", cls:"Stimulant"},
  // ── Schizophrenia (Antipsychotics) ──
  {brand:"Haldol",    generic:"Haloperidol",    cat:"Schizophrenia", cls:"Typical antipsychotic"},
  {brand:"Thorazine", generic:"Chlorpromazine", cat:"Schizophrenia", cls:"Typical antipsychotic"},
  {brand:"Seroquel",  generic:"Quetiapine",     cat:"Schizophrenia", cls:"Atypical antipsychotic"},
  {brand:"Risperdal", generic:"Risperidone",    cat:"Schizophrenia", cls:"Atypical antipsychotic"},
  {brand:"Zyprexa",   generic:"Olanzapine",     cat:"Schizophrenia", cls:"Atypical antipsychotic"},
  {brand:"Clozaril",  generic:"Clozapine",      cat:"Schizophrenia", cls:"Atypical antipsychotic"}
];

window.MED_CATEGORIES = ["Depressive Disorders","Anxiety Disorders","Mood Disorders","ADHD","Schizophrenia"];

window.MED_FACTS = [
  "SSRIs are the most commonly prescribed antidepressants, with fewer side effects; they take 2–4 weeks to feel an effect.",
  "SSRIs may increase risk of suicidal ideation/behavior in children, adolescents, and adults under 25.",
  "MAOIs were the FIRST antidepressants; now rarely first-line due to dietary restrictions — foods high in tyramine can cause a dangerous blood-pressure spike (hypertensive crisis).",
  "Serotonin syndrome = dangerously high serotonin, usually from combining multiple serotonin-raising medications.",
  "MAOIs/Tricyclics may be used for treatment-resistant depression, but are NOT first-line.",
  "Benzodiazepines are the most commonly prescribed class for anxiety; NEVER mix with alcohol (each intensifies the other).",
  "Abilify (Aripiprazole) is an ADD-ON: used with another drug for Depression, Bipolar, or Schizophrenia when that drug alone isn't enough.",
  "Stevens-Johnson syndrome is a rare, serious side effect of Lamictal (Lamotrigine): flu-like symptoms then a spreading red/purple blistering rash.",
  "Tardive Dyskinesia — involuntary movements of tongue, lips, face, trunk, extremities — comes from LONG-TERM antipsychotic use. Treated with Ingrezza (Valbenazine), Zenazine (Tetrabenazine), or anticholinergics.",
  "Wellbutrin (Bupropion) is an NDRI — also used for smoking cessation (as Zyban)."
];
