import mongoose from "mongoose";

export interface IReport {
  title: string;
  description: string;
  author: string;
  date: string;
  time: string;
  code: string;
  type: string;
  thumbnail: string;
  premium: boolean;
  tags: string[];
  pageCount: number;
  month: string;
  year: string;
  url: string;
  fileContent?: string;
  createdById: string;
  videoId: string;
  dividendYield: string;
  price: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new mongoose.Schema<IReport>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    author: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    code: { type: String, required: true },
    type: { type: String, required: true },
    thumbnail: { type: String, required: true },
    premium: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    pageCount: { type: Number },
    month: { type: String, required: true },
    year: { type: String, required: true },
    url: { type: String },
    fileContent: { type: String },
    createdById: { type: String, required: true },
    videoId: { type: String },
    dividendYield: { type: String },
    price: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const Report =
  mongoose.models.Report || mongoose.model<IReport>("Report", reportSchema);

export default Report;
