import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/app/lib/mongodb";
import UserGuideVideo from "@/app/models/UserGuideVideo";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";

async function isAdmin() {
  try {
    const user = await currentUser();
    if (user) {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail) return false;

      const userEmail = user.emailAddresses[0]?.emailAddress;
      if (!userEmail) return false;

      if (userEmail.toLowerCase() === adminEmail.toLowerCase()) {
        return true;
      }
    }

    const cookieStore = cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (token) {
      const payload = await verifyJWT(token);
      return !!payload;
    }

    return false;
  } catch (error) {
    console.error("Erro ao verificar admin:", error);
    return false;
  }
}

export async function GET() {
  try {
    console.log("Iniciando busca de vídeos do guia do usuário...");

    await connectDB();
    console.log("Conectado ao MongoDB");

    const videos = await UserGuideVideo.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    console.log("Vídeos do guia encontrados:", videos);

    return NextResponse.json({ videos: videos || [] });
  } catch (error) {
    console.error("Erro ao buscar vídeos do guia:", error);
    return NextResponse.json(
      { videos: [], message: "Erro ao buscar vídeos do guia" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const data = await req.json();
    console.log("Dados recebidos:", data);

    const { title, description, videoId, category } = data;

    if (!title || !description || !videoId) {
      const missingFields = [];
      if (!title) missingFields.push("título");
      if (!description) missingFields.push("descrição");
      if (!videoId) missingFields.push("ID do vídeo");

      return NextResponse.json(
        {
          message: `Campos obrigatórios ausentes: ${missingFields.join(", ")}`,
          missingFields,
        },
        { status: 400 },
      );
    }

    await connectDB();

    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    const video = await UserGuideVideo.create({
      title,
      description,
      videoId,
      thumbnail,
      category: category || "Geral",
      order: data.order || 0,
      active: data.active ?? true,
    });

    console.log("Vídeo do guia criado:", video);

    return NextResponse.json(
      {
        message: "Vídeo do guia adicionado com sucesso",
        video,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar vídeo do guia:", error);
    return NextResponse.json(
      { message: "Erro ao criar vídeo do guia" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const data = await req.json();
    console.log("Dados recebidos para atualização:", data);

    const { id } = data;

    if (!id) {
      return NextResponse.json(
        { message: "ID do vídeo é obrigatório" },
        { status: 400 },
      );
    }

    await connectDB();

    const updateData: any = {};
    
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.videoId) {
      updateData.videoId = data.videoId;
      updateData.thumbnail = `https://img.youtube.com/vi/${data.videoId}/maxresdefault.jpg`;
    }
    if (data.category) updateData.category = data.category;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.active !== undefined) updateData.active = data.active;

    const video = await UserGuideVideo.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!video) {
      return NextResponse.json(
        { message: "Vídeo do guia não encontrado" },
        { status: 404 },
      );
    }

    console.log("Vídeo do guia atualizado:", video);

    return NextResponse.json({
      message: "Vídeo do guia atualizado com sucesso",
      video,
    });
  } catch (error) {
    console.error("Erro ao atualizar vídeo do guia:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar vídeo do guia" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID do vídeo é obrigatório" },
        { status: 400 },
      );
    }

    await connectDB();

    const video = await UserGuideVideo.findByIdAndDelete(id);

    if (!video) {
      return NextResponse.json(
        { message: "Vídeo do guia não encontrado" },
        { status: 404 },
      );
    }

    console.log("Vídeo do guia removido:", video);

    return NextResponse.json({
      message: "Vídeo do guia removido com sucesso",
    });
  } catch (error) {
    console.error("Erro ao remover vídeo do guia:", error);
    return NextResponse.json(
      { message: "Erro ao remover vídeo do guia" },
      { status: 500 },
    );
  }
} 