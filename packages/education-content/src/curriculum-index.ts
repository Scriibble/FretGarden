import type { CurriculumIndexEntry } from "./curriculum-schema.js";

type MappedSourceUnit = Omit<
  CurriculumIndexEntry,
  | "id"
  | "order"
  | "level"
  | "sourceUnit"
  | "status"
  | "estimatedMinutes"
  | "requiredPriorUnitIds"
  | "recommendedPriorUnitIds"
  | "outcomes"
  | "tags"
> & {
  sourceUnit: number;
};

const openingUnits: CurriculumIndexEntry[] = [
  {
    id: "unit.practice-garden",
    order: 1,
    slug: "tending-the-practice-garden",
    title: "Tending the Practice Garden",
    level: "absolute-beginner",
    sourceUnit: null,
    status: "implemented",
    summary: "Build a sustainable practice identity and a constructive response to frustration.",
    estimatedMinutes: 25,
    requiredPriorUnitIds: [],
    recommendedPriorUnitIds: [],
    outcomes: [
      "Explain why consistency is more useful than occasional extreme practice.",
      "Choose a repeatable minimum practice commitment.",
      "Write a constructive response plan for one likely frustration."
    ],
    tags: ["practice", "reflection", "metacognition"]
  },
  {
    id: "unit.focused-practice",
    order: 2,
    slug: "focused-practice-pomodoro",
    title: "Focused Practice and the Pomodoro Technique",
    level: "absolute-beginner",
    sourceUnit: null,
    status: "implemented",
    summary: "Turn practice time into a focused cycle with one measurable goal, a break, and reflection.",
    estimatedMinutes: 35,
    requiredPriorUnitIds: ["unit.practice-garden"],
    recommendedPriorUnitIds: [],
    outcomes: [
      "Distinguish focused practice from casual playing.",
      "Select a sustainable work-and-rest interval.",
      "Complete and reflect on one focused practice cycle."
    ],
    tags: ["practice", "timer", "reflection"]
  },
  {
    id: "unit.metronome-foundations",
    order: 3,
    slug: "using-a-metronome",
    title: "Using and Practicing With a Metronome",
    level: "absolute-beginner",
    sourceUnit: null,
    status: "implemented",
    summary: "Use pulse, subdivision, count-ins, and tempo ladders to build steady, recoverable time.",
    estimatedMinutes: 50,
    requiredPriorUnitIds: ["unit.focused-practice"],
    recommendedPriorUnitIds: [],
    outcomes: [
      "Count and perform quarter, eighth, sixteenth, and triplet subdivisions.",
      "Choose a clean starting tempo and use three clean repetitions before increasing it.",
      "Use a metronome to diagnose rushing, dragging, and recovery after mistakes."
    ],
    tags: ["rhythm", "metronome", "timing"]
  }
];

