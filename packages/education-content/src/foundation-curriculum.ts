import { curriculumUnitIndex } from "./curriculum-index.js";
import type {
  CurriculumAssessment,
  CurriculumLesson,
  CurriculumReviewPlan,
  FoundationCurriculum
} from "./curriculum-schema.js";
import { levelOneLessons, levelOneReviewPlans } from "./level-one-curriculum.js";
import { levelTwoLessons, levelTwoReviewPlans } from "./level-two-curriculum.js";
import { levelThreeLessons, levelThreeReviewPlans } from "./level-three-curriculum.js";

export const FOUNDATION_CURRICULUM_VERSION = "foundation-3";

const openingFoundationLessons: readonly CurriculumLesson[] = [
  {
    id: "lesson.practice-garden-foundations",
    unitId: "unit.practice-garden",
    order: 1,
    title: "Build a practice you can return to",
    objective:
      "Choose a sustainable practice identity, anticipate one frustration, and write a useful response plan.",
    whyItMatters:
      "Guitar skills grow through repeated, attentive contact. A small practice you can repeat is more valuable than a heroic session that leaves you exhausted or discouraged.",
    estimatedMinutes: 25,
    priorKnowledge: [],
    contentBlocks: [
      {
        id: "practice-growth-is-gradual",
        type: "text",
        heading: "Growth is measured across returns",
        paragraphs: [
          "A clear note, a relaxed chord change, and a steady rhythm are coordinated actions. Your hands and ears need repeated chances to notice, adjust, rest, and try again.",
          "Track the smallest useful change across days and weeks: one cleaner note, one quieter string, one steadier measure, or one easier transition. Minutes are practice inputs; those observable changes are growth."
        ]
      },
      {
        id: "practice-consistency",
        type: "text",
        heading: "Consistency beats occasional intensity",
        paragraphs: [
          "Ten focused minutes on four days gives you four opportunities to remember, correct, and consolidate. One unfocused forty-minute session gives you only one return and may reinforce mistakes after attention fades.",
          "Your minimum commitment is not a limit. It is the version of practice you can still begin on a crowded or low-energy day."
        ]
      },
      {
        id: "practice-frustration",
        type: "callout",
        heading: "Difficulty is information",
        body:
          "A buzzing note or missed change identifies a task that needs to be smaller, slower, or better understood. It is evidence about the task, not evidence about your worth or talent.",
        tone: "practice"
      },
      {
        id: "practice-rest-safety",
        type: "callout",
        heading: "Rest supports learning",
        body:
          "Normal fingertip tenderness is different from sharp pain, numbness, burning, or persistent strain. Stop when pain appears. Reduce duration or pressure, check posture and instrument setup, and seek qualified help when symptoms persist.",
        tone: "safety"
      },
      {
        id: "practice-comparison",
        type: "text",
        heading: "Compare the task, not the person",
        paragraphs: [
          "An advanced player is showing the result of thousands of earlier repetitions that you cannot see. Use performances for musical direction, not as a fair comparison with today's first attempt.",
          "Ask whether your current repetition was more relaxed, accurate, or intentional than the previous one. That comparison can guide the next action."
        ]
      },
      {
        id: "practice-identity-reflection",
        type: "reflection",
        heading: "Name the musician you are practicing to become",
        prompt:
          "Describe a practice identity based on repeatable actions rather than talent or speed.",
        fieldLabel: "My practice identity",
        placeholder: "I am a guitarist who returns regularly and works on one clear target at a time."
      }
    ],
    guidedExercises: [
      {
        id: "exercise.practice-response-plan",
        title: "Turn frustration into a next action",
        purpose: "Practice separating a difficult result from a judgment about yourself.",
        instructions: [
          "Choose one likely frustration, such as buzzing notes, slow chord changes, or losing the beat.",
          "Write the observable symptom without describing yourself.",
          "Choose one response: reduce the tempo, shorten the movement, remove one note, rest, or ask for help.",
          "Name what a useful next attempt would sound or feel like."
        ],
        successCriteria: [
          "The frustration is described as an observable task result.",
          "The response changes the task instead of criticizing the learner.",
          "The next attempt has one clear target."
        ],
        reduceDifficultyWhen: ["The plan contains several problems or several fixes at once."],
        increaseDifficultyWhen: ["The learner can make a specific plan without example prompts."],
        relatedSkills: ["self-observation", "task adjustment", "practice planning"]
      },
      {
        id: "exercise.first-garden-log",
        title: "Write the first garden log",
        purpose: "Create a small record that makes progress visible over time.",
        instructions: [
          "Record today's date and a minimum sustainable practice commitment.",
          "Name one target for the next session.",
          "Write one sentence about what you will do if attention or comfort drops."
        ],
        successCriteria: [
          "The commitment is realistic on an ordinary day.",
          "The next target is specific enough to begin without deciding again.",
          "The plan permits rest or reduced difficulty."
        ],
        reduceDifficultyWhen: ["The commitment feels intimidating before practice begins."],
        increaseDifficultyWhen: ["The minimum commitment has been repeated comfortably for two weeks."],
        relatedSkills: ["reflection", "consistency", "planning"]
      }
    ],
    commonMistakes: [
      {
        id: "mistake.practice-duration-goal",
        symptom: "The goal is only to practice for a long time.",
        likelyCause: "Duration is being treated as proof of learning.",
        adjustment: "Keep a time boundary, but add one observable musical target."
      },
      {
        id: "mistake.practice-personal-failure",
        symptom: "A missed note becomes 'I am bad at guitar.'",
        likelyCause: "The result and the learner's identity have been merged.",
        adjustment: "Describe the exact sound or movement, then change one task variable."
      },
      {
        id: "mistake.practice-through-pain",
        symptom: "Practice continues through sharp pain or numbness.",
        likelyCause: "Discomfort is being mistaken for necessary effort.",
        adjustment: "Stop, release the hands, and address duration, pressure, posture, or setup before returning."
      }
    ],
    knowledgeChecks: [
      {
        id: "check.consistency",
        prompt: "Which plan creates the most useful learning opportunities?",
        options: [
          "Ten focused minutes on four separate days",
          "One distracted forty-minute session",
          "One exhausting session whenever motivation is high"
        ],
        correctAnswer: "Ten focused minutes on four separate days",
        explanation:
          "Separate returns create repeated opportunities to recall, correct, rest, and consolidate."
      },
      {
        id: "check.frustration",
        prompt: "A chord keeps buzzing. What is the most constructive first response?",
        options: [
          "Press every string as hard as possible",
          "Describe which string buzzes and test one smaller adjustment",
          "Decide that chord playing is not a personal strength"
        ],
        correctAnswer: "Describe which string buzzes and test one smaller adjustment",
        explanation:
          "An observable symptom can guide a specific adjustment. A personal judgment cannot."
      }
    ],
    masteryCriteria: [
      {
        id: "mastery.practice-consistency",
        description: "Explain why repeatable practice is more useful than occasional extreme sessions.",
        verification: "guided-self-check",
        required: true
      },
      {
        id: "mastery.practice-response",
        description: "Write one frustration response that changes the task without attacking the learner.",
        verification: "reflection",
        required: true
      },
      {
        id: "mastery.practice-schedule",
        description: "Choose a minimum practice commitment that can be repeated on an ordinary week.",
        verification: "recorded-value",
        required: true
      },
      {
        id: "mastery.practice-log",
        description: "Complete a first garden log entry with a specific next action.",
        verification: "reflection",
        required: true
      }
    ],
    reviewRecommendation:
      "At the next session, reread your minimum commitment and response plan before touching the guitar. After one week, revise only what proved unrealistic.",
    optionalExtension:
      "Keep a seven-day log of starts, not minutes. Note what made beginning easier or harder.",
    interactive: "practice-identity"
  },
  {
    id: "lesson.focused-practice-cycle",
    unitId: "unit.focused-practice",
    order: 1,
    title: "Practice one clear goal at a time",
    objective:
      "Plan and complete one sustainable work-and-rest cycle with a measurable musical goal and a brief reflection.",
    whyItMatters:
      "Playing can be exploratory and enjoyable. Practice is different: it deliberately changes one musical behavior and uses feedback to choose the next attempt.",
    estimatedMinutes: 35,
    priorKnowledge: ["A minimum sustainable practice commitment", "A constructive response to frustration"],
    contentBlocks: [
      {
        id: "focus-playing-versus-practice",
        type: "text",
        heading: "Playing explores; practice changes something",
        paragraphs: [
          "Casual playing follows whatever feels interesting. Focused practice names a target, isolates the smallest useful task, listens to the result, and adjusts the next repetition.",
          "Both belong in a musical life. Problems arise only when enjoyable playing is counted as deliberate work on a skill that never actually receives attention."
        ]
      },
      {
        id: "focus-pomodoro",
        type: "text",
        heading: "Choose a cycle you can complete attentively",
        paragraphs: [
          "A standard Pomodoro uses 25 minutes of focused work followed by 5 minutes of rest. A 10-minute work period followed by 5 minutes of rest is equally valid for beginners, busy days, or physically demanding tasks.",
          "Longer sessions can contain several cycles. Begin each work period with one goal, and use the break before attention collapses rather than after careless repetitions accumulate."
        ]
      },
      {
        id: "focus-goal",
        type: "callout",
        heading: "A measurable goal changes what you do",
        body:
          "'Practice chords' does not identify an action. 'Change from Em to Asus2 eight times without stopping at 50 BPM' tells you what to perform, what to count, and what to observe.",
        tone: "remember"
      },
      {
        id: "focus-break",
        type: "callout",
        heading: "Protect the return",
        body:
          "During a short break, release the guitar, move gently, drink water, and rest your attention. Avoid beginning an activity that makes the next work period difficult to start.",
        tone: "practice"
      },
      {
        id: "focus-reflection",
        type: "reflection",
        heading: "Leave a useful next action",
        prompt:
          "After the cycle, name what changed and the smallest useful action for the next session.",
        fieldLabel: "Cycle reflection",
        placeholder: "The change stayed steady at 50 BPM. Next time I will keep the tempo and reduce finger pressure."
      }
    ],
    guidedExercises: [
      {
        id: "exercise.focused-cycle",
        title: "Complete one focused cycle",
        purpose: "Experience planning, focused work, rest, and reflection as one repeatable process.",
        instructions: [
          "Choose the 10/5 or 25/5 preset, or set a shorter custom work period if needed.",
          "Write one goal with an action, a count or duration, and one quality to observe.",
          "Start the timer and work only on that goal. Pause if pain appears or the task needs to change.",
          "Take the break away from the instrument.",
          "Record a reflection and one next action."
        ],
        successCriteria: [
          "The goal is measurable before the timer starts.",
          "The learner completes or intentionally stops one work period.",
          "The reflection names an observed result and a next action."
        ],
        reduceDifficultyWhen: [
          "Attention repeatedly leaves the task.",
          "The physical task cannot remain relaxed for the selected interval."
        ],
        increaseDifficultyWhen: [
          "The learner completes several cycles with attention and comfort intact."
        ],
        relatedSkills: ["goal setting", "attention", "reflection"]
      }
    ],
    commonMistakes: [
      {
        id: "mistake.focus-too-broad",
        symptom: "Several techniques, songs, and goals compete inside one cycle.",
        likelyCause: "The session goal names a category rather than one result.",
        adjustment: "Choose one transition, measure, rhythm, or sound quality for this cycle."
      },
      {
        id: "mistake.focus-ignore-fatigue",
        symptom: "Accuracy and comfort decline while the timer is still running.",
        likelyCause: "Finishing the clock has become more important than useful repetitions.",
        adjustment: "Pause, shorten the interval, rest, or change to a less demanding task."
      },
      {
        id: "mistake.focus-break-disappears",
        symptom: "A five-minute break turns into an activity that prevents returning.",
        likelyCause: "The break has no return cue.",
        adjustment: "Leave the next goal visible and choose a low-friction break activity."
      }
    ],
    knowledgeChecks: [
      {
        id: "check.focused-goal",
        prompt: "Which is the clearest focused-practice goal?",
        options: [
          "Get better at rhythm guitar",
          "Play music for 25 minutes",
          "Strum eight measures of Em and Asus2 at 50 BPM without losing the quarter-note pulse"
        ],
        correctAnswer:
          "Strum eight measures of Em and Asus2 at 50 BPM without losing the quarter-note pulse",
        explanation:
          "It defines the action, amount, tempo, and quality to observe."
      },
      {
        id: "check.focused-stop",
        prompt: "What should happen when attention or physical comfort collapses?",
        options: [
          "Continue until the timer ends",
          "Pause, rest, or reduce the task",
          "Increase the tempo to become more engaged"
        ],
        correctAnswer: "Pause, rest, or reduce the task",
        explanation:
          "The timer supports focused practice; it does not overrule safety or useful attention."
      }
    ],
    masteryCriteria: [
      {
        id: "mastery.focus-difference",
        description: "Explain one difference between casual playing and focused practice.",
        verification: "guided-self-check",
        required: true
      },
      {
        id: "mastery.focus-preset",
        description: "Choose a sustainable work-and-rest structure.",
        verification: "recorded-value",
        required: true
      },
      {
        id: "mastery.focus-goal",
        description: "Write a measurable goal for one practice cycle.",
        verification: "reflection",
        required: true
      },
      {
        id: "mastery.focus-cycle",
        description: "Complete or intentionally stop one cycle and record a reflection.",
        verification: "performance-checklist",
        required: true
      }
    ],
    reviewRecommendation:
      "Begin the next three sessions by writing one goal before starting the timer. At the end of the week, compare which interval preserved the best attention and comfort.",
    optionalExtension:
      "Complete two cycles with different goals and use the break to decide whether the second goal should continue, shrink, or change.",
    interactive: "focus-timer"
  },
  {
    id: "lesson.metronome-foundations",
    unitId: "unit.metronome-foundations",
    order: 1,
    title: "Build time without chasing the click",
    objective:
      "Use count-ins, subdivisions, clean repetitions, and tempo ladders to practice steady time and recover from mistakes.",
    whyItMatters:
      "A metronome makes time audible. It cannot create groove for you, but it can reveal where your pulse speeds up, slows down, or disappears during a difficult movement.",
    estimatedMinutes: 50,
    priorKnowledge: ["A measurable practice goal", "A sustainable work-and-rest interval"],
    contentBlocks: [
      {
        id: "metronome-bpm-measures",
        type: "text",
        heading: "The click marks a measured pulse",
        paragraphs: [
          "BPM means beats per minute. At 60 BPM, one quarter-note beat occurs each second. In 4/4, four quarter-note beats form one measure and are counted 1, 2, 3, 4.",
          "Use a one- or two-measure count-in to hear the tempo before playing. Beat 1 can be accented to make the beginning of each measure easier to hear."
        ]
      },
      {
        id: "metronome-subdivisions",
        type: "rhythm",
        heading: "One beat can hold different subdivisions",
        counts: ["Quarter: 1 2 3 4", "Eighth: 1 & 2 & 3 & 4 &", "Sixteenth: 1 e & a 2 e & a 3 e & a 4 e & a", "Triplet: 1-trip-let 2-trip-let 3-trip-let 4-trip-let"],
        explanation:
          "The BPM does not change when you subdivide. You fit two, four, or three evenly spaced sounds inside each quarter-note beat. A rest occupies time even when no note sounds.",
        accessibilityDescription:
          "Text counts show quarter notes as one event per beat, eighth notes as two, sixteenth notes as four, and triplets as three equal events per beat."
      },
      {
        id: "metronome-starting-tempo",
        type: "text",
        heading: "Start at the clean tempo, not the maximum tempo",
        paragraphs: [
          "Your clean tempo is the fastest tempo where the task remains accurate, relaxed, and musically intentional. Your maximum tempo is only the fastest attempt you survived; it may include tension, noise, or unstable rhythm.",
          "Begin slower than you expect. After three clean repetitions, increase by 1 to 5 BPM. If the result becomes tense or inaccurate, return to the last clean tempo. This creates a tempo ladder you can repeat later."
        ]
      },
      {
        id: "metronome-rushing-dragging",
        type: "callout",
        heading: "Listen to your relationship with the click",
        body:
          "If your notes repeatedly arrive before the click, you are rushing. If they arrive after it, you are dragging. Do not lunge toward the next click. Subdivide aloud, reduce the tempo, and let each movement begin from the pulse you already heard.",
        tone: "listen"
      },
      {
        id: "metronome-recovery",
        type: "callout",
        heading: "Recovery is part of timekeeping",
        body:
          "When a mistake occurs, keep counting and re-enter at the next clear beat or measure. Restart only when the exercise specifically tests a clean complete repetition. In music, recovering without moving the whole pulse is a real skill.",
        tone: "practice"
      },
      {
        id: "metronome-applications",
        type: "guitar-task",
        heading: "Apply the same pulse to four guitar tasks",
        instructions: [
          "Chord changes: hold one chord for four beats, then change on beat 1.",
          "Strumming: keep the hand moving through eighth-note down-up motion and choose which strokes sound.",
          "Scales: play one note per click, then two evenly spaced notes per click without changing BPM.",
          "Riffs: isolate one difficult beat, count it aloud, then reconnect it to the measure."
        ],
        listenFor:
          "The click should feel embedded in the performance rather than like a target you repeatedly chase.",
        successCriteria: [
          "The learner counts through the complete measure.",
          "The chosen subdivision stays even.",
          "A mistake does not cause an uncontrolled tempo change."
        ],
        accessibilityDescription:
          "Four text-described guitar applications use the same audible and visible pulse; no diagram is required to complete them."
      },
      {
        id: "metronome-internal-time",
        type: "text",
        heading: "Use fewer clicks only after the pulse is stable",
        paragraphs: [
          "Internal time is your ability to continue the pulse between external references. Once a task is steady, let the click mark fewer events, such as beats 2 and 4 or only beat 1, while you maintain the subdivisions between them.",
          "Mechanical accuracy places events correctly. Groove also shapes accents, articulation, dynamics, and feel. First make the timing dependable; then make the pattern sound intentional."
        ]
      },
      {
        id: "metronome-log",
        type: "reflection",
        heading: "Record a clean tempo",
        prompt:
          "Record the task, subdivision, last clean BPM, and one timing observation for the next session.",
        fieldLabel: "Timing observation",
        placeholder: "At 55 BPM my chord change rushed beat 4. Next time I will count eighth notes and prepare the change on beat 3."
      }
    ],
    guidedExercises: [
      {
        id: "exercise.metronome-pulse",
        title: "Find and keep the quarter-note pulse",
        purpose: "Coordinate counting and movement with an external beat.",
        instructions: [
          "Set 50 BPM, quarter notes, a one-measure count-in, and a beat-1 accent.",
          "Count 1, 2, 3, 4 through the count-in.",
          "Tap or mute-strum for four measures without stopping.",
          "Repeat until three attempts are steady and relaxed."
        ],
        successCriteria: [
          "Counting continues for four complete measures.",
          "The movement remains relaxed.",
          "Three consecutive repetitions do not noticeably rush or drag."
        ],
        reduceDifficultyWhen: ["Counting stops", "The learner repeatedly chases the click", "Tension increases"],
        increaseDifficultyWhen: ["Three consecutive repetitions are steady and relaxed"],
        relatedSkills: ["pulse", "counting", "recovery"],
        startingBpm: 50,
        repetitions: 3
      },
      {
        id: "exercise.metronome-subdivision-ladder",
        title: "Keep the BPM while the subdivision changes",
        purpose: "Separate beat speed from the number of events inside each beat.",
        instructions: [
          "Set 50 BPM and play or tap quarter notes for two measures.",
          "Without changing BPM, switch to eighth notes for two measures.",
          "Return to quarter notes and notice whether the pulse moved.",
          "Add triplets or sixteenth notes only when the count remains clear."
        ],
        successCriteria: [
          "The quarter-note pulse remains the same speed.",
          "Events inside each beat are evenly spaced.",
          "The learner can speak the chosen counting syllables."
        ],
        reduceDifficultyWhen: ["Subdivision syllables become uneven", "The underlying quarter-note pulse disappears"],
        increaseDifficultyWhen: ["Quarter and eighth transitions remain steady for three cycles"],
        relatedSkills: ["subdivision", "internal pulse", "coordination"],
        startingBpm: 50,
        repetitions: 3
      },
      {
        id: "exercise.metronome-tempo-ladder",
        title: "Build a clean tempo ladder",
        purpose: "Increase speed without trading away timing, tone, or comfort.",
        instructions: [
          "Choose one chord change, scale fragment, strum, or riff.",
          "Find a tempo where one complete repetition is accurate and relaxed.",
          "After three clean repetitions, increase by 5 BPM.",
          "At the first unstable attempt, return to the previous clean tempo and record it."
        ],
        successCriteria: [
          "Tempo increases only after three clean repetitions.",
          "The final recorded value is a clean BPM, not merely the fastest attempt.",
          "The log names one timing or comfort observation."
        ],
        reduceDifficultyWhen: ["Tone, rhythm, or comfort changes before three clean repetitions"],
        increaseDifficultyWhen: ["The same clean BPM is retrieved in the next session"],
        relatedSkills: ["tempo control", "self-observation", "practice logging"],
        startingBpm: 50,
        repetitions: 3
      }
    ],
    commonMistakes: [
      {
        id: "mistake.metronome-chasing",
        symptom: "Each note lunges toward the click after it is heard.",
        likelyCause: "The learner is reacting to isolated clicks instead of maintaining subdivisions between them.",
        adjustment: "Count subdivisions aloud and prepare each movement from the previous beat."
      },
      {
        id: "mistake.metronome-too-fast",
        symptom: "The task is technically possible but noisy, tense, or rhythmically unstable.",
        likelyCause: "Maximum tempo has been mistaken for clean tempo.",
        adjustment: "Lower BPM until accuracy, ease, and musical intent return together."
      },
      {
        id: "mistake.metronome-restart",
        symptom: "Every mistake causes an immediate restart and the learner never practices recovery.",
        likelyCause: "Only perfect uninterrupted attempts are being valued.",
        adjustment: "Keep counting and re-enter on the next clear beat, then run a separate clean-repetition check."
      },
      {
        id: "mistake.metronome-mechanical",
        symptom: "Notes align with the grid but accents and phrasing disappear.",
        likelyCause: "Timing accuracy has replaced musical intent rather than supporting it.",
        adjustment: "Keep the pulse and add a planned accent, dynamic shape, or articulation."
      }
    ],
    knowledgeChecks: [
      {
        id: "check.metronome-sixty",
        prompt: "At 60 BPM, how long is one quarter-note beat?",
        options: ["Half a second", "One second", "Four seconds"],
        correctAnswer: "One second",
        explanation: "Sixty beats distributed across sixty seconds produces one beat each second."
      },
      {
        id: "check.metronome-subdivision",
        prompt: "What changes when you switch from quarter notes to eighth notes at the same BPM?",
        options: [
          "The quarter-note pulse doubles in speed",
          "Two evenly spaced events fit inside each beat",
          "The measure contains eight quarter-note beats"
        ],
        correctAnswer: "Two evenly spaced events fit inside each beat",
        explanation: "Subdivision changes events per beat; it does not change the BPM."
      },
      {
        id: "check.metronome-clean-tempo",
        prompt: "When should a tempo ladder increase?",
        options: [
          "After one attempt that reaches the final note",
          "After three accurate, relaxed, consistent repetitions",
          "Whenever the current tempo feels boring"
        ],
        correctAnswer: "After three accurate, relaxed, consistent repetitions",
        explanation: "Three clean repetitions provide better evidence that the current tempo is stable."
      }
    ],
    masteryCriteria: [
      {
        id: "mastery.metronome-controls",
        description: "Set BPM, count-in, accent, and subdivision for a stated task.",
        verification: "performance-checklist",
        required: true
      },
      {
        id: "mastery.metronome-counting",
        description: "Count quarter and eighth subdivisions through four measures without changing the underlying BPM.",
        verification: "performance-checklist",
        required: true
      },
      {
        id: "mastery.metronome-ladder",
        description: "Use three clean repetitions before increasing a tempo ladder.",
        verification: "guided-self-check",
        required: true
      },
      {
        id: "mastery.metronome-log",
        description: "Record a clean BPM, task, subdivision, and useful next observation.",
        verification: "recorded-value",
        required: true
      }
    ],
    reviewRecommendation:
      "At the next session, begin five BPM below the recorded clean tempo and retrieve the same task. After one week, use a different task or fewer clicks to test internal time.",
    optionalExtension:
      "After stable four-click measures, silence or ignore selected clicks while continuing to count, then check whether beat 1 still aligns when the full click returns.",
    interactive: "metronome"
  }
];

