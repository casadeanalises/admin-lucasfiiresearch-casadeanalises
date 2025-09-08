import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import ReportsAdminClient from "./reports-admin-client";
import Link from "next/link";

export default async function ReportsPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  const decoded = token ? await verifyJWT(token) : null;
  const adminEmail = decoded?.email || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Gerenciar Relatórios
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Adicione e gerencie PDFs e vídeos de análises
        </p>
        <p className="mt-1 text-sm text-gray-600"> 
          <Link href="/admin/reports-videos-player-2" className="text-blue-500 hover:text-blue-600">
           Gereciar Videos Player 2
          </Link>
        </p>
      </div>

      <ReportsAdminClient adminEmail={adminEmail} />
    </div>
  );
}