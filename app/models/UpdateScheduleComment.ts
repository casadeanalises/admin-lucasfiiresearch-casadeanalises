import mongoose from 'mongoose';

const updateScheduleCommentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: [String], // Array de userIds que deram like
    default: [],
  },
}, {
  timestamps: true,
});

export const UpdateScheduleComment = mongoose.models.UpdateScheduleComment || mongoose.model('UpdateScheduleComment', updateScheduleCommentSchema);
