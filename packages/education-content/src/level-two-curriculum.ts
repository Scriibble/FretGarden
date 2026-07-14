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
  }
];

export const levelTwoReviewPlans: readonly CurriculumReviewPlan[] = [
  { id: "review.barre-movable-harmony", unitId: "unit.barre-chords-movable-harmony", immediateReview: ["Release and rebuild one partial E-shape and A-shape."], nextSessionReview: ["Retrieve roots before shapes and perform I-IV-V-vi in one key."], oneWeekReview: ["Transpose the same functions to an unpracticed key."], longTermReview: ["Choose partial or full movable voicings by sound, register, and sustainable contact."] },
  { id: "review.minor-pentatonic-blues-language", unitId: "unit.minor-pentatonic-blues-language", immediateReview: ["Improvise one three-note call and response with a full-beat rest."], nextSessionReview: ["Track one 12-bar chorus before soloing two choruses."], oneWeekReview: ["Move the process to a different root or rhythmic feel."], longTermReview: ["Retain motives, form, space, and endings whenever the note collection expands."] },
  { id: "review.fretboard-notes-octave-shapes", unitId: "unit.fretboard-notes-octave-shapes", immediateReview: ["Retrieve the slowest three natural-note prompts and their octaves."], nextSessionReview: ["Use shuffled prompts before scanning the complete map."], oneWeekReview: ["Find roots from a progression and derive octaves in context."], longTermReview: ["Add chromatic and interior-string roots without abandoning note names."] }
];
