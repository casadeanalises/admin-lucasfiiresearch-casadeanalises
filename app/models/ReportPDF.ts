import mongoose from "mongoose";

export interface IReportPDF {
  title: string;
  description: string;
  author: string;
  date: string;
  time: string;
  code: string;
  thumbnail: string;
  premium: boolean;
  tags: string[];
  pageCount: number;
  month: string;
  year: string;
  url: string;
  fileContent?: string;
  dividendYield?: string;
  price?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportPDFSchema = new mongoose.Schema<IReportPDF>(
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
    pageCount: { type: Number, default: 1 },
    month: { type: String, required: true },
    year: { type: String, required: true },
    url: { type: String },
    fileContent: { type: String },
    dividendYield: { type: String },
    price: { type: String },
    category: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "ReportsPDFs"
  },
);

const ReportPDF =
  mongoose.models.ReportPDF || mongoose.model<IReportPDF>("ReportPDF", reportPDFSchema);

export default ReportPDF; 
