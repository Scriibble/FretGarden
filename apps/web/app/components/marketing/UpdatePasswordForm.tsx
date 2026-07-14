"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "../../lib/supabase/client";
import styles from "./marketing.module.css";

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setStatus("Use at least eight characters with a letter and a number.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setStatus(error.message);
        return;
      }

      setPassword("");
      setConfirmPassword("");
      setStatus("Your password has been updated. You can return to your account.");
    } catch (error) {
      console.error("FretGarden password update failed:", error);
      setStatus("Password update failed. Use the latest reset link and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fieldGroup}>
        <label htmlFor="new-password">New password</label>
        <input
          autoComplete="new-password"
          disabled={isSubmitting}
          id="new-password"
          name="password"
          placeholder="Create a new password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setStatus("");
          }}
        />
        <span className={styles.fieldHint}>
          At least eight characters, including a letter and a number.
        </span>
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="confirm-new-password">Confirm new password</label>
        <input
          autoComplete="new-password"
          disabled={isSubmitting}
          id="confirm-new-password"
          name="confirmPassword"
          placeholder="Enter it again"
          type="password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setStatus("");
          }}
        />
      </div>

      <button
        className={styles.submitButton}
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Updating password..." : "Update password"}
      </button>

      {status ? (
        <div className={styles.formStatus} role="status" aria-live="polite">
          {status}
        </div>
      ) : null}
    </form>
  );
}
