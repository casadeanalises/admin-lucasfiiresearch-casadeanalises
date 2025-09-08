import { NextResponse } from "next/server";
import ytdl from "ytdl-core";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id;
    const info = await ytdl.getInfo(videoId);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });

    return NextResponse.json({ url: format.url });
  } catch (error) {
    console.error('Erro ao obter vídeo:', error);
    return NextResponse.json(
      { error: 'Erro ao obter vídeo' },
      { status: 500 }
    );
  }
} 