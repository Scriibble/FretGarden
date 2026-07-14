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

const dmDiagram: CurriculumContentBlock = {
  id: "chord-dm",
  type: "chord-diagram",
  heading: "Add D minor with a compact triangle",
  chordName: "Dm",
  strings: [
    { string: 6, state: "muted" }, { string: 5, state: "muted" },
    { string: 4, state: "open", note: "D" },
    { string: 3, state: "fretted", fret: 2, finger: 2, note: "A" },
    { string: 2, state: "fretted", fret: 3, finger: 3, note: "D" },
    { string: 1, state: "fretted", fret: 1, finger: 1, note: "F" }
  ],
  strumFromString: 4,
  explanation: "Begin on open string 4. Compare the first-string F with the F sharp in D major to hear how one note changes chord quality.",
  accessibilityDescription: "D minor: strings 6 and 5 muted, string 4 open D, string 3 fret 2 finger 2 A, string 2 fret 3 finger 3 D, string 1 fret 1 finger 1 F. Strum from string 4."
};

const fMaj7Diagram: CurriculumContentBlock = {
  id: "chord-fmaj7",
  type: "chord-diagram",
  heading: "Use F major 7 as a hand-ready F color",
  chordName: "Fmaj7",
  strings: [
    { string: 6, state: "muted" }, { string: 5, state: "muted" },
    { string: 4, state: "fretted", fret: 3, finger: 3, note: "F" },
    { string: 3, state: "fretted", fret: 2, finger: 2, note: "A" },
    { string: 2, state: "fretted", fret: 1, finger: 1, note: "C" },
    { string: 1, state: "open", note: "E" }
  ],
  strumFromString: 4,
  explanation: "This voicing avoids a full barre. Keep the first string open and begin on the F at string 4 fret 3.",
  accessibilityDescription: "F major 7: strings 6 and 5 muted, string 4 fret 3 finger 3 F, string 3 fret 2 finger 2 A, string 2 fret 1 finger 1 C, string 1 open E. Strum from string 4."
};

