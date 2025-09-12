import { Schema, model } from 'mongoose';

const TenantSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
});

export default model('Tenant', TenantSchema);
