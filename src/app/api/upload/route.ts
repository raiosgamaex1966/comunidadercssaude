import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Configuração do Supabase Storage não encontrada" },
        { status: 500 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const baseName = file.name
      .substring(0, file.name.lastIndexOf("."))
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .toLowerCase()
      .substring(0, 50);

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const finalName = ext ? `${baseName}-${uniqueId}.${ext}` : `${baseName}-${uniqueId}`;
    const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
    const filePath = `${cleanFolder}/${finalName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadEndpoint = `${supabaseUrl}/storage/v1/object/community-uploads/${filePath}`;
    const uploadRes = await fetch(uploadEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": file.type || "application/octet-stream",
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      return NextResponse.json(
        { error: `Falha ao salvar no storage: ${errText}` },
        { status: 500 }
      );
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/community-uploads/${filePath}`;

    return NextResponse.json({
      url: publicUrl,
      publicUrl,
      key: `community-uploads/${filePath}`,
      filename: finalName,
    });
  } catch (err: any) {
    console.error("Erro na rota /api/upload:", err);
    return NextResponse.json(
      { error: err?.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
