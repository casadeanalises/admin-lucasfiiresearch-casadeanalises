import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { auth, clerkClient } from "@clerk/nextjs";

const ATTENDANT_EMAILS = [
  "lucasfiiresearch@gmail.com",
  "alanrochaarg2001@gmail.com",
  "lucaoag@icloud.com",
];

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const messages = await db
      .collection("contact_chat")
      .find({})
      .sort({ createdAt: 1 })
      .toArray();
    return NextResponse.json(messages || []);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return NextResponse.json({ error: "Erro ao buscar mensagens" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { db } = await connectToDatabase();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const data = await req.json();
    if (!data.content || typeof data.content !== "string") {
      return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 });
    }

    const user = await clerkClient.users.getUser(userId);
    const email = user?.emailAddresses?.[0]?.emailAddress || "";
    const isAttendant = ATTENDANT_EMAILS.includes(email);

    const message = {
      userId,
      userName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username || "Usuário",
      userImage: user?.imageUrl || "https://ui-avatars.com/api/?name=User",
      isAttendant,
      userEmail: email,
      content: data.content,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("contact_chat").insertOne(message);
    return NextResponse.json({ ...message, _id: result.insertedId });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { db } = await connectToDatabase();
    // Limpa mensagens
    await db.collection("contact_chat").deleteMany({});
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao limpar chat:", error);
    return NextResponse.json({ error: "Erro ao limpar chat" }, { status: 500 });
  }
} 