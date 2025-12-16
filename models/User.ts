import mongoose, { Schema, models, model } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    demoBalance: { type: Number, default: 10000 },
    lastRefillAt: { type: Date, default: null },
    isSupporter: { type: Boolean, default: false },
    supporterTheme: { type: String, default: 'default' },
    losingStreak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type UserDocument = mongoose.InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export default models.User || model('User', UserSchema);
