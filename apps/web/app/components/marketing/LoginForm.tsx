"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "../../lib/supabase/client";
import styles from "./marketing.module.css";

type LoginFormProps = {
  initialStatus?: string;
};

export function LoginForm({ initialStatus = "" }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setStatus("Enter your email and password to sign in.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password
      });

      if (error) {
        setStatus(error.message);
        return;
      }

      window.location.assign("/account");
    } catch (error) {
      console.error("FretGarden sign in failed:", error);
      setStatus("Sign in failed. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fieldGroup}>
        <label htmlFor="login-email">Email address</label>
        <input
          autoComplete="email"
          disabled={isSubmitting}
          id="login-email"
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

      <div className={styles.fieldGroup}>
        <label htmlFor="login-password">Password</label>
        <input
          autoComplete="current-password"
          disabled={isSubmitting}
          id="login-password"
          name="password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setStatus("");
          }}
        />
      </div>

      <button
        className={styles.submitButton}
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      {status ? (
        <div className={styles.formStatus} role="status" aria-live="polite">
          {status}
        </div>
      ) : null}

      <p className={styles.formFooter}>
        New to FretGarden? <a href="/signup">Create an account</a>
      </p>
    </form>
  );
}
