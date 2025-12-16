import mongoose, { Schema, model, models } from 'mongoose';

const SupportPurchaseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    stripeSessionId: { type: String, unique: true, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed'], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type SupportPurchaseDocument =
  mongoose.InferSchemaType<typeof SupportPurchaseSchema> & { _id: mongoose.Types.ObjectId };

export default models.SupportPurchase || model('SupportPurchase', SupportPurchaseSchema);