export const foundationLessons: readonly CurriculumLesson[] = [
  ...openingFoundationLessons,
  ...levelOneLessons,
  ...levelTwoLessons,
  ...levelThreeLessons
];

export const foundationAssessments: readonly CurriculumAssessment[] = foundationLessons.map(
  (lesson) => ({
    id: `assessment.${lesson.unitId.replace("unit.", "")}`,
    unitId: lesson.unitId,
    title: `${lesson.title} assessment`,
    requirements: lesson.masteryCriteria,
    passingRule: "Complete every required criterion and record the requested reflection or value.",
    remediationLessonIds: [lesson.id]
  })
);

export const foundationReviewPlans: readonly CurriculumReviewPlan[] = [
  {
    id: "review.practice-garden",
    unitId: "unit.practice-garden",
    immediateReview: ["Read the minimum commitment and frustration response aloud."],
    nextSessionReview: ["Use the response plan before the first difficult repetition."],
    oneWeekReview: ["Revise the commitment only if the recorded week shows it was not sustainable."],
    longTermReview: ["Review the garden log monthly and identify one measurable change."]
  },
  {
    id: "review.focused-practice",
    unitId: "unit.focused-practice",
    immediateReview: ["Check that the next action names one observable target."],
    nextSessionReview: ["Write the goal before starting the timer."],
    oneWeekReview: ["Compare which interval preserved attention and physical comfort."],
    longTermReview: ["Adjust work and rest intervals when the task or schedule changes."]
  },
  {
    id: "review.metronome-foundations",
    unitId: "unit.metronome-foundations",
    immediateReview: ["Repeat the task five BPM below the recorded clean tempo."],
    nextSessionReview: ["Retrieve the clean tempo before trying to increase it."],
    oneWeekReview: ["Change the task or click density while keeping the same pulse skill."],
    longTermReview: ["Log clean tempos by task and revisit timing weaknesses monthly."]
  },
  ...levelOneReviewPlans,
  ...levelTwoReviewPlans,
  ...levelThreeReviewPlans
];

export const foundationCurriculum: FoundationCurriculum = {
  schemaVersion: 3,
  contentVersion: FOUNDATION_CURRICULUM_VERSION,
  units: [...curriculumUnitIndex],
  lessons: [...foundationLessons],
  assessments: [...foundationAssessments],
  reviewPlans: [...foundationReviewPlans]
};
