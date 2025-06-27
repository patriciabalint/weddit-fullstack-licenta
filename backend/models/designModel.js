import mongoose from 'mongoose';

const designSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    designData: { type: mongoose.Schema.Types.Mixed, required: true },
    hasBeenEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

designSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Design = mongoose.models.Design || mongoose.model('Design', designSchema);
export default Design;
