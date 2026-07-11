"use client";

import { useState, type FormEvent } from "react";
import styles from "./marketing.module.css";


type FormValues = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreement: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreement: false
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const trimmedName = values.displayName.trim();
  const trimmedEmail = values.email.trim();

  if (trimmedName.length < 2) {
    errors.displayName = "Enter at least two characters for your display name.";
  }

  if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  if (values.password.length < 8 || !/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
    errors.password = "Use at least eight characters with a letter and a number.";
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "The passwords do not match.";
  }

  if (!values.agreement) {
    errors.agreement = "Confirm that you understand this is a signup preview.";
  }

  return errors;
}

export function SignupForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("Review the highlighted fields before continuing.");
      return;
    }

    setValues((current) => ({
      ...current,
      password: "",
      confirmPassword: ""
    }));
    setStatus(
      "Account creation is not connected yet. Nothing was transmitted or stored. This form is ready to be connected to authentication when that work begins."
    );
  }

  const passwordType = showPassword ? "text" : "password";

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fieldGroup}>
        <label htmlFor="display-name">Display name</label>
        <input
          autoComplete="nickname"
          id="display-name"
          name="displayName"
          placeholder="How your name will appear"
          type="text"
          value={values.displayName}
          aria-invalid={Boolean(errors.displayName)}
          aria-describedby={errors.displayName ? "display-name-error" : undefined}
          onChange={(event) => updateField("displayName", event.target.value)}
        />
        {errors.displayName ? (
          <span className={styles.fieldError} id="display-name-error">
            {errors.displayName}
          </span>
        ) : null}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="signup-email">Email address</label>
        <input
          autoComplete="email"
          id="signup-email"
          inputMode="email"
          name="email"
          placeholder="you@example.com"
          type="email"
          value={values.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "signup-email-error" : undefined}
          onChange={(event) => updateField("email", event.target.value)}
        />
        {errors.email ? (
          <span className={styles.fieldError} id="signup-email-error">
            {errors.email}
          </span>
        ) : null}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="signup-password">Password</label>
        <div className={styles.passwordRow}>
          <input
            autoComplete="new-password"
            id="signup-password"
            name="password"
            placeholder="Create a password"
            type={passwordType}
            value={values.password}
            aria-invalid={Boolean(errors.password)}
            aria-describedby="password-requirements signup-password-error"
            onChange={(event) => updateField("password", event.target.value)}
          />
          <button
            className={styles.passwordToggle}
            type="button"
            aria-pressed={showPassword}
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <span className={styles.fieldHint} id="password-requirements">
          At least eight characters, including a letter and a number.
        </span>
        {errors.password ? (
          <span className={styles.fieldError} id="signup-password-error">
            {errors.password}
          </span>
        ) : null}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="confirm-password">Confirm password</label>
        <input
          autoComplete="new-password"
          id="confirm-password"
          name="confirmPassword"
          placeholder="Enter it again"
          type={passwordType}
          value={values.confirmPassword}
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
          onChange={(event) => updateField("confirmPassword", event.target.value)}
        />
        {errors.confirmPassword ? (
          <span className={styles.fieldError} id="confirm-password-error">
            {errors.confirmPassword}
          </span>
        ) : null}
      </div>

      <div className={styles.checkboxField}>
        <input
          checked={values.agreement}
          id="preview-agreement"
          name="agreement"
          type="checkbox"
          aria-invalid={Boolean(errors.agreement)}
          aria-describedby={errors.agreement ? "preview-agreement-error" : undefined}
          onChange={(event) => updateField("agreement", event.target.checked)}
        />
        <div>
          <label htmlFor="preview-agreement">
            I understand this is a preview and that no account, password, or profile will be saved yet.
          </label>
          {errors.agreement ? (
            <div className={styles.fieldError} id="preview-agreement-error">
              {errors.agreement}
            </div>
          ) : null}
        </div>
      </div>

      <button className={styles.submitButton} type="submit">
        Preview account creation
      </button>

      {status ? (
        <div className={styles.formStatus} role="status" aria-live="polite">
          {status}
        </div>
      ) : null}

      <p className={styles.formFooter}>
        Already have a future account? <strong>Sign in will be added with authentication.</strong>
      </p>
    </form>
  );
}
