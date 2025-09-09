import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import ReportsAdminClient from "./reports-admin-client";
import Link from "next/link";

export default async function ReportsPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  const decoded = token ? await verifyJWT(token) : null;
  const adminEmail = (decoded?.email as string) ?? "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Gerenciar Relatórios
          </h1>
          <p className="text-white/80 mb-4">
            Adicione e gerencie PDFs e vídeos de análises
          </p>
          <p className="text-white/80"> 
            <Link href="/admin/reports-videos-player-2" className="text-blue-300 hover:text-blue-200 transition-colors">
             Gerenciar Vídeos Player 2
            </Link>
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
          <ReportsAdminClient adminEmail={adminEmail} />
        </div>
      </div>
    </div>
  );
}