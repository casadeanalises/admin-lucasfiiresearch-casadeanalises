"use client";

import React, { useState } from "react";
import EtfVideosAdminClient from "./etf-videos-admin-client";
import EtfPDFsAdminClient from "./etf-pdfs-admin-client";

export default function AdminEtfVideosPage() {
  const [tab, setTab] = useState<"videos" | "pdfs">("videos");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Gerenciar Carteira de ETFs</h1>
        <div className="mb-8 flex gap-4 border-b border-white/20">
          <button
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${tab === "videos" ? "border-white text-white" : "border-transparent text-white/70 hover:text-white"}`}
            onClick={() => setTab("videos")}
          >
            Vídeos
          </button>
          <button
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${tab === "pdfs" ? "border-white text-white" : "border-transparent text-white/70 hover:text-white"}`}
            onClick={() => setTab("pdfs")}
          >
            PDFs
          </button>
        </div>
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
          {tab === "videos" && <EtfVideosAdminClient />}
          {tab === "pdfs" && <EtfPDFsAdminClient />}
        </div>
      </div>
    </div>
  );
} 