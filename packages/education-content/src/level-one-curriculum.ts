import type {
  CurriculumContentBlock,
  CurriculumLesson,
  CurriculumReviewPlan
} from "./curriculum-schema.js";

interface StageContent {
  skill: string;
  model: string[];
  guided: string[];
  fade: string[];
  independent: string[];
  success: string[];
}

function learningStages(id: string, content: StageContent): CurriculumContentBlock[] {
  return [
    {
      id: `${id}-model`,
      type: "learning-stage",
      stage: "model",
      heading: `Observe ${content.skill}`,
      instructions: content.model,
      supports: ["Read the complete model before playing", "Keep the success criteria visible"],
      successCriteria: content.success,
      accessibilityDescription: `A written model of ${content.skill} with each action described in sequence.`
    },
    {
      id: `${id}-guided`,
      type: "learning-stage",
      stage: "guided",
      heading: `Try ${content.skill} with prompts`,
      instructions: content.guided,
      supports: ["Use the numbered steps", "Pause between repetitions to diagnose one result"],
      successCriteria: content.success,
      accessibilityDescription: `A guided attempt at ${content.skill} with numbered prompts and self-checks.`
    },
    {
      id: `${id}-fade`,
      type: "learning-stage",
      stage: "scaffold-fade",
      heading: `Use fewer prompts for ${content.skill}`,
      instructions: content.fade,
      supports: ["Consult the model only after completing an attempt", "Keep one counting or setup cue"],
      successCriteria: content.success,
      accessibilityDescription: `A reduced-support attempt at ${content.skill} before consulting the model.`
    },
    {
      id: `${id}-independent`,
      type: "learning-stage",
      stage: "independent",
      heading: `Perform ${content.skill} independently`,
      instructions: content.independent,
      supports: [],
      successCriteria: content.success,
      accessibilityDescription: `An independent attempt at ${content.skill} without prompts or demonstration.`
    }
  ];
}

const emDiagram: CurriculumContentBlock = {
  id: "chord-em",
  type: "chord-diagram",
  heading: "Build E minor without squeezing",
  chordName: "Em",
  strings: [
    { string: 6, state: "open", note: "E" },
    { string: 5, state: "open", note: "A" },
    { string: 4, state: "fretted", fret: 2, finger: 2, note: "E" },
    { string: 3, state: "fretted", fret: 2, finger: 3, note: "B" },
    { string: 2, state: "open", note: "B" },
    { string: 1, state: "open", note: "E" }
  ],
  strumFromString: 6,
  explanation: "Place fingers 2 and 3 just behind fret 2 on strings 4 and 3. Let every string ring; use only enough pressure for a clear sound.",
  accessibilityDescription: "Em: string 6 open E, string 5 open A, string 4 fret 2 finger 2 E, string 3 fret 2 finger 3 B, string 2 open B, string 1 open E. Strum all six strings."
};

const asus2Diagram: CurriculumContentBlock = {
  id: "chord-asus2",
  type: "chord-diagram",
  heading: "Move the same fingers to Asus2",
  chordName: "Asus2",
  strings: [
    { string: 6, state: "muted" },
    { string: 5, state: "open", note: "A" },
    { string: 4, state: "fretted", fret: 2, finger: 2, note: "E" },
    { string: 3, state: "fretted", fret: 2, finger: 3, note: "A" },
    { string: 2, state: "open", note: "B" },
    { string: 1, state: "open", note: "E" }
  ],
  strumFromString: 5,
  explanation: "Move the two-finger pair one string toward the floor. Begin the strum on open string 5 and avoid string 6.",
  accessibilityDescription: "Asus2: string 6 muted, string 5 open A, string 4 fret 2 finger 2 E, string 3 fret 2 finger 3 A, string 2 open B, string 1 open E. Strum from string 5."
};

const amDiagram: CurriculumContentBlock = {
  id: "chord-am",
  type: "chord-diagram",
  heading: "Hear the minor quality in A minor",
  chordName: "Am",
  strings: [
    { string: 6, state: "muted" },
    { string: 5, state: "open", note: "A" },
    { string: 4, state: "fretted", fret: 2, finger: 2, note: "E" },
    { string: 3, state: "fretted", fret: 2, finger: 3, note: "A" },
    { string: 2, state: "fretted", fret: 1, finger: 1, note: "C" },
    { string: 1, state: "open", note: "E" }
  ],
  strumFromString: 5,
  explanation: "Start from Asus2, then add finger 1 at fret 1 on string 2. Check each string separately before strumming.",
  accessibilityDescription: "A minor: string 6 muted, string 5 open A, string 4 fret 2 finger 2 E, string 3 fret 2 finger 3 A, string 2 fret 1 finger 1 C, string 1 open E. Strum from string 5."
};

