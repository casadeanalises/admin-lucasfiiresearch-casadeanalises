import mongoose from "mongoose";

const FIISchema = new mongoose.Schema({
  codigo: String,
  nome: String,
  setor: String,
  preco: Number,
  valorPatrimonial: Number,
  dividendYield: Number,
  liquidezDiaria: Number,
  valoracaoPVP: Number,
  rentabilidadeMes: Number,
  rentabilidadeAno: Number,
  ultimoRendimento: Number,
  dataUltimoInfoorme: String,
});

const PortfolioItemSchema = new mongoose.Schema({
  fii: FIISchema,
  quantidade: Number,
  precoMedio: Number,
  dataCompra: String,
});

const PortfolioSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  items: [PortfolioItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para atualizar o updatedAt
PortfolioSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Portfolio =
  mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);
