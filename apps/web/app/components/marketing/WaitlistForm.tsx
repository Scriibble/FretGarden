"use client";

import { useId, useState, type FormEvent } from "react";
import styles from "./marketing.module.css";

type WaitlistFormProps = {
  source: string;
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WaitlistForm({ source }: WaitlistFormProps) {
  const emailId = useId();
  const errorId = useId();
  const statusId = useId();
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setEmailError("Enter a valid email address.");
      setStatus("");
      setSubmissionState("error");
      return;
    }

    setEmailError("");
    setStatus("");
    setSubmissionState("submitting");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: normalizedEmail,
          source,
          website
        })
      });

      const result = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          result?.error ?? "The email list could not be reached. Please try again."
        );
      }

      setEmail("");
      setWebsite("");
      setSubmissionState("success");
      setStatus(
        result?.message ??
          "You’re on the FretGarden email list. Watch your inbox for future development updates."
      );
    } catch (error) {
      setSubmissionState("error");
      setStatus(
        error instanceof Error
          ? error.message
          : "The email list could not be reached. Please try again."
      );
    }
  }

  const isSubmitting = submissionState === "submitting";
  const describedBy = [emailError ? errorId : null, status ? statusId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <form className={styles.waitlistForm} onSubmit={handleSubmit} noValidate>
      <div className={styles.waitlistInputRow}>
        <div className={styles.waitlistField}>
          <label htmlFor={emailId}>Email address</label>
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            aria-invalid={Boolean(emailError)}
            aria-describedby={describedBy || undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError("");
              setStatus("");
              setSubmissionState("idle");
            }}
          />
          {emailError ? (
            <span className={styles.waitlistError} id={errorId}>
              {emailError}
            </span>
          ) : null}
        </div>

        <button
          className={styles.waitlistButton}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Joining…" : "Join the email list"}
        </button>
      </div>

      <div className={styles.waitlistHoneypot} aria-hidden="true">
        <label htmlFor={`${emailId}-website`}>Website</label>
        <input
          id={`${emailId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <p className={styles.waitlistConsent}>
        Receive occasional FretGarden updates. You
        can unsubscribe at any time.
      </p>

      {status ? (
        <div
          className={styles.waitlistStatus}
          data-state={submissionState}
          id={statusId}
          role="status"
          aria-live="polite"
        >
          {status}
        </div>
      ) : null}
    </form>
  );
}
