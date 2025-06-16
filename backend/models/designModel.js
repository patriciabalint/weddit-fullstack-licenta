import mongoose from 'mongoose';

const designSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  productId: {
    type: String, // Am ales String pentru că ID-ul din frontend e un string (nu un ObjectId)
    required: true,
  },
  fields: {
    type: Array, // Array-ul va conține obiecte precum { id, label, value, x, y, fontSize, fontFamily }
    default: [], // Valoare implicită, un array gol
  },
  createdAt: {
    // Data creării (util pentru debug, audit)
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    // Data ultimei actualizări
    type: Date,
    default: Date.now,
  },
});

// Adăugăm un index unic pentru a asigura că există un singur design per userId și productId
// Acest lucru previne duplicarea și ne permite să folosim findOneAndUpdate pentru a face UPSERT (Update OR Insert)
designSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Design = mongoose.models.design || mongoose.model('design', designSchema);

export default Design;
