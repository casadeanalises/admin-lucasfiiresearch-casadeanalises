import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, ChevronLeft } from "lucide-react";

export default async function RelevantFactsLayout({
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
       
        {/* <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between py-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Fatos Relevantes
                </h1>
                <p className="text-white/80 text-lg">
                  Gerencie os fatos relevantes da empresa
                </p>
              </div>
            </div>

            
            <div className="mt-6 flex">
              <Link
                href="/admin/relevant-facts"
                className="group flex items-center gap-3 rounded-xl bg-white/20 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/30 hover:shadow-lg border border-white/30"
              >
                <FileText className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                Gerenciar Fatos Relevantes
              </Link>
            </div>
          </div>
        </div> */}

        {/* Content Area Premium */}
        <div className="container mx-auto px-6 py-12">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
