"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/_components/ui/button';
import Link from 'next/link';

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
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Nova Notificação</h1>
        <Link href="/admin/notifications">
          <Button variant="outline" type="button">Voltar</Button>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6 border border-gray-100">
        <div>
          <label className="block font-medium mb-1">Título</label>
          <div className="mb-1 text-xs text-gray-500 font-semibold">Atalhos rápidos de título</div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-[11px] text-blue-700 font-bold w-full mt-1">Vídeo</span>
            <button type="button" className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition" onClick={() => setForm({ ...form, title: 'CARTEIRA RECOMENDADA #00' })}>CARTEIRA RECOMENDADA #00</button>
            <button type="button" className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition" onClick={() => setForm({ ...form, title: 'Novo Vídeo de Teses de Investimento disponível' })}>Novo Vídeo de Teses de Investimento disponível</button>
            <button type="button" className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition" onClick={() => setForm({ ...form, title: 'Novo Vídeo de Relatório Semanal disponível' })}>Novo Vídeo de Relatório Semanal disponível</button>
            <button type="button" className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition" onClick={() => setForm({ ...form, title: 'Novo Vídeo da Carteira de ETFs disponível' })}>Novo Vídeo da Carteira de ETFs disponível</button>
            <button type="button" className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition" onClick={() => setForm({ ...form, title: 'Novo Vídeo de Low Cost disponível' })}>Novo Vídeo de Low Cost disponível</button>
            <span className="text-[11px] text-blue-700 font-bold w-full mt-2">PDF</span>
            <button type="button" className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition" onClick={() => setForm({ ...form, title: 'CARTEIRA RECOMENDADA #00' })}>CARTEIRA RECOMENDADA #00</button>
            <button type="button" className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition" onClick={() => setForm({ ...form, title: 'Novo PDF do Relatório Semanal disponível' })}>Novo PDF do Relatório Semanal disponível</button>
            <button type="button" className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition" onClick={() => setForm({ ...form, title: 'Novo PDF da Carteira de ETFs disponível' })}>Novo PDF da Carteira de ETFs disponível</button>
            <button type="button" className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition" onClick={() => setForm({ ...form, title: 'Novo PDF de Low Cost disponível' })}>Novo PDF de Low Cost disponível</button>
            <span className="text-[11px] text-blue-700 font-bold w-full mt-2">Outros</span>
            <button type="button" className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition" onClick={() => setForm({ ...form, title: 'Novo Material Educacional disponível' })}>Novo Material Educacional disponível</button>
            <button type="button" className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition" onClick={() => setForm({ ...form, title: 'Novo Anúncio disponível' })}>Novo Anúncio disponível...</button>
            <button type="button" className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition" onClick={() => setForm({ ...form, title: 'Atualização no ar! Novidades disponíveis! da v...' })}>Atualização no ar! Novidades disponíveis! da v...</button>
            <button type="button" className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition" onClick={() => setForm({ ...form, title: 'Novo Cupom de desconto disponível!' })}>Novo Cupom de desconto disponível!</button>
          </div>
          <input name="title" value={form.title} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="Ex: Novo conteúdo disponível ..." />
        </div>
        <div>
          <label className="block font-medium mb-1">Descrição</label>
          <div className="mb-1 text-xs text-gray-500 font-semibold">Atalho rápido de descrição</div>
          <div className="flex gap-2 mb-2 flex-wrap">
            <button
              type="button"
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
              onClick={() => setForm({ ...form, description: 'Confira agora!' })}
            >
              Confira agora!
            </button>
          </div>
          <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="Ex: Confira agora! ..." />
        </div>
        <div>
          <label className="block font-medium mb-1">Tipo</label>
          <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="" disabled>Escolha...</option>
            {tipos.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          {form.type === 'release' && (
            <div className="mt-2 p-2 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm rounded">
              <strong>Aviso:</strong> Essa notificação deve ser usada apenas pelo <b>desenvolvedor</b> para comunicar atualizações da plataforma.
            </div>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Icone da notificação</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="URL da imagem do ícone"
          />
          <div className="mb-1 text-xs text-gray-500 font-semibold mt-2">Atalhos rápidos de ícone</div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <button
              type="button"
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
              onClick={() => setForm({ ...form, imageUrl: 'https://i.ibb.co/SpMsvrD/1092226.png' })}
            >
              Padrão Vídeos
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
              onClick={() => setForm({ ...form, imageUrl: 'https://i.ibb.co/W440cm8Z/pdf-svg.png' })}
            >
              Padrão PDFs
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
              onClick={() => setForm({ ...form, imageUrl: 'https://i.ibb.co/BKZc3n6w/3197910.png' })}
            >
              Padrão Notícias
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
              onClick={() => setForm({ ...form, imageUrl: 'https://i.ibb.co/HTRQkVKp/3306509.png' })}
            >
              Padrão Anúncios
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
              onClick={() => setForm({ ...form, imageUrl: 'https://i.ibb.co/DD4dbNpY/4391443.png' })}
            >
              Padrão Release Notes
            </button>
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Redirecionamento do link para página (Opcional)</label>
          <div className="mb-1 text-xs text-gray-500 font-semibold">Atalhos rápidos de link</div>
          <div className="flex gap-2 mb-2 flex-wrap">
            <button
              type="button"
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
              onClick={() => setForm({ ...form, link: 'https://www.lucasfiiresearch.com.br/reports' })}
            >
              Relatório Semanal
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
              onClick={() => setForm({ ...form, link: 'https://www.lucasfiiresearch.com.br/videos' })}
            >
              Teses de Investimento
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
              onClick={() => setForm({ ...form, link: 'https://www.lucasfiiresearch.com.br/etf-videos' })}
            >
              Carteira de ETFs
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
              onClick={() => setForm({ ...form, link: 'https://www.lucasfiiresearch.com.br/lowcost' })}
            >
              Low Cost
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
              onClick={() => setForm({ ...form, link: 'https://www.lucasfiiresearch.com.br/subscription' })}
            >
              Planos
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
              onClick={() => setForm({ ...form, link: 'https://www.lucasfiiresearch.com.br/educational' })}
            >
              Material Educacional
            </button>

            <button
              type="button"
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
              onClick={() => setForm({ ...form, link: 'https://www.lucasfiiresearch.com.br/userguide' })}
            >
              Guia do Usuário
            </button>
          </div>
          <input
            name="link"
            value={form.link}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Notificação'}</Button>
      </form>
    </div>
  );
} 