import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
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
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verifica se é admin pelo cookie
    let isUserAdmin = await checkIfAdmin();

    // Se não for admin pelo cookie, verifica pelo email
    if (!isUserAdmin) {
      const userEmail = user.emailAddresses[0]?.emailAddress;
      if (isAdmin(userEmail)) {
        isUserAdmin = true;
      }
    }

    const subscriptionPlan = user.publicMetadata.subscriptionPlan as string;
    if (!isUserAdmin && subscriptionPlan !== "basic" && subscriptionPlan !== "annualbasic") {
      return NextResponse.json(
        { error: "Necessário ter um plano ativo" },
        { status: 403 },
      );
    }

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
