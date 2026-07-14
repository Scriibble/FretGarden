# Pocket.Practice Demo Test Plan

Use this when sharing the current local-first MVP with a few testers.

## Demo Goal

Validate whether a new learner understands the first practice loop without explanation:

1. Start with the first lesson.
2. Complete note recognition.
3. Try chord tones.
4. Try scale degrees.
5. Notice that local progress updates.

This demo includes basic account creation/sign-in, but it intentionally does
not include cloud progress sync, audio, payments, or advanced backend features.

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

The practice loop can be demoed without signing in because progress is
browser-local. Account creation and sign-in require Supabase environment
variables and a configured Supabase project.

Recommended path:

1. Push the current branch to GitHub.
2. Import the repo into Vercel.
3. Use `apps/web` as the project root directory.
4. Use the settings in `docs/VERCEL_DEPLOYMENT.md`.
5. Share the Vercel preview URL with testers.

Tester caveat: progress is stored only in each browser's localStorage. Different devices and browsers will not share progress.

Account caveat: an account can be created and confirmed, but it will not yet
move drill history, lesson progress, or presets between devices.

## Demo Scope Guardrails

Keep feedback focused on the current playable loop:

- Notes
- Chord tones
- Scale degrees
- Lessons to practice
- Local progress
- Basic account creation/sign-in
- First-time clarity

Do not evaluate deferred roadmap items yet:

- Cloud sync
- Bass
- Audio
- Ear training
- Payments
- Marketplace features
