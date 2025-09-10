"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/_components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Plus, Save, AlertTriangle } from 'lucide-react';

const tipos = [
  { value: 'video', label: 'Vídeo' },
  { value: 'pdf', label: 'PDF' },
  { value: 'noticia', label: 'Notícia/Material Educacional' },
  { value: 'anuncio', label: 'Anúncios' },
  { value: 'release', label: 'Release Notes' },
];

export default function NovaNotificacaoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: '',
    imageUrl: '',
    link: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "type" && value === "video") {
      setForm({ ...form, type: value, imageUrl: "https://i.ibb.co/SpMsvrD/1092226.png" });
    } else if (name === "type" && value === "pdf") {
      setForm({ ...form, type: value, imageUrl: "https://i.ibb.co/W440cm8Z/pdf-svg.png" });
    } else if (name === "type" && value === "noticia") {
      setForm({ ...form, type: value, imageUrl: "https://i.ibb.co/BKZc3n6w/3197910.png" });
    } else if (name === "type" && value === "release") {
      setForm({ ...form, type: value, imageUrl: "https://i.ibb.co/DD4dbNpY/4391443.png" });
    } else if (name === "type" && value === "anuncio") {
      setForm({ ...form, type: value, imageUrl: "https://i.ibb.co/HTRQkVKp/3306509.png" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, global: true }),
      });
      if (!res.ok) throw new Error('Erro ao criar notificação');
      router.push('/admin/notifications');
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">
                Nova Notificação
              </h1>
              <p className="text-sm sm:text-base text-white/70 mt-1">
                Crie uma nova notificação para os usuários
              </p>
            </div>
          </div>

          <Link href="/admin/notifications">
            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/40 transition-all duration-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        {/* Form Section */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
          <div className="p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Section */}
              <div>
                <label className="block font-medium text-white mb-3">Título</label>
                <div className="mb-3 text-xs text-white/70 font-medium">Atalhos rápidos de título</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs text-blue-300 font-bold w-full">Vídeo</span>
                  <button type="button" className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20" onClick={() => setForm({ ...form, title: 'CARTEIRA RECOMENDADA #00' })}>CARTEIRA RECOMENDADA #00</button>
                  <button type="button" className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20" onClick={() => setForm({ ...form, title: 'Novo Vídeo de Teses de Investimento disponível' })}>Novo Vídeo de Teses de Investimento disponível</button>
                  <button type="button" className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20" onClick={() => setForm({ ...form, title: 'Novo Vídeo de Relatório Semanal disponível' })}>Novo Vídeo de Relatório Semanal disponível</button>
                  <button type="button" className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20" onClick={() => setForm({ ...form, title: 'Novo Vídeo da Carteira de ETFs disponível' })}>Novo Vídeo da Carteira de ETFs disponível</button>
                  <button type="button" className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20" onClick={() => setForm({ ...form, title: 'Novo Vídeo de Low Cost disponível' })}>Novo Vídeo de Low Cost disponível</button>
                  
                  <span className="text-xs text-blue-300 font-bold w-full mt-2">PDF</span>
                  <button type="button" className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20" onClick={() => setForm({ ...form, title: 'Novo PDF do Relatório Semanal disponível' })}>Novo PDF do Relatório Semanal disponível</button>
                  <button type="button" className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20" onClick={() => setForm({ ...form, title: 'Novo PDF da Carteira de ETFs disponível' })}>Novo PDF da Carteira de ETFs disponível</button>
                  <button type="button" className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20" onClick={() => setForm({ ...form, title: 'Novo PDF de Low Cost disponível' })}>Novo PDF de Low Cost disponível</button>
                  
                  <span className="text-xs text-blue-300 font-bold w-full mt-2">Outros</span>
                  <button type="button" className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20" onClick={() => setForm({ ...form, title: 'Novo Material Educacional disponível' })}>Novo Material Educacional disponível</button>
                  <button type="button" className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20" onClick={() => setForm({ ...form, title: 'Novo Anúncio disponível' })}>Novo Anúncio disponível</button>
                  <button type="button" className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20" onClick={() => setForm({ ...form, title: 'Novo Cupom de desconto disponível!' })}>Novo Cupom de desconto disponível!</button>
                </div>
                <input 
                  name="title" 
                  value={form.title} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent" 
                  placeholder="Ex: Novo conteúdo disponível ..." 
                />
              </div>

              {/* Description Section */}
              <div>
                <label className="block font-medium text-white mb-3">Descrição</label>
                <div className="mb-3 text-xs text-white/70 font-medium">Atalho rápido de descrição</div>
                <div className="flex gap-2 mb-4 flex-wrap">
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20"
                    onClick={() => setForm({ ...form, description: 'Confira agora!' })}
                  >
                    Confira agora!
                  </button>
                </div>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent resize-none" 
                  rows={3}
                  placeholder="Ex: Confira agora! ..." 
                />
              </div>

              {/* Type Section */}
              <div>
                <label className="block font-medium text-white mb-3">Tipo</label>
                <select 
                  name="type" 
                  value={form.type} 
                  onChange={handleChange} 
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                >
                  <option value="" disabled className="bg-gray-800 text-white">Escolha...</option>
                  {tipos.map(t => <option key={t.value} value={t.value} className="bg-gray-800 text-white">{t.label}</option>)}
                </select>
                {form.type === 'release' && (
                  <div className="mt-3 p-3 bg-red-500/20 border border-red-400/30 text-red-200 text-sm rounded-lg backdrop-blur-sm">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Aviso:</strong> Essa notificação deve ser usada apenas pelo <b>desenvolvedor</b> para comunicar atualizações da plataforma.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Icon Section */}
              <div>
                <label className="block font-medium text-white mb-3">Ícone da notificação</label>
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                  placeholder="URL da imagem do ícone"
                />
                <div className="mt-3 text-xs text-white/70 font-medium">Atalhos rápidos de ícone</div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20"
                    onClick={() => setForm({ ...form, imageUrl: 'https://i.ibb.co/SpMsvrD/1092226.png' })}
                  >
                    Padrão Vídeos
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20"
                    onClick={() => setForm({ ...form, imageUrl: 'https://i.ibb.co/W440cm8Z/pdf-svg.png' })}
                  >
                    Padrão PDFs
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20"
                    onClick={() => setForm({ ...form, imageUrl: 'https://i.ibb.co/BKZc3n6w/3197910.png' })}
                  >
                    Padrão Notícias
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20"
                    onClick={() => setForm({ ...form, imageUrl: 'https://i.ibb.co/HTRQkVKp/3306509.png' })}
                  >
                    Padrão Anúncios
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20"
                    onClick={() => setForm({ ...form, imageUrl: 'https://i.ibb.co/DD4dbNpY/4391443.png' })}
                  >
                    Padrão Release Notes
                  </button>
                </div>
              </div>

              {/* Link Section */}
              <div>
                <label className="block font-medium text-white mb-3">Redirecionamento do link para página (Opcional)</label>
                <div className="mb-3 text-xs text-white/70 font-medium">Atalhos rápidos de link</div>
                <div className="flex gap-2 mb-4 flex-wrap">
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20"
                    onClick={() => setForm({ ...form, link: 'https://www.lucasfiiresearch.com.br/reports' })}
                  >
                    Relatório Semanal
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20"
                    onClick={() => setForm({ ...form, link: 'https://www.lucasfiiresearch.com.br/videos' })}
                  >
                    Teses de Investimento
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20"
                    onClick={() => setForm({ ...form, link: 'https://www.lucasfiiresearch.com.br/etf-videos' })}
                  >
                    Carteira de ETFs
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20"
                    onClick={() => setForm({ ...form, link: 'https://www.lucasfiiresearch.com.br/lowcost' })}
                  >
                    Low Cost
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20"
                    onClick={() => setForm({ ...form, link: 'https://www.lucasfiiresearch.com.br/subscription' })}
                  >
                    Planos
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20"
                    onClick={() => setForm({ ...form, link: 'https://www.lucasfiiresearch.com.br/educational' })}
                  >
                    Material Educacional
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition border border-white/20"
                    onClick={() => setForm({ ...form, link: 'https://www.lucasfiiresearch.com.br/userguide' })}
                  >
                    Guia do Usuário
                  </button>
                </div>
                <input
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                  placeholder="URL do link (opcional)"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-400/30 text-red-200 text-sm rounded-lg backdrop-blur-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/40 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Notificação
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}