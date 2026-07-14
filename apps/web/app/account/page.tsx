import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MarketingShell } from "../components/marketing/MarketingShell";
import { ProfileForm } from "../components/marketing/ProfileForm";
import { createClient } from "../lib/supabase/server";
import styles from "../components/marketing/marketing.module.css";

export const metadata: Metadata = {
  title: "Account",
  description:
    "View your FretGarden account and current practice-progress status."
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.display_name ?? user.user_metadata.display_name ?? "FretGarden player";

  return (
    <MarketingShell activePage="account">
      <section className={styles.signupSection} aria-labelledby="account-title">
        <div className={styles.signupGrid}>
          <div className={styles.signupCopy}>
            <span className={styles.eyebrow}>Your account</span>
            <h1 id="account-title">A steady place to grow from.</h1>
            <p>
              Your FretGarden account is active. The next development pass will
              connect this account to saved practice progress, lesson state, and
              cross-device history.
            </p>

            <div className={styles.previewNotice}>
              <div>
                <strong>Cloud sync is not live yet.</strong>
                Drill history, lesson progress, and presets still use this
                browser&apos;s local storage for now.
              </div>
            </div>

            <Link className={styles.textCta} href="/practice">
              Continue practicing
            </Link>
            <Link className={styles.textCta} href="/account-notice">
              Read the early account notice.
            </Link>
          </div>

          <aside className={styles.signupCard}>
            <div className={styles.signupCardHeader}>
              <h2>Account details</h2>
              <p>This confirms that Supabase authentication is connected.</p>
            </div>

            <dl className={styles.accountDetails}>
              <div>
                <dt>Display name</dt>
                <dd>{displayName}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{user.email ?? "No email available"}</dd>
              </div>
              <div>
                <dt>Progress sync</dt>
                <dd>Planned</dd>
              </div>
            </dl>

            <div className={styles.accountFormSection}>
              <div className={styles.signupCardHeader}>
                <h2>Edit profile</h2>
                <p>Update the display name saved with your profile.</p>
              </div>
              <ProfileForm initialDisplayName={displayName} />
            </div>

            <form action="/auth/signout" method="post">
              <button className={styles.submitButton} type="submit">
                Sign out
              </button>
            </form>
          </aside>
        </div>
      </section>
    </MarketingShell>
  );
}
