import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";

async function checkIfAdmin() {
  // Verifica o cookie de admin
  const cookieStore = cookies();
  const adminToken = cookieStore.get("admin_token")?.value;

  if (adminToken) {
    try {
      const payload = await verifyJWT(adminToken);
      if (payload && payload.type === "admin") {
        return true;
      }
    } catch (error) {
      console.error("Erro ao verificar token de admin:", error);
    }
  }

  return false;
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const videos = await db.collection("homevideos").find({}).toArray();

    console.log("Vídeos encontrados:", videos);

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar vídeos" },
      { status: 500 },
    );
  }
}
