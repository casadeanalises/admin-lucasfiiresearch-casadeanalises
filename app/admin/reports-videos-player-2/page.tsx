import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { redirect } from "next/navigation";
import VideosAdminClient from "./_components/videos-admin-client";

export default async function ReportsVideosPlayer2AdminPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  const decoded = token ? await verifyJWT(token) : null;
  
  if (!decoded || decoded.type !== "admin") {
    redirect("/");
  }

  const adminEmail = decoded?.email || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Gerenciar Vídeos do Vimeo
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Adicione e gerencie vídeos do Player 2
        </p>
      </div>

      <VideosAdminClient adminEmail={adminEmail.toString()} />
    </div>
  );
}