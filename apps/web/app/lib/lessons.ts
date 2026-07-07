export interface LessonSection {
  heading: string;
  body: string[];
}

export interface LessonPracticeLink {
  label: string;
  href: string;
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
      href: "/#practice"
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
      href: "/#practice"
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
      href: "/#practice"
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
      href: "/#practice"
    }
  }
] as const satisfies readonly Lesson[];

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug);
}
