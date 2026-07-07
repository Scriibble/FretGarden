export interface LessonSection {
  heading: string;
  body: string[];
}

export type LessonPracticeDrill =
  | "note"
  | "chordTone"
  | "scaleDegree"
  | "interval"
  | "octaveShape";

export interface LessonPracticeLink {
  label: string;
  href: string;
  drill: LessonPracticeDrill;
  criteria: LessonPracticeCriteria;
}

export interface LessonPracticeCriteria {
  promptCount: number;
  minAccuracy: number;
}

export interface Lesson {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  sections: LessonSection[];
  practice: LessonPracticeLink;
}

export const lessons = [
  {
    slug: "fretboard-map",
    eyebrow: "Fretboard Basics",
    title: "How the fretboard is organized",
    summary:
      "Learn how strings, frets, and standard tuning combine into a repeatable note map.",
    sections: [
      {
        heading: "Strings are starting notes",
        body: [
          "In standard tuning, each open string starts from a fixed note: low E, A, D, G, B, and high E.",
          "Every fretted note is counted upward from that open string one semitone at a time."
        ]
      },
      {
        heading: "Frets move by half steps",
        body: [
          "Moving one fret higher raises the pitch by one half step.",
          "After twelve frets, the same note name repeats one octave higher."
        ]
      }
    ],
    practice: {
      label: "Practice note recognition",
      href: "/?drill=note&lesson=fretboard-map#practice",
      drill: "note",
      criteria: {
        promptCount: 10,
        minAccuracy: 80
      }
    }
  },
  {
    slug: "repeating-notes",
    eyebrow: "Note Patterns",
    title: "How notes repeat across the neck",
    summary:
      "See why the same note can appear on multiple strings and frets.",
    sections: [
      {
        heading: "A note is a pitch class",
        body: [
          "The note C is still C wherever it appears on the fretboard.",
          "The octave changes, but the note identity repeats every twelve half steps."
        ]
      },
      {
        heading: "String-specific practice matters",
        body: [
          "Finding a note on one requested string prevents guessing from a familiar shape.",
          "That is why Pocket.Practice asks prompts like finding D on the A string."
        ]
      }
    ],
    practice: {
      label: "Practice string-specific notes",
      href: "/?drill=note&lesson=repeating-notes#practice",
      drill: "note",
      criteria: {
        promptCount: 10,
        minAccuracy: 80
      }
    }
  },
  {
    slug: "triads",
    eyebrow: "Chord Tones",
    title: "Roots, 3rds, and 5ths",
    summary:
      "Understand the three notes that make basic major and minor chords work.",
    sections: [
      {
        heading: "Triads have three jobs",
        body: [
          "The root names the chord, the 3rd gives the chord its major or minor color, and the 5th stabilizes the sound.",
          "For C major, those chord tones are C, E, and G."
        ]
      },
      {
        heading: "Think by function first",
        body: [
          "Instead of only memorizing shapes, ask what job a note is doing inside the chord.",
          "That makes chord tones easier to move into new keys."
        ]
      }
    ],
    practice: {
      label: "Practice chord tones",
      href: "/?drill=chordTone&lesson=triads#practice",
      drill: "chordTone",
      criteria: {
        promptCount: 12,
        minAccuracy: 80
      }
    }
  },
  {
    slug: "scale-degrees",
    eyebrow: "Scale Degrees",
    title: "Scale degrees as movable landmarks",
    summary:
      "Learn why the 1st, 3rd, 5th, and 7th degrees keep their musical role in every key.",
    sections: [
      {
        heading: "Degrees describe position in a scale",
        body: [
          "The root is degree 1, then the scale counts upward through 2, 3, 4, 5, 6, and 7.",
          "In G major, B is the 3rd degree. In C major, E is the 3rd degree."
        ]
      },
      {
        heading: "The role moves with the key",
        body: [
          "A degree is not one fixed note name. It is a relationship to the scale root.",
          "Practicing degrees by string helps connect theory language to actual fretboard locations."
        ]
      }
    ],
    practice: {
      label: "Practice scale degrees",
      href: "/?drill=scaleDegree&lesson=scale-degrees#practice",
      drill: "scaleDegree",
      criteria: {
        promptCount: 12,
        minAccuracy: 80
      }
    }
  },
  {
    slug: "intervals",
    eyebrow: "Intervals",
    title: "Intervals as fretboard distance",
    summary:
      "Connect 2nds, 3rds, 4ths, 5ths, 6ths, and 7ths to the way notes sit around a root.",
    sections: [
      {
        heading: "Intervals are relationships",
        body: [
          "An interval names the distance from one note to another, not a single fixed note.",
          "A 3rd above C is E, while a 3rd above G is B. The relationship stays the same as the root changes."
        ]
      },
      {
        heading: "Scale degrees make intervals visible",
        body: [
          "Scale degree language is a practical way to train intervals on guitar.",
          "When you find the 3rd, 5th, or 7th of a scale on a specific string, you are also training interval distance from the root."
        ]
      }
    ],
    practice: {
      label: "Practice interval landmarks",
      href: "/?drill=interval&lesson=intervals#practice",
      drill: "interval",
      criteria: {
        promptCount: 12,
        minAccuracy: 80
      }
    }
  },
  {
    slug: "octave-shapes",
    eyebrow: "Octaves",
    title: "CAGED octave shapes unlock the neck",
    summary:
      "Use octave relationships to find the same note in nearby fretboard regions.",
    sections: [
      {
        heading: "Octaves share a note name",
        body: [
          "Two notes an octave apart have the same letter name at a higher or lower register.",
          "That is why one target note can appear several times across the first twelve frets."
        ]
      },
      {
        heading: "CAGED shapes give the octave a route",
        body: [
          "In this drill, the C, A, G, E, and D labels name common root-to-root paths, such as A string to G string or low E string to D string.",
          "The highlighted source note is your anchor. Your job is to use the shape name to land on the matching octave target."
        ]
      },
      {
        heading: "Shapes become navigation tools",
        body: [
          "Octave shapes help connect low-string roots to middle and high-string targets without counting every fret from scratch.",
          "The goal is not only to memorize a shape, but to use it to confirm note names quickly as you move through the neck."
        ]
      }
    ],
    practice: {
      label: "Practice CAGED octave shapes",
      href: "/?drill=octaveShape&lesson=octave-shapes#practice",
      drill: "octaveShape",
      criteria: {
        promptCount: 10,
        minAccuracy: 80
      }
    }
  },
  {
    slug: "triad-inversions",
    eyebrow: "Triad Inversions",
    title: "Triad inversions keep the same notes",
    summary:
      "Learn how root, 3rd, and 5th can be reordered while the chord identity remains intact.",
    sections: [
      {
        heading: "Inversions change the bass note",
        body: [
          "A root-position triad puts the root lowest, first inversion puts the 3rd lowest, and second inversion puts the 5th lowest.",
          "The chord tones stay the same even when their order changes."
        ]
      },
      {
        heading: "Function beats shape memorization",
        body: [
          "When you can name the root, 3rd, and 5th, an inversion becomes easier to understand and move.",
          "This makes small chord shapes feel less like isolated grips and more like movable harmony."
        ]
      }
    ],
    practice: {
      label: "Practice inversion chord tones",
      href: "/?drill=chordTone&lesson=triad-inversions#practice",
      drill: "chordTone",
      criteria: {
        promptCount: 12,
        minAccuracy: 80
      }
    }
  },
  {
    slug: "major-scale-landmarks",
    eyebrow: "Major Scale",
    title: "Major scale landmarks",
    summary:
      "Use the root, 3rd, 5th, and 7th as anchors for hearing and finding major-key sounds.",
    sections: [
      {
        heading: "Some degrees carry more context",
        body: [
          "The root centers the key, the 3rd reveals major color, the 5th stabilizes the sound, and the 7th pulls toward the root.",
          "These landmarks make the full scale easier to remember because they give the pattern musical jobs."
        ]
      },
      {
        heading: "Practice them on purpose",
        body: [
          "Finding scale degrees on requested strings turns abstract theory into fretboard reflex.",
          "Start with landmarks before expecting the whole scale to feel automatic."
        ]
      }
    ],
    practice: {
      label: "Practice major scale landmarks",
      href: "/?drill=scaleDegree&lesson=major-scale-landmarks#practice",
      drill: "scaleDegree",
      criteria: {
        promptCount: 12,
        minAccuracy: 80
      }
    }
  }
] as const satisfies readonly Lesson[];

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getLessonIndex(slug: string): number {
  return lessons.findIndex((lesson) => lesson.slug === slug);
}

export function getNextLesson(slug: string): Lesson | undefined {
  const lessonIndex = getLessonIndex(slug);

  return lessonIndex === -1 ? undefined : lessons[lessonIndex + 1];
}

export function getPreviousLesson(slug: string): Lesson | undefined {
  const lessonIndex = getLessonIndex(slug);

  return lessonIndex <= 0 ? undefined : lessons[lessonIndex - 1];
}
