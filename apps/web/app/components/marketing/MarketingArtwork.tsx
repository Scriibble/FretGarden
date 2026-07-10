import styles from "./marketing.module.css";

export function HeroGardenArtwork() {
  return (
    <div className={styles.heroArtwork} aria-hidden="true">
      <svg viewBox="0 0 760 620" role="presentation">
        <defs>
          <linearGradient id="fretboard-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3f5f4b" />
            <stop offset="1" stopColor="#263d31" />
          </linearGradient>
          <linearGradient id="sun-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f7e7bf" />
            <stop offset="1" stopColor="#d6a34f" />
          </linearGradient>
          <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#533e24" floodOpacity="0.16" />
          </filter>
        </defs>

        <circle cx="596" cy="112" r="76" fill="url(#sun-fill)" opacity="0.72" />
        <path
          d="M38 514C144 446 208 466 306 512C405 558 505 555 726 440V620H38V514Z"
          fill="#e4eddc"
        />
        <path
          d="M38 548C170 486 254 520 354 553C474 592 585 560 726 494V620H38V548Z"
          fill="#c9d9bb"
        />

        <g filter="url(#soft-shadow)" transform="translate(58 150)">
          <rect width="650" height="256" rx="38" fill="url(#fretboard-fill)" />
          <rect x="1.5" y="1.5" width="647" height="253" rx="36.5" fill="none" stroke="#78966f" strokeWidth="3" />

          {[44, 79, 114, 149, 184, 219].map((y) => (
            <path
              d={`M26 ${y}H624`}
              key={y}
              stroke="#f8f0e2"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.76"
            />
          ))}

          {[96, 188, 280, 372, 464, 556].map((x) => (
            <path
              d={`M${x} 22V234`}
              key={x}
              stroke="#a8b9a1"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.78"
            />
          ))}

          <circle cx="142" cy="114" r="13" fill="#d6a34f" />
          <circle cx="326" cy="184" r="13" fill="#b86f45" />
          <circle cx="510" cy="79" r="13" fill="#f4dfcf" />
          <circle cx="602" cy="149" r="10" fill="#95b85c" />

          <g transform="translate(338 56)">
            <path d="M0 136V40" stroke="#fffaf1" strokeWidth="11" strokeLinecap="round" />
            <path
              d="M0 60C0 24 27 0 64 0C64 36 37 60 0 60Z"
              fill="#e4eddc"
            />
            <path
              d="M0 86C0 50-27 26-64 26C-64 62-37 86 0 86Z"
              fill="#95b85c"
            />
            <circle cx="0" cy="148" r="29" fill="#fffaf1" />
            <circle cx="0" cy="148" r="13" fill="#3f5f4b" />
          </g>
        </g>

        <g transform="translate(116 426)">
          <path d="M36 116C37 74 34 45 31 18" stroke="#3f5f4b" strokeWidth="8" strokeLinecap="round" />
          <path d="M32 54C7 53-7 36 3 12C28 13 42 30 32 54Z" fill="#78966f" />
          <path d="M34 81C61 78 76 58 66 34C39 38 26 56 34 81Z" fill="#95b85c" />
          <ellipse cx="36" cy="119" rx="54" ry="13" fill="#b7caa9" opacity="0.48" />
        </g>

        <g transform="translate(586 396)">
          <path d="M34 126C35 89 34 55 28 19" stroke="#3f5f4b" strokeWidth="8" strokeLinecap="round" />
          <path d="M30 58C4 58-10 39 1 13C27 15 41 33 30 58Z" fill="#95b85c" />
          <path d="M33 91C61 88 78 66 67 40C39 44 24 65 33 91Z" fill="#78966f" />
          <ellipse cx="34" cy="129" rx="56" ry="13" fill="#b7caa9" opacity="0.48" />
        </g>

        <g className={styles.artworkNotes}>
          <circle cx="157" cy="94" r="8" fill="#b86f45" />
          <circle cx="692" cy="102" r="7" fill="#3f5f4b" />
          <circle cx="89" cy="390" r="6" fill="#d6a34f" />
        </g>
      </svg>

      <div className={styles.artworkBadgeTop}>
        <span>Available now</span>
        <strong>Focused fretboard drills</strong>
      </div>
      <div className={styles.artworkBadgeBottom}>
        <span>Practice path</span>
        <strong>Notes → chord tones → scale degrees</strong>
      </div>
    </div>
  );
}

type FeatureIconKind =
  | "notes"
  | "intervals"
  | "chords"
  | "degrees"
  | "patterns"
  | "focus";

