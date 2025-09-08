import mongoose from 'mongoose';

const updateSchedulePDFSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const UpdateSchedulePDF = mongoose.models.UpdateSchedulePDF || mongoose.model('UpdateSchedulePDF', updateSchedulePDFSchema);
