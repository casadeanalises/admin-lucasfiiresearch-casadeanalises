import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import connectDB from "@/app/lib/mongodb";
import { Comment } from "@/app/_models/Comment";

export async function GET() {
  try {
    await connectDB();
    const comments = await Comment.find().sort({ createdAt: -1 });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao carregar comentários" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    await connectDB();
    const { content, parentId } = await request.json();

    // Primeiro tenta usar firstName e lastName, se não tiver usa username, se não tiver usa "Usuário"
    const userName = user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}`.trim()
      : user?.username || "Usuário";

    const comment = await Comment.create({
      userId,
      userName,
      userImage: user?.imageUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userName),
      content,
      parentId,
      likes: [],
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Erro detalhado:', error);
    return NextResponse.json(
      { error: "Erro ao criar comentário", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
