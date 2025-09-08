import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import ReportVideo from "@/app/models/ReportVideo";
import mongoose from "mongoose";
import { checkAdminAuth, unauthorized } from "@/lib/auth-admin";

interface MongoDocument {
  _id?: any;
  title?: string;
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
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        mongoId = new mongoose.Types.ObjectId(id);
      } else {
        mongoId = id;
      }
    } catch (err) {
      mongoId = id;
    }

    const video = await ReportVideo.findById(mongoId).lean();

    if (!video) {
      return NextResponse.json(
        { message: "Vídeo não encontrado" },
        { status: 404 },
      );
    }

    const response = {
      ...video,
      id: (video as any)._id?.toString() || id
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro ao buscar vídeo:", error);
    return NextResponse.json(
      { message: "Erro ao buscar vídeo", error },
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
    console.log("ID do vídeo a ser atualizado:", id);

    await connectDB();

    const data = await request.json();
    console.log("Dados recebidos para atualização:", data);

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

    const existingVideo = await ReportVideo.findById(mongoId).lean();
    
    if (!existingVideo) {
      console.error("Vídeo não encontrado para o ID:", id);
      return NextResponse.json(
        { message: "Vídeo não encontrado" },
        { status: 404 },
      );
    }
    
    const typedExistingVideo = existingVideo as MongoDocument;
    
    console.log("Vídeo existente encontrado:", {
      id: typedExistingVideo._id ? typedExistingVideo._id.toString() : 'unknown',
      title: typedExistingVideo.title || 'sem título'
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
      "month",
      "year",
      "url",
      "videoId"
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

    console.log("Tentando atualizar via MongoDB com ID:", typedExistingVideo._id);
    const updatedVideo = await ReportVideo.findByIdAndUpdate(
      typedExistingVideo._id,
      { $set: updateData },
      { new: true },
    ).lean();

    if (!updatedVideo) {
      console.error("Falha ao atualizar com MongoDB");
      return NextResponse.json(
        { message: "Falha ao atualizar vídeo no MongoDB" },
        { status: 500 },
      );
    }

    const response = {
      ...updatedVideo,
      id: (updatedVideo as MongoDocument)._id.toString()
    };

    console.log("Vídeo atualizado com MongoDB:", {
      id: (updatedVideo as MongoDocument)._id ? (updatedVideo as MongoDocument)._id.toString() : 'unknown',
      title: (updatedVideo as MongoDocument).title || 'sem título'
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro ao atualizar vídeo:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar vídeo", error },
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
    console.log("ID do vídeo a ser excluído:", id);

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
    const result = await ReportVideo.findByIdAndDelete(mongoId);
    
    if (!result) {
      return NextResponse.json(
        { error: "Vídeo não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Vídeo excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir vídeo:", error);
    return NextResponse.json(
      { error: "Erro ao excluir vídeo" },
      { status: 500 }
    );
  }
}