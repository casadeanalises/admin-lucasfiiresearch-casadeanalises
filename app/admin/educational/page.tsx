'use client';

import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { IEducational } from "@/app/models/Educational";

export default function AdminEducationalPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<IEducational[]>([]);

  useEffect(() => {
    fetch('/api/educational')
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(error => console.error('Erro ao carregar artigos:', error));
  }, []);

  const handleDelete = async (slug: string) => {
    if (confirm("Tem certeza que deseja excluir este artigo?")) {
      try {
        const response = await fetch(`/api/educational?slug=${slug}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          setArticles(articles.filter(article => article.slug !== slug));
        } else {
          alert("Erro ao excluir artigo");
        }
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir artigo");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Artigos Educacionais</h1>
          <Link
            href="/admin/educational/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Artigo
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Publicação
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article: IEducational) => (
                  <tr key={article.slug} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-16 h-12">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover rounded"
                          sizes="64px"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-md">
                        {article.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative h-8 w-8 flex-shrink-0">
                          <Image
                            src={article.author.avatar}
                            alt={article.author.name}
                            fill
                            className="rounded-full"
                            sizes="32px"
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {article.author.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/educational/edit/${article.slug}`}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center mr-4"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(article.slug)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}