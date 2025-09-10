import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import LowcostAdminClient from "./lowcost-admin-client";

export default async function AdminLowcostVideosPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  const decoded = token ? await verifyJWT(token) : null;
  const adminEmail = (decoded?.email as string) ?? "";

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">

        <br />

        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4 md:gap-6">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                Carteira Low Cost
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-white/70 mt-1">
                Gerencie vídeos e PDFs da carteira low cost
              </p>
            </div>
          </div>
        </div>

        <LowcostAdminClient adminEmail={adminEmail} />
      </div>
    </div>
  );
} 