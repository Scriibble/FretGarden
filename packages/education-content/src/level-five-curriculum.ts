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
    { stage: "model" as const, label: "Observe", supports: ["Complete model", "Decision labels"], instructions: model },
    { stage: "guided" as const, label: "Try with prompts", supports: ["Step list", "Single-variable revision"], instructions: guided },
    { stage: "scaffold-fade" as const, label: "Use fewer prompts", supports: ["Check after the attempt"], instructions: fade },
    { stage: "independent" as const, label: "Perform independently", supports: [], instructions: independent }
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

const iiVITemplate: CurriculumContentBlock = {
  id: "level-five-ii-v-i-color-template",
  type: "progression-chart",
  heading: "Color decisions over a ii-V-I",
  key: "C",
  meter: "4/4",
  measures: [
    { label: "Predominant", chord: "Dm9", romanNumeral: "ii9", nashvilleNumber: "2m9", beats: 4 },
    { label: "Dominant", chord: "G13", romanNumeral: "V13", nashvilleNumber: "5-13", beats: 4 },
    { label: "Tonic", chord: "Cmaj9", romanNumeral: "Imaj9", nashvilleNumber: "1maj9", beats: 4 },
    { label: "Tonic color", chord: "C6/9", romanNumeral: "I6/9", nashvilleNumber: "1-6/9", beats: 4 }
  ],
  explanation: "Advanced harmony still needs function. Add color tones only when the third, seventh, and resolution remain clear.",
  accessibilityDescription: "C ii-V-I color chart: D minor nine, G thirteen, C major nine, C six-nine."
};