const b7Diagram: CurriculumContentBlock = {
  id: "chord-b7",
  type: "chord-diagram",
  heading: "Prepare B7 as a return signal",
  chordName: "B7",
  strings: [
    { string: 6, state: "muted" },
    { string: 5, state: "fretted", fret: 2, finger: 2, note: "B" },
    { string: 4, state: "fretted", fret: 1, finger: 1, note: "D#" },
    { string: 3, state: "fretted", fret: 2, finger: 3, note: "A" },
    { string: 2, state: "open", note: "B" },
    { string: 1, state: "fretted", fret: 2, finger: 4, note: "F#" }
  ],
  strumFromString: 5,
  explanation: "Build the three lower fingers first, verify open string 2, then add finger 4 only if the hand remains relaxed.",
  accessibilityDescription: "B7: string 6 muted, string 5 fret 2 finger 2 B, string 4 fret 1 finger 1 D sharp, string 3 fret 2 finger 3 A, string 2 open B, string 1 fret 2 finger 4 F sharp. Strum from string 5."
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
  },
  {
    id: "lesson.reading-rhythm-tablature",
    unitId: "unit.reading-rhythm-tablature",
    order: 1,
    title: "Decode a riff before imitation takes over",
    objective: "Read string and fret locations, bar lines, eighth-note counts, rests, ties, and dots to perform an unfamiliar eight-measure beginner tab at a slow steady tempo.",
    whyItMatters: "Tab answers where to play; rhythm answers when and how long. Reading both lets you learn original material independently instead of relying on memory of a demonstration.",
    estimatedMinutes: 90,
    priorKnowledge: ["String numbers and fret direction", "Quarter-note pulse", "Rests and recovery", "Basic pick control"],
    contentBlocks: [
      {
        id: "reading-tab-orientation",
        type: "text",
        heading: "Read tab from the player's view of the strings",
        paragraphs: [
          "The top tab line is string 1, the thinnest and highest string; the bottom line is string 6. A number names a fret, zero means open, and aligned numbers sound together. Read from left to right.",
          "Bar lines divide measures. A repeat sign sends you back to a marked beginning. Tempo tells how quickly the beat moves. Alternate picking means successive notes can use down and up strokes rather than forcing every note downward."
        ]
      },
      {
        id: "reading-rhythm-symbols",
        type: "callout",
        heading: "Repeated, held, tied, dotted, and silent are different instructions",
        body: "A repeated note starts again. A held note continues without a new attack. A tie connects duration into the next event without re-picking. A dot adds half of the note's original value. A rest preserves timed silence. Count every category before playing it.",
        tone: "remember"
      },
      {
        id: "reading-first-etude",
        type: "tablature",
        heading: "Adjacent-string reading etude",
        tempo: 50,
        events: [
          { count: "1", notes: [{ string: 3, fret: 0, technique: "pick" }], duration: "quarter", rest: false },
          { count: "2", notes: [{ string: 3, fret: 2, technique: "pick" }], duration: "quarter", rest: false },
          { count: "3", notes: [{ string: 2, fret: 0, technique: "pick" }], duration: "quarter", rest: false, tieToNext: true },
          { count: "4", notes: [{ string: 2, fret: 0 }], duration: "quarter", rest: false },
          { count: "1 &", notes: [{ string: 2, fret: 1, technique: "pick" }], duration: "eighth", rest: false },
          { count: "2 &", notes: [{ string: 2, fret: 3, technique: "pick" }], duration: "eighth", rest: false },
          { count: "3", notes: [], duration: "quarter", rest: true },
          { count: "4", notes: [{ string: 3, fret: 0, technique: "pick" }], duration: "quarter", rest: false, dotted: true }
        ],
        explanation: "First speak string and fret, then count the durations. The tied open second string is attacked once across beats 3 and 4; the rest on beat 3 of the second measure remains counted.",
        accessibilityDescription: "Two-measure etude: string 3 open on beat 1, string 3 fret 2 on beat 2, string 2 open tied across beats 3 and 4; then eighth notes on string 2 frets 1 and 3 across beats 1 and 2, rest on beat 3, and dotted string 3 open on beat 4."
      },
      {
        id: "reading-eighth-grid",
        type: "rhythm-grid",
        heading: "Count the pick motion through rests",
        meter: "4/4",
        events: [
          { count: "1", action: "down", accent: true }, { count: "&", action: "up", accent: false },
          { count: "2", action: "down", accent: false }, { count: "&", action: "up", accent: false },
          { count: "3", action: "rest", accent: false }, { count: "&", action: "up", accent: false },
          { count: "4", action: "down", accent: false }, { count: "&", action: "hold", accent: false }
        ],
        explanation: "Keep the down-up motion small during the beat-3 rest. The silent motion preserves the place of the next upstroke.",
        accessibilityDescription: "Count 1 and 2 and 3 and 4 and. Pick down-up on beats 1 and 2, rest on beat 3 while preserving the upstroke motion, then down on beat 4 and hold."
      },
      ...learningStages("tab-sight-read", {
        skill: "an unfamiliar tab in steady time",
        model: ["Scan the tab for string range, largest fret, rhythm values, rests, and ties before touching the guitar.", "Speak each string-fret event, then clap its rhythm.", "Observe one slow play-through while tracking the score without playing."],
        guided: ["Set 50 BPM and count one measure in.", "Read one measure at a time with spoken counts.", "Join two measures only after each can continue through its rest or tie."],
        fade: ["Remove the spoken string names but keep counting aloud.", "Read four measures without a demonstration.", "Mark only the location where the pulse was lost, then restart from the previous measure."],
        independent: ["Preview a new eight-measure combination for 30 seconds.", "Sight-read it once at 45-55 BPM without hearing a model.", "Continue to the final bar even after a wrong fret."],
        success: ["String and fret locations are decoded from the tab rather than copied from memory.", "Rests and ties have correct duration.", "The beat continues through eight measures with recoverable errors."]
      }),
      {
        id: "reading-write-riff",
        type: "reflection",
        heading: "Notate an original two-measure answer",
        prompt: "Write a text plan for two measures using two adjacent strings, at least one eighth-note pair, and one rest or tie.",
        fieldLabel: "Original tab plan",
        placeholder: "Measure 1: string 3 open, 2, string 2 open tied. Measure 2: string 2 frets 1-3 as eighths, rest, string 3 open."
      }
    ],
    guidedExercises: [
      { id: "exercise.tab-scan", title: "Thirty-second score scan", purpose: "Build a repeatable reading preparation routine.", instructions: ["Find the highest and lowest strings used.", "Circle mentally or on paper every rest, tie, and eighth-note group.", "Speak the count through all measures.", "Choose a tempo that leaves time to look ahead."], successCriteria: ["The string range is known before playing.", "Every silence and sustain is anticipated.", "The tempo is selected before the count-in."], reduceDifficultyWhen: ["Scan only two measures and quarter notes."], increaseDifficultyWhen: ["Scan eight measures within 30 seconds."], relatedSkills: ["reading", "planning", "rhythm"] },
      { id: "exercise.adjacent-alternate", title: "Adjacent-string alternate picking", purpose: "Coordinate reading with efficient pick direction.", instructions: ["Mute the strings and count 1-and-2-and.", "Alternate down-up across strings 3 and 2.", "Add the written frets while keeping the same motion."], successCriteria: ["Pick motion remains small.", "Down-up alternation survives the string change.", "The fretting hand does not rush ahead of the count."], reduceDifficultyWhen: ["Use one string or quarter notes."], increaseDifficultyWhen: ["Add a rest while the hand preserves the motion."], relatedSkills: ["alternate picking", "coordination", "eighth notes"], startingBpm: 50 }
    ],
    commonMistakes: [
      { id: "mistake.tab-upside-down", symptom: "Notes appear on the opposite physical string.", likelyCause: "The top tab line is being read as string 6.", adjustment: "Say 'top line, string 1' before every score scan and trace one event to the instrument." },
      { id: "mistake.tab-no-rhythm", symptom: "Correct frets are played with guessed timing.", likelyCause: "Tab numbers are being read without the rhythmic layer.", adjustment: "Clap and count the complete rhythm before adding any fret." },
      { id: "mistake.tab-look-back", symptom: "The pulse stops whenever the eyes return to the fretting hand.", likelyCause: "The score is not being read ahead.", adjustment: "Slow down and let the eyes move to the next event while the current note rings." }
    ],
    knowledgeChecks: [
      { id: "check.tab-line", prompt: "Which string does the top line of standard guitar tab represent?", options: ["String 1, the thinnest string", "String 6, the thickest string", "Whichever string was played last"], correctAnswer: "String 1, the thinnest string", explanation: "Guitar tab places string 1 on the top line and string 6 on the bottom." },
      { id: "check.tie", prompt: "What happens at the second note of a tie?", options: ["The sound continues without a new attack", "The note is picked twice as loudly", "The measure restarts"], correctAnswer: "The sound continues without a new attack", explanation: "A tie joins durations of the same pitch without rearticulation." },
      { id: "check.dot", prompt: "What does a dot add to a note's duration?", options: ["Half of its original value", "One complete measure", "No duration; it changes pitch"], correctAnswer: "Half of its original value", explanation: "A dotted half note, for example, lasts two beats plus one additional beat." }
    ],
    masteryCriteria: [
      { id: "mastery.tab-symbols", description: "Explain tab orientation, fret zero, rests, ties, dots, bar lines, and repeat signs.", verification: "guided-self-check", required: true },
      { id: "mastery.tab-read", description: "Sight-read an unfamiliar eight-measure beginner tab at a slow steady tempo without a model.", verification: "performance-checklist", required: true },
      { id: "mastery.tab-rhythm", description: "Count eighth notes and sustain or rest for the written durations.", verification: "performance-checklist", required: true },
      { id: "mastery.tab-write", description: "Plan an original two-measure tab using two strings and a rest or tie.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, sight-read a reordered version before replaying today's etude. After one week, move the rhythm to different adjacent strings.",
    optionalExtension: "Write a second ending that changes only the final two events while preserving the original rhythm."
  },
  {
    id: "lesson.melody-scales-alphabet",
    unitId: "unit.melody-scales-musical-alphabet",
    order: 1,
    title: "Turn an ordered scale into a shaped melody",
    objective: "Name the musical alphabet, explain whole and half steps, play one octave of C major from memory, sing scale degrees 1-5, and perform an original four-measure melody with phrasing.",
    whyItMatters: "A scale is raw pitch organization; melody makes choices about direction, repetition, rests, dynamics, and arrival. Naming notes and hearing the tonic lets the fingers serve a phrase instead of merely running a shape.",
    estimatedMinutes: 95,
    priorKnowledge: ["Tab and eighth-note reading", "Alternate picking", "String and fret direction", "Steady count-in"],
    contentBlocks: [
      { id: "melody-alphabet", type: "text", heading: "The alphabet repeats while distance changes", paragraphs: ["Musical letter names cycle A-B-C-D-E-F-G and return to A. Adjacent frets are half steps; two frets are whole steps. B-C and E-F are the natural half-step pairs.", "C major uses C-D-E-F-G-A-B-C. C is the tonic: the reference pitch that makes the collection feel organized. The final C is an octave above the first: the same letter name at a higher register."] },
      { id: "melody-c-scale", type: "tablature", heading: "One-octave C major in open position", tempo: 55, events: [
        { count: "1", notes: [{ string: 5, fret: 3 }], duration: "quarter", rest: false },
        { count: "2", notes: [{ string: 4, fret: 0 }], duration: "quarter", rest: false },
        { count: "3", notes: [{ string: 4, fret: 2 }], duration: "quarter", rest: false },
        { count: "4", notes: [{ string: 4, fret: 3 }], duration: "quarter", rest: false },
        { count: "1", notes: [{ string: 3, fret: 0 }], duration: "quarter", rest: false },
        { count: "2", notes: [{ string: 3, fret: 2 }], duration: "quarter", rest: false },
        { count: "3", notes: [{ string: 2, fret: 0 }], duration: "quarter", rest: false },
        { count: "4", notes: [{ string: 2, fret: 1 }], duration: "quarter", rest: false }
      ], explanation: "Say C-D-E-F-G-A-B-C ascending, then reverse the path. Sing 1-2-3-4-5 on the first five notes before playing them.", accessibilityDescription: "C major ascending: string 5 fret 3 C; string 4 open D, fret 2 E, fret 3 F; string 3 open G, fret 2 A; string 2 open B, fret 1 C." },
      { id: "melody-original", type: "tablature", heading: "Original four-measure question and answer", tempo: 55, events: [
        { count: "M1-1", notes: [{ string: 5, fret: 3 }], duration: "quarter", rest: false }, { count: "2", notes: [{ string: 4, fret: 2 }], duration: "quarter", rest: false }, { count: "3", notes: [{ string: 3, fret: 0 }], duration: "quarter", rest: false }, { count: "4", notes: [], duration: "quarter", rest: true },
        { count: "M2-1", notes: [{ string: 3, fret: 2 }], duration: "quarter", rest: false }, { count: "2", notes: [{ string: 3, fret: 0 }], duration: "quarter", rest: false }, { count: "3", notes: [{ string: 4, fret: 2 }], duration: "quarter", rest: false }, { count: "4", notes: [], duration: "quarter", rest: true },
        { count: "M3-1", notes: [{ string: 4, fret: 3 }], duration: "quarter", rest: false }, { count: "2", notes: [{ string: 3, fret: 0 }], duration: "quarter", rest: false }, { count: "3", notes: [{ string: 3, fret: 2 }], duration: "quarter", rest: false }, { count: "4", notes: [{ string: 2, fret: 0 }], duration: "quarter", rest: false },
        { count: "M4-1", notes: [{ string: 2, fret: 1 }], duration: "half", rest: false, dotted: true }, { count: "4", notes: [{ string: 5, fret: 3 }], duration: "quarter", rest: false }
      ], explanation: "Measures 1-2 leave space like a question. Measures 3-4 climb to high C, then return to low C. Shape the first note quietly, grow toward measure 3, and release the final note.", accessibilityDescription: "Four measures in C major: C E G rest; A G E rest; F G A B; high C held for three beats then low C on beat 4." },
      ...learningStages("c-melody", {
        skill: "a named C major scale and phrased melody",
        model: ["Trace C major while saying each note and notice the E-F and B-C half steps.", "Listen internally for a breath at each written rest.", "Observe the melody grow toward measure 3 and settle in measure 4."],
        guided: ["Play C major ascending and descending at 55 BPM with named notes.", "Sing scale degrees 1-2-3-4-5, then play them.", "Learn the melody two measures at a time with a planned breath."],
        fade: ["Play the scale from memory, checking the tab only afterward.", "Perform the melody with only measure numbers and dynamic plan visible.", "Change one repeated note but preserve the phrase ending."],
        independent: ["Play the scale ascending and descending from memory.", "Perform the four-measure melody without a model and with audible dynamic shape.", "Create and perform a new four-measure answer using five or more scale notes."],
        success: ["The scale uses the correct note order and returns without stopping.", "The melody includes intentional rests or breaths and a clear arrival.", "A changed melody stays inside the chosen C major collection."]
      }),
      { id: "melody-compose", type: "reflection", heading: "Plan a melody instead of filling every beat", prompt: "Write a four-measure contour using repeat, step, leap, rest, and arrival. Name the final tonic note.", fieldLabel: "Melody contour plan", placeholder: "Repeat C-E-G, answer A-G-E, climb F-G-A-B, arrive on C after a breath." }
    ],
    guidedExercises: [
      { id: "exercise.scale-name-sing", title: "Name, sing, then play", purpose: "Connect letter, scale degree, sound, and location.", instructions: ["Say C through C while tracing the frets.", "Sing 1-2-3-4-5 and back to 1.", "Play ascending and descending with alternate picking."], successCriteria: ["Letters remain in order.", "E-F and B-C are recognized as half steps.", "The scale ends on the intended tonic."], reduceDifficultyWhen: ["Use C-D-E-F-G only."], increaseDifficultyWhen: ["Begin from G and continue through the same collection to C."], relatedSkills: ["note names", "scale degrees", "ear matching"] },
      { id: "exercise.phrase-breath", title: "Make a breath audible", purpose: "Separate melodic phrasing from uninterrupted scale motion.", instructions: ["Play measures 1-2 and allow both rests to remain silent.", "Repeat with a gentle dynamic rise and fall.", "Play measures 3-4 and aim the line toward high C."], successCriteria: ["Rests are timed, not accidental gaps.", "The phrase has a direction and arrival.", "Tone remains clear across string changes."], reduceDifficultyWhen: ["Use only measures 1-2."], increaseDifficultyWhen: ["Change one note while preserving the contour."], relatedSkills: ["phrasing", "dynamics", "melody"] }
    ],
    commonMistakes: [
      { id: "mistake.scale-shape-only", symptom: "The pattern can be played but no notes or tonic can be named.", likelyCause: "Location memory has not been connected to musical identity.", adjustment: "Say each note on the next slow repetition and pause on C." },
      { id: "mistake.scale-race", symptom: "Every note has the same volume and no breath.", likelyCause: "The scale exercise is being mistaken for melody.", adjustment: "Add a written rest and one dynamic destination before replaying." },
      { id: "mistake.scale-half-step", symptom: "An extra fret appears between E-F or B-C.", likelyCause: "Every letter pair is assumed to be a whole step.", adjustment: "Mark E-F and B-C as adjacent-fret pairs and trace them before playing." }
    ],
    knowledgeChecks: [
      { id: "check.alphabet", prompt: "Which natural-note pairs are one half step apart?", options: ["B-C and E-F", "A-B and C-D", "D-E and F-G"], correctAnswer: "B-C and E-F", explanation: "B-C and E-F are adjacent natural notes with no sharp or flat between them." },
      { id: "check.tonic", prompt: "What is the tonic in this C major lesson?", options: ["C, the organizing reference pitch", "The fastest note", "Any open string"], correctAnswer: "C, the organizing reference pitch", explanation: "The tonic is the pitch around which the collection and phrase are heard as organized." },
      { id: "check.melody-scale", prompt: "How does melody differ from merely running a scale?", options: ["Melody uses choices such as rhythm, contour, repetition, rest, and dynamics", "Melody must use every scale note in order", "Melody has no tonic"], correctAnswer: "Melody uses choices such as rhythm, contour, repetition, rest, and dynamics", explanation: "A scale organizes pitch material; melody shapes selected pitches in time." }
    ],
    masteryCriteria: [
      { id: "mastery.melody-theory", description: "Explain the musical alphabet, whole and half steps, tonic, and octave.", verification: "guided-self-check", required: true },
      { id: "mastery.melody-scale", description: "Play one octave of C major ascending and descending from memory with named notes.", verification: "performance-checklist", required: true },
      { id: "mastery.melody-sing", description: "Sing and play scale degrees 1-2-3-4-5.", verification: "performance-checklist", required: true },
      { id: "mastery.melody-perform", description: "Perform the original melody with timed rests, dynamic direction, and a clear tonic arrival.", verification: "performance-checklist", required: true },
      { id: "mastery.melody-create", description: "Plan and perform an original four-measure melodic answer using the C major collection.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, retrieve C major before viewing the tab and sing 1-5. After one week, begin the original melody on a different scale note while still arriving on C.",
    optionalExtension: "Add one hammer-on between adjacent scale notes only after the rhythm and dynamic phrase remain stable."
  },
  {
    id: "lesson.power-chords-rock-rhythm",
    unitId: "unit.power-chords-rock-rhythm",
    order: 1,
    title: "Move root-fifth shapes without losing the eighth-note drive",
    objective: "Explain the root-fifth power-chord shape, move it from strings 6 and 5, control muted and open attacks, and perform an original riff with consistent eighth-note pulse and dynamics.",
    whyItMatters: "Power chords reduce harmony to a movable root and perfect fifth, making root direction, articulation, muting, and rhythmic intent easy to hear. The simplicity exposes timing rather than hiding it.",
    estimatedMinutes: 90,
    priorKnowledge: ["Eighth-note counting", "Tab reading", "Fret-number direction", "Pressure release", "Metronome tempo ladder"],
    contentBlocks: [
      { id: "power-root-fifth", type: "text", heading: "The same distance follows the root", paragraphs: ["A power chord contains a root and a perfect fifth. On strings 6 and 5, fret the fifth two frets higher on the next thinner string: a root at string 6 fret 3 pairs with string 5 fret 5. The same geometry works from string 5 to string 4.", "Because the shape omits the third, it does not state major or minor quality by itself. Its musical identity comes from root motion, rhythm, tone, register, dynamics, and the surrounding music."] },
      { id: "power-riff", type: "tablature", heading: "Original Gate and Path power-chord riff", tempo: 60, events: [
        { count: "1", notes: [{ string: 6, fret: 0 }, { string: 5, fret: 2 }], duration: "eighth", rest: false },
        { count: "&", notes: [{ string: 6, fret: 0, technique: "mute" }, { string: 5, fret: 2, technique: "mute" }], duration: "eighth", rest: false },
        { count: "2", notes: [{ string: 6, fret: 3 }, { string: 5, fret: 5 }], duration: "quarter", rest: false },
        { count: "3", notes: [], duration: "eighth", rest: true },
        { count: "&", notes: [{ string: 5, fret: 0 }, { string: 4, fret: 2 }], duration: "eighth", rest: false },
        { count: "4", notes: [{ string: 5, fret: 3 }, { string: 4, fret: 5 }], duration: "quarter", rest: false },
        { count: "1", notes: [{ string: 6, fret: 3 }, { string: 5, fret: 5 }], duration: "quarter", rest: false },
        { count: "2 &", notes: [{ string: 6, fret: 0, technique: "mute" }, { string: 5, fret: 2, technique: "mute" }], duration: "eighth", rest: false },
        { count: "3", notes: [{ string: 5, fret: 3 }, { string: 4, fret: 5 }], duration: "quarter", rest: false },
        { count: "4", notes: [], duration: "quarter", rest: true }
      ], explanation: "The riff moves E5-G5-A5-C5, then G5-E5-C5. Light palm contact near the bridge shortens marked attacks; lift enough for open contrast. Muting should change duration, not add force.", accessibilityDescription: "Power-chord riff: E5 open-position eighth and muted eighth, G5 quarter, eighth rest, A5 eighth, C5 quarter; then G5 quarter, muted E5 eighth pair, C5 quarter, quarter rest." },
      { id: "power-eighth-grid", type: "rhythm-grid", heading: "Keep the subdivision while articulation changes", meter: "4/4", events: [
        { count: "1", action: "down", accent: true }, { count: "&", action: "mute", accent: false }, { count: "2", action: "down", accent: false }, { count: "&", action: "hold", accent: false },
        { count: "3", action: "rest", accent: false }, { count: "&", action: "down", accent: false }, { count: "4", action: "down", accent: true }, { count: "&", action: "hold", accent: false }
      ], explanation: "Count every eighth-note slot. Muted, held, and rested events occupy time just as clearly as open attacks.", accessibilityDescription: "Count 1 and 2 and 3 and 4 and: accented down on 1, muted and, down on 2 and hold, rest on 3, down on its and, accented down on 4 and hold." },
      { id: "power-safety", type: "callout", heading: "Palm muting is contact, not pressure", body: "Rest the picking-hand edge near the bridge until the note becomes shorter but keeps a pitch. Do not force the wrist into a sharp angle. Release fretting pressure between moves and stop if either wrist develops pain or numbness.", tone: "safety" },
      ...learningStages("power-riff-performance", {
        skill: "a movable power-chord riff with controlled muting",
        model: ["Trace each root before adding its fifth and name whether the root is on string 6 or 5.", "Clap the riff while saying open, mute, hold, and rest.", "Observe how the hand releases pressure before each larger shift."],
        guided: ["Loop E5-G5 at 50 BPM until the shape moves together.", "Loop A5-C5 on strings 5 and 4.", "Join the first measure, then add the second with spoken eighth counts."],
        fade: ["Use only the root names E-G-A-C and the rhythm grid.", "Perform once without palm muting, then add only the marked muted events.", "Raise from 55 to 60 BPM after three clean repetitions."],
        independent: ["Tune, count in, and perform the complete riff twice without a model.", "Repeat once quieter and once stronger without changing tempo.", "Recover on the next root after any missed shift."],
        success: ["Root-fifth pairs move together and unwanted strings remain quiet.", "Muted and open attacks contrast without extra tension.", "Eighth-note pulse and dynamics remain stable through two repetitions."]
      }),
      { id: "power-write", type: "reflection", heading: "Create contrast with two motives", prompt: "Plan a verse riff using one rhythmic motive twice and a chorus answer with wider root movement. Name roots and articulation.", fieldLabel: "Power-chord riff plan", placeholder: "Verse E5-G5 with muted eighths; chorus A5-C5-G5 with open quarter notes and a beat-4 rest." }
    ],
    guidedExercises: [
      { id: "exercise.power-shape", title: "Root then fifth", purpose: "Verify the interval shape instead of moving an unnamed grip.", instructions: ["Name and play a root on string 6.", "Add the next-string note two frets higher.", "Move both notes to a new root and name it.", "Repeat from a root on string 5."], successCriteria: ["Each fifth is on the adjacent thinner string two frets higher.", "Both notes begin together.", "Unused strings stay quiet."], reduceDifficultyWhen: ["Play roots alone, then add the fifth."], increaseDifficultyWhen: ["Move between string sets without losing the root name."], relatedSkills: ["perfect fifth", "movable shape", "root location"] },
      { id: "exercise.mute-contrast", title: "Muted and open contrast", purpose: "Control duration independently from tempo and volume.", instructions: ["Play four open E5 eighth notes.", "Repeat with light palm contact.", "Alternate two muted and two open attacks for four measures."], successCriteria: ["Muted attacks keep a recognizable pitch.", "The hand remains comfortable.", "The eighth-note spacing does not change."], reduceDifficultyWhen: ["Use quarter notes on open-position E5."], increaseDifficultyWhen: ["Add planned accents without increasing tempo."], relatedSkills: ["palm muting", "articulation", "dynamics"], startingBpm: 55 }
    ],
    commonMistakes: [
      { id: "mistake.power-shape", symptom: "The interval changes when the root moves.", likelyCause: "Only one finger has tracked the new fret.", adjustment: "Name the root, air-place both fingers as one shape, then press together." },
      { id: "mistake.power-mute", symptom: "Palm-muted notes lose pitch completely or the wrist hurts.", likelyCause: "The hand is too far from the bridge or pressing too hard.", adjustment: "Move contact toward the bridge, lighten it, and restore a neutral wrist." },
      { id: "mistake.power-rush", symptom: "Open chorus attacks speed up after muted eighths.", likelyCause: "Articulation is changing the underlying subdivision.", adjustment: "Count every eighth slot and practice the rhythm on one chord before adding movement." }
    ],
    knowledgeChecks: [
      { id: "check.power-fifth", prompt: "From a root on string 6, where is the basic power-chord fifth?", options: ["On string 5, two frets higher", "On string 1, the same fret", "On string 5, one fret lower"], correctAnswer: "On string 5, two frets higher", explanation: "The common root-fifth shape places the fifth on the adjacent thinner string two frets higher." },
      { id: "check.power-quality", prompt: "Why is a root-fifth power chord not major or minor by itself?", options: ["It omits the third that distinguishes those qualities", "It contains no root", "It can only be played quietly"], correctAnswer: "It omits the third that distinguishes those qualities", explanation: "Major and minor quality depends on the third; the basic power chord contains root and fifth." },
      { id: "check.palm-mute", prompt: "What should light palm muting change first?", options: ["The note's sustain and articulation", "The underlying tempo", "The fret number"], correctAnswer: "The note's sustain and articulation", explanation: "Muting controls duration and tone while pulse and pitch location remain intentional." }
    ],
    masteryCriteria: [
      { id: "mastery.power-theory", description: "Explain and build the root-fifth shape from roots on strings 6 and 5.", verification: "guided-self-check", required: true },
      { id: "mastery.power-mute", description: "Contrast muted and open attacks without pain or loss of eighth-note pulse.", verification: "performance-checklist", required: true },
      { id: "mastery.power-riff", description: "Perform the original power-chord riff twice at 60 BPM with stable roots, muting, and dynamics.", verification: "performance-checklist", required: true },
      { id: "mastery.power-create", description: "Plan a verse and chorus riff using two rhythmic motives and named roots.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, retrieve the root-fifth shape on both string sets before viewing the tab. After one week, transpose every root two frets higher while preserving rhythm and muting.",
    optionalExtension: "Perform the riff once with downstrokes and once with alternate picking, comparing sound and tension rather than choosing a universal winner."
  },
  {
    id: "lesson.open-chords-two-form",
    unitId: "unit.open-chord-vocabulary-two-song-form",
    order: 1,
    title: "Use chord color to mark a complete song form",
    objective: "Add Dm, Fmaj7, and B7 to the open-chord vocabulary, identify phrase and section boundaries, and perform an original intro-verse-chorus-outro study including 4/4 and 6/8 feels.",
    whyItMatters: "Listeners follow sections through repeated patterns and meaningful changes. New chord colors matter most when they help an intro invite, a verse develop, a chorus arrive, or an ending resolve.",
    estimatedMinutes: 110,
    priorKnowledge: ["Five practical open chords", "Verse and chorus contrast", "Eighth-note counting", "Tab and chord-diagram reading"],
    contentBlocks: [
      { id: "form-language", type: "text", heading: "Phrase, section, and cadence organize memory", paragraphs: ["A phrase is a musical thought. Repeated or contrasting phrases form sections such as intro, verse, chorus, bridge, and outro. Eight- and sixteen-bar groupings are common, not compulsory laws.", "A cadence is a point of arrival or pause. Chord choice, melody, rhythm, and duration can all strengthen it. B7 often creates directed tension toward Em; Fmaj7 offers a hand-ready F color without pretending to be the only F voicing."] },
      dmDiagram,
      fMaj7Diagram,
      b7Diagram,
      { id: "form-six-eight", type: "rhythm-grid", heading: "Feel two large pulses inside 6/8", meter: "6/8", events: [
        { count: "1", action: "down", accent: true }, { count: "2", action: "hold", accent: false }, { count: "3", action: "up", accent: false },
        { count: "4", action: "down", accent: true }, { count: "5", action: "hold", accent: false }, { count: "6", action: "up", accent: false }
      ], explanation: "Count all six eighth notes while feeling larger pulses on 1 and 4. Keep the upstrokes lighter than the accented downstrokes.", accessibilityDescription: "Six-eight pattern: accented down on count 1, hold 2, light up on 3, accented down on 4, hold 5, light up on 6." },
      { id: "form-map", type: "callout", heading: "Original Lantern Form", body: "Intro: Em-B7, two measures each. Verse in 4/4: Em-C-G-D, twice. Chorus in 4/4: C-G-D-Em, twice. Bridge in 6/8: Am-Fmaj7-C-G, one measure each, twice. Outro: Em-B7-Em, with the final Em held for two measures.", tone: "practice" },
      ...learningStages("complete-form", {
        skill: "a complete multi-section accompaniment",
        model: ["Read the form map and mark every section boundary.", "Observe the B7-to-Em arrival and the change from 4/4 to grouped 6/8.", "Listen for the final Em held longer than earlier chords."],
        guided: ["Loop only the last measure of each section and the first measure of the next.", "Perform intro and verse, stop, then chorus and bridge.", "Join all sections with spoken names during the final measure of each section."],
        fade: ["Use a one-line map containing only section names and first chords.", "Perform without spoken cues and recover at the next section boundary.", "Remove the map after one successful complete run."],
        independent: ["Tune and state the form from memory.", "Perform the complete form without a model, including the 6/8 bridge and extended final chord.", "Explain how one chord, rhythm, or duration marks each section."],
        success: ["Section order remains intact after an imperfect chord.", "The 4/4 and 6/8 feels are distinguishable without a tempo surge.", "The ending communicates a deliberate arrival."]
      }),
      { id: "form-write", type: "reflection", heading: "Map a short original song", prompt: "Write an intro, verse, chorus, and outro map. Give each section one contrast in chord order, rhythm, dynamics, or duration.", fieldLabel: "Original song-form map", placeholder: "Intro Em-B7 quiet; verse Em-C-G-D half notes; chorus C-G-D-Em quarter notes; outro Em held eight beats." }
    ],
    guidedExercises: [
      { id: "exercise.boundary-loop", title: "Practice across the boundary", purpose: "Prevent sections from failing at the exact place practice loops usually stop.", instructions: ["Choose one section boundary.", "Begin in the final measure before it.", "Continue through the first two measures after it.", "Repeat three times, then restore the full section."], successCriteria: ["The next section begins on time.", "The first chord and rhythm are prepared before the boundary.", "The transition works inside the full form."], reduceDifficultyWhen: ["Use one strum per measure."], increaseDifficultyWhen: ["Add the intended dynamics and strum feel."], relatedSkills: ["form", "transition", "recovery"], repetitions: 3 },
      { id: "exercise.hear-form", title: "Hear and count section length", purpose: "Connect structural listening to performance planning.", instructions: ["Play or listen to the original form without looking at the map.", "Raise one finger at each new phrase and name each section change.", "Compare the remembered lengths with the map."], successCriteria: ["Section changes are identified by audible evidence.", "Phrase lengths are counted rather than guessed.", "One boundary receives a specific performance cue."], reduceDifficultyWhen: ["Use intro and verse only."], increaseDifficultyWhen: ["Identify the bridge meter without being told when it begins."], relatedSkills: ["ear training", "phrase length", "form"] }
    ],
    commonMistakes: [
      { id: "mistake.form-loops", symptom: "Individual sections work but the complete form breaks at boundaries.", likelyCause: "Practice has ended at section endings instead of crossing them.", adjustment: "Loop the last measure before and first two measures after each boundary." },
      { id: "mistake.form-six-eight", symptom: "The 6/8 bridge sounds like six unrelated beats or speeds up.", likelyCause: "Counts 1 and 4 are not felt as larger pulses.", adjustment: "Speak ONE-2-3 FOUR-5-6 and conduct two broad motions before strumming." },
      { id: "mistake.form-b7", symptom: "B7 creates excessive hand tension and delays Em.", likelyCause: "All four fingers are being forced down at once.", adjustment: "Build fingers 1-3 first, add finger 4 only when relaxed, or omit string 1 during the guided version." }
    ],
    knowledgeChecks: [
      { id: "check.form-phrase", prompt: "What is a phrase?", options: ["A musical thought that can combine into a section", "Any single fret number", "A fixed requirement of exactly sixteen bars"], correctAnswer: "A musical thought that can combine into a section", explanation: "Phrases are perceived musical thoughts; their lengths can vary." },
      { id: "check.six-eight", prompt: "Where are the two larger pulses commonly felt in 6/8?", options: ["Counts 1 and 4", "Counts 2 and 5 only", "Only after the measure ends"], correctAnswer: "Counts 1 and 4", explanation: "Six eighth notes are commonly grouped as two groups of three, beginning on 1 and 4." },
      { id: "check.cadence", prompt: "What can strengthen a section-ending cadence?", options: ["Chord direction, melody, rhythm, or duration", "Only playing louder", "Ignoring the final measure"], correctAnswer: "Chord direction, melody, rhythm, or duration", explanation: "Arrival is a combined musical effect, not one universal chord rule." }
    ],
    masteryCriteria: [
      { id: "mastery.form-chords", description: "Form Dm, Fmaj7, and B7 with correct strum ranges and a relaxed modification when needed.", verification: "performance-checklist", required: true },
      { id: "mastery.form-hear", description: "Identify section changes and count phrase lengths in the original form.", verification: "guided-self-check", required: true },
      { id: "mastery.form-perform", description: "Perform the complete original multi-section study and recover at section boundaries.", verification: "performance-checklist", required: true },
      { id: "mastery.form-meter", description: "Distinguish the 4/4 sections from the 6/8 bridge through counting and accent.", verification: "performance-checklist", required: true },
      { id: "mastery.form-create", description: "Write an original intro-verse-chorus-outro map with planned contrast.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, state the form and retrieve its boundary transitions before a full run. After one week, replace one section's rhythm while preserving its role and length.",
    optionalExtension: "Add a four-measure bridge that borrows the 6/8 feel, then explain why it belongs between the final verse and chorus."
  },
  {
    id: "lesson.level-one-integration-project",
    unitId: "unit.level-one-integration-project",
    order: 1,
    title: "Plan, perform, and assess a complete Level 1 piece",
    objective: "Tune independently, prepare three contrasting short pieces, and complete a 60–120 second original performance that integrates chord accompaniment, a riff or melody, two rhythmic feels, recovery, and reflection.",
    whyItMatters: "Integration reveals whether separate skills can cooperate inside music. A complete performance asks tone, time, reading, memory, listening, form, creativity, and recovery to serve one intentional result.",
    estimatedMinutes: 180,
    priorKnowledge: ["Independent setup and tuning", "Open and power chords", "Tab and rhythm reading", "C major melody", "Section form and recovery"],
    contentBlocks: [
      {
        id: "project-evidence",
        type: "text",
        heading: "A project shows relationships between skills",
        paragraphs: [
          "Prepare three contrasting pieces: one chord accompaniment, one riff-based study, and one melody. These may be the original studies from earlier units or other lawful repertoire selected for your interests. Each piece should have a written starting tempo, a hardest transition, and a recovery cue.",
          "The original project lasts 60–120 seconds and uses an intro, at least two contrasting sections, and an ending. Include open chords, either a power-chord riff or a scale-based melody, two rhythmic feels, at least one rest, and a planned dynamic change."
        ]
      },
      {
        id: "project-scope",
        type: "callout",
        heading: "Completeness matters more than density",
        body: "A clear two-chord verse, short melody, and deliberate ending can demonstrate more musicianship than an overloaded piece that cannot keep time. Remove material until every section has a musical job and can recover after an error.",
        tone: "practice"
      },
      {
        id: "project-form-grid",
        type: "rhythm-grid",
        heading: "Model form: Seed, Path, and Return",
        meter: "4/4",
        events: [
          { count: "Intro 1", action: "down", accent: true }, { count: "2", action: "hold", accent: false }, { count: "3", action: "rest", accent: false }, { count: "4", action: "hold", accent: false },
          { count: "Verse 1", action: "down", accent: true }, { count: "2", action: "down", accent: false }, { count: "3", action: "down", accent: false }, { count: "4", action: "down", accent: false },
          { count: "Chorus 1", action: "down", accent: true }, { count: "&", action: "up", accent: false }, { count: "2", action: "down", accent: false }, { count: "&", action: "up", accent: false },
          { count: "Outro 1", action: "down", accent: true }, { count: "2", action: "hold", accent: false }, { count: "3", action: "hold", accent: false }, { count: "4", action: "hold", accent: false }
        ],
        explanation: "Use sparse intro attacks, quarter-note verse motion, eighth-note chorus energy, and a held outro. The grid models contrast; your project may choose different lawful materials.",
        accessibilityDescription: "Four section cues: sparse intro with a rest, quarter-note verse, down-up eighth-note chorus, and an outro chord held for four beats."
      },
      {
        id: "project-melody-cue",
        type: "tablature",
        heading: "Optional original transition melody",
        tempo: 60,
        events: [
          { count: "1", notes: [{ string: 3, fret: 0 }], duration: "quarter", rest: false },
          { count: "2", notes: [{ string: 3, fret: 2 }], duration: "quarter", rest: false },
          { count: "3", notes: [{ string: 2, fret: 0 }], duration: "quarter", rest: false },
          { count: "4", notes: [], duration: "quarter", rest: true },
          { count: "1", notes: [{ string: 2, fret: 1 }], duration: "half", rest: false },
          { count: "3", notes: [{ string: 3, fret: 0 }], duration: "quarter", rest: false },
          { count: "4", notes: [{ string: 4, fret: 2 }], duration: "quarter", rest: false }
        ],
        explanation: "This G-A-B-rest, C-G-E phrase can connect sections. Keep it, adapt it within C major, or write a different transition that has a clear destination.",
        accessibilityDescription: "Two measures: G, A, B, quarter rest; then C held for two beats, G on beat 3, E on beat 4."
      },
      ...learningStages("integration-performance", {
        skill: "a complete original Level 1 performance",
        model: ["Read the sample form and identify how rhythm, register, and duration distinguish its sections.", "Observe a practice plan that isolates one boundary instead of replaying the whole piece.", "Review a complete-take checklist: tune, count in, continue after errors, shape sections, and finish deliberately."],
        guided: ["Write a form map with chord names, riff or melody, rhythmic feel, and approximate duration.", "Rehearse each section separately, then loop the two weakest boundaries.", "Perform a guided take with the form map, metronome or count-in, and recovery cues visible."],
        fade: ["Reduce the map to section names and first events.", "Perform a complete take without stopping and note only one repair priority afterward.", "Remove the map and retrieve the opening, boundaries, and ending from memory."],
        independent: ["Tune independently and state the intended form and starting tempo.", "Perform one complete 60–120 second take without prompts, restarting, or a model.", "After the final sound, explain one successful musical choice and one observable next action."],
        success: ["The performance contains an audible intro, contrasting sections, and deliberate ending.", "Open chords and a riff or melody remain inside a recoverable pulse.", "The learner continues after errors and names evidence rather than giving a global self-rating."]
      }),
      {
        id: "project-aural-check",
        type: "guitar-task",
        heading: "Echo and locate an unfamiliar starting note",
        instructions: ["Ask another person or a simple tone source to provide a two- or three-note rhythm and one starting pitch within your known C major notes.", "Clap or sing the rhythm back before touching the guitar.", "Find the starting pitch by comparing one candidate at a time, then play the complete echo.", "If no partner or tone source is available, write three cards with known note-and-rhythm prompts, shuffle them, and perform one without advance rehearsal."],
        listenFor: "The echoed spacing matches the prompt and the chosen guitar note matches the starting pitch closely enough to continue.",
        successCriteria: ["The rhythm is echoed before searching the guitar.", "Pitch candidates are compared rather than guessed repeatedly.", "The final echo keeps a steady pulse."],
        accessibilityDescription: "An aural echo task with an equivalent shuffled written-prompt path when an external sound source is unavailable."
      },
      {
        id: "project-reflection",
        type: "reflection",
        heading: "Write the next practice plan from evidence",
        prompt: "Name the take length, starting tempo, strongest musical choice, weakest transition, exact symptom, and smallest next exercise.",
        fieldLabel: "Level 1 performance reflection",
        placeholder: "82 seconds at 60 BPM. The chorus dynamic lift worked. D to Em entered late after the melody; loop the final melody measure into Em at 50 BPM."
      }
    ],
    guidedExercises: [
      {
        id: "exercise.project-boundary",
        title: "Repair the weakest boundary",
        purpose: "Turn a complete-take observation into a small practice task.",
        instructions: ["Name the exact final event before the boundary and first event after it.", "Set a tempo 5–10 BPM below the complete take.", "Loop one measure before through two measures after the boundary three times.", "Return immediately to a complete section run."],
        successCriteria: ["The loop includes both sides of the boundary.", "Three repetitions use the same count-in and tempo.", "The repaired movement improves inside the complete section."],
        reduceDifficultyWhen: ["Use one attack per measure and remove optional notes."],
        increaseDifficultyWhen: ["Restore the final dynamics and articulation."],
        relatedSkills: ["practice design", "form", "recovery"],
        repetitions: 3
      },
      {
        id: "exercise.project-three-pieces",
        title: "Prepare three contrasting snapshots",
        purpose: "Show that Level 1 skills transfer across accompaniment, riff, and melody contexts.",
        instructions: ["Choose one 30–60 second chord accompaniment, riff, and melody.", "Write a starting tempo and one quality target for each.", "Perform each once without stopping, then choose only one for immediate repair."],
        successCriteria: ["All three snapshots have different musical roles.", "Each begins with tuning or a count-in and ends deliberately.", "The repair priority is selected from observed evidence."],
        reduceDifficultyWhen: ["Use earlier original lesson studies and shorten each to 20 seconds."],
        increaseDifficultyWhen: ["Perform the three snapshots in one continuous recital order."],
        relatedSkills: ["repertoire", "transfer", "reflection"]
      }
    ],
    commonMistakes: [
      { id: "mistake.project-overload", symptom: "The piece contains every learned skill but no section can be performed reliably.", likelyCause: "Quantity is being treated as integration.", adjustment: "Keep one chord part, one riff or melody, two rhythmic feels, and one clear ending; remove the rest." },
      { id: "mistake.project-restart", symptom: "A complete take never reaches the outro because every error triggers a restart.", likelyCause: "Repair practice and performance practice are being mixed.", adjustment: "Finish one take with recovery first, then isolate only the most important observed boundary." },
      { id: "mistake.project-vague", symptom: "The reflection says only 'good' or 'bad.'", likelyCause: "No musical variable was selected for observation.", adjustment: "Name section, beat, chord or note, sound or timing symptom, and one next action." }
    ],
    knowledgeChecks: [
      { id: "check.project-complete", prompt: "Which project plan best demonstrates integration?", options: ["A 60–120 second form with clear sections, recoverable skills, contrast, and an ending", "The largest possible number of chords with frequent restarts", "One scale repeated as fast as possible"], correctAnswer: "A 60–120 second form with clear sections, recoverable skills, contrast, and an ending", explanation: "Integration means skills cooperate in a complete musical result." },
      { id: "check.project-repair", prompt: "After a late transition in one take, what is the most useful next exercise?", options: ["Loop one measure before through two measures after it at a manageable tempo", "Replay only the easy intro", "Increase every section by 20 BPM"], correctAnswer: "Loop one measure before through two measures after it at a manageable tempo", explanation: "The loop includes preparation, the transition, and its musical continuation." },
      { id: "check.project-theory", prompt: "Which set contains only Level 1 concepts used in the project?", options: ["Root, tonic, whole and half steps, rhythm values, major/minor quality, and form", "Secondary dominants, modal interchange, and counterpoint", "Only fret numbers with no rhythm or note identity"], correctAnswer: "Root, tonic, whole and half steps, rhythm values, major/minor quality, and form", explanation: "These concepts explain the pitch, chord, rhythm, and structural choices made in Level 1." }
    ],
    masteryCriteria: [
      { id: "mastery.project-tune", description: "Tune independently and begin each performance with a deliberate count-in or cue.", verification: "performance-checklist", required: true },
      { id: "mastery.project-three", description: "Prepare contrasting chord, riff, and melody snapshots with starting tempos and quality targets.", verification: "performance-checklist", required: true },
      { id: "mastery.project-original", description: "Perform one complete 60–120 second original piece with sections, contrast, recovery, and an ending.", verification: "performance-checklist", required: true },
      { id: "mastery.project-aural", description: "Echo a short unfamiliar rhythm and locate or verify its starting note using the available equivalent path.", verification: "guided-self-check", required: true },
      { id: "mastery.project-theory", description: "Explain the Level 1 note, rhythm, chord-quality, root, tonic, and form decisions used in the project.", verification: "guided-self-check", required: true },
      { id: "mastery.project-reflect", description: "Record take length, tempo, one successful musical choice, one exact symptom, and one next exercise.", verification: "reflection", required: true }
    ],
    reviewRecommendation: "Next session, retrieve the original form and weakest boundary before a complete take. After one week, perform the piece in a changed context: different starting tempo, section dynamic, or transposed power-chord roots.",
    optionalExtension: "Capture the performance with a device you already control, then listen once without playing and compare the recorded result with the written intention. FretGarden does not upload or evaluate the recording."
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
  },
  {
    id: "review.reading-rhythm-tablature",
    unitId: "unit.reading-rhythm-tablature",
    immediateReview: ["Scan one new two-measure tab and speak string, fret, and rhythm before playing."],
    nextSessionReview: ["Sight-read a reordered etude without hearing a model."],
    oneWeekReview: ["Move the same rhythm to different adjacent strings and preserve every rest and tie."],
    longTermReview: ["Include one unfamiliar short score in a weekly reading session." ]
  },
  {
    id: "review.melody-scales-alphabet",
    unitId: "unit.melody-scales-musical-alphabet",
    immediateReview: ["Name and trace C major, then sing degrees 1 through 5."],
    nextSessionReview: ["Retrieve the scale and original melody before viewing the tab."],
    oneWeekReview: ["Begin the melody on a different scale note while still arriving on C."],
    longTermReview: ["Use note names, tonic, contour, and breath when learning each new melody."]
  },
  {
    id: "review.power-chords-rock-rhythm",
    unitId: "unit.power-chords-rock-rhythm",
    immediateReview: ["Build root-fifth shapes from one root on string 6 and one on string 5."],
    nextSessionReview: ["Retrieve the riff rhythm before adding root movement and palm muting."],
    oneWeekReview: ["Transpose every root two frets while preserving articulation and pulse."],
    longTermReview: ["Compare muted and open dynamics whenever a new power-chord riff is learned."]
  },
  {
    id: "review.open-chords-two-form",
    unitId: "unit.open-chord-vocabulary-two-song-form",
    immediateReview: ["State the complete section order and loop one boundary."],
    nextSessionReview: ["Retrieve Dm, Fmaj7, B7, and all boundary transitions before a full run."],
    oneWeekReview: ["Change one section rhythm while preserving its role, length, and cadence."],
    longTermReview: ["Map phrase lengths and boundary cues for each complete accompaniment piece."]
  },
  {
    id: "review.level-one-integration-project",
    unitId: "unit.level-one-integration-project",
    immediateReview: ["Name the strongest musical choice, weakest boundary, and smallest next exercise from the complete take."],
    nextSessionReview: ["Retrieve the form and repair the weakest boundary before performing a complete take."],
    oneWeekReview: ["Perform the piece with one changed tempo, dynamic plan, or transposed power-chord context."],
    longTermReview: ["Keep the piece in a rotating repertoire and update its practice plan from complete-performance evidence."]
  }
];
