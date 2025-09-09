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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
     
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Gerenciar Vídeos do Vimeo
          </h1>
          <p className="text-white/80">
            Adicione e gerencie vídeos do Player 2
          </p>
        </div> */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
          <VideosAdminClient adminEmail={adminEmail.toString()} />
        </div>
    
    </div>
  );
}