const cDiagram: CurriculumContentBlock = {
  id: "chord-c",
  type: "chord-diagram",
  heading: "Build C major around three target notes",
  chordName: "C",
  strings: [
    { string: 6, state: "muted" },
    { string: 5, state: "fretted", fret: 3, finger: 3, note: "C" },
    { string: 4, state: "fretted", fret: 2, finger: 2, note: "E" },
    { string: 3, state: "open", note: "G" },
    { string: 2, state: "fretted", fret: 1, finger: 1, note: "C" },
    { string: 1, state: "open", note: "E" }
  ],
  strumFromString: 5,
  explanation: "Curve each finger so the open third and first strings remain clear. Begin on the C at string 5 fret 3.",
  accessibilityDescription: "C major: string 6 muted, string 5 fret 3 finger 3 C, string 4 fret 2 finger 2 E, string 3 open G, string 2 fret 1 finger 1 C, string 1 open E. Strum from string 5."
};

const gDiagram: CurriculumContentBlock = {
  id: "chord-g",
  type: "chord-diagram",
  heading: "Use a compact three-finger G major",
  chordName: "G",
  strings: [
    { string: 6, state: "fretted", fret: 3, finger: 2, note: "G" },
    { string: 5, state: "fretted", fret: 2, finger: 1, note: "B" },
    { string: 4, state: "open", note: "D" },
    { string: 3, state: "open", note: "G" },
    { string: 2, state: "open", note: "B" },
    { string: 1, state: "fretted", fret: 3, finger: 3, note: "G" }
  ],
  strumFromString: 6,
  explanation: "Keep fingers 1 and 2 near their frets and let the middle strings ring. Finger 3 supplies the high G.",
  accessibilityDescription: "G major: string 6 fret 3 finger 2 G, string 5 fret 2 finger 1 B, strings 4 D, 3 G, and 2 B open, string 1 fret 3 finger 3 G. Strum all strings."
};

const dDiagram: CurriculumContentBlock = {
  id: "chord-d",
  type: "chord-diagram",
  heading: "Aim the D major strum at four strings",
  chordName: "D",
  strings: [
    { string: 6, state: "muted" },
    { string: 5, state: "muted" },
    { string: 4, state: "open", note: "D" },
    { string: 3, state: "fretted", fret: 2, finger: 1, note: "A" },
    { string: 2, state: "fretted", fret: 3, finger: 3, note: "D" },
    { string: 1, state: "fretted", fret: 2, finger: 2, note: "F#" }
  ],
  strumFromString: 4,
  explanation: "Form a small triangle and begin on open string 4. A smaller strum is part of the chord, not a reduced version of it.",
  accessibilityDescription: "D major: strings 6 and 5 muted, string 4 open D, string 3 fret 2 finger 1 A, string 2 fret 3 finger 3 D, string 1 fret 2 finger 2 F sharp. Strum from string 4."
};

