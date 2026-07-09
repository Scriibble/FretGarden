export interface LessonSection {
  heading: string;
  body: string[];
}

export interface LessonPlayPrompt {
  title: string;
  instructions: string[];
  listeningGoal: string;
}

export interface LessonSongConnection {
  title: string;
  reference: string;
  body: string[];
}

export interface LessonCreativeTask {
  title: string;
  prompt: string;
  constraints: string[];
}

export interface LessonCheckQuestion {
  question: string;
  answer: string;
}

export type LessonPracticeDrill =
  | "note"
  | "chordTone"
  | "scaleDegree"
  | "interval"
  | "octaveShape"
  | "triadInversion";

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
  fretboardApplications: LessonSection[];
  playPrompts: LessonPlayPrompt[];
  songConnection: LessonSongConnection;
  writeWithIt: LessonCreativeTask;
  checkUnderstanding: LessonCheckQuestion[];
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
          "Every fretted note is counted upward from that open string one semitone at a time. The fretboard looks wide, but it is built from one small rule repeated many times."
        ]
      },
      {
        heading: "Frets move by half steps",
        body: [
          "Moving one fret higher raises the pitch by one half step.",
          "After twelve frets, the same note name repeats one octave higher. That means the twelfth fret is a checkpoint, not a mystery."
        ]
      }
    ],
    fretboardApplications: [
      {
        heading: "Use the low E string as a ruler",
        body: [
          "Play the open low E string, then frets 1, 2, and 3. You are hearing E, F, F#, and G.",
          "Repeat the same idea on the A string: open A, then A#, B, and C. The note names change, but the half-step rule does not."
        ]
      }
    ],
    playPrompts: [
      {
        title: "Walk one string slowly",
        instructions: [
          "Play the open low E string, then frets 1 through 5 one at a time.",
          "Say the note names out loud as E, F, F#, G, G#, A."
        ],
        listeningGoal:
          "Notice that each fret sounds like the smallest possible upward step."
      }
    ],
    songConnection: {
      title: "Single-string riffs",
      reference: "Many beginner rock and blues riffs",
      body: [
        "A lot of familiar guitar parts begin by moving a small number of frets on one string. You do not need the exact riff to learn the idea: adjacent frets create tight motion, while skips create a bigger jump.",
        "When a song moves a shape up one fret, it is using the same half-step logic you just played."
      ]
    },
    writeWithIt: {
      title: "Write a one-string idea",
      prompt:
        "Create a four-note idea on the low E string using only frets 0 through 5.",
      constraints: [
        "Start and end on either open E or fret 5 A.",
        "Play it twice, then change one note by one fret and listen for the difference."
      ]
    },
    checkUnderstanding: [
      {
        question: "What happens when you move one fret higher?",
        answer: "The pitch rises by one half step."
      },
      {
        question: "Why is the twelfth fret useful?",
        answer: "It repeats the open string note name one octave higher."
      }
    ],
    practice: {
      label: "Practice note recognition",
      href: "/practice?drill=note&lesson=fretboard-map#practice",
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
          "The octave changes, but the note identity repeats every twelve half steps. That is why one note name can have several useful locations."
        ]
      },
      {
        heading: "Repeats give you choices",
        body: [
          "The same note can sound thicker on a low string or brighter on a high string.",
          "Knowing more than one location gives you options when you play melodies, chords, and riffs."
        ]
      }
    ],
    fretboardApplications: [
      {
        heading: "Find C in two places",
        body: [
          "Play C on the A string, fret 3. Then play C on the B string, fret 1.",
          "They share a note name, but their register and string color feel different."
        ]
      }
    ],
    playPrompts: [
      {
        title: "Compare two Cs",
        instructions: [
          "Play A string fret 3, then B string fret 1.",
          "Alternate between them four times, keeping the rhythm even."
        ],
        listeningGoal:
          "Hear that both notes feel like C, even though one is lower and warmer."
      }
    ],
    songConnection: {
      title: "Moving a melody to a new register",
      reference: "Common verse-to-chorus arranging move",
      body: [
        "Songwriters often repeat a melody higher or lower to change intensity without changing the musical idea.",
        "On guitar, repeating note names across strings gives you the same option: keep the idea, move the register."
      ]
    },
    writeWithIt: {
      title: "Move a target note",
      prompt:
        "Write a three-note melody that starts on C, then play it once from a low C and once from a higher C.",
      constraints: [
        "Use only notes you can name.",
        "Keep the rhythm the same in both versions."
      ]
    },
    checkUnderstanding: [
      {
        question: "What changes when the same note name appears in a new octave?",
        answer: "The register changes, but the note identity stays the same."
      },
      {
        question: "Why learn more than one location for a note?",
        answer: "It gives you fretboard choices for tone, range, and movement."
      }
    ],
    practice: {
      label: "Practice string-specific notes",
      href: "/practice?drill=note&lesson=repeating-notes#practice",
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
          "For C major, those chord tones are C, E, and G. For C minor, the 3rd changes to Eb, creating a darker color."
        ]
      },
      {
        heading: "Function beats shape memorization",
        body: [
          "Instead of only memorizing grips, ask what job each note is doing inside the chord.",
          "That makes chord tones easier to move into new keys and easier to use in melodies."
        ]
      }
    ],
    fretboardApplications: [
      {
        heading: "Build C major on nearby strings",
        body: [
          "Play C on the A string fret 3, E on the D string fret 2, and G on the open G string.",
          "Those three notes are enough to express C major even before you play a full open-chord shape."
        ]
      }
    ],
    playPrompts: [
      {
        title: "Hear the 3rd change",
        instructions: [
          "Play C on A string fret 3, then E on D string fret 2, then G open.",
          "Now replace E with Eb on D string fret 1 and play C, Eb, G."
        ],
        listeningGoal:
          "Notice how one changed note turns the chord color from major to minor."
      }
    ],
    songConnection: {
      title: "Major and minor color in songs",
      reference: "Countless pop, rock, folk, and blues progressions",
      body: [
        "When a song moves between major and minor chords, the 3rd is usually the note that tells your ear the emotional color changed.",
        "You can discuss a progression as chord names, but chord tones explain why those names sound different."
      ]
    },
    writeWithIt: {
      title: "Write two chord colors",
      prompt:
        "Write a two-chord vamp that alternates between a major triad sound and a minor triad sound on the same root.",
      constraints: [
        "Keep the root and 5th the same.",
        "Change only the 3rd and describe the color change in your own words."
      ]
    },
    checkUnderstanding: [
      {
        question: "Which chord tone usually decides major vs minor?",
        answer: "The 3rd."
      },
      {
        question: "What does the root do?",
        answer: "It names and centers the chord."
      }
    ],
    practice: {
      label: "Practice chord tones",
      href: "/practice?drill=chordTone&lesson=triads#practice",
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
          "In G major, B is the 3rd degree. In C major, E is the 3rd degree. The note name changes, but the role stays comparable."
        ]
      },
      {
        heading: "The role moves with the key",
        body: [
          "A degree is not one fixed note name. It is a relationship to the scale root.",
          "That is why musicians can move a melody or progression into a new key without changing its basic shape."
        ]
      }
    ],
    fretboardApplications: [
      {
        heading: "Map numbers onto G major",
        body: [
          "Use G as 1, A as 2, B as 3, C as 4, D as 5, E as 6, and F# as 7.",
          "Play G, B, and D as 1, 3, and 5. Those degrees outline the G major triad."
        ]
      }
    ],
    playPrompts: [
      {
        title: "Play 1-3-5",
        instructions: [
          "Play G on low E string fret 3, B on A string fret 2, and D on A string fret 5.",
          "Say 1, 3, 5 as you play the notes."
        ],
        listeningGoal:
          "Hear how scale degrees turn scattered notes into a chord outline."
      }
    ],
    songConnection: {
      title: "Progressions as numbers",
      reference: "Common I-V-vi-IV and I-IV-V progressions",
      body: [
        "Musicians often describe progressions with Roman numerals because the same relationship can move to any key.",
        "A I-V-vi-IV progression has a recognizable sense of motion even when the chord names change."
      ]
    },
    writeWithIt: {
      title: "Write with numbers",
      prompt:
        "Create a four-chord progression using I, IV, V, and vi in any major key you know.",
      constraints: [
        "Write both the Roman numerals and the actual chord names.",
        "End on I and notice how it feels like home."
      ]
    },
    checkUnderstanding: [
      {
        question: "What does scale degree 1 represent?",
        answer: "The root or tonic of the scale."
      },
      {
        question: "Why are scale degrees movable?",
        answer: "They describe relationships to the root, not fixed note names."
      }
    ],
    practice: {
      label: "Practice scale degrees",
      href: "/practice?drill=scaleDegree&lesson=scale-degrees#practice",
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
        heading: "Intervals describe musical motion",
        body: [
          "Small intervals tend to sound stepwise. Larger intervals can sound more open, dramatic, or chord-like.",
          "On guitar, interval shapes help you move ideas without counting from scratch every time."
        ]
      }
    ],
    fretboardApplications: [
      {
        heading: "Compare a 3rd and a 5th",
        body: [
          "From C on the A string fret 3, play E on the D string fret 2 for a major 3rd.",
          "Then play G on the D string fret 5 for a perfect 5th. The 5th sounds more open and stable."
        ]
      }
    ],
    playPrompts: [
      {
        title: "Root, 3rd, 5th",
        instructions: [
          "Play C, E, and G slowly.",
          "Then play C to E several times, followed by C to G several times."
        ],
        listeningGoal:
          "Compare the color of the 3rd with the stability of the 5th."
      }
    ],
    songConnection: {
      title: "Power chords and 5ths",
      reference: "Common rock rhythm-guitar vocabulary",
      body: [
        "Power chords lean on roots and 5ths because the perfect 5th sounds stable and strong without declaring major or minor.",
        "Adding a 3rd would make the harmony more specific, which is sometimes useful and sometimes less flexible."
      ]
    },
    writeWithIt: {
      title: "Choose an interval mood",
      prompt:
        "Write a two-note riff that uses either mostly 3rds or mostly 5ths.",
      constraints: [
        "Play it over the same root note.",
        "Describe whether your riff sounds colorful, stable, tense, or open."
      ]
    },
    checkUnderstanding: [
      {
        question: "What does an interval measure?",
        answer: "The distance or relationship between two notes."
      },
      {
        question: "Why can a 5th feel stable?",
        answer: "It strongly supports the root without adding major/minor color."
      }
    ],
    practice: {
      label: "Practice interval landmarks",
      href: "/practice?drill=interval&lesson=intervals#practice",
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
        heading: "Shapes become navigation tools",
        body: [
          "Octave shapes connect low-string roots to middle and high-string targets without counting every fret from scratch.",
          "The goal is not only to memorize a shape, but to use it to confirm note names quickly as you move through the neck."
        ]
      }
    ],
    fretboardApplications: [
      {
        heading: "Use a root-to-root route",
        body: [
          "Play G on the low E string fret 3, then find the higher G on the D string fret 5.",
          "That route is one of the common octave movements that makes the neck feel connected."
        ]
      }
    ],
    playPrompts: [
      {
        title: "Echo a note up an octave",
        instructions: [
          "Play G on low E string fret 3.",
          "Answer it with G on D string fret 5, then return to the lower G."
        ],
        listeningGoal:
          "Hear the same note identity in a higher register."
      }
    ],
    songConnection: {
      title: "Octave doubling",
      reference: "Common guitar, bass, and vocal arranging technique",
      body: [
        "Arrangements often double an idea in octaves to make it bigger without changing the harmony.",
        "On guitar, octave shapes let you create that lift while staying anchored to note names."
      ]
    },
    writeWithIt: {
      title: "Double a simple riff",
      prompt:
        "Write a three-note riff, then play the first note again one octave higher.",
      constraints: [
        "Keep the rhythm steady.",
        "Use the octave note as an answer, not a separate new idea."
      ]
    },
    checkUnderstanding: [
      {
        question: "What stays the same across octaves?",
        answer: "The note name or pitch class."
      },
      {
        question: "Why practice octave shapes?",
        answer: "They help connect note names across fretboard regions."
      }
    ],
    practice: {
      label: "Practice CAGED octave shapes",
      href: "/practice?drill=octaveShape&lesson=octave-shapes#practice",
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
        heading: "Inversions smooth out movement",
        body: [
          "When chords share nearby notes, inversions can keep your hand from jumping across the neck.",
          "That is why small triad shapes are useful for rhythm parts, arrangements, and songwriting."
        ]
      }
    ],
    fretboardApplications: [
      {
        heading: "Reorder C major",
        body: [
          "C major contains C, E, and G no matter which note is lowest.",
          "Try playing the notes as C-E-G, then E-G-C, then G-C-E in nearby positions."
        ]
      }
    ],
    playPrompts: [
      {
        title: "Same notes, new bass",
        instructions: [
          "Play C, E, G as separate notes.",
          "Now start the same collection on E, then on G."
        ],
        listeningGoal:
          "Notice that the chord identity remains, but the weight shifts."
      }
    ],
    songConnection: {
      title: "Smooth chord movement",
      reference: "Common pop, soul, gospel, and indie guitar arranging",
      body: [
        "Guitarists often use inversions so a chord progression moves by small steps instead of large jumps.",
        "The listener hears the progression as connected, even though the chord names may be changing."
      ]
    },
    writeWithIt: {
      title: "Make a smoother progression",
      prompt:
        "Choose two major chords and find a way to connect them with the smallest note movement you can.",
      constraints: [
        "Use only root, 3rd, and 5th from each chord.",
        "Write down which chord tone is lowest in each shape."
      ]
    },
    checkUnderstanding: [
      {
        question: "What changes in an inversion?",
        answer: "The lowest note changes."
      },
      {
        question: "What stays the same?",
        answer: "The chord tones and chord identity."
      }
    ],
    practice: {
      label: "Practice triad inversions",
      href: "/practice?drill=triadInversion&lesson=triad-inversions#practice",
      drill: "triadInversion",
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
        heading: "Landmarks support melody writing",
        body: [
          "A melody that touches chord tones often sounds connected to the harmony underneath it.",
          "Scale degrees between the landmarks can add motion, tension, and release."
        ]
      }
    ],
    fretboardApplications: [
      {
        heading: "Outline G major",
        body: [
          "In G major, the root is G, the 3rd is B, the 5th is D, and the 7th is F#.",
          "Play those notes slowly, then resolve F# up to G to hear why the 7th wants to move."
        ]
      }
    ],
    playPrompts: [
      {
        title: "Resolve 7 to 1",
        instructions: [
          "Play F# on the high E string fret 2.",
          "Resolve it to G on high E string fret 3."
        ],
        listeningGoal:
          "Hear the pull of the 7th resolving into the root."
      }
    ],
    songConnection: {
      title: "Melodies that aim for home",
      reference: "Common chorus and cadence writing",
      body: [
        "Many melodies create lift by approaching the tonic from nearby scale degrees, especially 7 resolving to 1.",
        "You can analyze that motion with numbers even when you do not know every note name immediately."
      ]
    },
    writeWithIt: {
      title: "Write a landing melody",
      prompt:
        "Write a four-note melody in a major key that ends with 7 resolving to 1.",
      constraints: [
        "Use at least one landmark degree: 1, 3, 5, or 7.",
        "End on the root and notice whether it feels finished."
      ]
    },
    checkUnderstanding: [
      {
        question: "Which major-scale degree often pulls upward to the root?",
        answer: "The 7th degree."
      },
      {
        question: "Why are 1, 3, and 5 strong landmarks?",
        answer: "They outline the tonic triad."
      }
    ],
    practice: {
      label: "Practice major scale landmarks",
      href: "/practice?drill=scaleDegree&lesson=major-scale-landmarks#practice",
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
