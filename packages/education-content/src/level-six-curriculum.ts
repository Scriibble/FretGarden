import type {
  CurriculumContentBlock,
  CurriculumLesson,
  CurriculumReviewPlan
} from "./curriculum-schema.js";

function stages(
  id: string,
  skill: string,
  model: string[],
  guided: string[],
  fade: string[],
  independent: string[],
  success: string[]
): CurriculumContentBlock[] {
  return [
    { stage: "model" as const, label: "Observe", instructions: model, supports: ["Complete model", "Decision labels"] },
    { stage: "guided" as const, label: "Try with prompts", instructions: guided, supports: ["Step list", "One-variable revision"] },
    { stage: "scaffold-fade" as const, label: "Use fewer prompts", instructions: fade, supports: ["Check after the attempt"] },
    { stage: "independent" as const, label: "Perform independently", instructions: independent, supports: [] }
  ].map((definition) => ({
    id: `${id}-${definition.stage}`,
    type: "learning-stage",
    stage: definition.stage,
    heading: `${definition.label}: ${skill}`,
    instructions: definition.instructions,
    supports: definition.supports,
    successCriteria: success,
    accessibilityDescription: `${definition.label} stage for ${skill}, with instructions and success criteria stated in text.`
  }));
}

type FinalUnit = {
  slug: string;
  title: string;
  objective: string;
  why: string;
  minutes: number;
  prior: string[];
  concept: string;
  application: string;
  chartTitle: string;
  songTitle: string;
  key: "A" | "C" | "D" | "E" | "G";
  sections: readonly string[];
  evidence: readonly string[];
  mistake: string;
  review: {
    immediate: string;
    next: string;
    week: string;
    long: string;
  };
};

