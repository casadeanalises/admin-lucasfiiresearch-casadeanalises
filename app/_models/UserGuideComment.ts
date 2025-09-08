import { Schema, model, models } from "mongoose";

const userGuideCommentSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "ID do usuário é obrigatório"],
    },
    userName: {
      type: String,
      required: [true, "Nome do usuário é obrigatório"],
    },
    userImage: {
      type: String,
      required: [true, "Imagem do usuário é obrigatória"],
    },
    content: {
      type: String,
      required: [true, "Conteúdo do comentário é obrigatório"],
    },
    likes: {
      type: [String],
      default: [],
    },
    parentId: {
      type: String,
      default: null,
    },
    guideVideoId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const UserGuideComment = models.UserGuideComment || model("UserGuideComment", userGuideCommentSchema); 