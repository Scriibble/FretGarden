import type {
  AttemptRecord,
  EvidenceRecord,
  ReadinessDecision,
  ReviewObligation
} from "@pocket-practice/education-engine";
import { scheduleNextReview } from "@pocket-practice/education-engine";
import { z } from "zod";
import {
  EDUCATION_POLICY_VERSION,
  EDUCATION_SCHEMA_VERSION
} from "@pocket-practice/education-engine";
import { PILOT_CONTENT_VERSION } from "@pocket-practice/education-content";
import { pilotEducationContent } from "@pocket-practice/education-content";

export const EDUCATION_PILOT_STORAGE_KEY = "pocket-practice:education-pilot:v1";
export const EDUCATION_PILOT_RECOVERY_KEY =
  "pocket-practice:education-pilot:recovery:v1";

export interface EducationPilotRecovery {
  capturedAt: string;
  reason: "invalid_json" | "unknown_schema";
  raw: string;
}

export interface PilotSessionRecord {
  id: string;
  startedAt: string;
  updatedAt: string;
  target: string;
  durationMinutes: 5 | 10 | 15;
  nextAction: string;
  state: "active" | "paused" | "ended";
}

export interface EducationPilotStore {
  schemaVersion: number;
  contentVersion: string;
  policyVersion: string;
  updatedAt: string;
  sessions: PilotSessionRecord[];
  attempts: AttemptRecord[];
  evidence: EvidenceRecord[];
  reviews: ReviewObligation[];
  readinessDecisions: ReadinessDecision[];
}

export type EducationPilotStoreState =
  | "absent"
  | "valid"
  | "invalid_json"
  | "unknown_schema";

export interface ParsedEducationPilotStore {
  store: EducationPilotStore;
  state: EducationPilotStoreState;
}

const versionRefSchema = z.object({ id: z.string(), version: z.number() });
const recoverySchema = z.object({
  capturedAt: z.string(),
  reason: z.enum(["invalid_json", "unknown_schema"]),
  raw: z.string()
});
const storeSchema = z.object({
  schemaVersion: z.literal(EDUCATION_SCHEMA_VERSION),
  contentVersion: z.string(),
  policyVersion: z.string(),
  updatedAt: z.string(),
  sessions: z.array(
    z.object({
      id: z.string(),
      startedAt: z.string(),
      updatedAt: z.string(),
      target: z.string(),
      durationMinutes: z.union([z.literal(5), z.literal(10), z.literal(15)]),
      nextAction: z.string(),
      state: z.enum(["active", "paused", "ended"])
    })
  ),
  attempts: z.array(
    z.object({
      id: z.string(),
      sessionId: z.string(),
      taskId: z.string(),
      objective: versionRefSchema,
      contentVersion: z.string(),
      policyVersion: z.string(),
      startedAt: z.string(),
      respondedAt: z.string(),
      response: z.unknown(),
      supportLevel: z.enum(["modeled", "guided", "prompted", "independent"]),
      supportsUsed: z.array(z.string()),
      correctionState: z.enum(["none", "answer_revealed", "corrected_reattempt"]),
      valid: z.boolean(),
      invalidReason: z.string().optional(),
      sourceEvidenceAt: z.string().optional(),
      variedContext: z.boolean(),
      observations: z.array(z.object({ dimension: z.string(), passed: z.boolean() }).passthrough())
    })
  ),
  evidence: z.array(
    z.object({
      id: z.string(),
      attemptId: z.string(),
      objective: versionRefSchema,
      requirementId: z.string(),
      observedAt: z.string(),
      outcome: z.enum(["supports", "contradicts", "invalid"]),
      kind: z
        .enum([
          "correction",
          "exposure",
          "supported_performance",
          "independent_performance",
          "retained_performance",
          "transfer",
          "readiness"
        ])
        .nullable(),
      confidence: z.enum(["insufficient", "limited", "moderate", "strong"]),
      supportLevel: z.enum(["modeled", "guided", "prompted", "independent"]),
      quality: z.array(z.object({ dimension: z.string(), passed: z.boolean() }).passthrough()),
      claimCeiling: z.string().nullable(),
      reasons: z.array(z.string()),
      contentVersion: z.string(),
      policyVersion: z.string()
    })
  ),
  reviews: z.array(
    z.object({
      id: z.string(),
      objective: versionRefSchema,
      sourceEvidenceId: z.string(),
      sequenceIndex: z.number(),
      dueAt: z.string(),
      dueWindowEndsAt: z.string(),
      state: z.enum(["scheduled", "due", "completed", "lapsed"]),
      policy: versionRefSchema
    })
  ),
  readinessDecisions: z.array(z.unknown())
});

export function createEmptyPilotStore(now: string): EducationPilotStore {
  return {
    schemaVersion: EDUCATION_SCHEMA_VERSION,
    contentVersion: PILOT_CONTENT_VERSION,
    policyVersion: EDUCATION_POLICY_VERSION,
    updatedAt: now,
    sessions: [],
    attempts: [],
    evidence: [],
    reviews: [],
    readinessDecisions: []
  };
}

