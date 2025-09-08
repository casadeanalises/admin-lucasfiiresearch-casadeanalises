import { Schema, model, models } from "mongoose";

const homeVideoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Por favor, insira um título"],
    },
    description: {
      type: String,
      required: [true, "Por favor, insira uma descrição"],
    },
    videoId: {
      type: String,
      required: [true, "Por favor, insira o ID do vídeo"],
    },
    url: {
      type: String,
      required: false,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Middleware para gerar URL e thumbnail antes de validar
homeVideoSchema.pre("validate", function (next) {
  if (this.videoId) {
    this.url = `https://www.youtube.com/watch?v=${this.videoId}`;
    this.thumbnail = `https://img.youtube.com/vi/${this.videoId}/maxresdefault.jpg`;
  }
  next();
});

// Remover middleware de save e update
homeVideoSchema.pre("save", function (next) {
  next();
});

homeVideoSchema.pre("findOneAndUpdate", function (next) {
  next();
});

export default models.homevideos || model("homevideos", homeVideoSchema);
