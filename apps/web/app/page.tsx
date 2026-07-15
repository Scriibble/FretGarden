import type { Metadata } from "next";
import Link from "next/link";
import {
  FeatureIcon,
  HeroGardenArtwork,
  PracticePreview
} from "./components/marketing/MarketingArtwork";
import { MarketingShell } from "./components/marketing/MarketingShell";
import styles from "./components/marketing/marketing.module.css";

export const metadata: Metadata = {
  title: "Grow Your Fretboard Knowledge",
  description:
    "Learn guitar notes, chord tones, scale degrees, intervals, and musical structure through focused practice designed to grow with you."
};

const features = [
  {
    icon: "notes" as const,
    title: "Fretboard notes",
    description:
      "Build reliable note recognition across the neck instead of depending on a few familiar positions."
  },
  {
    icon: "intervals" as const,
    title: "Intervals",
    description:
      "See the distances between notes and understand the relationships that make patterns useful."
  },
  {
    icon: "chords" as const,
    title: "Chord tones",
    description:
      "Find roots, thirds, fifths, and other chord tones where they actually live on the fretboard."
  },
  {
    icon: "degrees" as const,
    title: "Scale degrees",
    description:
      "Connect every note to its role inside a key so scales become musical rather than mechanical."
  },
  {
    icon: "patterns" as const,
    title: "Connected patterns",
    description:
      "Link shapes to notes, intervals, and harmony instead of memorizing diagrams in isolation."
  },
  {
    icon: "focus" as const,
    title: "Focused sessions",
    description:
      "Use short, intentional practice loops that support consistency without turning practice into a grind."
  }
];

const steps = [
  {
    title: "Plant the foundation",
    description:
      "Start with the notes and relationships that make later theory easier to understand."
  },
  {
    title: "Practice with focus",
    description:
      "Work through manageable drills with immediate feedback and a clear objective."
  },
  {
    title: "Connect the patterns",
    description:
      "See how notes, intervals, chords, and scale degrees relate across the guitar neck."
  },
  {
    title: "Grow lasting knowledge",
    description:
      "Carry that understanding into improvisation, songwriting, analysis, and everyday playing."
  }
];

