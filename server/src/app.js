import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import mongoose from 'mongoose';
import MysteryCase from './models/MysteryCase.js';
import { env } from './config/env.js';
import { createCase, publicCase } from './services/mystery.service.js';

const app = express();
if (env.nodeEnv === 'production') app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.clientOrigins.includes(origin.replace(/\/$/, ''))) return callback(null, true);
    return callback(null, false);
  },
  allowedHeaders: ['Content-Type', 'X-Session-Id'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json({ limit: '32kb' }));
app.use('/api/cases', rateLimit({ windowMs: 60 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }));
app.use('/api/v1/mysteries', rateLimit({ windowMs: 60 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }));

function session(req, res, next) {
  const id = req.header('X-Session-Id');
  if (!id || id.length < 20 || id.length > 100) return res.status(401).json({ success: false, error: { code: 'SESSION_REQUIRED', message: 'Session missing. Refresh and try again.' } });
  req.sessionId = id;
  next();
}
function fail(res, error) {
  const status = error.status || (error.name === 'ZodError' ? 400 : 500);
  const code = error.code || (status === 400 ? 'VALIDATION_ERROR' : 'SERVER_ERROR');
  const safe = ['AI_NOT_CONFIGURED', 'AI_CONFIG_ERROR', 'AI_UPSTREAM_ERROR', 'GENERATION_FAILED'];
  const message = status >= 500 ? (safe.includes(code) ? error.message : 'We could not complete that request. Please try again.') : error.message;
  return res.status(status).json({ success: false, error: { code, message } });
}
function clientError(message, status = 400, code = 'VALIDATION_ERROR') { return Object.assign(new Error(message), { status, code }); }
async function owned(id, sessionId) {
  if (!mongoose.isValidObjectId(id)) return null;
  return MysteryCase.findOne({ _id: id, ownerId: sessionId, status: { $ne: 'archived' } }).select('+solution +hints');
}
function getProgress(c, sessionId) {
  let p = c.progress.find(row => row.sessionId === sessionId);
  if (!p) { c.progress.push({ sessionId, reviewedEvidenceIds: [], discoveredClueIds: [], notes: '', hintsUsed: 0, score: 0 }); p = c.progress[c.progress.length - 1]; }
  return p;
}
function resultFor(c, p) {
  const culprit = c.suspects.find(s => s.id === c.solution.culpritSuspectId);
  return { correct: p.isCorrect, culpritName: culprit?.name, score: p.score || 0, discoveredClueCount: p.discoveredClueIds?.length || 0, hintsUsed: p.hintsUsed || 0, explanation: c.solution.explanation, reasoningSteps: c.solution.reasoningSteps, supportingEvidenceIds: c.solution.supportingEvidenceIds, contradictionEvidenceIds: c.solution.contradictionEvidenceIds, timelineReconstruction: c.solution.timelineReconstruction };
}
const basePoints = { easy: 100, medium: 150, hard: 200 };
export function calculateScore(difficulty, correct, discoveredClues, hintsUsed) {
  return Math.max(0, (correct ? basePoints[difficulty] || 0 : 0) + discoveredClues * 5 - hintsUsed * 10);
}
const createBody = z.object({ scenario: z.string().trim().min(20).max(env.maxScenario).optional(), premise: z.string().trim().min(20).max(env.maxScenario).optional(), difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'), suspectCount: z.number().int().min(3).max(8).default(4), category: z.string().min(2).max(40).default('general') }).transform(value => ({ ...value, scenario: value.scenario || value.premise })).refine(value => !!value.scenario, { path: ['premise'], message: 'Please enter a mystery premise of at least 20 characters.' });

app.get('/api/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.get('/api/v1/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));

async function createHandler(req, res) {
  try {
    const input = createBody.parse(req.body);
    const c = await createCase(input, req.sessionId);
    return res.status(201).json({ success: true, data: { caseId: c.id, ...publicCase(c) } });
  } catch (error) { return fail(res, error); }
}
app.post('/api/cases', session, createHandler);
app.post('/api/v1/mysteries', session, createHandler);

async function listHandler(req, res) {
  try {
    const cases = await MysteryCase.find({ ownerId: req.sessionId, status: { $ne: 'archived' } }).sort({ createdAt: -1 }).limit(100).lean();
    return res.json({ success: true, data: { cases: cases.map(({ solution, hints, progress, ownerId, ...c }) => ({ ...c, submitted: !!progress?.some(p => p.submittedAt), score: progress?.find(p => p.sessionId === req.sessionId)?.score || 0 })) } });
  } catch (error) { return fail(res, error); }
}
app.get('/api/cases', session, listHandler);
app.get('/api/v1/mysteries', session, listHandler);

async function getCaseHandler(req, res) {
  try {
    const c = await owned(req.params.id, req.sessionId);
    if (!c) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Case file not found.' } });
    return res.json({ success: true, data: publicCase(c, c.progress.find(p => p.sessionId === req.sessionId)) });
  } catch (error) { return fail(res, error); }
}
app.get('/api/cases/:id', session, getCaseHandler);
app.get('/api/v1/mysteries/:id', session, getCaseHandler);

app.get('/api/cases/:id/clues', session, async (req, res) => {
  try {
    const c = await owned(req.params.id, req.sessionId);
    if (!c) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Case file not found.' } });
    const clues = c.evidence.filter(e => e.visibility !== 'private').map(({ clueMetadata, ...e }) => e);
    return res.json({ success: true, data: { clues } });
  } catch (error) { return fail(res, error); }
});
app.get('/api/v1/mysteries/:id/evidence', session, async (req, res) => {
  try {
    const c = await owned(req.params.id, req.sessionId);
    if (!c) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Case file not found.' } });
    const evidence = c.evidence.filter(e => e.visibility !== 'private' && (!req.query.type || e.type === req.query.type)).map(({ clueMetadata, ...e }) => e);
    return res.json({ success: true, data: { evidence } });
  } catch (error) { return fail(res, error); }
});
app.get('/api/v1/mysteries/:id/evidence/:eid', session, async (req, res) => {
  try {
    const c = await owned(req.params.id, req.sessionId), e = c?.evidence.find(item => item.id === req.params.eid && item.visibility !== 'private');
    if (!e) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Evidence not found.' } });
    const { clueMetadata, ...evidence } = e.toObject();
    return res.json({ success: true, data: { evidence } });
  } catch (error) { return fail(res, error); }
});

app.post('/api/cases/:id/clues/:clueId/discover', session, async (req, res) => {
  try {
    const c = await owned(req.params.id, req.sessionId);
    if (!c) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Case file not found.' } });
    if (!c.evidence.some(e => e.id === req.params.clueId && e.visibility !== 'private')) throw clientError('Clue not found.');
    const p = getProgress(c, req.sessionId);
    if (p.submittedAt) throw clientError('This investigation has already been submitted.', 409, 'CASE_COMPLETE');
    const discovered = p.discoveredClueIds || [];
    const isNew = !discovered.includes(req.params.clueId);
    if (isNew) discovered.push(req.params.clueId);
    p.discoveredClueIds = discovered;
    if (!p.reviewedEvidenceIds.includes(req.params.clueId)) p.reviewedEvidenceIds.push(req.params.clueId);
    p.score = discovered.length * 5;
    await c.save();
    return res.json({ success: true, data: { discovered: true, newlyDiscovered: isNew, pointsAwarded: isNew ? 5 : 0, discoveredClueCount: discovered.length, score: p.score } });
  } catch (error) { return fail(res, error); }
});

app.post('/api/cases/:id/hints', session, async (req, res) => {
  try {
    const c = await owned(req.params.id, req.sessionId);
    if (!c) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Case file not found.' } });
    const p = getProgress(c, req.sessionId);
    if (p.submittedAt) throw clientError('This investigation has already been submitted.', 409, 'CASE_COMPLETE');
    const hints = c.hints || [];
    if ((p.hintsUsed || 0) >= hints.length) throw clientError('You have used all available hints.', 409, 'NO_HINTS_LEFT');
    const hint = hints[p.hintsUsed];
    p.hintsUsed = (p.hintsUsed || 0) + 1;
    p.revealedHints ??= [];
    p.revealedHints.push({ id: hint.id, text: hint.text, relatedEvidenceIds: hint.relatedEvidenceIds });
    p.score = (p.discoveredClueIds?.length || 0) * 5;
    await c.save();
    return res.json({ success: true, data: { hint: { id: hint.id, text: hint.text, relatedEvidenceIds: hint.relatedEvidenceIds }, hintsUsed: p.hintsUsed, hintsRemaining: hints.length - p.hintsUsed, score: p.score } });
  } catch (error) { return fail(res, error); }
});

async function accuseHandler(req, res) {
  try {
    const c = await owned(req.params.id, req.sessionId);
    if (!c) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Case file not found.' } });
    const suspectId = z.object({ suspectId: z.string().min(1).max(100) }).parse(req.body).suspectId;
    if (!c.suspects.some(s => s.id === suspectId)) throw clientError('Choose a suspect from this case.');
    let p = c.progress.find(row => row.sessionId === req.sessionId);
    if (!p) p = getProgress(c, req.sessionId);
    if (p.submittedAt) return res.json({ success: true, data: { ...resultFor(c, p), alreadySubmitted: true } });
    p.submittedAt = new Date();
    p.selectedSuspectId = suspectId;
    p.accusationSuspectId = suspectId;
    p.isCorrect = suspectId === c.solution.culpritSuspectId;
    p.score = calculateScore(c.difficulty, p.isCorrect, p.discoveredClueIds?.length || 0, p.hintsUsed || 0);
    await c.save();
    return res.json({ success: true, data: resultFor(c, p) });
  } catch (error) { return fail(res, error); }
}
app.post('/api/cases/:id/accuse', session, accuseHandler);
app.post('/api/v1/mysteries/:id/submit', session, accuseHandler);

app.get('/api/cases/:id/result', session, async (req, res) => {
  try {
    const c = await owned(req.params.id, req.sessionId), p = c?.progress.find(row => row.sessionId === req.sessionId);
    if (!c) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Case file not found.' } });
    if (!p?.submittedAt) throw clientError('Submit your accusation before viewing the result.', 409, 'RESULT_NOT_READY');
    return res.json({ success: true, data: resultFor(c, p) });
  } catch (error) { return fail(res, error); }
});

app.put('/api/v1/mysteries/:id/progress', session, async (req, res) => {
  try {
    const c = await owned(req.params.id, req.sessionId);
    if (!c) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Case file not found.' } });
    const p = getProgress(c, req.sessionId);
    if (p.submittedAt) throw clientError('This investigation has already been submitted.', 409, 'CASE_COMPLETE');
    const body = z.object({ reviewedEvidenceIds: z.array(z.string().max(100)).optional(), notes: z.string().max(5000).optional(), currentEvidenceId: z.string().max(100).optional() }).parse(req.body);
    if ((body.reviewedEvidenceIds || []).some(id => !c.evidence.some(e => e.id === id)) || (body.currentEvidenceId && !c.evidence.some(e => e.id === body.currentEvidenceId))) throw clientError('Unknown evidence reference.');
    if (body.reviewedEvidenceIds) p.reviewedEvidenceIds = [...new Set(body.reviewedEvidenceIds)];
    if (body.notes !== undefined) p.notes = body.notes;
    if (body.currentEvidenceId !== undefined) p.currentEvidenceId = body.currentEvidenceId;
    c.updatedAt = new Date();
    await c.save();
    return res.json({ success: true, data: { saved: true } });
  } catch (error) { return fail(res, error); }
});

app.delete('/api/v1/mysteries/:id', session, async (req, res) => {
  try {
    const c = await MysteryCase.findOneAndUpdate({ _id: req.params.id, ownerId: req.sessionId }, { $set: { status: 'archived', updatedAt: new Date() } }, { new: true });
    if (!c) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Case file not found.' } });
    return res.json({ success: true, data: { archived: true } });
  } catch (error) { return fail(res, error); }
});

app.use((_req, res) => res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'That route does not exist.' } }));
app.use((error, _req, res, _next) => fail(res, error));
export default app;
