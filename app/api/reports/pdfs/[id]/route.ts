import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import ReportPDF from "@/app/models/ReportPDF";
import mongoose from "mongoose";
import { checkAdminAuth, unauthorized } from "@/lib/auth-admin";

interface MongoDocument {
  _id?: any;
  title?: string;
  type?: string;
  [key: string]: any;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    const { id } = params;

    await connectDB();

    let mongoId;
    let isValidObjectId = false;
    try {
      isValidObjectId = mongoose.Types.ObjectId.isValid(id);
      if (isValidObjectId) {
        mongoId = new mongoose.Types.ObjectId(id);
      } else {
        mongoId = id;
      }
    } catch (err) {
      mongoId = id;
    }

    const pdf = await ReportPDF.findById(mongoId).lean();

    if (!pdf) {
      return NextResponse.json(
        { message: "PDF não encontrado" },
        { status: 404 },
      );
    }

    const response = {
      ...pdf,
      id: (pdf as any)._id?.toString() || id
    };
    
    const typedResponse = response as Record<string, any>;
    if ('_id' in typedResponse) delete typedResponse._id;
    if ('__v' in typedResponse) delete typedResponse.__v;

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro ao buscar PDF:", error);
    return NextResponse.json(
      { message: "Erro ao buscar PDF", error },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    const { id } = params;
    console.log("ID do PDF recebido para atualização:", id);

    await connectDB();

    const data = await request.json();
    console.log("Dados recebidos para atualização:", data);

    let mongoId;
    let isValidObjectId = false;
    try {
      isValidObjectId = mongoose.Types.ObjectId.isValid(id);
      if (isValidObjectId) {
        mongoId = new mongoose.Types.ObjectId(id);
        console.log("ID convertido para ObjectId:", mongoId);
      } else {
        console.log("ID não é um ObjectId válido:", id);
        mongoId = id;
      }
    } catch (err) {
      console.error("Erro ao converter ID para ObjectId:", err);
      mongoId = id;
    }

    let existingPdf = null;
    
    existingPdf = await ReportPDF.findById(mongoId).lean();
    
    if (!existingPdf) {
      console.error("PDF não encontrado para o ID:", id);
      
      console.log("Tentando busca geral por ID");
      try {
        const anyDoc = await ReportPDF.findById(mongoId).lean();
        if (anyDoc) {
          console.log("Documento encontrado sem filtrar por tipo:", anyDoc);
          existingPdf = anyDoc;
        } else {
          console.log("Nenhum documento encontrado com esse ID");
        }
      } catch (findError) {
        console.error("Erro na busca direta:", findError);
      }
      
      if (!existingPdf) {
        const allDocs = await ReportPDF.find({}).limit(5).lean();
        console.log("Primeiros 5 documentos no banco:", 
          allDocs.map((doc: MongoDocument) => ({ 
            id: doc._id ? doc._id.toString() : 'unknown',
            title: doc.title || 'unknown'
          }))
        );
        
        return NextResponse.json(
          { message: "PDF não encontrado" },
          { status: 404 },
        );
      }
    }
    
    const typedExistingPdf = existingPdf as MongoDocument;
    
    console.log("PDF existente encontrado:", {
      id: typedExistingPdf._id ? typedExistingPdf._id.toString() : 'unknown',
      title: typedExistingPdf.title || 'sem título'
    });

    const allowedFields = [
      "title",
      "description",
      "author",
      "date",
      "time",
      "code",
      "thumbnail",
      "premium",
      "tags",
      "pageCount",
      "month",
      "year",
      "url",
      "dividendYield",
      "price"
    ];

    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (field in data) {
        if (field === "tags" && Array.isArray(data[field])) {
          updateData[field] = data[field];
        } else {
          updateData[field] = data[field];
        }
      }
    }
    
    console.log("Dados de atualização processados:", updateData);

    console.log("Tentando atualizar via MongoDB com ID:", typedExistingPdf._id);
    const updatedPdf = await ReportPDF.findByIdAndUpdate(
      typedExistingPdf._id,
      { $set: updateData },
      { new: true },
    ).lean();

    if (!updatedPdf) {
      console.error("Falha ao atualizar com MongoDB");
      return NextResponse.json(
        { message: "Falha ao atualizar PDF no MongoDB" },
        { status: 500 },
      );
    }

    const response = {
      ...updatedPdf,
      id: (updatedPdf as MongoDocument)._id.toString()
    };

    console.log("PDF atualizado com MongoDB:", {
      id: (updatedPdf as MongoDocument)._id ? (updatedPdf as MongoDocument)._id.toString() : 'unknown',
      title: (updatedPdf as MongoDocument).title || 'sem título'
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro ao atualizar PDF:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar PDF", error },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    const { id } = params;
    console.log("ID do PDF a ser excluído:", id);

    let mongoId;
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        mongoId = new mongoose.Types.ObjectId(id);
      } else {
        mongoId = id;
      }
    } catch (err) {
      mongoId = id;
    }

    await connectDB();
    const result = await ReportPDF.findByIdAndDelete(mongoId);
    
    if (!result) {
      return NextResponse.json(
        { error: "PDF não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "PDF excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir PDF:", error);
    return NextResponse.json(
      { error: "Erro ao excluir PDF" },
      { status: 500 }
    );
  }
}