export default function HomePage() {
  return (
    <MarketingShell activePage="home">
      <section className={styles.heroSection} aria-labelledby="home-title">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Guided guitar theory practice</span>
            <h1 className={styles.heroTitle} id="home-title">
              Learn the fretboard.
              <span>Grow your musicianship.</span>
            </h1>
            <p className={styles.heroLead}>
              FretGarden now centers a 51-unit guided curriculum for learning
              guitar with durable practice habits, clear musical tasks, and
              focused reinforcement tools. Move from first sound to songwriting,
              fretboard fluency, harmony, improvisation, and a finished artist
              portfolio without treating completion as mastery.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryCta} href="/lessons">
                Start the 51-unit curriculum
              </Link>
              <Link className={styles.secondaryCta} href="/practice">
                Open practice tools
              </Link>
              <Link className={styles.secondaryCta} href="/signup">
                Create an account
              </Link>
            </div>
            <div className={styles.heroStatus} aria-label="Current product status">
              <span>51 authored units available now</span>
              <span>Practice drills remain available as reinforcement</span>
              <span>Accounts are live; cloud progress sync is planned</span>
            </div>
          </div>

          <HeroGardenArtwork />
        </div>
      </section>

      <div className={styles.trustStrip}>
        <div className={styles.trustStripInner}>
          <p>Practice with purpose, not pressure.</p>
          <div className={styles.trustItem}>
            <i className={styles.trustDot} aria-hidden="true" />
            <div>
              <strong>Guided curriculum</strong>
              <small>51 progressive units</small>
            </div>
          </div>
          <div className={styles.trustItem}>
            <i className={styles.trustDot} aria-hidden="true" />
            <div>
              <strong>Connected theory</strong>
              <small>Patterns with musical meaning</small>
            </div>
          </div>
          <div className={styles.trustItem}>
            <i className={styles.trustDot} aria-hidden="true" />
            <div>
              <strong>Reinforcement tools</strong>
              <small>Focused drills when useful</small>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.curriculumFlowSection} aria-labelledby="curriculum-flow-title">
        <div className={styles.curriculumFlowPanel}>
          <div className={styles.curriculumFlowCopy}>
            <span className={styles.sectionEyebrow}>The main learning path</span>
            <h2 id="curriculum-flow-title">Follow the curriculum first, then use drills to reinforce what the unit asks you to practice.</h2>
            <p>
              The lesson path is the primary experience. It introduces the instrument,
              pulse, chord vocabulary, reading, fretboard mapping, songwriting,
              improvisation, harmony, and portfolio work in a deliberate sequence.
            </p>
          </div>
          <div className={styles.curriculumFlowActions}>
            <Link className={styles.primaryCta} href="/lessons">
              Browse all units
            </Link>
            <Link className={styles.secondaryCta} href="/practice">
              Use practice tools
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="problem-title">
        <div className={styles.problemGrid}>
          <div className={styles.problemCopy}>
            <span className={styles.sectionEyebrow}>Beyond memorized shapes</span>
            <h2 id="problem-title">Understand what you play, not only where to place your fingers.</h2>
            <p>
              Many guitarists collect scale boxes, chord diagrams, and familiar
              shapes without developing a connected map of the fretboard.
              Those patterns can be useful, but they become more flexible when
              you know the notes and relationships underneath them.
            </p>
            <p>
              FretGarden is designed to connect practical neck work with the
              music theory that explains why those shapes sound and function
              the way they do.
            </p>
          </div>

          <div className={styles.problemVisual} aria-label="From isolated patterns to connected knowledge">
            <div className={`${styles.patternCard} ${styles.patternCardMuted}`}>
              <span className={styles.patternNumber}>1</span>
              <div>
                <strong>Memorize a shape</strong>
                <p>Useful in one position, but difficult to adapt or explain.</p>
              </div>
            </div>
            <div className={styles.connectionLine}>connect the relationships</div>
            <div className={styles.patternCard}>
              <span className={styles.patternNumber}>2</span>
              <div>
                <strong>See notes, intervals, and function</strong>
                <p>Move the idea, reshape it, and use it with intention.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="features-title">
        <div className={styles.sectionHeaderCentered}>
          <span className={styles.sectionEyebrow}>What you will cultivate</span>
          <h2 className={styles.sectionTitle} id="features-title">
            A stronger map of the guitar neck
          </h2>
          <p className={styles.sectionLead}>
            Each practice area reinforces the others so your knowledge becomes
            easier to recall, apply, and hear in real music.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article className={styles.featureCard} key={feature.title}>
              <div className={styles.featureIcon}>
                <FeatureIcon kind={feature.icon} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="how-title">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>How FretGarden works</span>
          <h2 className={styles.sectionTitle} id="how-title">
            Work through one deliberate layer at a time
          </h2>
          <p className={styles.sectionLead}>
            The learning path moves from concrete fretboard knowledge toward
            broader musical understanding without rushing past the roots.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <article className={styles.stepCard} key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <div className={styles.stepGrowth} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="focus-title">
        <div className={styles.practicePhilosophy}>
          <div className={styles.philosophyCopy}>
            <span className={styles.sectionEyebrow}>Focused practice philosophy</span>
            <h2 id="focus-title">Practice that respects your attention.</h2>
            <p>
              FretGarden encourages short, intentional sessions inspired by
              Pomodoro-style focus. A manageable practice window makes it
              easier to return consistently, review mistakes, and stop before
              attention turns into frustration.
            </p>
            <p>
              The goal is not to rush progress. It is to make each session
              clear enough that you can return tomorrow and keep growing.
            </p>
          </div>

          <div className={styles.timerVisual} aria-hidden="true">
            <span className={styles.timerLeaf} />
            <div className={styles.timerDial}>
              <strong>25</strong>
              <span>focused minutes</span>
            </div>
            <span className={styles.timerLeafAlt} />
          </div>
        </div>
      </section>

      <div className={styles.productPreviewSection}>
        <section className={styles.section} aria-labelledby="preview-title">
          <div className={styles.sectionHeaderCentered}>
            <span className={styles.sectionEyebrow}>Reinforcement tools</span>
            <h2 className={styles.sectionTitle} id="preview-title">
              Open a drill when a unit calls for extra reps
            </h2>
            <p className={styles.sectionLead}>
              The practice loop is local-first and separate from curriculum
              completion. Use notes, chord tones, scale degrees, intervals,
              octaves, and inversions as focused reinforcement.
            </p>
          </div>

          <PracticePreview />
        </section>
      </div>

      <section className={styles.section} aria-labelledby="audience-title">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Who it is for</span>
          <h2 className={styles.sectionTitle} id="audience-title">
            Built for players who want the fretboard to make sense
          </h2>
        </div>

        <div className={styles.audienceGrid}>
          <article className={styles.audienceCard}>
            <span>Starting out</span>
            <h3>Beginners building a real foundation</h3>
            <p>
              Learn the neck in manageable steps while connecting new theory to
              something you can immediately see and practice.
            </p>
          </article>
          <article className={styles.audienceCard}>
            <span>Filling the gaps</span>
            <h3>Self-taught guitarists</h3>
            <p>
              Turn years of collected shapes and songs into a more organized,
              flexible understanding of the instrument.
            </p>
          </article>
          <article className={styles.audienceCard}>
            <span>Connecting ideas</span>
            <h3>Intermediate players</h3>
            <p>
              Strengthen note awareness, harmonic targeting, and the link
              between theory knowledge and real playing decisions.
            </p>
          </article>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="final-cta-title">
        <div className={styles.ctaPanel}>
          <div className={styles.ctaCopy}>
            <span className={styles.sectionEyebrow}>Give your practice room to grow</span>
            <h2 id="final-cta-title">Build stronger fretboard knowledge one focused session at a time.</h2>
            <p>
              Try the current local practice experience or create an account
              while saved cloud progress and learning paths continue to grow.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <Link className={styles.primaryCta} href="/practice">
              Open practice tools
            </Link>
            <Link className={styles.secondaryCta} href="/lessons">
              View curriculum
            </Link>
            <Link className={styles.secondaryCta} href="/signup">
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