export const levelOneLessons: readonly CurriculumLesson[] = [
  {
    id: "lesson.meet-the-guitar",
    unitId: "unit.meet-the-guitar",
    order: 1,
    title: "Set up, tune, and make five clear notes",
    objective: "Identify the essential parts of the guitar, use a stable low-tension setup, tune with an external tuner, and play a short three-note riff in quarter-note time.",
    whyItMatters: "A clear sound begins before the note: the instrument is supported, the string is tuned, the hand has room to move, and the player can hear the result without fighting the guitar.",
    estimatedMinutes: 55,
    priorKnowledge: ["A sustainable practice boundary", "Quarter-note counting with a metronome"],
    contentBlocks: [
      {
        id: "setup-parts",
        type: "text",
        heading: "Follow the string from sound to pitch",
        paragraphs: [
          "The body supports the strings and shapes or amplifies their vibration. The neck carries the fretboard; frets divide each string into higher pitches as you move toward the body. The headstock holds the tuning machines that change string tension.",
          "Standard tuning from the thickest sixth string to the thinnest first string is E-A-D-G-B-E. String number and pitch name are different labels: string 6 is the low E, while string 1 is the high E."
        ]
      },
      {
        id: "setup-position",
        type: "instrument-setup",
        heading: "Create a position you can leave and rebuild",
        items: [
          { label: "Support", instruction: "Sit or stand so the strap or torso supports the guitar without the fretting hand holding its weight.", selfCheck: "Briefly release both hands; the instrument stays stable." },
          { label: "Shoulders and wrist", instruction: "Let both shoulders settle and keep the fretting wrist within a comfortable, non-sharp bend.", selfCheck: "Breathing remains easy and the thumb can move." },
          { label: "Pick or fingers", instruction: "Hold a pick with only a small tip exposed, or prepare a relaxed thumb/index stroke.", selfCheck: "The hand can cross one string without gripping harder." },
          { label: "Fretting point", instruction: "Place the fingertip just behind the target fret, not on top of the metal fret.", selfCheck: "The note clears with less pressure than in the middle of the fret space." }
        ],
        safetyNote: "Stop for sharp pain, numbness, burning, or persistent strain. Fingertip tenderness should not require forceful gripping.",
        accessibilityDescription: "Four setup checks covering guitar support, relaxed shoulders and wrist, pick or finger preparation, and fingertip placement just behind a fret."
      },
      {
        id: "setup-tuning",
        type: "callout",
        heading: "Use an external tuner as a measuring tool",
        body: "Select chromatic or guitar mode on a clip-on, pedal, or trusted tuner. Pluck one open string, verify the string name, then turn the correct machine in a small amount. If the display moves away from the target, reverse direction. Approach the pitch gradually and never tighten a string whose identity is uncertain.",
        tone: "safety"
      },
      {
        id: "setup-open-rhythm",
        type: "rhythm-grid",
        heading: "Four measures of open-string sound and rest",
        meter: "4/4",
        events: [
          { count: "1", action: "down", accent: true }, { count: "2", action: "rest", accent: false },
          { count: "3", action: "down", accent: false }, { count: "4", action: "rest", accent: false },
          { count: "1", action: "down", accent: true }, { count: "2", action: "down", accent: false },
          { count: "3", action: "rest", accent: false }, { count: "4", action: "down", accent: false }
        ],
        explanation: "Repeat this two-measure idea twice. During each rest, stop the string gently and keep counting.",
        accessibilityDescription: "Two measures in four-four: measure one plays on beats 1 and 3 with rests on 2 and 4; measure two plays on 1, 2, and 4 with a rest on 3. Repeat once."
      },
      {
        id: "setup-riff",
        type: "tablature",
        heading: "Three-note low-string garden riff",
        tempo: 50,
        events: [
          { count: "1", notes: [{ string: 6, fret: 0 }], duration: "quarter", rest: false },
          { count: "2", notes: [{ string: 6, fret: 1 }], duration: "quarter", rest: false },
          { count: "3", notes: [{ string: 6, fret: 3 }], duration: "quarter", rest: false },
          { count: "4", notes: [], duration: "quarter", rest: true },
          { count: "1", notes: [{ string: 6, fret: 3 }], duration: "quarter", rest: false },
          { count: "2", notes: [{ string: 6, fret: 1 }], duration: "quarter", rest: false },
          { count: "3", notes: [{ string: 6, fret: 0 }], duration: "quarter", rest: false },
          { count: "4", notes: [], duration: "quarter", rest: true }
        ],
        explanation: "Use open, fret 1, and fret 3 on string 6. Count through the rests and release excess pressure between notes.",
        accessibilityDescription: "Two measures on string 6: open on beat 1, fret 1 on beat 2, fret 3 on beat 3, rest on beat 4; then fret 3, fret 1, open, rest."
      },
      ...learningStages("clear-riff", {
        skill: "a clear three-note riff in steady time",
        model: ["Read the tab aloud as open, one, three, rest; three, one, open, rest.", "Air-fret each position while counting 1-2-3-4.", "Play once at 50 BPM and compare every note with the clear-sound criteria."],
        guided: ["Tune string 6 with an external tuner.", "Play each pitch separately and adjust fingertip location before adding the pulse.", "Use a one-measure count-in, then play both measures twice."],
        fade: ["Hide the written instructions but keep the tab visible.", "Play the riff once, then diagnose only the least clear note.", "Repeat from the count-in without stopping after an error."],
        independent: ["Tune string 6 and perform the two-measure riff from the tab without a demonstration.", "Repeat it once in steady time and finish with silence on beat 4."],
        success: ["Five consecutive fretted notes sound clear without sharp pain or gripping.", "The two-measure riff keeps quarter-note time through both rests.", "A missed note does not stop the count."]
      }),
      {
        id: "setup-reflection",
        type: "reflection",
        heading: "Record the smallest sound adjustment",
        prompt: "Which change most improved clarity: fret proximity, pressure, finger angle, pick depth, or instrument support?",
        fieldLabel: "Clear-sound observation",
        placeholder: "Moving just behind fret 1 cleared the note with less pressure."
      }
    ],
    guidedExercises: [
      {
        id: "exercise.five-clear-notes",
        title: "Five clear notes with pressure release",
        purpose: "Find the minimum effective fretting pressure instead of learning to squeeze.",
        instructions: ["Tune one string.", "Fret just behind a low fret and pluck once.", "Reduce pressure until the note buzzes, then add only enough pressure to clear it.", "Release pressure without removing the fingertip and repeat five times."],
        successCriteria: ["Five notes begin cleanly.", "The fingertip remains near the fret.", "The hand releases between notes."],
        reduceDifficultyWhen: ["The thumb clamps or the wrist becomes painful."],
        increaseDifficultyWhen: ["Five notes remain clear with visibly lighter pressure."],
        relatedSkills: ["tone", "fretting", "body awareness"],
        repetitions: 5
      },
      {
        id: "exercise.high-low-echo",
        title: "Hear high, low, and rhythmic echo",
        purpose: "Connect the physical string to pitch direction and rhythmic memory.",
        instructions: ["Play string 6, then string 1, and name low then high.", "Create a two- or three-hit open-string rhythm.", "Wait one measure and echo it while counting."],
        successCriteria: ["High and low are identified correctly.", "The echo preserves the number and spacing of attacks."],
        reduceDifficultyWhen: ["Use only two attacks and contrasting strings."],
        increaseDifficultyWhen: ["Add a rest inside a three-attack rhythm."],
        relatedSkills: ["ear training", "rhythm", "string awareness"]
      }
    ],
    commonMistakes: [
      { id: "mistake.setup-support", symptom: "The neck drops when the fretting hand relaxes.", likelyCause: "The fretting hand is supporting the instrument.", adjustment: "Reposition the body or strap until the guitar stays stable without either hand." },
      { id: "mistake.setup-buzz", symptom: "A fretted note buzzes despite heavy pressure.", likelyCause: "The fingertip is too far behind the fret or touching a neighboring string.", adjustment: "Move just behind the fret, curve the finger, then retest with less pressure." },
      { id: "mistake.setup-tuner", symptom: "The tuner moves farther from the target.", likelyCause: "The wrong machine or direction is being used.", adjustment: "Stop, trace the string to its machine, pluck again, and make one smaller turn in the opposite direction." }
    ],
    knowledgeChecks: [
      { id: "check.string-order", prompt: "What is standard tuning from string 6 to string 1?", options: ["E-A-D-G-B-E", "E-B-G-D-A-E", "A-D-G-C-E-A"], correctAnswer: "E-A-D-G-B-E", explanation: "The thickest-to-thinnest string order is E-A-D-G-B-E." },
      { id: "check.clear-fret", prompt: "Where should a fingertip usually contact a fret space for a clear note?", options: ["Just behind the target fret", "Directly on the metal fret", "As far behind the fret as possible"], correctAnswer: "Just behind the target fret", explanation: "Near-fret placement needs less pressure and gives the string a clean contact point." },
      { id: "check.tuner-direction", prompt: "The tuner display moves away from the correct pitch. What is the next action?", options: ["Turn faster in the same direction", "Stop and make a smaller adjustment in the opposite direction", "Fret a note to force the display"], correctAnswer: "Stop and make a smaller adjustment in the opposite direction", explanation: "Small reversible adjustments protect the string and reveal the correct direction." }
    ],
    masteryCriteria: [
      { id: "mastery.setup-parts", description: "Identify the body, neck, fretboard, frets, headstock, tuning machines, and strings 6 and 1.", verification: "guided-self-check", required: true },
      { id: "mastery.setup-tune", description: "Tune all six strings with an external tuner and guidance as needed.", verification: "performance-checklist", required: true },
      { id: "mastery.setup-clear", description: "Produce five consecutive clear fretted notes with a relaxed pressure-release cycle.", verification: "performance-checklist", required: true },
      { id: "mastery.setup-riff", description: "Perform the original two-measure riff in steady quarter-note time through the rests.", verification: "performance-checklist", required: true },
      { id: "mastery.setup-reflection", description: "Record one specific setup or sound adjustment that improved the result.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "At the next session, rebuild the setup without the checklist, tune, and retrieve the riff at 50 BPM. One week later, move the same rhythm to a different string.",
    optionalExtension: "Create a new four-measure open-string rhythm containing at least two rests and perform it on both a low and a high string."
  },
  {
    id: "lesson.pulse-first-chords",
    unitId: "unit.pulse-subdivision-first-chords",
    order: 1,
    title: "Keep the beat while two chords change",
    objective: "Distinguish beat from rhythm and sustain an original Em-Asus2 progression for one minute using whole notes, half notes, quarter notes, and intentional rests.",
    whyItMatters: "A chord change belongs inside musical time. Learning an easy two-finger move while the pulse continues establishes the recovery and preparation habits used in every later accompaniment pattern.",
    estimatedMinutes: 70,
    priorKnowledge: ["Stable guitar setup", "External tuning", "Quarter-note counting", "A relaxed down-strum"],
    contentBlocks: [
      {
        id: "pulse-values",
        type: "text",
        heading: "The beat stays; the rhythm chooses events",
        paragraphs: [
          "In 4/4, four quarter-note beats organize each measure. A whole note lasts four beats, a half note lasts two, and a quarter note lasts one. The beat continues even when a chord rings or a rest creates silence.",
          "A chord is a group of notes heard together. Em and Asus2 share an easy two-finger shape, letting the musical problem stay focused on timing, sound, and movement rather than hand strength."
        ]
      },
      emDiagram,
      asus2Diagram,
      {
        id: "pulse-whole-half-grid",
        type: "rhythm-grid",
        heading: "Whole-note and half-note chord changes",
        meter: "4/4",
        events: [
          { count: "1", action: "down", accent: true }, { count: "2", action: "hold", accent: false }, { count: "3", action: "hold", accent: false }, { count: "4", action: "hold", accent: false },
          { count: "1", action: "down", accent: true }, { count: "2", action: "hold", accent: false }, { count: "3", action: "down", accent: false }, { count: "4", action: "hold", accent: false }
        ],
        explanation: "First use one Em strum for a whole measure and one Asus2 strum for a whole measure. Then change on beats 1 and 3 for half notes.",
        accessibilityDescription: "Measure one: strum on beat 1 and hold through beats 2, 3, and 4. Measure two: strum on beats 1 and 3, holding on beats 2 and 4."
      },
      {
        id: "pulse-rest-grid",
        type: "rhythm-grid",
        heading: "A rest is a timed action",
        meter: "4/4",
        events: [
          { count: "1", action: "down", accent: true }, { count: "2", action: "down", accent: false }, { count: "3", action: "rest", accent: false }, { count: "4", action: "down", accent: false }
        ],
        explanation: "Count beat 3, stop the strings gently, and keep the strumming motion small enough to return on beat 4.",
        accessibilityDescription: "One measure in four-four: down-strum on beats 1 and 2, rest and mute on beat 3, down-strum on beat 4."
      },
      ...learningStages("two-chord-loop", {
        skill: "an Em-Asus2 progression for one minute",
        model: ["Watch the two-finger pair move together one string toward the floor and back.", "Count four beats of Em and four beats of Asus2 while the fretting fingers hover before each move.", "Notice that a late chord may recover on the next beat without restarting."],
        guided: ["Set the metronome to 50 BPM with a one-measure count-in.", "Play four measures of whole-note changes, then four measures of half-note changes.", "Say each chord name before its first strum."],
        fade: ["Keep only the metronome and chord names visible.", "Alternate one measure of whole notes with one measure of the rest pattern.", "Continue after one missed chord and re-enter on the next beat 1."],
        independent: ["Choose whole-note or half-note changes before starting.", "Perform Em and Asus2 for one uninterrupted minute at 50 BPM without a demonstration.", "Finish on Em and let the final chord ring for four beats."],
        success: ["The quarter-note count continues for one minute.", "Chord changes land on the intended beat most of the time.", "The learner recovers after an error without abandoning the pulse."]
      }),
      {
        id: "pulse-composition",
        type: "reflection",
        heading: "Design an eight-measure chord rhythm",
        prompt: "Write which chord begins each measure and where at least one rest occurs. Explain why the rest helps the phrase.",
        fieldLabel: "Eight-measure chord plan",
        placeholder: "Measures 1-2 Em, 3-4 Asus2; repeat with a rest on beat 3 of measures 6 and 8."
      }
    ],
    guidedExercises: [
      {
        id: "exercise.pressure-release-changes",
        title: "Release pressure before the move",
        purpose: "Separate releasing, moving, and pressing so the hand does not drag against the strings.",
        instructions: ["Form Em and play once.", "Release pressure while fingertips still touch the strings.", "Move the pair to Asus2, press, and play once.", "Repeat eight times without tempo, then at 50 BPM."],
        successCriteria: ["Both fingers move as a pair.", "Pressure releases before sideways motion.", "Open strings are not squeezed by neighboring fingers."],
        reduceDifficultyWhen: ["One finger repeatedly arrives much later than the other."],
        increaseDifficultyWhen: ["Eight changes remain clean at one change per two beats."],
        relatedSkills: ["chord change", "pressure release", "timing"],
        startingBpm: 50,
        repetitions: 8
      },
      {
        id: "exercise.clap-values",
        title: "Clap beat values away from the guitar",
        purpose: "Hear duration and silence before coordinating chord shapes.",
        instructions: ["Count 1-2-3-4 steadily.", "Clap whole notes for four measures.", "Clap half notes for four measures.", "Clap quarter notes with a rest on beat 3."],
        successCriteria: ["Counting never stops during holds or rests.", "Each value occupies the correct number of beats."],
        reduceDifficultyWhen: ["Use only whole and half notes."],
        increaseDifficultyWhen: ["Switch values each measure without changing pulse."],
        relatedSkills: ["duration", "rests", "aural rhythm"]
      }
    ],
    commonMistakes: [
      { id: "mistake.pulse-restart", symptom: "Every late chord causes a restart.", likelyCause: "The chord result has replaced the continuing beat.", adjustment: "Keep counting, allow one silent beat if needed, and re-enter on the next beat 1." },
      { id: "mistake.pulse-sixth", symptom: "Asus2 sounds heavy or muddy.", likelyCause: "The strum begins on string 6 instead of string 5.", adjustment: "Rest the pick above string 5 before the count-in and use a smaller strum." },
      { id: "mistake.pulse-hold", symptom: "Whole notes receive four separate strums.", likelyCause: "Beat and attack are being treated as the same thing.", adjustment: "Strum on beat 1, count 2-3-4 while the chord rings, then change." }
    ],
    knowledgeChecks: [
      { id: "check.beat-rhythm", prompt: "What continues during a whole note or rest?", options: ["The underlying beat", "A new chord on every count", "Only the fretting pressure"], correctAnswer: "The underlying beat", explanation: "The beat organizes time even when no new sound begins." },
      { id: "check.half-note", prompt: "In 4/4, where do two half-note chord attacks normally begin?", options: ["Beats 1 and 3", "Beats 1 and 2", "Only beat 4"], correctAnswer: "Beats 1 and 3", explanation: "Each half note lasts two quarter-note beats." },
      { id: "check.recovery", prompt: "A chord misses beat 1. What best protects the music?", options: ["Stop and restart immediately", "Keep counting and re-enter on a clear later beat", "Play several fast strums to catch up"], correctAnswer: "Keep counting and re-enter on a clear later beat", explanation: "Recovery preserves the shared pulse and is a separate skill from perfect execution." }
    ],
    masteryCriteria: [
      { id: "mastery.pulse-values", description: "Explain and clap whole, half, and quarter-note values in 4/4 while counting.", verification: "performance-checklist", required: true },
      { id: "mastery.pulse-chords", description: "Form clear Em and Asus2 shapes and begin each strum on the intended string.", verification: "performance-checklist", required: true },
      { id: "mastery.pulse-minute", description: "Maintain an Em-Asus2 progression at 50 BPM for one minute without stopping.", verification: "performance-checklist", required: true },
      { id: "mastery.pulse-create", description: "Write an eight-measure two-chord rhythm containing an intentional rest.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, retrieve the one-minute loop before viewing the diagrams. After one week, perform the same rhythm at 60 BPM or swap which chord begins the phrase.",
    optionalExtension: "Use the same eight-measure plan with quiet and strong sections while the tempo stays unchanged."
  },
  {
    id: "lesson.open-chords-one",
    unitId: "unit.open-chord-vocabulary-one",
    order: 1,
    title: "Build a chord family and recover inside a song form",
    objective: "Form Em, Am, C, G, and D with intentional strum ranges, connect three chords in steady time, and perform an original verse-chorus study with recovery after mistakes.",
    whyItMatters: "A useful chord vocabulary is not a list of shapes. It is the ability to prepare the next shape, select the right strings, hear major and minor color, and keep a phrase moving when one change is imperfect.",
    estimatedMinutes: 95,
    priorKnowledge: ["Clear fretted notes", "Em and Asus2", "Whole, half, and quarter-note pulse", "Recovery without restarting"],
    contentBlocks: [
      {
        id: "open-root-quality",
        type: "text",
        heading: "Root, quality, and strum range give each chord an identity",
        paragraphs: [
          "The root names the chord's home pitch. Major and minor describe different interval structures and often create contrasting colors, but neither quality has one fixed emotion. Context, tempo, register, dynamics, and articulation all matter.",
          "A chord diagram tells you where each string is open, fretted, or muted. It also tells you where the strum begins. Playing extra low strings changes the bass and may change the chord's function."
        ]
      },
      amDiagram,
      cDiagram,
      gDiagram,
      dDiagram,
      {
        id: "open-progression",
        type: "rhythm-grid",
        heading: "Original Home-Away-Return study",
        meter: "4/4",
        events: [
          { count: "1", action: "down", accent: true }, { count: "2", action: "hold", accent: false }, { count: "3", action: "down", accent: false }, { count: "4", action: "hold", accent: false },
          { count: "1", action: "down", accent: true }, { count: "2", action: "rest", accent: false }, { count: "3", action: "down", accent: false }, { count: "4", action: "hold", accent: false }
        ],
        explanation: "Verse: G-D-Em-C, one measure each, using half notes. Chorus: C-G-D-Em, with a rest on beat 2 of every second measure. Repeat each section twice.",
        accessibilityDescription: "Two rhythm measures: first strums on beats 1 and 3 and holds beats 2 and 4; second strums on beats 1 and 3, rests on beat 2, and holds beat 4. Apply to verse G-D-Em-C and chorus C-G-D-Em."
      },
      ...learningStages("open-song", {
        skill: "a three- or four-chord verse-chorus study",
        model: ["Read each chord from lowest intended string to highest and test strings separately.", "Observe one anchor or guide movement before each change: C to Am keeps fingers 1 and 2 near their locations; G to D prepares the triangle during beat 4.", "Hear the verse and chorus orders while counting one measure per chord."],
        guided: ["Choose three chords first and loop each pair for 30 seconds at 50 BPM.", "Add the fourth chord only after each pair can recover without stopping.", "Play the verse twice with chord names spoken on beat 4 before each change."],
        fade: ["Turn the diagrams face down after forming each starting chord.", "Use only the section chord order and metronome.", "Keep going after a muted string and diagnose it after the section ends."],
        independent: ["Tune, choose the three- or four-chord version, and give yourself one measure of count-in.", "Perform two verses and two choruses without diagrams or spoken prompts.", "End on the first chord and record one transition to revisit."],
        success: ["Each chord begins on its intended bass string.", "The pulse survives an imperfect string or late finger.", "Verse and chorus remain distinguishable by chord order or rhythm."]
      }),
      {
        id: "open-song-reflection",
        type: "reflection",
        heading: "Diagnose one transition, not the whole performance",
        prompt: "Name the exact transition, string, beat, and adjustment for the next practice loop.",
        fieldLabel: "Transition diagnosis",
        placeholder: "G to D: finger 3 arrived after beat 1. I will prepare the D triangle during beat 4 at 45 BPM."
      }
    ],
    guidedExercises: [
      {
        id: "exercise.chord-string-audit",
        title: "Audit one chord string by string",
        purpose: "Connect a chord diagram to a specific sound diagnosis.",
        instructions: ["Form one chord without strumming.", "Play from its lowest intended string to string 1.", "For each muted or buzzing string, inspect only the neighboring fingertip and fret placement.", "Strum once, release pressure, and rebuild."],
        successCriteria: ["The intended bass string is correct.", "At least four intended strings sound clearly.", "One unclear string receives one specific adjustment."],
        reduceDifficultyWhen: ["Remove one optional high string or use Em/Asus2."],
        increaseDifficultyWhen: ["Rebuild the chord from memory three times."],
        relatedSkills: ["chord diagram", "tone diagnosis", "pressure release"],
        repetitions: 3
      },
      {
        id: "exercise.transition-loops",
        title: "Thirty-second transition loops",
        purpose: "Improve the smallest movement before returning it to the complete form.",
        instructions: ["Choose the least reliable chord pair.", "Set 45-55 BPM and change every four beats.", "Continue for 30 seconds, rest, then name the first finger that can prepare earlier.", "Repeat once and return to the verse or chorus."],
        successCriteria: ["The pair continues without restarting.", "The second loop uses one deliberate preparation cue.", "The pair improves inside the complete section."],
        reduceDifficultyWhen: ["Change every eight beats or mute the strum while rehearsing the hand path."],
        increaseDifficultyWhen: ["Change every two beats while preserving clear bass notes."],
        relatedSkills: ["chord transition", "preparation", "form"],
        startingBpm: 50
      }
    ],
    commonMistakes: [
      { id: "mistake.open-all-strings", symptom: "Every chord is strummed across all six strings.", likelyCause: "The diagram is being read only as fingertip locations.", adjustment: "Say the lowest intended string before the count-in and reduce the strum arc." },
      { id: "mistake.open-rebuild", symptom: "The entire hand lifts far from the fretboard at every change.", likelyCause: "Shared or nearby finger paths are not being noticed.", adjustment: "Rehearse the pair silently and keep fingertips close enough to trace the shortest path." },
      { id: "mistake.open-perfect-stop", symptom: "One muted string stops the complete section.", likelyCause: "Tone diagnosis and performance recovery are happening at the same time.", adjustment: "Finish the section, then isolate the exact string in a short correction loop." }
    ],
    knowledgeChecks: [
      { id: "check.chord-root", prompt: "What does a chord's root provide?", options: ["The pitch that names and centers the chord", "The finger that must move first", "A guarantee that every string is played"], correctAnswer: "The pitch that names and centers the chord", explanation: "The root is the reference pitch from which the chord is named and understood." },
      { id: "check.diagram-x", prompt: "What does a muted-string mark mean in a chord diagram?", options: ["Do not sound that string", "Play the string open", "Press the string at fret 10"], correctAnswer: "Do not sound that string", explanation: "A muted mark excludes that string from the intended voicing." },
      { id: "check.major-minor", prompt: "Which statement about major and minor chord quality is most accurate?", options: ["Major is always happy and minor is always sad", "Major and minor have different interval structures whose effect depends on context", "Quality is determined only by strumming direction"], correctAnswer: "Major and minor have different interval structures whose effect depends on context", explanation: "Interval structure changes the sound, while musical meaning also depends on context." }
    ],
    masteryCriteria: [
      { id: "mastery.open-diagrams", description: "Read and form Em, Am, C, G, and D from structured diagrams with correct starting strings.", verification: "performance-checklist", required: true },
      { id: "mastery.open-audit", description: "Diagnose one unclear chord string and make a specific physical adjustment.", verification: "guided-self-check", required: true },
      { id: "mastery.open-song", description: "Perform the original verse-chorus study in steady time and recover after a mistake.", verification: "performance-checklist", required: true },
      { id: "mastery.open-reflection", description: "Record one transition by chord pair, string or finger symptom, beat, and next adjustment.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, retrieve three chords from memory and play the weakest transition first. After one week, change the section order or starting chord while preserving the pulse.",
    optionalExtension: "Create a contrasting chorus by keeping the chord order and changing only the rhythm, dynamics, or starting register."
  }
];

export const levelOneReviewPlans: readonly CurriculumReviewPlan[] = [
  {
    id: "review.meet-the-guitar",
    unitId: "unit.meet-the-guitar",
    immediateReview: ["Rebuild the setup and name strings 6 through 1."],
    nextSessionReview: ["Tune with an external tuner and retrieve the three-note riff before rereading the instructions."],
    oneWeekReview: ["Move the riff rhythm to a different string and compare the setup required."],
    longTermReview: ["Use the setup and tuning self-check before every new physical technique."]
  },
  {
    id: "review.pulse-first-chords",
    unitId: "unit.pulse-subdivision-first-chords",
    immediateReview: ["Clap whole, half, and quarter notes while counting through a rest."],
    nextSessionReview: ["Retrieve the one-minute Em-Asus2 loop before viewing the diagrams."],
    oneWeekReview: ["Perform the same rhythm at 60 BPM or begin with Asus2."],
    longTermReview: ["Return to the loop whenever chord changes begin to replace the underlying beat."]
  },
  {
    id: "review.open-chords-one",
    unitId: "unit.open-chord-vocabulary-one",
    immediateReview: ["Rebuild the weakest chord and audit its strings once."],
    nextSessionReview: ["Retrieve three chord shapes and the weakest transition before opening the lesson."],
    oneWeekReview: ["Change the section order or rhythm while preserving the chord vocabulary."],
    longTermReview: ["Use the original study to test recovery whenever a new strum pattern is added."]
  }
];
