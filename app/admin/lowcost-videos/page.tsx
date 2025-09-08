"use client";

import React, { useState } from "react";
import LowcostVideosAdminClient from "./lowcost-videos-admin-client";
import LowcostPDFsAdminClient from "./lowcost-pdfs-admin-client";

export default function AdminLowcostVideosPage() {
  const [tab, setTab] = useState<"videos" | "pdfs">("videos");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Carteira Lowcost</h1>
      <div className="mb-8 flex gap-4 border-b">
        <button
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${tab === "videos" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-600"}`}
          onClick={() => setTab("videos")}
        >
          Vídeos
        </button>
        <button
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${tab === "pdfs" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-600"}`}
          onClick={() => setTab("pdfs")}
        >
          PDFs
        </button>
      </div>
      {tab === "videos" && <LowcostVideosAdminClient />}
      {tab === "pdfs" && <LowcostPDFsAdminClient />}
    </div>
  );
} 