export function FeatureIcon({ kind }: { kind: FeatureIconKind }) {
  if (kind === "notes") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M29 8V31" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M29 10L39 7V28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="23" cy="34" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="33" cy="31" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
      </svg>
    );
  }

  if (kind === "intervals") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M10 12H38M10 24H38M10 36H38" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.46" />
        <circle cx="15" cy="12" r="5" fill="currentColor" />
        <circle cx="33" cy="36" r="5" fill="currentColor" />
        <path d="M18 16L30 32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 5" />
      </svg>
    );
  }

  if (kind === "chords") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M11 9V39M24 9V39M37 9V39M8 16H40M8 27H40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.48" />
        <circle cx="11" cy="16" r="5" fill="currentColor" />
        <circle cx="24" cy="27" r="5" fill="currentColor" />
        <circle cx="37" cy="16" r="5" fill="currentColor" />
      </svg>
    );
  }

  if (kind === "degrees") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="24" cy="24" r="5" fill="currentColor" />
        <path d="M24 8V14M40 24H34M24 40V34M8 24H14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "patterns") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M9 34C16 34 14 14 23 14C31 14 29 34 39 34" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="9" cy="34" r="4" fill="currentColor" />
        <circle cx="23" cy="14" r="4" fill="currentColor" />
        <circle cx="39" cy="34" r="4" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="25" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M24 25L31 19M19 6H29M24 6V10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M23 39C21 32 18 27 12 23C12 32 16 38 23 39ZM26 39C28 31 33 26 40 23C40 33 35 39 26 39Z" fill="currentColor" opacity="0.72" />
    </svg>
  );
}

export function PracticePreview() {
  return (
    <div className={styles.practicePreview} aria-label="Preview of the current FretGarden practice experience">
      <div className={styles.previewTopbar}>
        <div className={styles.previewBrand}>
          <img src="/brand/fretgarden-icon.svg" width="30" height="30" alt="" />
          <strong>FretGarden Practice</strong>
        </div>
        <span>Local demo</span>
      </div>

      <div className={styles.previewBody}>
        <aside className={styles.previewSidebar}>
          <span className={styles.previewSidebarTitle}>Choose a drill</span>
          <button type="button" className={styles.previewSelected} tabIndex={-1}>
            Note recognition
          </button>
          <button type="button" tabIndex={-1}>Chord tones</button>
          <button type="button" tabIndex={-1}>Scale degrees</button>
          <div className={styles.previewProgress}>
            <span>Session</span>
            <strong>3 / 8</strong>
            <div><i /></div>
          </div>
        </aside>

        <div className={styles.previewWorkspace}>
          <div className={styles.previewPrompt}>
            <span>Find this note</span>
            <strong>C</strong>
            <small>Choose every C on the fretboard.</small>
          </div>

          <div className={styles.previewFretboard} aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map((string) => (
              <div className={styles.previewString} key={string}>
                {[0, 1, 2, 3, 4, 5, 6].map((fret) => (
                  <span
                    className={fret === 2 && (string === 1 || string === 5) ? styles.previewNote : undefined}
                    key={fret}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className={styles.previewFeedback}>
            <span>Keep going</span>
            <strong>Two correct positions found.</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FounderGardenArtwork() {
  return (
    <div className={styles.founderArtwork} aria-hidden="true">
      <svg viewBox="0 0 520 520" role="presentation">
        <circle cx="260" cy="260" r="218" fill="#fffaf1" stroke="#dfd0ba" strokeWidth="4" />
        <path d="M91 360C154 311 218 320 278 354C344 391 397 372 442 336V448H91V360Z" fill="#e4eddc" />
        <rect x="102" y="174" width="316" height="142" rx="28" fill="#2f4537" />
        {[198, 218, 238, 258, 278, 298].map((y) => (
          <path key={y} d={`M122 ${y}H398`} stroke="#f8f0e2" strokeWidth="3" strokeLinecap="round" opacity="0.76" />
        ))}
        {[166, 222, 278, 334].map((x) => (
          <path key={x} d={`M${x} 190V300`} stroke="#78966f" strokeWidth="4" strokeLinecap="round" />
        ))}
        <circle cx="222" cy="238" r="9" fill="#d6a34f" />
        <circle cx="334" cy="278" r="9" fill="#b86f45" />
        <path d="M260 348V248" stroke="#3f5f4b" strokeWidth="10" strokeLinecap="round" />
        <path d="M260 276C260 239 287 214 324 214C324 251 297 276 260 276Z" fill="#95b85c" />
        <path d="M260 306C260 269 233 244 196 244C196 281 223 306 260 306Z" fill="#78966f" />
        <circle cx="260" cy="363" r="35" fill="#fffaf1" stroke="#dfd0ba" strokeWidth="3" />
        <circle cx="260" cy="363" r="14" fill="#3f5f4b" />
        <path d="M167 124C176 103 196 88 220 84" fill="none" stroke="#d6a34f" strokeWidth="7" strokeLinecap="round" />
        <path d="M352 105C375 112 393 128 402 149" fill="none" stroke="#b86f45" strokeWidth="7" strokeLinecap="round" />
      </svg>
    </div>
  );
}
