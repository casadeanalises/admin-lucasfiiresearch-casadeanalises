import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/_lib/mongodb";
import VimeoVideo from "@/app/_models/VimeoVideo";
import { checkAdminAuth, unauthorized } from "@/lib/auth-admin";

export async function GET() {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    await connectToDatabase();
    
    try {
      const videos = await VimeoVideo.find().sort({ createdAt: -1 });

      if (!videos) {
        return NextResponse.json(
          { error: "Nenhum vídeo encontrado" },
          { 
            status: 404,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      return NextResponse.json(videos, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (dbError) {
      console.error("[VIMEO_VIDEOS_DB_ERROR]", dbError);
      return NextResponse.json(
        { error: "Erro ao acessar o banco de dados" },
        { 
          status: 503,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error) {
    console.error("[VIMEO_VIDEOS_GET]", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    const body = await req.json();
    const { title, description, vimeoId } = body;

    if (!title || !vimeoId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectToDatabase();

    const video = new VimeoVideo({
      title,
      description,
      vimeoId
    });

    await video.save();

    return NextResponse.json(video);
  } catch (error) {
    console.error("[VIMEO_VIDEOS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    const url = new URL(req.url);
    const videoId = url.searchParams.get("id");

    if (!videoId) {
      return new NextResponse("Missing video ID", { status: 400 });
    }

    await connectToDatabase();
    await VimeoVideo.findByIdAndDelete(videoId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[VIMEO_VIDEOS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    const body = await req.json();
    const { id, title, description, vimeoId } = body;

    if (!id || !title || !vimeoId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectToDatabase();
    
    const updatedVideo = await VimeoVideo.findByIdAndUpdate(
      id,
      {
        title,
        description,
        vimeoId,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedVideo) {
      return new NextResponse("Video not found", { status: 404 });
    }

    return NextResponse.json(updatedVideo);
  } catch (error) {
    console.error("[VIMEO_VIDEOS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}