import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Video, ChevronLeft } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  const decoded = token ? await verifyJWT(token) : null;

  if (!decoded || decoded.type !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
                Painel Administrativo - Vídeos Player 2
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gerencie seus vídeos do Vimeo
              </p>
            </div>
            
          </div>
        </div>
      </div> */}

      {children}
    </div>
  );
}