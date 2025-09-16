"use client";

import Link from "next/link";
import { Lock, Heart, ExternalLink, Calendar, User } from "lucide-react";

export function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10 mt-auto" style={{ backgroundColor: '#1f40af' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left Section - Links */}
            {/* <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <Link
                href="/admin/fix-auth"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                <Lock className="h-4 w-4" />
                <span className="hidden xs:inline">Restaurar Autenticação</span>
                <span className="xs:hidden">Auth</span>
              </Link>
              
              <div className="hidden sm:block w-px h-4 bg-white/20" />
              
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Calendar className="h-4 w-4" />
                <span>{currentYear}</span>
              </div>
            </div> */}

            {/* Left Section - DevRocha (menor) */}
            <div className="flex items-center gap-1 text-xs text-white/60">
              <span>Desenvolvido por</span>
              <Link
                href="https://www.devrocha.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-white/80 hover:text-blue-300 transition-colors duration-200"
              >
                <span className="font-medium">DevRocha</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            {/* Center Section - Version */}
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span className="font-medium">Site: v1.6.2</span>
            </div>

            {/* Right Section - Empty for balance */}
            <div className="w-24"></div>
          </div>

          {/* Bottom Section - Copyright */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-white/50">
                © {currentYear} Lucas FII Research L&L Consultoria/Educação Financeira LTDA, CNPJ: 60.481.320/0001-32
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
