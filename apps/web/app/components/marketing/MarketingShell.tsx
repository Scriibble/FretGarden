import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./marketing.module.css";

type MarketingPage = "home" | "about" | "signup";

type MarketingShellProps = {
  activePage: MarketingPage;
  children: ReactNode;
};

const navigation = [
  { key: "home" as const, href: "/", label: "Home" },
  { key: "about" as const, href: "/about", label: "About Me" },
  { key: "signup" as const, href: "/signup", label: "Sign Up" }
];

export function MarketingShell({ activePage, children }: MarketingShellProps) {
  return (
    <div className={styles.site}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>

      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/" aria-label="FretGarden home">
            <img
              src="/brand/fretgarden-icon.svg"
              width="44"
              height="44"
              alt=""
            />
            <span>
              <strong>FretGarden</strong>
              <small>Grow your fretboard fluency</small>
            </span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {navigation.map((item) => (
              <Link
                className={styles.navLink}
                href={item.href}
                key={item.key}
                aria-current={activePage === item.key ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Link className={styles.appButton} href="/practice">
              Open App
            </Link>
          </nav>

          <details className={styles.mobileMenu}>
            <summary>Menu</summary>
            <nav aria-label="Mobile navigation">
              {navigation.map((item) => (
                <Link
                  className={styles.mobileNavLink}
                  href={item.href}
                  key={item.key}
                  aria-current={activePage === item.key ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <Link className={styles.mobileAppButton} href="/practice">
                Open App
              </Link>
            </nav>
          </details>
        </div>
      </header>

      <main id="main-content" className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <img
              src="/brand/fretgarden-icon.svg"
              width="48"
              height="48"
              alt=""
            />
            <div>
              <strong>FretGarden</strong>
              <p>
                Focused guitar practice for notes, chord tones, scale degrees,
                and the musical relationships connecting them.
              </p>
            </div>
          </div>

          <nav className={styles.footerNav} aria-label="Footer navigation">
            {navigation.map((item) => (
              <Link href={item.href} key={item.key}>
                {item.label}
              </Link>
            ))}
            <Link href="/practice">Open App</Link>
          </nav>

          <div className={styles.footerMeta}>
            <span>© {new Date().getFullYear()} FretGarden</span>
            <span>Privacy and terms will be published before accounts launch.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
