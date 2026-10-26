# AI MYSTERY ROOM
## Software Requirements Specification (SRS) and Single Source of Truth

**Document Type:** Spec-Driven Development Specification  
**Project Name:** AI Mystery Room  
**Application Type:** AI-Powered Interactive Mystery Investigation Web Application  
**Frontend:** React.js  
**Backend:** Node.js + Express.js  
**Database:** MongoDB  
**AI Provider:** Google Gemini API  
**Primary Development Tool:** OpenAI Codex  
**Architecture:** MERN Stack  
**Specification Version:** 1.0  
**Status:** Initial Development Specification

---

# 1. PROJECT OVERVIEW

## 1.1 Project Description

AI Mystery Room is an AI-powered web application that allows users to create and solve fictional mystery investigations.

The user provides a short scenario, story, or mystery idea. The backend uses Google Gemini to transform that input into a complete fictional investigation containing a mystery, suspects, evidence, a culprit, and a solution.

Users investigate the case by examining AI-generated evidence, such as:

- WhatsApp-style conversations.
- Suspect profiles and statements.
- Photographs and visual clues.
- Fictional CCTV recordings or simulated CCTV footage.
- Timelines of events.
- Location records.
- Call logs and message histories.
- Witness statements.
- Investigation reports.
- Contradictions and hidden clues.

After investigating the evidence, the user selects the person they believe committed the fictional crime.

The application evaluates the user's answer against the predetermined solution and explains whether the answer is correct, which clues support the conclusion, and how the investigation can be solved.

The entire experience should feel like an interactive detective investigation.

## 1.2 Core Concept

**User Story → AI Case Generation → Evidence Investigation → Culprit Selection → Case Evaluation → Final Explanation**

The application must generate a solvable mystery rather than a random collection of unrelated clues.

Every case must have one predetermined culprit unless a future version explicitly supports multiple culprits.

The evidence must be consistent with the case's timeline and solution. The culprit must be identifiable through reasoning, contradictions, and evidence rather than arbitrary guessing.

## 1.3 Product Goals

1. Allow users to create fictional mysteries from their own ideas.
2. Generate complete investigations using Google Gemini.
3. Present evidence through an interactive investigation interface.
4. Encourage logical reasoning, observation, and deduction.
5. Keep users engaged through mystery-solving gameplay.
6. Generate unique cases from different user scenarios.
7. Support AI-generated text and visual evidence.
8. Provide explanations after the user submits a final answer.
9. Save investigation progress and completed cases.
10. Provide a clean, responsive, modern user interface.

## 1.4 Non-Goals for Version 1.0

The initial release will not include:

- Real police investigations.
- Real-world criminal identification.
- Real WhatsApp account access.
- Real CCTV access or surveillance.
- Real phone call interception.
- Real social media account access.
- Multiplayer investigations.
- User-created public case marketplaces.
- Live video surveillance.
- Paid subscriptions or payment processing unless separately specified.
- Autonomous real-world investigations.

All investigations and generated evidence must be fictional.

---

# 2. PRODUCT SCOPE

## 2.1 Target Users

The application is designed for:

- Mystery enthusiasts.
- Casual gamers.
- Students interested in logical reasoning.
- Users who enjoy detective stories.
- Users who want to create their own fictional investigations.

## 2.2 Main User Journey

1. The user opens the website.
2. The user selects "Create a Mystery".
3. The user enters a short scenario or story.
4. The user configures optional case settings.
5. The frontend submits the request to the backend.
6. The backend validates the input and requests a structured mystery from Gemini.
7. The backend validates the generated case and stores it in MongoDB.
8. The application opens the investigation room.
9. The user examines suspects, evidence, messages, photographs, and the timeline.
10. The user forms a theory and selects a culprit.
11. The backend evaluates the answer.
12. The application displays the result and explanation.
13. The user can review the evidence, restart the case, or create another mystery.

## 2.3 Example Scenario

User input:

"Three employees were present in an office when an important company document disappeared. Each employee has a different explanation of where they were at the time."

Generated investigation:

- Case title: The Missing Blueprint.
- Three suspects with different motives.
- A defined disappearance time.
- A simulated office CCTV observation.
- Fictional chat messages.
- Conflicting witness statements.
- A timeline containing several events.
- Evidence that rules out innocent suspects.
- One culprit whose statements conflict with independently established evidence.

The user must identify the culprit using the available evidence.

The example is illustrative. Actual generated cases should depend on the user's scenario.

---

# 3. TECHNOLOGY STACK

## 3.1 Frontend

Required technologies:

- React.js.
- Vite.
- JavaScript with JSX.
- React Router for client-side navigation.
- Tailwind CSS for styling.
- A reusable component architecture.
- Fetch API or Axios for backend requests.
- A suitable icon library, such as Lucide React.

Use JavaScript consistently for Version 1.0 unless the existing repository already uses TypeScript. Do not introduce a second language or rewrite an established project structure without a documented reason.

### Frontend Responsibilities

- Display the homepage and application navigation.
- Collect the user's mystery scenario.
- Provide optional mystery settings.
- Show generation progress and errors.
- Display investigation rooms.
- Render suspect profiles and evidence.
- Display simulated chat conversations.
- Display image evidence and simulated CCTV evidence.
- Support evidence filtering and opening evidence details.
- Track the user's investigation progress.
- Allow culprit selection and final submission.
- Display results and explanations.
- Show saved cases and case history.
- Provide responsive desktop, tablet, and mobile layouts.

## 3.2 Backend

Required technologies:

- Node.js.
- Express.js.
- MongoDB.
- Mongoose.
- Google Gemini API SDK, using the currently supported official Google Gen AI SDK.
- Environment variables using dotenv.
- Authentication middleware if authentication is implemented.
- Request validation using a schema validation library such as Zod.
- Centralized error handling.
- Structured logging.

### Backend Responsibilities

- Accept and validate requests.
- Authenticate users when required.
- Generate mystery cases using Gemini.
- Validate AI-generated structured output.
- Enforce case consistency and answer integrity.
- Save cases and investigation progress.
- Retrieve cases and evidence.
- Evaluate culprit submissions.
- Manage retries and AI generation failures.
- Enforce ownership and access permissions.
- Protect API credentials.
- Provide the frontend with stable API responses.

## 3.3 Database

