export interface FretboardMapLegacyFixture {
  id: `LM-${string}`;
  input: {
    learningProgressRaw: string | null;
    lessonProgressRaw: string | null;
    noteHistoryRaw: string | null;
  };
  expectedRecordCount: number;
  expectedCategories: Array<"participation" | "practice_summary">;
  expectedDiagnostics: string[];
  pilotScenario?: "independent" | "contradiction" | "transfer";
}

const startedAt = "2026-06-01T10:00:00.000Z";
const attemptedAt = "2026-06-01T10:18:00.000Z";

function learning(
  checkpoints: string[],
  status: "in-progress" | "complete" = "in-progress",
  extra: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    slug: "fretboard-map",
    status,
    startedAt,
    completedCheckpoints: checkpoints,
    ...extra
  };
}

function practice(
  accuracy?: number,
  promptCount?: number,
  status: "in-progress" | "complete" = "in-progress",
  extra: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    slug: "fretboard-map",
    drill: "note",
    status,
    startedAt,
    ...(accuracy === undefined ? {} : { lastAccuracy: accuracy }),
    ...(promptCount === undefined ? {} : { lastPromptCount: promptCount }),
    ...extra
  };
}

function versioned(progress: unknown[]): string {
  return JSON.stringify({ version: 1, progress });
}

const completeLearning = learning(["read", "play", "write"], "complete", {
  completedAt: "2026-06-01T10:12:00.000Z"
});
const passingPractice = practice(80, 10, "complete", {
  completedAt: attemptedAt,
  lastAttemptedAt: attemptedAt
});

