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
    { stage: "model" as const, label: "Observe", instructions: model, supports: ["Complete written model", "Audible comparison target"] },
    { stage: "guided" as const, label: "Try with prompts", instructions: guided, supports: ["Numbered decisions", "One-variable revision"] },
    { stage: "scaffold-fade" as const, label: "Use fewer prompts", instructions: fade, supports: ["Check the model only after the attempt"] },
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
    accessibilityDescription: `${definition.label} stage for ${skill}, with instructions and success criteria stated in text.`
  }));
}

export const levelFourLessons: readonly CurriculumLesson[] = [
  {
    id: "lesson.modes-as-sounds",
    unitId: "unit.modes-as-sounds",
    order: 1,
    title: "Hear modes as centers, not renamed scale boxes",
    objective: "Compare modal colors over drones and vamps, identify characteristic degrees, and compose short Dorian and Mixolydian studies that make the mode audible.",
    whyItMatters: "Modes become musical when a tonal center and characteristic degree are both clear. Without that center, a mode name is just a major-scale fingering starting on a different note.",
    estimatedMinutes: 145,
    priorKnowledge: ["Major scale", "Relative minor", "Chord-tone targeting", "Motif development", "Drone or vamp practice"],
    contentBlocks: [
      { id: "modes-center-first", type: "text", heading: "A mode needs a home pitch", paragraphs: ["A mode is a scale collection heard around a center. D Dorian uses the notes of C major, but D must sound like home and B natural must color the minor sound.", "Start every modal study with a drone or one-chord vamp. Then emphasize the characteristic degree: Dorian natural 6, Phrygian flat 2, Lydian sharp 4, Mixolydian flat 7, Aeolian flat 6, and Locrian flat 5."] },
      { id: "d-dorian-pattern", type: "scale-pattern", heading: "D Dorian: minor with natural 6", root: "D", collectionName: "Dorian", formulaSemitones: [0,2,3,5,7,9,10], notes: ["D","E","F","G","A","B","C"], degrees: ["1","2","b3","4","5","6","b7"], positions: [
        { string: 5, fret: 5, degree: "1" }, { string: 5, fret: 7, degree: "2" }, { string: 5, fret: 8, degree: "b3" },
        { string: 4, fret: 5, degree: "4" }, { string: 4, fret: 7, degree: "5" }, { string: 4, fret: 9, degree: "6" },
        { string: 3, fret: 5, degree: "b7" }, { string: 3, fret: 7, degree: "1" }
      ], explanation: "The B natural is the color note. Sustain D before and after the line so the collection does not collapse into C major.", accessibilityDescription: "D Dorian from string 5 fret 5: D, E, F, G, A, B, C, D." },
      { id: "g-mixolydian-pattern", type: "scale-pattern", heading: "G Mixolydian: major with flat 7", root: "G", collectionName: "Mixolydian", formulaSemitones: [0,2,4,5,7,9,10], notes: ["G","A","B","C","D","E","F"], degrees: ["1","2","3","4","5","6","b7"], positions: [
        { string: 6, fret: 3, degree: "1" }, { string: 6, fret: 5, degree: "2" }, { string: 6, fret: 7, degree: "3" },
        { string: 5, fret: 3, degree: "4" }, { string: 5, fret: 5, degree: "5" }, { string: 5, fret: 7, degree: "6" },
        { string: 5, fret: 8, degree: "b7" }, { string: 4, fret: 5, degree: "1" }
      ], explanation: "The F natural gives G Mixolydian its dominant color without needing a full V-I resolution.", accessibilityDescription: "G Mixolydian from string 6 fret 3: G, A, B, C, D, E, F, G." },
      { id: "modal-vamps", type: "progression-chart", heading: "Modal vamps keep the center stable", key: "D", meter: "4/4", measures: [
        { label: "Dorian center", chord: "Dm7", romanNumeral: "i7", nashvilleNumber: "1m7", beats: 4 },
        { label: "Dorian color", chord: "G", romanNumeral: "IV", nashvilleNumber: "4", beats: 4 },
        { label: "Mixolydian center", chord: "G7", romanNumeral: "I7", nashvilleNumber: "1-7", beats: 4 },
        { label: "Mixolydian color", chord: "F", romanNumeral: "bVII", nashvilleNumber: "b7", beats: 4 }
      ], explanation: "Modal progressions often avoid functional closure. Keep the center present while the color chord reveals the mode.", accessibilityDescription: "Dorian vamp D minor seven to G; Mixolydian vamp G seven to F." },
      ...stages("modal-sounds", "modal center and characteristic color", ["Hear D Dorian against a D drone.", "Hear G Mixolydian against a G drone.", "Compare modal color with ordinary major and minor function."], ["Play the pattern while returning to the center.", "Target the characteristic degree on a strong beat.", "Write a two-chord vamp that does not resolve like major-key harmony."], ["Use degree names and a drone.", "Compose a four-bar phrase without the diagram.", "Check whether the center still sounds stable."], ["Perform two modal studies and name the color degree.", "Explain how each mode sounds centered around its own root.", "Transpose one mode to a new root."], ["The tonal center is audible.", "The characteristic degree is emphasized.", "The phrase avoids misleading functional resolution."]),
      { id: "modal-reflection", type: "reflection", heading: "Show the modal center", prompt: "Name the mode, center, color degree, vamp, and two melody notes that make the mode sound centered.", fieldLabel: "Modal notes", placeholder: "D Dorian: D is repeated as center; B natural appears on beat 3; Dm7-G avoids C-major resolution." }
    ],
    guidedExercises: [
      { id: "exercise.modal-drone", title: "Drone before pattern", purpose: "Anchor modal hearing before shape recall.", instructions: ["Sustain or loop the modal root.", "Play only 1-b3-6-b7 for Dorian or 1-3-b7 for Mixolydian.", "Return to the root after every phrase.", "Name the color degree aloud."], successCriteria: ["The root remains home.", "The color degree is audible.", "The line is short enough to sing."], reduceDifficultyWhen: ["Use two notes plus the drone."], increaseDifficultyWhen: ["Transpose to E Dorian or A Mixolydian."], relatedSkills: ["modes", "ear training", "phrasing"] },
      { id: "exercise.modal-study", title: "Four-bar modal study", purpose: "Turn modal theory into a musical phrase.", instructions: ["Choose one mode and one vamp.", "Write a four-bar motif using the color degree.", "Avoid a functional V-I ending.", "Perform and explain the center."], successCriteria: ["Mode and center are clear.", "The color degree appears in the phrase.", "The ending sustains modal identity."], reduceDifficultyWhen: ["Use the model vamp."], increaseDifficultyWhen: ["Write a contrasting second mode."], relatedSkills: ["composition", "modes", "analysis"] }
    ],
    commonMistakes: [
      { id: "mistake.modal-parent-key", symptom: "The line sounds like C major instead of D Dorian.", likelyCause: "The parent collection was emphasized more than the modal center.", adjustment: "Add a D drone and end every phrase on D before adding longer lines." },
      { id: "mistake.modal-color", symptom: "The fingering is correct but the mode is hard to hear.", likelyCause: "The characteristic degree is missing or hidden.", adjustment: "Place the color degree on a strong beat and compare it against ordinary major or minor." },
      { id: "mistake.modal-cadence", symptom: "The vamp resolves like standard major-key harmony.", likelyCause: "Functional cadences are overriding modal color.", adjustment: "Use static or non-cadential harmony until the center is stable." }
    ],
    knowledgeChecks: [
      { id: "check.modal-center", prompt: "What must be clear for D Dorian to sound like D Dorian?", options: ["D as center and B natural as color", "C as center only", "A dominant V-I cadence"], correctAnswer: "D as center and B natural as color", explanation: "Dorian needs a modal center plus the natural sixth color." },
      { id: "check.modal-mixolydian", prompt: "Which degree gives Mixolydian its basic color?", options: ["Flat 7", "Sharp 4", "Flat 2"], correctAnswer: "Flat 7", explanation: "Mixolydian is major with a flat seventh." },
      { id: "check.modal-practice", prompt: "Why use a drone or vamp first?", options: ["It stabilizes the modal center", "It removes the need to listen", "It turns every mode into major"], correctAnswer: "It stabilizes the modal center", explanation: "The drone keeps the ear organized around the modal root." }
    ],
    masteryCriteria: [
      { id: "mastery.modal-centers", description: "Perform two modes with clear centers and color degrees.", verification: "performance-checklist", required: true },
      { id: "mastery.modal-study", description: "Compose a four-bar modal study over a vamp.", verification: "recorded-value", required: true },
      { id: "mastery.modal-explain", description: "Explain how the mode differs from its parent major collection.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, identify mode, center, and color degree before touching the guitar. After one week, transpose one modal study to a new root.",
    optionalExtension: "Write two versions of the same motif: one Dorian and one Aeolian, then compare the sixth degree."
  },
  {
    id: "lesson.secondary-dominants-tonicization",
    unitId: "unit.secondary-dominants-tonicization",
    order: 1,
    title: "Borrow dominant pull for a moment",
    objective: "Identify and use secondary dominants, resolve them to temporary targets, and write a progression that tonicizes a diatonic chord without fully modulating.",
    whyItMatters: "Secondary dominants add direction inside a key. They let one chord briefly feel like a destination, creating lift without abandoning the original tonal center.",
    estimatedMinutes: 145,
    priorKnowledge: ["Major-key harmony", "Dominant seventh quality", "Guide-tone resolution", "Roman numerals", "Lead-sheet reading"],
    contentBlocks: [
      { id: "secondary-dominant-definition", type: "text", heading: "A secondary dominant points at a chord inside the key", paragraphs: ["In C major, Dm is ii. Its dominant is A7, so A7 can be labeled V7/ii when it resolves to Dm. The slash means dominant of the target chord.", "Secondary dominants usually contain accidentals outside the key. Those altered notes need a clear resolution; otherwise the chord sounds random instead of directed."] },
      { id: "secondary-dominant-map", type: "progression-chart", heading: "Common tonicizations in C", key: "C", meter: "4/4", measures: [
        { label: "To ii", chord: "A7-Dm", romanNumeral: "V7/ii-ii", nashvilleNumber: "5-of-2m to 2m", beats: 4 },
        { label: "To V", chord: "D7-G", romanNumeral: "V7/V-V", nashvilleNumber: "5-of-5 to 5", beats: 4 },
        { label: "To vi", chord: "E7-Am", romanNumeral: "V7/vi-vi", nashvilleNumber: "5-of-6m to 6m", beats: 4 },
        { label: "Home", chord: "G7-C", romanNumeral: "V7-I", nashvilleNumber: "5-7 to 1", beats: 4 }
      ], explanation: "Each first chord is dominant in quality even though it is not diatonic to C major. Its job is to intensify the following target.", accessibilityDescription: "Secondary dominants in C: A seven to D minor, D seven to G, E seven to A minor, then G seven to C." },
      { id: "tonicization-song", type: "lead-sheet", heading: "A progression with temporary spotlights", songTitle: "Lantern Turns", key: "C", meter: "4/4", tempo: 76, capo: 0, sections: [
        { name: "A", repeatCount: 2, measures: [{ chord: "C", cue: "home", beats: 4 }, { chord: "E7", cue: "V7 of vi", beats: 4 }, { chord: "Am", cue: "temporary target", beats: 4 }, { chord: "A7", cue: "V7 of ii", beats: 4 }] },
        { name: "B", repeatCount: 1, measures: [{ chord: "Dm", cue: "target becomes predominant", beats: 4 }, { chord: "D7", cue: "V7 of V", beats: 4 }, { chord: "G7", cue: "real dominant", beats: 4 }, { chord: "C", cue: "home restored", beats: 4 }] }
      ], explanation: "E7 spotlights Am, A7 spotlights Dm, and D7 spotlights G. C still remains the governing key because the phrase returns through G7 to C.", accessibilityDescription: "Original C progression: C, E seven, A minor, A seven, D minor, D seven, G seven, C." },
      ...stages("secondary-dominants", "tonicization with secondary dominants", ["Observe V7/vi, V7/ii, and V7/V in C.", "Hear the altered third of each dominant resolving to the target.", "Compare tonicization with full modulation."], ["Choose a diatonic target chord.", "Build its dominant seventh.", "Resolve it and name the accidental."], ["Use slash notation without chord-name prompts.", "Write two secondary dominants in one phrase.", "Check whether the original key still returns."], ["Analyze secondary dominants in a progression.", "Write and perform a progression with three tonicizations.", "Explain each target and resolution."], ["Each secondary dominant has dominant quality.", "The target chord follows clearly.", "The original key remains recoverable."]),
      { id: "secondary-dominant-reflection", type: "reflection", heading: "Track each temporary target", prompt: "List each secondary dominant, its target chord, its altered note, and how the phrase returns to the home key.", fieldLabel: "Tonicization analysis", placeholder: "E7 is V7/vi; G sharp leads to A in Am. D7 is V7/V; F sharp leads to G before G7-C restores C major." }
    ],
    guidedExercises: [
      { id: "exercise.secondary-target", title: "Target first", purpose: "Prevent random chromatic dominant chords.", instructions: ["Pick ii, iii, IV, V, or vi as target.", "Build the target's V7.", "Resolve the altered tone by step.", "Return to the original key."], successCriteria: ["The target is named before the dominant.", "The altered note resolves by step.", "The home key is restored."], reduceDifficultyWhen: ["Use V7/V."], increaseDifficultyWhen: ["Use two secondary dominants in sequence."], relatedSkills: ["harmony", "dominants", "voice leading"] },
      { id: "exercise.tonicization-song", title: "Three temporary spotlights", purpose: "Use tonicization as songwriting motion.", instructions: ["Write an eight-bar progression in one key.", "Add two or three secondary dominants.", "Label every slash chord.", "Perform and listen for directed pull."], successCriteria: ["All slash labels are accurate.", "Each dominant resolves to its target.", "The phrase still has a home key."], reduceDifficultyWhen: ["Use the model progression."], increaseDifficultyWhen: ["Transpose to D or G."], relatedSkills: ["songwriting", "analysis", "lead sheets"] }
    ],
    commonMistakes: [
      { id: "mistake.secondary-random", symptom: "Chromatic dominant chords appear without clear resolution.", likelyCause: "The target chord was not chosen first.", adjustment: "Name the target, then build its V7." },
      { id: "mistake.secondary-modulation", symptom: "The phrase never returns to the original key.", likelyCause: "Tonicization became an unplanned modulation.", adjustment: "Add a cadence or common-tone route back home." },
      { id: "mistake.secondary-quality", symptom: "The secondary chord lacks dominant quality.", likelyCause: "A diatonic minor chord was substituted for V7.", adjustment: "Build 1-3-5-b7 from the target's fifth." }
    ],
    knowledgeChecks: [
      { id: "check.secondary-v-of-v", prompt: "In C major, what is V7/V?", options: ["D7 resolving to G", "G7 resolving to C", "A7 resolving to Dm"], correctAnswer: "D7 resolving to G", explanation: "G is V in C, and D7 is the dominant of G." },
      { id: "check.secondary-slash", prompt: "What does the slash in V7/ii mean?", options: ["Dominant of ii", "Two chords played at once", "A bass slash chord only"], correctAnswer: "Dominant of ii", explanation: "The slash points to the temporary target chord." },
      { id: "check.secondary-key", prompt: "What keeps tonicization from becoming full modulation?", options: ["The phrase returns to the original key center", "Every chord stays diatonic", "No altered notes appear"], correctAnswer: "The phrase returns to the original key center", explanation: "Tonicization is temporary emphasis inside a larger key." }
    ],
    masteryCriteria: [
      { id: "mastery.secondary-identify", description: "Identify secondary dominants and target chords in a progression.", verification: "guided-self-check", required: true },
      { id: "mastery.secondary-write", description: "Write and perform a progression with at least two resolved tonicizations.", verification: "performance-checklist", required: true },
      { id: "mastery.secondary-explain", description: "Explain altered notes and return to home key.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, build V7 of each diatonic triad in a key. After one week, analyze secondary dominants in a new chart.",
    optionalExtension: "Chain V7/vi to V7/ii to V7/V, then decide whether the result still feels like one key."
  },
  {
    id: "lesson.borrowed-chords-modal-mixture",
    unitId: "unit.borrowed-chords-modal-mixture",
    order: 1,
    title: "Borrow color from the parallel key",
    objective: "Identify common modal-mixture chords, compare parallel major and minor color, and write a progression that uses borrowed chords without losing the home tonic.",
    whyItMatters: "Borrowed chords let a major-key song darken, widen, or soften for a moment. The color works best when the listener still knows where home is.",
    estimatedMinutes: 140,
    priorKnowledge: ["Major and minor keys", "Roman numerals", "Voice leading", "Secondary dominants", "Song-form listening"],
    contentBlocks: [
      { id: "mixture-definition", type: "text", heading: "Modal mixture borrows from the parallel mode", paragraphs: ["In C major, chords such as Fm, Ab, Bb, and Db can be borrowed from C minor or related parallel colors. The tonic stays C, but the borrowed chord changes the emotional light.", "Do not confuse parallel with relative: C major borrows from C minor, not A minor. The shared tonic is what makes the borrowed color feel connected."] },
      { id: "mixture-common-chords", type: "progression-chart", heading: "Common borrowed colors in C", key: "C", meter: "4/4", measures: [
        { label: "Home", chord: "C", romanNumeral: "I", nashvilleNumber: "1", beats: 4 },
        { label: "Borrowed iv", chord: "Fm", romanNumeral: "iv", nashvilleNumber: "4m", beats: 4 },
        { label: "Borrowed bVI", chord: "Ab", romanNumeral: "bVI", nashvilleNumber: "b6", beats: 4 },
        { label: "Borrowed bVII", chord: "Bb", romanNumeral: "bVII", nashvilleNumber: "b7", beats: 4 }
      ], explanation: "The borrowed iv is one of the clearest mixture colors because A flat moves down from the diatonic A natural.", accessibilityDescription: "C major mixture examples: C major, F minor, A flat major, B flat major." },
      { id: "mixture-song", type: "lead-sheet", heading: "Borrowed color inside a major-key phrase", songTitle: "Cloud Over Home", key: "C", meter: "4/4", tempo: 74, capo: 0, sections: [
        { name: "A", repeatCount: 2, measures: [{ chord: "C", cue: "major home", beats: 4 }, { chord: "G", cue: "diatonic lift", beats: 4 }, { chord: "Am", cue: "relative color", beats: 4 }, { chord: "Fm", cue: "borrowed iv", beats: 4 }] },
        { name: "B", repeatCount: 1, measures: [{ chord: "C", cue: "home returns", beats: 4 }, { chord: "Ab", cue: "borrowed bVI", beats: 4 }, { chord: "Bb", cue: "borrowed bVII", beats: 4 }, { chord: "C", cue: "tonic restored", beats: 4 }] }
      ], explanation: "The phrase keeps C as home while using Fm, Ab, and Bb for color. The borrowed chords should sound chosen, not like a key-signature mistake.", accessibilityDescription: "Original C major mixture song: C G Am F minor, then C A flat B flat C." },
      ...stages("modal-mixture", "borrowed-chord color", ["Hear C major followed by C minor color.", "Observe iv, bVI, and bVII resolving back to I.", "Compare relative minor with parallel minor borrowing."], ["Choose the home tonic.", "Borrow one chord from the parallel minor.", "Resolve by common tone or half-step motion."], ["Use Roman numerals without a chord list.", "Write a four-bar phrase with one borrowed color.", "Check whether the tonic still feels stable."], ["Analyze and perform a phrase with at least two borrowed chords.", "Explain the parallel source and voice-leading effect.", "Revise one borrowed chord if it weakens the form."], ["The borrowed chord is labeled accurately.", "The tonic remains clear.", "The color supports a phrase or section purpose."]),
      { id: "mixture-reflection", type: "reflection", heading: "Explain the borrowed color", prompt: "Name each borrowed chord, its parallel source, the changed scale degree, and how it returns to or contrasts with tonic.", fieldLabel: "Mixture analysis", placeholder: "Fm is borrowed iv from C minor; A flat replaces A natural and resolves by half step to G over C." }
    ],
    guidedExercises: [
      { id: "exercise.mixture-one-color", title: "One borrowed chord, clear home", purpose: "Use mixture without losing the tonic.", instructions: ["Write I-IV-V-I in a major key.", "Replace IV with borrowed iv.", "Listen to the changed degree.", "Return clearly to I."], successCriteria: ["The tonic remains clear.", "The borrowed chord is parallel, not relative.", "The changed note is named."], reduceDifficultyWhen: ["Use C and Fm only."], increaseDifficultyWhen: ["Add bVI or bVII."], relatedSkills: ["modal mixture", "harmony", "voice leading"] },
      { id: "exercise.mixture-section", title: "Color a section boundary", purpose: "Use borrowed chords for form.", instructions: ["Choose a verse or bridge boundary.", "Add one borrowed chord before the new section.", "Explain the emotional or structural effect.", "Revise if the transition sounds accidental."], successCriteria: ["The borrowed chord supports a section purpose.", "The return or contrast is audible.", "The chart labels the source."], reduceDifficultyWhen: ["Use borrowed iv before I."], increaseDifficultyWhen: ["Use two borrowed chords with smooth top voice."], relatedSkills: ["songwriting", "form", "analysis"] }
    ],
    commonMistakes: [
      { id: "mistake.mixture-relative", symptom: "Borrowed chords are described as coming from the relative minor.", likelyCause: "Relative and parallel relationships are being confused.", adjustment: "State the shared tonic first: C major borrows from C minor." },
      { id: "mistake.mixture-random", symptom: "The borrowed chord sounds unrelated.", likelyCause: "No common-tone or half-step voice leading was planned.", adjustment: "Track one voice into and out of the borrowed chord." },
      { id: "mistake.mixture-overuse", symptom: "Borrowed chords take over and the tonic disappears.", likelyCause: "Color replaced harmonic direction.", adjustment: "Return to I and use borrowed chords at structural moments." }
    ],
    knowledgeChecks: [
      { id: "check.mixture-source", prompt: "In C major, where does borrowed iv usually come from?", options: ["C minor", "A minor", "G major"], correctAnswer: "C minor", explanation: "Modal mixture borrows from the parallel mode with the same tonic." },
      { id: "check.mixture-chord", prompt: "Which chord is a common borrowed chord in C major?", options: ["Fm", "Em", "G"], correctAnswer: "Fm", explanation: "F minor is borrowed iv from C minor." },
      { id: "check.mixture-purpose", prompt: "What should borrowed chords preserve?", options: ["A clear relationship to the tonic", "Only diatonic notes", "No voice leading"], correctAnswer: "A clear relationship to the tonic", explanation: "Mixture changes color while keeping home intelligible." }
    ],
    masteryCriteria: [
      { id: "mastery.mixture-identify", description: "Identify common borrowed chords and their parallel source.", verification: "guided-self-check", required: true },
      { id: "mastery.mixture-write", description: "Write and perform a phrase with borrowed color and clear tonic.", verification: "performance-checklist", required: true },
      { id: "mastery.mixture-explain", description: "Explain changed degrees and voice-leading effect.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, compare IV and iv in three keys. After one week, find or write a phrase where borrowed color marks a section change.",
    optionalExtension: "Keep the same melody note over diatonic IV and borrowed iv, then describe the emotional difference."
  },
  {
    id: "lesson.voice-leading-chord-melody",
    unitId: "unit.voice-leading-chord-melody",
    order: 1,
    title: "Let each voice move on purpose",
    objective: "Connect chords with smooth inner voices, harmonize a melody on top, and build a short chord-melody passage that preserves melody, bass, and harmonic function.",
    whyItMatters: "Chord melody teaches the guitar to behave like a small ensemble. Each note has a job, and smooth voice leading can make advanced harmony sound singable.",
    estimatedMinutes: 155,
    priorKnowledge: ["Triad inversions", "Seventh chords", "Lead sheets", "Voice leading", "Melodic phrasing"],
    contentBlocks: [
      { id: "chord-melody-principle", type: "text", heading: "Melody first, then voices underneath", paragraphs: ["In chord melody, the top note must remain audible as the melody. Harmony is voiced beneath it with the smallest useful movement.", "Start with melody notes on strings 1 or 2, choose chord tones underneath, then simplify. A beautiful two- or three-note voicing often communicates more clearly than a full grip."] },
      { id: "voice-leading-chart", type: "progression-chart", heading: "Voice-led ii-V-I in C", key: "C", meter: "4/4", measures: [
        { label: "Predominant", chord: "Dm7", romanNumeral: "ii7", nashvilleNumber: "2m7", beats: 4 },
        { label: "Dominant", chord: "G7", romanNumeral: "V7", nashvilleNumber: "5-7", beats: 4 },
        { label: "Tonic", chord: "Cmaj7", romanNumeral: "Imaj7", nashvilleNumber: "1maj7", beats: 4 },
        { label: "Tonic color", chord: "C6", romanNumeral: "I6", nashvilleNumber: "1-6", beats: 4 }
      ], explanation: "Track F to F, C to B, then B to C. The small inner motion reveals the cadence without big jumps.", accessibilityDescription: "C ii-V-I chord melody progression: D minor seven, G seven, C major seven, C six." },
      { id: "chord-melody-tab", type: "tablature", heading: "Two-note shell melody", tempo: 66, events: [
        { count: "1", notes: [{ string: 4, fret: 3 }, { string: 2, fret: 3 }], duration: "half", rest: false },
        { count: "3", notes: [{ string: 4, fret: 3 }, { string: 2, fret: 1 }], duration: "half", rest: false },
        { count: "1", notes: [{ string: 4, fret: 3 }, { string: 2, fret: 0 }], duration: "half", rest: false },
        { count: "3", notes: [{ string: 4, fret: 2 }, { string: 2, fret: 1 }], duration: "half", rest: false }
      ], explanation: "These compact shells keep the top voice moving D-C-B-C while lower voices imply Dm7, G7, and C harmony.", accessibilityDescription: "Two-note chord melody: F and D, F and C, F and B, then E and C." },
      ...stages("chord-melody", "voice-led chord melody", ["Hear the melody alone.", "Observe the smallest lower voices that support the melody.", "Compare full grips with compact shells."], ["Place melody notes on the top strings.", "Add one guide tone below each note.", "Check that the melody remains loudest."], ["Remove full chord names and use Roman function.", "Revise one inner voice for smaller motion.", "Simplify any grip that interrupts time."], ["Arrange an eight-bar chord melody from a lead sheet.", "Explain melody, bass, and inner-voice choices.", "Perform with clear melody and recoverable time."], ["The melody remains audible.", "Inner voices move by common tone or small interval when possible.", "Chord function is preserved with playable voicings."]),
      { id: "chord-melody-reflection", type: "reflection", heading: "Trace one voice", prompt: "Write the melody notes, bass or shell notes, and one inner voice. Explain where you used common tone, stepwise motion, or simplification.", fieldLabel: "Chord-melody voice map", placeholder: "Top voice D-C-B-C; lower F stays common through Dm7 and G7, then moves to E for C." }
    ],
    guidedExercises: [
      { id: "exercise.melody-on-top", title: "Top voice first", purpose: "Keep chord melody from burying the tune.", instructions: ["Play the melody alone.", "Choose a voicing with the melody on top.", "Add only one lower note.", "Increase density only if time and tone remain clear."], successCriteria: ["The melody is highest and clearest.", "The lower note matches the chord.", "The passage stays in time."], reduceDifficultyWhen: ["Use two-note shells only."], increaseDifficultyWhen: ["Add bass motion."], relatedSkills: ["chord melody", "voicing", "voice leading"] },
      { id: "exercise.inner-voice-revision", title: "One smoother voice", purpose: "Make voice leading visible.", instructions: ["Choose a four-chord progression.", "Write one inner voice.", "Revise it to reduce leaps.", "Perform before and after."], successCriteria: ["At least one leap is reduced.", "Chord function remains intact.", "The revised version sounds smoother."], reduceDifficultyWhen: ["Use ii-V-I only."], increaseDifficultyWhen: ["Add a borrowed chord."], relatedSkills: ["voice leading", "harmony", "arrangement"] }
    ],
    commonMistakes: [
      { id: "mistake.chord-melody-buried", symptom: "The melody disappears inside the chord.", likelyCause: "Voicing was chosen before melody placement.", adjustment: "Place the melody as the highest note before adding lower voices." },
      { id: "mistake.chord-melody-grip", symptom: "Large grips interrupt timing.", likelyCause: "Fullness was valued over clarity.", adjustment: "Use two- or three-note shells and preserve pulse." },
      { id: "mistake.chord-melody-random", symptom: "Inner voices jump without purpose.", likelyCause: "Voices were not tracked separately.", adjustment: "Write one inner voice as a line and revise leaps." }
    ],
    knowledgeChecks: [
      { id: "check.chord-melody-priority", prompt: "What is usually the first priority in chord melody?", options: ["Keep the melody clear on top", "Use the largest possible grip", "Avoid all guide tones"], correctAnswer: "Keep the melody clear on top", explanation: "The listener must hear the tune before appreciating the harmony." },
      { id: "check.voice-leading-common", prompt: "What does a common tone do?", options: ["Stays the same across chords", "Always jumps an octave", "Removes the melody"], correctAnswer: "Stays the same across chords", explanation: "Common tones can connect chords smoothly." },
      { id: "check.chord-melody-shell", prompt: "Why use shell voicings?", options: ["They preserve function with fewer notes", "They erase harmony", "They require every string"], correctAnswer: "They preserve function with fewer notes", explanation: "Shells can communicate harmony while staying playable." }
    ],
    masteryCriteria: [
      { id: "mastery.chord-melody-arrange", description: "Arrange and perform an eight-bar chord melody.", verification: "performance-checklist", required: true },
      { id: "mastery.chord-melody-voices", description: "Trace melody and one inner voice through the passage.", verification: "reflection", required: true },
      { id: "mastery.chord-melody-function", description: "Preserve chord function with playable voicings.", verification: "guided-self-check", required: true }
    ],
    reviewRecommendation: "Next session, play the melody alone before the chord melody. After one week, reharmonize two melody notes with smoother inner voices.",
    optionalExtension: "Arrange the same melody once with triads and once with seventh shells."
  },
  {
    id: "lesson.advanced-rhythm-meter",
    unitId: "unit.advanced-rhythm-meter",
    order: 1,
    title: "Keep form steady when the meter gets interesting",
    objective: "Perform odd-meter counts, syncopated groupings, and layered subdivision patterns while keeping a recoverable pulse and clear form.",
    whyItMatters: "Advanced rhythm is not complexity for its own sake. It gives a phrase shape, tension, and release when the pulse stays trustworthy.",
    estimatedMinutes: 145,
    priorKnowledge: ["Metronome practice", "Sixteenth-note groove", "Rhythm grids", "Form counting", "Recovery after mistakes"],
    contentBlocks: [
      { id: "advanced-rhythm-principle", type: "text", heading: "Count the large pulse before the small grid", paragraphs: ["Odd meter becomes playable when grouped clearly. A 7/8 phrase might feel 2+2+3 or 3+2+2; the grouping is a musical decision.", "Layered subdivision means one part can imply a different grouping while the main pulse remains stable. Practice slowly enough that recovery is possible."] },
      { id: "seven-eight-grid", type: "rhythm-grid", heading: "7/8 grouped 2+2+3", meter: "4/4", events: [
        { count: "1", action: "down", accent: true }, { count: "&", action: "up", accent: false },
        { count: "2", action: "down", accent: true }, { count: "&", action: "up", accent: false },
        { count: "3", action: "down", accent: true }, { count: "&", action: "up", accent: false },
        { count: "a", action: "up", accent: false }
      ], explanation: "This represents seven eighth-note pulses as 2+2+3. Count it aloud as ONE-and TWO-and THREE-and-a before adding pitch.", accessibilityDescription: "Seven eighth pulses grouped two plus two plus three, with accents on group starts." },
      { id: "advanced-rhythm-chart", type: "lead-sheet", heading: "Meter contrast study", songTitle: "Seven Steps Home", key: "E", meter: "4/4", tempo: 68, capo: 0, sections: [
        { name: "A: 7-pulse riff", repeatCount: 4, measures: [{ chord: "Em", cue: "count 2+2+3 across seven eighths", beats: 4 }, { chord: "D", cue: "repeat grouping", beats: 4 }] },
        { name: "B: square release", repeatCount: 2, measures: [{ chord: "G", cue: "return to four", beats: 4 }, { chord: "A", cue: "open rhythm", beats: 4 }, { chord: "Em", cue: "resolve", beats: 4 }] }
      ], explanation: "The chart stores the phrase plan in 4/4-compatible measures while the cue names the seven-pulse grouping. The counted grouping and clean return are the key tasks.", accessibilityDescription: "Original rhythm study alternates an E minor to D seven-pulse riff with a G A E minor four-four release." },
      ...stages("advanced-rhythm", "odd grouping and layered subdivision", ["Clap the large pulse.", "Count 2+2+3 and 3+2+2 groupings.", "Hear the return to square four-bar phrasing."], ["Mute strings and perform the grouping.", "Add one chord per group start.", "Use a slow metronome and recover after an error."], ["Remove written counts and keep only accents.", "Change the grouping while preserving total pulses.", "Return to 4/4 without stopping."], ["Perform an odd-grouping riff and a contrasting release section.", "Explain the grouping and subdivision.", "Create a recovery plan for timing mistakes."], ["Group accents are consistent.", "Pulse remains recoverable.", "The return to simpler meter is clean."]),
      { id: "advanced-rhythm-reflection", type: "reflection", heading: "Name the grouping and recovery plan", prompt: "Write the grouping, where the accents fall, what subdivision is active, and how you recover if the phrase turns around early.", fieldLabel: "Rhythm map", placeholder: "7 pulses grouped 2+2+3; accents on 1, 3, 5; if I lose the last group, I mute and re-enter on the next ONE." }
    ],
    guidedExercises: [
      { id: "exercise.grouping-mute", title: "Muted grouping first", purpose: "Separate rhythm control from chord difficulty.", instructions: ["Mute all strings.", "Count the grouping aloud.", "Accent group starts.", "Add one chord only after the count is stable."], successCriteria: ["The grouping is spoken and played.", "Accents remain consistent.", "Mistakes recover without restarting the whole form."], reduceDifficultyWhen: ["Use one open string."], increaseDifficultyWhen: ["Alternate 2+2+3 and 3+2+2."], relatedSkills: ["rhythm", "meter", "recovery"] },
      { id: "exercise.meter-release", title: "Complex phrase, simple release", purpose: "Use rhythm for form.", instructions: ["Write one odd-grouped riff.", "Follow it with a simple four-beat section.", "Practice the boundary.", "Describe the contrast."], successCriteria: ["The boundary is clean.", "The contrast is audible.", "The form remains countable."], reduceDifficultyWhen: ["Use clapping only."], increaseDifficultyWhen: ["Add a second guitar part with a different accent pattern."], relatedSkills: ["form", "meter", "arrangement"] }
    ],
    commonMistakes: [
      { id: "mistake.rhythm-count", symptom: "The riff can be played alone but not re-entered.", likelyCause: "The large pulse and form were not counted.", adjustment: "Count group starts and practice the final group into the next downbeat." },
      { id: "mistake.rhythm-speed", symptom: "The pattern collapses at tempo.", likelyCause: "Subdivision was increased before recovery was reliable.", adjustment: "Slow down until one clean recovery is possible." },
      { id: "mistake.rhythm-complexity", symptom: "Sections are complex and the listener loses shape.", likelyCause: "Contrast was not planned.", adjustment: "Pair the advanced grouping with a simpler release." }
    ],
    knowledgeChecks: [
      { id: "check.rhythm-seven", prompt: "What does 2+2+3 describe?", options: ["A grouping of seven eighth pulses", "A chord formula", "A tuning"], correctAnswer: "A grouping of seven eighth pulses", explanation: "The numbers describe how pulses are accented." },
      { id: "check.rhythm-recovery", prompt: "What is a good recovery strategy?", options: ["Mute and re-enter on a known accent", "Speed up randomly", "Ignore the form"], correctAnswer: "Mute and re-enter on a known accent", explanation: "Recovery depends on knowing the next stable point." },
      { id: "check.rhythm-contrast", prompt: "Why follow complex rhythm with a simpler section?", options: ["To make the form and release clear", "To avoid all pulse", "To hide the meter"], correctAnswer: "To make the form and release clear", explanation: "Contrast helps the listener feel the shape." }
    ],
    masteryCriteria: [
      { id: "mastery.rhythm-grouping", description: "Perform a counted odd grouping with stable accents.", verification: "performance-checklist", required: true },
      { id: "mastery.rhythm-release", description: "Move from advanced grouping into a simpler release section.", verification: "performance-checklist", required: true },
      { id: "mastery.rhythm-plan", description: "Explain grouping, subdivision, and recovery strategy.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, clap the grouping before playing. After one week, change the grouping while keeping the same total pulse count.",
    optionalExtension: "Create a two-part arrangement where one guitar accents group starts and another sustains over them."
  },
  {
    id: "lesson.genre-language-stylistic-authenticity",
    unitId: "unit.genre-language-stylistic-authenticity",
    order: 1,
    title: "Study style without flattening it into tricks",
    objective: "Analyze genre vocabulary through rhythm, tone, harmony, articulation, form, and cultural context, then create a short study that uses vocabulary with care.",
    whyItMatters: "Style is more than a lick. Good genre study asks what the vocabulary does, where it comes from, and how to use it without turning living music into a checklist.",
    estimatedMinutes: 135,
    priorKnowledge: ["Rhythm vocabulary", "Harmony analysis", "Arrangement roles", "Tone control", "Reflective practice"],
    contentBlocks: [
      { id: "genre-framework", type: "text", heading: "Style has musical and cultural dimensions", paragraphs: ["Analyze style through groove, articulation, tone, harmonic rhythm, common forms, call-and-response, role in an ensemble, and historical context. Avoid reducing a genre to one surface gesture.", "Use original studies or public-domain material for practice. When learning from recordings, document observations and do not copy copyrighted solos into the curriculum."] },
      { id: "genre-comparison", type: "progression-chart", heading: "Same chords, different roles", key: "A", meter: "4/4", measures: [
        { label: "Soul pocket", chord: "A7", romanNumeral: "I7", nashvilleNumber: "1-7", beats: 4 },
        { label: "Blues response", chord: "D7", romanNumeral: "IV7", nashvilleNumber: "4-7", beats: 4 },
        { label: "Rock drive", chord: "E7", romanNumeral: "V7", nashvilleNumber: "5-7", beats: 4 },
        { label: "Return", chord: "A7", romanNumeral: "I7", nashvilleNumber: "1-7", beats: 4 }
      ], explanation: "The same dominant chords can behave differently depending on groove, articulation, tone, and ensemble role.", accessibilityDescription: "A dominant progression A seven, D seven, E seven, A seven used for comparing style roles." },
      { id: "genre-rhythm-grid", type: "rhythm-grid", heading: "Pocket study with space", meter: "4/4", events: [
        { count: "1", action: "down", accent: true }, { count: "&", action: "rest", accent: false },
        { count: "2", action: "mute", accent: false }, { count: "&", action: "up", accent: true },
        { count: "3", action: "rest", accent: false }, { count: "&", action: "up", accent: false },
        { count: "4", action: "down", accent: true }, { count: "&", action: "rest", accent: false }
      ], explanation: "The rests matter as much as the attacks. Style vocabulary includes placement and restraint.", accessibilityDescription: "Four-four pocket rhythm with accents on beat one, the and of two, and beat four, plus rests." },
      ...stages("genre-language", "style vocabulary with context", ["Observe groove, tone, articulation, harmony, and role separately.", "Hear how the same chords change across feel.", "Identify cultural or historical context for the vocabulary."], ["Choose one style element to practice.", "Create an original two-bar study.", "Document source observations without copying material."], ["Remove the checklist and listen for the role.", "Revise tone or rhythm before adding more notes.", "Ask whether the part serves the ensemble."], ["Create and perform a short original style study.", "Explain musical vocabulary and context.", "Name what you chose not to imitate."], ["The study uses specific vocabulary.", "The explanation avoids stereotypes and vague labels.", "The part has a clear musical role."]),
      { id: "genre-reflection", type: "reflection", heading: "Describe vocabulary and responsibility", prompt: "Name the style being studied, list musical observations, identify one context source, and explain how your original study uses vocabulary without copying a recording.", fieldLabel: "Style study notes", placeholder: "I studied pocket rhythm and muted articulation; my original two-bar part uses space on beat 3 instead of copying a recorded riff." }
    ],
    guidedExercises: [
      { id: "exercise.genre-one-variable", title: "One style variable", purpose: "Avoid shallow imitation.", instructions: ["Choose groove, tone, articulation, harmony, or role.", "Practice only that variable over a simple progression.", "Record observations in words.", "Create an original two-bar study."], successCriteria: ["One variable is isolated.", "The study is original.", "The role is explained."], reduceDifficultyWhen: ["Use muted rhythm only."], increaseDifficultyWhen: ["Compare two styles on the same progression."], relatedSkills: ["style", "listening", "arrangement"] },
      { id: "exercise.genre-context", title: "Context before vocabulary", purpose: "Connect style practice to responsible listening.", instructions: ["Identify one reliable context source.", "Write three musical observations.", "Choose one observation to practice.", "Avoid copying a specific recorded phrase."], successCriteria: ["Context is named.", "Observations are musical and specific.", "The resulting study is original."], reduceDifficultyWhen: ["Use a teacher-provided context note."], increaseDifficultyWhen: ["Compare ensemble roles across recordings."], relatedSkills: ["research", "listening", "reflection"] }
    ],
    commonMistakes: [
      { id: "mistake.genre-cliche", symptom: "The study uses one obvious gesture and calls it a genre.", likelyCause: "Surface vocabulary replaced deeper listening.", adjustment: "Analyze groove, tone, articulation, harmony, and role separately." },
      { id: "mistake.genre-copy", symptom: "A recorded riff is copied as the assignment.", likelyCause: "Imitation was not separated from original study.", adjustment: "Document observations and write a new phrase." },
      { id: "mistake.genre-context", symptom: "The explanation ignores where the style comes from.", likelyCause: "Context was treated as optional.", adjustment: "Add one historical or cultural context source before final reflection." }
    ],
    knowledgeChecks: [
      { id: "check.genre-style", prompt: "What is style vocabulary?", options: ["A combination of groove, tone, articulation, harmony, role, and context", "One lick only", "Only the guitar brand"], correctAnswer: "A combination of groove, tone, articulation, harmony, role, and context", explanation: "Style is multidimensional." },
      { id: "check.genre-original", prompt: "What should a curriculum style study avoid?", options: ["Copying copyrighted recorded phrases", "Original vocabulary practice", "Context notes"], correctAnswer: "Copying copyrighted recorded phrases", explanation: "Use observations to create original studies." },
      { id: "check.genre-role", prompt: "Why name the ensemble role?", options: ["It explains what the part is doing musically", "It removes rhythm", "It makes context irrelevant"], correctAnswer: "It explains what the part is doing musically", explanation: "Style vocabulary serves a role in the texture." }
    ],
    masteryCriteria: [
      { id: "mastery.genre-analyze", description: "Analyze style through at least five musical/context dimensions.", verification: "reflection", required: true },
      { id: "mastery.genre-study", description: "Perform an original short style study.", verification: "performance-checklist", required: true },
      { id: "mastery.genre-role", description: "Explain the part's role and what was not copied.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, isolate one style variable before adding notes. After one week, compare the same progression in two style roles.",
    optionalExtension: "Write two parts for the same groove: one supportive rhythm role and one response role."
  },
  {
    id: "lesson.counterpoint-independent-lines",
    unitId: "unit.counterpoint-independent-lines",
    order: 1,
    title: "Write lines that agree without merging",
    objective: "Compose two independent guitar lines with clear contour, controlled consonance and dissonance, contrary motion, and a readable relationship to harmony.",
    whyItMatters: "Counterpoint strengthens arranging, chord melody, and improvisation because it teaches each line to be singable while still fitting the whole.",
    estimatedMinutes: 150,
    priorKnowledge: ["Intervals", "Chord tones", "Voice leading", "Motif development", "Arrangement roles"],
    contentBlocks: [
      { id: "counterpoint-principle", type: "text", heading: "Independence and agreement are both required", paragraphs: ["Two lines should be individually singable and rhythmically clear. They also need enough consonance, prepared dissonance, and harmonic agreement to sound planned.", "Contrary motion often clarifies independence. Parallel motion can work, but too much of it makes two lines collapse into one block."] },
      { id: "counterpoint-harmony", type: "progression-chart", heading: "Two-line study framework", key: "C", meter: "4/4", measures: [
        { label: "Start", chord: "C", romanNumeral: "I", nashvilleNumber: "1", beats: 4 },
        { label: "Move", chord: "Dm", romanNumeral: "ii", nashvilleNumber: "2m", beats: 4 },
        { label: "Tension", chord: "G", romanNumeral: "V", nashvilleNumber: "5", beats: 4 },
        { label: "Arrival", chord: "C", romanNumeral: "I", nashvilleNumber: "1", beats: 4 }
      ], explanation: "Use simple harmony so the independence of the two lines can be heard.", accessibilityDescription: "Counterpoint framework in C: C, D minor, G, C." },
      { id: "counterpoint-tab", type: "tablature", heading: "Contrary-motion two-line model", tempo: 64, events: [
        { count: "1", notes: [{ string: 2, fret: 1 }, { string: 4, fret: 2 }], duration: "quarter", rest: false },
        { count: "2", notes: [{ string: 2, fret: 3 }, { string: 4, fret: 0 }], duration: "quarter", rest: false },
        { count: "3", notes: [{ string: 1, fret: 0 }, { string: 5, fret: 3 }], duration: "quarter", rest: false },
        { count: "4", notes: [{ string: 1, fret: 1 }, { string: 5, fret: 2 }], duration: "quarter", rest: false },
        { count: "1", notes: [{ string: 1, fret: 0 }, { string: 5, fret: 3 }], duration: "half", rest: false },
        { count: "3", notes: [{ string: 2, fret: 1 }, { string: 4, fret: 2 }], duration: "half", rest: false }
      ], explanation: "The upper line rises C-D-E-F then resolves; the lower line moves E-D-C-B-C-E. Sing each line separately before playing both.", accessibilityDescription: "Two-line tab with upper C D E F E C and lower E D C B C E." },
      ...stages("counterpoint-lines", "independent two-line writing", ["Hear each line alone.", "Observe contrary motion and arrival points.", "Compare consonance with prepared dissonance."], ["Write the upper line first.", "Add a lower line with mostly contrary or oblique motion.", "Check vertical intervals against the chord."], ["Remove interval prompts and sing both lines separately.", "Revise one parallel passage.", "Prepare and resolve one dissonance."], ["Compose and perform an eight-bar two-line study.", "Explain motion types and dissonance treatment.", "Show how both lines imply harmony."], ["Each line is singable alone.", "Motion types are named.", "Dissonances are prepared or resolved."]),
      { id: "counterpoint-reflection", type: "reflection", heading: "Audit line independence", prompt: "Write both lines, mark contrary, oblique, and parallel motion, identify one consonance and one prepared dissonance, and explain the implied harmony.", fieldLabel: "Counterpoint audit", placeholder: "Upper line rises while lower descends in bar 1; the suspended fourth resolves by step over G." }
    ],
    guidedExercises: [
      { id: "exercise.counterpoint-one-line", title: "Singable line first", purpose: "Keep melody ahead of vertical interval math.", instructions: ["Write one four-bar melody.", "Sing it without guitar.", "Add a lower line mostly in contrary motion.", "Check the vertical sound on strong beats."], successCriteria: ["Each line can be sung alone.", "Strong beats match the harmony.", "Contrary motion appears in the study."], reduceDifficultyWhen: ["Use half notes."], increaseDifficultyWhen: ["Add one prepared suspension."], relatedSkills: ["counterpoint", "melody", "harmony"] },
      { id: "exercise.counterpoint-revision", title: "Fix one collision", purpose: "Make counterpoint revision concrete.", instructions: ["Find one awkward vertical interval or parallel passage.", "Change only one line.", "Replay both lines.", "Document why the revision works better."], successCriteria: ["One issue is identified.", "The revision preserves both melodies.", "The harmony remains clear."], reduceDifficultyWhen: ["Revise two measures only."], increaseDifficultyWhen: ["Apply the revision to a chord-melody passage."], relatedSkills: ["revision", "voice leading", "arrangement"] }
    ],
    commonMistakes: [
      { id: "mistake.counterpoint-chords", symptom: "The two lines sound like block chords only.", likelyCause: "Vertical harmony was prioritized over melodic independence.", adjustment: "Sing each line alone and add contrary motion." },
      { id: "mistake.counterpoint-dissonance", symptom: "Dissonances sound accidental.", likelyCause: "They were not prepared or resolved.", adjustment: "Approach and leave the dissonance by step." },
      { id: "mistake.counterpoint-range", symptom: "The lines cross and become hard to hear.", likelyCause: "Registers were not assigned.", adjustment: "Keep upper and lower ranges distinct for the first study." }
    ],
    knowledgeChecks: [
      { id: "check.counterpoint-contrary", prompt: "What is contrary motion?", options: ["Two lines move in opposite directions", "Both lines rest", "One line copies the other exactly"], correctAnswer: "Two lines move in opposite directions", explanation: "Contrary motion often clarifies independence." },
      { id: "check.counterpoint-dissonance", prompt: "What should happen to most dissonances in this study?", options: ["They should be prepared or resolved", "They should be ignored", "They should replace the meter"], correctAnswer: "They should be prepared or resolved", explanation: "Treatment makes dissonance sound planned." },
      { id: "check.counterpoint-line", prompt: "Why sing each line separately?", options: ["To verify each line works as melody", "To avoid rhythm", "To remove harmony"], correctAnswer: "To verify each line works as melody", explanation: "Counterpoint needs independent melodic lines." }
    ],
    masteryCriteria: [
      { id: "mastery.counterpoint-compose", description: "Compose and perform an eight-bar two-line study.", verification: "performance-checklist", required: true },
      { id: "mastery.counterpoint-audit", description: "Mark motion types and dissonance treatment.", verification: "reflection", required: true },
      { id: "mastery.counterpoint-harmony", description: "Explain how the lines imply the harmony.", verification: "guided-self-check", required: true }
    ],
    reviewRecommendation: "Next session, sing each line before playing both. After one week, revise one two-line passage to improve independence.",
    optionalExtension: "Turn the two-line study into a chord-melody arrangement by adding selected inner voices."
  },
  {
    id: "lesson.level-four-creative-portfolio",
    unitId: "unit.level-four-creative-portfolio",
    order: 1,
    title: "Build a Level 4 creative portfolio",
    objective: "Integrate modal color, chromatic harmony, borrowed chords, chord melody, advanced rhythm, genre study, and counterpoint into an upper-intermediate portfolio with reflection and next-step planning.",
    whyItMatters: "A creative portfolio shows how advanced concepts have become musical choices. It also shows what still needs practice without pretending one polished artifact is the whole musician.",
    estimatedMinutes: 260,
    priorKnowledge: ["All Level 4 units", "Level 3 project workflow", "Analysis", "Arrangement", "Reflective practice"],
    contentBlocks: [
      { id: "level-four-portfolio-scope", type: "text", heading: "The portfolio collects choices, not trophies", paragraphs: ["Prepare three short artifacts: one harmonic-color study, one rhythm or style study, and one chord-melody or counterpoint study. At least one artifact should become a complete two- to four-minute performance or arrangement.", "Each artifact needs a chart or map, analysis, performance notes, reflection, and a next-practice plan. The app still uses self-confirmed checks; it does not judge audio."] },
      { id: "level-four-portfolio-chart", type: "lead-sheet", heading: "Portfolio performance template", songTitle: "Fourth Gate Portfolio Study", key: "A", meter: "4/4", tempo: 78, capo: 0, sections: [
        { name: "Modal A", repeatCount: 2, measures: [{ chord: "Am7", cue: "Dorian color with F sharp", beats: 4 }, { chord: "D", cue: "modal IV", beats: 4 }, { chord: "Am7", cue: "center returns", beats: 4 }, { chord: "G", cue: "bVII color", beats: 4 }] },
        { name: "Chromatic B", repeatCount: 1, measures: [{ chord: "C", cue: "borrowed bIII color", beats: 4 }, { chord: "E7", cue: "V7 of vi or dominant pull", beats: 4 }, { chord: "Am", cue: "target", beats: 4 }, { chord: "F", cue: "mixture color", beats: 4 }] },
        { name: "Line study", repeatCount: 1, measures: [{ chord: "Dm7", cue: "two-line texture", beats: 4 }, { chord: "G7", cue: "guide-tone motion", beats: 4 }, { chord: "Cmaj7", cue: "chord-melody arrival", beats: 4 }] }
      ], explanation: "Use this template or an equivalent original piece. The portfolio should show choices from several Level 4 areas, not a pile of concepts.", accessibilityDescription: "Level 4 portfolio template: A Dorian section Am7 D Am7 G; chromatic section C E7 Am F; line study Dm7 G7 Cmaj7." },
      { id: "portfolio-evidence-checklist", type: "instrument-setup", heading: "Level 4 project checklist", items: [
        { label: "Harmonic color", instruction: "Include modal color, secondary dominant, or modal mixture and label the source.", selfCheck: "The color is audible and named." },
        { label: "Rhythm or style", instruction: "Include an advanced grouping or genre-study observation.", selfCheck: "The role, groove, and context are explained." },
        { label: "Line writing", instruction: "Include chord melody, voice leading, or counterpoint.", selfCheck: "At least one line can be sung and traced." },
        { label: "Plan", instruction: "Write the next four-week plan from the weakest artifact.", selfCheck: "Tasks, tempos, review dates, and success checks are specific." }
      ], safetyNote: "Keep practice blocks sustainable and reduce complexity if pain, strain, or overload prevents careful listening.", accessibilityDescription: "Level 4 portfolio checklist for harmonic color, rhythm or style, line writing, and next practice plan." },
      ...stages("level-four-portfolio", "upper-intermediate creative portfolio", ["Review examples of harmonic color, advanced rhythm, style study, and line writing.", "Observe how one template combines several areas.", "Identify the weakest area before final polish."], ["Draft three artifacts.", "Choose one to expand into a complete performance.", "Create analysis and reflection as you build."], ["Run complete takes with a short checklist.", "Revise the weakest artifact first.", "Reduce prompts to form cues and concept labels."], ["Present the portfolio artifacts and one complete performance.", "Explain concept choices and supporting details.", "Write the next four-week plan."], ["Artifacts show distinct Level 4 areas.", "Analysis matches the performed material.", "The next plan is specific and based on the project."]),
      { id: "portfolio-reflection", type: "reflection", heading: "Choose the next mountain", prompt: "Summarize the three artifacts, identify the strongest and weakest Level 4 areas, cite the project details, and write the next four-week plan.", fieldLabel: "Level 4 portfolio reflection", placeholder: "Strongest: modal writing. Weakest: counterpoint. Week 1 sings both lines at 60 BPM; Week 2 adds prepared dissonance; Week 3 arranges chord melody; Week 4 records a complete take." }
    ],
    guidedExercises: [
      { id: "exercise.portfolio-triad", title: "Three artifact draft", purpose: "Prevent the portfolio from becoming one narrow performance.", instructions: ["Draft one harmonic-color study.", "Draft one rhythm or style study.", "Draft one line-writing study.", "Choose one for full performance."], successCriteria: ["Three domains are represented.", "Each artifact has a chart or map.", "The chosen performance has a clear form."], reduceDifficultyWhen: ["Use two artifacts first."], increaseDifficultyWhen: ["Transpose one artifact."], relatedSkills: ["portfolio", "composition", "analysis"] },
      { id: "exercise.portfolio-evidence", title: "Notes before polish", purpose: "Make creative decisions reviewable.", instructions: ["Attach analysis to each artifact.", "Record or describe one complete take.", "Write a reflection on the weakest area.", "Turn that weakness into a four-week plan."], successCriteria: ["Notes match the artifact.", "The weak-area plan is specific.", "The complete take includes recovery."], reduceDifficultyWhen: ["Use the template chart."], increaseDifficultyWhen: ["Add a collaborator or second guitar role."], relatedSkills: ["reflection", "practice planning", "performance"] }
    ],
    commonMistakes: [
      { id: "mistake.portfolio-overload", symptom: "Advanced concepts get forced into one piece.", likelyCause: "Coverage was confused with musical clarity.", adjustment: "Use three short artifacts and one complete performance." },
      { id: "mistake.portfolio-analysis", symptom: "The piece is played but the concept choices are not explained.", likelyCause: "Reflection was delayed until after polish.", adjustment: "Write analysis while composing." },
      { id: "mistake.portfolio-plan", symptom: "The next step is vague.", likelyCause: "The weak area was not named.", adjustment: "Choose one weakest artifact and define weekly tasks and success checks." }
    ],
    knowledgeChecks: [
      { id: "check.portfolio-artifacts", prompt: "What should the Level 4 portfolio include?", options: ["Multiple artifacts plus one complete performance or arrangement", "Only one fast solo", "Only vocabulary definitions"], correctAnswer: "Multiple artifacts plus one complete performance or arrangement", explanation: "The portfolio shows breadth and integration." },
      { id: "check.portfolio-evidence", prompt: "What must analysis do?", options: ["Match the performed material", "Replace performance", "Hide weak areas"], correctAnswer: "Match the performed material", explanation: "Project notes and performance need to agree." },
      { id: "check.portfolio-plan", prompt: "What should the next plan be based on?", options: ["The weakest project area", "The easiest topic only", "A random new skill"], correctAnswer: "The weakest project area", explanation: "The plan grows from the portfolio." }
    ],
    masteryCriteria: [
      { id: "mastery.portfolio-artifacts", description: "Create three Level 4 artifacts across distinct domains.", verification: "recorded-value", required: true },
      { id: "mastery.portfolio-performance", description: "Complete one two- to four-minute performance or arrangement.", verification: "performance-checklist", required: true },
      { id: "mastery.portfolio-analysis", description: "Provide analysis and reflection that match the artifacts.", verification: "reflection", required: true },
      { id: "mastery.portfolio-plan", description: "Write a four-week weak-area plan with measurable success checks.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "After completion, review the weak-area plan weekly and choose Level 5 work from the portfolio, not novelty.",
    optionalExtension: "Prepare a second version of one artifact for a different instrumentation or style role."
  }
];

export const levelFourReviewPlans: readonly CurriculumReviewPlan[] = [
  { id: "review.modes-as-sounds", unitId: "unit.modes-as-sounds", immediateReview: ["Name two modal centers and their color degrees."], nextSessionReview: ["Perform one modal phrase over a drone before viewing the pattern."], oneWeekReview: ["Transpose a modal study to a new root."], longTermReview: ["Check future modal playing for center, color degree, and non-functional harmony."] },
  { id: "review.secondary-dominants-tonicization", unitId: "unit.secondary-dominants-tonicization", immediateReview: ["Build V7/V and V7/vi in C."], nextSessionReview: ["Write one phrase with two resolved secondary dominants."], oneWeekReview: ["Analyze tonicization in a new chart."], longTermReview: ["Use target-first thinking whenever chromatic dominants appear."] },
  { id: "review.borrowed-chords-modal-mixture", unitId: "unit.borrowed-chords-modal-mixture", immediateReview: ["Compare IV and borrowed iv in one key."], nextSessionReview: ["Write a four-bar phrase with one borrowed chord and clear tonic."], oneWeekReview: ["Analyze changed scale degrees in a new mixture example."], longTermReview: ["Use borrowed chords as section color with planned voice leading."] },
  { id: "review.voice-leading-chord-melody", unitId: "unit.voice-leading-chord-melody", immediateReview: ["Play the melody alone before adding lower voices."], nextSessionReview: ["Arrange two measures with melody on top and one guide tone below."], oneWeekReview: ["Revise one inner voice for smoother motion."], longTermReview: ["Use compact shells whenever full grips hide melody or pulse."] },
  { id: "review.advanced-rhythm-meter", unitId: "unit.advanced-rhythm-meter", immediateReview: ["Clap one 2+2+3 grouping and name the accents."], nextSessionReview: ["Move from the odd grouping into a simple release section."], oneWeekReview: ["Change the grouping while preserving total pulse count."], longTermReview: ["Use grouping and recovery plans before increasing rhythmic density."] },
  { id: "review.genre-language-stylistic-authenticity", unitId: "unit.genre-language-stylistic-authenticity", immediateReview: ["Name one style variable and one context observation."], nextSessionReview: ["Create an original two-bar study from one observation."], oneWeekReview: ["Compare the same progression in two style roles."], longTermReview: ["Separate respectful listening, vocabulary analysis, and original application in future style work."] },
  { id: "review.counterpoint-independent-lines", unitId: "unit.counterpoint-independent-lines", immediateReview: ["Sing each line separately and name one motion type."], nextSessionReview: ["Revise one two-line passage to improve independence."], oneWeekReview: ["Add one prepared dissonance and explain its resolution."], longTermReview: ["Use line independence to strengthen chord melody and arrangement work."] },
  { id: "review.level-four-creative-portfolio", unitId: "unit.level-four-creative-portfolio", immediateReview: ["List the three portfolio artifacts and weakest area."], nextSessionReview: ["Run one complete take and revise the weakest artifact."], oneWeekReview: ["Check that performance, analysis, reflection, and practice plan agree."], longTermReview: ["Use the portfolio to choose the first Level 5 study focus."] }
];
