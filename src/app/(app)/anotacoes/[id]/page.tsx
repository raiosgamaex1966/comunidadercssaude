import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { MindMapEditor } from "@/components/mindmap/MindMapEditor";

export default async function NoteEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const id = Number((await params).id);
  if (isNaN(id)) notFound();

  const [n] = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, user.id)));

  if (!n) notFound();

  return (
    <MindMapEditor
      note={{
        id: n.id,
        title: n.title,
        content: n.content,
        favorite: n.favorite,
        folder: n.folder,
      }}
    />
  );
}
