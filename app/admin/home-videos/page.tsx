import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { redirect } from "next/navigation";
import HomeVideosAdminClient from "./home-videos-admin-client";

export default async function HomeVideosPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  const decoded = token ? await verifyJWT(token) : null;
  
  if (!decoded || decoded.type !== "admin") {
    redirect("/");
  }

  return (
    <div className="p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gerenciar Teses de Investimento
          </h1> */}
          {/* <p className="text-gray-600">
            Adicione, edite ou remova vídeos de teses de investimento
          </p> */}
        </div>
        <HomeVideosAdminClient />
      </div>
    </div>
  );
}