export const fretboardMapLegacyFixtures: FretboardMapLegacyFixture[] = [
  {
    id: "LM-001",
    input: { learningProgressRaw: null, lessonProgressRaw: null, noteHistoryRaw: null },
    expectedRecordCount: 0,
    expectedCategories: [],
    expectedDiagnostics: ["source_records_seen"]
  },
  {
    id: "LM-002",
    input: { learningProgressRaw: versioned([learning([])]), lessonProgressRaw: null, noteHistoryRaw: null },
    expectedRecordCount: 0,
    expectedCategories: [],
    expectedDiagnostics: ["valid_non_mappable"]
  },
  {
    id: "LM-003",
    input: { learningProgressRaw: versioned([learning(["read"])]), lessonProgressRaw: null, noteHistoryRaw: null },
    expectedRecordCount: 1,
    expectedCategories: ["participation"],
    expectedDiagnostics: []
  },
  {
    id: "LM-004",
    input: { learningProgressRaw: versioned([completeLearning]), lessonProgressRaw: null, noteHistoryRaw: null },
    expectedRecordCount: 1,
    expectedCategories: ["participation"],
    expectedDiagnostics: []
  },
  {
    id: "LM-005",
    input: { learningProgressRaw: null, lessonProgressRaw: versioned([practice()]), noteHistoryRaw: null },
    expectedRecordCount: 0,
    expectedCategories: [],
    expectedDiagnostics: ["valid_non_mappable"]
  },
  {
    id: "LM-006",
    input: { learningProgressRaw: null, lessonProgressRaw: versioned([practice(70, 10, "in-progress", { lastAttemptedAt: attemptedAt })]), noteHistoryRaw: null },
    expectedRecordCount: 1,
    expectedCategories: ["practice_summary"],
    expectedDiagnostics: []
  },
  {
    id: "LM-007",
    input: { learningProgressRaw: null, lessonProgressRaw: versioned([passingPractice]), noteHistoryRaw: null },
    expectedRecordCount: 1,
    expectedCategories: ["practice_summary"],
    expectedDiagnostics: []
  },
  {
    id: "LM-008",
    input: { learningProgressRaw: null, lessonProgressRaw: versioned([practice(100, 20, "complete", { lastAttemptedAt: attemptedAt })]), noteHistoryRaw: null },
    expectedRecordCount: 1,
    expectedCategories: ["practice_summary"],
    expectedDiagnostics: []
  },
  {
    id: "LM-009",
    input: { learningProgressRaw: versioned([completeLearning]), lessonProgressRaw: versioned([passingPractice]), noteHistoryRaw: null },
    expectedRecordCount: 2,
    expectedCategories: ["participation", "practice_summary"],
    expectedDiagnostics: []
  },
  {
    id: "LM-010",
    input: {
      learningProgressRaw: versioned([completeLearning, { ...completeLearning, slug: "repeating-notes" }]),
      lessonProgressRaw: versioned([passingPractice, { ...passingPractice, slug: "repeating-notes" }]),
      noteHistoryRaw: null
    },
    expectedRecordCount: 2,
    expectedCategories: ["participation", "practice_summary"],
    expectedDiagnostics: ["ignored_unrelated"]
  },
  {
    id: "LM-011",
    input: { learningProgressRaw: versioned([completeLearning, completeLearning]), lessonProgressRaw: versioned([passingPractice, passingPractice]), noteHistoryRaw: null },
    expectedRecordCount: 2,
    expectedCategories: ["participation", "practice_summary"],
    expectedDiagnostics: ["duplicate_record"]
  },
  {
    id: "LM-012",
    input: { learningProgressRaw: "{bad-json", lessonProgressRaw: JSON.stringify({ nope: [] }), noteHistoryRaw: null },
    expectedRecordCount: 0,
    expectedCategories: [],
    expectedDiagnostics: ["malformed_envelope"]
  },
  {
    id: "LM-013",
    input: { learningProgressRaw: versioned([completeLearning, { slug: "fretboard-map" }]), lessonProgressRaw: null, noteHistoryRaw: null },
    expectedRecordCount: 1,
    expectedCategories: ["participation"],
    expectedDiagnostics: ["omitted_record"]
  },
  {
    id: "LM-014",
    input: { learningProgressRaw: JSON.stringify([completeLearning]), lessonProgressRaw: JSON.stringify([passingPractice]), noteHistoryRaw: null },
    expectedRecordCount: 2,
    expectedCategories: ["participation", "practice_summary"],
    expectedDiagnostics: ["legacy_format"]
  },
  {
    id: "LM-015",
    input: { learningProgressRaw: null, lessonProgressRaw: versioned([practice(90, 10, "complete")]), noteHistoryRaw: null },
    expectedRecordCount: 1,
    expectedCategories: ["practice_summary"],
    expectedDiagnostics: ["timestamp_unknown"]
  },
  {
    id: "LM-016",
    input: { learningProgressRaw: versioned([completeLearning]), lessonProgressRaw: versioned([passingPractice]), noteHistoryRaw: null },
    expectedRecordCount: 2,
    expectedCategories: ["participation", "practice_summary"],
    expectedDiagnostics: [],
    pilotScenario: "independent"
  },
  {
    id: "LM-017",
    input: { learningProgressRaw: versioned([completeLearning]), lessonProgressRaw: versioned([passingPractice]), noteHistoryRaw: null },
    expectedRecordCount: 2,
    expectedCategories: ["participation", "practice_summary"],
    expectedDiagnostics: [],
    pilotScenario: "contradiction"
  },
  {
    id: "LM-018",
    input: { learningProgressRaw: null, lessonProgressRaw: null, noteHistoryRaw: null },
    expectedRecordCount: 0,
    expectedCategories: [],
    expectedDiagnostics: [],
    pilotScenario: "transfer"
  },
  {
    id: "LM-019",
    input: { learningProgressRaw: null, lessonProgressRaw: null, noteHistoryRaw: JSON.stringify({ version: 1, sessions: [{ id: "note-session" }] }) },
    expectedRecordCount: 0,
    expectedCategories: [],
    expectedDiagnostics: ["unattributed_session"]
  },
  {
    id: "LM-020",
    input: { learningProgressRaw: versioned([completeLearning]), lessonProgressRaw: versioned([passingPractice]), noteHistoryRaw: null },
    expectedRecordCount: 2,
    expectedCategories: ["participation", "practice_summary"],
    expectedDiagnostics: []
  }
];
