import mongoose, { Schema, model, models } from 'mongoose';

const SpinSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    bet: { type: Number, required: true },
    result: { type: String, required: true },
    multiplier: { type: Number, required: true },
    win: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type SpinDocument = mongoose.InferSchemaType<typeof SpinSchema> & { _id: mongoose.Types.ObjectId };

export default models.Spin || model('Spin', SpinSchema);
