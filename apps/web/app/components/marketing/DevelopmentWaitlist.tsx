import Link from "next/link";
import { WaitlistForm } from "./WaitlistForm";
import styles from "./marketing.module.css";

type DevelopmentWaitlistProps = {
  headingId: string;
  source: string;
};

export function DevelopmentWaitlist({
  headingId,
  source
}: DevelopmentWaitlistProps) {
  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.buildingPublic}>
        <span className={styles.sectionEyebrow}>Building in public</span>
        <h2 id={headingId}>FretGarden is actively being developed.</h2>
        <p>
          The current app supports account creation and local practice for
          notes, chord tones, and scale degrees, along with additional lessons
          and advanced drills. Cloud progress sync and a more complete learning
          path are planned, but they are not presented as finished features.
          Early testing and direct feedback will help determine what should be
          built next.
        </p>

        <div className={styles.waitlistArea}>
          <div>
            <strong>Follow the project as it grows.</strong>
            <span>
              Join the email list for development notes, testing opportunities,
              and early-access announcements.
            </span>
          </div>
          <WaitlistForm source={source} />
        </div>

        <Link className={styles.waitlistDemoLink} href="/practice">
          Open the working demo
        </Link>
      </div>
    </section>
  );
}
