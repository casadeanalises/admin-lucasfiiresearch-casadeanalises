import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { checkAdminAuth, unauthorized } from "@/lib/auth-admin";

// Função para extrair o ID do vídeo do YouTube da URL
const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Função para gerar thumbnail do YouTube
const getYouTubeThumbnail = (videoId: string) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// GET - Listar todos os vídeos
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const videos = await db.collection("etf_videos").find({}).toArray();
    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar vídeos" },
      { status: 500 }
    );
  }
}

// POST - Criar novo vídeo
export async function POST(request: Request) {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    const { title, description, videoId } = await request.json();

    if (!title || !description || !videoId) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const thumbnail = getYouTubeThumbnail(videoId);

    const video = {
      title,
      description,
      videoId,
      thumbnail,
      active: true,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("etf_videos").insertOne(video);
    return NextResponse.json({ video: { ...video, _id: result.insertedId } });
  } catch (error) {
    console.error("Erro ao criar vídeo:", error);
    return NextResponse.json(
      { error: "Erro ao criar vídeo" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar vídeo
export async function PUT(request: Request) {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID não fornecido" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const thumbnail = updateData.videoId
      ? getYouTubeThumbnail(updateData.videoId)
      : undefined;

    const update = {
      ...updateData,
      ...(thumbnail && { thumbnail }),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("etf_videos")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Vídeo não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar vídeo:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar vídeo" },
      { status: 500 }
    );
  }
}

// DELETE - Remover vídeo
export async function DELETE(request: Request) {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID não fornecido" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db
      .collection("etf_videos")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Vídeo não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover vídeo:", error);
    return NextResponse.json(
      { error: "Erro ao remover vídeo" },
      { status: 500 }
    );
  }
}