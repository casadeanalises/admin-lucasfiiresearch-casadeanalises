import mongoose from "mongoose";

const ContactCommentSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ID do Clerk
  userName: { type: String, required: true },
  userImage: { type: String, default: "https://ui-avatars.com/api/?name=User" },
  content: { type: String, required: true },
  likes: [{ type: String }], // Array de userIds que deram like
  parentId: { type: mongoose.Schema.Types.ObjectId, default: null }, // Para respostas
  createdAt: { type: Date, default: Date.now },
});

export const ContactComment = mongoose.models.ContactComment || mongoose.model("ContactComment", ContactCommentSchema); 