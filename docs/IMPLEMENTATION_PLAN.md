# Implementation checklist

Status values: NOT_STARTED, IN_PROGRESS, BLOCKED, IMPLEMENTED, VERIFIED. Features stay IMPLEMENTED until the configured services and acceptance checks have been exercised end to end.

| Requirement | Status | Implementation | Notes |
|---|---|---|---|
| Home and navigation | IMPLEMENTED | `client/src/App.jsx` | Landing, create, archive, investigation, results and not-found routes. |
| Create mystery | IMPLEMENTED | Client and `server/src/app.js` | Premise validation, category, difficulty, suspect count, loading and error states. |
| Gemini generation | IMPLEMENTED | `server/src/services/mystery.service.js` | JSON generation, output normalization, bounded retries, 3.8 primary and 3.6 fallback. |
| Case consistency | IMPLEMENTED | Generation validator | Unique IDs, suspect/evidence references, solution clues and exactly three hints. Human mystery-quality review remains. |
| Private solution and hints | IMPLEMENTED | `server/src/models/MysteryCase.js`, API serializers | Solution and unrevealed hints are excluded from public case/clue payloads. |
| Clue discovery | IMPLEMENTED | `POST /api/cases/:id/clues/:clueId/discover` | Awards 5 points once per clue per session. |
| Progressive hints | IMPLEMENTED | `POST /api/cases/:id/hints`, client hint panel | Three ordered hints, persist revealed hints, 10-point deduction per use. |
| Investigation room | IMPLEMENTED | `client/src/App.jsx` | Suspects, evidence, structured chats, image/CCTV fallbacks, timeline, notes and progress. |
| Accusation and scoring | IMPLEMENTED | `POST /api/cases/:id/accuse` | Backend determines verdict and score; repeat submission returns saved result. |
| Results page | IMPLEMENTED | `/case/:id/result` | Verdict, culprit, explanation, reasoning, score breakdown, clue links and new-case CTA. |
| Case history | IMPLEMENTED | Client and API | Session-owned list, reopen, archive. |
| Deployment configuration | IMPLEMENTED | `client/vercel.json`, `render.yaml`, README | Deploy-ready configuration; live deployment not performed. |
| Acceptance AC-01–AC-15 | IN_PROGRESS | Client, server, docs | Requires live provider/database run and full verification. |

## Remaining before release

- Exercise Gemini 3.8/3.6 generation with a currently available API quota and manually review mystery solvability.
- Run a full MongoDB-backed flow: create, discover clues, request hints, accuse, retrieve result, and verify score persistence.
- Configure MongoDB Atlas network access and production secrets; deploy API and frontend, then verify the live workflow.
- Add account authentication or complete the production security review for anonymous session ownership.
- Test accessibility, keyboard operation, and responsive layouts at the supported widths.
