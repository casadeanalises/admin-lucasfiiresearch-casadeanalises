"use client";

import React, { useState } from "react";
import EtfVideosAdminClient from "./etf-videos-admin-client";
import EtfPDFsAdminClient from "./etf-pdfs-admin-client";

export default function AdminEtfVideosPage() {
  const [tab, setTab] = useState<"videos" | "pdfs">("videos");

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4 md:gap-6">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                Carteira de ETFs
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-white/70 mt-1">
                Gerencie vídeos e PDFs da carteira de ETFs
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1">
          <nav className="flex space-x-1">
            <button
              onClick={() => setTab("videos")}
              className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                tab === "videos"
                  ? "bg-white/20 text-white border border-white/30"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Vídeos</span>
              <span className="sm:hidden">Vídeos</span>
            </button>
            <button
              onClick={() => setTab("pdfs")}
              className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                tab === "pdfs"
                  ? "bg-white/20 text-white border border-white/30"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">PDFs</span>
              <span className="sm:hidden">PDFs</span>
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-4 sm:p-6">
          {tab === "videos" && <EtfVideosAdminClient />}
          {tab === "pdfs" && <EtfPDFsAdminClient />}
        </div>
      </div>
    </div>
  );
} 