const finalUnits: readonly FinalUnit[] = [
  {
    slug: "songwriting-identity-constraint",
    title: "Songwriting Identity and Constraint",
    objective: "Use constraints, influence mapping, revision limits, and artistic intent to turn advanced vocabulary into a repeatable songwriting process.",
    why: "Identity grows through choices made repeatedly under constraints. A constraint gives taste something concrete to push against.",
    minutes: 150,
    prior: ["Level 5 jury", "Form development", "Harmony analysis", "Reflective practice"],
    concept: "Choose one musical constraint, one lyrical or emotional premise, and one influence boundary before writing. The goal is to make a choice you can explain.",
    application: "Write a short original piece from a constraint brief, then revise only the elements named in the brief.",
    chartTitle: "Constraint writing brief",
    songTitle: "One Rule Garden",
    key: "G",
    sections: ["Verse: two chords only", "Chorus: same motif higher", "Bridge: one borrowed color", "Return: original constraint restored"],
    evidence: ["Constraint brief", "Influence boundary", "Revision notes", "Identity reflection"],
    mistake: "The song tries to contain too many influences at once instead of testing one clear constraint.",
    review: {
      immediate: "State the constraint and the one thing it prevents.",
      next: "Revise the song without adding a new constraint.",
      week: "Write a second sketch from the same constraint.",
      long: "Use constraints to define future artistic studies before adding vocabulary."
    }
  },
  {
    slug: "melody-prosody-lyrics",
    title: "Melody, Prosody, and Lyrics",
    objective: "Align speech stress, melodic contour, lyric rhythm, harmonic pacing, and phrase endings in an original vocal or instrumental melody study.",
    why: "Prosody makes a line feel inevitable. Even instrumental melodies benefit from speech-like stress, breath, and emphasis.",
    minutes: 145,
    prior: ["Motif development", "Large form", "Songwriting constraints", "Ear training"],
    concept: "Speak the phrase before singing or playing it. Strong syllables, long notes, register peaks, and harmonic emphasis should agree unless a planned contrast is being used.",
    application: "Set four lyric lines or spoken prompts as melody, then revise stress conflicts and phrase endings.",
    chartTitle: "Prosody alignment chart",
    songTitle: "Syllable Light",
    key: "C",
    sections: ["Line 1: speech rhythm", "Line 2: melodic answer", "Line 3: register lift", "Line 4: cadence and breath"],
    evidence: ["Spoken stress map", "Melody contour", "Lyric revision note", "Phrase-ending notes"],
    mistake: "The melody accents weak words and hides the natural point of the sentence.",
    review: {
      immediate: "Speak the line and mark stressed words.",
      next: "Revise one melody note to match speech stress.",
      week: "Set a new four-line text with the same process.",
      long: "Check future melodies for speech, breath, contour, and cadence alignment."
    }
  },
  {
    slug: "arrangement-rhythm-section-ensemble",
    title: "Arrangement for Rhythm Section and Ensemble",
    objective: "Write guitar parts that fit bass, drums, keyboard, melody, and ensemble texture while preserving role, register, rhythm, and cue clarity.",
    why: "Ensemble arranging asks the guitarist to support the whole texture and leave room for other parts.",
    minutes: 155,
    prior: ["Multiple guitar arrangement", "Genre role study", "Large form", "Professional chart basics"],
    concept: "Assign roles before notes: foundation, groove, harmonic pad, counterline, hook, cue, or silence. A good part leaves room for the other instruments.",
    application: "Create an ensemble arrangement map with guitar, bass, drums, and one melodic or harmonic partner.",
    chartTitle: "Ensemble role map",
    songTitle: "Room For Everyone",
    key: "D",
    sections: ["Intro: guitar cue only", "Verse: bass owns motion", "Chorus: guitar widens harmony", "Tag: ensemble hits"],
    evidence: ["Role map", "Register plan", "Cue chart", "Collision revision"],
    mistake: "The guitar doubles the busiest rhythm and masks the bass or vocal cue.",
    review: {
      immediate: "Name each instrument's role in one section.",
      next: "Remove one guitar event that masks another part.",
      week: "Arrange the same chart with a different guitar role.",
      long: "Begin ensemble writing from role, register, and cue priorities."
    }
  },
  {
    slug: "alternate-tunings-capo-composition",
    title: "Alternate Tunings, Capo, and Guitar-Specific Composition",
    objective: "Use tuning, capo, drones, open strings, resonance, and physical affordances as compositional choices with documented transposition and safety checks.",
    why: "The guitar has physical ideas built into it. Alternate tuning and capo choices can reveal music that standard shapes might hide.",
    minutes: 145,
    prior: ["Fretboard notes", "Transposition", "Arrangement", "Songwriting constraints"],
    concept: "Retuning or capo placement changes resonance, fingering, register, and notation. Document the sounding key and keep tension changes safe.",
    application: "Write a short guitar-specific study using either capo or alternate tuning, then provide a standard-tuning explanation.",
    chartTitle: "Guitar-specific setup map",
    songTitle: "Open String Window",
    key: "E",
    sections: ["Drone statement", "Capo or tuning color", "Movable response", "Return to drone"],
    evidence: ["Setup note", "Sounding-key map", "Safety check", "Standard-tuning translation"],
    mistake: "The tuning is treated as magic, but the sounding notes and physical reason are not documented.",
    review: {
      immediate: "Name the setup, sounding key, and drone notes.",
      next: "Translate one phrase back to standard tuning language.",
      week: "Write a second sketch with a different capo or drone choice.",
      long: "Use setup changes only when they serve resonance, register, or composition."
    }
  },
  {
    slug: "production-aware-guitar-demo-craft",
    title: "Production-Aware Guitar and Demo Craft",
    objective: "Create guitar demos that communicate arrangement intent through tone, part priority, timing, double tracking, space, and revision notes.",
    why: "A demo is a decision-making tool. Production awareness helps the guitarist hear whether parts support the song.",
    minutes: 150,
    prior: ["Arrangement", "Tone control", "Ensemble roles", "Portfolio reflection"],
    concept: "Production-aware practice does not require upload or automated audio judgment. It requires listening notes: what part leads, what part supports, and what should be removed.",
    application: "Make or simulate a demo plan with rhythm, lead, texture, and revision notes. Use external recording only if the learner chooses.",
    chartTitle: "Demo decision map",
    songTitle: "Working Take",
    key: "A",
    sections: ["Scratch rhythm", "Hook layer", "Texture or counterline", "Revision pass"],
    evidence: ["Part priority list", "Tone note", "Timing note", "Revision decision"],
    mistake: "The demo keeps too many recorded ideas instead of deciding which part serves the song.",
    review: {
      immediate: "Name the lead part and one supporting part.",
      next: "Remove or simplify one layer after listening.",
      week: "Create a second demo map with a different part priority.",
      long: "Use demos to make arrangement decisions, not to collect unreviewed layers."
    }
  },
  {
    slug: "professional-charts-scores-communication",
    title: "Professional Charts, Scores, and Communication",
    objective: "Prepare readable charts with form, cues, repeats, roadmaps, tempo, key, capo/tuning, rhythmic figures, and revision notes for other musicians.",
    why: "A chart is successful when someone else can use it. Communication is a musicianship skill, not paperwork after the real work.",
    minutes: 145,
    prior: ["Lead-sheet literacy", "Ensemble arrangement", "Transposition", "Professional reflection"],
    concept: "A professional chart shows what players need before rehearsal: roadmap, groove, cues, endings, setup, and any places where interpretation is expected.",
    application: "Turn an original piece into a clean rehearsal chart and a short revision note for another musician.",
    chartTitle: "Rehearsal chart checklist",
    songTitle: "Readable Roadmap",
    key: "C",
    sections: ["Header: key tempo setup", "Roadmap: repeats and endings", "Figures: rhythmic cues", "Notes: revisions and responsibilities"],
    evidence: ["Chart header", "Roadmap", "Cue list", "Revision note"],
    mistake: "The chart contains chord names but no roadmap, setup, or cues for rehearsal.",
    review: {
      immediate: "Check header, form, and ending.",
      next: "Give the chart one revision for readability.",
      week: "Transpose the chart or adapt it for another player.",
      long: "Treat chart clarity as part of collaborative work."
    }
  },
  {
    slug: "independent-study-teaching",
    title: "Independent Study and Teaching the Concept",
    objective: "Design an independent study cycle and teach one concept with examples, misconceptions, repair steps, and signs of learner understanding.",
    why: "Teaching reveals whether a concept is understood deeply enough to adapt. Independent study keeps growth moving after the curriculum ends.",
    minutes: 150,
    prior: ["All prior levels", "Reflection", "Remediation", "Portfolio planning"],
    concept: "Choose a question, define success checks, study examples, test understanding, teach it plainly, and revise from confusion. Teaching can be written, spoken, or shown.",
    application: "Create a two-week independent-study plan and a short teach-back artifact for one musical concept.",
    chartTitle: "Independent study cycle",
    songTitle: "Teach The Seed",
    key: "G",
    sections: ["Question", "Examples", "Teach-back", "Revision"],
    evidence: ["Study question", "Success criteria", "Teach-back artifact", "Misconception repair"],
    mistake: "The study topic is broad, but no success check or teaching test is defined.",
    review: {
      immediate: "Write one question and one success criterion.",
      next: "Teach the concept and record the confusion point.",
      week: "Revise the explanation from that confusion.",
      long: "Use independent study cycles to choose post-curriculum growth."
    }
  },
  {
    slug: "complete-artist-portfolio",
    title: "Capstone: Complete Artist Portfolio",
    objective: "Assemble a complete artist portfolio that integrates playing, writing, arranging, theory, listening, communication, reflection, and future study planning.",
    why: "The capstone is not the end of learning. It is a clear picture of current artistic identity, current work, and the next direction.",
    minutes: 320,
    prior: ["All curriculum units", "Advanced jury", "Professional charts", "Independent study"],
    concept: "A complete portfolio includes finished work, process notes, communication artifacts, reflection, and a next-study plan. It should show current skills and honest direction.",
    application: "Prepare a final portfolio with at least one complete work, two supporting artifacts, one chart, one teaching or study artifact, and a future plan.",
    chartTitle: "Complete portfolio map",
    songTitle: "FretGarden Capstone",
    key: "D",
    sections: ["Complete work", "Supporting studies", "Communication artifact", "Future direction"],
    evidence: ["Performance or arrangement", "Analysis and chart", "Process reflection", "Next-year study plan"],
    mistake: "The portfolio collects artifacts without explaining identity, growth, or next direction.",
    review: {
      immediate: "List the portfolio artifacts and what each shows.",
      next: "Revise the weakest artifact or explanation.",
      week: "Present the portfolio map and update the next-study plan.",
      long: "Use the capstone as the baseline for future artistic work."
    }
  }
];