Use MongoDB as the primary database.

Mongoose schemas should define the core application data and validation rules.

Primary collections:

1. Users.
2. MysteryCases.
3. InvestigationSessions or CaseProgress, if progress is stored separately.

Evidence, suspects, and timelines should initially be embedded inside their parent mystery case when this keeps retrieval and validation straightforward.

Do not create unnecessary collections for every evidence category.

## 3.4 AI Provider

Provider: Google Gemini.

The backend must call Gemini through a server-side integration.

Requirements:

- The Gemini API key must never be exposed to the frontend.
- The model identifier must be configurable through environment variables.
- Use a Gemini model that is available to the project's configured API account.
- Use structured JSON output where supported.
- Validate all generated content before persistence.
- Handle malformed responses and API failures.
- Set request timeouts and retry limits.
- Use configurable token limits and generation parameters.
- Avoid logging secrets or unnecessary personal information.

Suggested environment variables:

GEMINI_API_KEY  
GEMINI_MODEL  
MONGODB_URI  
PORT  
NODE_ENV  
CLIENT_ORIGIN  
SESSION_SECRET

These are environment variable names, not actual credentials. Never commit real credentials.

## 3.5 AI-Generated Images and Video

Gemini can generate structured mystery content and may support image-generation capabilities depending on the configured model and API access. Do not assume that every Gemini model can directly create images or video.

Implement a provider-independent evidence generation interface.

For Version 1.0:

- Textual evidence must be supported.
- WhatsApp-style chat evidence must be rendered using frontend components from structured text.
- Suspect profiles may use generated fictional avatars or neutral placeholders.
- Image evidence must use a configured image-generation provider or approved placeholder assets.
- CCTV evidence may initially be presented as a simulated footage viewer with a timestamp, fictional scene image, and written observations.
- Actual video generation is optional and must not be required for the core game to work.

The application must never claim that a simulated CCTV viewer is real camera footage.

If image or video generation is unavailable, the case must still be playable using text, timelines, and simulated evidence interfaces.

---

# 4. FUNCTIONAL REQUIREMENTS

## FR-01: Homepage

The homepage must introduce AI Mystery Room and explain its purpose.

Required elements:

- Application logo and name.
- Short description.
- "Create a Mystery" primary action.
- "My Cases" navigation when applicable.
- How It Works section.
- Example investigation preview.
- Footer containing basic application information.

The homepage must not display fabricated user counts, reviews, or other unsupported claims.

## FR-02: Create a Mystery

The user must be able to submit a scenario describing the mystery they want to investigate.

Required fields:

- Scenario description: required.
- Mystery difficulty: optional.
- Number of suspects: optional.
- Mystery category: optional.

Suggested difficulty options:

- Easy.
- Medium.
- Hard.

Suggested categories:

- Theft.
- Missing object.
- Office mystery.
- Historical mystery.
- Fictional murder mystery.
- Cyber mystery.
- Locked-room mystery.
- General mystery.

The system must support user-defined scenarios beyond the listed categories.

Validation rules:

- Reject empty or whitespace-only scenarios.
- Apply configurable minimum and maximum input lengths.
- Default to a manageable scenario length, such as 100–2,000 characters.
- Allow the maximum length to be configured.
- Validate suspect count and other optional values.
- Display clear validation messages.
- Do not start duplicate generation requests because of repeated clicks.

The default number of suspects should be configurable, with a recommended default of four.

## FR-03: AI Mystery Generation

When the user submits a scenario, the backend must generate a complete mystery package.

The generation prompt must instruct Gemini to produce:

1. Case metadata.
2. Case title and introduction.
3. Fictional setting and background.
4. Incident description.
5. A fixed incident timeline.
6. Suspect profiles.
7. Suspect motives, opportunities, and alibis.
8. Evidence items.
9. Fictional message conversations.
10. Witness statements.
11. CCTV or scene observations where relevant.
12. A single predetermined culprit.
13. An internal solution and reasoning chain.
14. A clue-to-solution mapping.
15. A final explanation for the player.

The output must conform to a versioned JSON schema.

The backend must reject cases with missing suspects, invalid references, inconsistent timelines, or missing solutions.

The system should attempt a limited regeneration or repair when the response is malformed. It must stop after a configurable number of attempts.

If generation fails, the user must receive a clear error and an option to retry.

The application must not create a playable case until the case passes validation.

## FR-04: Case Consistency and Solvability

Each generated mystery must satisfy the following conditions:

- Exactly one predetermined culprit.
- Every suspect has a unique identifier.
- Every evidence item has a unique identifier.
- Every evidence item belongs to the correct case.
- Every suspect referenced in evidence exists.
- Every timeline event has a valid timestamp or relative ordering.
- Important events occur in a logically consistent order.
- Evidence must not contradict established facts without a clear explanation.
- At least two independent clues should support the correct conclusion in a standard case.
- Innocent suspects should be reasonably distinguishable from the culprit.
- The solution must be derivable from evidence available to the player.
- The culprit must not be revealed in the initial case description or ordinary evidence views.
- The solution and culprit identifiers must never be returned through public case APIs before submission.

For harder cases, use red herrings that can be explained by the final solution.

The backend should run deterministic validation checks and, where practical, a separate AI-assisted consistency review.

An AI consistency review is a quality check, not a substitute for schema validation.

If the generated case fails validation, regenerate or repair it within configured limits. If it still fails, return an error rather than publishing a broken case.

## FR-05: Investigation Room

The investigation room is the primary gameplay interface.

Required sections:

- Case overview.
- Incident details.
- Suspect list.
- Evidence board.
- Timeline.
- Investigation notes.
- Culprit selection.
- Submit answer action.

Suggested desktop layout:

- Left sidebar: suspects and investigation navigation.
- Main area: selected evidence or investigation content.
- Right sidebar or collapsible panel: timeline and notes.

On smaller screens, these sections should become accessible tabs, drawers, or stacked panels.

The user must be able to move between evidence items without losing investigation progress.

## FR-06: Suspect Profiles

Each suspect profile should include:

- Suspect ID.
- Fictional name.
- Fictional avatar or placeholder.
- Age range where relevant.
- Occupation or role.
- Relationship to the incident.
- Known motive.
- Alibi.
- Statement.
- Relevant known facts.

