import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { auth, clerkClient } from "@clerk/nextjs";

export async function GET() {
  const { db } = await connectToDatabase();
  const comments = await db
    .collection("etf_comments")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  const { db } = await connectToDatabase();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const data = await req.json();
  if (!data.content || typeof data.content !== "string") {
    return NextResponse.json({ error: "Comentário inválido" }, { status: 400 });
  }

  // Buscar dados reais do usuário Clerk
  const user = await clerkClient.users.getUser(userId);

  const comment = {
    userId,
    userName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username || "Usuário",
    userImage: user?.imageUrl || "https://ui-avatars.com/api/?name=User",
    content: data.content,
    likes: [],
    parentId: data.parentId || null,
    createdAt: new Date().toISOString(),
  };
  const result = await db.collection("etf_comments").insertOne(comment);
  return NextResponse.json({ ...comment, _id: result.insertedId });
} 
