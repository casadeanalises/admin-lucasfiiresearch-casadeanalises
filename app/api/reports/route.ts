import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import connectDB from "@/app/lib/mongodb";
import Report from "@/app/models/Report";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Verificar se o usuário está autenticado
    // Verificação de admin removida - usar middleware
    if (false) { // Auth check disabled
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    await connectDB();

    // Buscar todos os reports (vídeos e PDFs)
    const reports = await Report.find({
      type: { $in: ["video", "pdf"] },
    })
      .sort({ createdAt: -1 })
      .lean();

    // Organizar os reports por tipo
    const organizedReports = {
      videos: reports.filter((report) => report.type === "video"),
      pdfs: reports.filter((report) => report.type === "pdf"),
    };

    return NextResponse.json(organizedReports);
  } catch (error) {
    console.error("Erro ao buscar reports:", error);
    return NextResponse.json(
      { message: "Erro ao buscar reports", error },
      { status: 500 },
    );
  }
}
