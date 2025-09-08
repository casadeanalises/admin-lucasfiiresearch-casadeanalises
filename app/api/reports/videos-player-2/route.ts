import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { connectToDatabase } from "@/app/_lib/mongodb";
import VimeoVideo from "@/app/_models/VimeoVideo";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado para acessar os vídeos" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    try {
      console.log("[REPORTS_VIDEOS] Buscando vídeos...");
      const videos = await VimeoVideo.find().sort({ createdAt: -1 });
      console.log("[REPORTS_VIDEOS] Vídeos encontrados:", videos.length);

      if (!videos || videos.length === 0) {
        return NextResponse.json(
          { error: "Nenhum vídeo encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(videos);
    } catch (dbError) {
      console.error("[REPORTS_VIDEOS_DB_ERROR]", dbError);
      return NextResponse.json(
        { error: "Erro ao acessar o banco de dados" },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("[REPORTS_VIDEOS_GET]", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
