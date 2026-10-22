import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { filename, contentType, folder = "general" } = body;

    if (!filename) {
      return NextResponse.json({ error: "Nome de arquivo é obrigatório" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Configuração do Supabase Storage não encontrada" },
        { status: 500 }
      );
    }

    // Sanitiza o nome do arquivo
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    const baseName = filename
      .substring(0, filename.lastIndexOf("."))
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .toLowerCase()
      .substring(0, 50);

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const finalName = ext ? `${baseName}-${uniqueId}.${ext}` : `${baseName}-${uniqueId}`;
    const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
    const filePath = `${cleanFolder}/${finalName}`;

    // Solicita URL assinada do Supabase Storage
    const signEndpoint = `${supabaseUrl}/storage/v1/object/upload/sign/community-uploads/${filePath}`;
    const signResponse = await fetch(signEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!signResponse.ok) {
      const errText = await signResponse.text();
      console.error("Erro ao gerar URL assinada no Supabase:", errText);
      return NextResponse.json(
        { error: `Falha ao preparar upload no storage: ${errText}` },
        { status: 500 }
      );
    }

    const signData = await signResponse.json();
    const uploadUrl = `${supabaseUrl}/storage/v1${signData.url}`;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/community-uploads/${filePath}`;

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key: `community-uploads/${filePath}`,
      filename: finalName,
      contentType: contentType || "application/octet-stream",
    });
  } catch (err: any) {
    console.error("Erro na rota /api/upload/sign:", err);
    return NextResponse.json(
      { error: err?.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
