import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DollarSign, ChevronLeft } from "lucide-react";

export default async function LowcostVideosLayout({
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
      <div className="min-h-screen" style={{ backgroundColor: '#1e3a8a' }}>
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between py-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Low Cost
                </h1>
                <p className="text-white/80 text-lg">
                  Gerencie Vídeos e PDFs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="container mx-auto px-6 py-12">
          {children}
        </div>
      </div>
    </>
  );
}
