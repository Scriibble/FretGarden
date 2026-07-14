import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "../components/marketing/LoginForm";
import { MarketingShell } from "../components/marketing/MarketingShell";
import styles from "../components/marketing/marketing.module.css";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your FretGarden account and return to your practice space."
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

const loginMessages: Record<string, string> = {
  confirmation_failed:
    "Email confirmation could not be completed. Sign in or request a new confirmation email.",
  missing_confirmation_code:
    "The confirmation link was missing a code. Try signing in or use the latest email from FretGarden."
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const initialStatus = params.error ? (loginMessages[params.error] ?? "") : "";

  return (
    <MarketingShell activePage="login">
      <section className={styles.signupSection} aria-labelledby="login-title">
        <div className={styles.signupGrid}>
          <div className={styles.signupCopy}>
            <span className={styles.eyebrow}>Welcome back</span>
            <h1 id="login-title">Return to your practice garden.</h1>
            <p>
              Sign in to confirm your FretGarden account and reach your account
              space. Practice history still lives in this browser while cloud
              progress sync is being built.
            </p>

            <div className={styles.previewNotice}>
              <div>
                <strong>Account access is early.</strong>
                Your account can be created and confirmed now. Saved
                cross-device practice progress will arrive in a later sync
                pass.
              </div>
            </div>

            <Link className={styles.textCta} href="/practice">
              Open the practice app without signing in.
            </Link>
            <Link className={styles.textCta} href="/forgot-password">
              Reset a forgotten password.
            </Link>
          </div>

          <div className={styles.signupCard}>
            <div className={styles.signupCardHeader}>
              <h2>Sign in to FretGarden</h2>
              <p>Use the email and password from your account setup.</p>
            </div>
            <LoginForm initialStatus={initialStatus} />
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
