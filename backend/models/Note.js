import { Schema, model } from 'mongoose';

const NoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  // The user who created the note
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  // The tenant that owns the note (CRITICAL for data isolation)
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
}, { timestamps: true });

export default model('Note', NoteSchema);