The interface must distinguish verified evidence from claims made by suspects.

A suspect's statement must not automatically be treated as a confirmed fact.

## FR-07: WhatsApp-Style Evidence

The application must render fictional chat evidence in a familiar messaging interface.

Each conversation should include:

- Conversation ID.
- Participants.
- Messages.
- Message timestamps.
- Sender identifiers.
- Message content.
- Optional attachment references.
- Evidence description.

Message bubbles must use consistent alignment, spacing, and timestamps.

The interface may resemble a generic messaging application but must not imply that the conversations came from real WhatsApp accounts.

Do not use real user credentials, access real accounts, or scrape actual messages.

Messages must be generated as structured data rather than requiring Gemini to produce an entire screenshot.

This allows the frontend to render readable conversations and maintain consistent timestamps.

## FR-08: Image Evidence

The investigation room must support image evidence such as:

- Fictional scene photographs.
- Objects connected to the incident.
- Locations.
- Documents.
- Suspect-related visual clues.

Each image item must contain:

- Evidence ID.
- Title.
- Description.
- Image URL or asset reference.
- Timestamp, if relevant.
- Related suspect IDs.
- Clue significance stored privately when necessary.

The frontend must display a loading state, an image-unavailable fallback, and an accessible image description.

Image generation must be optional for core gameplay.

Do not expose private solution annotations in image metadata or public API responses.

## FR-09: CCTV-Style Evidence

The application must support simulated CCTV evidence.

A simulated CCTV item may contain:

- Camera label.
- Fictional location.
- Recorded time range.
- Scene image or generated footage asset.
- Timestamp overlay.
- Written observations.
- Relevant events.
- Optional playback controls when a valid video asset exists.

If no actual video asset exists, display a clearly labelled simulated footage viewer or still image.

Do not create fake evidence presented as authentic real-world surveillance footage.

CCTV observations must agree with the case timeline.

## FR-10: Timeline

Display a chronological list of important events.

Each event should contain:

- Event ID.
- Timestamp or relative time.
- Event description.
- Related suspect IDs, if any.
- Related evidence IDs, if any.

The timeline must use a consistent timezone strategy.

If the case uses relative time, show it consistently, such as "10 minutes before the incident."

Users should be able to open related evidence from a timeline event.

## FR-11: Evidence Board

Provide an evidence board for reviewing and comparing evidence.

Required capabilities:

- List all available evidence.
- Filter evidence by category.
- Search evidence titles and descriptions.
- Open evidence details.
- Navigate between related items.
- Mark evidence as reviewed.
- Display evidence references and timestamps.
- Show a reviewed-evidence counter.

Optional enhancements:

- Pin evidence.
- Add private notes.
- Link two pieces of evidence manually.
- Create a personal theory.

Evidence marked as reviewed is a gameplay progress indicator. It must not change the underlying solution.

## FR-12: Investigation Notes

Users should be able to write private investigation notes.

Requirements:

- Create and edit notes.
- Associate notes with a case.
- Persist notes for authenticated users.
- Restore notes when the case is reopened.
- Keep notes private to their owner.
- Validate note length.
- Prevent notes from modifying official evidence.

For anonymous users, notes may be kept in browser storage if supported. Clearly distinguish local-only progress from server-saved progress.

## FR-13: Culprit Selection

The user must select one suspect as the culprit.

Requirements:

- Display the list of eligible suspects.
- Allow exactly one final selection.
- Provide a clear selected state.
- Require a selection before submission.
- Ask for confirmation before final submission.
- Prevent duplicate submissions.
- Evaluate the answer on the backend.
- Return the result and permitted explanation.

The frontend must never determine correctness independently.

The answer must be evaluated against the stored culprit identifier, not a newly generated AI judgment.

## FR-14: Answer Evaluation

The backend must compare the selected suspect ID with the predetermined culprit ID.

If correct:

- Display a success result.
- Reveal the culprit's identity.
- Explain the main reasoning.
- Link the explanation to relevant evidence.
- Explain how the evidence establishes the culprit's involvement.

If incorrect:

- Display an incorrect result.
- Explain the correct solution after the user's final submission.
- Identify the evidence that distinguishes the culprit from other suspects.
- Allow the user to review the investigation.

The application should not reveal the solution before final submission.

For Version 1.0, users should be allowed to submit a final answer once per case session. A future configuration may permit retries.

The evaluation endpoint must be idempotent for repeated requests belonging to the same completed session.

## FR-15: Case History

Users should be able to view previously created cases.

Each case-history entry should include:

- Case title.
- Creation date.
- Difficulty.
- Number of suspects.
- Investigation status.
- Completion status.
- Final result, if submitted.

Users must be able to reopen cases they own.

If authentication is implemented, users must not access other users' private cases.

## FR-16: Loading and Error States

Provide meaningful feedback for:

- Case generation.
- AI provider timeouts.
- Network failures.
- Invalid scenarios.
- Missing evidence.
- Failed image loading.
- Expired sessions.
- Unauthorized requests.
- Missing cases.
- Rate limits.
- Database errors.

Do not show raw stack traces, secrets, internal prompts, or database errors to the user.

---

# 5. USER INTERFACE AND DESIGN SYSTEM

## 5.1 Visual Direction

The website should feel like a modern detective investigation room.

Suggested design direction:

- Dark navy or charcoal background.
- Off-white text.
- Muted grey surfaces.
- Restrained red accents for warnings and important clues.
- Subtle amber accents for timestamps and evidence references.
- Clear typography.
- Fine borders and restrained shadows.
- Consistent spacing.
- Smooth but restrained transitions.

The visual style should create a mystery atmosphere without reducing readability.

## 5.2 Main Pages

### Page 1: Landing Page

Components:

- Navbar.
- Hero section.
- Scenario creation CTA.
- Example case preview.
- How It Works.
- Feature overview.
- Footer.

### Page 2: Create Mystery

Components:

- Scenario text area.
- Difficulty selector.
- Suspect-count selector.
- Category selector.
- Generate button.
- Input validation.
- Generation progress state.

### Page 3: Investigation Room

Components:

- Case header.
- Case summary.
- Suspect navigation.
- Evidence board.
- Message viewer.
- Image evidence viewer.
- CCTV-style viewer.
- Timeline.
- Investigation notes.
- Culprit selection panel.