function lessonFromUnit(unit: FinalUnit, index: number): CurriculumLesson {
  const id = unit.slug;
  return {
    id: `lesson.${id}`,
    unitId: `unit.${id}`,
    order: 1,
    title: unit.title,
    objective: unit.objective,
    whyItMatters: unit.why,
    estimatedMinutes: unit.minutes,
    priorKnowledge: unit.prior,
    contentBlocks: [
      { id: `${id}-concept`, type: "text", heading: "Core idea", paragraphs: [unit.concept, unit.application] },
      { id: `${id}-chart`, type: "lead-sheet", heading: unit.chartTitle, songTitle: unit.songTitle, key: unit.key, meter: "4/4", tempo: 76 + index, capo: 0, sections: [
        { name: "Portfolio frame", repeatCount: 1, measures: unit.sections.map((section, sectionIndex) => ({
          chord: ["I", "IV", "vi", "V"][sectionIndex % 4]!,
          cue: section,
          beats: 4
        })) }
      ], explanation: "This original chart is a planning frame. Replace the placeholder harmony with the learner's own material while preserving the checklist requirements.", accessibilityDescription: `${unit.title} planning chart with sections: ${unit.sections.join(", ")}.` },
      { id: `${id}-evidence`, type: "instrument-setup", heading: "Project checklist", items: unit.evidence.map((item) => ({
        label: item,
        instruction: `Prepare ${item.toLowerCase()} for review.`,
        selfCheck: `${item} is specific enough that another musician or future self can understand it.`
      })), safetyNote: "Keep the scope sustainable; reduce artifact count before increasing practice intensity.", accessibilityDescription: `${unit.title} checklist: ${unit.evidence.join(", ")}.` },
      ...stages(id, unit.title.toLowerCase(), ["Study the model and name the decision points.", "Identify what will support the musical claim.", "Compare a broad version with a constrained version."], ["Draft the artifact from the checklist.", "Revise one variable only.", "Write a short explanation of the decision."], ["Hide the checklist until after the attempt.", "Remove anything that does not support the stated purpose.", "Check whether the checklist still matches the artifact."], ["Complete the artifact independently.", "Explain the musical choices and limitations.", "Write the next study action from the weakest area."], ["The artifact is complete and reviewable.", "The explanation matches the musical result.", "The next step follows the project."]),
      { id: `${id}-reflection`, type: "reflection", heading: "Project notes and next step", prompt: `Summarize the ${unit.title} artifact, the strongest support, the weakest area, and the next revision or study action.`, fieldLabel: `${unit.title} reflection`, placeholder: unit.review.next }
    ],
    guidedExercises: [
      { id: `exercise.${id}.artifact`, title: "Draft the artifact", purpose: "Create a reviewable artifact instead of a vague idea.", instructions: ["Choose the smallest complete version.", "Draft it with the project checklist visible.", "Revise one variable.", "Record what changed."], successCriteria: ["The artifact is complete.", "One revision is documented.", "The supporting note is specific."], reduceDifficultyWhen: ["Use two sections or one artifact."], increaseDifficultyWhen: ["Adapt the artifact for another collaborator or context."], relatedSkills: ["portfolio", "composition", "reflection"] },
      { id: `exercise.${id}.defense`, title: "Defend the decision", purpose: "Connect artistic choice to musical details.", instructions: ["State the purpose.", "Point to the supporting detail.", "Name one limitation.", "Write the next action."], successCriteria: ["Purpose and artifact agree.", "A limitation is named honestly.", "The next action is concrete."], reduceDifficultyWhen: ["Use a written explanation only."], increaseDifficultyWhen: ["Present the artifact to another musician."], relatedSkills: ["analysis", "communication", "self-assessment"] }
    ],
    commonMistakes: [
      { id: `mistake.${id}.scope`, symptom: unit.mistake, likelyCause: "Scope or success criteria were not defined before drafting.", adjustment: "Return to the smallest artifact that can support the current objective." },
      { id: `mistake.${id}.evidence`, symptom: "The artifact exists, but the reflection does not explain what it shows.", likelyCause: "The support was added after the fact.", adjustment: "Name the claim, then attach the artifact that supports it." }
    ],
    knowledgeChecks: [
      { id: `check.${id}.evidence`, prompt: "What makes this unit complete?", options: ["A reviewable artifact with matching explanation", "Only a vague intention", "Only more practice time"], correctAnswer: "A reviewable artifact with matching explanation", explanation: "Final-level work requires artifacts and explanation, not activity alone." },
      { id: `check.${id}.revision`, prompt: "What should revision respond to?", options: ["The weakest area", "Random novelty", "Avoiding the objective"], correctAnswer: "The weakest area", explanation: "Revision should follow the reviewed work." },
      { id: `check.${id}.scope`, prompt: "What keeps the project sustainable?", options: ["Small complete artifacts with clear criteria", "Unlimited simultaneous goals", "No review"], correctAnswer: "Small complete artifacts with clear criteria", explanation: "Advanced work still needs bounded scope." }
    ],
    masteryCriteria: [
      { id: `mastery.${id}.artifact`, description: "Complete the unit artifact or portfolio component.", verification: "recorded-value", required: true },
      { id: `mastery.${id}.explain`, description: "Explain the musical choices and support.", verification: "reflection", required: true },
      { id: `mastery.${id}.next`, description: "Define the next revision or study action from the weakest area.", verification: "reflection", required: true }
    ],
    reviewRecommendation: `Immediate review: ${unit.review.immediate} Next session: ${unit.review.next} One week: ${unit.review.week}`,
    optionalExtension: unit.review.long
  };
}

export const levelSixLessons: readonly CurriculumLesson[] = finalUnits.map(lessonFromUnit);

export const levelSixReviewPlans: readonly CurriculumReviewPlan[] = finalUnits.map((unit) => ({
  id: `review.${unit.slug}`,
  unitId: `unit.${unit.slug}`,
  immediateReview: [unit.review.immediate],
  nextSessionReview: [unit.review.next],
  oneWeekReview: [unit.review.week],
  longTermReview: [unit.review.long]
}));
