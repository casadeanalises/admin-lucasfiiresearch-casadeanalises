import mongoose from 'mongoose';

// Deletar o modelo existente se ele existir
if (mongoose.models.UpdateSchedule) {
  delete mongoose.models.UpdateSchedule;
}

const updateScheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['planned', 'in_progress', 'paused', 'completed', 'cancelled'],
    default: 'planned',
  },
  category: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const UpdateSchedule = mongoose.model('UpdateSchedule', updateScheduleSchema);
