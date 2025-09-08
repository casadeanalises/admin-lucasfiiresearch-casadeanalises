import mongoose from 'mongoose';

const selicSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// Cria um índice para otimizar buscas por data
selicSchema.index({ date: 1 });

export const Selic = mongoose.models.Selic || mongoose.model('Selic', selicSchema); 
