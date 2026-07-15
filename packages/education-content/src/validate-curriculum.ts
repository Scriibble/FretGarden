import { foundationCurriculum } from "./foundation-curriculum.js";
import { validateFoundationCurriculum } from "./curriculum-validate.js";

const result = validateFoundationCurriculum(foundationCurriculum);

if (!result.valid) {
  for (const issue of result.issues) {
    console.error(`${issue.code} at ${issue.path}: ${issue.message}`);
  }
  process.exitCode = 1;
} else {
  const implemented = foundationCurriculum.units.filter(
    ({ status }) => status === "implemented"
  ).length;
  const mapped = foundationCurriculum.units.length - implemented;
  console.log(
    `Curriculum valid: ${foundationCurriculum.units.length} units, ${implemented} implemented, ${mapped} source-mapped.`
  );
}