const mappedSourceUnits: MappedSourceUnit[] = [
  { sourceUnit: 1, slug: "meet-the-guitar", title: "Meet the Guitar and Produce a Clear Sound", summary: "Safe setup, relaxed posture, first sounds, and musical pulse." },
  { sourceUnit: 2, slug: "pulse-subdivision-first-chords", title: "Pulse, Subdivision, and First Chords", summary: "Steady beat, simple strumming, and two-note chord shapes." },
  { sourceUnit: 3, slug: "open-chord-vocabulary-one", title: "Open-Chord Vocabulary I", summary: "First common chord family and clean transitions." },
  { sourceUnit: 4, slug: "reading-rhythm-tablature", title: "Reading Rhythm and Tablature", summary: "Independent decoding of beginner guitar music." },
  { sourceUnit: 5, slug: "melody-scales-musical-alphabet", title: "Melody, Scales, and Musical Alphabet", summary: "First scale patterns and melodic phrasing." },
  { sourceUnit: 6, slug: "power-chords-rock-rhythm", title: "Power Chords and Rock Rhythm", summary: "Movable roots, palm muting, and eighth-note drive." },
  { sourceUnit: 7, slug: "open-chord-vocabulary-two-song-form", title: "Open-Chord Vocabulary II and Song Form", summary: "Fluent accompaniment and structural listening." },
  { sourceUnit: 8, slug: "level-one-integration-project", title: "Level 1 Integration Project", summary: "Combine foundational skills into a confident performance." },
  { sourceUnit: 9, slug: "barre-chords-movable-harmony", title: "Barre Chords and Movable Harmony", summary: "Full movable major and minor forms with sustainable hand use." },
  { sourceUnit: 10, slug: "minor-pentatonic-blues-language", title: "Minor Pentatonic and Blues Language", summary: "A first improvisation framework built around phrasing." },
  { sourceUnit: 11, slug: "fretboard-notes-octave-shapes", title: "Fretboard Notes and Octave Shapes", summary: "Systematic note-location fluency across the neck." },
  { sourceUnit: 12, slug: "major-scale-diatonic-melody", title: "Major Scale and Diatonic Melody", summary: "Connect scale structure to melody and key." },
  { sourceUnit: 13, slug: "rhythm-guitar-vocabulary", title: "Rhythm Guitar Vocabulary", summary: "Groove, syncopation, muting, and stylistic feel." },
  { sourceUnit: 14, slug: "triads-open-movable-contexts", title: "Triads in Open and Movable Contexts", summary: "See chords as three-note structures." },
  { sourceUnit: 15, slug: "lead-sheet-literacy-transposition", title: "Lead-Sheet Literacy and Transposition", summary: "Read practical song charts and adapt keys." },
  { sourceUnit: 16, slug: "level-two-band-songwriting-project", title: "Level 2 Band and Songwriting Project", summary: "Integrate accompaniment, lead, and complete-song craft." },
  { sourceUnit: 17, slug: "caged-fretboard-integration", title: "CAGED System and Fretboard Integration", summary: "Connect chord shapes, arpeggios, scales, and notes." },
  { sourceUnit: 18, slug: "diatonic-harmony-major-keys", title: "Diatonic Harmony in Major Keys", summary: "Understand why common progressions work." },
  { sourceUnit: 19, slug: "relative-minor-minor-key-harmony", title: "Relative Minor and Minor-Key Harmony", summary: "Use natural, harmonic, and melodic minor in practical contexts." },
  { sourceUnit: 20, slug: "seventh-chords-arpeggio-soloing", title: "Seventh Chords and Arpeggio Soloing", summary: "Expand harmonic color and target chord tones." },
  { sourceUnit: 21, slug: "melodic-development-motif", title: "Melodic Development and Motif", summary: "Make solos and melodies coherent." },
  { sourceUnit: 22, slug: "chord-tone-improvisation", title: "Chord-Tone Improvisation", summary: "Follow harmony rather than one static box." },
  { sourceUnit: 23, slug: "arrangement-multiple-guitar-parts", title: "Arrangement and Multiple Guitar Parts", summary: "Create complementary guitar layers." },
  { sourceUnit: 24, slug: "level-three-musicianship-project", title: "Level 3 Musicianship Project", summary: "Demonstrate integrated intermediate musicianship." },
  { sourceUnit: 25, slug: "modes-as-sounds", title: "Modes as Sounds, Not Shapes", summary: "Use modal color intentionally." },
  { sourceUnit: 26, slug: "secondary-dominants-tonicization", title: "Secondary Dominants and Tonicization", summary: "Create directed harmonic momentum." },
  { sourceUnit: 27, slug: "borrowed-chords-modal-mixture", title: "Borrowed Chords and Modal Mixture", summary: "Blend parallel major and minor colors." },
  { sourceUnit: 28, slug: "voice-leading-chord-melody", title: "Voice Leading and Chord Melody", summary: "Make every note in a progression move intentionally." },
  { sourceUnit: 29, slug: "advanced-rhythm-meter", title: "Advanced Rhythm and Meter", summary: "Control odd groupings and layered subdivisions." },
  { sourceUnit: 30, slug: "genre-language-stylistic-authenticity", title: "Genre Language and Stylistic Authenticity", summary: "Learn vocabulary without reducing style to cliches." },
  { sourceUnit: 31, slug: "counterpoint-independent-lines", title: "Counterpoint and Independent Lines", summary: "Compose interacting melodies." },
  { sourceUnit: 32, slug: "level-four-creative-portfolio", title: "Level 4 Creative Portfolio", summary: "Show upper-intermediate control of color, rhythm, and arrangement." },
  { sourceUnit: 33, slug: "extended-chords-color-tones", title: "Extended Chords and Color Tones", summary: "Use ninths, elevenths, thirteenths, and alterations musically." },
  { sourceUnit: 34, slug: "chord-scale-relationships", title: "Chord-Scale Relationships", summary: "Select note collections over changing harmony." },
  { sourceUnit: 35, slug: "modulation-key-relationships", title: "Modulation and Key Relationships", summary: "Move convincingly between tonal centers." },
  { sourceUnit: 36, slug: "advanced-melodic-harmonic-minor", title: "Advanced Melodic and Harmonic Minor", summary: "Use minor systems beyond basic dominant function." },
  { sourceUnit: 37, slug: "advanced-technique-musical-vocabulary", title: "Advanced Technique as Musical Vocabulary", summary: "Integrate specialized technique without losing phrasing." },
  { sourceUnit: 38, slug: "form-development-large-scale-direction", title: "Form, Development, and Large-Scale Direction", summary: "Sustain musical interest beyond loops." },
  { sourceUnit: 39, slug: "reharmonization-substitution", title: "Reharmonization and Substitution", summary: "Generate alternatives while preserving melody and direction." },
  { sourceUnit: 40, slug: "level-five-advanced-musicianship-jury", title: "Level 5 Advanced Musicianship Jury", summary: "Demonstrate advanced theoretical and instrumental command." },
  { sourceUnit: 41, slug: "songwriting-identity-constraint", title: "Songwriting Identity and Constraint", summary: "Turn influences into a personal process." },
  { sourceUnit: 42, slug: "melody-prosody-lyrics", title: "Melody, Prosody, and Lyrics", summary: "Integrate words, melody, harmony, and speech rhythm." },
  { sourceUnit: 43, slug: "arrangement-rhythm-section-ensemble", title: "Arrangement for Rhythm Section and Ensemble", summary: "Write parts that function beyond solo guitar." },
  { sourceUnit: 44, slug: "alternate-tunings-capo-composition", title: "Alternate Tunings, Capo, and Guitar-Specific Composition", summary: "Use the instrument's physical design as a compositional tool." },
  { sourceUnit: 45, slug: "production-aware-guitar-demo-craft", title: "Production-Aware Guitar and Demo Craft", summary: "Capture ideas clearly and make arrangement decisions from recordings." },
  { sourceUnit: 46, slug: "professional-charts-scores-communication", title: "Professional Charts, Scores, and Communication", summary: "Make music transferable to other musicians." },
  { sourceUnit: 47, slug: "independent-study-teaching", title: "Independent Study and Teaching the Concept", summary: "Prove deep understanding by explaining and adapting." },
  { sourceUnit: 48, slug: "complete-artist-portfolio", title: "Capstone: Complete Artist Portfolio", summary: "Integrate playing, theory, listening, writing, arranging, and reflection." }
];

