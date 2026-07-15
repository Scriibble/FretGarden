# FretGarden Privacy Policy

Effective date: July 15, 2026

FretGarden is an early-access, local-first guitar practice application. This policy explains what information the current application uses and what is still planned.

This document is a practical product policy draft, not legal advice. It should be reviewed before a broad public launch.

## What FretGarden Collects

### Account information

If you create an account, FretGarden uses Supabase Auth to handle sign-up, sign-in, email confirmation, password reset, and session management. The app stores a profile row containing your user ID and optional display name.

Do not use sensitive personal information as your display name.

### Local practice information

Lesson progress, drill history, weak spots, practice presets, curriculum progress, and pilot evidence are currently stored in your browser's `localStorage`. This data stays on the device/browser where it was created unless you export it or share screenshots or feedback.

FretGarden does not currently sync practice progress across devices.

### Tester feedback

If you participate in testing, you may voluntarily submit survey responses about accessibility, usability, lesson clarity, and learning experience. Those responses are used to improve FretGarden and to support release-readiness evidence.

Avoid submitting private health, financial, or sensitive personal information in tester surveys.

### Waitlist information

If the waitlist is enabled, your email address and source page may be sent to a private webhook or email-list provider configured by the project owner.

## What FretGarden Does Not Currently Collect

The current app does not require microphone access, camera access, audio uploads, video uploads, payment information, subscriptions, social profiles, or cloud practice history.

## How Information Is Used

FretGarden uses information to:

- create and maintain account access;
- display and update your profile name;
- keep local practice state available in the current browser;
- troubleshoot early-access issues;
- improve lesson clarity, accessibility, and usability;
- understand whether the product is ready for broader testing or release.

## Third-Party Services

FretGarden currently relies on:

- Supabase for authentication and profile storage;
- Vercel or another hosting provider if the app is deployed;
- an optional waitlist provider or webhook;
- Google Forms or another survey tool if you choose to submit tester feedback.

Those services process information under their own policies.

## Local Storage And Resetting Data

Because practice progress is local-first, clearing browser storage can remove local lesson progress, drill history, presets, and pilot evidence from that browser.

The app may provide reset controls for testing. Resetting local progress does not delete Supabase account data.

## Data Sharing

FretGarden does not sell personal information. Tester feedback may be summarized in internal release-readiness notes. Direct quotes should be anonymized unless the tester explicitly agrees to attribution.

## Children's Privacy

FretGarden is not currently intended for unsupervised use by children. Test participation by minors should occur only with parent or guardian involvement.

## Security

FretGarden uses Supabase Auth for account access and row-level security for profile rows. No system can guarantee perfect security, especially during early access. Report security or privacy concerns to the project owner.

## Changes

This policy may change as FretGarden adds cloud sync, production persistence, analytics, subscriptions, or other features. Material changes should be reviewed before broader release.

## Contact

For privacy questions during early access, contact the FretGarden project owner, Evan Anderson.
