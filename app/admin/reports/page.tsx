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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gerenciar Relatórios
        </h1>
        <p className="text-gray-600 mb-4">
          Adicione e gerencie PDFs e vídeos de análises
        </p>
        <p className="text-gray-600"> 
          <Link href="/admin/reports-videos-player-2" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
           Gerenciar Vídeos Player 2
          </Link>
        </p>
      </div>

      <ReportsAdminClient adminEmail={adminEmail} />
    </div>
  );
}