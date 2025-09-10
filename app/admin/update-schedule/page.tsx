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
    <div className="p-8">
      <div className="container mx-auto">
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gerenciar Cronograma de Atualizações
          </h1>
          <p className="text-gray-600">
            Adicione, edite ou remova atualizações e documentos do cronograma.
          </p>
        </div> */}

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
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