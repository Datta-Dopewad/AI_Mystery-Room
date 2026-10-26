import mongoose from 'mongoose';

const { Schema } = mongoose;
const Suspect = new Schema({
  id: { type: String, required: true }, name: { type: String, required: true },
  profileDescription: String, role: String, motive: String, alibi: String,
  statement: String, avatarAsset: String, relevantFacts: [String]
}, { _id: false });
const Evidence = new Schema({
  id: { type: String, required: true }, type: { type: String, required: true },
  title: String, description: String, createdAt: String, eventTimestamp: String,
  content: Schema.Types.Mixed, relatedSuspectIds: [String], relatedEvidenceIds: [String],
  assetUrl: String, visibility: { type: String, default: 'public' }, clueMetadata: Schema.Types.Mixed
}, { _id: false });
const Event = new Schema({ id: String, timestamp: String, relativeOffset: String, description: String, relatedSuspectIds: [String], relatedEvidenceIds: [String] }, { _id: false });
const Hint = new Schema({ id: { type: String, required: true }, text: { type: String, required: true }, relatedEvidenceIds: [String] }, { _id: false });
const Solution = new Schema({
  culpritSuspectId: String, explanation: String, reasoningSteps: [String], supportingEvidenceIds: [String],
  contradictionEvidenceIds: [String], suspectExclusionReasons: Schema.Types.Mixed,
  timelineReconstruction: [String], acceptedAnswerVersion: { type: Number, default: 1 }
}, { _id: false });
const Progress = new Schema({
  sessionId: String, reviewedEvidenceIds: [String], discoveredClueIds: [String],
  notes: { type: String, default: '' }, currentEvidenceId: String, submittedAt: Date,
  selectedSuspectId: String, isCorrect: Boolean, hintsUsed: { type: Number, default: 0 },
  revealedHints: [Schema.Types.Mixed], accusationSuspectId: String, score: { type: Number, default: 0 }
}, { _id: false });
const Case = new Schema({
  ownerId: { type: String, required: true, index: true }, title: { type: String, required: true },
  originalScenario: String, category: String, difficulty: String,
  status: { type: String, enum: ['generating', 'ready', 'failed', 'archived'], default: 'ready', index: true },
  generationVersion: { type: Number, default: 1 }, schemaVersion: { type: Number, default: 1 },
  setting: Schema.Types.Mixed, incident: Schema.Types.Mixed, introduction: String,
  suspects: [Suspect], evidence: [Evidence], timeline: [Event],
  hints: { type: [Hint], select: false }, solution: { type: Solution, select: false },
  progress: [Progress], createdAt: { type: Date, default: Date.now }, updatedAt: { type: Date, default: Date.now }
}, { minimize: false });
Case.index({ ownerId: 1, createdAt: -1 });
export default mongoose.model('MysteryCase', Case);
