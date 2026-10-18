import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { AnotacoesClient } from "./AnotacoesClient";

export const metadata = { title: "Anotações e Mapas Mentais" };

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; pasta?: string; fav?: string; tab?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const q = sp.q ?? "";
  const tab = sp.tab || (sp.fav ? "favoritos" : sp.pasta || "todas");

  const allNotes = await db
    .select({
      id: notes.id,
      title: notes.title,
      content: notes.content,
      folder: notes.folder,
      favorite: notes.favorite,
      updatedAt: notes.updatedAt,
    })
    .from(notes)
    .where(eq(notes.userId, user.id))
    .orderBy(desc(notes.updatedAt));

  const folders = Array.from(new Set(allNotes.map((n) => n.folder).filter(Boolean)));

  return (
    <div className="mx-auto max-w-6xl pb-16">
      <AnotacoesClient
        notesList={allNotes}
        folders={folders}
        initialQuery={q}
        initialTab={tab}
      />
    </div>
  );
}
