import mongoose from "mongoose";

// Deletar o modelo existente se já estiver definido
if (mongoose.models.VideoComment) {
  delete mongoose.models.VideoComment;
}

const VideoCommentSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ID do Clerk
  userName: { type: String, required: true },
  userImage: { type: String, default: "https://ui-avatars.com/api/?name=User" },
  content: { type: String, required: true },
  likes: [{ type: String }], // Array de userIds que deram like
  parentId: { type: mongoose.Schema.Types.ObjectId, default: null }, // Para respostas
  videoId: { type: String, default: null }, // ID do vídeo ao qual o comentário pertence (opcional)
  createdAt: { type: Date, default: Date.now },
});

export const VideoComment = mongoose.model("VideoComment", VideoCommentSchema); 