export function readEducationPilotStore(
  storage: Pick<Storage, "getItem" | "setItem">,
  now: string
): EducationPilotStore {
  const raw = storage.getItem(EDUCATION_PILOT_STORAGE_KEY);
  const parsed = parseEducationPilotStore(raw, now);
  if (
    raw !== null &&
    (parsed.state === "invalid_json" || parsed.state === "unknown_schema")
  ) {
    preservePilotRecovery(storage, {
      capturedAt: now,
      reason: parsed.state,
      raw
    });
  }
  return parsed.store;
}

export function parseEducationPilotStore(
  raw: string | null,
  now: string
): ParsedEducationPilotStore {
  if (!raw) {
    return { store: createEmptyPilotStore(now), state: "absent" };
  }

  let value: unknown;
  try {
    value = JSON.parse(raw) as unknown;
  } catch {
    return { store: createEmptyPilotStore(now), state: "invalid_json" };
  }

  const parsed = storeSchema.safeParse(value);
  return parsed.success
    ? { store: parsed.data as EducationPilotStore, state: "valid" }
    : { store: createEmptyPilotStore(now), state: "unknown_schema" };
}

export function readEducationPilotRecovery(
  storage: Pick<Storage, "getItem">
): EducationPilotRecovery | null {
  try {
    const raw = storage.getItem(EDUCATION_PILOT_RECOVERY_KEY);
    if (!raw) {
      return null;
    }
    const parsed = recoverySchema.safeParse(JSON.parse(raw) as unknown);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function discardEducationPilotRecovery(
  storage: Pick<Storage, "removeItem">
): void {
  try {
    storage.removeItem(EDUCATION_PILOT_RECOVERY_KEY);
  } catch {
    // Recovery cleanup is optional and must not interrupt practice.
  }
}

export function writeEducationPilotStore(
  storage: Pick<Storage, "setItem">,
  store: EducationPilotStore
): boolean {
  try {
    storage.setItem(EDUCATION_PILOT_STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

export function appendPilotEvaluation(
  store: EducationPilotStore,
  input: {
    attempt: AttemptRecord;
    evidence: EvidenceRecord;
    review: ReviewObligation | null;
  },
  now: string
): EducationPilotStore {
  const attempts = appendById(store.attempts, input.attempt);
  const evidence = appendById(store.evidence, input.evidence);
  const reviews = input.review ? appendById(store.reviews, input.review) : store.reviews;
  return { ...store, updatedAt: now, attempts, evidence, reviews };
}

export function appendReadinessDecision(
  store: EducationPilotStore,
  decision: ReadinessDecision,
  now: string
): EducationPilotStore {
  return {
    ...store,
    updatedAt: now,
    readinessDecisions: [...store.readinessDecisions, decision]
  };
}

export function completePilotReview(
  store: EducationPilotStore,
  obligationId: string,
  input: {
    attempt: AttemptRecord;
    evidence: EvidenceRecord;
  },
  now: string
): EducationPilotStore {
  const obligation = store.reviews.find(({ id }) => id === obligationId);
  let updated = appendPilotEvaluation(store, { ...input, review: null }, now);
  if (!obligation) {
    return updated;
  }

  const retained = input.evidence.kind === "retained_performance";
  const reviews = updated.reviews.map((review) =>
    review.id === obligationId
      ? { ...review, state: retained ? ("completed" as const) : ("lapsed" as const) }
      : review
  );
  updated = { ...updated, reviews };

  if (retained) {
    const policy = pilotEducationContent.reviewPolicies.find(
      ({ id }) => id === obligation.policy.id
    );
    const next = policy
      ? scheduleNextReview(input.evidence, policy, obligation.sequenceIndex + 1)
      : null;
    if (next) {
      updated = { ...updated, reviews: appendById(updated.reviews, next) };
    }
  }

  return updated;
}

export function upsertPilotSession(
  store: EducationPilotStore,
  session: PilotSessionRecord
): EducationPilotStore {
  const sessions = [session, ...store.sessions.filter(({ id }) => id !== session.id)];
  return { ...store, updatedAt: session.updatedAt, sessions };
}

function appendById<T extends { id: string }>(items: T[], item: T): T[] {
  return items.some(({ id }) => id === item.id) ? items : [...items, item];
}

function preservePilotRecovery(
  storage: Pick<Storage, "getItem" | "setItem">,
  recovery: EducationPilotRecovery
): void {
  try {
    if (storage.getItem(EDUCATION_PILOT_RECOVERY_KEY) === null) {
      storage.setItem(EDUCATION_PILOT_RECOVERY_KEY, JSON.stringify(recovery));
    }
  } catch {
    // An unavailable storage device cannot be repaired from this layer.
  }
}
