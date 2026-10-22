/**
 * Utilitários para detecção e formatação de vídeos (YouTube, Vimeo, arquivos diretos .mp4/.webm do Supabase).
 */

export type VideoSource =
  | { type: "direct"; url: string }
  | { type: "youtube"; url: string; embedUrl: string }
  | { type: "vimeo"; url: string; embedUrl: string }
  | { type: "iframe"; url: string };

export function parseVideoSource(rawUrl: string | null | undefined): VideoSource | null {
  if (!rawUrl || !rawUrl.trim()) return null;
  const url = rawUrl.trim();

  // 1. Arquivo direto (.mp4, .webm, .mov, ou Supabase storage)
  const isDirect =
    /\.(mp4|webm|mov|m4v|mkv|ogg)(\?.*)?$/i.test(url) ||
    url.includes("/storage/v1/object/public/community-uploads/videos/") ||
    url.includes("/community-uploads/videos/") ||
    url.startsWith("data:video/") ||
    url.startsWith("blob:");

  if (isDirect) {
    return { type: "direct", url };
  }

  // 2. YouTube
  // Formatos suportados:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  const ytMatch =
    url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const id = ytMatch[1];
    return {
      type: "youtube",
      url,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
    };
  }

  // 3. Vimeo
  // Formatos: https://vimeo.com/123456789 ou https://player.vimeo.com/video/123456789
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const id = vimeoMatch[1];
    return {
      type: "vimeo",
      url,
      embedUrl: `https://player.vimeo.com/video/${id}`,
    };
  }

  // 4. Outro iframe ou embed genérico
  return { type: "iframe", url };
}
