"use client";

import React, { useState } from "react";
import EtfVideosAdminClient from "./etf-videos-admin-client";
import EtfPDFsAdminClient from "./etf-pdfs-admin-client";

export default function AdminEtfVideosPage() {
  const [tab, setTab] = useState<"videos" | "pdfs">("videos");

  return (
    <div className="p-8">
      <div className="container mx-auto">
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-8">Gerenciar Carteira de ETFs</h1> */}
        <div className="mb-8 flex gap-4 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${tab === "videos" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-blue-600"}`}
            onClick={() => setTab("videos")}
          >
            Vídeos
          </button>
          <button
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${tab === "pdfs" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-blue-600"}`}
            onClick={() => setTab("pdfs")}
          >
            PDFs
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          {tab === "videos" && <EtfVideosAdminClient />}
          {tab === "pdfs" && <EtfPDFsAdminClient />}
        </div>
      </div>
    </div>
  );
} 