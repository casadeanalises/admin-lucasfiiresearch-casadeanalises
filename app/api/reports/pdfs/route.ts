import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import connectDB from "@/app/lib/mongodb";
import ReportPDF from "@/app/models/ReportPDF";
import { checkAdminAuth, unauthorized } from "@/lib/auth-admin";

export async function GET() {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    await connectDB();
    const mongoDbPdfs = await ReportPDF.find({}).lean();
    
    const formattedPdfs = mongoDbPdfs.map(pdf => {
      const pdfObject = { ...pdf };
      
      if (pdf._id) {
        pdfObject.id = pdf._id.toString();
        
        delete (pdfObject as Record<string, any>)._id;
      }
      
      if ('__v' in pdfObject) {
        delete (pdfObject as Record<string, any>).__v;
      }
      
      return pdfObject;
    });

    console.log("PDFs encontrados:", formattedPdfs.length);
    return NextResponse.json(formattedPdfs);
  } catch (error) {
    console.error("Erro ao buscar PDFs:", error);
    return NextResponse.json({ error: "Erro ao buscar PDFs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    const data = await request.json();
    
    await connectDB();
    const newPdf = new ReportPDF({
      title: data.title,
      description: data.description,
      author: data.author,
      date: data.date,
      time: data.time,
      code: data.code,
      thumbnail: data.thumbnail || "",
      premium: data.premium || false,
      tags: Array.isArray(data.tags) ? data.tags : [],
      month: data.month,
      year: data.year,
      url: data.url || null,
      pageCount: data.pageCount || 1,
      dividendYield: data.dividendYield || null,
      price: data.price || null,
      category: data.category || null,
    });
    
    await newPdf.save();
    
    const response = {
      ...newPdf.toObject(),
      id: newPdf._id.toString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro ao criar PDF:", error);
    return NextResponse.json({ error: "Erro ao criar PDF" }, { status: 500 });
  }
}