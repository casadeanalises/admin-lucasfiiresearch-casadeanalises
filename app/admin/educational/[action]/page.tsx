'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, User, Link as LinkIcon, FileText, AlertCircle, Bold, Italic, List, Heading, Loader2 } from "lucide-react";
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
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4 md:gap-6">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <Link
              href="/admin/educational"
              className="inline-flex items-center text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm">Voltar</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                {isEdit ? "Editar Artigo" : "Novo Artigo"}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-white/70 mt-1">
                {isEdit ? "Edite o artigo educacional" : "Crie um novo artigo educacional"}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400/30 p-3 sm:p-4 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-200 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(e.currentTarget));
          }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            {/* Seção de Informações Básicas */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white pb-2 border-b border-white/20">
                Informações Básicas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-white mb-1 flex items-center">
                    Título
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    defaultValue={article?.title}
                    required
                    className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none sm:text-sm transition-colors"
                    placeholder="Digite o título do artigo"
                    style={{ color: 'white' }}
                  />
                  <p className="mt-1.5 text-xs sm:text-sm text-white/60">
                    Título principal do artigo que será exibido
                  </p>
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-white mb-1 flex items-center">
                    Slug
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    defaultValue={article?.slug}
                    required
                    className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none sm:text-sm transition-colors"
                    placeholder="titulo-do-artigo"
                    style={{ color: 'white' }}
                  />
                  <p className="mt-1.5 text-xs sm:text-sm text-blue-200 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Use o mesmo nome do Título!
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-1 flex items-center">
                  Descrição
                  <span className="ml-1 text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  defaultValue={article?.description}
                  required
                  className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none sm:text-sm transition-colors resize-none"
                  placeholder="Digite uma breve descrição do artigo (será exibida nos cards e previews)"
                  style={{ color: 'white' }}
                />
                <p className="mt-1.5 text-xs sm:text-sm text-white/60">
                  Uma descrição curta e atraente que resuma o conteúdo do artigo
                </p>
              </div>
            </div>

            {/* Seção de Mídia */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white pb-2 border-b border-white/20">
                Mídia
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-white mb-1 flex items-center">
                    URL da Imagem Principal
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <div className="space-y-3">
                    <input
                      type="url"
                      name="image"
                      id="image"
                      defaultValue={article?.image}
                      required
                      onChange={(e) => setPreviewImage(e.target.value)}
                      className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none sm:text-sm transition-colors"
                      placeholder="https://i.ibb.co/exemplo/imagem.jpg"
                      style={{ color: 'white' }}
                    />

                    <ol className="ml-5 text-xs sm:text-sm text-white/60 list-decimal space-y-1">
                      <li>Acesse imgbb.com</li>
                      <li>Faça upload da imagem</li>
                      <li>Em "Códigos para Incorporar"</li>
                      <li>Clique no "Links Diretos"</li>
                      <li>Copie o link</li>
                    </ol>

                    {previewImage && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/20 bg-white/5">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="object-cover w-full h-full"
                          onError={() => setPreviewImage("")}
                        />
                      </div>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-white/60">
                    URL da imagem principal que será exibida no topo do artigo
                  </p>
                </div>

                <div>
                  <label htmlFor="imageCaption" className="block text-sm font-medium text-white mb-1">
                    Legenda da Imagem
                  </label>
                  <input
                    type="text"
                    name="imageCaption"
                    id="imageCaption"
                    defaultValue={article?.imageCaption}
                    className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none sm:text-sm transition-colors"
                    placeholder="Descreva o conteúdo da imagem"
                    style={{ color: 'white' }}
                  />
                  <p className="mt-1.5 text-xs sm:text-sm text-white/60">
                    Uma breve descrição da imagem (opcional)
                  </p>
                </div>
              </div>
            </div>

            {/* Seção do Autor */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white pb-2 border-b border-white/20">
                Informações do Autor
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="authorName" className="block text-sm font-medium text-white mb-1 flex items-center">
                    Nome do Autor
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    id="authorName"
                    defaultValue={article?.author.name || "Lucas FII"}
                    required
                    className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none sm:text-sm transition-colors"
                    placeholder="Nome do autor"
                    style={{ color: 'white' }}
                  />
                  <p className="mt-1.5 text-xs sm:text-sm text-blue-200 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Use o nome: Lucas FII
                  </p>
                </div>

                <div>
                  <label htmlFor="authorAvatar" className="block text-sm font-medium text-white mb-1 flex items-center">
                    URL do Avatar do Autor
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <div className="space-y-3">
                    <input
                      type="url"
                      name="authorAvatar"
                      id="authorAvatar"
                      defaultValue={article?.author.avatar || "https://www.lucasfiiresearch.com.br/favicon.ico"}
                      required
                      onChange={(e) => setPreviewAvatar(e.target.value)}
                      className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none sm:text-sm transition-colors"
                      placeholder="URL do avatar do autor"
                      style={{ color: 'white' }}
                    />
                    <p className="text-xs sm:text-sm text-blue-200 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Use o link: https://www.lucasfiiresearch.com.br/favicon.ico
                    </p>
                    {previewAvatar && (
                      <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/20 bg-white/5">
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
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white pb-2 border-b border-white/20">
                Conteúdo do Artigo
              </h2>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-white mb-1 flex items-center">
                  Conteúdo
                  <span className="ml-1 text-red-400">*</span>
                </label>

                {/* Barra de ferramentas */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {/* Grupo de botões de mídia */}
                  <div className="flex items-center gap-2 p-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
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
                      className="inline-flex items-center px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30"
                    >
                      <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                      <span className="hidden sm:inline">Inserir Imagem</span>
                      <span className="sm:hidden">Imagem</span>
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
                      className="inline-flex items-center px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30"
                    >
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                      <span className="hidden sm:inline">Inserir Vídeo</span>
                      <span className="sm:hidden">Vídeo</span>
                    </button>
                  </div>

                  {/* Grupo de botões de formatação Markdown */}
                  <div className="flex items-center gap-2 p-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
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
                      className="p-1.5 text-white hover:bg-white/20 rounded"
                    >
                      <Bold className="w-3 h-3 sm:w-4 sm:h-4" />
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
                      className="p-1.5 text-white hover:bg-white/20 rounded"
                    >
                      <Italic className="w-3 h-3 sm:w-4 sm:h-4" />
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
                      className="p-1.5 text-white hover:bg-white/20 rounded"
                    >
                      <Heading className="w-3 h-3 sm:w-4 sm:h-4" />
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
                      className="p-1.5 text-white hover:bg-white/20 rounded"
                    >
                      <List className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                <textarea
                  name="content"
                  id="content"
                  rows={15}
                  defaultValue={article?.content?.join("\n")}
                  required
                  className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none sm:text-sm transition-colors font-mono"
                  placeholder="Digite o conteúdo do artigo aqui... (um parágrafo por linha)"
                  style={{ color: 'white' }}
                />

                <div className="mt-3 space-y-2 text-xs sm:text-sm text-white/60">
                  <p className="font-medium">Instruções de formatação:</p>
                  <div className="ml-4 space-y-1">
                    <p>1. Formatação básica:</p>
                    <pre className="bg-white/10 backdrop-blur-sm border border-white/20 p-2 rounded-md text-xs">
{`**texto** = negrito
*texto* = itálico
# Título
## Subtítulo
- Item de lista
1. Lista numerada`}
                    </pre>
                    
                    <p className="mt-2">2. Para adicionar uma imagem:</p>
                    <pre className="bg-white/10 backdrop-blur-sm border border-white/20 p-2 rounded-md text-xs">
{`[IMAGEM]
URL: https://i.ibb.co/exemplo/imagem.jpg
Legenda: Descrição da imagem
Alinhamento: centro (ou: esquerda, direita)
[/IMAGEM]`}
                    </pre>
                    
                    <p className="mt-2">3. Para adicionar um vídeo:</p>
                    <pre className="bg-white/10 backdrop-blur-sm border border-white/20 p-2 rounded-md text-xs">
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
          <div className="bg-white/5 backdrop-blur-sm px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex flex-col xs:flex-row items-center justify-end gap-3 sm:gap-4 border-t border-white/10">
            <Link
              href="/admin/educational"
              className="w-full xs:w-auto inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 transition-all duration-200"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full xs:w-auto inline-flex items-center justify-center rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                isLoading
                ? 'bg-blue-400/50 cursor-not-allowed'
                : 'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 focus:ring-blue-400/50'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
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