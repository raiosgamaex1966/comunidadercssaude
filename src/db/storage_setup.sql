-- ==========================================================
-- Configuração do Supabase Storage para Comunidade Saúde RCS
-- ==========================================================

-- 1. Cria ou garante que o bucket 'community-uploads' é público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('community-uploads', 'community-uploads', true, null, null)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Permite que qualquer pessoa (alunos/visitantes) leia e visualize os arquivos públicos (vídeos, PDFs, áudios, imagens)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Public Access for community-uploads'
  ) THEN
    CREATE POLICY "Public Access for community-uploads"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'community-uploads');
  END IF;
END $$;
