"use client";

import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { 
  Settings, 
  Trash2, 
  Database, 
  HardDrive, 
  Cookie, 
  Globe, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  Info
} from "lucide-react";

interface AdvancedSettingsClientProps {
  adminEmail: string;
}

interface StorageInfo {
  quota: number;
  usage: number;
  available: number;
}

export default function AdvancedSettingsClient({ adminEmail }: AdvancedSettingsClientProps) {
  const [isClearing, setIsClearing] = useState(false);
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [clearOptions, setClearOptions] = useState({
    localStorage: true,
    sessionStorage: true,
    indexedDB: true,
    cacheStorage: true,
    cookies: false,
    serviceWorkers: true,
  });

  // Função para obter informações de armazenamento
  const getStorageInfo = async () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const quota = estimate.quota || 0;
        const usage = estimate.usage || 0;
        const available = quota - usage;
        
        setStorageInfo({
          quota,
          usage,
          available
        });
      }
    } catch (error) {
      console.error('Erro ao obter informações de armazenamento:', error);
    }
  };

  // Função para limpar localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      return false;
    }
  };

  // Função para limpar sessionStorage
  const clearSessionStorage = () => {
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar sessionStorage:', error);
      return false;
    }
  };

  // Função para limpar IndexedDB
  const clearIndexedDB = async () => {
    try {
      if ('indexedDB' in window) {
        // Lista todos os bancos de dados e os remove
        const databases = await indexedDB.databases();
        for (const db of databases) {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
          }
        }
        return true;
      }
      return true;
    } catch (error) {
      console.error('Erro ao limpar IndexedDB:', error);
      return false;
    }
  };

  // Função para limpar Cache Storage
  const clearCacheStorage = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        return true;
      }
      return true;
    } catch (error) {
      console.error('Erro ao limpar Cache Storage:', error);
      return false;
    }
  };

  // Função para limpar cookies
  const clearCookies = () => {
    try {
      // Remove todos os cookies do domínio atual
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      return true;
    } catch (error) {
      console.error('Erro ao limpar cookies:', error);
      return false;
    }
  };

  // Função para limpar Service Workers
  const clearServiceWorkers = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        return true;
      }
      return true;
    } catch (error) {
      console.error('Erro ao limpar Service Workers:', error);
      return false;
    }
  };

  // Função principal para limpar dados do site
  const clearSiteData = async () => {
    if (!confirm('Tem certeza que deseja limpar os dados do site? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsClearing(true);
    const results = {
      localStorage: false,
      sessionStorage: false,
      indexedDB: false,
      cacheStorage: false,
      cookies: false,
      serviceWorkers: false,
    };

    try {
      // Limpar localStorage
      if (clearOptions.localStorage) {
        results.localStorage = clearLocalStorage();
      }

      // Limpar sessionStorage
      if (clearOptions.sessionStorage) {
        results.sessionStorage = clearSessionStorage();
      }

      // Limpar IndexedDB
      if (clearOptions.indexedDB) {
        results.indexedDB = await clearIndexedDB();
      }

      // Limpar Cache Storage
      if (clearOptions.cacheStorage) {
        results.cacheStorage = await clearCacheStorage();
      }

      // Limpar cookies
      if (clearOptions.cookies) {
        results.cookies = clearCookies();
      }

      // Limpar Service Workers
      if (clearOptions.serviceWorkers) {
        results.serviceWorkers = await clearServiceWorkers();
      }

      // Verificar resultados
      const successCount = Object.values(results).filter(Boolean).length;
      const totalCount = Object.values(clearOptions).filter(Boolean).length;

      if (successCount === totalCount) {
        toast.success('Dados do site limpos com sucesso!');
        // Recarregar a página após limpeza
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(`Limpeza parcial: ${successCount}/${totalCount} itens foram limpos`);
      }

      // Atualizar informações de armazenamento
      await getStorageInfo();

    } catch (error) {
      console.error('Erro durante a limpeza:', error);
      toast.error('Erro ao limpar dados do site');
    } finally {
      setIsClearing(false);
    }
  };

  // Carregar informações de armazenamento ao montar o componente
  React.useEffect(() => {
    getStorageInfo();
  }, []);

  // Função para formatar bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <Toaster position="top-right" />
      
      {/* Storage Information */}
      {/* <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">
            <Database className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Informações de Armazenamento</h3>
        </div>

        {storageInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Usado</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatBytes(storageInfo.usage)}</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-white">Disponível</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatBytes(storageInfo.available)}</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-white">Total</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatBytes(storageInfo.quota)}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-white/70">Carregando informações de armazenamento...</p>
          </div>
        )}
      </div> */}

      {/* Clear Site Data */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-400/30">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Limpar Dados do Site</h3>
        </div>

        <div className="mb-6">
          <div className="bg-amber-500/20 border border-amber-400/30 p-4 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-200 mb-1">Aviso Importante</h4>
                <p className="text-amber-200/80 text-sm">
                  Esta ação irá limpar todos os dados armazenados localmente no navegador para este site. 
                  Isso inclui cache, dados salvos e configurações locais. Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-white mb-3">Selecione o que deseja limpar:</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={clearOptions.localStorage}
                  onChange={(e) => setClearOptions(prev => ({ ...prev, localStorage: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm">Local Storage</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={clearOptions.sessionStorage}
                  onChange={(e) => setClearOptions(prev => ({ ...prev, sessionStorage: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">Session Storage</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={clearOptions.indexedDB}
                  onChange={(e) => setClearOptions(prev => ({ ...prev, indexedDB: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm">IndexedDB</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={clearOptions.cacheStorage}
                  onChange={(e) => setClearOptions(prev => ({ ...prev, cacheStorage: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-orange-400" />
                  <span className="text-white text-sm">Cache Storage</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={clearOptions.cookies}
                  onChange={(e) => setClearOptions(prev => ({ ...prev, cookies: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-yellow-400" />
                  <span className="text-white text-sm">Cookies</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={clearOptions.serviceWorkers}
                  onChange={(e) => setClearOptions(prev => ({ ...prev, serviceWorkers: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span className="text-white text-sm">Service Workers</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={clearSiteData}
            disabled={isClearing}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isClearing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Limpando...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Limpar Dados do Site</span>
              </>
            )}
          </button>
          
          {/* <button
            onClick={getStorageInfo}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white"
          >
            <Database className="w-4 h-4" />
            <span>Atualizar Informações</span>
          </button> */}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-400/30">
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Informações Adicionais</h3>
        </div>

        <div className="space-y-3 text-sm text-white/80">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Local Storage:</strong> Dados persistentes armazenados localmente no navegador.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Session Storage:</strong> Dados temporários que são removidos quando a aba é fechada.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>IndexedDB:</strong> Banco de dados local para aplicações web complexas.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Cache Storage:</strong> Cache de recursos da aplicação para melhor performance.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Service Workers:</strong> Scripts em background que podem interceptar requisições de rede.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
