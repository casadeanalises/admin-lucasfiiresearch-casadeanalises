import { Metadata } from "next";
import { UpdateScheduleAdminClient } from "./update-schedule-admin-client";
import { PDFAdminClient } from "./pdf-admin-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";

export const metadata: Metadata = {
  title: "Gerenciar Cronograma | Admin",
  description: "Painel administrativo para gerenciar o cronograma de atualizações.",
};

export default function UpdateScheduleAdminPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-500">
          Gerenciar Cronograma de Atualizações
        </h1>
        <p className="text-slate-400 mt-2">
          Adicione, edite ou remova atualizações e documentos do cronograma.
        </p>
      </div>

      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList>
          <TabsTrigger value="schedule">Atualizações</TabsTrigger>
          <TabsTrigger value="pdfs">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <UpdateScheduleAdminClient />
        </TabsContent>

        <TabsContent value="pdfs">
          <PDFAdminClient />
        </TabsContent>
      </Tabs>
    </div>
  );
}