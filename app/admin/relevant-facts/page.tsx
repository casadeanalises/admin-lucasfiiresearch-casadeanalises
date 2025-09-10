import { Metadata } from "next";
import RelevantFactsAdminClient from "./relevant-facts-admin-client";

export const metadata: Metadata = {
  title: "Admin - Fatos Relevantes | Casa de Análises",
  description: "Administração de Fatos Relevantes",
};

export default function RelevantFactsAdminPage() {
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      {/* <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8"> */}

        <br />

        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4 md:gap-6">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                Fatos Relevantes
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-white/70 mt-1">
                Gerencie documentos e informações importantes
              </p>
            </div>
          </div>
        </div>

        <RelevantFactsAdminClient />
      {/* </div> */}
    </div>
  );
} 
