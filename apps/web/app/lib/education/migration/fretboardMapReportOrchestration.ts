import { parseEducationPilotStore } from "../storage/educationPilotStorage";
import {
  inspectFretboardMapLegacySources,
  mapFretboardMapLegacyHistory
} from "./fretboardMapLegacyMapping";
import { buildFretboardMapParallelReport } from "./fretboardMapParallelReport";
import type { FretboardMapMigrationInputs } from "./readFretboardMapMigrationInputs";

export function createFretboardMapParallelReport(input: {
  raw: FretboardMapMigrationInputs;
  now: string;
}) {
  const historical = mapFretboardMapLegacyHistory(
    inspectFretboardMapLegacySources(input.raw)
  );
  const pilot = parseEducationPilotStore(input.raw.educationPilotRaw, input.now);

  return buildFretboardMapParallelReport({
    historical,
    educationStore: pilot.store,
    educationStoreState: pilot.state,
    now: input.now
  });
}
