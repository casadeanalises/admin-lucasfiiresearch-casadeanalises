import { Metadata } from "next";
import RelevantFactsAdminClient from "./relevant-facts-admin-client";

export const metadata: Metadata = {
  title: "Admin - Fatos Relevantes | Casa de Análises",
  description: "Administração de Fatos Relevantes",
};

export default function RelevantFactsAdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Fatos Relevantes</h1>
        </div>
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
          <RelevantFactsAdminClient />
        </div>
      </div>
    </div>
  );
} 
