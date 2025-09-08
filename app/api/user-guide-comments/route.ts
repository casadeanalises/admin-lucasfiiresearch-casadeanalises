import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import connectDB from "@/app/lib/mongodb";
import { UserGuideComment } from "@/app/_models/UserGuideComment";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const guideVideoId = searchParams.get("guideVideoId");

    await connectDB();

    const query = guideVideoId ? { guideVideoId } : {};
    const comments = await UserGuideComment.find(query).sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar comentários" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { content, parentId, guideVideoId } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Conteúdo do comentário é obrigatório" },
        { status: 400 }
      );
    }

    await connectDB();

    const comment = await UserGuideComment.create({
      userId,
      userName: user.username || user.firstName || "Usuário",
      userImage: user.imageUrl,
      content,
      parentId,
      guideVideoId,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return NextResponse.json(
      { error: "Erro ao criar comentário" },
      { status: 500 }
    );
  }
} 