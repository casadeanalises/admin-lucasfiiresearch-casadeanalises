import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, ChevronLeft } from "lucide-react";

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
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="border-b bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-6">
              <div>
                <h1 className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
                  Painel Administrativo
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Gerencie seus relatórios e conteúdos
                </p>
              </div>
            </div>

            <div className="mt-4 flex">
              <Link
                href="/admin/reports"
                className="flex items-center gap-2 rounded-t-lg border-b-2 border-blue-600 bg-blue-50 px-6 py-3 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-100"
              >
                <FileText className="h-4 w-4" />
                Gerenciar Conteúdo
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg bg-white p-6 shadow-sm">{children}</div>
        </div>
      </div>
    </>
  );
}