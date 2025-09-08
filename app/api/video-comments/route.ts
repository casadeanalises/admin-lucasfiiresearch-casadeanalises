import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import connectDB from "@/app/lib/mongodb";
import { VideoComment } from "@/app/_models/VideoComment";

interface CommentData {
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  likes: string[];
  parentId?: string;
  videoId?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    await connectDB();
    
    // Se tiver videoId, filtra por ele, senão retorna todos os comentários
    const query = videoId ? { videoId } : {};
    const comments = await VideoComment.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Erro ao carregar comentários:", error);
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

    if (!userId || !user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Dados recebidos:", body);

    const { content, parentId, videoId } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Conteúdo é obrigatório" },
        { status: 400 }
      );
    }

    console.log("Conectando ao banco de dados...");
    await connectDB();
    console.log("Conexão estabelecida");

    // Remover campos undefined ou null
    const commentData: CommentData = {
      userId,
      userName: user.username || (user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Usuário"),
      userImage: user.imageUrl || "https://ui-avatars.com/api/?name=User",
      content: content.trim(),
      likes: [],
    };

    // Adicionar campos opcionais apenas se tiverem valor
    if (parentId) {
      commentData.parentId = parentId;
    }

    if (videoId) {
      commentData.videoId = videoId;
    }

    console.log("Dados do comentário:", commentData);

    const comment = await VideoComment.create(commentData);
    console.log("Comentário criado:", comment);

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Erro detalhado ao criar comentário:", error);
    
    // Verifica se é um erro do MongoDB
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Erro ao criar comentário: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno ao criar comentário" },
      { status: 500 }
    );
  }
} 