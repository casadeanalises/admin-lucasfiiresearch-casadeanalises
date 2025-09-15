import { Metadata } from "next";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UpdateScheduleAdminClient } from "./update-schedule-admin-client";
import { PDFAdminClient } from "./pdf-admin-client";

export const metadata: Metadata = {
  title: "Gerenciar Cronograma | Admin",
  description: "Painel administrativo para gerenciar o cronograma de atualizações.",
};

export default async function UpdateScheduleAdminPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  const decoded = token ? await verifyJWT(token) : null;
  const adminEmail = (decoded?.email as string) ?? "";
  
  if (!decoded || decoded.type !== "admin") {
    redirect("/");
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4 md:gap-6">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                Cronograma de Atualizações
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-white/70 mt-1">
                Gerencie atualizações e documentos do cronograma
              </p>
            </div>
          </div>
        </div>

        <UpdateScheduleAdminClient adminEmail={adminEmail} />
      </div>
    </div>
  );
}