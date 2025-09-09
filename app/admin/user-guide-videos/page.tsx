import UserGuideVideosAdminClient from "./user-guide-videos-admin-client";

export default function UserGuideVideosAdminPage() {
  return (
    <div className="p-8">
      <div className="container mx-auto">
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gerenciar Vídeos do Guia do Usuário
          </h1>
          <p className="text-gray-600">
            Adicione, edite ou remova vídeos tutoriais do guia do usuário
          </p>
        </div> */}
        <UserGuideVideosAdminClient />
      </div>
    </div>
  );
} 