function levelForSourceUnit(sourceUnit: number): CurriculumIndexEntry["level"] {
  if (sourceUnit <= 8) return "absolute-beginner";
  if (sourceUnit <= 16) return "beginner";
  if (sourceUnit <= 24) return "intermediate";
  if (sourceUnit <= 32) return "upper-intermediate";
  return "advanced";
}

const implementedLevelOneMetadata: Record<number, {
  estimatedMinutes: number;
  outcomes: string[];
  tags: string[];
}> = {
  1: {
    estimatedMinutes: 55,
    outcomes: [
      "Identify essential guitar parts and standard string names.",
      "Use an external tuner safely and produce five clear fretted notes.",
      "Perform an original three-note riff in steady quarter-note time."
    ],
    tags: ["instrument", "setup", "tone", "tuning"]
  },
  2: {
    estimatedMinutes: 70,
    outcomes: [
      "Distinguish beat from whole, half, and quarter-note rhythm values.",
      "Form Em and Asus2 with intentional strum ranges.",
      "Maintain a two-chord progression for one minute without stopping."
    ],
    tags: ["rhythm", "open-chords", "recovery"]
  },
  3: {
    estimatedMinutes: 95,
    outcomes: [
      "Read and form a practical family of open chords.",
      "Diagnose unclear strings and prepare efficient chord changes.",
      "Perform an original verse-chorus study with steady pulse and recovery."
    ],
    tags: ["open-chords", "song-form", "accompaniment"]
  }
};

const mappedUnits: CurriculumIndexEntry[] = mappedSourceUnits.map((unit) => {
  const order = unit.sourceUnit + 3;
  const previousId = order === 4 ? "unit.metronome-foundations" : `unit.${mappedSourceUnits[unit.sourceUnit - 2]!.slug}`;
  const implementedMetadata = implementedLevelOneMetadata[unit.sourceUnit];

  return {
    id: `unit.${unit.slug}`,
    order,
    slug: unit.slug,
    title: unit.title,
    level: levelForSourceUnit(unit.sourceUnit),
    sourceUnit: unit.sourceUnit,
    status: implementedMetadata ? "implemented" : "mapped",
    summary: unit.summary,
    estimatedMinutes: implementedMetadata?.estimatedMinutes ?? (unit.sourceUnit % 8 === 0 ? 180 : 90),
    requiredPriorUnitIds: [previousId],
    recommendedPriorUnitIds: [],
    outcomes: implementedMetadata?.outcomes ?? [`Complete the source curriculum outcomes for ${unit.title}.`],
    tags: implementedMetadata?.tags ?? ["source-mapped", levelForSourceUnit(unit.sourceUnit)]
  };
});

export const curriculumUnitIndex: readonly CurriculumIndexEntry[] = [
  ...openingUnits,
  ...mappedUnits
];
