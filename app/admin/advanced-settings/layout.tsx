import { Metadata } from "next";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin - Configurações Avançadas | Casa de Análises",
  description: "Gerencie configurações avançadas do sistema",
};

export default async function AdvancedSettingsLayout({
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
        {/* Header Premium */}
        <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between py-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Configurações Avançadas
                </h1>
                <p className="text-white/80 text-lg">
                  Gerencie configurações avançadas do sistema
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area Premium */}
        {children}
      </div>
    </>
  );
}