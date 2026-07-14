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
  const definitions = [
    { stage: "model" as const, label: "Observe", instructions: model, supports: ["Complete written model", "Visible success criteria"] },
    { stage: "guided" as const, label: "Try with prompts", instructions: guided, supports: ["Numbered steps", "One-variable diagnosis"] },
    { stage: "scaffold-fade" as const, label: "Use fewer prompts", instructions: fade, supports: ["Check the model only after an attempt"] },
    { stage: "independent" as const, label: "Perform independently", instructions: independent, supports: [] }
  ];
  return definitions.map((definition) => ({
    id: `${id}-${definition.stage}`,
    type: "learning-stage",
    stage: definition.stage,
    heading: `${definition.label}: ${skill}`,
    instructions: definition.instructions,
    supports: definition.supports,
    successCriteria: success,
    accessibilityDescription: `${definition.label} stage for ${skill}, with actions and success criteria stated in text.`
  }));
}

const cMajorCShape: CurriculumContentBlock = {
  id: "caged-c-c-shape", type: "chord-diagram", heading: "C form: open register", chordName: "C",
  strings: [
    { string: 6, state: "muted" }, { string: 5, state: "fretted", fret: 3, finger: 3, note: "C" },
    { string: 4, state: "fretted", fret: 2, finger: 2, note: "E" }, { string: 3, state: "open", note: "G" },
    { string: 2, state: "fretted", fret: 1, finger: 1, note: "C" }, { string: 1, state: "open", note: "E" }
  ], strumFromString: 5,
  explanation: "Name roots on strings 5 and 2, thirds on strings 4 and 1, and the fifth on string 3. The interval map matters more than the outline.",
  accessibilityDescription: "Open C: string 6 muted; string 5 fret 3 C; string 4 fret 2 E; string 3 open G; string 2 fret 1 C; string 1 open E."
};

const cMajorAShape: CurriculumContentBlock = {
  id: "caged-c-a-shape", type: "chord-diagram", heading: "A form: C at fret 3", chordName: "C", baseFret: 3,
  barres: [{ fret: 3, fromString: 5, toString: 1, finger: 1 }, { fret: 5, fromString: 4, toString: 2, finger: 3 }],
  strings: [
    { string: 6, state: "muted" }, { string: 5, state: "fretted", fret: 3, finger: 1, note: "C" },
    { string: 4, state: "fretted", fret: 5, finger: 3, note: "G" }, { string: 3, state: "fretted", fret: 5, finger: 3, note: "C" },
    { string: 2, state: "fretted", fret: 5, finger: 3, note: "E" }, { string: 1, state: "fretted", fret: 3, finger: 1, note: "G" }
  ], strumFromString: 5,
  explanation: "The string-5 root anchors the A form. A partial strings 5-2 voicing is sufficient when the high string interferes with release or tone.",
  accessibilityDescription: "C A-form at fret 3: string 6 muted; string 5 fret 3 C; strings 4, 3, 2 fret 5 are G, C, E; string 1 fret 3 G."
};

const cMajorGShape: CurriculumContentBlock = {
  id: "caged-c-g-shape", type: "chord-diagram", heading: "G form: split C voicing", chordName: "C", baseFret: 5,
  barres: [{ fret: 5, fromString: 4, toString: 2, finger: 1 }],
  strings: [
    { string: 6, state: "fretted", fret: 8, finger: 4, note: "C" }, { string: 5, state: "fretted", fret: 7, finger: 3, note: "E" },
    { string: 4, state: "fretted", fret: 5, finger: 1, note: "G" }, { string: 3, state: "fretted", fret: 5, finger: 1, note: "C" },
    { string: 2, state: "fretted", fret: 5, finger: 1, note: "E" }, { string: 1, state: "fretted", fret: 8, finger: 4, note: "C" }
  ], strumFromString: 6,
  explanation: "Treat this as connected lower and upper fragments, not a mandatory six-string grip. Locate the outer roots and the compact G-C-E triad on strings 4-2.",
  accessibilityDescription: "C G-form region: string 6 fret 8 C, string 5 fret 7 E, strings 4 through 2 fret 5 are G C E, string 1 fret 8 C."
};

const cMajorEShape: CurriculumContentBlock = {
  id: "caged-c-e-shape", type: "chord-diagram", heading: "E form: C at fret 8", chordName: "C", baseFret: 8,
  barres: [{ fret: 8, fromString: 6, toString: 1, finger: 1 }],
  strings: [
    { string: 6, state: "fretted", fret: 8, finger: 1, note: "C" }, { string: 5, state: "fretted", fret: 10, finger: 3, note: "G" },
    { string: 4, state: "fretted", fret: 10, finger: 4, note: "C" }, { string: 3, state: "fretted", fret: 9, finger: 2, note: "E" },
    { string: 2, state: "fretted", fret: 8, finger: 1, note: "G" }, { string: 1, state: "fretted", fret: 8, finger: 1, note: "C" }
  ], strumFromString: 6,
  explanation: "The string-6 root anchors the E form. Compare this interval layout with the earlier movable-harmony unit, then extract smaller triads by register.",
  accessibilityDescription: "C E-form at fret 8: string 6 fret 8 C; strings 5 and 4 fret 10 G and C; string 3 fret 9 E; strings 2 and 1 fret 8 G and C."
};

