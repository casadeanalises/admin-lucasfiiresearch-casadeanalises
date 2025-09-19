import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdvancedSettingsClient from "./advanced-settings-client";

export default async function AdvancedSettingsPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  const decoded = token ? await verifyJWT(token) : null;
  const adminEmail = (decoded?.email as string) ?? "";

  if (!decoded || decoded.type !== "admin") {
    redirect("/");
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section */}
        <br />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">
                Configurações Avançadas
              </h1>
              <p className="text-sm sm:text-base text-white/70 mt-1">
                Gerencie configurações avançadas do sistema
              </p>
            </div>
          </div>
        </div>

        <AdvancedSettingsClient adminEmail={adminEmail} />
      </div>
    </div>
  );
}
