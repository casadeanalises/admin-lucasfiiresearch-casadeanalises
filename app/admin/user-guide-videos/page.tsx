import UserGuideVideosAdminClient from "./user-guide-videos-admin-client";

export default function UserGuideVideosAdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Gerenciar Vídeos do Guia do Usuário
          </h1>
          <p className="text-white/80">
            Adicione, edite ou remova vídeos tutoriais do guia do usuário
          </p>
        </div>
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
          <UserGuideVideosAdminClient />
        </div>
      </div>
    </div>
  );
} 