### Page 4: Case Results

Components:

- Correct or incorrect result.
- Culprit profile.
- Case explanation.
- Evidence supporting the solution.
- Timeline reconstruction.
- Review Case button.
- Create Another Mystery button.

### Page 5: My Cases

Components:

- Saved cases.
- Search and filters.
- Case status.
- Completion results.
- Reopen action.

### Page 6: Not Found / Error

Components:

- Clear error message.
- Return Home action.

## 5.3 Responsive Design

The website must work on:

- Desktop browsers.
- Tablets.
- Mobile phones.

Requirements:

- No unintended horizontal overflow.
- Readable text.
- Touch-friendly controls.
- Responsive evidence cards.
- Collapsible sidebars.
- Responsive message and image viewers.
- Accessible forms and navigation.

## 5.4 Accessibility

Implement:

- Semantic HTML.
- Keyboard navigation.
- Visible focus states.
- Accessible form labels.
- Appropriate contrast.
- Alt text for images.
- Accessible modal dialogs.
- Screen-reader labels for icon-only buttons.
- Reduced-motion support where practical.

---

# 6. APPLICATION ARCHITECTURE

## 6.1 High-Level Architecture

The application must follow a client-server architecture.

React Frontend  
↓  
Express REST API  
↓  
Authentication and Validation Middleware  
↓  
Application Services  
↓  
Gemini Service / Mystery Validation Service / Case Service  
↓  
MongoDB

The frontend must never connect directly to MongoDB or call Gemini with a private API key.

## 6.2 Recommended Backend Structure

server/
- src/
  - config/
    - database.js
    - env.js
  - controllers/
    - auth.controller.js
    - mystery.controller.js
    - evidence.controller.js
    - submission.controller.js
    - user.controller.js
  - middleware/
    - auth.middleware.js
    - error.middleware.js
    - rateLimit.middleware.js
    - validate.middleware.js
  - models/
    - User.js
    - MysteryCase.js
    - InvestigationSession.js
  - routes/
    - auth.routes.js
    - mystery.routes.js
    - evidence.routes.js
    - submission.routes.js
    - user.routes.js
  - services/
    - gemini.service.js
    - mysteryGeneration.service.js
    - mysteryValidation.service.js
    - mysteryEvaluation.service.js
    - caseProgress.service.js
  - schemas/
    - mystery.schema.js
    - request.schema.js
  - utils/
    - errors.js
    - logger.js
  - app.js
  - server.js
- tests/
- package.json
- .env.example

Adapt this structure to the existing repository if a sound architecture already exists.

## 6.3 Recommended Frontend Structure

client/
- src/
  - api/
    - http.js
    - mystery.api.js
    - submission.api.js
    - user.api.js
  - components/
    - layout/
    - common/
    - mystery/
    - evidence/
    - suspects/
    - timeline/
  - pages/
    - HomePage.jsx
    - CreateMysteryPage.jsx
    - InvestigationPage.jsx
    - CaseResultPage.jsx
    - MyCasesPage.jsx
    - NotFoundPage.jsx
  - hooks/
  - context/
  - utils/
  - styles/
  - App.jsx
  - main.jsx
- tests/
- package.json

This is a suggested structure, not a requirement to split every component into a separate file unnecessarily.

---

# 7. MYSTERY DATA MODEL

## 7.1 Mystery Case

The MysteryCase model should contain:

- _id.
- ownerId, nullable only if anonymous cases are intentionally supported.
- title.
- originalScenario.
- category.
- difficulty.
- status.
- generationVersion.
- schemaVersion.
- setting.
- incident.
- suspects.
- evidence.
- timeline.
- solution, stored privately.
- createdAt.
- updatedAt.

Suggested case status values:

- generating.
- ready.
- failed.
- archived.

Use explicit enums and validate transitions.

## 7.2 Suspect Object

Each suspect must contain:

- id.
- name.
- profileDescription.
- role.
- motive.
- alibi.
- statement.
- avatarAsset, optional.
- relevantFacts, where appropriate.

Private fields may be stored separately or marked explicitly so the public serializer can exclude them.

The public API must not expose a field that directly identifies the culprit.

## 7.3 Evidence Object

Each evidence item must contain:

- id.
- type.
- title.
- description.
- createdAt or eventTimestamp.
- content.
- relatedSuspectIds.
- relatedEvidenceIds.
- assetUrl, optional.
- visibility.
- clueMetadata, private.

Suggested evidence types:

- chat.
- image.
- document.
- witness_statement.
- cctv.
- call_log.
- location_record.
- physical_clue.
- report.

Evidence must have stable IDs and explicit types.

## 7.4 Chat Evidence

A chat evidence object should contain:

- conversationId.
- participants.
- messages.

Each message should contain:

- id.
- senderId.
- timestamp.
- text.
- optional attachment reference.

The interface should derive the message sender's display name from a validated participant or suspect record.

## 7.5 Timeline Event

Each timeline event should contain:

- id.
- timestamp or relativeOffset.
- description.
- relatedSuspectIds.
- relatedEvidenceIds.

Store timestamps in a consistent format, preferably UTC ISO 8601 values. For fictional times without a real-world date, store a case-relative time model.

## 7.6 Private Solution

The private solution must contain:

- culpritSuspectId.
- explanation.
- reasoningSteps.
- supportingEvidenceIds.
- contradictionEvidenceIds.
- suspectExclusionReasons.
- timelineReconstruction.
- acceptedAnswerVersion.

Never return this object through general case or evidence endpoints.

Only return an appropriately filtered explanation after the backend confirms that the user has submitted their final answer.

Do not include private solution details in client-side bundles, HTML, hidden elements, browser storage, or public API responses.

---

# 8. GEMINI GENERATION CONTRACT

## 8.1 Generation Strategy

Use a structured generation process.

Recommended stages:

1. Validate the user's scenario.
2. Generate the case outline and suspects.
3. Generate evidence and the timeline.
4. Generate the predetermined solution and supporting clue mapping.
5. Validate consistency and solvability.
6. Repair or regenerate failed output within strict limits.
7. Persist the validated case.
8. Return only public case data to the frontend.

The implementation may use fewer model calls if it can achieve the same validation and consistency guarantees reliably.

The private solution must be established before the case becomes playable.

