"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "../../lib/supabase/client";
import styles from "./marketing.module.css";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setStatus("Enter the email address for your FretGarden account.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(
        trimmedEmail,
        {
          redirectTo: `${window.location.origin}/auth/callback?next=/update-password`
        }
      );

      if (error) {
        setStatus(error.message);
        return;
      }

      setEmail("");
      setStatus(
        "If that email belongs to a FretGarden account, a password reset link is on the way."
      );
    } catch (error) {
      console.error("FretGarden password reset failed:", error);
      setStatus("Password reset failed. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fieldGroup}>
        <label htmlFor="reset-email">Email address</label>
        <input
          autoComplete="email"
          disabled={isSubmitting}
          id="reset-email"
          inputMode="email"
          name="email"
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setStatus("");
          }}
        />
      </div>

      <button
        className={styles.submitButton}
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Sending reset link..." : "Send reset link"}
      </button>

      {status ? (
        <div className={styles.formStatus} role="status" aria-live="polite">
          {status}
        </div>
      ) : null}
    </form>
  );
}
