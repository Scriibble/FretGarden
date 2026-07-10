FretGarden
FretGarden is an interactive platform for learning guitar, bass, and music theory through structured lessons, intelligent practice tools, and long-term progress tracking. The project is designed to make learning an instrument engaging for complete beginners while still providing enough depth for experienced musicians.
Status: Active Development (Pre-Release)

Note: this README describes the long-term product direction. For the current
repository state after the restore, see `docs/CURRENT_STATUS.md`.

Vision
Learning an instrument is often fragmented across YouTube videos, tabs, PDFs, and random practice routines. FretGarden aims to bring everything together into one cohesive learning experience.
The long-term goal is to provide a curriculum that teaches:
* Guitar fundamentals
* Bass fundamentals
* Music theory
* Ear training
* Rhythm training
* Technique development
* Guided practice sessions
* Performance tracking

Planned Features
Instrument Courses
* Beginner to advanced guitar curriculum
* Beginner to advanced bass curriculum
* Progressive lesson paths
* Interactive exercises
* Video demonstrations
Music Theory Engine
* Interactive theory lessons
* Chord construction
* Scale generation
* Interval recognition
* Circle of Fifths
* Functional harmony
* Quiz system
Practice Tools
* Daily practice planner
* Practice timer
* Goal tracking
* Streaks
* Custom routines
* Progress analytics
Ear Training
* Interval recognition
* Chord identification
* Scale recognition
* Rhythm exercises
* Pitch matching
Fretboard Trainer
* Note memorization
* Scale visualization
* Chord visualization
* Position trainer
* Timed challenges
Rhythm Training
* Metronome
* Rhythm reading
* Timing exercises
* Tempo progression
User Accounts
* Secure authentication
* Cloud sync
* Saved progress
* Practice history
* Achievement tracking

Technology Stack
Current development is focused on a modern TypeScript-based architecture.
* TypeScript
* pnpm Workspace
* Vitest
* Node.js
Additional technologies will be introduced as development progresses.

Repository Structure
/
├── apps/
├── packages/
├── docs/
├── package.json
└── README.md

*Getting Started*

Prerequisites
* Node.js 22+
* pnpm 11+
Installation
Clone the repository:
git clone https://github.com/<your-username>/pocket-practice.git
Enter the project directory:
cd pocket-practice
Install dependencies:
pnpm install
Start the development server:
pnpm dev

Available Commands
pnpm dev
Runs the development environment.
pnpm build
Builds all workspace packages.
pnpm test
Runs the test suite.
pnpm lint
Runs linting across the workspace.
pnpm typecheck
Runs TypeScript type checking.

Project Roadmap
* Project planning
* UI/UX design
* Core application architecture
* Music Theory Engine
* Instrument Lesson Engine
* Practice Session Engine
* Progress Tracking
* Ear Training
* Fretboard Trainer
* Mobile responsiveness
* Public beta
* Version 1.0

Contributing
FretGarden is currently under active development. Contributions, feature requests, and bug reports will be welcomed once the project reaches its first public milestone.

License
License information will be added before the first public release.

Acknowledgements
FretGarden is built with the goal of making high-quality music education more accessible by combining structured learning, modern software, and thoughtful user experience into a single platform.
