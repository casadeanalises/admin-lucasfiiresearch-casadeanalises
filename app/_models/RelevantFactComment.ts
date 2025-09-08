import mongoose from "mongoose";

const RelevantFactCommentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
    default: null,
  },
  likes: [{
    type: String,
  }],
}, {
  timestamps: true,
});

export const RelevantFactComment = mongoose.models.RelevantFactComment || mongoose.model("RelevantFactComment", RelevantFactCommentSchema); 
