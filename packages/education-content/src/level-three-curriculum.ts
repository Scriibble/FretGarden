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
  },
  {
    id: "lesson.seventh-chords-arpeggio-soloing",
    unitId: "unit.seventh-chords-arpeggio-soloing",
    order: 1,
    title: "Target seventh-chord color instead of running a scale",
    objective: "Build major seventh, minor seventh, dominant seventh, half-diminished, and diminished seventh sounds; play practical arpeggio routes; identify guide tones; and outline a progression with chord tones.",
    whyItMatters: "Seventh chords make harmony more specific. When the third and seventh are clear, rhythm parts sound intentional and solos begin to follow the chord changes instead of floating above them.",
    estimatedMinutes: 150,
    priorKnowledge: ["Triad formulas", "Minor and major diatonic harmony", "Movable roots", "Chord-tone naming", "Basic improvisation"],
    contentBlocks: [
      { id: "seventh-quality-text", type: "text", heading: "Sevenths add function and color", paragraphs: ["A seventh chord adds one more stacked third to a triad. Major seventh sounds stable and luminous; minor seventh softens minor harmony; dominant seventh contains a major third and minor seventh that pull toward resolution.", "Half-diminished seventh is a diminished triad plus a minor seventh. Fully diminished seventh stacks minor thirds. Learn each quality by formula, guide tones, and sound rather than by one grip."] },
      { id: "c-major-seven-arpeggio", type: "scale-pattern", heading: "Cmaj7: root, 3, 5, 7", root: "C", collectionName: "major seventh arpeggio", formulaSemitones: [0,4,7,11], notes: ["C","E","G","B"], degrees: ["1","3","5","7"], positions: [
        { string: 5, fret: 3, degree: "1" }, { string: 4, fret: 2, degree: "3" }, { string: 4, fret: 5, degree: "5" }, { string: 3, fret: 4, degree: "7" }
      ], explanation: "Hear the major seventh B as color, not as a passing mistake. Resolve it down to A or up to C deliberately.", accessibilityDescription: "C major seven arpeggio: string 5 fret 3 C, string 4 fret 2 E, string 4 fret 5 G, string 3 fret 4 B." },
      { id: "d-minor-seven-arpeggio", type: "scale-pattern", heading: "Dm7: root, flat 3, 5, flat 7", root: "D", collectionName: "minor seventh arpeggio", formulaSemitones: [0,3,7,10], notes: ["D","F","A","C"], degrees: ["1","b3","5","b7"], positions: [
        { string: 5, fret: 5, degree: "1" }, { string: 4, fret: 3, degree: "b3" }, { string: 4, fret: 7, degree: "5" }, { string: 3, fret: 5, degree: "b7" }
      ], explanation: "The flat third and flat seventh define the minor-seven sound. Sing F to C before adding speed.", accessibilityDescription: "D minor seven arpeggio: string 5 fret 5 D, string 4 fret 3 F, string 4 fret 7 A, string 3 fret 5 C." },
      { id: "g-dominant-seven-arpeggio", type: "scale-pattern", heading: "G7: root, 3, 5, flat 7", root: "G", collectionName: "dominant seventh arpeggio", formulaSemitones: [0,4,7,10], notes: ["G","B","D","F"], degrees: ["1","3","5","b7"], positions: [
        { string: 6, fret: 3, degree: "1" }, { string: 5, fret: 2, degree: "3" }, { string: 5, fret: 5, degree: "5" }, { string: 4, fret: 3, degree: "b7" }
      ], explanation: "The B and F tritone wants motion toward C and E. Those two guide tones explain why G7 resolves so strongly to C.", accessibilityDescription: "G dominant seven arpeggio: string 6 fret 3 G, string 5 fret 2 B, string 5 fret 5 D, string 4 fret 3 F." },
      { id: "b-half-diminished-arpeggio", type: "scale-pattern", heading: "Bm7b5: root, flat 3, flat 5, flat 7", root: "B", collectionName: "half-diminished seventh arpeggio", formulaSemitones: [0,3,6,10], notes: ["B","D","F","A"], degrees: ["1","b3","b5","b7"], positions: [
        { string: 5, fret: 2, degree: "1" }, { string: 5, fret: 5, degree: "b3" }, { string: 4, fret: 3, degree: "b5" }, { string: 4, fret: 7, degree: "b7" }
      ], explanation: "Half-diminished often appears as ii in minor-key ii-V-i progressions. The flat five makes its instability audible.", accessibilityDescription: "B half-diminished arpeggio: string 5 fret 2 B, string 5 fret 5 D, string 4 fret 3 F, string 4 fret 7 A." },
      { id: "b-diminished-seven-arpeggio", type: "scale-pattern", heading: "Bdim7: stacked minor thirds", root: "B", collectionName: "fully diminished seventh arpeggio", formulaSemitones: [0,3,6,9], notes: ["B","D","F","Ab"], degrees: ["1","b3","b5","bb7"], positions: [
        { string: 5, fret: 2, degree: "1" }, { string: 5, fret: 5, degree: "b3" }, { string: 4, fret: 3, degree: "b5" }, { string: 4, fret: 6, degree: "bb7" }
      ], explanation: "Fully diminished seventh chords are symmetrical. Name the chord by its function and resolution, not only by the repeating shape.", accessibilityDescription: "B diminished seven arpeggio: string 5 fret 2 B, string 5 fret 5 D, string 4 fret 3 F, string 4 fret 6 A flat." },
      { id: "seventh-guide-tone-chart", type: "progression-chart", heading: "Guide tones steer the progression", key: "C", meter: "4/4", measures: [
        { label: "Home color", chord: "Cmaj7", romanNumeral: "Imaj7", nashvilleNumber: "1maj7", beats: 4 },
        { label: "Relative color", chord: "Am7", romanNumeral: "vi7", nashvilleNumber: "6m7", beats: 4 },
        { label: "Predominant", chord: "Dm7", romanNumeral: "ii7", nashvilleNumber: "2m7", beats: 4 },
        { label: "Dominant", chord: "G7", romanNumeral: "V7", nashvilleNumber: "5-7", beats: 4 }
      ], explanation: "Track the third and seventh of each chord first. They provide more harmonic information than fast scalar runs.", accessibilityDescription: "C major seventh progression: C major seven, A minor seven, D minor seven, G dominant seven." },
      { id: "seventh-outline-tab", type: "tablature", heading: "Eight-beat chord-tone outline", tempo: 70, events: [
        { count: "1", notes: [{ string: 5, fret: 3 }], duration: "quarter", rest: false },
        { count: "2", notes: [{ string: 4, fret: 2 }], duration: "quarter", rest: false },
        { count: "3", notes: [{ string: 3, fret: 5 }], duration: "quarter", rest: false },
        { count: "4", notes: [{ string: 3, fret: 4 }], duration: "quarter", rest: false },
        { count: "1", notes: [{ string: 4, fret: 3 }], duration: "quarter", rest: false },
        { count: "2", notes: [{ string: 3, fret: 5 }], duration: "quarter", rest: false },
        { count: "3", notes: [{ string: 5, fret: 2 }], duration: "quarter", rest: false },
        { count: "4", notes: [{ string: 4, fret: 3 }], duration: "quarter", rest: false }
      ], explanation: "The first bar outlines Cmaj7. The second bar uses guide tones from Dm7 and G7 so the line can be heard as harmony, not a scale exercise.", accessibilityDescription: "Quarter-note tab outline at 70 beats per minute: C, E, C, B, then F, C, B, F." },
      ...stages("seventh-chord-arpeggios", "seventh-chord qualities and arpeggio soloing", ["Hear each seventh quality as a four-note color.", "Observe formula, guide tones, and one practical fingering.", "Listen for dominant seventh tension resolving to major tonic."], ["Build each quality from a named root.", "Play only thirds and sevenths through the model progression.", "Add roots and fifths after guide tones are stable."], ["Use formula prompts without note names.", "Improvise two beats per chord with only chord tones.", "Check guide tones after the take, not during it."], ["Identify and play five seventh qualities from formula.", "Outline a ii-V-I or I-vi-ii-V progression with chord tones.", "Explain which tones make the harmony clear."], ["Quality formulas are accurate.", "Guide tones land on strong beats.", "The improvised outline follows the changing chord names."]),
      { id: "seventh-reflection", type: "reflection", heading: "Name the notes that carried the harmony", prompt: "For one short solo pass, list the third and seventh of every chord, circle the notes that landed on beats 1 or 3, and describe one resolution you heard.", fieldLabel: "Guide-tone evidence", placeholder: "Over G7 I landed B on beat 1 and F on beat 3, then resolved B to C in the next measure." }
    ],
    guidedExercises: [
      { id: "exercise.seventh-quality-build", title: "Formula before grip", purpose: "Make seventh-chord knowledge transferable across roots.", instructions: ["Choose a root.", "State the quality formula.", "Find root, third, fifth, and seventh in one position.", "Only then choose a playable voicing or arpeggio route."], successCriteria: ["Every note matches the formula.", "The third and seventh are named.", "The same quality transfers to a second root."], reduceDifficultyWhen: ["Use Cmaj7, Dm7, and G7 only."], increaseDifficultyWhen: ["Add half-diminished and fully diminished in a minor ii-V-i."], relatedSkills: ["seventh chords", "arpeggios", "fretboard"] },
      { id: "exercise.guide-tone-solo", title: "Two guide tones, then a line", purpose: "Make improvisation follow the harmony.", instructions: ["Play only thirds and sevenths through I-vi-ii-V.", "Add one approach note before each target.", "Keep the rhythm simple and in time.", "Record or write the target notes after playing."], successCriteria: ["Guide tones appear on strong beats.", "Non-chord tones resolve by step.", "The line changes with the progression."], reduceDifficultyWhen: ["Use half notes only."], increaseDifficultyWhen: ["Transpose to G major."], relatedSkills: ["improvisation", "guide tones", "voice leading"] }
    ],
    commonMistakes: [
      { id: "mistake.seventh-formula", symptom: "A dominant seventh is played as a major seventh.", likelyCause: "The seventh quality was not measured from the root.", adjustment: "Compare B and B flat over C, then name the interval before choosing a grip." },
      { id: "mistake.seventh-scale", symptom: "The solo uses correct scale notes but ignores chord changes.", likelyCause: "Scale membership is replacing harmonic targeting.", adjustment: "Restrict the next pass to thirds and sevenths on beats 1 and 3." },
      { id: "mistake.seventh-speed", symptom: "Arpeggios are rushed and uneven.", likelyCause: "The route is being treated as a lick instead of named chord tones.", adjustment: "Speak each degree before playing it at 60 BPM." }
    ],
    knowledgeChecks: [
      { id: "check.seventh-dominant", prompt: "Which formula describes a dominant seventh chord?", options: ["1-3-5-b7", "1-3-5-7", "1-b3-b5-bb7"], correctAnswer: "1-3-5-b7", explanation: "Dominant seventh combines a major triad with a minor seventh." },
      { id: "check.seventh-guide", prompt: "Which tones usually define seventh-chord function most clearly?", options: ["The third and seventh", "Only the root", "Only repeated fifths"], correctAnswer: "The third and seventh", explanation: "Thirds and sevenths reveal quality and resolution tendency." },
      { id: "check.seventh-half-dim", prompt: "What is the formula for half-diminished seventh?", options: ["1-b3-b5-b7", "1-b3-b5-bb7", "1-3-5-b7"], correctAnswer: "1-b3-b5-b7", explanation: "Half-diminished is a diminished triad plus a minor seventh." }
    ],
    masteryCriteria: [
      { id: "mastery.seventh-qualities", description: "Build and identify five seventh-chord qualities from formula.", verification: "guided-self-check", required: true },
      { id: "mastery.seventh-arpeggios", description: "Play practical arpeggio routes with named chord tones.", verification: "performance-checklist", required: true },
      { id: "mastery.seventh-guide-tones", description: "Target thirds and sevenths through a changing progression.", verification: "performance-checklist", required: true },
      { id: "mastery.seventh-analysis", description: "Explain one guide-tone resolution in writing.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, retrieve formulas before diagrams. After one week, outline a new ii-V-I or I-vi-ii-V using only guide tones first.",
    optionalExtension: "Use the same guide-tone line in two octaves and compare which register states the harmony more clearly."
  },
  {
    id: "lesson.melodic-development-motif",
    unitId: "unit.melodic-development-motif",
    order: 1,
    title: "Develop one idea until it sounds intentional",
    objective: "Create a short motif, transform it through sequence, transposition, rhythm, register, articulation, and endings, then shape a coherent sixteen-bar melody.",
    whyItMatters: "A memorable melody usually grows from a small idea handled with care. Motif development gives solos and songs continuity without repeating the same fragment until it goes flat.",
    estimatedMinutes: 135,
    priorKnowledge: ["Major and minor scale degrees", "Eighth-note and sixteenth-note rhythm", "Phrase endings", "Basic tablature", "Register choice"],
    contentBlocks: [
      { id: "motif-definition", type: "text", heading: "A motif is an idea you can recognize after it changes", paragraphs: ["A motif may be three notes, one rhythm, a contour, or an articulation pattern. Development means the listener can still recognize the idea after it moves, stretches, answers itself, or changes register.", "Useful transformations include sequence, transposition, rhythmic augmentation or compression, articulation change, register shift, and a new ending. A phrase needs contour, breath, climax, and resolution, not just correct notes."] },
      { id: "motif-original-tab", type: "tablature", heading: "Seed motif in C major", tempo: 76, events: [
        { count: "1", notes: [{ string: 3, fret: 0 }], duration: "eighth", rest: false },
        { count: "&", notes: [{ string: 3, fret: 2 }], duration: "eighth", rest: false },
        { count: "2", notes: [{ string: 2, fret: 1 }], duration: "quarter", rest: false },
        { count: "3", notes: [], duration: "quarter", rest: true },
        { count: "4", notes: [{ string: 2, fret: 0 }], duration: "quarter", rest: false }
      ], explanation: "This G-A-C-B cell gives a rising third, a pause, and a softer ending. The rhythm is part of the motif.", accessibilityDescription: "Motif tab at 76 beats per minute: G eighth, A eighth, C quarter, quarter rest, B quarter." },
      { id: "motif-transformed-tab", type: "tablature", heading: "Same motif, developed across four bars", tempo: 76, events: [
        { count: "1.1", notes: [{ string: 3, fret: 0 }], duration: "eighth", rest: false },
        { count: "1.&", notes: [{ string: 3, fret: 2 }], duration: "eighth", rest: false },
        { count: "1.2", notes: [{ string: 2, fret: 1 }], duration: "quarter", rest: false },
        { count: "1.3", notes: [], duration: "quarter", rest: true },
        { count: "1.4", notes: [{ string: 2, fret: 0 }], duration: "quarter", rest: false },
        { count: "2.1", notes: [{ string: 3, fret: 2 }], duration: "eighth", rest: false },
        { count: "2.&", notes: [{ string: 2, fret: 1 }], duration: "eighth", rest: false },
        { count: "2.2", notes: [{ string: 2, fret: 3 }], duration: "quarter", rest: false },
        { count: "2.3", notes: [], duration: "quarter", rest: true },
        { count: "2.4", notes: [{ string: 1, fret: 0 }], duration: "quarter", rest: false },
        { count: "3.1", notes: [{ string: 2, fret: 1 }], duration: "quarter", rest: false },
        { count: "3.2", notes: [{ string: 2, fret: 3 }], duration: "quarter", rest: false },
        { count: "3.3", notes: [{ string: 1, fret: 0 }], duration: "quarter", rest: false },
        { count: "3.4", notes: [{ string: 1, fret: 1 }], duration: "quarter", rest: false },
        { count: "4.1", notes: [{ string: 2, fret: 1 }], duration: "half", rest: false },
        { count: "4.3", notes: [{ string: 3, fret: 0 }], duration: "half", rest: false }
      ], explanation: "The second bar sequences the idea higher. The third stretches the rhythm toward a small climax, and the fourth answers with a calmer descent.", accessibilityDescription: "Four-bar developed melody: original G-A-C-B, sequenced A-C-D-E, expanded C-D-E-F, resolved C to G." },
      { id: "motif-phrase-plan", type: "progression-chart", heading: "Phrase behavior under the melody", key: "C", meter: "4/4", measures: [
        { label: "Question", chord: "C", romanNumeral: "I", nashvilleNumber: "1", beats: 4 },
        { label: "Sequence", chord: "F", romanNumeral: "IV", nashvilleNumber: "4", beats: 4 },
        { label: "Climax", chord: "G", romanNumeral: "V", nashvilleNumber: "5", beats: 4 },
        { label: "Answer", chord: "C", romanNumeral: "I", nashvilleNumber: "1", beats: 4 }
      ], explanation: "Harmony can help the motif behave like a phrase: statement, sequence, tension, answer.", accessibilityDescription: "Four-bar phrase plan in C: C question, F sequence, G climax, C answer." },
      ...stages("motif-development", "motif transformation and phrase shape", ["Listen to a short motif and identify contour, rhythm, and ending.", "Observe sequence, register shift, and changed ending.", "Compare repetition with development."], ["Write a three- to five-note motif.", "Transform only one variable at a time.", "Place an answer phrase after a question phrase."], ["Remove the transformation menu and choose two changes by ear.", "Keep the motif recognizable without copying every note.", "Revise the climax if the phrase stays flat."], ["Compose and perform a sixteen-bar melody from one motif.", "Label at least four transformations.", "Explain phrase contour, breath, climax, and resolution."], ["The motif remains recognizable.", "Transformations are named and audible.", "The final melody has a clear question, answer, and arrival."]),
      { id: "motif-reflection", type: "reflection", heading: "Prove the idea survived the changes", prompt: "Write your motif, list four transformations, and explain which bars create question, answer, climax, and resolution.", fieldLabel: "Motif development notes", placeholder: "Bars 1-2 state and sequence the rhythm; bar 9 moves it up an octave; bar 15 changes the ending to resolve on scale degree 1." }
    ],
    guidedExercises: [
      { id: "exercise.motif-one-variable", title: "Change one thing", purpose: "Learn development without losing identity.", instructions: ["Play the seed motif twice.", "Change only pitch direction, then only rhythm, then only register.", "After each pass, ask whether the original idea is still recognizable.", "Keep the strongest version."], successCriteria: ["Only one variable changes per pass.", "The motif remains identifiable.", "At least one version improves phrase direction."], reduceDifficultyWhen: ["Use the model motif."], increaseDifficultyWhen: ["Transform the motif in minor."], relatedSkills: ["melody", "motif", "composition"] },
      { id: "exercise.sixteen-bar-melody", title: "Four phrases from one cell", purpose: "Turn development into a complete melody.", instructions: ["Write a four-bar question.", "Answer it with a related four-bar phrase.", "Use register or rhythm to create a second-half lift.", "Resolve the final phrase clearly."], successCriteria: ["All four phrases connect to the motif.", "There is a marked climax.", "The ending sounds intentional."], reduceDifficultyWhen: ["Write eight bars first."], increaseDifficultyWhen: ["Harmonize the melody with a functional progression."], relatedSkills: ["phrase", "form", "songwriting"] }
    ],
    commonMistakes: [
      { id: "mistake.motif-copy", symptom: "Every phrase is identical.", likelyCause: "Recognition is being confused with exact repetition.", adjustment: "Keep rhythm but change direction or ending." },
      { id: "mistake.motif-random", symptom: "Later phrases do not relate to the opening idea.", likelyCause: "Too many variables changed at once.", adjustment: "Choose one transformation and label it before playing." },
      { id: "mistake.motif-no-arc", symptom: "The melody has notes but no climax or answer.", likelyCause: "Phrase shape was not planned.", adjustment: "Mark the highest or most intense moment before revising surrounding bars." }
    ],
    knowledgeChecks: [
      { id: "check.motif-sequence", prompt: "What is a sequence?", options: ["Repeating an idea at a new pitch level", "Playing every note louder", "Changing tuning"], correctAnswer: "Repeating an idea at a new pitch level", explanation: "A sequence preserves recognizable shape while moving it." },
      { id: "check.motif-development", prompt: "Which change is most likely to keep a motif recognizable?", options: ["Change one variable at a time", "Change pitch, rhythm, register, and articulation all at once", "Remove the rhythm"], correctAnswer: "Change one variable at a time", explanation: "Limited change preserves identity while creating motion." },
      { id: "check.motif-phrase", prompt: "What does a phrase climax provide?", options: ["A clear point of emphasis or arrival within the line", "A required highest fret only", "A place to ignore rhythm"], correctAnswer: "A clear point of emphasis or arrival within the line", explanation: "Climax is musical emphasis, not just physical height." }
    ],
    masteryCriteria: [
      { id: "mastery.motif-seed", description: "Create and perform a recognizable motif.", verification: "performance-checklist", required: true },
      { id: "mastery.motif-transform", description: "Apply and label at least four motif transformations.", verification: "reflection", required: true },
      { id: "mastery.motif-melody", description: "Perform a coherent sixteen-bar melody with phrase shape.", verification: "performance-checklist", required: true }
    ],
    reviewRecommendation: "Next session, retrieve the motif and transform it in a new register. After one week, create a second melody from the same seed in a different key or meter.",
    optionalExtension: "Use the motif as both melody and rhythm-guitar strum pattern, then compare how identity changes across roles."
  },
  {
    id: "lesson.chord-tone-improvisation",
    unitId: "unit.chord-tone-improvisation",
    order: 1,
    title: "Make improvised lines reveal the chord changes",
    objective: "Connect triad and seventh arpeggios through a progression, target nearest chord tones, use approach notes on weak beats, and compose an eight-bar solo that follows harmony.",
    whyItMatters: "Chord-tone improvisation turns a scale into a map of moments. The listener can hear the progression inside the line because strong beats land on notes the chord actually owns.",
    estimatedMinutes: 145,
    priorKnowledge: ["Triad and seventh arpeggios", "Guide tones", "Major-key progressions", "Eighth-note rhythm", "Motif development"],
    contentBlocks: [
      { id: "chord-tone-rule", type: "text", heading: "Strong beats carry the chord", paragraphs: ["A chord-tone line does not forbid scales. It gives non-chord tones a job: approach, pass, neighbor, anticipate, or suspend before resolving.", "Start by finding the nearest chord tone when the harmony changes. Smooth voice leading often matters more than jumping to roots. Sing thirds and sevenths because they reveal quality fastest."] },
      { id: "chord-tone-targets", type: "progression-chart", heading: "Targets for an eight-bar solo", key: "C", meter: "4/4", measures: [
        { label: "1", chord: "Cmaj7", romanNumeral: "Imaj7", nashvilleNumber: "1maj7", beats: 4 },
        { label: "2", chord: "Am7", romanNumeral: "vi7", nashvilleNumber: "6m7", beats: 4 },
        { label: "3", chord: "Dm7", romanNumeral: "ii7", nashvilleNumber: "2m7", beats: 4 },
        { label: "4", chord: "G7", romanNumeral: "V7", nashvilleNumber: "5-7", beats: 4 },
        { label: "5", chord: "Em7", romanNumeral: "iii7", nashvilleNumber: "3m7", beats: 4 },
        { label: "6", chord: "Am7", romanNumeral: "vi7", nashvilleNumber: "6m7", beats: 4 },
        { label: "7", chord: "Dm7-G7", romanNumeral: "ii7-V7", nashvilleNumber: "2m7-5-7", beats: 4 },
        { label: "8", chord: "Cmaj7", romanNumeral: "Imaj7", nashvilleNumber: "1maj7", beats: 4 }
      ], explanation: "Before improvising, choose one target for beat 1 of every measure. Then connect targets with stepwise approach notes.", accessibilityDescription: "Eight-bar C progression: C major seven, A minor seven, D minor seven, G seven, E minor seven, A minor seven, D minor seven to G seven, C major seven." },
      { id: "chord-tone-solo-tab", type: "tablature", heading: "Model solo: chord tones on strong beats", tempo: 72, events: [
        { count: "1.1", notes: [{ string: 4, fret: 2 }], duration: "quarter", rest: false },
        { count: "1.2", notes: [{ string: 3, fret: 0 }], duration: "quarter", rest: false },
        { count: "1.3", notes: [{ string: 3, fret: 4 }], duration: "quarter", rest: false },
        { count: "1.4", notes: [{ string: 2, fret: 1 }], duration: "quarter", rest: false },
        { count: "2.1", notes: [{ string: 3, fret: 2 }], duration: "quarter", rest: false },
        { count: "2.2", notes: [{ string: 2, fret: 1 }], duration: "quarter", rest: false },
        { count: "2.3", notes: [{ string: 1, fret: 0 }], duration: "quarter", rest: false },
        { count: "2.4", notes: [{ string: 2, fret: 1 }], duration: "quarter", rest: false },
        { count: "3.1", notes: [{ string: 4, fret: 3 }], duration: "quarter", rest: false },
        { count: "3.2", notes: [{ string: 3, fret: 5 }], duration: "quarter", rest: false },
        { count: "3.3", notes: [{ string: 2, fret: 3 }], duration: "quarter", rest: false },
        { count: "3.4", notes: [{ string: 1, fret: 1 }], duration: "quarter", rest: false },
        { count: "4.1", notes: [{ string: 5, fret: 2 }], duration: "quarter", rest: false },
        { count: "4.2", notes: [{ string: 4, fret: 3 }], duration: "quarter", rest: false },
        { count: "4.3", notes: [{ string: 2, fret: 1 }], duration: "quarter", rest: false },
        { count: "4.4", notes: [{ string: 2, fret: 0 }], duration: "quarter", rest: false }
      ], explanation: "This four-bar excerpt places chord tones on strong beats and uses short, singable motion. Extend the process through eight bars before adding faster notes.", accessibilityDescription: "Model solo quarters: E G B C, A C E C, F C D F, B F C B." },
      { id: "approach-note-grid", type: "rhythm-grid", heading: "Approach notes belong on lighter counts first", meter: "4/4", events: [
        { count: "1", action: "down", accent: true }, { count: "&", action: "up", accent: false },
        { count: "2", action: "down", accent: false }, { count: "&", action: "up", accent: false },
        { count: "3", action: "down", accent: true }, { count: "&", action: "up", accent: false },
        { count: "4", action: "down", accent: false }, { count: "&", action: "up", accent: false }
      ], explanation: "Aim chord tones at accented beats 1 and 3. Use weak eighths for chromatic or scalar approaches until resolution is reliable.", accessibilityDescription: "Four-four eighth-note grid with accents on beats one and three for chord-tone targets." },
      ...stages("chord-tone-improvisation", "targeted improvisation through changes", ["Observe target notes on beat 1 of each chord.", "Hear approach notes resolve to stable tones.", "Compare a static scale run with a chord-tone outline."], ["Choose one target per measure.", "Play half-note guide tones before adding rhythm.", "Add one neighbor or passing tone between targets."], ["Hide the target list and mark mistakes after the take.", "Keep only lines that resolve non-chord tones.", "Reduce support to Roman numerals and chord symbols."], ["Perform an eight-bar solo that follows the changes.", "Identify chord tones, approaches, suspensions, or anticipations in the line.", "Sing thirds and sevenths for the progression."], ["Strong beats contain accurate chord tones.", "Approach tones resolve by step or clear intention.", "The line changes when the harmony changes."]),
      { id: "chord-tone-reflection", type: "reflection", heading: "Audit the solo like a musician", prompt: "Write the target note for each measure, identify two non-chord tones and their jobs, and explain where the line most clearly reveals the progression.", fieldLabel: "Chord-tone solo audit", placeholder: "Measure 4 targets B and F for G7; C anticipates Cmaj7 before resolving into the final measure." }
    ],
    guidedExercises: [
      { id: "exercise.nearest-target", title: "Nearest chord tone", purpose: "Build smooth improvised voice leading.", instructions: ["Choose one note from the current chord.", "When the chord changes, move to the nearest chord tone.", "Prefer step or small skips over root jumping.", "Name each target after playing."], successCriteria: ["Targets belong to the active chord.", "Motion is mostly stepwise or small.", "The line remains in time."], reduceDifficultyWhen: ["Use triads only."], increaseDifficultyWhen: ["Use seventh chords and chromatic approaches."], relatedSkills: ["improvisation", "voice leading", "arpeggios"] },
      { id: "exercise.eight-bar-solo", title: "Compose before improvising", purpose: "Make improvisation evidence visible.", instructions: ["Write targets for eight bars.", "Compose one simple line using those targets.", "Perform it twice, then alter two measures spontaneously.", "Keep a written audit of changed notes."], successCriteria: ["Written and performed targets match.", "Altered measures still follow harmony.", "The final take has clear beginning, middle, and ending."], reduceDifficultyWhen: ["Compose four bars first."], increaseDifficultyWhen: ["Transpose to a new key."], relatedSkills: ["soloing", "composition", "analysis"] }
    ],
    commonMistakes: [
      { id: "mistake.chord-tone-root-jump", symptom: "Every chord change leaps to the root.", likelyCause: "Root knowledge is being used without voice-leading awareness.", adjustment: "Find the nearest third or seventh instead." },
      { id: "mistake.chord-tone-unresolved", symptom: "Chromatic notes sound accidental.", likelyCause: "Approach notes are landing on strong beats without resolution.", adjustment: "Move non-chord tones to weak counts and resolve by step." },
      { id: "mistake.chord-tone-static", symptom: "The same pentatonic phrase repeats over every chord.", likelyCause: "The line is not responding to harmonic context.", adjustment: "Write one forced target for every measure before improvising." }
    ],
    knowledgeChecks: [
      { id: "check.chord-tone-strong", prompt: "Where should chord tones usually land first while learning this skill?", options: ["Strong beats such as 1 and 3", "Only after the barline", "Only on rests"], correctAnswer: "Strong beats such as 1 and 3", explanation: "Strong-beat chord tones help the listener hear the harmony." },
      { id: "check.chord-tone-approach", prompt: "What should most approach notes do?", options: ["Resolve to a target chord tone", "Avoid all chord tones", "Replace rhythm"], correctAnswer: "Resolve to a target chord tone", explanation: "Approach notes create motion toward a stable target." },
      { id: "check.chord-tone-nearest", prompt: "Why use the nearest chord tone at a change?", options: ["It creates smooth voice leading", "It makes every chord sound the same", "It prevents analysis"], correctAnswer: "It creates smooth voice leading", explanation: "Small motion often sounds connected and intentional." }
    ],
    masteryCriteria: [
      { id: "mastery.chord-tone-targets", description: "Choose accurate target tones for every measure of a progression.", verification: "guided-self-check", required: true },
      { id: "mastery.chord-tone-solo", description: "Perform an eight-bar solo whose strong beats follow the chords.", verification: "performance-checklist", required: true },
      { id: "mastery.chord-tone-audit", description: "Explain chord tones and non-chord-tone jobs in the line.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, improvise with half-note guide tones before adding eighth notes. After one week, audit a new solo and verify that the line changes with the harmony.",
    optionalExtension: "Restrict the entire solo to two adjacent strings and make the harmony clear through targets alone."
  },
  {
    id: "lesson.arrangement-multiple-guitar-parts",
    unitId: "unit.arrangement-multiple-guitar-parts",
    order: 1,
    title: "Arrange guitar parts so each role has a purpose",
    objective: "Design complementary guitar parts using register, voicing, rhythm, articulation, capo position, triads, partial chords, counterlines, silence, texture, and density.",
    whyItMatters: "Multiple guitar parts can make music wider and clearer, or they can collide. Arrangement is the craft of deciding who owns rhythm, register, motion, and space at each moment.",
    estimatedMinutes: 140,
    priorKnowledge: ["Lead-sheet reading", "Triads and partial voicings", "Rhythm-guitar groove", "Motif development", "Basic recording or loop practice"],
    contentBlocks: [
      { id: "arrangement-roles", type: "text", heading: "A part earns its place by doing a job", paragraphs: ["Useful guitar layers usually separate register, rhythm, articulation, and density. If two parts share the same range and strum pattern, one may need to simplify, move, answer, or rest.", "Capo, triads, partial chords, muted rhythm, pedal tones, ostinatos, and counterlines are arrangement tools. Silence is also a tool: it creates contrast and keeps important events audible."] },
      { id: "arrangement-source-chart", type: "lead-sheet", heading: "Source song for arrangement", songTitle: "Window Garden", key: "G", meter: "4/4", tempo: 82, capo: 0, sections: [
        { name: "Verse", repeatCount: 2, measures: [{ chord: "G", cue: "low open rhythm", beats: 4 }, { chord: "Em", cue: "lighter answer", beats: 4 }, { chord: "C", cue: "open space", beats: 4 }, { chord: "D", cue: "lift to turnaround", beats: 4 }] },
        { name: "Chorus", repeatCount: 2, measures: [{ chord: "C", cue: "wider texture", beats: 4 }, { chord: "G", cue: "arrival", beats: 4 }, { chord: "D", cue: "motion", beats: 4 }, { chord: "Em", cue: "release", beats: 4 }] },
        { name: "Tag", repeatCount: 1, measures: [{ chord: "C", cue: "thin texture", beats: 4 }, { chord: "D", cue: "build", beats: 4 }, { chord: "G", cue: "final home", beats: 4 }] }
      ], explanation: "Start with one readable chart. Then assign roles: low rhythm, upper triads, counterline, or intentional rests.", accessibilityDescription: "Original G song: verse G Em C D, chorus C G D Em, tag C D G." },
      { id: "arrangement-role-map", type: "progression-chart", heading: "Assign roles before adding notes", key: "G", meter: "4/4", measures: [
        { label: "Rhythm role", chord: "G", romanNumeral: "I", nashvilleNumber: "1", beats: 4 },
        { label: "Lighter answer", chord: "Em", romanNumeral: "vi", nashvilleNumber: "6m", beats: 4 },
        { label: "Upper triad color", chord: "C", romanNumeral: "IV", nashvilleNumber: "4", beats: 4 },
        { label: "Counterline setup", chord: "D", romanNumeral: "V", nashvilleNumber: "5", beats: 4 }
      ], explanation: "In solo practice, record or loop one part, then play the second part live. In ensemble practice, assign parts to players and reduce collisions before adding complexity.", accessibilityDescription: "Arrangement role map: rhythm guitar plays progression, second guitar plays upper triads, third or loop layer plays pedal or counterline." },
      { id: "arrangement-rhythm-grid", type: "rhythm-grid", heading: "Rhythm part leaves space", meter: "4/4", events: [
        { count: "1", action: "down", accent: true }, { count: "&", action: "rest", accent: false },
        { count: "2", action: "down", accent: false }, { count: "&", action: "up", accent: false },
        { count: "3", action: "mute", accent: true }, { count: "&", action: "up", accent: false },
        { count: "4", action: "down", accent: false }, { count: "&", action: "rest", accent: false }
      ], explanation: "The muted beat 3 and rests leave room for an upper counterline. Do not fill every eighth note unless the section needs density.", accessibilityDescription: "Four-four rhythm grid: accented down on one, rest on and, down-up on two and, accented mute on three, up on and, down on four, rest on final and." },
      { id: "arrangement-counterline-tab", type: "tablature", heading: "Upper counterline avoids the strumming range", tempo: 82, events: [
        { count: "1", notes: [{ string: 1, fret: 3 }], duration: "quarter", rest: false },
        { count: "2", notes: [{ string: 2, fret: 3 }], duration: "quarter", rest: false },
        { count: "3", notes: [{ string: 1, fret: 0 }], duration: "quarter", rest: false },
        { count: "4", notes: [], duration: "quarter", rest: true },
        { count: "1", notes: [{ string: 2, fret: 1 }], duration: "quarter", rest: false },
        { count: "2", notes: [{ string: 2, fret: 3 }], duration: "quarter", rest: false },
        { count: "3", notes: [{ string: 1, fret: 2 }], duration: "quarter", rest: false },
        { count: "4", notes: [], duration: "quarter", rest: true }
      ], explanation: "This counterline sits above the open rhythm part and rests at phrase ends. It answers instead of competing.", accessibilityDescription: "Upper counterline: high G, D, E, rest, then C, D, F sharp, rest." },
      { id: "arrangement-setup", type: "instrument-setup", heading: "Check tone and collision before performance", items: [
        { label: "Register", instruction: "Put the rhythm part below the counterline for the first pass.", selfCheck: "Each part can be hummed separately." },
        { label: "Density", instruction: "Remove one strum or note whenever the words, melody, or cue becomes hidden.", selfCheck: "The main idea remains easiest to hear." },
        { label: "Articulation", instruction: "Use muted, sustained, picked, and brushed sounds deliberately.", selfCheck: "Parts differ in touch, not only pitch." }
      ], safetyNote: "Keep volume moderate when looping or layering so tone decisions are not masked by loudness.", accessibilityDescription: "Arrangement setup checklist covering register, density, articulation, and moderate volume." },
      ...stages("multiple-guitar-arrangement", "complementary guitar parts", ["Observe a source chart and hear separate roles.", "Identify register, rhythm, density, articulation, and silence.", "Compare a crowded version with a separated version."], ["Assign rhythm, triad, and counterline roles.", "Loop or perform one part while testing another.", "Remove collisions before adding fills."], ["Use role labels only and choose voicings independently.", "Change one section's density without changing chord identity.", "Ask whether every part earns its place."], ["Create a two- or three-part guitar arrangement from a chart.", "Perform or document each part separately and together.", "Explain register, density, rhythm, and texture choices."], ["Parts occupy distinct roles.", "The main musical idea remains clear.", "Arrangement choices respond to form and section energy."]),
      { id: "arrangement-reflection", type: "reflection", heading: "Document the arrangement decisions", prompt: "List each guitar part or loop, its register, rhythm role, density, articulation, and where it rests. Explain one collision you removed.", fieldLabel: "Arrangement map", placeholder: "Guitar 1 uses low open rhythm; Guitar 2 enters in chorus with upper triads; the verse counterline rests on beat 4 to leave space for the vocal cue." }
    ],
    guidedExercises: [
      { id: "exercise.arrangement-collision", title: "Find and remove collisions", purpose: "Make arrangement decisions audible and testable.", instructions: ["Play two parts together.", "Mark every moment where rhythm, register, or density competes.", "Remove or move one element at a time.", "Replay and choose the clearest version."], successCriteria: ["At least one collision is identified.", "The fix improves clarity.", "The chart records the change."], reduceDifficultyWhen: ["Use rhythm plus one counterline only."], increaseDifficultyWhen: ["Add a capo or alternate register part."], relatedSkills: ["arrangement", "listening", "texture"] },
      { id: "exercise.arrangement-section", title: "Verse thin, chorus wide", purpose: "Use arrangement to support form.", instructions: ["Create a sparse verse texture.", "Add one wider or higher chorus layer.", "Keep the chord progression recognizable.", "Explain why the density changes."], successCriteria: ["Verse and chorus are audibly different.", "Added parts do not hide the main rhythm or melody.", "The section contrast matches the chart."], reduceDifficultyWhen: ["Change only register."], increaseDifficultyWhen: ["Add a third part that enters only for the tag."], relatedSkills: ["form", "voicing", "performance"] }
    ],
    commonMistakes: [
      { id: "mistake.arrangement-crowded", symptom: "Every part strums the same rhythm in the same register.", likelyCause: "Layering was treated as duplication.", adjustment: "Assign one part rhythm, one part sustained color, and one part rests or answers." },
      { id: "mistake.arrangement-fill", symptom: "Fills hide the melody or section cue.", likelyCause: "Density was added without listening to priority.", adjustment: "Remove fills during important lyric or phrase moments." },
      { id: "mistake.arrangement-unclear", symptom: "The player cannot describe what each part does.", likelyCause: "Parts were invented without roles.", adjustment: "Write role labels before choosing notes." }
    ],
    knowledgeChecks: [
      { id: "check.arrangement-register", prompt: "What is a common way to keep two guitar parts clear?", options: ["Separate their registers or roles", "Make both parts louder", "Use the same rhythm everywhere"], correctAnswer: "Separate their registers or roles", explanation: "Register and role separation reduce masking." },
      { id: "check.arrangement-silence", prompt: "Why can silence improve an arrangement?", options: ["It creates space and contrast", "It means the part failed", "It removes the need for timing"], correctAnswer: "It creates space and contrast", explanation: "Rests can clarify texture and section shape." },
      { id: "check.arrangement-capo", prompt: "What can a capo provide in a multi-guitar arrangement?", options: ["A different register and voicing color", "Automatic tuning correction", "A replacement for listening"], correctAnswer: "A different register and voicing color", explanation: "Capo placement can separate timbre and range from another guitar." }
    ],
    masteryCriteria: [
      { id: "mastery.arrangement-roles", description: "Create a role map for at least two guitar parts.", verification: "reflection", required: true },
      { id: "mastery.arrangement-performance", description: "Perform or document a complete multi-part arrangement.", verification: "performance-checklist", required: true },
      { id: "mastery.arrangement-revision", description: "Identify and resolve at least one texture collision.", verification: "guided-self-check", required: true }
    ],
    reviewRecommendation: "Next session, replay the same chart with one fewer note in every part. After one week, arrange a new progression with a different register plan.",
    optionalExtension: "Create both a solo-guitar version and a two-guitar version, then compare what each format needs."
  },
  {
    id: "lesson.level-three-musicianship-project",
    unitId: "unit.level-three-musicianship-project",
    order: 1,
    title: "Build a Level 3 portfolio performance",
    objective: "Integrate rhythm, melody, arpeggios, triads, sevenths, improvisation, analysis, arrangement, transcription, and practice planning into a complete Level 3 musicianship project.",
    whyItMatters: "A level project proves that skills work together under musical pressure. The goal is not a perfect take; it is a clear portfolio artifact with analysis, recovery, reflection, and a plan for the next weak area.",
    estimatedMinutes: 240,
    priorKnowledge: ["All Level 1-3 units", "Functional harmony", "Motif development", "Chord-tone improvisation", "Arrangement mapping"],
    contentBlocks: [
      { id: "level-three-project-scope", type: "text", heading: "The project shows integrated musicianship", paragraphs: ["Prepare a two- to four-minute performance or documented arrangement that includes contrasting sections, rhythm-guitar control, melodic material, triads or sevenths, and a short improvised or composed lead passage.", "Submit supporting evidence for yourself: Roman or Nashville analysis, a short transcription, an arrangement map, and a four-week practice plan for the weakest domain. Gate 4 human evidence remains deferred for release, but the learner-facing project can still organize the artifacts."] },
      { id: "level-three-project-chart", type: "lead-sheet", heading: "Original project template", songTitle: "Level Three Garden Study", key: "D", meter: "4/4", tempo: 84, capo: 0, sections: [
        { name: "A section", repeatCount: 2, measures: [{ chord: "Dmaj7", cue: "clear rhythm part", beats: 4 }, { chord: "Bm7", cue: "motif answer", beats: 4 }, { chord: "Gmaj7", cue: "upper triad color", beats: 4 }, { chord: "A7", cue: "dominant setup", beats: 4 }] },
        { name: "B section", repeatCount: 2, measures: [{ chord: "Em7", cue: "predominant", beats: 4 }, { chord: "A7", cue: "guide-tone target", beats: 4 }, { chord: "F#m7", cue: "relative color", beats: 4 }, { chord: "Bm7", cue: "minor release", beats: 4 }] },
        { name: "Lead feature", repeatCount: 1, measures: [{ chord: "Gmaj7", cue: "motif variation", beats: 4 }, { chord: "A7", cue: "approach tones", beats: 4 }, { chord: "Dmaj7", cue: "resolution", beats: 4 }] }
      ], explanation: "Use this chart or an original equivalent. The required evidence is musical function, not this exact progression.", accessibilityDescription: "Level 3 project template in D: A section D major seven, B minor seven, G major seven, A seven; B section E minor seven, A seven, F sharp minor seven, B minor seven; lead feature G major seven, A seven, D major seven." },
      { id: "project-analysis-map", type: "progression-chart", heading: "Analysis must explain function", key: "D", meter: "4/4", measures: [
        { label: "A1", chord: "Dmaj7", romanNumeral: "Imaj7", nashvilleNumber: "1maj7", beats: 4 },
        { label: "A2", chord: "Bm7", romanNumeral: "vi7", nashvilleNumber: "6m7", beats: 4 },
        { label: "A3", chord: "Gmaj7", romanNumeral: "IVmaj7", nashvilleNumber: "4maj7", beats: 4 },
        { label: "A4", chord: "A7", romanNumeral: "V7", nashvilleNumber: "5-7", beats: 4 },
        { label: "B1", chord: "Em7-A7", romanNumeral: "ii7-V7", nashvilleNumber: "2m7-5-7", beats: 4 },
        { label: "B2", chord: "F#m7-Bm7", romanNumeral: "iii7-vi7", nashvilleNumber: "3m7-6m7", beats: 4 }
      ], explanation: "Use Roman numerals to show relationship and Nashville numbers to make transposition possible.", accessibilityDescription: "Project analysis chart maps D major seventh as I, B minor seven as vi, G major seven as IV, A seven as V, E minor seven to A seven as ii to V, and F sharp minor seven to B minor seven as iii to vi." },
      { id: "project-evidence-checklist", type: "instrument-setup", heading: "Portfolio evidence checklist", items: [
        { label: "Performance", instruction: "Prepare one complete take with recovery after mistakes.", selfCheck: "The form continues even when a small error occurs." },
        { label: "Analysis", instruction: "Write Roman or Nashville function for each section.", selfCheck: "Every chord has a relationship, not only a name." },
        { label: "Transcription", instruction: "Transcribe four to eight bars of melody or harmony by ear.", selfCheck: "The written notes can be replayed and corrected." },
        { label: "Practice plan", instruction: "Choose the weakest domain and create a four-week plan.", selfCheck: "The plan names tasks, tempos, review days, and evidence." }
      ], safetyNote: "Use sustainable practice blocks; stop or reduce intensity if pain, strain, or frustration blocks careful listening.", accessibilityDescription: "Project checklist for performance, analysis, transcription, and a four-week practice plan." },
      { id: "project-lead-tab", type: "tablature", heading: "Model lead feature with chord-tone targets", tempo: 84, events: [
        { count: "1.1", notes: [{ string: 3, fret: 7 }], duration: "quarter", rest: false },
        { count: "1.2", notes: [{ string: 2, fret: 7 }], duration: "quarter", rest: false },
        { count: "1.3", notes: [{ string: 1, fret: 5 }], duration: "quarter", rest: false },
        { count: "1.4", notes: [{ string: 1, fret: 7 }], duration: "quarter", rest: false },
        { count: "2.1", notes: [{ string: 3, fret: 6 }], duration: "quarter", rest: false },
        { count: "2.2", notes: [{ string: 2, fret: 5 }], duration: "quarter", rest: false },
        { count: "2.3", notes: [{ string: 2, fret: 7 }], duration: "quarter", rest: false },
        { count: "2.4", notes: [{ string: 1, fret: 5 }], duration: "quarter", rest: false },
        { count: "3.1", notes: [{ string: 2, fret: 7 }], duration: "half", rest: false },
        { count: "3.3", notes: [{ string: 3, fret: 7 }], duration: "half", rest: false }
      ], explanation: "This model points toward Gmaj7, A7, and Dmaj7 targets. Replace it with an original line that names its target notes.", accessibilityDescription: "Model project lead: D, F sharp, A, B, then C sharp, E, F sharp, A, resolving to F sharp and D." },
      ...stages("level-three-project", "integrated Level 3 performance project", ["Review examples of performance, analysis, arrangement map, transcription, and practice-plan evidence.", "Observe how the model chart combines rhythm, harmony, lead, and form.", "Identify the weak domain before planning final polish."], ["Choose or write the project chart.", "Draft rhythm, lead, and arrangement roles.", "Create analysis and transcription evidence alongside practice."], ["Run complete takes with only a short evidence checklist.", "Revise the weakest section rather than restarting everything.", "Reduce prompts to form cues and target notes."], ["Perform or document the complete project.", "Submit analysis, transcription, arrangement map, and four-week weak-domain plan.", "Reflect on recovery, accuracy, musicality, and next learning target."], ["The form is complete and recoverable.", "Analysis and performance agree.", "Evidence covers rhythm, harmony, melody, arrangement, transcription, and reflection."]),
      { id: "project-reflection", type: "reflection", heading: "Close Level 3 with a next-practice plan", prompt: "Summarize the project, identify the strongest and weakest domains, list the evidence artifacts, and write a four-week plan with tempos, review days, and success criteria.", fieldLabel: "Level 3 project reflection", placeholder: "Weakest domain: chord-tone soloing. Week 1 targets guide tones at 60 BPM; Week 2 adds approaches at 70 BPM; Week 3 transposes; Week 4 records a full take." }
    ],
    guidedExercises: [
      { id: "exercise.project-runthrough", title: "Complete take with recovery", purpose: "Test integrated performance instead of isolated skills.", instructions: ["Play the full form without stopping.", "Mark errors after the take.", "Choose the single highest-impact fix.", "Repeat once with that fix only."], successCriteria: ["The form remains intact.", "Recovery is audible.", "The second take improves one named issue."], reduceDifficultyWhen: ["Use a shorter form or slower tempo."], increaseDifficultyWhen: ["Add the improvised lead feature live."], relatedSkills: ["performance", "recovery", "form"] },
      { id: "exercise.project-portfolio", title: "Evidence packet", purpose: "Make musicianship visible for review.", instructions: ["Prepare a chart with function labels.", "Attach a short transcription.", "Write an arrangement map.", "Create a four-week weak-domain plan."], successCriteria: ["Each artifact matches the performance.", "The transcription can be replayed.", "The practice plan has measurable review points."], reduceDifficultyWhen: ["Use the model project template."], increaseDifficultyWhen: ["Transpose the project to a second key."], relatedSkills: ["analysis", "transcription", "practice planning"] }
    ],
    commonMistakes: [
      { id: "mistake.project-perfect", symptom: "The learner restarts after every small error.", likelyCause: "Project evidence is being confused with perfection.", adjustment: "Require complete takes and write recovery notes after the form ends." },
      { id: "mistake.project-artifacts", symptom: "The performance exists but analysis or transcription is missing.", likelyCause: "Portfolio evidence was left until the end.", adjustment: "Create artifacts while arranging, then revise them after final takes." },
      { id: "mistake.project-weak-plan", symptom: "The next plan says practice more without specifics.", likelyCause: "Weak domains were named without tasks or evidence.", adjustment: "Define tempo, reps, review date, and success criteria for each week." }
    ],
    knowledgeChecks: [
      { id: "check.project-evidence", prompt: "What makes the project more than a performance take?", options: ["Supporting analysis, transcription, arrangement, reflection, and practice-plan evidence", "Only a faster tempo", "Only a longer song"], correctAnswer: "Supporting analysis, transcription, arrangement, reflection, and practice-plan evidence", explanation: "The project demonstrates integrated musicianship through multiple evidence types." },
      { id: "check.project-recovery", prompt: "Why practice complete takes?", options: ["They develop recovery and form awareness", "They hide mistakes automatically", "They replace analysis"], correctAnswer: "They develop recovery and form awareness", explanation: "Musicianship includes continuing and recovering in time." },
      { id: "check.project-plan", prompt: "What should a weak-domain plan include?", options: ["Tasks, tempos, review days, and success criteria", "Only a vague goal", "Only new songs"], correctAnswer: "Tasks, tempos, review days, and success criteria", explanation: "Specific evidence makes the next phase trainable." }
    ],
    masteryCriteria: [
      { id: "mastery.project-performance", description: "Complete a two- to four-minute project performance or documented arrangement.", verification: "performance-checklist", required: true },
      { id: "mastery.project-analysis", description: "Provide Roman or Nashville analysis that matches the project.", verification: "reflection", required: true },
      { id: "mastery.project-transcription", description: "Transcribe four to eight bars of melody or harmony by ear.", verification: "recorded-value", required: true },
      { id: "mastery.project-arrangement", description: "Document arrangement roles, texture, and section contrast.", verification: "reflection", required: true },
      { id: "mastery.project-plan", description: "Create a four-week plan for the weakest domain with evidence targets.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "After completion, revisit the project twice: once for performance recovery and once for the weak-domain plan. Use the result to choose the first Level 4 topic.",
    optionalExtension: "Prepare a second version in a new key or meter and compare which skills transferred without support."
  }
];

export const levelThreeReviewPlans: readonly CurriculumReviewPlan[] = [
  { id: "review.caged-fretboard-integration", unitId: "unit.caged-fretboard-integration", immediateReview: ["Retrieve one C root and its 1-3-5 fragment in each region."], nextSessionReview: ["Locate one named major chord in five regions without diagrams."], oneWeekReview: ["Revoice a different progression through three registers."], longTermReview: ["Attach every new arpeggio and scale pattern to named roots and chord tones."] },
  { id: "review.diatonic-harmony-major-keys", unitId: "unit.diatonic-harmony-major-keys", immediateReview: ["Sing roots and state the major-key quality pattern."], nextSessionReview: ["Harmonize a new major key and perform four cadences."], oneWeekReview: ["Analyze function and cadence in an unfamiliar progression."], longTermReview: ["Use function to transpose, revise, and explain songwriting choices."] },
  { id: "review.relative-minor-minor-key-harmony", unitId: "unit.relative-minor-minor-key-harmony", immediateReview: ["Compare natural, harmonic, and melodic minor degrees 6 and 7."], nextSessionReview: ["Build i-iv-V-i and retrieve the relative-major contrast."], oneWeekReview: ["Transpose the scale and song process to a new minor tonic."], longTermReview: ["Name the active minor system whenever altered degrees affect melody or harmony."] },
  { id: "review.seventh-chords-arpeggio-soloing", unitId: "unit.seventh-chords-arpeggio-soloing", immediateReview: ["Retrieve five seventh-quality formulas and one guide-tone pair."], nextSessionReview: ["Outline I-vi-ii-V with thirds and sevenths before adding roots."], oneWeekReview: ["Transpose one arpeggio route and identify the resolving guide tones."], longTermReview: ["Use guide tones as the first layer of any new chord-tone solo."] },
  { id: "review.melodic-development-motif", unitId: "unit.melodic-development-motif", immediateReview: ["State the seed motif and one transformation from memory."], nextSessionReview: ["Develop the motif in a new register with one changed ending."], oneWeekReview: ["Create a second phrase from the same motif in a different key or meter."], longTermReview: ["Audit future solos and melodies for recognizable development rather than unrelated fragments."] },
  { id: "review.chord-tone-improvisation", unitId: "unit.chord-tone-improvisation", immediateReview: ["Choose beat-1 targets for a four-bar progression."], nextSessionReview: ["Improvise guide tones only, then add one approach note per measure."], oneWeekReview: ["Audit an eight-bar solo for chord tones and non-chord-tone jobs."], longTermReview: ["Begin new improvisation practice by mapping targets before increasing speed."] },
  { id: "review.arrangement-multiple-guitar-parts", unitId: "unit.arrangement-multiple-guitar-parts", immediateReview: ["Name each part's register, rhythm role, density, and rest points."], nextSessionReview: ["Remove one texture collision from the same chart."], oneWeekReview: ["Arrange a new progression with a different register or capo plan."], longTermReview: ["Use role maps before adding layers to new songs or recordings."] },
  { id: "review.level-three-musicianship-project", unitId: "unit.level-three-musicianship-project", immediateReview: ["List the required project artifacts and weakest-domain candidate."], nextSessionReview: ["Run one complete take and revise the highest-impact weak section."], oneWeekReview: ["Check that performance, analysis, transcription, arrangement, and practice plan agree."], longTermReview: ["Use the four-week weak-domain plan to choose the first Level 4 study focus."] }
];
