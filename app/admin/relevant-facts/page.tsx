import { Metadata } from "next";
import RelevantFactsAdminClient from "./relevant-facts-admin-client";

export const metadata: Metadata = {
  title: "Admin - Fatos Relevantes | Casa de Análises",
  description: "Administração de Fatos Relevantes",
};

export default function RelevantFactsAdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Fatos Relevantes</h1>
      </div>
      <RelevantFactsAdminClient />
    </div>
  );
} 
