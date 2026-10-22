"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload, CheckCircle2, AlertCircle, Loader2, Play, FileText, Image as ImageIcon, Headphones, X } from "lucide-react";
import { parseVideoSource } from "@/lib/video-utils";

interface FileUploadInputProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  accept?: string;
  folder?: "videos" | "images" | "materials" | "audios";
  label?: string;
  buttonText?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  onUploadComplete?: (url: string, file: File) => void;
}

export function FileUploadInput({
  name,
  defaultValue = "",
  placeholder = "Cole o link ou suba do computador",
  accept,
  folder = "materials",
  label,
  buttonText = "Subir do computador",
  helperText,
  required = false,
  className = "",
  onUploadComplete,
}: FileUploadInputProps) {
  const [value, setValue] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determina tipo para preview
  const isVideo = folder === "videos" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(value) || value.includes("/videos/");
  const isImage = folder === "images" || /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(value) || value.includes("/images/");
  const isAudio = folder === "audios" || /\.(mp3|wav|m4a|aac|ogg)(\?.*)?$/i.test(value) || value.includes("/audios/");
  const isDoc = folder === "materials" || /\.(pdf|docx?|xlsx?|pptx?|zip)(\?.*)?$/i.test(value) || value.includes("/materials/");

  const videoSource = isVideo ? parseVideoSource(value) : null;

  async function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setProgress(0);
    setUploadedFileName(file.name);

    try {
      // 1. Solicita URL assinada do Supabase Storage
      const signRes = await fetch("/api/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder,
        }),
      });

      if (!signRes.ok) {
        throw new Error("Não foi possível iniciar o upload direto. Tentando modo alternativo...");
      }

      const { uploadUrl, publicUrl } = await signRes.json();

      // 2. Faz upload direto do navegador para o Supabase com monitoramento de progresso
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            const pct = Math.round((ev.loaded / ev.total) * 100);
            setProgress(pct);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Falha no upload do arquivo (HTTP ${xhr.status})`));
          }
        };

        xhr.onerror = () => reject(new Error("Falha na conexão durante o upload."));
        xhr.send(file);
      });

      // 3. Sucesso! Define a URL pública no campo
      setValue(publicUrl);
      setProgress(100);
      onUploadComplete?.(publicUrl, file);
    } catch (err: any) {
      console.warn("Upload direto falhou, tentando fallback via API...", err);
      // Fallback via /api/upload
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);

        const fallbackRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        if (!fallbackRes.ok) {
          const errData = await fallbackRes.json();
          throw new Error(errData.error || "Erro no envio do arquivo");
        }

        const fallbackData = await fallbackRes.json();
        setValue(fallbackData.publicUrl);
        setProgress(100);
        onUploadComplete?.(fallbackData.publicUrl, file);
      } catch (fallbackErr: any) {
        setError(fallbackErr?.message || "Erro ao subir arquivo. Tente novamente.");
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleClear() {
    setValue("");
    setUploadedFileName(null);
    setError(null);
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="label">{label}</label>}

      <div className="flex flex-col sm:flex-row gap-2">
        {/* Campo de texto (permite editar a URL ou colar link externo como YouTube) */}
        <div className="relative flex-1">
          <input
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="input h-9 w-full pr-8 text-xs font-mono"
            required={required}
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              title="Limpar campo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Input file invisível */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Botão de subir arquivo do computador */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="btn-outline h-9 px-3 text-xs font-semibold shrink-0 gap-1.5 hover:border-primary hover:text-primary active:scale-95"
          title="Selecionar arquivo do computador"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Enviando {progress}%</span>
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5 text-primary" />
              <span>{buttonText}</span>
            </>
          )}
        </button>
      </div>

      {/* Barra de progresso durante upload */}
      {isUploading && (
        <div className="space-y-1 rounded-lg border border-primary/30 bg-primary/5 p-2 text-xs">
          <div className="flex justify-between font-medium text-foreground">
            <span className="truncate max-w-[200px]">Enviando: {uploadedFileName}</span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}

      {/* Badge de sucesso e Pré-visualização */}
      {value && !isUploading && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 min-w-0">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate max-w-[260px] sm:max-w-xs font-medium text-foreground">
              {uploadedFileName ? `Arquivo: ${uploadedFileName}` : "Arquivo/Link configurado"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {(isVideo || isImage || isAudio || isDoc) && (
              <button
                type="button"
                onClick={() => setPreviewOpen(!previewOpen)}
                className="font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1"
              >
                {previewOpen ? "Ocultar prévia" : "Ver prévia"}
              </button>
            )}
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] underline hover:text-foreground"
            >
              Abrir
            </a>
          </div>
        </div>
      )}

      {/* Painel expansível de pré-visualização */}
      {previewOpen && value && (
        <div className="rounded-xl border border-border bg-card p-3 shadow-md">
          {isVideo && (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              {videoSource?.type === "direct" ? (
                <video src={value} controls playsInline className="h-full w-full object-contain" />
              ) : videoSource?.type === "youtube" || videoSource?.type === "vimeo" ? (
                <iframe
                  src={videoSource.embedUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <iframe src={value} className="h-full w-full" allowFullScreen />
              )}
            </div>
          )}

          {isImage && (
            <div className="flex justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Prévia" className="max-h-48 rounded-lg object-contain shadow-sm" />
            </div>
          )}

          {isAudio && (
            <div className="p-2">
              <audio src={value} controls className="w-full" />
            </div>
          )}

          {isDoc && (
            <div className="p-3 text-center">
              <FileText className="mx-auto h-8 w-8 text-primary mb-1" />
              <p className="text-xs font-medium text-foreground">Documento pronto para download</p>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 btn-primary text-xs h-7 px-3"
              >
                Testar download
              </a>
            </div>
          )}
        </div>
      )}

      {helperText && <p className="text-[11px] text-muted-foreground">{helperText}</p>}
    </div>
  );
}
