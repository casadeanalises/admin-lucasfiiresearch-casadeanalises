import mongoose from 'mongoose';

const vimeoVideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  vimeoId: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
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

// Middleware para atualizar o updatedAt
vimeoVideoSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const VimeoVideo = mongoose.models.VimeoVideo || mongoose.model('VimeoVideo', vimeoVideoSchema);

export default VimeoVideo;
