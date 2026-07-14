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

const fMajorBarre: CurriculumContentBlock = {
  id: "barre-f-major",
  type: "chord-diagram",
  heading: "F major from the movable E shape",
  chordName: "F",
  baseFret: 1,
  barres: [{ fret: 1, fromString: 6, toString: 1, finger: 1 }],
  strings: [
    { string: 6, state: "fretted", fret: 1, finger: 1, note: "F" },
    { string: 5, state: "fretted", fret: 3, finger: 3, note: "C" },
    { string: 4, state: "fretted", fret: 3, finger: 4, note: "F" },
    { string: 3, state: "fretted", fret: 2, finger: 2, note: "A" },
    { string: 2, state: "fretted", fret: 1, finger: 1, note: "C" },
    { string: 1, state: "fretted", fret: 1, finger: 1, note: "F" }
  ],
  strumFromString: 6,
  explanation: "The index finger supplies the movable nut. Build strings 6-4-3 first, release fully, and add the high strings only while the hand stays comfortable.",
  accessibilityDescription: "F major E-shape barre: finger 1 barres fret 1 across strings 6 to 1; string 5 fret 3 finger 3, string 4 fret 3 finger 4, string 3 fret 2 finger 2. Strum all strings."
};

const fMinorBarre: CurriculumContentBlock = {
  id: "barre-f-minor",
  type: "chord-diagram",
  heading: "F minor changes one chord tone",
  chordName: "Fm",
  baseFret: 1,
  barres: [{ fret: 1, fromString: 6, toString: 1, finger: 1 }],
  strings: [
    { string: 6, state: "fretted", fret: 1, finger: 1, note: "F" },
    { string: 5, state: "fretted", fret: 3, finger: 3, note: "C" },
    { string: 4, state: "fretted", fret: 3, finger: 4, note: "F" },
    { string: 3, state: "fretted", fret: 1, finger: 1, note: "Ab" },
    { string: 2, state: "fretted", fret: 1, finger: 1, note: "C" },
    { string: 1, state: "fretted", fret: 1, finger: 1, note: "F" }
  ],
  strumFromString: 6,
  explanation: "Remove the major third finger so string 3 drops from A to A flat. Compare the qualities at the same root and register.",
  accessibilityDescription: "F minor E-shape barre: finger 1 barres fret 1 strings 6 to 1; string 5 fret 3 finger 3 and string 4 fret 3 finger 4. String 3 at fret 1 is A flat."
};

const bFlatBarre: CurriculumContentBlock = {
  id: "barre-b-flat-major",
  type: "chord-diagram",
  heading: "B flat major from the movable A shape",
  chordName: "Bb",
  baseFret: 1,
  barres: [
    { fret: 1, fromString: 5, toString: 1, finger: 1 },
    { fret: 3, fromString: 4, toString: 2, finger: 3 }
  ],
  strings: [
    { string: 6, state: "muted" },
    { string: 5, state: "fretted", fret: 1, finger: 1, note: "Bb" },
    { string: 4, state: "fretted", fret: 3, finger: 3, note: "F" },
    { string: 3, state: "fretted", fret: 3, finger: 3, note: "Bb" },
    { string: 2, state: "fretted", fret: 3, finger: 3, note: "D" },
    { string: 1, state: "fretted", fret: 1, finger: 1, note: "F" }
  ],
  strumFromString: 5,
  explanation: "Begin on string 5. A partial version using strings 5-2 is valid while string 1 remains difficult; clarity and release come before a full grip.",
  accessibilityDescription: "B flat A-shape barre: string 6 muted; finger 1 barres fret 1 from string 5 through 1; finger 3 barres fret 3 across strings 4, 3, and 2. Strum from string 5."
};