export const levelFiveLessons: readonly CurriculumLesson[] = [
  {
    id: "lesson.extended-chords-color-tones",
    unitId: "unit.extended-chords-color-tones",
    order: 1,
    title: "Choose color tones that still serve the chord",
    objective: "Build ninth, eleventh, thirteenth, and altered-color sounds from functional seventh chords, then voice them with clear guide tones and playable density.",
    whyItMatters: "Extensions are not decorations pasted on top of harmony. They create color when the chord quality, function, register, and voice leading remain intelligible.",
    estimatedMinutes: 155,
    priorKnowledge: ["Seventh chords", "Guide tones", "Voice leading", "Chord melody", "Functional harmony"],
    contentBlocks: [
      { id: "extensions-function-first", type: "text", heading: "Color starts after function is clear", paragraphs: ["Before adding 9, 11, or 13, identify root, third, seventh, and function. A beautiful extension that hides the third or seventh can make the progression weaker.", "On guitar, upper structures often work best as partial voicings. Omit roots or fifths when another instrument or context supplies them, but do not omit the information that defines the chord quality."] },
      iiVITemplate,
      { id: "extension-shell-tab", type: "tablature", heading: "Compact shell colors", tempo: 66, events: [
        { count: "1", notes: [{ string: 4, fret: 3 }, { string: 3, fret: 5 }, { string: 2, fret: 5 }], duration: "half", rest: false },
        { count: "3", notes: [{ string: 4, fret: 3 }, { string: 3, fret: 4 }, { string: 2, fret: 5 }], duration: "half", rest: false },
        { count: "1", notes: [{ string: 4, fret: 2 }, { string: 3, fret: 4 }, { string: 2, fret: 3 }], duration: "whole", rest: false }
      ], explanation: "These partial voicings prioritize color and guide tones over full grips. Name each active tone before increasing tempo.", accessibilityDescription: "Three compact color voicings for D minor, G dominant, and C major resolution." },
      ...stages("extended-chords", "functional extensions and color tones", ["Observe a seventh chord before extensions are added.", "Hear 9, 11, and 13 as color over stable guide tones.", "Compare dense grips with clear partial voicings."], ["Build one extended chord from a seventh shell.", "Name which tone is omitted and why.", "Resolve one color tone by step."], ["Use function labels and color targets.", "Revise any voicing that hides the third or seventh.", "Check register and density after playing."], ["Voice a ii-V-I with chosen extensions.", "Explain each omission, color, and resolution.", "Perform the progression in time with sustainable shapes."], ["Guide tones remain clear.", "Extensions are named and chosen for a reason.", "Voicings are playable and functional."]),
      { id: "extensions-reflection", type: "reflection", heading: "Defend the color", prompt: "List each extension, which chord tone defines the quality, what you omitted, and how the color moves into the next chord.", fieldLabel: "Extension analysis", placeholder: "G13 keeps B and F; E is the 13 and resolves smoothly into Cmaj9 color." }
    ],
    guidedExercises: [
      { id: "exercise.extension-shell", title: "Shell plus one color", purpose: "Keep advanced voicings functional.", instructions: ["Play the third and seventh.", "Add one extension.", "Remove any doubled note that muddies the sound.", "Name the resulting function."], successCriteria: ["Third and seventh are present.", "The extension is named.", "The voicing fits in time."], reduceDifficultyWhen: ["Use only 9ths."], increaseDifficultyWhen: ["Add altered dominant colors."], relatedSkills: ["extensions", "voice leading", "harmony"] },
      { id: "exercise.extension-resolution", title: "Color-tone resolution", purpose: "Make extensions move with the harmony.", instructions: ["Choose one color tone.", "Resolve it by step or common tone.", "Compare with a static version.", "Keep the smoother option."], successCriteria: ["The color tone is tracked.", "Resolution is audible.", "Function remains clear."], reduceDifficultyWhen: ["Resolve one note."], increaseDifficultyWhen: ["Use a full ii-V-I in two keys."], relatedSkills: ["resolution", "guide tones", "arrangement"] }
    ],
    commonMistakes: [
      { id: "mistake.extension-density", symptom: "The voicing is thick but the chord quality is unclear.", likelyCause: "Extensions were added before guide tones were secured.", adjustment: "Return to third and seventh, then add one color tone." },
      { id: "mistake.extension-grip", symptom: "Large grips break time.", likelyCause: "Full spellings were treated as mandatory.", adjustment: "Use partial voicings and document omitted tones." }
    ],
    knowledgeChecks: [
      { id: "check.extension-guide", prompt: "Which tones usually define seventh-chord quality most clearly?", options: ["Third and seventh", "Only ninth and thirteenth", "Only doubled roots"], correctAnswer: "Third and seventh", explanation: "Guide tones carry quality and function." },
      { id: "check.extension-omit", prompt: "Why might a guitarist omit the root?", options: ["To make a clear playable voicing when context supplies the root", "To remove function", "To avoid naming notes"], correctAnswer: "To make a clear playable voicing when context supplies the root", explanation: "Omissions can improve clarity when you choose them for a reason." },
      { id: "check.extension-color", prompt: "What should an extension do?", options: ["Add named color without hiding function", "Replace listening", "Always require six strings"], correctAnswer: "Add named color without hiding function", explanation: "Color and function must cooperate." }
    ],
    masteryCriteria: [
      { id: "mastery.extension-voice", description: "Voice a functional progression with named extensions.", verification: "performance-checklist", required: true },
      { id: "mastery.extension-omit", description: "Explain omitted tones and guide-tone preservation.", verification: "reflection", required: true },
      { id: "mastery.extension-resolve", description: "Resolve at least one color tone by choice.", verification: "guided-self-check", required: true }
    ],
    reviewRecommendation: "Next session, build each extension from a seventh shell. After one week, revoice the same progression with fewer notes and clearer color.",
    optionalExtension: "Create three versions of the same dominant chord: 9, 13, and altered, then compare their resolutions."
  },
  {
    id: "lesson.chord-scale-relationships",
    unitId: "unit.chord-scale-relationships",
    order: 1,
    title: "Match note collections to harmonic behavior",
    objective: "Choose chord-scale options from chord quality, function, and resolution.",
    whyItMatters: "Chord-scale thinking is useful only when it serves a chord's job. The right collection explains available color, avoid notes, and target tones in context.",
    estimatedMinutes: 150,
    priorKnowledge: ["Modes", "Extended chords", "Guide tones", "Secondary dominants", "Chord-tone improvisation"],
    contentBlocks: [
      { id: "chord-scale-context", type: "text", heading: "The chord's job chooses the collection", paragraphs: ["A major seventh chord functioning as tonic may invite Ionian, Lydian, or a pentatonic subset depending on the desired color. A dominant chord may use Mixolydian, Lydian dominant, altered, or diminished color depending on resolution.", "Start with chord tones and guide tones. Add scale color only after target tones are secure."] },
      { id: "chord-scale-chart", type: "progression-chart", heading: "Collection choices by function", key: "C", meter: "4/4", measures: [
        { label: "Tonic", chord: "Cmaj9", romanNumeral: "Imaj9", nashvilleNumber: "1maj9", beats: 4 },
        { label: "Predominant", chord: "Dm9", romanNumeral: "ii9", nashvilleNumber: "2m9", beats: 4 },
        { label: "Resolving dominant", chord: "G7b9", romanNumeral: "V7b9", nashvilleNumber: "5-7b9", beats: 4 },
        { label: "Arrival", chord: "C6/9", romanNumeral: "I6/9", nashvilleNumber: "1-6/9", beats: 4 }
      ], explanation: "Cmaj9 may use a stable major color; Dm9 points toward predominant minor color; G7b9 needs dominant tension that resolves.", accessibilityDescription: "Chord-scale decision chart in C: C major nine, D minor nine, G seven flat nine, C six-nine." },
      ...stages("chord-scale", "contextual chord-scale selection", ["Observe chord tones before collections.", "Hear stable tonic color versus resolving dominant color.", "Compare scale choice with target-note choice."], ["Name chord quality and function.", "Choose one collection and one avoid or tension note.", "Resolve the strongest tension."], ["Hide the collection label and use target tones first.", "Add two color tones.", "Check whether the line follows the harmony."], ["Choose collections for a four-chord progression.", "Perform a short line that targets chord tones and uses color by choice.", "Explain the resolution logic."], ["Chord quality and function are named.", "Targets land on strong beats.", "Scale color resolves or sustains for a reason."]),
      { id: "chord-scale-reflection", type: "reflection", heading: "Explain the collection choice", prompt: "For each chord, name quality, function, chosen collection or subset, target tones, and one tension or avoid-note decision.", fieldLabel: "Chord-scale map", placeholder: "G7b9 uses altered/diminished dominant color because it resolves to C; B and F remain guide tones." }
    ],
    guidedExercises: [
      { id: "exercise.collection-targets", title: "Targets before collection", purpose: "Keep scales attached to harmony.", instructions: ["Name the chord tones.", "Place third or seventh on beat 1.", "Add two collection tones.", "Resolve or sustain the color by choice."], successCriteria: ["Targets are accurate.", "Collection tones fit the chord's function.", "The line resolves when required."], reduceDifficultyWhen: ["Use chord tones only."], increaseDifficultyWhen: ["Use altered dominant color."], relatedSkills: ["chord scales", "improvisation", "guide tones"] },
      { id: "exercise.collection-contrast", title: "Two colors, same chord", purpose: "Hear color choices as decisions.", instructions: ["Play one dominant chord.", "Write a Mixolydian line.", "Write a tenser resolving line.", "Explain which fits the context."], successCriteria: ["Both lines name their color.", "The tense line resolves.", "The chosen version matches the progression."], reduceDifficultyWhen: ["Compare major pentatonic and Ionian on tonic."], increaseDifficultyWhen: ["Use Lydian dominant or altered color."], relatedSkills: ["listening", "dominant harmony", "analysis"] }
    ],
    commonMistakes: [
      { id: "mistake.scale-grid", symptom: "One scale shape gets used over the chords.", likelyCause: "Collection labels replaced harmonic function.", adjustment: "Name chord quality and target tones first." },
      { id: "mistake.scale-tension", symptom: "Tensions sound unresolved or accidental.", likelyCause: "Resolution was not planned.", adjustment: "Track one tension into a chord tone." }
    ],
    knowledgeChecks: [
      { id: "check.chord-scale-first", prompt: "What should be named before a chord-scale choice?", options: ["Chord quality and function", "Only fret number", "String brand"], correctAnswer: "Chord quality and function", explanation: "Context determines useful collections." },
      { id: "check.chord-scale-dominant", prompt: "Why choose a tenser dominant collection?", options: ["To intensify resolution", "To avoid all targets", "To erase the key"], correctAnswer: "To intensify resolution", explanation: "Dominant color should point somewhere." },
      { id: "check.chord-scale-target", prompt: "What keeps a scale line attached to harmony?", options: ["Chord-tone targets on strong beats", "Only fast notes", "No resolution"], correctAnswer: "Chord-tone targets on strong beats", explanation: "Targets reveal the active chord." }
    ],
    masteryCriteria: [
      { id: "mastery.chord-scale-map", description: "Map chord-scale choices for a progression.", verification: "reflection", required: true },
      { id: "mastery.chord-scale-line", description: "Perform a line that targets chord tones and uses named color.", verification: "performance-checklist", required: true },
      { id: "mastery.chord-scale-resolve", description: "Explain one tension-resolution decision.", verification: "guided-self-check", required: true }
    ],
    reviewRecommendation: "Next session, improvise with chord tones only before adding color. After one week, compare two collection choices on the same dominant chord.",
    optionalExtension: "Write three one-bar dominant lines: plain, Lydian dominant, and altered."
  },
  {
    id: "lesson.modulation-key-relationships",
    unitId: "unit.modulation-key-relationships",
    order: 1,
    title: "Move to a new key and make the listener believe it",
    objective: "Use pivot chords, common tones, secondary dominants, and cadential confirmation to modulate between related keys.",
    whyItMatters: "Modulation expands form. A key change should feel prepared, confirmed, and necessary for the song.",
    estimatedMinutes: 155,
    priorKnowledge: ["Diatonic harmony", "Secondary dominants", "Modal mixture", "Lead sheets", "Cadences"],
    contentBlocks: [
      { id: "modulation-methods", type: "text", heading: "Preparation and confirmation matter", paragraphs: ["A pivot chord belongs to both the old key and the new key. A secondary dominant can push toward the new tonic. A common tone can smooth the surface while function changes underneath.", "The new key becomes convincing when a cadence, phrase emphasis, melody, or bass motion confirms it."] },
      { id: "modulation-chart", type: "lead-sheet", heading: "C to G modulation study", songTitle: "Gate Opens East", key: "C", meter: "4/4", tempo: 76, capo: 0, sections: [
        { name: "C area", repeatCount: 1, measures: [{ chord: "C", cue: "old I", beats: 4 }, { chord: "Am", cue: "old vi", beats: 4 }, { chord: "Dm", cue: "old ii", beats: 4 }, { chord: "G", cue: "old V", beats: 4 }] },
        { name: "Pivot", repeatCount: 1, measures: [{ chord: "Em", cue: "iii in C, vi in G", beats: 4 }, { chord: "A7", cue: "V7 of D", beats: 4 }, { chord: "D7", cue: "V7 in G", beats: 4 }, { chord: "G", cue: "new I", beats: 4 }] }
      ], explanation: "Em acts as a pivot. A7 points to D7, and D7 confirms G as the new tonic.", accessibilityDescription: "Modulation from C to G: C Am Dm G, then Em A7 D7 G." },
      ...stages("modulation", "planned key change", ["Observe old key, pivot, dominant preparation, and new-key confirmation.", "Hear a weak unprepared key change beside a cadenced one.", "Name both Roman-numeral meanings of the pivot."], ["Choose a related target key.", "Find one pivot chord.", "Add a dominant that confirms the new key."], ["Use Roman labels without chord-name prompts.", "Write a melody note that survives the pivot.", "Check whether the new tonic sounds real."], ["Write and perform a modulation phrase.", "Analyze old-key and new-key functions.", "Explain preparation and confirmation."], ["The pivot has two valid functions.", "The new dominant resolves clearly.", "The new tonic is confirmed by phrase behavior."]),
      { id: "modulation-reflection", type: "reflection", heading: "Prove the key changed", prompt: "Name the old key, target key, pivot chord with both functions, confirming dominant, and the moment where the new tonic becomes believable.", fieldLabel: "Modulation analysis", placeholder: "Em is iii in C and vi in G; A7-D7-G turns the phrase toward G and confirms it." }
    ],
    guidedExercises: [
      { id: "exercise.pivot-find", title: "Find the shared chord", purpose: "Make modulation derivable.", instructions: ["Choose two related keys.", "List diatonic triads in both.", "Circle shared chords.", "Pick one pivot and play both contexts."], successCriteria: ["The pivot belongs to both keys.", "Both functions are named.", "The target key is playable."], reduceDifficultyWhen: ["Use C to G."], increaseDifficultyWhen: ["Use a minor target key."], relatedSkills: ["modulation", "harmony", "analysis"] },
      { id: "exercise.confirm-key", title: "Confirm the new tonic", purpose: "Avoid vague key drift.", instructions: ["Play the pivot.", "Add the new dominant.", "Resolve to the target tonic.", "Repeat until the new key sounds stable."], successCriteria: ["Dominant resolves to target tonic.", "The phrase does not snap back by accident.", "The analysis matches the sound."], reduceDifficultyWhen: ["Use V-I."], increaseDifficultyWhen: ["Add a melody common tone."], relatedSkills: ["cadence", "voice leading", "form"] }
    ],
    commonMistakes: [
      { id: "mistake.modulation-label", symptom: "The chart claims a new key but the ear stays in the old key.", likelyCause: "The new tonic was not confirmed.", adjustment: "Add a cadence or phrase emphasis in the target key." },
      { id: "mistake.modulation-pivot", symptom: "The pivot chord does not belong to both keys.", likelyCause: "Shared functions were not checked.", adjustment: "List both keys and verify the chord before using it." }
    ],
    knowledgeChecks: [
      { id: "check.modulation-pivot", prompt: "What is a pivot chord?", options: ["A chord shared by old and new key contexts", "A random chromatic chord", "Only the final tonic"], correctAnswer: "A chord shared by old and new key contexts", explanation: "Pivot chords smooth key changes through shared function." },
      { id: "check.modulation-confirm", prompt: "What helps confirm a new key?", options: ["A cadence to the new tonic", "Avoiding all resolution", "Only repeating the old tonic"], correctAnswer: "A cadence to the new tonic", explanation: "Cadence and phrase emphasis make the new key believable." },
      { id: "check.modulation-secondary", prompt: "How can secondary dominants help modulation?", options: ["They point toward a target in the new key", "They prevent any key change", "They remove function"], correctAnswer: "They point toward a target in the new key", explanation: "Dominant pull can redirect the ear." }
    ],
    masteryCriteria: [
      { id: "mastery.modulation-write", description: "Write and perform a modulation between related keys.", verification: "performance-checklist", required: true },
      { id: "mastery.modulation-analyze", description: "Label old-key and new-key functions.", verification: "reflection", required: true },
      { id: "mastery.modulation-confirm", description: "Confirm the new tonic through cadence or phrase behavior.", verification: "guided-self-check", required: true }
    ],
    reviewRecommendation: "Next session, list shared chords before playing. After one week, modulate to a relative minor or dominant key.",
    optionalExtension: "Write two modulations to the same target: one pivot-based and one common-tone based."
  },
  {
    id: "lesson.advanced-melodic-harmonic-minor",
    unitId: "unit.advanced-melodic-harmonic-minor",
    order: 1,
    title: "Use minor systems as color and function",
    objective: "Apply harmonic and melodic minor colors to minor ii-V-i, altered dominants, and modal color while naming changed degrees and resolutions.",
    whyItMatters: "Advanced minor systems connect classical leading-tone function, jazz dominant color, and modern modal sound. The point is choosing altered degrees for a reason.",
    estimatedMinutes: 150,
    priorKnowledge: ["Minor-key harmony", "Melodic minor", "Chord-scale relationships", "Dominant resolution", "Guide tones"],
    contentBlocks: [
      { id: "advanced-minor-systems", type: "text", heading: "Altered degrees have jobs", paragraphs: ["Harmonic minor raises 7 for leading-tone function. Melodic minor can support smoother minor melody, minor-major color, Lydian dominant, and altered dominant sounds.", "Name each changed degree and where it resolves. Do not treat advanced minor as a mystery fingering."] },
      { id: "minor-two-five-one", type: "progression-chart", heading: "A minor ii-V-i with color", key: "A", meter: "4/4", measures: [
        { label: "Predominant", chord: "Bm7b5", romanNumeral: "iiø7", nashvilleNumber: "2 half-dim", beats: 4 },
        { label: "Dominant", chord: "E7b9", romanNumeral: "V7b9", nashvilleNumber: "5-7b9", beats: 4 },
        { label: "Tonic", chord: "AmMaj7", romanNumeral: "iMaj7", nashvilleNumber: "1mMaj7", beats: 4 },
        { label: "Release", chord: "Am6", romanNumeral: "i6", nashvilleNumber: "1m6", beats: 4 }
      ], explanation: "G sharp supplies leading-tone pull; F or F sharp changes the melodic-minor color. Track altered notes before memorizing labels.", accessibilityDescription: "A minor ii-V-i color chart: B half-diminished, E seven flat nine, A minor major seven, A minor six." },
      ...stages("advanced-minor", "harmonic and melodic minor application", ["Hear natural, harmonic, and melodic minor over one tonic.", "Observe minor ii-V-i color and altered dominant pull.", "Compare minor-major tonic color with ordinary minor seven."], ["Name changed degrees 6 and 7.", "Target guide tones through ii-V-i.", "Resolve altered dominant color to tonic minor."], ["Use chord symbols.", "Add one melodic-minor color to tonic.", "Check whether altered notes have a job."], ["Perform a minor ii-V-i with named color choices.", "Explain harmonic and melodic minor usage.", "Write a short phrase using altered degrees for a reason."], ["Changed degrees are named.", "Dominant tension resolves.", "Minor color matches the chord function."]),
      { id: "advanced-minor-reflection", type: "reflection", heading: "Track the altered degrees", prompt: "Name where raised 6 or 7 appears, whether it comes from harmonic or melodic minor, and how it resolves or colors the chord.", fieldLabel: "Advanced minor analysis", placeholder: "E7b9 uses G sharp to lead to A; AmMaj7 keeps G sharp as tonic color instead of resolving immediately." }
    ],
    guidedExercises: [
      { id: "exercise.minor-iivi", title: "Minor ii-V-i targets", purpose: "Connect minor color to function.", instructions: ["Play Bm7b5-E7b9-Am.", "Name guide tones.", "Add G sharp over E7.", "Resolve to A or keep it as AmMaj7 color."], successCriteria: ["Guide tones match chords.", "Raised 7 is named.", "Resolution or color has a clear job."], reduceDifficultyWhen: ["Use roots and guide tones."], increaseDifficultyWhen: ["Add melodic minor tonic color."], relatedSkills: ["minor harmony", "dominants", "chord scales"] },
      { id: "exercise.minor-color-choice", title: "One altered degree", purpose: "Prevent advanced minor overload.", instructions: ["Choose raised 6 or raised 7.", "Place it on a strong beat.", "Resolve or sustain it by choice.", "Write the source system."], successCriteria: ["One altered degree is isolated.", "The source is named.", "The sound is explained."], reduceDifficultyWhen: ["Compare natural and harmonic minor."], increaseDifficultyWhen: ["Apply to a new tonic."], relatedSkills: ["melodic minor", "harmonic minor", "ear training"] }
    ],
    commonMistakes: [
      { id: "mistake.advanced-minor-label", symptom: "Scale names are correct but no altered degree is heard.", likelyCause: "Labels replaced target-tone listening.", adjustment: "Sing and name raised 6 or 7 before playing a full pattern." },
      { id: "mistake.advanced-minor-resolution", symptom: "Altered dominant tones sound unresolved.", likelyCause: "Resolution target was not chosen.", adjustment: "Resolve the strongest altered tone by step to tonic harmony." }
    ],
    knowledgeChecks: [
      { id: "check.advanced-minor-leading", prompt: "Which raised degree creates leading-tone pull in harmonic minor?", options: ["Raised 7", "Flat 2", "Flat 5"], correctAnswer: "Raised 7", explanation: "Raised 7 sits a half step below tonic." },
      { id: "check.advanced-minor-iivi", prompt: "What is common in a minor ii-V-i?", options: ["Half-diminished ii and altered dominant V", "Only major I-IV-V", "No dominant function"], correctAnswer: "Half-diminished ii and altered dominant V", explanation: "Minor ii-V-i often uses iiø and V7 altered color." },
      { id: "check.advanced-minor-job", prompt: "What should an altered degree have?", options: ["A color or resolution job", "No explanation", "Only speed"], correctAnswer: "A color or resolution job", explanation: "Choose altered degrees for color or resolution." }
    ],
    masteryCriteria: [
      { id: "mastery.advanced-minor-iivi", description: "Perform a minor ii-V-i with named color choices.", verification: "performance-checklist", required: true },
      { id: "mastery.advanced-minor-degrees", description: "Explain raised 6 and 7 usage.", verification: "reflection", required: true },
      { id: "mastery.advanced-minor-resolve", description: "Resolve altered dominant color into tonic minor.", verification: "guided-self-check", required: true }
    ],
    reviewRecommendation: "Next session, compare natural, harmonic, and melodic minor over one tonic. After one week, write a minor ii-V-i in a new key.",
    optionalExtension: "Create two tonic-minor endings: plain minor and minor-major color."
  },
  {
    id: "lesson.advanced-technique-musical-vocabulary",
    unitId: "unit.advanced-technique-musical-vocabulary",
    order: 1,
    title: "Turn technique into vocabulary",
    objective: "Integrate bends, slides, legato, hybrid picking, muting, and position shifts as phrasing choices.",
    whyItMatters: "Technique becomes musical when it shapes articulation, dynamics, timing, and emotion. The fastest version is not automatically the most communicative one.",
    estimatedMinutes: 145,
    priorKnowledge: ["Phrasing", "Tone control", "Rhythm recovery", "Style study", "Improvisation"],
    contentBlocks: [
      { id: "technique-vocabulary", type: "text", heading: "Technique needs a sentence", paragraphs: ["Treat each technique as vocabulary inside a phrase. A bend can create tension, a slide can connect registers, muting can create groove, and legato can change articulation.", "Practice clean mechanics, but judge success by timing, tone, release, and musical purpose."] },
      { id: "technique-phrase-tab", type: "tablature", heading: "Technique as phrase shape", tempo: 72, events: [
        { count: "1", notes: [{ string: 3, fret: 7, technique: "slide" }], duration: "eighth", rest: false },
        { count: "&", notes: [{ string: 3, fret: 9 }], duration: "eighth", rest: false },
        { count: "2", notes: [{ string: 2, fret: 8, technique: "bend" }], duration: "quarter", rest: false },
        { count: "3", notes: [{ string: 2, fret: 8, technique: "vibrato" }], duration: "quarter", rest: false },
        { count: "4", notes: [{ string: 1, fret: 7 }], duration: "quarter", rest: false }
      ], explanation: "The slide creates approach, the bend creates tension, and vibrato sustains the arrival. Replace any technique that does not improve the phrase.", accessibilityDescription: "Technique phrase: slide on string 3 fret 7 to 9, bend on string 2 fret 8, vibrato on string 2 fret 8, then string 1 fret 7." },
      ...stages("advanced-technique", "technique as musical vocabulary", ["Hear a plain phrase and a technique-shaped phrase.", "Observe timing, tone, release, and articulation.", "Compare speed with communicative phrasing."], ["Choose one technique for one phrase job.", "Practice the mechanics slowly.", "Record whether the phrase became clearer."], ["Remove decorative techniques that do not serve the phrase.", "Keep time through position shifts.", "Revise dynamics and release."], ["Perform a short etude using at least three techniques for named musical purposes.", "Explain each technique's job.", "Maintain tone and time at a sustainable tempo."], ["Technique choices have musical jobs.", "Timing remains stable.", "Tone and release are controlled."]),
      { id: "technique-reflection", type: "reflection", heading: "Name the phrase job", prompt: "List each technique, its musical purpose, the timing or tone risk, and how you corrected it.", fieldLabel: "Technique vocabulary audit", placeholder: "The bend delays resolution into beat 3; I lowered tempo until the release landed in time." }
    ],
    guidedExercises: [
      { id: "exercise.technique-one-job", title: "One technique, one reason", purpose: "Stop technique from becoming decoration.", instructions: ["Play a plain phrase.", "Add one technique.", "Name its musical job.", "Remove it if the phrase is not clearer."], successCriteria: ["The technique has a stated purpose.", "The phrase remains in time.", "Tone improves or the technique is removed."], reduceDifficultyWhen: ["Use slides only."], increaseDifficultyWhen: ["Combine two techniques with contrasting articulation."], relatedSkills: ["technique", "phrasing", "tone"] },
      { id: "exercise.technique-etude", title: "Mini etude", purpose: "Integrate techniques under form pressure.", instructions: ["Write an eight-bar etude.", "Assign three techniques to phrase jobs.", "Practice at a recoverable tempo.", "Reflect on the weakest technique."], successCriteria: ["At least three techniques are purposeful.", "The etude has form.", "The weakest technique has a repair plan."], reduceDifficultyWhen: ["Use four bars."], increaseDifficultyWhen: ["Transpose the etude."], relatedSkills: ["etude", "form", "practice planning"] }
    ],
    commonMistakes: [
      { id: "mistake.technique-speed", symptom: "The passage is fast but rhythm and tone collapse.", likelyCause: "Speed became the success measure.", adjustment: "Lower tempo and judge timing, tone, and release." },
      { id: "mistake.technique-decoration", symptom: "Techniques appear everywhere without phrase purpose.", likelyCause: "Vocabulary was not tied to meaning.", adjustment: "Assign one job per technique and remove extras." }
    ],
    knowledgeChecks: [
      { id: "check.technique-purpose", prompt: "What makes technique musical?", options: ["It serves phrasing, tone, timing, or articulation", "It is fast", "It uses all frets"], correctAnswer: "It serves phrasing, tone, timing, or articulation", explanation: "Technique is vocabulary when it communicates." },
      { id: "check.technique-release", prompt: "Why check release after bends or vibrato?", options: ["Release affects time and pitch clarity", "Release never matters", "It replaces rhythm"], correctAnswer: "Release affects time and pitch clarity", explanation: "Bad releases can blur the phrase." },
      { id: "check.technique-revise", prompt: "What should happen to a technique that weakens the phrase?", options: ["Remove or revise it", "Make it louder only", "Ignore the timing"], correctAnswer: "Remove or revise it", explanation: "Musical purpose outranks decoration." }
    ],
    masteryCriteria: [
      { id: "mastery.technique-etude", description: "Perform an etude using at least three techniques purposefully.", verification: "performance-checklist", required: true },
      { id: "mastery.technique-purpose", description: "Explain each technique's phrase job.", verification: "reflection", required: true },
      { id: "mastery.technique-control", description: "Maintain time, tone, and release at a sustainable tempo.", verification: "guided-self-check", required: true }
    ],
    reviewRecommendation: "Next session, play the phrase plain before adding technique. After one week, remove one technique and decide whether the phrase improves.",
    optionalExtension: "Write two versions of the etude: one legato-led and one picked/muted."
  },
  {
    id: "lesson.form-development-large-scale-direction",
    unitId: "unit.form-development-large-scale-direction",
    order: 1,
    title: "Sustain direction beyond the loop",
    objective: "Design a larger musical form using thematic development, contrast, density, register, harmonic pacing, and return.",
    whyItMatters: "Longer music needs memory and direction. Development turns a good loop into a piece with expectation, contrast, and arrival.",
    estimatedMinutes: 160,
    priorKnowledge: ["Motif development", "Arrangement", "Modulation", "Advanced rhythm", "Portfolio planning"],
    contentBlocks: [
      { id: "large-form-principle", type: "text", heading: "Large form needs memory and change", paragraphs: ["Listeners need something to recognize and something to anticipate. Use motif, register, density, harmonic rhythm, texture, and return to shape time.", "Plan form before filling bars. A sparse map can prevent a piece from becoming a chain of unrelated ideas."] },
      { id: "large-form-chart", type: "lead-sheet", heading: "Large-form development map", songTitle: "Long Path Study", key: "D", meter: "4/4", tempo: 82, capo: 0, sections: [
        { name: "A statement", repeatCount: 2, measures: [{ chord: "D", cue: "main motif low", beats: 4 }, { chord: "G", cue: "answer", beats: 4 }, { chord: "Bm", cue: "thin texture", beats: 4 }, { chord: "A", cue: "half cadence", beats: 4 }] },
        { name: "B contrast", repeatCount: 1, measures: [{ chord: "Em", cue: "new register", beats: 4 }, { chord: "G", cue: "sequence motif", beats: 4 }, { chord: "A", cue: "build density", beats: 4 }, { chord: "D", cue: "arrival", beats: 4 }] },
        { name: "A return", repeatCount: 1, measures: [{ chord: "D", cue: "motif high", beats: 4 }, { chord: "G", cue: "fuller answer", beats: 4 }, { chord: "A", cue: "final setup", beats: 4 }, { chord: "D", cue: "closed ending", beats: 4 }] }
      ], explanation: "The same motif returns with changed register and density. Contrast is planned so return feels meaningful.", accessibilityDescription: "Large form in D with A statement, B contrast, and A return sections." },
      ...stages("large-form", "large-scale direction and development", ["Observe motif statement, contrast, and return.", "Hear density and register changes across sections.", "Compare loop repetition with development."], ["Draft a section map.", "Assign motif, register, density, and harmonic pacing to each section.", "Write one transition."], ["Remove excess events and keep only formal cues.", "Revise the weakest transition.", "Check whether the return is recognizable."], ["Create a two- to four-minute form map and performance.", "Explain development, contrast, and return.", "Identify one long-range tension and release."], ["Sections have distinct roles.", "Motif return is recognizable.", "Transitions support direction."]),
      { id: "large-form-reflection", type: "reflection", heading: "Map the long-range direction", prompt: "Describe each section's role, motif treatment, density, register, harmonic pacing, and the moment of return or arrival.", fieldLabel: "Large-form map", placeholder: "A states the motif low; B sequences it higher and increases density; final A returns high with fuller texture." }
    ],
    guidedExercises: [
      { id: "exercise.form-map", title: "Map before filling", purpose: "Create direction before detail.", instructions: ["Choose A-B-A or verse-bridge-return.", "Write section roles.", "Assign density and register.", "Only then add chords or melody."], successCriteria: ["Each section has a role.", "Contrast is planned.", "Return is recognizable."], reduceDifficultyWhen: ["Use three four-bar sections."], increaseDifficultyWhen: ["Add modulation or meter contrast."], relatedSkills: ["form", "composition", "arrangement"] },
      { id: "exercise.transition-repair", title: "Fix one transition", purpose: "Make large form connected.", instructions: ["Find the weakest section boundary.", "Choose common tone, rhythm, fill, or silence.", "Practice only the boundary.", "Replay the full form."], successCriteria: ["The boundary improves.", "The section roles remain clear.", "The full form continues."], reduceDifficultyWhen: ["Use one-bar transition."], increaseDifficultyWhen: ["Change texture and key at the boundary."], relatedSkills: ["transitions", "development", "performance"] }
    ],
    commonMistakes: [
      { id: "mistake.form-loop", symptom: "The piece repeats without growth.", likelyCause: "No section-level change was planned.", adjustment: "Assign density, register, or harmonic pacing changes to each return." },
      { id: "mistake.form-chain", symptom: "Sections feel unrelated.", likelyCause: "Contrast was added without shared material.", adjustment: "Carry one motif, rhythm, or color across sections." }
    ],
    knowledgeChecks: [
      { id: "check.form-return", prompt: "What makes a return meaningful?", options: ["Recognizable material changed by context", "A random new riff", "No contrast"], correctAnswer: "Recognizable material changed by context", explanation: "Return works when memory and change interact." },
      { id: "check.form-map", prompt: "Why map form first?", options: ["To plan direction before details", "To avoid listening", "To remove transitions"], correctAnswer: "To plan direction before details", explanation: "A map clarifies section roles." },
      { id: "check.form-transition", prompt: "What can connect sections?", options: ["Common tone, rhythm, fill, silence, or harmonic preparation", "Only volume", "Nothing"], correctAnswer: "Common tone, rhythm, fill, silence, or harmonic preparation", explanation: "Transitions can use many musical tools." }
    ],
    masteryCriteria: [
      { id: "mastery.form-map", description: "Create a large-form map with section roles.", verification: "reflection", required: true },
      { id: "mastery.form-performance", description: "Perform or document a two- to four-minute developed form.", verification: "performance-checklist", required: true },
      { id: "mastery.form-transition", description: "Revise one transition and explain the improvement.", verification: "guided-self-check", required: true }
    ],
    reviewRecommendation: "Next session, perform the section map without details. After one week, revise the return so it is both familiar and changed.",
    optionalExtension: "Write two alternate B sections and choose the one that makes the final return stronger."
  },
  {
    id: "lesson.reharmonization-substitution",
    unitId: "unit.reharmonization-substitution",
    order: 1,
    title: "Change the harmony without betraying the melody",
    objective: "Use diatonic substitution, secondary dominants, tritone substitution, modal mixture, and pedal tones while preserving melody and phrase direction.",
    whyItMatters: "Reharmonization is not showing off chord knowledge. It is choosing a different route for the same melody while keeping the listener oriented.",
    estimatedMinutes: 160,
    priorKnowledge: ["Diatonic function", "Secondary dominants", "Modal mixture", "Extended chords", "Voice leading"],
    contentBlocks: [
      { id: "reharm-principle", type: "text", heading: "The melody is the contract", paragraphs: ["A reharmonization must account for the melody note, phrase goal, bass motion, and style. If the new chords fight the melody without a reason, the change is not stronger.", "Use substitutions by function: tonic family, predominant replacement, dominant intensification, modal mixture, tritone substitute, or pedal point."] },
      { id: "reharm-chart", type: "progression-chart", heading: "Original and reharmonized route", key: "C", meter: "4/4", measures: [
        { label: "Original 1", chord: "C", romanNumeral: "I", nashvilleNumber: "1", beats: 4 },
        { label: "Substitute", chord: "Am7", romanNumeral: "vi7", nashvilleNumber: "6m7", beats: 4 },
        { label: "Predominant", chord: "Dm7", romanNumeral: "ii7", nashvilleNumber: "2m7", beats: 4 },
        { label: "Dominant sub", chord: "Db7", romanNumeral: "subV7/I", nashvilleNumber: "b2-7 to 1", beats: 4 }
      ], explanation: "Am7 can substitute tonic color, and Db7 can substitute for G7 through tritone motion into C. The melody must still fit or resolve.", accessibilityDescription: "C reharmonization chart: C, A minor seven, D minor seven, D flat seven as substitute dominant to C." },
      ...stages("reharmonization", "melody-preserving reharmonization", ["Observe the original melody and harmony.", "Hear one functional substitute and one dominant substitute.", "Compare a supportive reharm with one that fights the melody."], ["Circle melody notes.", "Choose one substitute by function.", "Check each strong melody note against the new chord."], ["Use function labels without a chord menu.", "Revise bass motion for smoother direction.", "Remove substitutions that weaken the phrase."], ["Reharmonize an eight-bar melody with at least three techniques.", "Explain each substitution and melody fit.", "Perform original and reharmonized versions."], ["Melody remains clear.", "Substitutions have named function.", "Bass and phrase direction improve or change for a clear reason."]),
      { id: "reharm-reflection", type: "reflection", heading: "Explain each changed chord", prompt: "For each replacement, name the original function, substitute function, melody note, bass motion, and reason the new route is stronger or different.", fieldLabel: "Reharmonization map", placeholder: "Db7 replaces G7 as subV; melody E acts as sharp 9 color and resolves to C in the next bar." }
    ],
    guidedExercises: [
      { id: "exercise.reharm-one", title: "One substitute at a time", purpose: "Keep reharmonization audible and testable.", instructions: ["Play the original phrase.", "Change one chord by function.", "Check the melody note.", "Compare before and after."], successCriteria: ["Only one chord changes.", "Melody is accounted for.", "The effect is described."], reduceDifficultyWhen: ["Use tonic-family substitution only."], increaseDifficultyWhen: ["Use tritone substitution."], relatedSkills: ["reharmonization", "melody", "function"] },
      { id: "exercise.reharm-eight", title: "Eight-bar alternate route", purpose: "Create a complete reharm plan.", instructions: ["Choose an eight-bar melody.", "Mark strong melody notes.", "Apply three substitution types.", "Perform original and reharmonized routes."], successCriteria: ["Three substitutions are labeled.", "Strong melody notes fit or resolve.", "The new route has coherent bass motion."], reduceDifficultyWhen: ["Use four bars."], increaseDifficultyWhen: ["Add modal mixture and pedal point."], relatedSkills: ["arrangement", "harmony", "performance"] }
    ],
    commonMistakes: [
      { id: "mistake.reharm-melody", symptom: "The new chord clashes with the melody by accident.", likelyCause: "Melody notes were not checked.", adjustment: "Circle strong melody notes before choosing substitutes." },
      { id: "mistake.reharm-too-many", symptom: "Too many chords change and the phrase loses identity.", likelyCause: "Novelty replaced direction.", adjustment: "Change one structural point first and compare." }
    ],
    knowledgeChecks: [
      { id: "check.reharm-contract", prompt: "What must reharmonization account for first?", options: ["The melody", "Only chord complexity", "Only speed"], correctAnswer: "The melody", explanation: "The melody is the fixed reference." },
      { id: "check.reharm-tritone", prompt: "What does a tritone substitute usually replace?", options: ["A dominant chord", "Any random tonic", "A rest"], correctAnswer: "A dominant chord", explanation: "Tritone substitutes share dominant guide-tone pull." },
      { id: "check.reharm-function", prompt: "Why label substitute function?", options: ["To explain what musical job changed or stayed", "To avoid listening", "To make all chords identical"], correctAnswer: "To explain what musical job changed or stayed", explanation: "Function makes choices accountable." }
    ],
    masteryCriteria: [
      { id: "mastery.reharm-map", description: "Create a reharmonization map for an eight-bar phrase.", verification: "reflection", required: true },
      { id: "mastery.reharm-perform", description: "Perform original and reharmonized versions.", verification: "performance-checklist", required: true },
      { id: "mastery.reharm-melody", description: "Account for strong melody notes over changed chords.", verification: "guided-self-check", required: true }
    ],
    reviewRecommendation: "Next session, reharmonize one chord only. After one week, create an alternate bass route for the same melody.",
    optionalExtension: "Write three reharmonizations of one cadence: diatonic, mixture, and tritone-substitute."
  },
  {
    id: "lesson.level-five-advanced-musicianship-jury",
    unitId: "unit.level-five-advanced-musicianship-jury",
    order: 1,
    title: "Present an advanced musicianship jury",
    objective: "Integrate advanced harmony, modulation, minor systems, technique, form, and reharmonization into a jury portfolio with analysis, performance, and a next-study plan.",
    whyItMatters: "An advanced jury asks whether the player can choose, explain, perform, revise, and plan. It values musicianship over isolated vocabulary.",
    estimatedMinutes: 280,
    priorKnowledge: ["All Level 5 units", "Level 4 portfolio", "Advanced harmony", "Large-form development", "Reflective practice"],
    contentBlocks: [
      { id: "jury-scope", type: "text", heading: "The jury is a portfolio defense", paragraphs: ["Prepare one complete performance or arrangement plus two supporting studies. The complete work should show advanced harmony, form, and technical vocabulary used for musical reasons.", "Required materials: chart, analysis, technique-purpose notes, reharmonization or modulation map, reflection, and a four-week next-study plan."] },
      { id: "jury-chart", type: "lead-sheet", heading: "Advanced jury template", songTitle: "Fifth Gate Jury Study", key: "C", meter: "4/4", tempo: 78, capo: 0, sections: [
        { name: "Statement", repeatCount: 1, measures: [{ chord: "Cmaj9", cue: "tonic color", beats: 4 }, { chord: "A7b9", cue: "V7 of ii", beats: 4 }, { chord: "Dm9", cue: "target", beats: 4 }, { chord: "G13", cue: "dominant color", beats: 4 }] },
        { name: "Development", repeatCount: 1, measures: [{ chord: "Em7", cue: "pivot color", beats: 4 }, { chord: "A7", cue: "modulation setup", beats: 4 }, { chord: "Dmaj9", cue: "new key arrival", beats: 4 }, { chord: "Db7", cue: "subV return", beats: 4 }] },
        { name: "Return", repeatCount: 1, measures: [{ chord: "Cmaj9", cue: "home restored", beats: 4 }, { chord: "Fm6", cue: "borrowed iv color", beats: 4 }, { chord: "C/G", cue: "cadential bass", beats: 4 }, { chord: "G7b9-C", cue: "final cadence", beats: 4 }] }
      ], explanation: "This template combines extensions, secondary dominants, modulation, subV return, modal mixture, and final cadence. Use it or an original equivalent.", accessibilityDescription: "Advanced jury template with C major color, secondary dominant to D minor, modulation toward D, substitute dominant return, borrowed F minor, and final G seven flat nine to C cadence." },
      { id: "jury-evidence", type: "instrument-setup", heading: "Jury materials checklist", items: [
        { label: "Performance", instruction: "Present a complete work with recovery and form awareness.", selfCheck: "The take continues after small errors." },
        { label: "Analysis", instruction: "Label advanced harmony, modulation, substitutions, and form.", selfCheck: "Each advanced choice has a musical reason." },
        { label: "Technique", instruction: "Audit technique as phrasing vocabulary.", selfCheck: "At least three techniques have named phrase jobs." },
        { label: "Next plan", instruction: "Write a four-week plan from the weakest area.", selfCheck: "The plan has tasks, tempos, review days, and criteria." }
      ], safetyNote: "Reduce scope before increasing intensity. Advanced work still requires sustainable hands, ears, and attention.", accessibilityDescription: "Advanced jury checklist for performance, analysis, technique, and next-study plan." },
      ...stages("level-five-jury", "advanced musicianship jury", ["Review the complete work and supporting-study requirements.", "Observe how advanced concepts are explained by analysis.", "Identify the weakest area before final polish."], ["Draft chart, analysis, and supporting studies.", "Run partial takes and repair one weak transition.", "Attach technique and reharm maps as supporting notes."], ["Run complete takes with a jury checklist.", "Revise the weakest artifact.", "Reduce prompts to form cues and concept labels."], ["Present the complete jury portfolio.", "Explain advanced choices and supporting notes.", "Write the next four-week plan from the weakest area."], ["The performance is complete and recoverable.", "Analysis matches the music.", "Next study follows the portfolio."]),
      { id: "jury-reflection", type: "reflection", heading: "Defend the next study direction", prompt: "Summarize the performance, supporting studies, advanced choices, weakest area, and the four-week plan that follows from the portfolio.", fieldLabel: "Advanced jury reflection", placeholder: "Weakest area: modulation transitions. Week 1 maps pivots; Week 2 practices boundaries; Week 3 records two keys; Week 4 performs full form." }
    ],
    guidedExercises: [
      { id: "exercise.jury-run", title: "Complete jury run", purpose: "Test integrated advanced musicianship.", instructions: ["Run the complete form.", "Mark errors after the take.", "Choose one highest-impact repair.", "Run the boundary and then the full form again."], successCriteria: ["The form completes.", "One repair is measurable.", "Recovery is documented."], reduceDifficultyWhen: ["Shorten to two sections."], increaseDifficultyWhen: ["Add a second supporting study live."], relatedSkills: ["performance", "analysis", "recovery"] },
      { id: "exercise.jury-defense", title: "Portfolio defense", purpose: "Make advanced choices explainable.", instructions: ["Attach the chart.", "Label advanced choices.", "Audit technique vocabulary.", "Write the next-study plan."], successCriteria: ["Supporting notes match performance.", "Choices have reasons.", "The next plan is specific."], reduceDifficultyWhen: ["Use the template chart."], increaseDifficultyWhen: ["Prepare an alternate reharmonized ending."], relatedSkills: ["portfolio", "reflection", "planning"] }
    ],
    commonMistakes: [
      { id: "mistake.jury-vocabulary", symptom: "Many advanced labels appear but the music lacks direction.", likelyCause: "Vocabulary was stacked without form purpose.", adjustment: "Remove any concept that cannot be defended by phrase, color, or function." },
      { id: "mistake.jury-plan", symptom: "The final plan is generic.", likelyCause: "The weakest area was not identified.", adjustment: "Choose one weak area and write weekly success criteria." }
    ],
    knowledgeChecks: [
      { id: "check.jury-purpose", prompt: "What does the Level 5 jury evaluate?", options: ["Integrated choices, performance, analysis, revision, and planning", "Only speed", "Only vocabulary definitions"], correctAnswer: "Integrated choices, performance, analysis, revision, and planning", explanation: "The jury is a portfolio defense." },
      { id: "check.jury-evidence", prompt: "What should advanced analysis match?", options: ["The performed music", "A separate unrelated theory list", "Only the easiest chord"], correctAnswer: "The performed music", explanation: "Analysis should describe the actual artifact." },
      { id: "check.jury-next", prompt: "Where should the next plan come from?", options: ["The weakest observed area", "Random novelty", "Avoiding review"], correctAnswer: "The weakest observed area", explanation: "Advanced practice should follow the work you just reviewed." }
    ],
    masteryCriteria: [
      { id: "mastery.jury-performance", description: "Present a complete advanced performance or arrangement.", verification: "performance-checklist", required: true },
      { id: "mastery.jury-analysis", description: "Provide matching advanced harmonic, form, and technique analysis.", verification: "reflection", required: true },
      { id: "mastery.jury-plan", description: "Write a four-week next-study plan from the weakest area.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "After the jury, revisit the weak-area plan weekly before starting Level 6 artistic-identity work.",
    optionalExtension: "Prepare a contrasting second ending that changes modulation or reharmonization strategy."
  }
];

export const levelFiveReviewPlans: readonly CurriculumReviewPlan[] = [
  { id: "review.extended-chords-color-tones", unitId: "unit.extended-chords-color-tones", immediateReview: ["Build one seventh shell and add one named extension."], nextSessionReview: ["Revoice a ii-V-I with fewer notes and clearer color."], oneWeekReview: ["Compare 9, 13, and altered dominant color."], longTermReview: ["Use function-first voicing before adding dense extensions."] },
  { id: "review.chord-scale-relationships", unitId: "unit.chord-scale-relationships", immediateReview: ["Name chord quality, function, and target tones before any scale."], nextSessionReview: ["Map one collection choice per chord in a progression."], oneWeekReview: ["Compare two colors on the same dominant chord."], longTermReview: ["Begin chord-scale work from guide tones and resolution behavior."] },
  { id: "review.modulation-key-relationships", unitId: "unit.modulation-key-relationships", immediateReview: ["List one old key, target key, and shared pivot chord."], nextSessionReview: ["Write a pivot and confirming dominant into the target tonic."], oneWeekReview: ["Modulate to a related key from a new starting key."], longTermReview: ["Confirm key changes through cadence, phrase, and melodic behavior."] },
  { id: "review.advanced-melodic-harmonic-minor", unitId: "unit.advanced-melodic-harmonic-minor", immediateReview: ["Name raised 6 and raised 7 over one minor tonic."], nextSessionReview: ["Perform minor ii-V-i with guide tones and one altered color."], oneWeekReview: ["Write a minor ii-V-i in a new key."], longTermReview: ["Choose altered minor-system degrees for color or resolution before shape recall."] },
  { id: "review.advanced-technique-musical-vocabulary", unitId: "unit.advanced-technique-musical-vocabulary", immediateReview: ["Play one phrase plain, then add one technique with a named job."], nextSessionReview: ["Revise one technique for timing, tone, or release."], oneWeekReview: ["Remove one technique and decide whether the phrase improves."], longTermReview: ["Treat technique as phrasing vocabulary before speed work."] },
  { id: "review.form-development-large-scale-direction", unitId: "unit.form-development-large-scale-direction", immediateReview: ["Name section roles and one motif treatment."], nextSessionReview: ["Repair one transition and replay the form map."], oneWeekReview: ["Revise the return so it is familiar and changed."], longTermReview: ["Use form maps before adding dense details to longer pieces."] },
  { id: "review.reharmonization-substitution", unitId: "unit.reharmonization-substitution", immediateReview: ["Reharmonize one chord and check the melody note."], nextSessionReview: ["Map three substitutions across an eight-bar phrase."], oneWeekReview: ["Create a new alternate bass route for the same melody."], longTermReview: ["Treat melody and function as the contract for future reharmonization."] },
  { id: "review.level-five-advanced-musicianship-jury", unitId: "unit.level-five-advanced-musicianship-jury", immediateReview: ["List jury artifacts and weakest area."], nextSessionReview: ["Run the full form and repair one weak transition."], oneWeekReview: ["Check that performance, analysis, technique notes, and next plan agree."], longTermReview: ["Use the jury's weakest area to choose Level 6 artistic-identity work."] }
];
