"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "../../lib/supabase/client";
import styles from "./marketing.module.css";

type ProfileFormProps = {
  initialDisplayName: string;
};

export function ProfileForm({ initialDisplayName }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = displayName.trim();

    if (trimmedName.length < 2) {
      setStatus("Enter at least two characters for your display name.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setStatus("Sign in again before updating your profile.");
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ display_name: trimmedName })
        .eq("id", user.id);

      if (profileError) {
        setStatus(profileError.message);
        return;
      }

      await supabase.auth.updateUser({
        data: {
          display_name: trimmedName
        }
      });

      setDisplayName(trimmedName);
      setStatus("Your display name has been updated.");
    } catch (error) {
      console.error("FretGarden profile update failed:", error);
      setStatus("Profile update failed. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fieldGroup}>
        <label htmlFor="profile-display-name">Display name</label>
        <input
          autoComplete="nickname"
          disabled={isSubmitting}
          id="profile-display-name"
          name="displayName"
          placeholder="How your name will appear"
          type="text"
          value={displayName}
          onChange={(event) => {
            setDisplayName(event.target.value);
            setStatus("");
          }}
        />
      </div>

      <button
        className={styles.submitButton}
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Saving profile..." : "Save profile"}
      </button>

      {status ? (
        <div className={styles.formStatus} role="status" aria-live="polite">
          {status}
        </div>
      ) : null}
    </form>
  );
}
