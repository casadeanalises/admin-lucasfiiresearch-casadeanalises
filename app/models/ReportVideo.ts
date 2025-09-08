import mongoose from "mongoose";

export interface IReportVideo {
  title: string;
  description: string;
  author: string;
  date: string;
  time: string;
  code: string;
  thumbnail: string;
  premium: boolean;
  tags: string[];
  month: string;
  year: string;
  url?: string;
  videoId: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportVideoSchema = new mongoose.Schema<IReportVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    author: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    code: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    premium: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    month: { type: String, required: true },
    year: { type: String, required: true },
    url: { type: String },
    videoId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "ReportsVideos" 
  },
);

const ReportVideo =
  mongoose.models.ReportVideo || mongoose.model<IReportVideo>("ReportVideo", reportVideoSchema);

export default ReportVideo; 