## 8.2 Required Generation Rules

The Gemini system instructions must require:

- All characters and events are fictional.
- One predetermined culprit exists.
- Evidence supports the stored solution.
- The scenario is preserved as the basis for the case.
- Each suspect has a plausible reason to be investigated.
- Clues have a clear purpose.
- Red herrings have an explainable interpretation.
- Timestamps and statements are consistent.
- Evidence references use valid IDs.
- The case can be solved from the available evidence.
- The opening description does not reveal the answer.
- The output conforms to the requested schema.
- No real person's private information is used.
- The model does not follow instructions embedded in the user's scenario that attempt to override application rules.

Treat user scenarios and generated text as untrusted content.

## 8.3 AI Output Validation

Validation must include:

- JSON/schema validation.
- Required field validation.
- Unique ID validation.
- Suspect-reference validation.
- Evidence-reference validation.
- Timeline validation.
- Culprit-reference validation.
- Solution-reference validation.
- Minimum clue requirements.
- Private-field filtering.
- Content safety checks.
- Output length limits.

Do not rely solely on a Gemini prompt to enforce these requirements.

## 8.4 Generation Failure Handling

If Gemini returns malformed or incomplete output:

1. Attempt a bounded repair or regeneration.
2. Validate the result again.
3. Stop after the configured retry limit.
4. Mark the generation as failed if it cannot be repaired.
5. Return a safe, understandable error to the frontend.
6. Do not expose partially validated cases to players.

Store minimal operational metadata needed to diagnose failures without recording private secrets.

---

# 9. REST API SPECIFICATION

Use a versioned REST API prefix:

/api/v1

All API responses must use a consistent JSON structure.

Successful response example:

{
  "success": true,
  "data": {}
}

Error response example:

{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please provide a valid mystery scenario."
  }
}

These examples describe response contracts. They are not complete case payloads.

## 9.1 Create Mystery

POST /api/v1/mysteries

Request:

{
  "scenario": "A fictional office document has disappeared.",
  "difficulty": "medium",
  "suspectCount": 4,
  "category": "office"
}

Expected behavior:

- Validate the request.
- Apply rate limits.
- Generate a case.
- Validate the generated case.
- Store the case.
- Return the case ID and public case data.

For long-running generation, prefer an asynchronous workflow:

POST /api/v1/mysteries  
→ 202 Accepted with generation ID.

GET /api/v1/mysteries/generations/:generationId  
→ Return generating, ready, or failed status.

Do not add a queue system unless needed. A simple persisted generation-status record and polling endpoint are sufficient for the initial implementation.

## 9.2 List My Cases

GET /api/v1/mysteries

Requirements:

- Return only cases accessible to the current user.
- Support pagination.
- Support filtering by status and difficulty.
- Exclude private solution fields.

## 9.3 Get Mystery

GET /api/v1/mysteries/:caseId

Requirements:

- Validate the ID.
- Check access permissions.
- Return case metadata and public content.
- Exclude the culprit ID and private solution.
- Return a suitable not-found or authorization response.

## 9.4 Get Evidence

GET /api/v1/mysteries/:caseId/evidence

Requirements:

- Return public evidence items.
- Support optional evidence-type filtering.
- Exclude hidden solution annotations.
- Check case access.

## 9.5 Get Evidence Detail

GET /api/v1/mysteries/:caseId/evidence/:evidenceId

Requirements:

- Return one evidence item.
- Check case ownership or permitted access.
- Exclude private clue metadata.

## 9.6 Submit Culprit

POST /api/v1/mysteries/:caseId/submit

Request:

{
  "suspectId": "suspect_2"
}

Expected behavior:

- Authenticate or verify the session.
- Verify case access.
- Confirm that the case is ready.
- Validate the selected suspect ID.
- Enforce the session's submission rules.
- Compare the submitted ID with the stored culprit ID.
- Save the result.
- Return the result and authorized explanation.

The evaluation must not call Gemini to choose the correct culprit.

## 9.7 Update Investigation Progress

PUT /api/v1/mysteries/:caseId/progress

Store supported progress data, such as:

- Reviewed evidence IDs.
- Notes.
- Current selected evidence.
- Investigation status.

Validate all evidence IDs against the case and enforce ownership.

## 9.8 Delete or Archive Case

DELETE /api/v1/mysteries/:caseId

Requirements:

- Verify ownership.
- Delete or archive according to the product's retention policy.
- Ensure related progress records are handled consistently.
- Return a clear success response.

Permanent deletion should be documented before implementation.

## 9.9 Health Check

GET /api/v1/health

Return basic service health.

Do not expose secrets, database credentials, environment values, or detailed infrastructure information.

---

# 10. AUTHENTICATION AND SESSION MANAGEMENT

Authentication is a product decision that must be finalized before production release.

Recommended Version 1.0 approach:

- Support authenticated users for persistent case history.
- Use secure server-managed sessions or an established authentication solution.
- Prefer HttpOnly, Secure, SameSite cookies when using cookie-based sessions.
- Use HTTPS in production.
- Protect state-changing requests against CSRF when applicable.
- Enforce ownership on all private case operations.

If anonymous play is supported:

- Issue an unpredictable session identifier.
- Restrict anonymous case access.
- Apply rate limits.
- Avoid exposing private cases through guessable IDs.
- Define whether anonymous cases can later be linked to an account.

Do not store plaintext passwords.

Do not implement custom cryptographic authentication mechanisms.

If authentication is not implemented in the first milestone, clearly restrict the application to a controlled local-development environment or a deliberately designed anonymous-play mode. Do not treat an unprotected production API as secure.

---

# 11. SECURITY REQUIREMENTS

## 11.1 API Security

Implement:

- Input validation.
- Rate limiting.
- Request-size limits.
- CORS restricted to configured origins.
- Secure HTTP headers.
- Centralized error handling.
- Authorization checks.
- Database query validation.
- Safe logging.
- Dependency maintenance.

## 11.2 Gemini API Security

- Keep the API key on the server.
- Load the key from environment variables.
- Never send the key to React.
- Never commit the key to Git.
- Set request and token limits.
- Restrict generation retries.
- Apply per-user and global usage limits.
- Avoid unlimited generation loops.
- Handle provider errors safely.

## 11.3 Prompt Injection

