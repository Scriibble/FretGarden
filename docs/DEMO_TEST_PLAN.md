# Pocket.Practice Demo Test Plan

Use this when sharing the current local-only MVP with a few testers.

## Demo Goal

Validate whether a new learner understands the first practice loop without explanation:

1. Start with the first lesson.
2. Complete note recognition.
3. Try chord tones.
4. Try scale degrees.
5. Notice that local progress updates.

This demo intentionally does not include accounts, cloud sync, audio, payments, or backend features.

## Before Sharing

Run these checks from the repo root:

```bash
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

For local testing, start the app with:

```bash
pnpm --filter @pocket-practice/web dev --hostname 127.0.0.1 --port 3000
```

Then open `http://127.0.0.1:3000`.

## Tester Script

Ask each tester to do this without coaching:

1. Open the app.
2. Use the "Start here" card to open the first lesson.
3. Start the paired practice drill.
4. Finish the note-recognition drill.
5. Return to the Practice Hub and try chord tones.
6. Try scale degrees.
7. Look at the progress and checklist areas.
8. Use "Reset local demo progress" before the next tester uses the same browser.

## Feedback Questions

Use a short Google Form, Notion form, or direct notes with these questions:

1. What did you think you were supposed to do first?
2. Where did you hesitate or get confused?
3. Which drill felt most useful?
4. Which drill felt least clear?
5. Did the fretboard interaction make sense?
6. Did the progress/checklist feel motivating or unnecessary?
7. Did anything break, overlap, or feel slow?
8. Would you use this for five minutes of practice again?

## Temporary Deployment Notes

The app can be demoed as a static-ish Next app without backend setup because progress is browser-local.

Recommended path:

1. Push the current branch to GitHub.
2. Import the repo into Vercel.
3. Use the root as the project directory.
4. Use the settings in `docs/VERCEL_DEPLOYMENT.md`.
5. Share the Vercel preview URL with testers.

Tester caveat: progress is stored only in each browser's localStorage. Different devices and browsers will not share progress.

## Demo Scope Guardrails

Keep feedback focused on the current playable loop:

- Notes
- Chord tones
- Scale degrees
- Lessons to practice
- Local progress
- First-time clarity

Do not evaluate deferred roadmap items yet:

- Accounts
- Cloud sync
- Bass
- Audio
- Ear training
- Payments
- Marketplace features
