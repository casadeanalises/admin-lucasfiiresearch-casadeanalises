import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { RelevantFactComment } from "@/app/_models/RelevantFactComment";

export async function GET() {
  try {
    await connectToDatabase();
    const comments = await RelevantFactComment.find().sort({ createdAt: -1 });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return NextResponse.json({ error: "Erro ao buscar comentários" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { content, parentId } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "Conteúdo é obrigatório" }, { status: 400 });
    }

    await connectToDatabase();

    // Usando o nome completo do usuário (firstName + lastName)
    const userName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.firstName 
      ? user.firstName 
      : "Usuário";

    const comment = new RelevantFactComment({
      userId,
      userName,
      userImage: user.imageUrl,
      content: content.trim(),
      parentId: parentId || null,
      likes: [],
    });

    await comment.save();
    return NextResponse.json(comment);
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return NextResponse.json({ error: "Erro ao criar comentário" }, { status: 500 });
  }
} 