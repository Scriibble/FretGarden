import type { Metadata } from "next";
import { FretboardMapMigrationReport } from "../../components/education/FretboardMapMigrationReport";

export const metadata: Metadata = {
  title: "Fretboard Map Migration Review",
  description:
    "A local read-only comparison of older fretboard-map history and new guided practice results."
};

export default function FretboardMapMigrationPage() {
  return <FretboardMapMigrationReport />;
}
