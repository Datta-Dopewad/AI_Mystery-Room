# AI_Mystery-Room

Fictional mystery investigations powered by Gemini. Players create a premise, inspect suspects and clues, request progressive hints, make one accusation, and receive a backend-calculated verdict and score.

## Project

- `client/`: React + Vite responsive web app
- `server/`: Express + MongoDB/Mongoose API, Gemini integration, validation and scoring
- [`SPEC.md`](SPEC.md): current source of truth; the original specification is preserved with the gameplay addendum
- `docs/IMPLEMENTATION_PLAN.md`: implementation status and release checklist

## Local setup

Requires Node.js 20+, npm, MongoDB (local or Atlas), and a Google Gemini API key.

1. Copy `server/.env.example` to `server/.env`; configure `MONGODB_URI`, `GEMINI_API_KEY`, `GEMINI_MODEL`, and `CLIENT_ORIGIN`.
2. Copy `client/.env.example` to `client/.env` if the API is not at `http://localhost:5000`.
3. Install packages: `npm install`, `npm install --prefix server`, and `npm install --prefix client`.
4. Start the API with `npm run dev --prefix server` and the client with `npm run dev --prefix client` (or use root `npm run dev`).
5. Open `http://localhost:5173`.

The Gemini key is server-only. There is no fake case fallback when Gemini or MongoDB is unavailable. The browser session ID scopes private cases and progress; this is a local/controlled anonymous-play setup, not production account authentication.

## Gameplay and security

- Case output is schema and reference validated before persistence.
- The culprit, solution, and undisclosed hints are excluded from public case and clue responses.
- The server awards 5 points per clue discovered once, deducts 10 points per hint used, and gives correct accusations difficulty bonuses of Easy 100, Medium 150, Hard 200. Final score cannot fall below zero.
- Hints are revealed one at a time, up to three; one accusation is allowed per case session.
- Generated content is fictional. CCTV views are labeled simulated. Scenario text is sent to Google Gemini; do not submit sensitive real-world information.

## API

The gameplay API is under `/api/cases`: `POST /api/cases`, `GET /api/cases/:id`, `POST /api/cases/:id/clues/:clueId/discover`, `POST /api/cases/:id/hints`, `POST /api/cases/:id/accuse`, and `GET /api/cases/:id/result`. Routes require `X-Session-Id`. Legacy `/api/v1/mysteries` endpoints remain for progress/evidence compatibility.

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the step-by-step walkthrough using Vercel, Render, MongoDB Atlas, and Gemini. The repository includes a Render Blueprint and Vercel SPA rewrite. Deployment is not verified until the full create → investigate → hint → accuse → results flow works on the live site.

