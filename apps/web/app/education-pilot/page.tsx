import type { Metadata } from "next";
import { EducationPilot } from "../components/education/EducationPilot";

export const metadata: Metadata = {
  title: "Education Pilot",
  description:
    "A focused FretGarden learning sequence for sustainable practice, pulse, and first-position natural notes."
};

export default function EducationPilotPage() {
  return <EducationPilot />;
}