The user's scenario may contain instructions unrelated to generating a mystery.

Treat the scenario strictly as story content.

Do not allow it to override the system instructions, request secrets, reveal environment variables, modify application rules, or influence backend authorization.

Never rely on prompt instructions alone for access control or data confidentiality.

## 11.4 Generated Content Safety

Generated mysteries must remain fictional.

Do not generate real personal data, real private conversations, real credentials, or evidence intended to impersonate genuine records.

Fictional violence-related themes may be supported within applicable content-safety limits.

Generated assets should be stored with safe file types, size limits, and access controls.

If an external image provider is added, validate its URLs and content before display.

## 11.5 Data Privacy

- Collect only necessary user data.
- Document the data retention policy.
- Restrict access to private notes and cases.
- Avoid storing unnecessary prompts or sensitive information in logs.
- Provide deletion controls where appropriate.
- Do not share user scenarios with unrelated services.
- Disclose relevant third-party AI processing in the privacy notice.

---

# 12. PERFORMANCE AND RELIABILITY

## 12.1 Performance

- Keep normal navigation responsive.
- Use pagination for case history.
- Load evidence details on demand when appropriate.
- Optimize generated image sizes.
- Lazy-load large image assets.
- Avoid blocking the entire interface during long-running generation.
- Display progress feedback during AI requests.
- Avoid unnecessary React re-renders.

## 12.2 Reliability

- Handle AI timeouts.
- Handle database disconnections.
- Limit retries.
- Avoid duplicate generation jobs.
- Prevent repeated answer submissions.
- Validate data before saving.
- Preserve existing progress when updating case state.
- Return stable error codes.

## 12.3 Generation Limits

Generation limits must be configurable.

Suggested initial configuration:

- Four suspects by default.
- Three to eight suspects allowed.
- A maximum of three generation or repair attempts per case request.
- A configurable request timeout.
- A configurable per-user generation rate limit.

These are starting defaults. Adjust them based on model limits, cost, latency, and actual testing.

---

# 13. TESTING REQUIREMENTS

## 13.1 Frontend Tests

Test:

- Scenario form validation.
- Difficulty and category selection.
- Generation loading states.
- Generation error handling.
- Suspect navigation.
- Evidence filtering.
- Message rendering.
- Image fallbacks.
- Timeline navigation.
- Culprit selection.
- Submission confirmation.
- Result rendering.
- Responsive navigation.
- Accessibility basics.

Use a suitable testing stack, such as Vitest and React Testing Library.

## 13.2 Backend Tests

Test:

- Request validation.
- Gemini service error handling.
- Structured output validation.
- Duplicate ID rejection.
- Invalid evidence references.
- Invalid culprit references.
- Timeline consistency checks.
- Public/private field filtering.
- Case access control.
- Answer evaluation.
- Duplicate submissions.
- Rate limiting.
- Database error handling.

Use a suitable testing stack, such as Jest or Vitest with Supertest.

## 13.3 Integration Tests

Test the complete flow:

1. Submit a valid scenario.
2. Mock or invoke a controlled Gemini response.
3. Validate and save the generated case.
4. Retrieve public case data.
5. Confirm the solution is not exposed.
6. Retrieve evidence.
7. Submit an incorrect suspect.
8. Verify the incorrect result and authorized explanation.
9. Submit the correct suspect in a separate eligible session.
10. Verify the correct result.
11. Confirm access restrictions for another user.

Use mocked AI responses for deterministic tests. Do not require live Gemini API calls in every test run.

## 13.4 Mystery Quality Tests

Create automated checks for:

- Exactly one stored culprit.
- A valid suspect reference for the culprit.
- At least two independent supporting clues.
- No references to nonexistent evidence.
- Valid chronological ordering.
- No answer disclosure in the initial description.
- No answer disclosure through public API fields.
- A valid explanation after submission.

AI-generated content quality cannot be guaranteed by schema validation alone. Include manual review of representative generated cases before release.

---

# 14. DEVELOPMENT AND DELIVERY PHASES

## Phase 1: Repository Inspection and Foundation

Tasks:

- Inspect the existing repository.
- Identify existing frameworks and package managers.
- Preserve working code where appropriate.
- Establish the final folder structure.
- Configure environment variables.
- Configure MongoDB.
- Establish shared error handling and validation.
- Create a working health endpoint.
- Document development commands.

Deliverable: A working MERN foundation.

## Phase 2: Mystery Generation

Tasks:

- Implement the Gemini service.
- Define the versioned mystery schema.
- Build the generation prompt.
- Implement schema validation.
- Implement consistency checks.
- Implement retry limits.
- Persist generated cases.
- Filter private solution fields.

Deliverable: A validated mystery can be generated and retrieved safely.

## Phase 3: Investigation Interface

Tasks:

- Build the homepage.
- Build the scenario form.
- Build the investigation room.
- Build suspect profiles.
- Build chat evidence.
- Build the timeline.
- Build the evidence board.
- Add simulated CCTV and image evidence views.
- Add responsive layouts.

Deliverable: Users can investigate generated cases.

## Phase 4: Case Evaluation

Tasks:

- Implement culprit selection.
- Implement backend evaluation.
- Save submission results.
- Generate the final explanation from stored solution data.
- Link explanations to evidence.
- Prevent solution leakage.

Deliverable: Users can submit answers and see results.

## Phase 5: Case History and Progress

Tasks:

- Implement case history.
- Save reviewed evidence.
- Save investigation notes.
- Restore progress.
- Implement ownership checks.
- Add pagination and filters.

Deliverable: Users can revisit their investigations.

## Phase 6: Testing and Hardening

Tasks:

- Run frontend tests.
- Run backend tests.
- Run integration tests.
- Review access controls.
- Review API key handling.
- Test malformed Gemini responses.
- Test mobile responsiveness.
- Check accessibility.
- Document deployment.

Deliverable: A tested release candidate.

---

# 15. ACCEPTANCE CRITERIA

The project is ready for its initial release when all mandatory criteria pass.

### AC-01: Scenario Submission

Given a valid scenario, the user can submit it and receive generation status.

### AC-02: Case Generation

A valid case is created with suspects, evidence, a timeline, and a predetermined culprit.

### AC-03: Schema Validation

Malformed AI output cannot become a playable case.

### AC-04: Evidence Consistency

