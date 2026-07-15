import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pilotEducationContent } from "./pilot.js";
import { renderConformanceReport } from "./report.js";

const outputPath = resolve(
  process.cwd(),
  "../../docs/education-overhaul/generated/PILOT_CONFORMANCE_REPORT.md"
);

writeFileSync(outputPath, renderConformanceReport(pilotEducationContent), "utf8");
console.log(`Wrote ${outputPath}`);
