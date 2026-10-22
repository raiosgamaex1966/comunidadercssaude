"use client";

import { useState } from "react";
import { PlusCircle, Image as ImageIcon, X, Send, Sparkles } from "lucide-react";
import { Avatar } from "@/components/Shell";
import { createPost } from "@/lib/actions";
import { FileUploadInput } from "@/components/FileUploadInput";

export function CreatePostModal({
  user,
  topics,
}: {
  user: { fullName: string; avatarUrl?: string | null; role: string };
  topics: string[];
}) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("Geral");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("content", content);
      fd.append("topic", topic);
      if (imageUrl.trim()) {
        fd.append("imageUrl", imageUrl.trim());
      }
      await createPost(fd);
      setContent("");
      setImageUrl("");
      setShowImageInput(false);
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Barra de Gatilho no Feed (Visual Moderno estilo Rede Social) */}
      <div className="card p-4 transition-all hover:border-primary/40 shadow-xs bg-card">
        <div className="flex items-center gap-3">
          <Avatar user={user} size={42} />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex-1 flex items-center justify-between rounded-2xl border border-border/80 bg-muted/40 px-4 py-3 text-left text-xs sm:text-sm text-muted-foreground hover:bg-muted hover:text-foreground hover:border-primary/40 transition cursor-pointer"
          >
            <span className="truncate">
              Compartilhe uma dúvida, dica de estudo ou novidade...
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-primary/10 border border-primary/30 px-3 py-1 text-xs font-bold text-primary shrink-0">
              <PlusCircle className="h-3.5 w-3.5" />
              Publicar
            </span>
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5 px-1 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Conecte-se com concurseiros de enfermagem e radiologia</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-xs font-bold text-primary hover:underline"
          >
            Escrever publicação →
          </button>
        </div>
      </div>

      {/* Pop-up (Modal) de Publicação */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl text-foreground animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary font-bold text-xs">
                  ✍️
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                  Criar publicação na comunidade
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-ghost p-1.5 text-muted-foreground hover:text-foreground"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Usuário e Seleção de Tema */}
              <div className="flex items-center gap-3">
                <Avatar user={user} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-foreground">
                    {user.fullName}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Tema:
                    </span>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="rounded-xl border border-border bg-muted/60 px-2.5 py-1 text-xs font-semibold text-foreground focus:border-primary outline-none transition"
                    >
                      {topics.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Área de Texto Ampla e Confortável */}
              <div>
                <textarea
                  autoFocus
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="O que você gostaria de compartilhar? Escreva sua dúvida, estratégia de estudos, questões comentadas ou notícias de editais..."
                  className="w-full rounded-2xl border border-border bg-muted/30 p-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-y min-h-[140px] placeholder:text-muted-foreground"
                  required
                />
              </div>

              {/* Imagem Opcional */}
              <div>
                {!showImageInput && !imageUrl ? (
                  <button
                    type="button"
                    onClick={() => setShowImageInput(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Adicionar imagem (link ou arquivo do PC/Celular)</span>
                  </button>
                ) : (
                  <div className="space-y-2 rounded-2xl border border-border/80 bg-muted/30 p-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <ImageIcon className="h-3.5 w-3.5 text-primary" />
                        Imagem da publicação
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl("");
                          setShowImageInput(false);
                        }}
                        className="text-[11px] text-muted-foreground hover:text-destructive"
                      >
                        Remover
                      </button>
                    </div>
                    <FileUploadInput
                      name="imageUrl"
                      defaultValue={imageUrl}
                      folder="images"
                      accept="image/*"
                      placeholder="Cole o link ou selecione foto do PC/Celular"
                      buttonText="Escolher foto"
                      onUploadComplete={(url) => setImageUrl(url)}
                    />
                  </div>
                )}
              </div>

              {/* Dica de Convivência */}
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                💡 Seja cordial com os colegas da saúde e evite publicar dados sensíveis ou materiais protegidos por direitos autorais.
              </p>

              {/* Botões de Ação */}
              <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() || loading}
                  className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:brightness-110 active:scale-95 disabled:opacity-50 transition cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{loading ? "Publicando..." : "Publicar"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
