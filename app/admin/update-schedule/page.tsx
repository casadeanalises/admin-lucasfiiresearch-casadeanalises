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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Gerenciar Cronograma de Atualizações
          </h1>
          <p className="text-white/80">
            Adicione, edite ou remova atualizações e documentos do cronograma.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
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
      </div>
    </div>
  );
}