import { Metadata } from "next";
import RelevantFactsAdminClient from "./relevant-facts-admin-client";

export const metadata: Metadata = {
  title: "Admin - Fatos Relevantes | Casa de Análises",
  description: "Administração de Fatos Relevantes",
};

export default function RelevantFactsAdminPage() {
  return (
    <div className="p-8">
      <RelevantFactsAdminClient />
    </div>
  );
} 