All evidence references valid suspects and relevant case records.

### AC-05: Mystery Solvability

The correct culprit can be identified from the available clues, with at least two independent supporting clues in a standard case.

### AC-06: Evidence Exploration

The user can open suspects, chat evidence, images, simulated CCTV items, and timeline entries where available.

### AC-07: Culprit Selection

The user can select exactly one suspect and submit a final answer.

### AC-08: Correct Answer

The backend recognizes the stored culprit and returns the authorized solution.

### AC-09: Incorrect Answer

The backend recognizes an incorrect selection and returns the authorized result.

### AC-10: Solution Confidentiality

The culprit ID, private reasoning, and hidden clue annotations do not appear in public case responses before submission.

### AC-11: Persistence

Generated cases and eligible progress data remain available after the page is refreshed.

### AC-12: Access Control

Users cannot retrieve or modify another user's private cases or notes.

### AC-13: Error Handling

AI, database, validation, and network failures produce understandable errors without exposing secrets.

### AC-14: Responsive Interface

Core gameplay works on desktop, tablet, and mobile.

### AC-15: Reproducible Setup

A developer can follow the documented installation instructions and run the application using environment variables and a configured MongoDB instance.

---

# 16. ENVIRONMENT CONFIGURATION

Create:

- client/.env.example
- server/.env.example

Frontend environment variables must contain only public configuration.

Example frontend variable:

VITE_API_BASE_URL=http://localhost:5000/api/v1

Example backend variables:

NODE_ENV=development
PORT=5000
MONGODB_URI=
GEMINI_API_KEY=
GEMINI_MODEL=
CLIENT_ORIGIN=http://localhost:5173
SESSION_SECRET=

Use valid, sufficiently strong secrets in the actual environment.

Do not commit .env files containing real credentials.

Add .env files to .gitignore.

Document how to obtain and configure the required Gemini and MongoDB credentials.

---

# 17. LOCAL DEVELOPMENT

The repository must document the commands needed to install dependencies, run the frontend, run the backend, and execute tests.

Recommended development setup:

- Frontend: Vite development server.
- Backend: Express development server.
- Database: Local MongoDB or a configured MongoDB service.

The application must fail with a clear configuration error if required environment variables are missing.

Do not silently switch to production credentials or external services.

A developer should be able to start the frontend and backend in separate terminals.

Optional root-level scripts may simplify running both applications together.

---

# 18. DEPLOYMENT REQUIREMENTS

The application must support deployment with:

- A React frontend hosting service.
- A Node.js-compatible backend hosting service.
- A managed or self-hosted MongoDB database.
- Secure environment variable configuration.
- HTTPS.
- Restricted CORS.
- Production error handling.
- Appropriate API rate limits.

Do not assume any specific hosting provider is required.

Before production deployment:

- Verify Gemini model availability.
- Configure API usage limits.
- Configure database backups where appropriate.
- Verify session and cookie settings.
- Review data retention and deletion behavior.
- Confirm that private solutions are never returned prematurely.
- Test the complete production build.

---

# 19. CODING STANDARDS

Codex must follow these standards:

1. Use readable, maintainable JavaScript.
2. Keep React components focused.
3. Keep AI generation logic out of UI components.
4. Keep database access in backend models or services.
5. Keep request validation separate from business logic.
6. Use consistent naming conventions.
7. Avoid duplicated logic.
8. Use shared UI components where practical.
9. Use environment variables for secrets and deployment configuration.
10. Validate all external input.
11. Use explicit error handling.
12. Avoid unnecessary dependencies.
13. Avoid placeholder implementations for required core functionality.
14. Do not hardcode the culprit in the frontend.
15. Do not generate the final answer dynamically at submission time.
16. Store the solution when generating the case.
17. Keep public and private case data separate.
18. Add tests for business-critical logic.
19. Document important architectural decisions.
20. Do not rewrite existing working code without a clear reason.

---

# 20. CODEX SPEC-DRIVEN DEVELOPMENT RULES

This specification is the authoritative source of truth for the initial version.

Codex must follow these rules throughout development.

## 20.1 Before Coding

- Inspect the repository and existing files.
- Identify the current application state.
- Read package manifests and existing documentation.
- Identify existing code that should be preserved.
- Compare the repository against this specification.
- Identify missing requirements and implementation risks.
- Create an implementation plan divided into small, testable tasks.

Do not delete or replace existing working functionality without justification.

## 20.2 Specification-First Workflow

For each feature:

1. Identify the applicable requirement IDs.
2. Define the expected behavior.
3. Identify the frontend, backend, and database changes.
4. Implement the feature.
5. Add or update tests.
6. Run relevant tests.
7. Compare the implementation against the acceptance criteria.
8. Update documentation if behavior or architecture changes.

Do not begin large amounts of implementation before defining the expected behavior.

## 20.3 Source of Truth

The project root must contain:

SPEC.md

This file contains the complete product and technical requirements.

Additional supporting documents may include:

- docs/IMPLEMENTATION_PLAN.md
- docs/ARCHITECTURE.md
- docs/API.md
- docs/DATA_MODEL.md
- docs/DECISIONS.md
- docs/TESTING.md

Supporting documents must not silently contradict SPEC.md.

If a requirement changes, update SPEC.md and relevant supporting documents together.

If a technical conflict or ambiguity is found:

- Identify the conflicting requirements.
- Propose the smallest reasonable change.
- Document the decision.
- Update the specification before implementing a substantial change.

Do not invent major product features without approval.

## 20.4 Implementation Tracking

Maintain an implementation checklist that records:

- Requirement ID.
- Implementation status.
- Related files.
- Tests.
- Remaining issues.

Use these status values:

- NOT_STARTED.
- IN_PROGRESS.
- BLOCKED.
- IMPLEMENTED.
- VERIFIED.

A feature is not VERIFIED merely because its code has been written. Relevant tests and acceptance criteria must pass.

## 20.5 Completion Reports

At the end of each development phase, report:

- Requirements completed.
- Files created or modified.
- Tests executed.
- Tests passed or failed.
- Configuration needed.
- Known limitations.
- Remaining tasks.

Never claim that a test passed unless it was actually executed successfully.

Never claim that an API integration works without verifying it or clearly stating that it was mocked.

## 20.6 Scope Control