export const levelTwoLessons: readonly CurriculumLesson[] = [
  {
    id: "lesson.barre-movable-harmony",
    unitId: "unit.barre-chords-movable-harmony",
    order: 1,
    title: "Move harmony without gripping continuously",
    objective: "Use partial and full E- and A-shape barres with pressure release, explain major/minor triad formulas and enharmonic roots, and transpose I-IV-V-vi into three keys.",
    whyItMatters: "Movable harmony separates chord quality from one open-string shape. The root chooses location, the internal formula chooses quality, and a pressure-release cycle makes repeated playing sustainable.",
    estimatedMinutes: 120,
    priorKnowledge: ["Open major and minor chords", "Power-chord root movement", "Whole and half steps", "Short focused practice cycles"],
    contentBlocks: [
      { id: "barre-formula", type: "text", heading: "Root location and formula travel together", paragraphs: ["A major triad contains root, major third, and perfect fifth: semitone distances 0-4-7. A minor triad lowers the third: 0-3-7. E-shape roots sit on string 6; A-shape roots sit on string 5.", "Enharmonic names such as A sharp and B flat describe the same sounding fret in equal temperament but communicate different key spellings. Name the root for the musical key, not only the nearest sharp label."] },
      fMajorBarre,
      fMinorBarre,
      bFlatBarre,
      { id: "barre-progression", type: "progression-chart", heading: "I-IV-V-vi in G major", key: "G", meter: "4/4", measures: [
        { label: "1", chord: "G", romanNumeral: "I", nashvilleNumber: "1", beats: 4 },
        { label: "2", chord: "C", romanNumeral: "IV", nashvilleNumber: "4", beats: 4 },
        { label: "3", chord: "D", romanNumeral: "V", nashvilleNumber: "5", beats: 4 },
        { label: "4", chord: "Em", romanNumeral: "vi", nashvilleNumber: "6m", beats: 4 }
      ], explanation: "Play once with open voicings, then choose movable E/A shapes. Transpose the same functions to C (C-F-G-Am) and D (D-G-A-Bm).", accessibilityDescription: "Four measures in G major: G major I, C major IV, D major V, E minor vi, four beats each; transpose to C and D major." },
      { id: "barre-safety", type: "callout", heading: "Barre practice uses short contacts and complete release", body: "Fret for one sound, release pressure while keeping the hand near the neck, then remove the hand. Stop for pain, numbness, burning, or lingering strain. No duration target overrides comfort.", tone: "safety" },
      ...stages("barre-three-keys", "I-IV-V-vi in three keys", ["Locate roots on strings 6 and 5 before forming any chord.", "Observe partial versions first, then add strings only while tone and comfort remain stable.", "Compare major 0-4-7 with minor 0-3-7 at one root."], ["Play G-C-D-Em at 45 BPM, one chord per measure.", "Release pressure on beat 4 and prepare the next root.", "Repeat in C using the smallest clear movable voicings."], ["Use only Roman numerals and root-string cues.", "Transpose to D without a chord-name model.", "After each four-chord run, fully release and record the weakest transition."], ["Choose any of G, C, or D major from a shuffled prompt.", "Perform I-IV-V-vi with movable shapes and no diagram.", "Explain each root, quality, and one voicing choice."], ["All four functions are correct in three keys.", "Each chord has at least three clear intended notes.", "The hand releases between attacks without persistent strain."]),
      { id: "barre-reflection", type: "reflection", heading: "Choose the smallest sustainable voicing", prompt: "Record the key, chord, clear string count, contact duration, and next physical adjustment.", fieldLabel: "Movable-chord observation", placeholder: "C major, F chord: strings 6-4 clear for four beats; next use a three-string partial and release after each attack." }
    ],
    guidedExercises: [
      { id: "exercise.barre-contact", title: "One sound, full release", purpose: "Build clear contact without continuous gripping.", instructions: ["Choose a three-string partial shape.", "Fret for one down-strum.", "Release pressure completely for three beats.", "Repeat five times, then rest."], successCriteria: ["Contact begins only for the sounded event.", "At least three intended notes clear.", "No pain or lingering numbness appears."], reduceDifficultyWhen: ["Use two notes or move higher on the neck where frets are closer."], increaseDifficultyWhen: ["Add one string without increasing contact duration."], relatedSkills: ["barre", "pressure release", "tone"], repetitions: 5 },
      { id: "exercise.transpose-functions", title: "Move functions, not memorized names", purpose: "Connect transposition to stable harmonic roles.", instructions: ["Write I-IV-V-vi in G.", "Move every root up five semitones to C and name qualities.", "Move G roots up seven semitones to D and verify the result."], successCriteria: ["Root distances remain consistent.", "I, IV, V stay major and vi stays minor.", "Chord names match the selected keys."], reduceDifficultyWhen: ["Transpose I-IV-V only."], increaseDifficultyWhen: ["Choose a fourth key and select contrasting voicings."], relatedSkills: ["transposition", "Roman numerals", "triad quality"] }
    ],
    commonMistakes: [
      { id: "mistake.barre-squeeze", symptom: "The hand keeps maximum pressure through rests and changes.", likelyCause: "Pressure is being used as the only source of stability.", adjustment: "Sound one event, release on the next beat, and let the arm and instrument support the position." },
      { id: "mistake.barre-root", symptom: "The shape moves correctly but the chord name is wrong.", likelyCause: "Shape identity has replaced root identification.", adjustment: "Name the string-6 or string-5 root before adding the rest of the shape." },
      { id: "mistake.barre-full", symptom: "A full six-string chord blocks all musical practice.", likelyCause: "The largest voicing is being treated as the only valid one.", adjustment: "Use a three- or four-string partial that preserves root, third, and fifth." }
    ],
    knowledgeChecks: [
      { id: "check.barre-major", prompt: "Which semitone formula builds a major triad?", options: ["0-4-7", "0-3-7", "0-5-10"], correctAnswer: "0-4-7", explanation: "A major triad uses root, major third, and perfect fifth." },
      { id: "check.barre-root", prompt: "Where is the root of a movable E-shape chord?", options: ["String 6", "String 3 only", "Always an open string"], correctAnswer: "String 6", explanation: "The E-shape family is positioned by its string-6 root." },
      { id: "check.barre-release", prompt: "What is the safest default between repeated barre attacks?", options: ["Release unnecessary pressure", "Squeeze continuously", "Bend the wrist farther"], correctAnswer: "Release unnecessary pressure", explanation: "Release reduces fatigue while preserving preparation near the strings." }
    ],
    masteryCriteria: [
      { id: "mastery.barre-formulas", description: "Explain major and minor triad formulas and identify enharmonic root names.", verification: "guided-self-check", required: true },
      { id: "mastery.barre-shapes", description: "Play sustainable partial or full E- and A-shape major/minor barres with pressure release.", verification: "performance-checklist", required: true },
      { id: "mastery.barre-keys", description: "Perform I-IV-V-vi in G, C, and D with correctly named movable harmony.", verification: "performance-checklist", required: true },
      { id: "mastery.barre-reflect", description: "Record one voicing and physical adjustment from observable tone and comfort.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, retrieve one E-shape and one A-shape from roots only. After one week, transpose a Level 1 progression into a new key and choose voicings for register contrast.",
    optionalExtension: "Rewrite the Level 1 Lantern form in two keys, using open voicings for one section and movable voicings for another."
  },
  {
    id: "lesson.minor-pentatonic-blues",
    unitId: "unit.minor-pentatonic-blues-language",
    order: 1,
    title: "Improvise phrases, not an uninterrupted box",
    objective: "Play A minor pentatonic box 1 with named degrees, use rests and four articulations safely, follow a 12-bar I-IV-V form, and improvise two coherent call-and-response choruses.",
    whyItMatters: "A five-note collection limits pitch choices so timing, repetition, articulation, response, and endings can become audible. Form tells a phrase where it is, while rests let one idea answer another.",
    estimatedMinutes: 125,
    priorKnowledge: ["Eighth-note pulse", "Power-chord roots", "Tab reading", "Major/minor quality", "Complete-form recovery"],
    contentBlocks: [
      { id: "pentatonic-language", type: "text", heading: "Five scale degrees become language through rhythm and return", paragraphs: ["A minor pentatonic uses degrees 1, flat 3, 4, 5, and flat 7: A-C-D-E-G. The optional blue note, E flat, can create tension between 4 and 5; it is a color and passing tone, not a requirement to hold indiscriminately.", "A 12-bar blues groups three four-measure phrases. In A, the primary roots are A (I), D (IV), and E (V). Knowing the bar location helps a phrase answer the harmony instead of floating over an endless loop."] },
      { id: "pentatonic-a-box", type: "scale-pattern", heading: "A minor pentatonic box 1", root: "A", collectionName: "minor pentatonic", formulaSemitones: [0, 3, 5, 7, 10], notes: ["A", "C", "D", "E", "G"], degrees: ["1", "b3", "4", "5", "b7"], positions: [
        { string: 6, fret: 5, degree: "1" }, { string: 6, fret: 8, degree: "b3" },
        { string: 5, fret: 5, degree: "4" }, { string: 5, fret: 7, degree: "5" },
        { string: 4, fret: 5, degree: "b7" }, { string: 4, fret: 7, degree: "1" },
        { string: 3, fret: 5, degree: "b3" }, { string: 3, fret: 7, degree: "4" },
        { string: 2, fret: 5, degree: "5" }, { string: 2, fret: 8, degree: "b7" },
        { string: 1, fret: 5, degree: "1" }, { string: 1, fret: 8, degree: "b3" }
      ], explanation: "Name degrees while ascending and descending, but practice short fragments and rests more often than full runs.", accessibilityDescription: "A minor pentatonic box 1 at frets 5-8: two notes per string, roots A at string 6 fret 5, string 4 fret 7, and string 1 fret 5." },
      { id: "blues-form-a", type: "progression-chart", heading: "Original 12-bar A blues practice form", key: "A", meter: "4/4", measures: [
        ...[1,2,3,4].map((bar) => ({ label: String(bar), chord: "A5", romanNumeral: "I", nashvilleNumber: "1", beats: 4 })),
        ...[5,6].map((bar) => ({ label: String(bar), chord: "D5", romanNumeral: "IV", nashvilleNumber: "4", beats: 4 })),
        ...[7,8].map((bar) => ({ label: String(bar), chord: "A5", romanNumeral: "I", nashvilleNumber: "1", beats: 4 })),
        { label: "9", chord: "E5", romanNumeral: "V", nashvilleNumber: "5", beats: 4 },
        { label: "10", chord: "D5", romanNumeral: "IV", nashvilleNumber: "4", beats: 4 },
        { label: "11", chord: "A5", romanNumeral: "I", nashvilleNumber: "1", beats: 4 },
        { label: "12", chord: "E5", romanNumeral: "V", nashvilleNumber: "5", beats: 4 }
      ], explanation: "Bars 1-4 state the first idea; bars 5-8 answer after IV appears; bars 9-12 create V-IV-I-V turnaround motion.", accessibilityDescription: "Twelve bars in A: A5 for bars 1-4, D5 bars 5-6, A5 bars 7-8, E5 bar 9, D5 bar 10, A5 bar 11, E5 bar 12." },
      { id: "pentatonic-lick", type: "tablature", heading: "Original two-measure call", tempo: 65, events: [
        { count: "1", notes: [{ string: 3, fret: 5, technique: "pick" }], duration: "quarter", rest: false },
        { count: "2 &", notes: [{ string: 3, fret: 7, technique: "hammer-on" }], duration: "eighth", rest: false },
        { count: "3", notes: [{ string: 2, fret: 5, technique: "vibrato" }], duration: "quarter", rest: false },
        { count: "4", notes: [], duration: "quarter", rest: true },
        { count: "1", notes: [{ string: 2, fret: 8, technique: "bend" }], duration: "quarter", rest: false },
        { count: "2", notes: [{ string: 2, fret: 5, technique: "pull-off" }], duration: "quarter", rest: false },
        { count: "3", notes: [{ string: 3, fret: 7, technique: "slide" }], duration: "quarter", rest: false },
        { count: "4", notes: [{ string: 4, fret: 7, technique: "vibrato" }], duration: "quarter", rest: false }
      ], explanation: "Keep articulations small and pitch-controlled. A bend is optional; substitute a picked target note if the hand cannot bend comfortably or accurately.", accessibilityDescription: "Two-measure A minor pentatonic call: C-D hammer-on, E with vibrato, rest; G bend or picked target, E pull-off, D slide, A with vibrato." },
      ...stages("blues-two-chorus", "two call-and-response blues choruses", ["Track the 12 bars while listening without playing.", "Observe a two-bar call, two-bar response, and two bars of space across each four-bar phrase.", "Hear endings aim at A in bar 11 or create E tension in bar 12."], ["Limit the first chorus to A-C-D and quarter notes.", "Add E and G only in the second four-bar phrase.", "Speak bar numbers 1, 5, and 9 while improvising."], ["Use only the form chart and one rhythmic motive.", "Remove spoken bar numbers but keep a visible four-bar tally.", "Add one articulation and preserve at least one full-beat rest per phrase."], ["Improvise two complete choruses without a demonstrated lick.", "Vary rhythm or ending in chorus 2 while preserving a recognizable motive.", "Finish intentionally on A or explain a deliberate unresolved E ending."], ["Both choruses remain aligned with all 12 bars.", "Calls and responses contain audible space and related motives.", "Articulation stays controlled and does not disrupt pulse."]),
      { id: "blues-reflection", type: "reflection", heading: "Evaluate the phrase, not the note count", prompt: "Record one repeated motive, one useful rest, the bar where form was lost or recovered, and the next two-note ear-copy target.", fieldLabel: "Blues phrase observation", placeholder: "Repeated C-D rhythm in bars 1 and 5; beat-4 rest helped. Lost bar 9, recovered at A5 bar 11." }
    ],
    guidedExercises: [
      { id: "exercise.blues-three-notes", title: "Three-note question and answer", purpose: "Prioritize phrase identity over scale coverage.", instructions: ["Choose A, C, and D only.", "Play a two-beat question and leave two beats silent.", "Answer with the same rhythm and a changed ending.", "Repeat through four bars."], successCriteria: ["Question and answer share one feature.", "Silence remains in time.", "Bar 1 and bar 5 are recognized."], reduceDifficultyWhen: ["Use two notes and quarter notes."], increaseDifficultyWhen: ["Transpose the motive to begin on D over IV."], relatedSkills: ["phrasing", "call and response", "form"] },
      { id: "exercise.blues-articulation", title: "One articulation at a time", purpose: "Keep expressive technique subordinate to pitch and rhythm.", instructions: ["Play one two-note phrase with picked attacks.", "Repeat with a hammer-on or slide.", "Add vibrato only to the final held note.", "Use a bend only after matching its target pitch first."], successCriteria: ["Rhythm remains unchanged between versions.", "The target pitch is intentional.", "The hand remains comfortable."], reduceDifficultyWhen: ["Use slide and vibrato only."], increaseDifficultyWhen: ["Choose articulation based on phrase direction without prompts."], relatedSkills: ["articulation", "pitch", "expression"] }
    ],
    commonMistakes: [
      { id: "mistake.blues-box-run", symptom: "Every phrase ascends and descends the entire box.", likelyCause: "Pattern recall is replacing musical intention.", adjustment: "Limit to three notes, repeat one rhythm, and require a full-beat rest." },
      { id: "mistake.blues-form", symptom: "The solo continues but bar 5 or 9 cannot be identified.", likelyCause: "The scale is being heard without the 12-bar structure.", adjustment: "Stop playing, track roots through one chorus, then re-enter only on bars 1, 5, and 9." },
      { id: "mistake.blues-bend", symptom: "Bends sound uncontrolled or cause strain.", likelyCause: "A visual bend gesture is being attempted without a target pitch or safe support.", adjustment: "Play the target first, reduce the bend distance, or substitute a picked note." }
    ],
    knowledgeChecks: [
      { id: "check.pentatonic-formula", prompt: "Which degrees form the minor pentatonic collection?", options: ["1-b3-4-5-b7", "1-2-3-5-6", "1-3-5-7"], correctAnswer: "1-b3-4-5-b7", explanation: "Minor pentatonic uses root, minor third, fourth, fifth, and minor seventh." },
      { id: "check.blues-bar-nine", prompt: "Which function begins bar 9 in the displayed 12-bar form?", options: ["V", "I", "IV"], correctAnswer: "V", explanation: "The final four-bar phrase begins on V, then moves IV-I-V." },
      { id: "check.blues-space", prompt: "Why practice rests during improvisation?", options: ["They shape phrases and preserve time for a response", "They hide the beat", "They make form unnecessary"], correctAnswer: "They shape phrases and preserve time for a response", explanation: "Timed space gives motives boundaries and lets responses become audible." }
    ],
    masteryCriteria: [
      { id: "mastery.blues-scale", description: "Play A minor pentatonic box 1 and name degrees 1, b3, 4, 5, and b7.", verification: "performance-checklist", required: true },
      { id: "mastery.blues-form", description: "Track and explain the I-IV-V locations in the 12-bar A form.", verification: "guided-self-check", required: true },
      { id: "mastery.blues-choruses", description: "Improvise two coherent choruses with rhythmic variety, rests, recovery, and endings.", verification: "performance-checklist", required: true },
      { id: "mastery.blues-reflect", description: "Record one motive, one rest, one form observation, and a next ear-copy target.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, improvise one chorus with only three notes before using the full box. After one week, move the same call-and-response process to a different root or backing feel.",
    optionalExtension: "Add the E-flat blue note only as a passing color between D and E, then compare the phrase with and without it."
  },
  {
    id: "lesson.fretboard-notes-octaves",
    unitId: "unit.fretboard-notes-octave-shapes",
    order: 1,
    title: "Locate roots, then derive nearby octaves",
    objective: "Find natural notes on strings 6 and 5 within five seconds, explain semitone and octave equivalence, derive two octave shapes, and write a named-root riff in two registers.",
    whyItMatters: "Root knowledge turns movable chords, scales, riffs, and transposition into named musical choices. Octave relationships extend one verified location without pretending every fret must be memorized independently.",
    estimatedMinutes: 105,
    priorKnowledge: ["Musical alphabet", "Chromatic fret direction", "Movable chord roots", "Scale tonic", "Fretboard coordinates"],
    contentBlocks: [
      { id: "fretboard-semitones", type: "text", heading: "Natural notes anchor the chromatic grid", paragraphs: ["Every fret raises pitch by one semitone. Natural notes on a string follow the alphabet, with adjacent-fret pairs B-C and E-F. Fret 12 repeats the open-string pitch class one octave higher.", "Unison means the same pitch; octave equivalence means the same pitch class at a higher or lower register. Two locations can share a note name while producing different registers and timbres."] },
      { id: "fretboard-natural-roots", type: "fretboard-map", heading: "Natural-note anchors on strings 6 and 5", fretStart: 0, fretEnd: 12, positions: [
        { string: 6, fret: 0, note: "E", label: "E", emphasis: "root" }, { string: 6, fret: 1, note: "F", label: "F", emphasis: "target" }, { string: 6, fret: 3, note: "G", label: "G", emphasis: "target" }, { string: 6, fret: 5, note: "A", label: "A", emphasis: "target" }, { string: 6, fret: 7, note: "B", label: "B", emphasis: "target" }, { string: 6, fret: 8, note: "C", label: "C", emphasis: "target" }, { string: 6, fret: 10, note: "D", label: "D", emphasis: "target" }, { string: 6, fret: 12, note: "E", label: "E", emphasis: "root" },
        { string: 5, fret: 0, note: "A", label: "A", emphasis: "root" }, { string: 5, fret: 2, note: "B", label: "B", emphasis: "target" }, { string: 5, fret: 3, note: "C", label: "C", emphasis: "target" }, { string: 5, fret: 5, note: "D", label: "D", emphasis: "target" }, { string: 5, fret: 7, note: "E", label: "E", emphasis: "target" }, { string: 5, fret: 8, note: "F", label: "F", emphasis: "target" }, { string: 5, fret: 10, note: "G", label: "G", emphasis: "target" }, { string: 5, fret: 12, note: "A", label: "A", emphasis: "root" }
      ], explanation: "Learn the open and fret-12 anchors, then B-C and E-F adjacency, then fill whole-step gaps. Use random prompts rather than repeating one memorized order.", accessibilityDescription: "Strings 6 and 5 natural-note map from open through fret 12. String 6: E F G A B C D E. String 5: A B C D E F G A." },
      { id: "fretboard-octave-map", type: "fretboard-map", heading: "Two nearby octave transfers", fretStart: 3, fretEnd: 8, positions: [
        { string: 6, fret: 3, note: "G", label: "G root", emphasis: "root" },
        { string: 4, fret: 5, note: "G", label: "G octave", emphasis: "target" },
        { string: 5, fret: 3, note: "C", label: "C root", emphasis: "root" },
        { string: 3, fret: 5, note: "C", label: "C octave", emphasis: "target" },
        { string: 6, fret: 6, note: "Bb", label: "Bb root", emphasis: "context" },
        { string: 4, fret: 8, note: "Bb", label: "Bb octave", emphasis: "context" }
      ], explanation: "From strings 6 or 5, move two strings thinner and two frets higher to reach the octave before the B-string tuning offset affects the pattern.", accessibilityDescription: "G at string 6 fret 3 transfers to string 4 fret 5; C at string 5 fret 3 transfers to string 3 fret 5; B flat at string 6 fret 6 transfers to string 4 fret 8." },
      { id: "fretboard-root-riff", type: "tablature", heading: "Named roots in two registers", tempo: 65, events: [
        { count: "1", notes: [{ string: 6, fret: 3 }], duration: "quarter", rest: false },
        { count: "2", notes: [{ string: 4, fret: 5 }], duration: "quarter", rest: false },
        { count: "3", notes: [{ string: 5, fret: 3 }], duration: "quarter", rest: false },
        { count: "4", notes: [{ string: 3, fret: 5 }], duration: "quarter", rest: false },
        { count: "1", notes: [{ string: 6, fret: 5 }], duration: "quarter", rest: false },
        { count: "2", notes: [], duration: "quarter", rest: true },
        { count: "3", notes: [{ string: 4, fret: 7 }], duration: "quarter", rest: false },
        { count: "4", notes: [], duration: "quarter", rest: true }
      ], explanation: "Say G-G, C-C, A-rest, A-rest. The octave changes register while preserving note identity.", accessibilityDescription: "Two measures: low G and higher G, low C and higher C; then low A, rest, higher A, rest." },
      ...stages("fretboard-five-seconds", "natural-note and octave retrieval", ["Trace string 6 natural notes from E using half-step pairs.", "Trace string 5 from A without restarting the alphabet.", "Observe the two-strings-thinner, two-frets-higher octave rule."], ["Use shuffled natural-note prompts on string 6, then string 5.", "Allow ten seconds and speak the nearest anchor used.", "After each root, derive its octave and verify the pitch class."], ["Reduce response time to seven seconds and hide the map until after each answer.", "Mix strings 6 and 5 prompts.", "Use one chromatic root such as B flat to prove the octave shape transfers."], ["Find any prompted natural note on string 6 or 5 within five seconds.", "Derive and play its nearby octave without a diagram.", "Perform or create a riff using named roots in two registers."], ["Natural-note locations are correct within five seconds.", "Octave derivation preserves note identity.", "The riff uses root names intentionally rather than anonymous shapes."]),
      { id: "fretboard-reflection", type: "reflection", heading: "Record the anchor, not only the answer", prompt: "Which note-string prompt was slow, which nearby anchor solved it, and which octave route will you retrieve next session?", fieldLabel: "Fretboard retrieval observation", placeholder: "String 5 F was slow; E at fret 7 plus one half step found fret 8. Next retrieve its string 3 fret 10 octave." }
    ],
    guidedExercises: [
      { id: "exercise.note-random", title: "Random natural-note retrieval", purpose: "Replace ordered recitation with addressable locations.", instructions: ["Shuffle A-G note prompts.", "Choose string 6 or 5 before revealing a prompt.", "Find it, speak the anchor route, then verify.", "Record only responses over five seconds."], successCriteria: ["Answers are not produced in one repeated order.", "The anchor explanation is accurate.", "Slow prompts become the next review set."], reduceDifficultyWhen: ["Use E-F-G-A on string 6 only."], increaseDifficultyWhen: ["Mix both strings and chromatic neighbors."], relatedSkills: ["note location", "retrieval", "chromatic fretboard"] },
      { id: "exercise.octave-transfer", title: "Root-to-octave transfer", purpose: "Use a verified root to derive a second register.", instructions: ["Choose a root on string 6 or 5 between frets 1 and 8.", "Move two strings thinner and two frets higher.", "Play both notes separately, then together when physically possible.", "Name the shared pitch class."], successCriteria: ["The destination string and fret are correct.", "Both notes share a note name.", "Register difference is heard or described."], reduceDifficultyWhen: ["Use G and C examples only."], increaseDifficultyWhen: ["Create a two-register riff from three random roots."], relatedSkills: ["octave", "interval", "fretboard transfer"] }
    ],
    commonMistakes: [
      { id: "mistake.fretboard-count", symptom: "Every note is found by counting from the open string.", likelyCause: "No interior anchors have been retained.", adjustment: "Use fret 5, 7, or 8 natural anchors and state the shortest route." },
      { id: "mistake.fretboard-order", symptom: "Notes are fast only in ascending order.", likelyCause: "The alphabet sequence was learned instead of addressable locations.", adjustment: "Use shuffled prompts and alternate string choice." },
      { id: "mistake.octave-shape", symptom: "The shape is moved but the source note is unnamed.", likelyCause: "Geometry has replaced note ownership.", adjustment: "Name and verify the source root before deriving the octave." }
    ],
    knowledgeChecks: [
      { id: "check.fretboard-semitone", prompt: "How much does one fret raise pitch?", options: ["One semitone", "One octave", "One major third"], correctAnswer: "One semitone", explanation: "Adjacent frets are one semitone apart." },
      { id: "check.fretboard-twelve", prompt: "What occurs at fret 12 in standard tuning?", options: ["The open-string pitch class repeats one octave higher", "Every string becomes C", "The note name disappears"], correctAnswer: "The open-string pitch class repeats one octave higher", explanation: "Twelve semitones complete an octave." },
      { id: "check.octave-transfer", prompt: "From a string-6 root, what nearby move reaches the displayed octave?", options: ["Two strings thinner and two frets higher", "One string thicker and one fret lower", "Same string, five frets higher"], correctAnswer: "Two strings thinner and two frets higher", explanation: "For the displayed string pairs, that geometric route preserves pitch class at the octave." }
    ],
    masteryCriteria: [
      { id: "mastery.fretboard-natural", description: "Find any natural note on strings 6 or 5 within five seconds from a shuffled prompt.", verification: "performance-checklist", required: true },
      { id: "mastery.fretboard-octave", description: "Derive and play nearby octaves while naming the shared pitch class.", verification: "performance-checklist", required: true },
      { id: "mastery.fretboard-theory", description: "Explain semitone layout, unison, octave equivalence, and fret-12 repetition.", verification: "guided-self-check", required: true },
      { id: "mastery.fretboard-riff", description: "Perform or write a riff that targets named roots in two registers.", verification: "performance-checklist", required: true },
      { id: "mastery.fretboard-reflect", description: "Record one slow prompt, accurate anchor route, and next octave review.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, retrieve only the slow prompts before scanning all natural notes. After one week, use named roots from a chord progression and derive each octave in musical context.",
    optionalExtension: "Add chromatic roots B flat, E flat, and F sharp to the same retrieval and octave process.",
    reinforcement: { label: "Practice optional octave-shape reinforcement", href: "/practice?drill=octaveShape&lesson=octave-shapes#practice" }
  },
  {
    id: "lesson.major-scale-diatonic-melody",
    unitId: "unit.major-scale-diatonic-melody",
    order: 1,
    title: "Develop a melody inside a named major key",
    objective: "Construct the major scale, play two movable patterns with named degrees, identify tonic and relative minor, and compose an eight-bar melody using repetition, sequence, climax, and resolution.",
    whyItMatters: "A movable scale becomes musical when note names, degrees, key, ear, and phrase design agree. Two positions provide register choices; development makes the melody rememberable.",
    estimatedMinutes: 120,
    priorKnowledge: ["C major and whole/half steps", "Natural-note fretboard anchors", "Movable roots", "Four-measure phrasing"],
    contentBlocks: [
      { id: "major-scale-structure", type: "text", heading: "The same interval pattern creates every major key", paragraphs: ["Major-scale steps are whole-whole-half-whole-whole-whole-half. Degrees 1 and 8 are tonic at different octaves. Degree 7 sits a half step below tonic and often points toward it.", "A relative minor shares a key signature and begins on degree 6. G major and E minor share G-A-B-C-D-E-F sharp, but their tonic reference and phrase behavior differ."] },
      { id: "g-major-position", type: "scale-pattern", heading: "G major from a string-6 root", root: "G", collectionName: "major", formulaSemitones: [0,2,4,5,7,9,11], notes: ["G","A","B","C","D","E","F#"], degrees: ["1","2","3","4","5","6","7"], positions: [
        { string: 6, fret: 3, degree: "1" }, { string: 6, fret: 5, degree: "2" }, { string: 6, fret: 7, degree: "3" },
        { string: 5, fret: 3, degree: "4" }, { string: 5, fret: 5, degree: "5" }, { string: 5, fret: 7, degree: "6" },
        { string: 4, fret: 4, degree: "7" }, { string: 4, fret: 5, degree: "1" }, { string: 4, fret: 7, degree: "2" }
      ], explanation: "Name degrees and notes. Sequence 1-3, 2-4, 3-5 slowly, then return to a lyrical one-octave line.", accessibilityDescription: "G major position from string 6 fret 3: G A B on frets 3 5 7; C D E on string 5 frets 3 5 7; F sharp G A on string 4 frets 4 5 7." },
      { id: "c-major-position", type: "scale-pattern", heading: "C major from a string-5 root", root: "C", collectionName: "major", formulaSemitones: [0,2,4,5,7,9,11], notes: ["C","D","E","F","G","A","B"], degrees: ["1","2","3","4","5","6","7"], positions: [
        { string: 5, fret: 3, degree: "1" }, { string: 5, fret: 5, degree: "2" }, { string: 5, fret: 7, degree: "3" },
        { string: 4, fret: 3, degree: "4" }, { string: 4, fret: 5, degree: "5" }, { string: 4, fret: 7, degree: "6" },
        { string: 3, fret: 4, degree: "7" }, { string: 3, fret: 5, degree: "1" }
      ], explanation: "This position starts from a string-5 root but preserves the same degree and interval sequence.", accessibilityDescription: "C major from string 5 fret 3: C D E on string 5 frets 3 5 7; F G A on string 4 frets 3 5 7; B C on string 3 frets 4 5." },
      { id: "major-melody", type: "tablature", heading: "Original eight-bar arc in G", tempo: 70, events: [
        { count: "M1", notes: [{ string: 4, fret: 5 }], duration: "quarter", rest: false }, { count: "2", notes: [{ string: 4, fret: 7 }], duration: "quarter", rest: false }, { count: "3", notes: [{ string: 3, fret: 4 }], duration: "quarter", rest: false }, { count: "4", notes: [], duration: "quarter", rest: true },
        { count: "M2", notes: [{ string: 4, fret: 7 }], duration: "quarter", rest: false }, { count: "2", notes: [{ string: 3, fret: 4 }], duration: "quarter", rest: false }, { count: "3", notes: [{ string: 3, fret: 5 }], duration: "half", rest: false },
        { count: "M3", notes: [{ string: 3, fret: 4 }], duration: "quarter", rest: false }, { count: "2", notes: [{ string: 3, fret: 5 }], duration: "quarter", rest: false }, { count: "3", notes: [{ string: 2, fret: 3 }], duration: "half", rest: false },
        { count: "M4", notes: [{ string: 3, fret: 5 }], duration: "quarter", rest: false }, { count: "2", notes: [{ string: 3, fret: 4 }], duration: "quarter", rest: false }, { count: "3", notes: [{ string: 4, fret: 7 }], duration: "quarter", rest: false }, { count: "4", notes: [], duration: "quarter", rest: true },
        { count: "M5", notes: [{ string: 3, fret: 5 }], duration: "quarter", rest: false }, { count: "2", notes: [{ string: 2, fret: 3 }], duration: "quarter", rest: false }, { count: "3", notes: [{ string: 2, fret: 5 }], duration: "half", rest: false },
        { count: "M6", notes: [{ string: 2, fret: 3 }], duration: "quarter", rest: false }, { count: "2", notes: [{ string: 3, fret: 5 }], duration: "quarter", rest: false }, { count: "3", notes: [{ string: 3, fret: 4 }], duration: "half", rest: false },
        { count: "M7", notes: [{ string: 4, fret: 7 }], duration: "quarter", rest: false }, { count: "2", notes: [{ string: 4, fret: 5 }], duration: "quarter", rest: false }, { count: "3", notes: [{ string: 4, fret: 4 }], duration: "quarter", rest: false }, { count: "4", notes: [{ string: 4, fret: 5 }], duration: "quarter", rest: false },
        { count: "M8", notes: [{ string: 4, fret: 5, technique: "vibrato" }], duration: "whole", rest: false }
      ], explanation: "Bars 1-2 state a motive; 3-4 sequence it higher; 5 reaches the climax; 6-8 descend and resolve to G. Sing degrees before playing.", accessibilityDescription: "Eight-bar G major melody with a repeated three-note motive, higher sequence, bar-5 climax, descending response, and final tonic G." },
      ...stages("major-melody-development", "an eight-bar developed melody", ["Sing degrees 1-7-1 and identify tonic pull.", "Observe the motive, sequence, climax, and resolution in the model.", "Compare G-major and C-major root positions without treating fret numbers as note identity."], ["Play each scale one octave with named degrees.", "Learn the model in two-bar phrases.", "Write a two-bar motive and sequence it one degree higher."], ["Use only degree numbers and form labels for the model melody.", "Choose a climax note before composing bars 5-6.", "Remove the scale diagram and verify notes afterward."], ["Play either movable major pattern from a named root.", "Perform an original eight-bar melody with repetition, sequence, climax, and tonic resolution.", "Explain its contour and relative-minor relationship."], ["Scale degrees and note names match the selected key.", "The melody has audible development and a deliberate climax.", "The ending confirms or intentionally avoids tonic with explanation."]),
      { id: "major-melody-reflection", type: "reflection", heading: "Describe the melodic architecture", prompt: "Name the motive, its changed repetition, climax location, resolution degree, and one phrase that needs more breath or dynamic shape.", fieldLabel: "Melody analysis", placeholder: "1-2-3 motive sequences to 2-3-4; climax degree 6 in bar 5; resolves to 1 in bar 8." }
    ],
    guidedExercises: [
      { id: "exercise.major-thirds", title: "Sequence in thirds without racing", purpose: "Hear non-adjacent scale relationships while retaining degree names.", instructions: ["Play 1-3, 2-4, 3-5, 4-6 at 55 BPM.", "Sing the lower degree before each pair.", "Return down through the same sequence."], successCriteria: ["Every note belongs to the key.", "Degree names remain accurate.", "Tone and pulse remain lyrical."], reduceDifficultyWhen: ["Use pairs 1-3 and 2-4 only."], increaseDifficultyWhen: ["Transfer the sequence to the second position."], relatedSkills: ["major scale", "thirds", "ear training"] },
      { id: "exercise.melody-transform", title: "Transform one motive", purpose: "Practice development before writing eight bars.", instructions: ["Write a three-note motive.", "Repeat it exactly.", "Sequence it one degree higher.", "Change only its ending and add a rest."], successCriteria: ["Each version retains a recognizable relationship.", "All notes fit the key.", "The changed ending creates direction."], reduceDifficultyWhen: ["Use rhythm-only transformation on one pitch."], increaseDifficultyWhen: ["Move the motive to the relative minor tonic."], relatedSkills: ["motive", "sequence", "composition"] }
    ],
    commonMistakes: [
      { id: "mistake.major-pattern", symptom: "A position is played without note names, degrees, or tonic.", likelyCause: "Fret geometry has replaced key awareness.", adjustment: "Pause on every tonic and alternate note names with degree names." },
      { id: "mistake.major-no-climax", symptom: "All eight bars have the same register and intensity.", likelyCause: "The melody was filled chronologically without a destination.", adjustment: "Choose the climax bar and pitch before rewriting surrounding phrases." },
      { id: "mistake.major-sequence", symptom: "A sequence changes random intervals and loses the motive.", likelyCause: "The original interval and rhythm were not identified.", adjustment: "Write the motive in degrees, shift each degree equally, and preserve rhythm first." }
    ],
    knowledgeChecks: [
      { id: "check.major-formula", prompt: "Which step pattern builds a major scale?", options: ["W-W-H-W-W-W-H", "W-H-W-W-H-W-W", "H-H-W-H-H-W-H"], correctAnswer: "W-W-H-W-W-W-H", explanation: "The major scale has half steps between degrees 3-4 and 7-1." },
      { id: "check.relative-minor", prompt: "Which relative minor shares G major's key signature?", options: ["E minor", "G minor", "A minor"], correctAnswer: "E minor", explanation: "Degree 6 of G major is E, the relative minor tonic." },
      { id: "check.melody-sequence", prompt: "What is a melodic sequence?", options: ["A motive repeated from a different pitch level with its relationship preserved", "Every scale note played once", "A chord held for one measure"], correctAnswer: "A motive repeated from a different pitch level with its relationship preserved", explanation: "Sequence develops a recognizable idea through systematic pitch-level change." }
    ],
    masteryCriteria: [
      { id: "mastery.major-construct", description: "Construct a major scale from the whole/half-step formula and name degrees.", verification: "guided-self-check", required: true },
      { id: "mastery.major-patterns", description: "Play two movable major-scale positions with named tonic locations.", verification: "performance-checklist", required: true },
      { id: "mastery.major-sing", description: "Sing degrees 1-2-3-4-5-6-7-1 and identify tonic.", verification: "performance-checklist", required: true },
      { id: "mastery.major-melody", description: "Compose and perform an eight-bar melody with repetition, sequence, climax, and resolution.", verification: "performance-checklist", required: true },
      { id: "mastery.major-reflect", description: "Analyze the melody's motive, contour, climax, and resolution.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, retrieve both tonic locations before playing either pattern. After one week, transpose the motive to C major or reinterpret it around E minor.",
    optionalExtension: "Write a second ending that resolves to E, then compare whether the phrase now suggests relative minor."
  },
  {
    id: "lesson.rhythm-guitar-vocabulary",
    unitId: "unit.rhythm-guitar-vocabulary",
    order: 1,
    title: "Keep the motion while sounded strokes change",
    objective: "Maintain a sixteenth-note motion grid, perform syncopation, ties, ghost strokes, muting, accents, straight and shuffle feels, and sustain an intentional groove for two minutes.",
    whyItMatters: "Groove depends on a dependable subdivision beneath sounded and silent events. Continuous motion lets articulation and accent change without rebuilding time for every stroke.",
    estimatedMinutes: 115,
    priorKnowledge: ["Eighth-note strumming", "Palm and fretting-hand muting", "Ties and 6/8", "Two-minute focused work"],
    contentBlocks: [
      { id: "groove-grid-theory", type: "text", heading: "Sixteenth slots continue beneath sound and silence", paragraphs: ["Count 1-e-and-a, 2-e-and-a, 3-e-and-a, 4-e-and-a. Downstrokes commonly align with numbers and ands; upstrokes align with e and a. A ghost stroke preserves motion without a full pitched attack.", "Syncopation emphasizes a normally weaker subdivision or sustains across a stronger beat. Straight eighths divide the beat evenly; shuffle delays the second event toward the final triplet subdivision. 3/4 has three quarter-note beats; 6/8 commonly groups six eighths as two large pulses."] },
      { id: "groove-straight", type: "rhythm-grid", heading: "Straight sixteenth groove", meter: "4/4", events: [
        { count: "1", action: "down", accent: true }, { count: "e", action: "up", accent: false }, { count: "&", action: "mute", accent: false }, { count: "a", action: "up", accent: false },
        { count: "2", action: "down", accent: false }, { count: "e", action: "mute", accent: false }, { count: "&", action: "down", accent: true }, { count: "a", action: "up", accent: false },
        { count: "3", action: "down", accent: true }, { count: "e", action: "up", accent: false }, { count: "&", action: "hold", accent: false }, { count: "a", action: "up", accent: false },
        { count: "4", action: "mute", accent: false }, { count: "e", action: "up", accent: false }, { count: "&", action: "down", accent: true }, { count: "a", action: "rest", accent: false }
      ], explanation: "Keep the hand moving through muted, held, and rested slots. Accents on 1, the and of 2, 3, and the and of 4 create syncopated shape.", accessibilityDescription: "Sixteen-slot four-four groove counted 1-e-and-a through 4-e-and-a, with continuous down-up motion, muted slots, holds, rests, and accents on 1, and-of-2, 3, and and-of-4." },
      { id: "groove-shuffle", type: "rhythm-grid", heading: "Shuffle contrast", meter: "12/8", events: [
        { count: "1", action: "down", accent: true }, { count: "trip", action: "hold", accent: false }, { count: "let", action: "up", accent: false },
        { count: "2", action: "down", accent: false }, { count: "trip", action: "hold", accent: false }, { count: "let", action: "up", accent: false },
        { count: "3", action: "down", accent: true }, { count: "trip", action: "hold", accent: false }, { count: "let", action: "up", accent: false },
        { count: "4", action: "down", accent: false }, { count: "trip", action: "hold", accent: false }, { count: "let", action: "up", accent: false }
      ], explanation: "The second event of each beat lands on the final triplet subdivision. Do not represent shuffle by simply playing unevenly without a stable triplet reference.", accessibilityDescription: "Four shuffle beats subdivided 1-trip-let through 4-trip-let, with downstrokes on numbers, holds on trip, and upstrokes on let." },
      { id: "groove-progression", type: "progression-chart", heading: "One progression, two guitar parts", key: "E", meter: "4/4", measures: [
        { label: "1", chord: "Em7", romanNumeral: "i7", nashvilleNumber: "1m7", beats: 4 },
        { label: "2", chord: "C", romanNumeral: "VI", nashvilleNumber: "b6", beats: 4 },
        { label: "3", chord: "G", romanNumeral: "III", nashvilleNumber: "b3", beats: 4 },
        { label: "4", chord: "D", romanNumeral: "VII", nashvilleNumber: "b7", beats: 4 }
      ], explanation: "Part A uses the straight sixteenth groove with compact muted chords. Part B uses sparse whole- and half-note upper strings. Contrast density and register instead of doubling every event.", accessibilityDescription: "Four measures in E minor: Em7, C, G, D. Dense syncopated Part A and sparse sustained Part B use the same harmony." },
      ...stages("groove-two-minutes", "a two-minute stable groove", ["Mute the strings and observe continuous down-up sixteenth motion.", "Hear accents separately from stronger arm force.", "Compare straight and shuffle grids at the same quarter-note tempo."], ["Count and mute-strum one measure at 55 BPM.", "Add only accented pitched strokes.", "Add remaining strokes one layer at a time and run four measures."], ["Use only accent marks and chord names.", "Alternate 30 seconds straight and 30 seconds shuffle without speeding up.", "Add a sparse second part after the primary groove remains stable."], ["Select a groove and perform the progression for two minutes.", "Maintain accents, muted subdivisions, and recovery after one missed stroke.", "Perform a contrasting second guitar part over the same chart."], ["Subdivision motion remains stable for two minutes.", "Accents and muted events occur intentionally.", "Straight, shuffle, 3/4, and 6/8 can be distinguished by count and feel."]),
      { id: "groove-reflection", type: "reflection", heading: "Name the grid location of the problem", prompt: "Record tempo, feel, exact count that rushed or disappeared, accent plan, and the smallest muted-motion correction.", fieldLabel: "Groove observation", placeholder: "55 BPM straight; the a of 2 disappeared before C. Mute all strings and loop 2-e-and-a with accent on and." }
    ],
    guidedExercises: [
      { id: "exercise.groove-motion", title: "Silent motion, selected sound", purpose: "Separate the physical grid from the sounded pattern.", instructions: ["Mute all strings and move down-up through one sixteenth grid.", "Sound beat 1 only for four measures.", "Add the and of 2 and and of 4 while all other strokes remain light ghosts."], successCriteria: ["Motion does not stop during silence.", "Sounded slots align with spoken counts.", "Accents do not distort tempo."], reduceDifficultyWhen: ["Use eighth-note motion first."], increaseDifficultyWhen: ["Add ties across beats."], relatedSkills: ["sixteenth notes", "ghost strokes", "syncopation"] },
      { id: "exercise.groove-feels", title: "Straight and shuffle comparison", purpose: "Hear feel as subdivision organization rather than vague looseness.", instructions: ["Play straight eighths at 60 BPM.", "Count triplets and play first-last shuffle events.", "Alternate two measures of each while keeping the beat unchanged."], successCriteria: ["Beat speed remains unchanged.", "Straight events divide evenly.", "Shuffle events align with triplet first and last slots."], reduceDifficultyWhen: ["Clap one beat repeatedly."], increaseDifficultyWhen: ["Apply each feel to the progression."], relatedSkills: ["straight feel", "shuffle", "subdivision"] }
    ],
    commonMistakes: [
      { id: "mistake.groove-stop", symptom: "The hand stops on every rest or tie.", likelyCause: "Motion exists only for sounded attacks.", adjustment: "Mute all strings and preserve the complete down-up grid before restoring sound." },
      { id: "mistake.groove-accent", symptom: "Accents cause the tempo to jump.", likelyCause: "Accent is produced by a larger late motion.", adjustment: "Keep stroke size small and vary contact or follow-through without delaying preparation." },
      { id: "mistake.groove-shuffle", symptom: "Shuffle is merely uneven and changes each beat.", likelyCause: "No triplet subdivision anchors the delayed upstroke.", adjustment: "Count triplets and place events on the first and last slot." }
    ],
    knowledgeChecks: [
      { id: "check.groove-sixteenth", prompt: "Which count names four sixteenth subdivisions per beat?", options: ["1-e-and-a", "1-and", "1-2-3"], correctAnswer: "1-e-and-a", explanation: "Each beat divides into four sixteenth slots." },
      { id: "check.groove-syncopation", prompt: "What is syncopation?", options: ["Emphasis or sustain across normally weaker rhythmic locations", "Any loud downbeat", "A different chord shape"], correctAnswer: "Emphasis or sustain across normally weaker rhythmic locations", explanation: "Syncopation reshapes expected accent or attack placement." },
      { id: "check.groove-shuffle", prompt: "Where does the delayed shuffle event align?", options: ["The final triplet subdivision", "Exactly halfway through the beat", "After the next downbeat"], correctAnswer: "The final triplet subdivision", explanation: "A basic shuffle uses the first and last parts of a triplet beat." }
    ],
    masteryCriteria: [
      { id: "mastery.groove-grid", description: "Count and perform a continuous sixteenth-note motion grid with selected sound and silence.", verification: "performance-checklist", required: true },
      { id: "mastery.groove-feels", description: "Distinguish and perform straight, shuffle, 3/4, and 6/8 organization.", verification: "performance-checklist", required: true },
      { id: "mastery.groove-two-minutes", description: "Maintain a two-minute groove with accurate accents, muting, and recovery.", verification: "performance-checklist", required: true },
      { id: "mastery.groove-parts", description: "Create two contrasting guitar parts over the same progression.", verification: "performance-checklist", required: true },
      { id: "mastery.groove-reflect", description: "Record an exact grid-location symptom and correction exercise.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, retrieve the muted motion and accent map before adding chords. After one week, apply the same groove to a different progression or move between straight and shuffle contexts.",
    optionalExtension: "Create a second part using only ties and muted responses in the spaces left by the primary groove."
  },
  {
    id: "lesson.triads-open-movable",
    unitId: "unit.triads-open-movable-contexts",
    order: 1,
    title: "Construct triads and connect their nearest inversions",
    objective: "Construct major, minor, diminished, and augmented triads, play C-major inversions on the top three strings with named chord tones, identify isolated qualities, and arrange a voice-led second guitar part.",
    whyItMatters: "Triads expose the three notes inside larger chord shapes. Inversions keep harmony while changing the lowest voice, register, and movement required between chords.",
    estimatedMinutes: 125,
    priorKnowledge: ["Major/minor triad formulas", "Intervals through the octave", "Chord roots and qualities", "String-set reading"],
    contentBlocks: [
      { id: "triad-formulas", type: "text", heading: "Quality is a precise root-third-fifth formula", paragraphs: ["Major is 0-4-7, minor 0-3-7, diminished 0-3-6, and augmented 0-4-8 semitones from the root. Name notes before selecting a shape.", "Root position places the root lowest; first inversion places the third lowest; second inversion places the fifth lowest. Inversion changes voicing, not chord identity."] },
      { id: "triad-c-major", type: "scale-pattern", heading: "C major triad and top-string inversions", root: "C", collectionName: "major triad", formulaSemitones: [0,4,7], notes: ["C","E","G"], degrees: ["1","3","5"], positions: [
        { string: 3, fret: 5, degree: "1" }, { string: 2, fret: 5, degree: "3" }, { string: 1, fret: 3, degree: "5" },
        { string: 3, fret: 9, degree: "3" }, { string: 2, fret: 8, degree: "5" }, { string: 1, fret: 8, degree: "1" },
        { string: 3, fret: 12, degree: "5" }, { string: 2, fret: 13, degree: "1" }, { string: 1, fret: 12, degree: "3" }
      ], explanation: "Read each group across strings 3-2-1: root position C-E-G, first inversion E-G-C, second inversion G-C-E.", accessibilityDescription: "C major top-three-string triads: root position frets string 3 fret 5, string 2 fret 5, string 1 fret 3; first inversion 9,8,8; second inversion 12,13,12." },
      { id: "triad-b-diminished", type: "scale-pattern", heading: "B diminished contracts the fifth", root: "B", collectionName: "diminished triad", formulaSemitones: [0,3,6], notes: ["B","D","F"], degrees: ["1","b3","b5"], positions: [{ string: 3, fret: 4, degree: "1" }, { string: 2, fret: 3, degree: "b3" }, { string: 1, fret: 1, degree: "b5" }], explanation: "Compare B-D-F with B-D-F sharp. The lowered fifth creates the diminished quality.", accessibilityDescription: "B diminished root-position example: B string 3 fret 4, D string 2 fret 3, F string 1 fret 1." },
      { id: "triad-c-augmented", type: "scale-pattern", heading: "C augmented expands the fifth", root: "C", collectionName: "augmented triad", formulaSemitones: [0,4,8], notes: ["C","E","G#"], degrees: ["1","3","#5"], positions: [{ string: 3, fret: 5, degree: "1" }, { string: 2, fret: 5, degree: "3" }, { string: 1, fret: 4, degree: "#5" }], explanation: "Raise G to G sharp while C and E remain. Hear the expansion before naming its use in context.", accessibilityDescription: "C augmented example: C string 3 fret 5, E string 2 fret 5, G sharp string 1 fret 4." },
      { id: "triad-voice-leading", type: "progression-chart", heading: "Second-guitar triad path", key: "C", meter: "4/4", measures: [
        { label: "1", chord: "C/E", romanNumeral: "I6", nashvilleNumber: "1/3", beats: 4 },
        { label: "2", chord: "F", romanNumeral: "IV", nashvilleNumber: "4", beats: 4 },
        { label: "3", chord: "Am/E", romanNumeral: "vi6/4", nashvilleNumber: "6m/5", beats: 4 },
        { label: "4", chord: "G/D", romanNumeral: "V6/4", nashvilleNumber: "5/5", beats: 4 }
      ], explanation: "Choose inversions that keep common tones and move each upper voice by the smallest useful distance. The slash names the lowest note of the voicing.", accessibilityDescription: "Four measures in C: C over E, F root position, A minor over E, G over D; use close top-string triads for a second guitar part." },
      ...stages("triad-requested", "requested triads and a voice-led part", ["Construct each quality from semitone formula before touching the guitar.", "Observe C major root, first, and second inversion while naming lowest tone.", "Hear major, minor, diminished, and augmented examples without assigning fixed emotions."], ["Build C major, C minor, B diminished, and C augmented from named notes.", "Arpeggiate each C major inversion slowly.", "Choose the nearest inversion for two adjacent progression chords."], ["Use only root, quality, and requested inversion prompts.", "Hide fret positions and verify chord tones afterward.", "Arrange all four progression measures with minimal upper-voice motion."], ["Construct and play a shuffled requested triad from root and quality.", "Identify its inversion from the lowest note.", "Perform a complete second-guitar triad part and explain one voice-leading choice."], ["Chord tones match root and quality formulas.", "Inversion names match the lowest tone.", "The arranged part reduces movement and remains rhythmically independent."]),
      { id: "triad-reflection", type: "reflection", heading: "Track one voice through the arrangement", prompt: "Name the soprano or lowest-note path across four chords and one place a different inversion would change the line.", fieldLabel: "Triad voice-leading observation", placeholder: "Top voice G-A-A-G; using root-position Am would jump to C, so Am/E keeps A common." }
    ],
    guidedExercises: [
      { id: "exercise.triad-build", title: "Formula to notes to frets", purpose: "Prevent shape memory from replacing construction.", instructions: ["Draw a root and quality prompt.", "Calculate third and fifth by semitones.", "Name all three notes.", "Find one playable string-set voicing and verify each note."], successCriteria: ["All chord tones match the formula.", "Each fret produces its labeled note.", "The root and quality can be explained."], reduceDifficultyWhen: ["Use C, G, and F major/minor only."], increaseDifficultyWhen: ["Include diminished and augmented qualities."], relatedSkills: ["triad construction", "intervals", "fretboard"] },
      { id: "exercise.triad-nearest", title: "Choose the nearest inversion", purpose: "Create a musical second part rather than duplicate full chords.", instructions: ["Play the first chord on strings 3-2-1.", "List all inversions of the next chord.", "Choose the voicing with smallest total movement.", "Track one voice aloud through the pair."], successCriteria: ["Chord identity remains correct.", "At least one voice moves by step or remains common.", "The second part occupies a distinct register."], reduceDifficultyWhen: ["Compare two inversion choices only."], increaseDifficultyWhen: ["Arrange four chords and add independent rhythm."], relatedSkills: ["inversions", "voice leading", "arrangement"] }
    ],
    commonMistakes: [
      { id: "mistake.triad-shape", symptom: "A requested shape is played but chord tones cannot be named.", likelyCause: "Visual grip recall has replaced construction.", adjustment: "State root, third, and fifth before locating frets." },
      { id: "mistake.triad-inversion", symptom: "Every rearrangement is called a new chord quality.", likelyCause: "Lowest note and chord identity are being conflated.", adjustment: "Collect all three notes first; then name inversion from the lowest chord tone." },
      { id: "mistake.triad-doubling", symptom: "The second guitar copies the full first-guitar register and rhythm.", likelyCause: "Arrangement has been reduced to chord correctness.", adjustment: "Use top-string triads and leave rhythmic space around the primary part." }
    ],
    knowledgeChecks: [
      { id: "check.triad-diminished", prompt: "Which formula builds a diminished triad?", options: ["0-3-6", "0-4-7", "0-4-8"], correctAnswer: "0-3-6", explanation: "Diminished uses minor third and diminished fifth above the root." },
      { id: "check.triad-first-inversion", prompt: "Which chord tone is lowest in first inversion?", options: ["The third", "The root", "The fifth"], correctAnswer: "The third", explanation: "First inversion places the chord's third in the bass." },
      { id: "check.triad-voice-leading", prompt: "What does efficient voice leading prioritize?", options: ["Small intentional motion and common tones", "Always the lowest available fret", "Every voice jumping in parallel"], correctAnswer: "Small intentional motion and common tones", explanation: "Voice leading considers each note's path between chords." }
    ],
    masteryCriteria: [
      { id: "mastery.triad-construct", description: "Construct major, minor, diminished, and augmented triads from root and quality.", verification: "guided-self-check", required: true },
      { id: "mastery.triad-inversions", description: "Play and name root, first, and second inversion triads on a top-string set.", verification: "performance-checklist", required: true },
      { id: "mastery.triad-ear", description: "Identify major, minor, and diminished quality in clear isolated examples using the available equivalent path.", verification: "guided-self-check", required: true },
      { id: "mastery.triad-arrange", description: "Perform a voice-led second guitar part using triad inversions.", verification: "performance-checklist", required: true },
      { id: "mastery.triad-reflect", description: "Describe one voice path and defend an inversion choice.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, construct two shuffled qualities before viewing shapes. After one week, replace full chords in a familiar progression with the nearest top-string triads.",
    optionalExtension: "Write an independent rhythm for the triad part that answers, rather than doubles, the original accompaniment.",
    reinforcement: { label: "Practice optional chord-tone reinforcement", href: "/practice?drill=chordTone&lesson=triads#practice" }
  },
  {
    id: "lesson.lead-sheet-transposition",
    unitId: "unit.lead-sheet-literacy-transposition",
    order: 1,
    title: "Read ahead, preserve function, and change keys",
    objective: "Interpret lead-sheet form, repeats, slash chords, rhythmic cues, and capo markings; read two unfamiliar original charts; and transpose a progression into two keys using intervals, Roman numerals, and Nashville numbers.",
    whyItMatters: "A lead sheet transfers musical decisions between people without prescribing every note. Functional numbers preserve relationships when singer range, capo position, or ensemble register requires a new key.",
    estimatedMinutes: 120,
    priorKnowledge: ["Complete song form", "Movable and open chords", "Triad roots and qualities", "Interval transposition", "Reading ahead"],
    contentBlocks: [
      { id: "chart-language", type: "text", heading: "A chart is a map of agreement", paragraphs: ["Chord symbols name harmony; slash chords name a specific bass; repeats compress repeated form; rhythmic cues show attacks or feel; capo instructions separate sounding key from familiar shapes.", "Roman numerals describe scale-degree function with quality. Nashville numbers use numbers with quality marks. In G, G-D-Em-C is I-V-vi-IV or 1-5-6m-4; in D it becomes D-A-Bm-G."] },
      { id: "lead-sheet-north-window", type: "lead-sheet", heading: "Read one section ahead", songTitle: "North Window", key: "G", meter: "4/4", tempo: 72, capo: 0, sections: [
        { name: "Intro", repeatCount: 1, measures: [{ chord: "G", cue: "whole note", beats: 4 }, { chord: "D/F#", cue: "whole note", beats: 4 }] },
        { name: "Verse", repeatCount: 2, measures: [{ chord: "Em", cue: "half-note pulse", beats: 4 }, { chord: "C", cue: "half-note pulse", beats: 4 }, { chord: "G", cue: "half-note pulse", beats: 4 }, { chord: "D", cue: "beat-4 stop", beats: 4 }] },
        { name: "Chorus", repeatCount: 2, measures: [{ chord: "C", cue: "eighth-note lift", beats: 4 }, { chord: "G", cue: "eighth-note lift", beats: 4 }, { chord: "D", cue: "build", beats: 4 }, { chord: "Em", cue: "hold", beats: 4 }] },
        { name: "Outro", repeatCount: 1, measures: [{ chord: "C", cue: "quiet", beats: 4 }, { chord: "G", cue: "final hold", beats: 4 }] }
      ], explanation: "Scan section order, repeats, D/F-sharp bass, and the verse stop before playing. Keep eyes one measure ahead of the hands.", accessibilityDescription: "Original G-major chart: intro G and D over F sharp; verse Em C G D twice; chorus C G D Em twice; outro C G. Four-four at 72 BPM." },
      { id: "lead-sheet-river-turn", type: "lead-sheet", heading: "Capo and 6/8 cues", songTitle: "River Turn", key: "D", meter: "6/8", tempo: 66, capo: 2, sections: [
        { name: "Verse", repeatCount: 2, measures: [{ chord: "C shape", cue: "sound D; accents 1 and 4", beats: 6 }, { chord: "G shape", cue: "sound A", beats: 6 }, { chord: "Am shape", cue: "sound Bm", beats: 6 }, { chord: "Fmaj7 shape", cue: "sound G", beats: 6 }] },
        { name: "Refrain", repeatCount: 2, measures: [{ chord: "Fmaj7 shape", cue: "sound G; stronger", beats: 6 }, { chord: "G shape", cue: "sound A", beats: 6 }, { chord: "C shape", cue: "sound D; hold", beats: 6 }] }
      ], explanation: "Capo 2 raises every familiar shape two semitones. Distinguish written shape names from sounding D-A-Bm-G harmony.", accessibilityDescription: "Original six-eight chart in sounding D with capo 2: C G Am Fmaj7 shapes produce D A Bm G; verse four measures twice, refrain three measures twice." },
      { id: "transpose-chart", type: "progression-chart", heading: "One function map, three keys", key: "G", meter: "4/4", measures: [
        { label: "G key", chord: "G-D-Em-C", romanNumeral: "I-V-vi-IV", nashvilleNumber: "1-5-6m-4", beats: 4 },
        { label: "D key", chord: "D-A-Bm-G", romanNumeral: "I-V-vi-IV", nashvilleNumber: "1-5-6m-4", beats: 4 },
        { label: "C key", chord: "C-G-Am-F", romanNumeral: "I-V-vi-IV", nashvilleNumber: "1-5-6m-4", beats: 4 }
      ], explanation: "Each displayed item summarizes one complete four-chord cycle. Function and quality remain stable while roots change with the key.", accessibilityDescription: "I-V-vi-IV shown in G as G D E minor C, in D as D A B minor G, and in C as C G A minor F." },
      ...stages("lead-sheet-two", "two unfamiliar lead sheets and two transpositions", ["Scan title, key, meter, tempo, capo, form, repeats, and first chord of each section.", "Observe how slash bass and rhythmic cues alter performance without changing the whole chord symbol.", "Translate I-V-vi-IV into chord names in three keys."], ["Mark North Window section starts and read at 60 BPM.", "Count River Turn in two large 6/8 pulses and speak sounding chords.", "Transpose one four-chord cycle from G to D with the function map visible."], ["Use only section names, repeat counts, and first chords.", "Read a reordered chart without hearing a model.", "Transpose to C using only Roman or Nashville numbers."], ["Perform both original charts from notation without a demonstration.", "Transpose a prompted progression to two keys and perform one version.", "Create a complete lead sheet for an original song with readable cues and form."], ["Form, repeats, meter, capo, and slash cues are interpreted correctly.", "Transposed roots and qualities preserve function.", "Reading continues through a recoverable chart error."]),
      { id: "lead-sheet-reflection", type: "reflection", heading: "Mark what another musician needs", prompt: "Record one chart ambiguity you removed, one read-ahead cue, and the original progression in chord, Roman, and Nashville notation.", fieldLabel: "Chart and transposition note", placeholder: "Added beat-4 stop before chorus; read ahead at D/F#. G-D-Em-C = I-V-vi-IV = 1-5-6m-4." }
    ],
    guidedExercises: [
      { id: "exercise.chart-scan", title: "Thirty-second chart scan", purpose: "Prepare form and exceptions before sound begins.", instructions: ["Read key, meter, tempo, and capo.", "Trace section order and repeats.", "Mark slash chords, stops, and feel changes.", "Name first chord of every section."], successCriteria: ["No section or repeat is discovered late.", "Exceptions are named before playing.", "The opening count matches the meter."], reduceDifficultyWhen: ["Scan intro and verse only."], increaseDifficultyWhen: ["Scan an unfamiliar full chart in 30 seconds."], relatedSkills: ["lead sheets", "reading ahead", "form"] },
      { id: "exercise.chart-transpose", title: "Function-preserving transposition", purpose: "Move relationships rather than guessing chord names.", instructions: ["Write the source key scale degrees.", "Label each chord with function and quality.", "Write target-key roots for the same degrees.", "Verify every root by interval before playing."], successCriteria: ["Function order is unchanged.", "Chord qualities are preserved.", "The performed target key matches the written chart."], reduceDifficultyWhen: ["Transpose I-IV-V only."], increaseDifficultyWhen: ["Add slash bass or capo-shape notation."], relatedSkills: ["transposition", "Roman numerals", "Nashville numbers"] }
    ],
    commonMistakes: [
      { id: "mistake.chart-chords-only", symptom: "Chord names are correct but repeats and section order fail.", likelyCause: "The chart was scanned vertically as a chord list rather than structurally.", adjustment: "Trace the form and first chord of each section before reading measures." },
      { id: "mistake.chart-capo", symptom: "Capo shapes are reported as the sounding key.", likelyCause: "Shape name and sounding chord have been merged.", adjustment: "Transpose every shape upward by capo semitones and label both explicitly." },
      { id: "mistake.chart-quality", symptom: "Roots transpose but minor chords become major.", likelyCause: "Only letter distance was moved.", adjustment: "Write function with quality, such as vi or 6m, before changing key." }
    ],
    knowledgeChecks: [
      { id: "check.chart-slash", prompt: "What does D/F# specify?", options: ["A D chord with F sharp as the lowest note", "An F sharp major chord", "A repeat sign"], correctAnswer: "A D chord with F sharp as the lowest note", explanation: "Slash notation names the chord first and requested bass second." },
      { id: "check.chart-capo", prompt: "With capo 2, what does a C shape sound as?", options: ["D", "C", "B"], correctAnswer: "D", explanation: "Capo 2 raises the C shape by two semitones to sounding D." },
      { id: "check.chart-function", prompt: "What remains stable when I-V-vi-IV is transposed correctly?", options: ["Scale-degree functions and chord qualities", "Absolute fret numbers", "The singer's pitch range"], correctAnswer: "Scale-degree functions and chord qualities", explanation: "Roots change with key while relationships and qualities remain." }
    ],
    masteryCriteria: [
      { id: "mastery.chart-symbols", description: "Interpret slash chords, repeats, rhythmic cues, capo markings, and section form.", verification: "guided-self-check", required: true },
      { id: "mastery.chart-read", description: "Perform from two unfamiliar original lead sheets with reading ahead and recovery.", verification: "performance-checklist", required: true },
      { id: "mastery.chart-transpose", description: "Transpose a progression to two keys using chord, Roman, and Nashville notation.", verification: "performance-checklist", required: true },
      { id: "mastery.chart-create", description: "Create a readable lead sheet for an original song.", verification: "performance-checklist", required: true },
      { id: "mastery.chart-reflect", description: "Record one clarified ambiguity and one read-ahead cue.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, scan and perform a reordered chart before replaying familiar forms. After one week, transpose one chart to a singer-selected target key or different capo strategy.",
    optionalExtension: "Create a second chart version using Nashville numbers only, then verify another player could reconstruct chord qualities and form."
  }
];

export const levelTwoReviewPlans: readonly CurriculumReviewPlan[] = [
  { id: "review.barre-movable-harmony", unitId: "unit.barre-chords-movable-harmony", immediateReview: ["Release and rebuild one partial E-shape and A-shape."], nextSessionReview: ["Retrieve roots before shapes and perform I-IV-V-vi in one key."], oneWeekReview: ["Transpose the same functions to an unpracticed key."], longTermReview: ["Choose partial or full movable voicings by sound, register, and sustainable contact."] },
  { id: "review.minor-pentatonic-blues-language", unitId: "unit.minor-pentatonic-blues-language", immediateReview: ["Improvise one three-note call and response with a full-beat rest."], nextSessionReview: ["Track one 12-bar chorus before soloing two choruses."], oneWeekReview: ["Move the process to a different root or rhythmic feel."], longTermReview: ["Retain motives, form, space, and endings whenever the note collection expands."] },
  { id: "review.fretboard-notes-octave-shapes", unitId: "unit.fretboard-notes-octave-shapes", immediateReview: ["Retrieve the slowest three natural-note prompts and their octaves."], nextSessionReview: ["Use shuffled prompts before scanning the complete map."], oneWeekReview: ["Find roots from a progression and derive octaves in context."], longTermReview: ["Add chromatic and interior-string roots without abandoning note names."] },
  { id: "review.major-scale-diatonic-melody", unitId: "unit.major-scale-diatonic-melody", immediateReview: ["Name tonic locations and sing degrees 1-7-1."], nextSessionReview: ["Retrieve both positions before developing one motive."], oneWeekReview: ["Transpose the motive or reinterpret it in relative minor."], longTermReview: ["Analyze motive, contour, climax, and resolution in each learned melody."] },
  { id: "review.rhythm-guitar-vocabulary", unitId: "unit.rhythm-guitar-vocabulary", immediateReview: ["Mute strings and retrieve the complete motion and accent grid."], nextSessionReview: ["Build the groove from selected attacks before adding chords."], oneWeekReview: ["Apply it to a new progression or contrasting feel."], longTermReview: ["Preserve subdivision and recovery as stylistic vocabulary expands."] },
  { id: "review.triads-open-movable-contexts", unitId: "unit.triads-open-movable-contexts", immediateReview: ["Construct two shuffled triad qualities from formulas."], nextSessionReview: ["Retrieve three inversions and arrange one chord pair."], oneWeekReview: ["Replace full chords in a familiar progression with triads."], longTermReview: ["Name chord tones and track voices in every inversion study."] },
  { id: "review.lead-sheet-literacy-transposition", unitId: "unit.lead-sheet-literacy-transposition", immediateReview: ["Scan one chart and translate its progression into function numbers."], nextSessionReview: ["Read a reordered form and transpose one cycle."], oneWeekReview: ["Transpose for a new target key or capo strategy."], longTermReview: ["Maintain readable charts for original and repertoire material."] }
];
