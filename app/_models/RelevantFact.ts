import mongoose from 'mongoose';

const relevantFactSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const RelevantFact = mongoose.models.RelevantFact || mongoose.model('RelevantFact', relevantFactSchema);

export default RelevantFact; 
