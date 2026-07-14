import type { Metadata } from "next";
import { FretboardMapMigrationReport } from "../../components/education/FretboardMapMigrationReport";

export const metadata: Metadata = {
  title: "Fretboard Map Migration Review",
  description:
    "A local read-only comparison of legacy fretboard-map history and current education evidence."
};

export default function FretboardMapMigrationPage() {
  return <FretboardMapMigrationReport />;
}