Implement Version 1.0 first.

Do not add multiplayer, subscriptions, payments, public sharing, complex analytics, or unrelated features unless explicitly requested.

Prefer the simplest architecture that satisfies the requirements.

---

# 21. DEFINITION OF DONE

A feature is complete only when:

- Its behavior matches the specification.
- Input validation exists.
- Relevant error states are handled.
- Required access controls are enforced.
- Public and private data are correctly separated.
- Relevant automated tests pass.
- The UI works at supported screen sizes.
- Documentation is updated where necessary.
- No unrelated functionality has been broken.

The application is complete when all mandatory acceptance criteria in Section 15 pass.

---

# 22. FINAL PRODUCT DEFINITION

AI Mystery Room is a MERN-based interactive mystery-solving application powered by Google Gemini.

Users submit a scenario. The application generates a fictional investigation with suspects, evidence, conversations, visual clues, and a consistent timeline. The backend stores a predetermined culprit and the private solution. Users inspect the evidence and select the culprit. The backend evaluates the selection and reveals an explanation supported by the investigation.

The primary product priorities are:

1. Solvable and internally consistent mysteries.
2. Engaging evidence exploration.
3. Secure handling of the culprit and solution.
4. Reliable Gemini integration.
5. A responsive investigation interface.
6. Clear separation between frontend, backend, AI services, and database.
7. Testable, specification-driven implementation.

This document is the initial source of truth for Version 1.0. All implementation decisions must preserve these requirements unless the specification is explicitly revised.

# Addendum: Mystery Gameplay, Hints, and Scoring

This addendum extends the initial Version 1.0 requirements above. Where gameplay details below are more specific, they are the current requirements. The original specification text is preserved at the start of this file, and `SPEC.md` is the root implementation source of truth.

## Product journey

1. The player opens Home and starts a mystery.
2. The player enters a premise and chooses Easy, Medium, or Hard.
3. Gemini generates a fictional story, suspects, clues, three progressive hints, and a private solution.
4. The player discovers clues, reads statements, reviews the timeline, and may request hints.
5. The player submits one accusation.
6. The backend scores the investigation and returns verdict, culprit, explanation, and score.
7. The player may start another mystery or reopen prior session-owned cases.

## Pages and states

- **Home:** Product introduction and start action.
- **Create Mystery:** Premise field, difficulty and category selectors, suspect count, validation, generation loading, and retryable error state.
- **Investigation Room:** Story, suspect profiles, evidence board, timeline, clue-discovery progress, private notes, progressive hints, estimated score, and accusation action.
- **Accusation:** Select one suspect and confirm the final submission.
- **Results:** Correct/incorrect verdict, score breakdown, culprit, explanation, supporting clues, and a way to start a new mystery.
- **Case History / Not Found:** Reopen or archive session-owned cases and provide clear recovery navigation.

The application must remain keyboard accessible and responsive on desktop, tablet, and mobile. Loading and provider/network errors must be understandable and must preserve the player's existing work.

## Gameplay and score rules

- One clue earns **5 points**, awarded once when the player discovers it.
- A hint costs **10 points**, applied once per hint requested.
- The correct accusation base score is **100 Easy**, **150 Medium**, and **200 Hard**.
- Final score is `max(0, (correct ? difficultyBase : 0) + discoveredClueCount * 5 - hintsUsed * 10)`.
- An incorrect accusation earns no difficulty base points but retains clue points after hint penalties.
- The server computes and stores all score values. Client values are display-only estimates.
- Each case session allows one final accusation. Repeating an accusation request returns the saved result without scoring twice.
- Each case offers three progressive hints. Hints may point to evidence but must not name the culprit or expose private solution fields.

## Generation contract additions

The validated case JSON must also contain:

`hints: [{ id, text, relatedEvidenceIds }]`

Exactly three hints are required, in increasing directness. Each referenced evidence ID must exist. The backend stores hints privately and returns each hint only when requested. Generated content must still pass suspect, evidence, timeline, clue-reference, culprit, and supporting-clue validation before persistence.

## API contract additions

The gameplay API uses these routes (all protected case routes require the owning browser session ID):

- `POST /api/cases` — body `{ premise, difficulty, category?, suspectCount? }`; returns `{ caseId, case, progress }` without culprit, solution, or undisclosed hints.
- `GET /api/cases` — list only the current session's cases and their status/score.
- `GET /api/cases/:id` — retrieve public case data and that session's progress.
- `GET /api/cases/:id/clues` — return public clues only.
- `POST /api/cases/:id/clues/:clueId/discover` — mark a clue discovered once and return points awarded and current clue score.
- `POST /api/cases/:id/hints` — reveal the next hint only and apply one 10-point deduction.
- `POST /api/cases/:id/accuse` — body `{ suspectId }`; store the one-time accusation and return the authoritative verdict, explanation, culprit, score, and supporting evidence.
- `GET /api/cases/:id/result` — available only after the accusation is submitted.

Legacy `/api/v1/mysteries` routes may remain as compatibility aliases. Every response follows `{ success, data }` or `{ success: false, error: { code, message } }`.

## Data model additions

Each case stores its title, story, difficulty, suspects, clues, timeline, three private hints, and private solution. Session progress stores reviewed and discovered clue IDs, notes, hints used and revealed, final accusation, verdict, and score. Culprit ID, solution reasoning, and unrevealed hints remain server-only until the relevant game action permits disclosure.

## Completion criteria

- All three difficulty levels generate cases.
- Players can discover clues, request up to three hints, and submit one accusation.
- Clue rewards and hint penalties are idempotent and computed by the backend.
- Correct-answer base points match the selected difficulty; final score never falls below zero.
- Public case and clue responses do not leak the culprit, solution, or unrevealed hints.
- Results show verdict, culprit, explanation, score, and supporting evidence.
- Provider failures produce actionable messages; invalid AI output is never saved as playable content.
- The full workflow is verified locally and after deployment.

## Deployment deliverables

The intended deployment is a Node-compatible API host, MongoDB Atlas, and a Vercel frontend. Configure `MONGODB_URI`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `CLIENT_ORIGIN`, and `VITE_API_BASE_URL` only in the appropriate server/client environments. Never expose or commit secrets. A production website is not considered verified until the deployed create → investigate → hint → accuse → result flow succeeds.

