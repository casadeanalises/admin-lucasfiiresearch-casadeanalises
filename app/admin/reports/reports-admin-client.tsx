"use client";

import { useState, useRef, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import ContentManager from "./_components/content-manager";

type ReportItem = {
  id: string;
  title: string;
  description: string | null;
  author: string;
  date: string;
  time: string;
  code: string;
  type: string;
  thumbnail: string;
  premium: boolean;
  tags: string[];
  month: string;
  year: string;
  videoId?: string | null;
  url?: string | null;
  pageCount?: number | null;
  dividendYield?: string | null;
  price?: string | null;
  createdAt: string;
};

interface ReportsAdminClientProps {
  adminEmail: string;
  initialSection?: "add" | "manage";
  initialTab?: "pdf" | "video";
}

const ReportsAdminClient = ({
  adminEmail,
  initialSection = "add",
  initialTab = "pdf",
}: ReportsAdminClientProps) => {
  const [activeTab, setActiveTab] = useState<"pdf" | "video">(initialTab);
  const [activeSection, setActiveSection] = useState<"add" | "manage">(
    initialSection,
  );

  const [isLoading, setIsLoading] = useState(false);

  const [editingItem, setEditingItem] = useState<ReportItem | null>(null);

 
  const [reportData, setReportData] = useState<Partial<ReportItem>>({
    title: "",
    description: "",
    author: "Lucas FII",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString("pt-BR"),
    code: "N/D",
    type: "pdf",
    premium: false,
    tags: [],
    pageCount: 1,
  });

 
  const [videoData, setVideoData] = useState<Partial<ReportItem>>({
    title: "",
    description: "",
    author: "Lucas FII",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString("pt-BR"),
    code: "N/D",
    type: "video",
    premium: false,
    tags: [],
    videoId: "",
    url: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [videoTagInput, setVideoTagInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(
    null,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoThumbnailPreview, setVideoThumbnailPreview] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoThumbnailInputRef = useRef<HTMLInputElement>(null);

  function obterMesAtual(monthIndex?: number) {
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    if (typeof monthIndex === 'number') {
      return meses[monthIndex];
    }
    return meses[new Date().getMonth()];
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setReportData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "date") {
      setReportData((prev) => ({ ...prev, [name]: value }));
    } else {
      setReportData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !reportData.tags?.includes(tagInput.trim())) {
      setReportData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setReportData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadedFile(file);

    if (file) {
     
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

    
      const estimatedPages = Math.max(1, Math.round(file.size / 102400));
      setReportData((prev) => ({ ...prev, pageCount: estimatedPages }));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnailFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
    
      if (!reportData.url) {
        toast.error("Por favor, informe a URL do PDF");
        setIsLoading(false);
        return;
      }

   
      if (!reportData.date) {
        toast.error("Por favor, selecione uma data");
        setIsLoading(false);
        return;
      }

      
      const formattedDate = reportData.date;
      
      
      const [year, month] = formattedDate.split('-');
      if (!year || !month) {
        toast.error("Data inválida");
        setIsLoading(false);
        return;
      }
      const monthName = obterMesAtual(parseInt(month) - 1);

    
      const pdfReport = {
        title: reportData.title || "Sem título",
        description: reportData.description ?? "",
        author: reportData.author || "Lucas Fii",
        date: formattedDate,
        time: reportData.time || new Date().toLocaleTimeString("pt-BR"),
        code: reportData.code || "N/D",
        type: "pdf",
        premium: reportData.premium || false,
        tags: reportData.tags || [],
        month: monthName,
        year: year,
        url: reportData.url,
        pageCount: reportData.pageCount || 1,
      };

      
      const response = await fetch("/api/reports/pdfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pdfReport),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar PDF");
      }

      const result = await response.json();

      toast.success("PDF adicionado com sucesso!", {
        duration: 4000,
        icon: "📄",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });

     
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar PDF:", error);
      toast.error("Erro ao adicionar PDF", {
        duration: 4000,
        icon: "❌",
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteUrl = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        if (text.startsWith("http") && text.toLowerCase().endsWith(".pdf")) {
          setReportData((prev) => ({ ...prev, url: text }));
          setPreviewUrl(text);
          toast.success("URL do PDF colada com sucesso!");
        } else {
          toast.error("O texto copiado não parece ser uma URL válida de PDF");
        }
      })
      .catch((err) => {
        console.error("Erro ao acessar a área de transferência:", err);
        toast.error("Erro ao acessar a área de transferência");
      });
  };

 
  const handleVideoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setVideoData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "date") {
      setVideoData((prev) => ({ ...prev, [name]: value }));
    } else {
      setVideoData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddVideoTag = () => {
    if (
      videoTagInput.trim() &&
      !videoData.tags?.includes(videoTagInput.trim())
    ) {
      setVideoData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), videoTagInput.trim()],
      }));
      setVideoTagInput("");
    }
  };

  const handleRemoveVideoTag = (tag: string) => {
    setVideoData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleVideoInputChange = (field: string, value: string) => {
    setVideoData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVideoThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] || null;
    setVideoThumbnailFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setVideoThumbnailPreview(null);
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
    
      if (editingItem && editingItem.type === "pdf") {
        toast.error("Erro: tentando editar um PDF através do formulário de vídeo");
        console.error("Tentando editar PDF através do formulário de vídeo:", editingItem);
        setIsLoading(false);
        return;
      }
     
      if (!videoData.videoId) {
        toast.error("Por favor, informe o ID do vídeo do YouTube");
        setIsLoading(false);
        return;
      }

    
      if (!videoData.date) {
        toast.error("Por favor, selecione uma data");
        setIsLoading(false);
        return;
      }

      const formattedDate = videoData.date;
      
      
      const [year, month] = formattedDate.split('-');
      if (!year || !month) {
        toast.error("Data inválida");
        setIsLoading(false);
        return;
      }
      const monthName = obterMesAtual(parseInt(month) - 1);

      
      let videoId = videoData.videoId;
      if (videoId.includes("youtube.com") || videoId.includes("youtu.be")) {
        if (videoId.includes("youtube.com/watch?v=")) {
          const urlParams = new URLSearchParams(new URL(videoId).search);
          const idFromParams = urlParams.get("v");
          if (idFromParams) {
            videoId = idFromParams;
          }
        } else if (videoId.includes("youtu.be/")) {
          videoId = videoId.split("youtu.be/")[1]?.split("?")[0] || videoId;
        }
      }

      
      const descriptionObject = {
        description: videoData.description ?? "",
        videoId: videoId,
      };

    
      if (editingItem && editingItem.id) {
        
        const videoUpdateData = {
          id: editingItem.id,
          title: videoData.title || "Sem título",
          description: JSON.stringify(descriptionObject),
          author: videoData.author || "Lucas Fii",
          videoId: videoId,
          url: videoData.url || null,
          thumbnail: videoData.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        };

       
        const response = await fetch(`/api/reports/videos/${editingItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(videoUpdateData),
        });

        if (!response.ok) {
          throw new Error("Erro ao atualizar vídeo");
        }

        toast.success("Vídeo atualizado com sucesso!");
      } else {
       
        const videoReport = {
          title: videoData.title || "Sem título",
          description: JSON.stringify(descriptionObject),
          author: videoData.author || "Lucas Fii",
          date: formattedDate,
          time: videoData.time || new Date().toLocaleTimeString("pt-BR"),
          code: videoData.code || "N/D",
          type: "video",
          thumbnail:
            videoData.thumbnail ||
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          premium: videoData.premium || false,
          tags: Array.isArray(videoData.tags) ? videoData.tags.join(",") : "",
          month: monthName,
          year: year,
          videoId: videoId,
          url: videoData.url || null,
        };

       
        const response = await fetch("/api/reports/videos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(videoReport),
        });

        if (!response.ok) {
          throw new Error("Erro ao salvar vídeo");
        }

        toast.success("Vídeo adicionado com sucesso!", {
          duration: 4000,
          icon: "🎥",
          style: {
            background: "#4CAF50",
            color: "#fff",
          },
        });
      }

     
      resetVideoForm();
      
     
      if (editingItem) {
        setActiveSection("manage");
      }
    } catch (error) {
      console.error("Erro ao salvar vídeo:", error);
      toast.error("Erro ao adicionar vídeo", {
        duration: 4000,
        icon: "❌",
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    if (activeSection === "add") {
      console.log(
        "Renderizando formulário",
        activeTab === "pdf" ? "PDF" : "Vídeo",
      );
    }
  }, [activeTab, activeSection]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (activeSection === "manage") {
     
      setIsLoading(true);
      
     
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [activeSection, activeTab]);

 
  const handleEdit = (item: ReportItem) => {
   
    
    let itemId = item.id;
    if (typeof item.id === 'object' && item.id !== null) {
     
      if ('_id' in item.id) {
        itemId = (item.id as any)._id;
      }
    }
    
    console.log("ID do item a ser editado:", itemId, "Tipo:", typeof itemId);
    
    const safeItem = {
      ...item,
      id: itemId || "",
      title: item.title || "",
      description: item.description || "",
      author: item.author || "Lucas FII",
      date: item.date || new Date().toISOString().split('T')[0],
      time: item.time || new Date().toLocaleTimeString("pt-BR"),
      code: item.code || "N/D",
      type: item.type || (activeTab === "pdf" ? "pdf" : "video"),
      premium: item.premium || false,
      tags: Array.isArray(item.tags) ? item.tags : [],
      videoId: item.videoId || "",
      url: item.url || "",
    };
    
    console.log("Item a ser editado:", safeItem);
    console.log("Tipo do item:", safeItem.type);
    
    setEditingItem(safeItem);

   
    if (activeTab === "pdf" || safeItem.type === "pdf") {
      console.log("Configurando para edição de PDF");
      setActiveTab("pdf");
      setReportData({
        id: safeItem.id,
        title: safeItem.title,
        description: safeItem.description,
        author: safeItem.author,
        date: safeItem.date,
        time: safeItem.time,
        code: safeItem.code,
        type: "pdf",
        premium: safeItem.premium,
        tags: safeItem.tags,
        pageCount: safeItem.pageCount || 1,
        url: safeItem.url,
        thumbnail: safeItem.thumbnail,
      });

     
      if (safeItem.thumbnail) {
        setThumbnailPreview(safeItem.thumbnail);
      }
    }
    
    else {
      setActiveTab("video");
      
    
      let parsedDescription = safeItem.description;
      try {
        if (typeof safeItem.description === 'string' && safeItem.description.includes('description')) {
          
          try {
            const descObj = JSON.parse(safeItem.description);
            if (descObj && descObj.description) {
              parsedDescription = descObj.description;
            }
          } catch (e) {
            
            const match = safeItem.description.match(/"description"\s*:\s*"([^"]+)"/);
            if (match && match[1]) {
              parsedDescription = match[1];
            }
          }
        }
      } catch (e) {
        console.log("Erro ao processar descrição:", e);
        
      }
      
      setVideoData({
        id: safeItem.id,
        title: safeItem.title,
        description: parsedDescription,
        author: safeItem.author,
        date: safeItem.date,
        time: safeItem.time,
        code: safeItem.code,
        type: "video",
        tags: safeItem.tags,
        videoId: safeItem.videoId,
        url: safeItem.url,
      });

      
      if (safeItem.thumbnail) {
        setVideoThumbnailPreview(safeItem.thumbnail);
      }
    }

  
    setActiveSection("add");
  };

 
  const updatePdf = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
     
      const pdfId = reportData.id;
      
      if (!pdfId) {
        toast.error("ID do PDF não encontrado");
        setIsLoading(false);
        return;
      }

      console.log("ID do PDF a ser atualizado:", pdfId);
      
     
      const pdfUpdateData: any = {
        id: pdfId,
        title: reportData.title || "",
        description: reportData.description || "",
        author: reportData.author || "Lucas Fii",
        date: reportData.date || new Date().toISOString().split('T')[0],
        time: reportData.time || new Date().toLocaleTimeString("pt-BR"),
        code: reportData.code || "N/D",
        type: "pdf",
        premium: reportData.premium || false,
        tags: Array.isArray(reportData.tags) ? reportData.tags : [],
        url: uploadedFile
          ? await simulateFileUpload(uploadedFile)
          : reportData.url || "",
        thumbnail: thumbnailFile
          ? await simulateFileUpload(thumbnailFile)
          : reportData.thumbnail || "",
        pageCount: reportData.pageCount || 1,
      };

     
      if (pdfUpdateData.date) {
        const [year, month] = pdfUpdateData.date.split('-');
        if (year && month) {
          pdfUpdateData.month = obterMesAtual(parseInt(month) - 1);
          pdfUpdateData.year = year;
        }
      }
      
      console.log("Dados a serem enviados para atualização:", JSON.stringify(pdfUpdateData, null, 2));
      
   
      const url = `/api/reports/pdfs/${pdfId}`;
      
   
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pdfUpdateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resposta de erro:", response.status, errorText);
        throw new Error(`Erro ao atualizar PDF: ${response.status} ${response.statusText}`);
      }

      toast.success("PDF atualizado com sucesso!", {
        duration: 4000,
        icon: "📄",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
      resetForm();
      
     
      setActiveSection("manage");
    } catch (error) {
      console.error("Erro detalhado na atualização:", error);
      toast.error("Erro ao atualizar PDF", {
        duration: 4000,
        icon: "❌",
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };


  const updateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      
      const videoId = videoData.id;
      
      if (!videoId) {
        toast.error("ID do vídeo não encontrado");
        setIsLoading(false);
        return;
      }

      
      const descriptionObject = {
        description: videoData.description || "",
        videoId: videoData.videoId || "",
      };

      
      const videoUpdateData = {
        id: videoId,
        title: videoData.title || "",
        description: JSON.stringify(descriptionObject),
        author: videoData.author || "Lucas Fii",
        date: videoData.date || new Date().toISOString().split('T')[0],
        time: videoData.time || new Date().toLocaleTimeString("pt-BR"),
        code: videoData.code || "N/D",
        type: "video",
        tags: Array.isArray(videoData.tags) ? videoData.tags : [],
        videoId: videoData.videoId || "",
        url: videoData.url || "",
        thumbnail: videoThumbnailFile
          ? await simulateFileUpload(videoThumbnailFile)
          : videoData.thumbnail || "",
      };

      const url = `/api/reports/videos/${videoId}`;

    
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoUpdateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao atualizar vídeo: ${response.status} ${response.statusText}`);
      }

      toast.success("Vídeo atualizado com sucesso!", {
        duration: 4000,
        icon: "🎥",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
      resetVideoForm();
      
      
      setActiveSection("manage");
    } catch (error) {
      console.error("Erro detalhado:", error);
      toast.error("Erro ao atualizar vídeo", {
        duration: 4000,
        icon: "❌",
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

 
  const simulateFileUpload = async (file: File): Promise<string> => {
   
    return URL.createObjectURL(file);
  };


  const resetForm = () => {
    setReportData({
      title: "",
      description: "",
      author: "Lucas Fii",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString("pt-BR"),
      code: "N/D",
      type: "pdf",
      premium: false,
      tags: [],
      pageCount: 1,
    });

   
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    setUploadedFile(null);
    setThumbnailFile(null);
    setPreviewUrl(null);
    setThumbnailPreview(null);
    setEditingItem(null);
  };

  
  const resetVideoForm = () => {
    setVideoData({
      title: "",
      description: "",
      author: "Lucas Fii",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString("pt-BR"),
      code: "N/D",
      type: "video",
      premium: false,
      tags: [],
      videoId: "",
      url: "",
    });

   
    if (videoThumbnailInputRef.current)
      videoThumbnailInputRef.current.value = "";
    setVideoThumbnailFile(null);
    setVideoThumbnailPreview(null);
    setEditingItem(null);
  };

 
  const handleSwitchToManage = () => {
    setActiveSection("manage");
   
    setIsLoading(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <Toaster position="top-right" />
      
      {/* Tabs Navigation */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1">
        <nav className="flex space-x-1">
          <button
            onClick={() => setActiveTab("pdf")}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "pdf"
                ? "bg-white/20 text-white border border-white/30"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="hidden sm:inline">{activeSection === "add" ? "Adicionar PDF" : "Gerenciar PDFs"}</span>
            <span className="sm:hidden">PDFs</span>
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "video"
                ? "bg-white/20 text-white border border-white/30"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span className="hidden sm:inline">{activeSection === "add" ? "Adicionar Vídeo" : "Gerenciar Vídeos"}</span>
            <span className="sm:hidden">Vídeos</span>
          </button>
        </nav>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={() => {
            setActiveSection("add");
            setEditingItem(null);
         
            if (activeTab === "pdf") {
              resetForm();
            } else {
              resetVideoForm();
            }
          }}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeSection === "add"
              ? "bg-white/20 text-white border border-white/30"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
          }`}
          disabled={isLoading}
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          {isLoading && activeSection === "add" ? (
            <span className="inline-flex items-center">
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processando...
            </span>
          ) : (
            "Adicionar Novo"
          )}
        </button>
        <button
          onClick={handleSwitchToManage}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeSection === "manage"
              ? "bg-white/20 text-white border border-white/30"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
          }`}
          disabled={isLoading}
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
          {isLoading && activeSection === "manage" ? (
            <span className="inline-flex items-center">
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Carregando...
            </span>
          ) : (
            "Gerenciar Existentes"
          )}
        </button>
      </div>
      
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center text-sm text-white/70">
            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Carregando, por favor aguarde...
          </div>
        </div>
      )}

      {activeSection === "add" ? (
       
        <>
          {activeTab === "pdf" ? (

            // ==== Formulário para adicionar PDF ====
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-4 sm:p-6">
              <div className="mb-4 sm:mb-6 flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  {editingItem ? "Editar PDF" : "Adicionar Novo PDF"}
                </h3>
                {editingItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      resetForm();
                    }}
                    className="inline-flex items-center rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Novo PDF
                  </button>
                )}
              </div>
                
              {editingItem && (
                <div className="mb-4 sm:mb-6 rounded-md bg-blue-500/20 border border-blue-400/30 p-3 sm:p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-xs sm:text-sm text-blue-200">
                        Você está editando um PDF existente. Após concluir as alterações, clique em "Atualizar PDF".
                      </p>
                    </div>
                  </div>
                </div>
              )}
                
              <form className="space-y-3 sm:space-y-4" onSubmit={editingItem ? updatePdf : handleSubmit}>
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-white mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={reportData.title}
                      onChange={handleChange}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                      placeholder="Digite o título do PDF"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-medium text-white mb-2">
                      Autor
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={reportData.author}
                      onChange={handleChange}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                      placeholder="Nome do autor"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-white mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={reportData.date || ""}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-white mb-2">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={reportData.description ?? ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                    placeholder="Descrição do PDF"
                  />
                </div>

                <div className="border-t border-white/20 pt-4">
                  <h4 className="mb-3 text-sm sm:text-base font-medium text-white">
                    Arquivo PDF
                  </h4>

                  <div>
                    <label className="block text-sm sm:text-base font-medium text-white mb-2">
                      URL do PDF
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        name="url"
                        value={reportData.url || ""}
                        onChange={handleChange}
                        placeholder="https://exemplo.com/documento.pdf"
                        className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-l-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={handlePasteUrl}
                        className="bg-white/10 hover:bg-white/20 text-white border border-l-0 border-white/20 rounded-r-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200"
                      >
                        Colar
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-white/60">
                      Por favor, informe a URL do PDF.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                  {editingItem && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection("manage");
                        resetForm();
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                      </svg>
                      Voltar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 text-sm font-medium text-white border-blue-400/30 hover:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center">
                        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Salvando...
                      </span>
                    ) : (
                      editingItem ? "Atualizar PDF" : "Salvar PDF"
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            
            // ==== Formulário para adicionar vídeo ====
          
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-4 sm:p-6">
              <div className="mb-4 sm:mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm border border-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    {editingItem ? "Editar Vídeo" : "Adicionar Novo Vídeo"}
                  </h3>
                </div>
                {editingItem && (
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        resetVideoForm();
                      }}
                      className="inline-flex items-center rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Novo Vídeo
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-4 sm:mb-6 rounded-md bg-blue-500/20 border border-blue-400/30 p-3 sm:p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-xs sm:text-sm text-blue-200">
                      {editingItem 
                        ? "Você está editando um vídeo existente. Após concluir as alterações, clique em 'Atualizar Vídeo'."
                        : "Preencha os campos abaixo para adicionar um novo vídeo. Todos os campos marcados com * são obrigatórios."}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={editingItem ? updateVideo : handleVideoSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-white mb-2">
                      Título <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="videoTitle"
                      placeholder="Digite o título do vídeo"
                      value={videoData.title || ""}
                      onChange={(e) => {
                        handleVideoChange(e);
                      }}
                      required
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-medium text-white mb-2">
                      Autor <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={videoData.author}
                      onChange={handleVideoChange}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                      placeholder="Nome do autor"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-white mb-2">
                      ID do Vídeo no YouTube <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="videoId"
                        id="videoId"
                        placeholder="Digite o ID do vídeo do YouTube"
                        value={videoData.videoId || ""}
                        onChange={(e) => {
                          handleVideoChange(e);
                        }}
                        required
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 pl-10 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                      />
                    </div>
                    <p className="mt-2 text-xs text-white/60">Ex: QazC70mLExI</p>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-medium text-white mb-2">
                      URL do PDF do Relatório
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="url"
                        value={videoData.url || ""}
                        onChange={(e) => {
                          handleVideoChange(e);
                        }}
                        placeholder="https://exemplo.com/documento.pdf"
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 pl-10 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                      />
                    </div>
                    <p className="mt-2 text-xs text-white/60">Opcional. Link direto para o PDF relacionado ao vídeo</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-white mb-2">
                    Data <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <input
                      type="date"
                      name="date"
                      value={videoData.date || ""}
                      onChange={handleVideoChange}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 pl-10 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs text-white/60">Data de publicação do vídeo</p>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-white mb-2">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={videoData.description ?? ""}
                    onChange={handleVideoChange}
                    rows={3}
                    placeholder="Digite uma descrição detalhada para o vídeo"
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                  />
                  <p className="mt-2 text-xs text-white/60">Forneça uma descrição clara do conteúdo do vídeo</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                  {editingItem && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection("manage");
                        resetVideoForm();
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                      </svg>
                      Voltar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 text-sm font-medium text-white border-blue-400/30 hover:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center">
                        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Salvando...
                      </span>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {editingItem ? "Atualizar Vídeo" : "Salvar Vídeo"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      ) : (
        
        <ContentManager
          activeTab={activeTab}
          onEdit={handleEdit}
          onSetAddMode={() => setActiveSection("add")}
        />
      )}
    </div>
  );
};

export default ReportsAdminClient;
