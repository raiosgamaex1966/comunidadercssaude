import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { ArrowLeft, Trash2 } from "lucide-react";
import { db } from "@/db";
import { courses, lessons, modules, trails } from "@/db/schema";
import { deleteCourse, deleteLesson, deleteModule, saveCourse, saveLesson, saveModule } from "@/lib/admin-actions";
import { CourseForm } from "../CourseForm";
import { FileUploadInput } from "@/components/FileUploadInput";

export default async function AdminCourseDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const [course] = await db.select().from(courses).where(eq(courses.id, id));
  if (!course) notFound();
  const [ts, mods, ls] = await Promise.all([
    db.select().from(trails).orderBy(asc(trails.position)),
    db.select().from(modules).where(eq(modules.courseId, id)).orderBy(asc(modules.position)),
    db.select().from(lessons).where(eq(lessons.courseId, id)).orderBy(asc(lessons.position)),
  ]);
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/courses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Gerir cursos</Link>
        <div className="flex gap-2"><Link href={`/courses/${course.slug}`} className="btn-outline h-9">Ver como aluno</Link><form action={deleteCourse.bind(null, id)}><button className="btn-ghost h-9 text-destructive"><Trash2 className="h-4 w-4" /> Excluir curso</button></form></div>
      </div>
      <h1 className="page-title mb-6">{course.title}</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {mods.map((m) => (
            <div key={m.id} className="card p-4">
              <div className="mb-2 flex items-center justify-between"><h3 className="font-semibold">{m.title}</h3><form action={deleteModule.bind(null, m.id, id)}><button className="text-destructive" aria-label="Excluir módulo"><Trash2 className="h-4 w-4" /></button></form></div>
              <ul className="mb-3 divide-y divide-border">
                {ls.filter((l) => l.moduleId === m.id).map((l) => (
                  <li key={l.id} className="py-2">
                    <details>
                      <summary className="flex cursor-pointer items-center justify-between text-sm"><span>{l.position}. {l.title} <span className="text-xs text-muted-foreground">· {l.durationMin} min{!l.videoUrl && " · sem vídeo"}</span></span></summary>
                      <form action={saveLesson} className="mt-2 grid gap-2 rounded-xl bg-muted p-3 sm:grid-cols-2">
                        <input type="hidden" name="id" value={l.id} /><input type="hidden" name="courseId" value={id} /><input type="hidden" name="moduleId" value={m.id} />
                        <input name="title" defaultValue={l.title} className="input h-9 sm:col-span-2" required />
                        <FileUploadInput
                          name="videoUrl"
                          defaultValue={l.videoUrl ?? ""}
                          folder="videos"
                          accept="video/*,.mp4,.webm,.mov,.m4v"
                          placeholder="URL do YouTube/Vimeo ou suba vídeo .mp4/.webm do PC"
                          buttonText="Subir vídeo"
                          className="sm:col-span-2"
                        />
                        <input name="durationMin" type="number" defaultValue={l.durationMin} placeholder="Minutos" className="input h-9" />
                        <input name="position" type="number" defaultValue={l.position} placeholder="Ordem" className="input h-9" />
                        <textarea name="description" defaultValue={l.description ?? ""} rows={2} placeholder="Descrição" className="input sm:col-span-2" />
                        <div className="flex gap-2 sm:col-span-2"><button className="btn-primary h-9">Salvar aula</button><button formAction={deleteLesson.bind(null, l.id, id)} className="btn-ghost h-9 text-destructive">Excluir</button></div>
                      </form>
                    </details>
                  </li>
                ))}
              </ul>
              <form action={saveLesson} className="mt-3 space-y-2 rounded-xl border border-dashed border-border bg-muted/20 p-3">
                <p className="text-xs font-bold text-muted-foreground">+ Adicionar nova aula a este módulo</p>
                <input type="hidden" name="courseId" value={id} /><input type="hidden" name="moduleId" value={m.id} />
                <div className="grid gap-2 sm:grid-cols-[1fr_110px]">
                  <input name="title" placeholder="Título da nova aula" className="input h-9" required />
                  <input name="durationMin" type="number" placeholder="Duração (min)" className="input h-9" />
                </div>
                <FileUploadInput
                  name="videoUrl"
                  folder="videos"
                  accept="video/*,.mp4,.webm,.mov,.m4v"
                  placeholder="Cole link (YouTube/Vimeo) ou suba vídeo .mp4 do computador"
                  buttonText="Subir vídeo do PC"
                />
                <button className="btn-outline h-9">Adicionar aula</button>
              </form>
            </div>
          ))}
          <form action={saveModule} className="card flex gap-2 p-4">
            <input type="hidden" name="courseId" value={id} />
            <input name="title" placeholder="Novo módulo" className="input h-9" required />
            <input name="position" type="number" placeholder="Ordem" className="input h-9 w-24" />
            <button className="btn-primary h-9 shrink-0">Criar módulo</button>
          </form>
        </div>
        <div className="card h-fit p-5"><h2 className="mb-3 font-serif text-lg font-semibold">Dados do curso</h2><CourseForm trails={ts} course={course} action={saveCourse} /></div>
      </div>
    </div>
  );
}
