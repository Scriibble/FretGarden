import type { Metadata } from "next";
import Link from "next/link";
import { DevelopmentWaitlist } from "../components/marketing/DevelopmentWaitlist";
import { FounderGardenArtwork } from "../components/marketing/MarketingArtwork";
import { MarketingShell } from "../components/marketing/MarketingShell";
import styles from "../components/marketing/marketing.module.css";

export const metadata: Metadata = {
  title: "About Me",
  description:
    "Why FretGarden is being built and the practice philosophy guiding its development."
};

const principles = [
  {
    number: "01",
    title: "Understanding before speed",
    description:
      "A fast answer is less useful when the underlying relationship still feels unclear."
  },
  {
    number: "02",
    title: "Consistency before intensity",
    description:
      "Short, repeatable practice sessions create a healthier path than occasional marathons."
  },
  {
    number: "03",
    title: "Musical meaning before decoration",
    description:
      "Every drill should support a real fretboard or theory skill rather than exist only to keep someone busy."
  },
  {
    number: "04",
    title: "Honest progress",
    description:
      "FretGarden should clearly distinguish what works today from what is still planned."
  }
];

export default function AboutPage() {
  return (
    <MarketingShell activePage="about">
      <section className={styles.compactHero} aria-labelledby="about-title">
        <div className={styles.compactHeroInner}>
          <div className={styles.compactHeroCopy}>
            <span className={styles.eyebrow}>About the project</span>
            <h1 id="about-title">Why I’m growing FretGarden</h1>
            <p>
              I’m building FretGarden to help guitarists move beyond isolated
              shapes and develop a more connected understanding of the neck.
              The goal is a practice tool that feels patient, practical, and
              grounded in the way musical knowledge actually develops.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryCta} href="/practice">
                Explore the current app
              </Link>
              <Link className={styles.secondaryCta} href="/signup">
                Create an account
              </Link>
            </div>
          </div>

          <FounderGardenArtwork />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="story-title">
        <div className={styles.aboutStoryGrid}>
          <div className={styles.aboutStoryCopy}>
            <span className={styles.sectionEyebrow}>The problem behind it</span>
            <h2 id="story-title">Guitar theory often arrives as disconnected pieces.</h2>
            <p>
              It is possible to learn songs, scale boxes, chord shapes, and
              technique without ever feeling that the fretboard has become one
              coherent system. The information is there, but it can remain
              scattered across different lessons and diagrams.
            </p>
            <p>
              FretGarden is my attempt to organize those relationships into
              focused exercises: learn the concept, see it on the neck, retrieve
              it from memory, and revisit it often enough that it becomes usable.
            </p>
          </div>

          <aside className={styles.aboutStoryCard}>
            <blockquote>
              “The aim is not to make practice feel effortless. It is to make the effort clear, focused, and worth returning to.”
            </blockquote>
            <p>
              The garden metaphor reflects that approach. Knowledge needs
              attention, repetition, and time. You cannot force healthy growth,
              but you can create better conditions for it.
            </p>
          </aside>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="principles-title">
        <div className={styles.aboutPrinciplesGrid}>
          <div className={styles.aboutPrinciplesCopy}>
            <span className={styles.sectionEyebrow}>Development principles</span>
            <h2 id="principles-title">Built around sustainable learning</h2>
            <p>
              These principles guide both the lesson content and the product
              decisions behind FretGarden. They are meant to keep the app useful
              as it grows rather than letting features obscure the practice itself.
            </p>
          </div>

          <div className={styles.principleList}>
            {principles.map((principle) => (
              <article className={styles.principleItem} key={principle.number}>
                <span>{principle.number}</span>
                <div>
                  <strong>{principle.title}</strong>
                  <p>{principle.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <DevelopmentWaitlist
        headingId="public-title"
        source="about-building-in-public"
      />
    </MarketingShell>
  );
}