const cMajorDShape: CurriculumContentBlock = {
  id: "caged-c-d-shape", type: "chord-diagram", heading: "D form: upper-register C", chordName: "C", baseFret: 10,
  strings: [
    { string: 6, state: "muted" }, { string: 5, state: "muted" },
    { string: 4, state: "fretted", fret: 10, finger: 1, note: "C" }, { string: 3, state: "fretted", fret: 12, finger: 2, note: "G" },
    { string: 2, state: "fretted", fret: 13, finger: 4, note: "C" }, { string: 1, state: "fretted", fret: 12, finger: 3, note: "E" }
  ], strumFromString: 4,
  explanation: "The string-4 root opens a bright upper register. Connect its C-E-G tones back to the neighboring E and C regions across fret 12.",
  accessibilityDescription: "C D-form: strings 6 and 5 muted; string 4 fret 10 C; string 3 fret 12 G; string 2 fret 13 C; string 1 fret 12 E."
};

export const levelThreeLessons: readonly CurriculumLesson[] = [
  {
    id: "lesson.caged-fretboard-integration",
    unitId: "unit.caged-fretboard-integration",
    order: 1,
    title: "Connect one harmony through five neck regions",
    objective: "Locate and play one named major chord through all five CAGED regions, identify roots, thirds, and fifths, derive nearby arpeggio and major-scale tones, and revoice a three-section song across at least three registers.",
    whyItMatters: "CAGED is useful when it connects pitch identity, interval function, and register. Shape names are temporary landmarks; the musical goal is choosing where the same harmony should sound.",
    estimatedMinutes: 150,
    priorKnowledge: ["Open and movable major chords", "Natural-note roots and octaves", "Major-triad formula", "Major scale", "Voice leading"],
    contentBlocks: [
      { id: "caged-system-purpose", type: "text", heading: "Five regions overlap into one fretboard", paragraphs: ["The open C, A, G, E, and D chord forms can be moved to describe five neighboring regions for one major harmony. The form name describes interval geometry, not the sounding chord name.", "Every region must be anchored by named roots and chord tones. Use partial voicings whenever they make register, tone, or physical comfort clearer; do not treat difficult full grips as the definition of knowledge."] },
      cMajorCShape, cMajorAShape, cMajorGShape, cMajorEShape, cMajorDShape,
      { id: "caged-c-roots", type: "fretboard-map", heading: "C roots connect the five regions", fretStart: 0, fretEnd: 12, positions: [
        { string: 5, fret: 3, note: "C", label: "C", emphasis: "root" }, { string: 2, fret: 1, note: "C", label: "C", emphasis: "root" },
        { string: 3, fret: 5, note: "C", label: "C", emphasis: "root" }, { string: 6, fret: 8, note: "C", label: "C", emphasis: "root" },
        { string: 4, fret: 10, note: "C", label: "C", emphasis: "root" }, { string: 1, fret: 8, note: "C", label: "C", emphasis: "root" }
      ], explanation: "Retrieve roots first, then build the nearest 1-3-5 fragment. Overlap means a note may belong to two neighboring region views; it does not become a different pitch.", accessibilityDescription: "C roots through fret 12: string 5 fret 3, string 2 fret 1, string 3 fret 5, strings 6 and 1 fret 8, and string 4 fret 10." },
      ...stages("caged-five-regions", "five connected CAGED regions", ["Trace each C root before viewing its form.", "Name 1, 3, and 5 inside every C voicing.", "Hear one progression revoiced low, middle, and high."], ["Build partial C forms from one root and two chord tones.", "Connect C-form to A-form, then A-form to G-form without stopping.", "Assign verse, chorus, and bridge to three registers."], ["Use root markers only and reconstruct interval maps.", "Play three randomly named regions before checking diagrams.", "Choose partial voicings by register rather than grip familiarity."], ["Locate C major in all five regions from memory.", "Repeat the process for a second named major chord.", "Perform one song form using at least three regions and explain each choice."], ["Every voicing contains only the named chord tones.", "Roots and intervals are named without relying on form labels alone.", "Register changes support section contrast and transitions remain in time."]),
      { id: "caged-register-reflection", type: "reflection", heading: "Defend the register plan", prompt: "Name the three regions chosen for verse, chorus, and bridge; list each root location; and explain how register, density, or timbre supports the form.", fieldLabel: "CAGED arrangement note", placeholder: "Verse uses low E-form fragments, chorus uses A-form mid-neck, bridge uses D-form triads above fret 10." }
    ],
    guidedExercises: [
      { id: "exercise.caged-root-first", title: "Root before region", purpose: "Prevent shape recall from replacing note knowledge.", instructions: ["Choose a major chord name.", "Find one root on strings 6, 5, or 4.", "Build the nearest 1-3-5 fragment.", "Name the neighboring CAGED region only after checking tones."], successCriteria: ["The root is named before the form.", "Every sounded note is 1, 3, or 5.", "The fragment transfers to a second register."], reduceDifficultyWhen: ["Use C major and strings 4-2 only."], increaseDifficultyWhen: ["Use a shuffled flat or sharp root."], relatedSkills: ["CAGED", "fretboard", "intervals"] },
      { id: "exercise.caged-song-regions", title: "Three-region arrangement", purpose: "Use neck position as an arrangement decision.", instructions: ["Map one progression in a low region.", "Find compact middle-register alternatives.", "Choose an upper-register bridge or response.", "Perform the form with deliberate transitions."], successCriteria: ["At least three regions are audible.", "Chord identity remains accurate.", "Register changes coincide with form purpose."], reduceDifficultyWhen: ["Change region for the chorus only."], increaseDifficultyWhen: ["Add a nearby major-scale fill without losing chord tones."], relatedSkills: ["arrangement", "voicing", "form"] }
    ],
    commonMistakes: [
      { id: "mistake.caged-shape-only", symptom: "The form can be drawn but roots and thirds cannot be named.", likelyCause: "Geometry was memorized without pitch function.", adjustment: "Remove the full grip and rebuild only 1-3-5 from a named root." },
      { id: "mistake.caged-all-strings", symptom: "Every region is forced into a tense six-string chord.", likelyCause: "Completeness is being confused with musical usefulness.", adjustment: "Choose a three- or four-note fragment that preserves the needed register." },
      { id: "mistake.caged-transition", symptom: "Register changes interrupt the form.", likelyCause: "Regions were practiced independently rather than across boundaries.", adjustment: "Loop the final beat of one section into the first chord of the next." }
    ],
    knowledgeChecks: [
      { id: "check.caged-name", prompt: "What does the A-form label describe when the sounding chord is C?", options: ["The interval geometry inherited from open A", "The sounding chord is A", "The key signature"], correctAnswer: "The interval geometry inherited from open A", explanation: "Form labels orient geometry; roots and chord tones determine sounding harmony." },
      { id: "check.caged-overlap", prompt: "Why do neighboring CAGED regions overlap?", options: ["The same notes can be viewed from adjacent chord-form landmarks", "Each fret has two pitches", "One region must be played out of tune"], correctAnswer: "The same notes can be viewed from adjacent chord-form landmarks", explanation: "Regions are connected views of one continuous fretboard." },
      { id: "check.caged-choice", prompt: "What is the best reason to choose a partial CAGED voicing?", options: ["It supplies the needed chord tones, register, and clarity", "It avoids learning note names", "Partial chords are always louder"], correctAnswer: "It supplies the needed chord tones, register, and clarity", explanation: "A voicing is judged by musical function and sustainable execution." }
    ],
    masteryCriteria: [
      { id: "mastery.caged-five", description: "Locate and play a named major chord in all five CAGED regions.", verification: "performance-checklist", required: true },
      { id: "mastery.caged-intervals", description: "Name roots, thirds, and fifths in every selected voicing.", verification: "guided-self-check", required: true },
      { id: "mastery.caged-connect", description: "Shift between neighboring regions without breaking pulse.", verification: "performance-checklist", required: true },
      { id: "mastery.caged-arrange", description: "Revoice a three-section song through at least three neck regions.", verification: "performance-checklist", required: true },
      { id: "mastery.caged-reflect", description: "Explain how register and density support the arrangement.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, retrieve one chord in five regions from roots only. After one week, revoice a different progression in an unfamiliar key and compare the same harmony across registers.",
    optionalExtension: "Add nearby major-scale tones to one region and write a two-beat fill that resolves to a named chord tone."
  },
  {
    id: "lesson.diatonic-harmony-major-keys",
    unitId: "unit.diatonic-harmony-major-keys",
    order: 1,
    title: "Hear and build function inside a major key",
    objective: "Harmonize a major scale as seven triads, connect inversions in several keys, classify tonic, predominant, and dominant function, distinguish four cadence types, and write four purpose-built progressions.",
    whyItMatters: "Diatonic harmony explains why chords create stability, departure, preparation, tension, and return. Function turns a memorized chord list into choices that can be heard, transposed, and revised.",
    estimatedMinutes: 145,
    priorKnowledge: ["Major-scale construction", "Triad qualities and inversions", "Roman numerals", "Voice leading", "Lead-sheet transposition"],
    contentBlocks: [
      { id: "major-harmony-functions", type: "text", heading: "Scale degree and chord quality create function", paragraphs: ["Stacking alternating scale tones above each major-scale degree yields I, ii, iii, IV, V, vi, and vii diminished. In C: C, Dm, Em, F, G, Am, B diminished.", "Tonic-family chords I, iii, and vi can provide relative stability; predominant ii and IV move away and prepare; dominant V and vii diminished contain directed tension. Context can change emphasis, so function is heard across motion rather than assigned by label alone."] },
      { id: "c-major-diatonic-triads", type: "progression-chart", heading: "Harmonize every degree in C major", key: "C", meter: "4/4", measures: [
        { label: "Degree 1", chord: "C", romanNumeral: "I", nashvilleNumber: "1", beats: 4 },
        { label: "Degree 2", chord: "Dm", romanNumeral: "ii", nashvilleNumber: "2m", beats: 4 },
        { label: "Degree 3", chord: "Em", romanNumeral: "iii", nashvilleNumber: "3m", beats: 4 },
        { label: "Degree 4", chord: "F", romanNumeral: "IV", nashvilleNumber: "4", beats: 4 },
        { label: "Degree 5", chord: "G", romanNumeral: "V", nashvilleNumber: "5", beats: 4 },
        { label: "Degree 6", chord: "Am", romanNumeral: "vi", nashvilleNumber: "6m", beats: 4 },
        { label: "Degree 7", chord: "Bdim", romanNumeral: "vii°", nashvilleNumber: "7dim", beats: 4 }
      ], explanation: "Sing C-D-E-F-G-A-B roots before playing. Build each triad from scale-only thirds, then connect the nearest inversion rather than jumping to seven unrelated grips.", accessibilityDescription: "C-major harmonized scale: C major, D minor, E minor, F major, G major, A minor, B diminished; Roman numerals I ii iii IV V vi vii diminished." },
      { id: "major-cadence-map", type: "progression-chart", heading: "Four cadences answer different formal questions", key: "C", meter: "4/4", measures: [
        { label: "Authentic", chord: "G-C", romanNumeral: "V-I", nashvilleNumber: "5-1", beats: 4 },
        { label: "Plagal", chord: "F-C", romanNumeral: "IV-I", nashvilleNumber: "4-1", beats: 4 },
        { label: "Deceptive", chord: "G-Am", romanNumeral: "V-vi", nashvilleNumber: "5-6m", beats: 4 },
        { label: "Half", chord: "Dm-G", romanNumeral: "ii-V", nashvilleNumber: "2m-5", beats: 4 }
      ], explanation: "Authentic and plagal cadences arrive on tonic through different preparation. Deceptive motion redirects dominant tension to vi. A half cadence stops on V and therefore sounds open.", accessibilityDescription: "Cadences in C: authentic G to C, plagal F to C, deceptive G to A minor, and half cadence D minor to G." },
      { id: "major-function-study", type: "lead-sheet", heading: "Trace function before chord names", songTitle: "Four Gates", key: "C", meter: "4/4", tempo: 72, capo: 0, sections: [
        { name: "Statement", repeatCount: 2, measures: [{ chord: "C", cue: "tonic; settle", beats: 4 }, { chord: "Am", cue: "tonic family", beats: 4 }, { chord: "Dm", cue: "predominant", beats: 4 }, { chord: "G", cue: "half cadence", beats: 4 }] },
        { name: "Answer", repeatCount: 2, measures: [{ chord: "F", cue: "predominant", beats: 4 }, { chord: "G", cue: "dominant", beats: 4 }, { chord: "Em", cue: "tonic substitute", beats: 4 }, { chord: "Am", cue: "deceptive color", beats: 4 }] },
        { name: "Close", repeatCount: 1, measures: [{ chord: "Dm", cue: "prepare", beats: 4 }, { chord: "G", cue: "tension", beats: 4 }, { chord: "C", cue: "authentic arrival", beats: 4 }] }
      ], explanation: "Hear each section as a functional route. Revoice with compact triads, sing bass movement, then transpose the function plan to G or D.", accessibilityDescription: "Original C-major functional study: statement C Am Dm G; answer F G Em Am; close Dm G C." },
      ...stages("major-functional-harmony", "major-key harmony and cadences", ["Sing the seven roots before hearing harmonized triads.", "Observe how quality follows scale-only thirds.", "Compare authentic, plagal, deceptive, and half-cadence endings."], ["Build C-major triads one degree at a time.", "Sort them into tonic, predominant, and dominant families.", "Write one four-chord route from tonic through predominant and dominant."], ["Use Roman numerals without chord-name prompts.", "Transpose two functions to G major.", "Identify cadence type from its final motion before checking."], ["Harmonize a prompted major scale and explain every quality.", "Perform four progressions with distinct structural purposes.", "Analyze and transpose an unfamiliar diatonic progression."], ["All chord roots and qualities belong to the key.", "Functional labels are supported by heard motion.", "Cadence types and transpositions preserve their relationships."]),
      { id: "major-harmony-reflection", type: "reflection", heading: "Explain what the progression is doing", prompt: "Write one progression for stability, one for departure, one for unresolved tension, and one for surprise. Label Roman numerals, function families, cadence, and the bass motion you hear.", fieldLabel: "Major-harmony analysis", placeholder: "I-vi-ii-V ends open on dominant; IV-V-iii-vi redirects expected resolution and extends the phrase." }
    ],
    guidedExercises: [
      { id: "exercise.major-harmonize", title: "Sing, stack, verify", purpose: "Derive diatonic triads rather than recall a chart blindly.", instructions: ["Write or speak the major scale.", "Sing each root in order.", "Stack scale degrees 1-3-5 above each root.", "Name quality and verify on guitar."], successCriteria: ["Seven roots remain in key.", "Quality pattern is major-minor-minor-major-major-minor-diminished.", "Inversions connect with small motion."], reduceDifficultyWhen: ["Harmonize degrees I, IV, and V only."], increaseDifficultyWhen: ["Use a key with two or more accidentals."], relatedSkills: ["diatonic harmony", "triads", "singing"] },
      { id: "exercise.cadence-contrast", title: "Same phrase, four endings", purpose: "Hear cadence as formal behavior.", instructions: ["Keep the first two measures unchanged.", "End once with V-I, IV-I, V-vi, and ii-V.", "Name arrival, redirection, or openness.", "Choose which ending fits four different section purposes."], successCriteria: ["Every ending is performed in time.", "Cadence names match final motion.", "The chosen formal effect is described audibly."], reduceDifficultyWhen: ["Compare authentic and half cadences only."], increaseDifficultyWhen: ["Transpose all endings before replaying."], relatedSkills: ["cadence", "function", "form"] }
    ],
    commonMistakes: [
      { id: "mistake.harmony-quality", symptom: "All seven scale roots receive major chords.", likelyCause: "Root membership is being confused with chord construction.", adjustment: "Stack only notes from the key and measure each third." },
      { id: "mistake.harmony-label", symptom: "Roman numerals are correct but no tension or arrival can be heard.", likelyCause: "Symbols were added without singing roots or comparing endings.", adjustment: "Sing bass motion and play only the final two chords of each cadence." },
      { id: "mistake.harmony-jumps", symptom: "The harmonized scale is interrupted by large grip changes.", likelyCause: "Root-position shapes were chosen for every degree.", adjustment: "Use inversions that keep common tones and move each voice minimally." }
    ],
    knowledgeChecks: [
      { id: "check.harmony-pattern", prompt: "What is the diatonic triad-quality pattern in major?", options: ["major-minor-minor-major-major-minor-diminished", "major-major-minor-minor-major-major-minor", "minor-diminished-major-minor-minor-major-major"], correctAnswer: "major-minor-minor-major-major-minor-diminished", explanation: "Stacking scale-only thirds produces I ii iii IV V vi vii diminished." },
      { id: "check.harmony-predominant", prompt: "Which pair most often serves predominant function in a major key?", options: ["ii and IV", "I and vi", "V and vii°"], correctAnswer: "ii and IV", explanation: "ii and IV commonly move away from tonic and prepare dominant." },
      { id: "check.harmony-deceptive", prompt: "Which motion defines a basic deceptive cadence?", options: ["V-vi", "V-I", "IV-I"], correctAnswer: "V-vi", explanation: "Dominant tension redirects to vi instead of the expected tonic." }
    ],
    masteryCriteria: [
      { id: "mastery.harmony-harmonize", description: "Harmonize a named major scale as seven correctly qualified triads.", verification: "guided-self-check", required: true },
      { id: "mastery.harmony-inversions", description: "Connect the harmonized scale with efficient inversions.", verification: "performance-checklist", required: true },
      { id: "mastery.harmony-functions", description: "Explain tonic, predominant, and dominant motion in an unfamiliar progression.", verification: "reflection", required: true },
      { id: "mastery.harmony-cadences", description: "Perform and identify authentic, plagal, deceptive, and half cadences.", verification: "performance-checklist", required: true },
      { id: "mastery.harmony-write", description: "Write four progressions with distinct emotional or structural functions.", verification: "recorded-value", required: true }
    ],
    reviewRecommendation: "Next session, harmonize a different major key from its scale before viewing a chart. After one week, analyze function and cadence in an unfamiliar original or public-domain progression.",
    optionalExtension: "Keep one soprano note constant while reharmonizing it with three diatonic function families."
  },
  {
    id: "lesson.relative-minor-minor-key-harmony",
    unitId: "unit.relative-minor-minor-key-harmony",
    order: 1,
    title: "Change minor color without losing the tonic",
    objective: "Compare natural, harmonic, and melodic minor over one tonic, distinguish relative from parallel minor, construct minor-key diatonic harmony including dominant V, and perform an original minor verse with a relative-major chorus.",
    whyItMatters: "Minor is not one fixed box. Scale-degree changes alter melodic pull and harmonic function; hearing the same tonic across three forms makes those changes available for songwriting and improvisation.",
    estimatedMinutes: 145,
    priorKnowledge: ["Major scale and relative minor", "Diatonic triads", "Leading-tone resolution", "Two-position scale playing", "Functional harmony"],
    contentBlocks: [
      { id: "minor-three-systems", type: "text", heading: "Three minor forms solve different musical problems", paragraphs: ["A natural minor uses 1-2-flat3-4-5-flat6-flat7. Harmonic minor raises degree 7 to create a leading tone and major V chord. Melodic minor raises 6 and 7 while ascending in common classical usage; descending practice often returns to natural minor, though contemporary styles may use either form by color.", "Relative minor shares a key signature with a major key: A minor and C major. Parallel minor shares a tonic but changes its collection: A major and A minor."] },
      { id: "a-natural-minor", type: "scale-pattern", heading: "A natural minor keeps flat 6 and flat 7", root: "A", collectionName: "natural minor", formulaSemitones: [0,2,3,5,7,8,10], notes: ["A","B","C","D","E","F","G"], degrees: ["1","2","b3","4","5","b6","b7"], positions: [
        { string: 5, fret: 0, degree: "1" }, { string: 5, fret: 2, degree: "2" }, { string: 5, fret: 3, degree: "b3" },
        { string: 4, fret: 0, degree: "4" }, { string: 4, fret: 2, degree: "5" }, { string: 4, fret: 3, degree: "b6" },
        { string: 3, fret: 0, degree: "b7" }, { string: 3, fret: 2, degree: "1" }
      ], explanation: "Hear the whole-step G-to-A arrival. Natural minor supports modal and relative-major relationships but does not supply a leading-tone G sharp.", accessibilityDescription: "A natural minor: A B C D E F G A from open string 5 through string 3 fret 2." },
      { id: "a-harmonic-minor", type: "scale-pattern", heading: "A harmonic minor raises degree 7", root: "A", collectionName: "harmonic minor", formulaSemitones: [0,2,3,5,7,8,11], notes: ["A","B","C","D","E","F","G#"], degrees: ["1","2","b3","4","5","b6","7"], positions: [
        { string: 5, fret: 0, degree: "1" }, { string: 5, fret: 2, degree: "2" }, { string: 5, fret: 3, degree: "b3" },
        { string: 4, fret: 0, degree: "4" }, { string: 4, fret: 2, degree: "5" }, { string: 4, fret: 3, degree: "b6" },
        { string: 3, fret: 1, degree: "7" }, { string: 3, fret: 2, degree: "1" }
      ], explanation: "G sharp sits one semitone below A, strengthening leading-tone pull and turning the E chord into major V or E7.", accessibilityDescription: "A harmonic minor changes G to G sharp at string 3 fret 1 before tonic A at fret 2." },
      { id: "a-melodic-minor", type: "scale-pattern", heading: "A melodic minor raises degrees 6 and 7", root: "A", collectionName: "melodic minor ascending", formulaSemitones: [0,2,3,5,7,9,11], notes: ["A","B","C","D","E","F#","G#"], degrees: ["1","2","b3","4","5","6","7"], positions: [
        { string: 5, fret: 0, degree: "1" }, { string: 5, fret: 2, degree: "2" }, { string: 5, fret: 3, degree: "b3" },
        { string: 4, fret: 0, degree: "4" }, { string: 4, fret: 2, degree: "5" }, { string: 4, fret: 4, degree: "6" },
        { string: 3, fret: 1, degree: "7" }, { string: 3, fret: 2, degree: "1" }
      ], explanation: "Raised F sharp smooths the melodic route toward G sharp and A. Compare all three forms over a sustained A rather than memorizing them in isolation.", accessibilityDescription: "A melodic minor ascending changes F and G to F sharp at string 4 fret 4 and G sharp at string 3 fret 1." },
      { id: "minor-harmony-map", type: "progression-chart", heading: "Natural-minor harmony plus dominant V", key: "A", meter: "4/4", measures: [
        { label: "Tonic", chord: "Am", romanNumeral: "i", nashvilleNumber: "1m", beats: 4 },
        { label: "Predominant", chord: "Dm", romanNumeral: "iv", nashvilleNumber: "4m", beats: 4 },
        { label: "Natural dominant", chord: "Em", romanNumeral: "v", nashvilleNumber: "5m", beats: 4 },
        { label: "Raised-7 dominant", chord: "E", romanNumeral: "V", nashvilleNumber: "5", beats: 4 },
        { label: "Relative major", chord: "C", romanNumeral: "III", nashvilleNumber: "b3", beats: 4 },
        { label: "Subtonic", chord: "G", romanNumeral: "VII", nashvilleNumber: "b7", beats: 4 }
      ], explanation: "Natural minor gives minor v. Borrowing raised degree 7 from harmonic minor creates major V and a stronger V-i cadence. Label the altered G sharp rather than pretending every chord came from one unchanged collection.", accessibilityDescription: "A-minor function map: A minor i, D minor iv, E minor v, E major V with G sharp, C major III, and G major VII." },
      { id: "minor-relative-song", type: "lead-sheet", heading: "Contrast tonic identity, not just chord inventory", songTitle: "After the Rainline", key: "A", meter: "6/8", tempo: 68, capo: 0, sections: [
        { name: "Minor verse", repeatCount: 2, measures: [{ chord: "Am", cue: "tonic; low register", beats: 6 }, { chord: "G", cue: "natural-minor b7", beats: 6 }, { chord: "Dm", cue: "predominant", beats: 6 }, { chord: "E", cue: "G sharp leads home", beats: 6 }] },
        { name: "Relative-major chorus", repeatCount: 2, measures: [{ chord: "C", cue: "new tonic focus; open register", beats: 6 }, { chord: "G", cue: "dominant of C", beats: 6 }, { chord: "Am", cue: "relative connection", beats: 6 }, { chord: "F", cue: "plagal color", beats: 6 }] },
        { name: "Return", repeatCount: 1, measures: [{ chord: "Dm", cue: "minor predominant", beats: 6 }, { chord: "E", cue: "major V", beats: 6 }, { chord: "Am", cue: "minor tonic", beats: 6 }] }
      ], explanation: "The verse confirms A minor through E major and G sharp. The chorus uses the shared notes but treats C as a temporary center through G-to-C behavior and register contrast.", accessibilityDescription: "Original six-eight song: A-minor verse Am G Dm E; relative-C-major chorus C G Am F; return Dm E Am." },
      ...stages("minor-three-forms", "minor scales and functional harmony", ["Hear natural, harmonic, and melodic minor over one A drone.", "Identify which degrees change and why.", "Compare A minor with relative C major and parallel A major."], ["Play each A-minor form while naming degrees.", "Build natural-minor triads, then alter G to G sharp for major V.", "Perform the verse and chorus while naming tonic center."], ["Use degree prompts without scale diagrams.", "Choose one minor form for a melodic purpose and explain it.", "Transpose i-iv-V-i to E minor."], ["Construct and play three minor forms from a named tonic.", "Perform an original minor verse and relative-major chorus.", "Identify tonic minor, major dominant, and leading-tone pull by ear."], ["Changed degrees and chord qualities are named accurately.", "Minor and relative-major centers are distinguished by musical behavior.", "Major V resolves with an audible leading-tone relationship."]),
      { id: "minor-color-reflection", type: "reflection", heading: "Choose each altered degree deliberately", prompt: "Describe where natural, harmonic, or melodic minor appears in your progression or melody; identify the relative and parallel major references; and explain one leading-tone resolution.", fieldLabel: "Minor-system analysis", placeholder: "Verse melody uses natural G over VII, then G sharp over E major to lead into A minor. Chorus shifts tonic focus to C major." }
    ],
    guidedExercises: [
      { id: "exercise.minor-compare", title: "One tonic, three sixth-and-seventh pairs", purpose: "Hear scale-system differences without changing root or register.", instructions: ["Sustain or repeat A.", "Play F-G-A, then F-G sharp-A, then F sharp-G sharp-A.", "Sing each pair before replaying.", "Name the minor form and melodic effect."], successCriteria: ["Tonic A remains stable.", "Changed degrees are named.", "The three resolutions sound and feel distinct."], reduceDifficultyWhen: ["Compare natural and harmonic minor only."], increaseDifficultyWhen: ["Transfer the comparison to E minor."], relatedSkills: ["minor scales", "ear training", "leading tone"] },
      { id: "exercise.minor-verse-chorus", title: "Minor verse, relative-major chorus", purpose: "Create tonic contrast with a shared pitch collection.", instructions: ["Write a four-chord minor verse ending with major V.", "Write a relative-major chorus that confirms its tonic.", "Change register or density between sections.", "Perform the transition without stopping."], successCriteria: ["The verse confirms minor tonic.", "The chorus confirms relative major through behavior, not label alone.", "The boundary creates audible contrast."], reduceDifficultyWhen: ["Use the model harmony with an original rhythm."], increaseDifficultyWhen: ["Add a melodic-minor line over V."], relatedSkills: ["songwriting", "minor harmony", "form"] }
    ],
    commonMistakes: [
      { id: "mistake.minor-one-form", symptom: "Every minor context is treated as natural minor only.", likelyCause: "Scale shape has replaced harmonic listening.", adjustment: "Compare degree 7 over minor v and major V, then choose by function." },
      { id: "mistake.minor-relative", symptom: "Relative and parallel minor are confused.", likelyCause: "Shared key signature and shared tonic are being merged.", adjustment: "State both tonic and collection: A minor/C major share notes; A minor/A major share tonic." },
      { id: "mistake.minor-center", symptom: "The chorus uses C-major chords but still sounds centered on A.", likelyCause: "Chord inventory changed without cadence or phrase emphasis.", adjustment: "Use G-to-C motion, begin or end phrases on C, and shift register." }
    ],
    knowledgeChecks: [
      { id: "check.minor-harmonic", prompt: "Which degree changes from A natural minor to A harmonic minor?", options: ["G becomes G sharp", "F becomes F sharp", "C becomes C sharp"], correctAnswer: "G becomes G sharp", explanation: "Raised degree 7 creates the leading tone to A and supports E major V." },
      { id: "check.minor-relative", prompt: "How are A minor and C major related?", options: ["They are relative and share a key signature", "They are parallel and share a tonic", "They have no common notes"], correctAnswer: "They are relative and share a key signature", explanation: "They share pitch material but organize it around different tonics." },
      { id: "check.minor-dominant", prompt: "Why is E major often used in A minor?", options: ["Its G sharp acts as a leading tone to A", "E major belongs unchanged to A natural minor", "It removes dominant function"], correctAnswer: "Its G sharp acts as a leading tone to A", explanation: "Harmonic-minor degree 7 strengthens V-i resolution." }
    ],
    masteryCriteria: [
      { id: "mastery.minor-scales", description: "Construct and perform natural, harmonic, and melodic minor in two positions or registers.", verification: "performance-checklist", required: true },
      { id: "mastery.minor-relations", description: "Distinguish relative and parallel minor with tonic and collection examples.", verification: "guided-self-check", required: true },
      { id: "mastery.minor-harmony", description: "Construct minor-key triads and explain minor v versus major V.", verification: "reflection", required: true },
      { id: "mastery.minor-song", description: "Perform an original minor verse and contrasting relative-major chorus.", verification: "performance-checklist", required: true },
      { id: "mastery.minor-ear", description: "Identify tonic minor, major dominant, and leading-tone pull in clear examples.", verification: "guided-self-check", required: true }
    ],
    reviewRecommendation: "Next session, compare the three forms over the same tonic before playing the song. After one week, transpose i-iv-V-i and the relative-major contrast to a new minor key.",
    optionalExtension: "Write two endings for one minor melody: natural flat-7 to tonic and harmonic leading-tone to tonic, then compare their formal effect."
  }
];

export const levelThreeReviewPlans: readonly CurriculumReviewPlan[] = [
  { id: "review.caged-fretboard-integration", unitId: "unit.caged-fretboard-integration", immediateReview: ["Retrieve one C root and its 1-3-5 fragment in each region."], nextSessionReview: ["Locate one named major chord in five regions without diagrams."], oneWeekReview: ["Revoice a different progression through three registers."], longTermReview: ["Attach every new arpeggio and scale pattern to named roots and chord tones."] },
  { id: "review.diatonic-harmony-major-keys", unitId: "unit.diatonic-harmony-major-keys", immediateReview: ["Sing roots and state the major-key quality pattern."], nextSessionReview: ["Harmonize a new major key and perform four cadences."], oneWeekReview: ["Analyze function and cadence in an unfamiliar progression."], longTermReview: ["Use function to transpose, revise, and explain songwriting choices."] },
  { id: "review.relative-minor-minor-key-harmony", unitId: "unit.relative-minor-minor-key-harmony", immediateReview: ["Compare natural, harmonic, and melodic minor degrees 6 and 7."], nextSessionReview: ["Build i-iv-V-i and retrieve the relative-major contrast."], oneWeekReview: ["Transpose the scale and song process to a new minor tonic."], longTermReview: ["Name the active minor system whenever altered degrees affect melody or harmony."] }
];
