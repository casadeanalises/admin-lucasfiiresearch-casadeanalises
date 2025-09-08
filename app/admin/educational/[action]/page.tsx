'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, User, Link as LinkIcon, FileText, AlertCircle, Bold, Italic, List, Heading } from "lucide-react";
import { useState, useEffect } from "react";
import type { IEducational } from "@/app/models/Educational";

export default function ArticleForm({ params }: { params: { action: string; slug?: string } }) {
  const router = useRouter();
  const [article, setArticle] = useState<IEducational | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState("");
  
  const isEdit = params.action === "edit";

  useEffect(() => {
    if (isEdit && params.slug) {
      fetch(`/api/educational?slug=${params.slug}`)
        .then(res => res.json())
        .then(data => {
          setArticle(data);
          setPreviewImage(data.image);
          setPreviewAvatar(data.author.avatar);
        })
        .catch(error => {
          console.error("Erro ao carregar artigo:", error);
          setError("Erro ao carregar artigo");
        });
    }
  }, [isEdit, params.slug]);

  const validateImageUrl = async (url: string) => {
    try {
      // Verifica se a URL é do imgbb
      if (!url.includes('i.ibb.co')) {
        return false;
      }

      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      return contentType?.startsWith('image/');
    } catch {
      return false;
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError("");

    const imageUrl = formData.get("image") as string;
    const isValidImage = await validateImageUrl(imageUrl);

    if (!isValidImage) {
      setError("Por favor, use uma URL de imagem válida do imgbb.com (deve começar com https://i.ibb.co/)");
      setIsLoading(false);
      return;
    }

    // Processa o conteúdo para validar as URLs das imagens
    const content = formData.get("content")?.toString().split("\n").filter(Boolean) || [];
    const processedContent: string[] = [];
    let currentBlock: string[] = [];
    let isProcessingMedia = false;
    let hasInvalidImage = false;

    for (const line of content) {
      if (line.trim() === "[IMAGEM]") {
        if (isProcessingMedia) {
          processedContent.push(currentBlock.join("\n"));
        }
        isProcessingMedia = true;
        currentBlock = [line];
      } else if (line.trim() === "[VIDEO]") {
        if (isProcessingMedia) {
          processedContent.push(currentBlock.join("\n"));
        }
        isProcessingMedia = true;
        currentBlock = [line];
      } else if (line.trim() === "[/IMAGEM]" || line.trim() === "[/VIDEO]") {
        currentBlock.push(line);
        
        // Valida URL da imagem antes de adicionar ao conteúdo processado
        if (line.trim() === "[/IMAGEM]") {
          const imageUrl = currentBlock.find(l => l.startsWith("URL:"))?.replace("URL:", "").trim();
          if (imageUrl && !imageUrl.includes('i.ibb.co')) {
            hasInvalidImage = true;
            setError("Por favor, use apenas URLs de imagem do imgbb.com (deve começar com https://i.ibb.co/)");
            setIsLoading(false);
            return;
          }
        }
        
        processedContent.push(currentBlock.join("\n"));
        isProcessingMedia = false;
        currentBlock = [];
      } else {
        if (isProcessingMedia) {
          currentBlock.push(line);
        } else {
          processedContent.push(line);
        }
      }
    }

    // Adiciona o último bloco se existir
    if (currentBlock.length > 0) {
      processedContent.push(currentBlock.join("\n"));
    }

    if (hasInvalidImage) {
      return;
    }

    const data = {
      slug: formData.get("slug"),
      title: formData.get("title"),
      description: formData.get("description"),
      image: imageUrl,
      imageCaption: formData.get("imageCaption"),
      author: {
        name: formData.get("authorName") || "Lucas FII",
        avatar: formData.get("authorAvatar") || "https://www.lucasfiiresearch.com.br/favicon.ico",
      },
      content: processedContent,
    };

    try {
      const response = await fetch(`/api/educational${isEdit ? `?slug=${params.slug}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar artigo");
      }

      router.push('/admin/educational');
    } catch (error) {
      console.error("Erro ao salvar artigo:", error);
      setError("Erro ao salvar artigo. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/educational"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para lista
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
            {isEdit ? "Editar Artigo" : "Novo Artigo"}
          </h1>
          <p className="text-gray-600">
            Preencha os campos abaixo para {isEdit ? "editar o" : "criar um novo"} artigo educacional.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(e.currentTarget));
          }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-8 space-y-8">
            {/* Seção de Informações Básicas */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b">
                Informações Básicas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Título
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      defaultValue={article?.title}
                      required
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
                      placeholder="Digite o título do artigo"
                    />
                  </div>
                  <p className="mt-1.5 text-sm text-gray-500">
                    Título principal do artigo que será exibido
                  </p>
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Slug
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="slug"
                      id="slug"
                      defaultValue={article?.slug}
                      required
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
                      placeholder="titulo-do-artigo"
                    />
                  </div>
                  <p className="mt-1.5 text-sm text-blue-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Use o mesmo nome do Título!
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Descrição
                  <span className="ml-1 text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    defaultValue={article?.description}
                    required
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors resize-none"
                    placeholder="Digite uma breve descrição do artigo (será exibida nos cards e previews)"
                  />
                </div>
                <p className="mt-1.5 text-sm text-gray-500">
                  Uma descrição curta e atraente que resuma o conteúdo do artigo
                </p>
              </div>
            </div>

            {/* Seção de Mídia */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b">
                Mídia
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    URL da Imagem Principal
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="url"
                        name="image"
                        id="image"
                        defaultValue={article?.image}
                        required
                        onChange={(e) => setPreviewImage(e.target.value)}
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
                        placeholder="https://i.ibb.co/exemplo/imagem.jpg"
                      />
                    </div>

                    {/* <p className="mt-1.5 text-sm text-blue-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Use uma URL direta de imagem (exemplo: https://i.ibb.co/exemplo/imagem.jpg)
                    </p> */}

                    {/* <p className="mt-1 text-sm text-gray-500">
                      URLs diretas compatíveis:
                    </p> */}

                    <ol className="mt-1 ml-5 text-sm text-gray-500 list-decimal">
                      
                      <li>Acesse imgbb.com</li>
                      <li>Faça upload da imagem</li>
                      <li>Em "Códigos para Incorporar"</li>
                      <li>Clique no "Links Diretos"</li>
                      <li>Copie o link</li>

                    </ol>
                    {previewImage && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="object-cover w-full h-full"
                          onError={() => setPreviewImage("")}
                        />
                      </div>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-gray-500">
                    URL da imagem principal que será exibida no topo do artigo
                  </p>
                </div>

                <div>
                  <label htmlFor="imageCaption" className="block text-sm font-medium text-gray-700 mb-1">
                    Legenda da Imagem
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="imageCaption"
                      id="imageCaption"
                      defaultValue={article?.imageCaption}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
                      placeholder="Descreva o conteúdo da imagem"
                    />
                  </div>
                  <p className="mt-1.5 text-sm text-gray-500">
                    Uma breve descrição da imagem (opcional)
                  </p>
                </div>
              </div>
            </div>

            {/* Seção do Autor */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b">
                Informações do Autor
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Nome do Autor
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="authorName"
                      id="authorName"
                      defaultValue={article?.author.name || "Lucas FII"}
                      required
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
                      placeholder="Nome do autor"
                    />
                  </div>
                  <p className="mt-1.5 text-sm text-blue-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Use o nome: Lucas FII
                  </p>
                </div>

                <div>
                  <label htmlFor="authorAvatar" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    URL do Avatar do Autor
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="url"
                        name="authorAvatar"
                        id="authorAvatar"
                        defaultValue={article?.author.avatar || "https://www.lucasfiiresearch.com.br/favicon.ico"}
                        required
                        onChange={(e) => setPreviewAvatar(e.target.value)}
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
                        placeholder="URL do avatar do autor"
                      />
                    </div>
                    <p className="mt-1.5 text-sm text-blue-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Use o link: https://www.lucasfiiresearch.com.br/favicon.ico
                    </p>
                    {previewAvatar && (
                      <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                        <img
                          src={previewAvatar}
                          alt="Avatar Preview"
                          className="object-cover w-full h-full"
                          onError={() => setPreviewAvatar("")}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de Conteúdo do Artigo */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b">
                Conteúdo do Artigo
              </h2>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Conteúdo
                  <span className="ml-1 text-red-500">*</span>
                </label>

                {/* Barra de ferramentas */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {/* Grupo de botões de mídia */}
                  <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-lg">
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement;
                        const cursorPos = textarea.selectionStart;
                        const textBefore = textarea.value.substring(0, cursorPos);
                        const textAfter = textarea.value.substring(cursorPos);
                        
                        const imageTemplate = `\n[IMAGEM]
URL: 
Legenda: 
Alinhamento: centro
[/IMAGEM]\n`;
                        
                        textarea.value = textBefore + imageTemplate + textAfter;
                        textarea.focus();
                        textarea.selectionStart = cursorPos + imageTemplate.length;
                        textarea.selectionEnd = cursorPos + imageTemplate.length;
                      }}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <ImageIcon className="w-4 h-4 mr-1.5" />
                      Inserir Imagem
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement;
                        const cursorPos = textarea.selectionStart;
                        const textBefore = textarea.value.substring(0, cursorPos);
                        const textAfter = textarea.value.substring(cursorPos);
                        
                        const videoTemplate = `\n[VIDEO]
URL: 
Legenda: 
[/VIDEO]\n`;
                        
                        textarea.value = textBefore + videoTemplate + textAfter;
                        textarea.focus();
                        textarea.selectionStart = cursorPos + videoTemplate.length;
                        textarea.selectionEnd = cursorPos + videoTemplate.length;
                      }}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FileText className="w-4 h-4 mr-1.5" />
                      Inserir Vídeo
                    </button>
                  </div>

                  {/* Grupo de botões de formatação Markdown */}
                  <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-lg">
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = textarea.value;
                        const before = text.substring(0, start);
                        const selection = text.substring(start, end);
                        const after = text.substring(end);
                        textarea.value = before + `**${selection}**` + after;
                      }}
                      title="Negrito (Ctrl+B)"
                      className="p-1.5 text-gray-700 hover:bg-gray-200 rounded"
                    >
                      <Bold className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = textarea.value;
                        const before = text.substring(0, start);
                        const selection = text.substring(start, end);
                        const after = text.substring(end);
                        textarea.value = before + `*${selection}*` + after;
                      }}
                      title="Itálico (Ctrl+I)"
                      className="p-1.5 text-gray-700 hover:bg-gray-200 rounded"
                    >
                      <Italic className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = textarea.value;
                        const before = text.substring(0, start);
                        const selection = text.substring(start, end);
                        const after = text.substring(end);
                        textarea.value = before + `# ${selection}` + after;
                      }}
                      title="Título"
                      className="p-1.5 text-gray-700 hover:bg-gray-200 rounded"
                    >
                      <Heading className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = textarea.value;
                        const before = text.substring(0, start);
                        const selection = text.substring(start, end);
                        const after = text.substring(end);
                        const bulletPoints = selection
                          .split('\n')
                          .map(line => line.trim() ? `- ${line}` : line)
                          .join('\n');
                        textarea.value = before + bulletPoints + after;
                      }}
                      title="Lista com marcadores"
                      className="p-1.5 text-gray-700 hover:bg-gray-200 rounded"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    name="content"
                    id="content"
                    rows={15}
                    defaultValue={article?.content?.join("\n")}
                    required
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors font-mono"
                    placeholder="Digite o conteúdo do artigo aqui... (um parágrafo por linha)"
                  />
                </div>

                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p className="font-medium">Instruções de formatação:</p>
                  <div className="ml-4 space-y-1">
                    <p>1. Formatação básica:</p>
                    <pre className="bg-gray-50 p-2 rounded-md text-xs">
{`**texto** = negrito
*texto* = itálico
# Título
## Subtítulo
- Item de lista
1. Lista numerada`}
                    </pre>
                    
                    <p className="mt-2">2. Para adicionar uma imagem:</p>
                    <pre className="bg-gray-50 p-2 rounded-md text-xs">
{`[IMAGEM]
URL: https://i.ibb.co/exemplo/imagem.jpg
Legenda: Descrição da imagem
Alinhamento: centro (ou: esquerda, direita)
[/IMAGEM]`}
                    </pre>
                    
                    <p className="mt-2">3. Para adicionar um vídeo:</p>
                    <pre className="bg-gray-50 p-2 rounded-md text-xs">
{`[VIDEO]
URL: https://youtube.com/watch?v=ID_DO_VIDEO
Legenda: Descrição do vídeo
[/VIDEO]`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé do Formulário */}
          <div className="bg-gray-50 px-8 py-6 flex items-center justify-end gap-4 border-t border-gray-100">
            <Link
              href="/admin/educational"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Salvando...
                </>
              ) : (
                isEdit ? 'Atualizar Artigo' : 'Criar Artigo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 