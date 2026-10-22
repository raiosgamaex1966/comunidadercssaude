const { Pool } = require("pg");
require("dotenv").config();

const url = process.env.DATABASE_URL.replace(/[?&]sslmode=[^&]+/g, "");
const pool = new Pool({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    console.log("Conectando ao PostgreSQL do Supabase...");

    // 1. Garante que o bucket 'community-uploads' existe e é público
    await pool.query(`
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES ('community-uploads', 'community-uploads', true, null, null)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);
    console.log("✓ Bucket 'community-uploads' verificado e configurado como público!");

    // 2. Garante a política de RLS para leitura pública dos arquivos
    await pool.query(`
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
    `);
    console.log("✓ Política de leitura pública (RLS) configurada com sucesso!");

    // 3. Mostra as tabelas e colunas que guardam as URLs
    const checkColumns = await pool.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('lessons', 'materials', 'podcasts', 'courses', 'news', 'posts')
        AND column_name IN ('video_url', 'url', 'audio_url', 'cover_url', 'image_url')
      ORDER BY table_name;
    `);
    console.log("Colunas existentes no banco para salvar as URLs:");
    console.table(checkColumns.rows);
  } catch (err) {
    console.error("Erro:", err);
  } finally {
    await pool.end();
  }
}

run();
