import Link from "next/link";
import { desc, eq, gte, and } from "drizzle-orm";
import {
  ArrowRight, BookOpen, CheckCircle2, Flame, Headphones, Newspaper, PlayCircle, Radio,
  ShieldCheck, Target, Users, Video, Flag, Sparkles, ChevronRight, Play, ExternalLink
} from "lucide-react";
import { db } from "@/db";
import { mentorships, news, podcasts, posts, users, lessonProgress, courses, lessons } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { getContinueLesson, getCoursesWithProgress, getSettings } from "@/lib/queries";
import { Avatar } from "@/components/Shell";
import { firstName, fmtDate, timeAgo } from "@/lib/utils";

export const metadata = { title: "Início" };

export default async function OverviewPage() {
  const user = await requireUser();
  const [allCourses, cont, settings] = await Promise.all([
    getCoursesWithProgress(user.id),
    getContinueLesson(user.id),
    getSettings(),
  ]);

  const [ment, latestNews, latestPosts, weekly, latestPodcasts] = await Promise.all([
    db.select().from(mentorships).orderBy(desc(mentorships.scheduledAt)).limit(4),
    db.select({ id: news.id, title: news.title, kind: news.kind, createdAt: news.createdAt }).from(news).orderBy(desc(news.createdAt)).limit(5),
    db.select({ id: posts.id, content: posts.content, topic: posts.topic, createdAt: posts.createdAt, author: { fullName: users.fullName, avatarUrl: users.avatarUrl } })
      .from(posts).innerJoin(users, eq(posts.userId, users.id)).orderBy(desc(posts.createdAt)).limit(4),
    db.select({ id: lessonProgress.id }).from(lessonProgress).where(and(eq(lessonProgress.userId, user.id), gte(lessonProgress.completedAt, new Date(Date.now() - 7 * 86400000)))),
    db.select().from(podcasts).orderBy(desc(podcasts.createdAt)).limit(3),
  ]);

  const published = allCourses.filter((c) => c.status === "published");
  const totalDone = allCourses.reduce((a, c) => a + c.done, 0);
  const coursesDone = published.filter((c) => c.total > 0 && c.done === c.total).length;
  const inProgress = published.filter((c) => c.done > 0 && c.done < c.total).length;

  const totalPossibleLessons = allCourses.reduce((a, c) => a + c.total, 0);
  const overallProgressPercent = totalPossibleLessons > 0 ? Math.round((totalDone / totalPossibleLessons) * 100) : 0;

  // Data em português igual ao print: "Domingo, 18 de outubro"
  const now = new Date();
  const rawDate = now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  // Primeiro nome em MAIÚSCULAS igual ao print: "Olá, ROBSON"
  const upperFirstName = firstName(user.fullName).toUpperCase();

  // Curso a continuar (fallback no primeiro publicado se ainda não começou)
  const fallbackCourse = published[0];
  const activeCourse = cont?.course || fallbackCourse;
  const activeCourseTitle = activeCourse?.title.toUpperCase() || "CURSO PREPARATÓRIO";
  const activeNextTitle = cont?.next?.title || "Legislação do SUS e Conhecimentos Específicos";
  const activeCourseSlug = activeCourse?.slug || "sistema-unico-de-saude";
  const activeCourseTotal = cont?.total || fallbackCourse?.total || 12;
  const activeCourseDone = cont?.done || fallbackCourse?.done || 0;
  const activeCoursePercent = activeCourseTotal > 0 ? Math.round((activeCourseDone / activeCourseTotal) * 100) : 0;
  const activeNextIndex = (activeCourseDone + 1) <= activeCourseTotal ? (activeCourseDone + 1) : activeCourseTotal;

  // Destaque de mentoria para a coluna 1
  const featuredMentoria = ment[0] || {
    id: 1,
    title: "Mentoria Intensiva de Saúde e Legislação do SUS",
    description: "Revisão dos tópicos mais recorrentes nas bancas organizadoras.",
    status: "recorded",
    scheduledAt: new Date(),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* 1. Header com Saudação */}
      <div>
        <p className="text-xs font-semibold text-primary">{formattedDate}</p>
        <h1 className="mt-1 font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Olá, {upperFirstName}
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">Aqui está seu próximo passo.</p>
      </div>

      {/* 2. Banner: Missão da semana */}
      <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 shadow-sm transition hover:border-primary/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <span className="text-sm">🚩</span> Missão da semana
            </p>
            <p className="text-xs sm:text-sm font-medium text-foreground">
              SIMULADO GERAL SUS E ESPECÍFICAS EM ANDAMENTO. O resultado final sai em breve.
            </p>
          </div>
          <Link
            href="/missoes"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            Abrir missões →
          </Link>
        </div>
      </div>

      {/* 3. Grid: Continue de onde parou (2/3) + Seu progresso (1/3) */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Continue de onde parou */}
        <Link
          href={`/courses/${activeCourseSlug}${cont?.next ? `?aula=${cont.next.slug}` : ""}`}
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 lg:col-span-2 transition hover:border-primary/50"
        >
          {/* Fundo com efeito glow e gráfico */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 transition group-hover:opacity-35"
            style={{
              background: "radial-gradient(circle at 85% 45%, rgba(59, 255, 141, 0.2), transparent 60%)",
            }}
          />

          <div className="relative z-10">
            <p className="flex items-center gap-2 text-xs font-bold text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Continue de onde parou
            </p>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition max-w-lg leading-tight">
              {activeCourseTitle}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Próxima aula ({activeNextIndex} de {activeCourseTotal}): <span className="text-foreground/90 font-medium">{activeNextTitle}</span>
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
              MÓDULO 01 - INTRODUÇÃO E FUNDAMENTOS
            </p>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-border/40">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>{activeCourseDone} de {activeCourseTotal} aulas</span>
              <span className="font-semibold text-primary">{activeCoursePercent}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${Math.max(activeCoursePercent, 6)}%` }}
              />
            </div>
          </div>
        </Link>

        {/* Seu progresso */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Seu progresso</h3>

            <div className="mt-5 flex items-center gap-5">
              {/* Circular progress chart */}
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-muted/70"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-primary transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * overallProgressPercent) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-serif text-xl font-bold text-foreground">{overallProgressPercent}%</span>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">concluído</span>
                </div>
              </div>

              {/* Stats column */}
              <div className="space-y-3 min-w-0 flex-1">
                <div>
                  <p className="text-[11px] text-muted-foreground">Aulas concluídas</p>
                  <p className="font-serif text-2xl font-bold text-foreground">{totalDone}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Cursos feitos</p>
                    <p className="font-serif text-lg font-bold text-foreground">{coursesDone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Em andamento</p>
                    <p className="font-serif text-lg font-bold text-foreground">{inProgress || published.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5 border-t border-border/40 pt-3 text-[11px] leading-relaxed text-muted-foreground">
            {weekly.length > 0
              ? `${weekly.length} aula${weekly.length > 1 ? "s" : ""} concluída${weekly.length > 1 ? "s" : ""} nos últimos 7 dias. Ótimo ritmo!`
              : "Nenhuma aula concluída nos últimos 7 dias. Uma por dia já faz diferença."}
          </p>
        </div>
      </div>

      {/* 4. Seus cursos (Carrossel Horizontal com Posters Verticais) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-foreground tracking-tight">Seus cursos</h2>
          <Link href="/courses" className="text-xs font-semibold text-primary hover:underline">
            Todos os cursos →
          </Link>
        </div>

        <div className="scrollbar-thin flex gap-3.5 overflow-x-auto pb-3 pt-1">
          {published.map((c) => {
            const pct = c.total > 0 ? Math.round((c.done / c.total) * 100) : 0;
            return (
              <Link
                key={c.id}
                href={`/courses/${c.slug}`}
                className="group flex w-[210px] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/50 hover:shadow-lg"
              >
                {/* Poster / Capa Vertical estilo PH Community */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-[#132d20] to-[#091710] p-4 flex flex-col justify-between">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,255,141,0.15),transparent_70%)]" />
                  
                  {/* Badge de área / status */}
                  <div className="relative z-10 flex justify-between">
                    <span className="rounded-md border border-primary/40 bg-black/40 px-2 py-0.5 text-[10px] font-bold text-primary backdrop-blur">
                      {c.level || "Curso"}
                    </span>
                  </div>

                  {/* Ícone central com brilho esmeralda */}
                  <div className="relative z-10 flex items-center justify-center my-auto">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_24px_rgba(59,255,141,0.2)] group-hover:scale-110 transition duration-300">
                      <BookOpen className="h-8 w-8" />
                    </div>
                  </div>

                  {/* Rodapé interno do poster */}
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary/80">
                      {c.profession || c.area || "Saúde"}
                    </p>
                  </div>
                </div>

                {/* Título e Progresso */}
                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <h3 className="line-clamp-2 text-xs font-bold uppercase leading-tight text-foreground group-hover:text-primary transition">
                    {c.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2">
                    <span>{c.done}/{c.total} aulas</span>
                    <span className="font-semibold text-primary">{pct}%</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. Três colunas: Mentorias, Novidades e Na comunidade */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Coluna 1: Mentorias */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <h3 className="flex items-center gap-2 font-serif text-base font-bold text-foreground">
                <span className="text-primary text-sm">((•))</span> Mentorias
              </h3>
              <Link href="/mentorships" className="text-xs font-semibold text-primary hover:underline">
                Ver tudo →
              </Link>
            </div>

            <Link href="/mentorships" className="group mt-4 block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-gradient-to-br from-[#122b1f] to-[#07130d] p-4 flex flex-col justify-between">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,255,141,0.2),transparent_70%)]" />
                <span className="relative z-10 w-fit rounded-md bg-black/60 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary backdrop-blur">
                  {featuredMentoria.status === "upcoming" ? "Ao vivo" : "Gravada"}
                </span>

                <div className="relative z-10 my-auto text-center">
                  <p className="font-mono text-xs font-bold text-primary tracking-widest uppercase">&lt; / &gt;</p>
                  <p className="font-serif text-lg font-bold text-white group-hover:text-primary transition">
                    MENTORIA AO VIVO
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>DIA 1 · FUNDAMENTOS</span>
                  <span className="text-primary font-bold">RCS SAÚDE</span>
                </div>
              </div>

              <h4 className="mt-3 font-semibold text-xs text-foreground group-hover:text-primary transition line-clamp-1">
                {featuredMentoria.title}
              </h4>
              <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
                <span>🕒 Gravada em {fmtDate(featuredMentoria.scheduledAt)}</span> · 1H:15MIN
              </p>
            </Link>
          </div>
        </div>

        {/* Coluna 2: Novidades */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <h3 className="flex items-center gap-2 font-serif text-base font-bold text-foreground">
                <span className="text-primary text-sm">📰</span> Novidades
              </h3>
              <Link href="/novidades" className="text-xs font-semibold text-primary hover:underline">
                Notícias →
              </Link>
            </div>

            <div className="mt-3 space-y-2.5">
              {latestNews.length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center">Sem novidades por enquanto.</p>
              ) : (
                latestNews.map((n) => (
                  <Link
                    key={n.id}
                    href={`/news/${n.id}`}
                    className="group flex items-start gap-2.5 rounded-xl p-1.5 transition hover:bg-accent/40"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                      <PlayCircle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-foreground group-hover:text-primary transition">
                        {n.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {n.kind === "short" ? "Vídeo rápido" : "Artigo"} · {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Coluna 3: Na comunidade */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <h3 className="flex items-center gap-2 font-serif text-base font-bold text-foreground">
                <span className="text-primary text-sm">👥</span> Na comunidade
              </h3>
              <Link href="/community" className="text-xs font-semibold text-primary hover:underline">
                Abrir →
              </Link>
            </div>

            <div className="mt-3 space-y-3">
              {latestPosts.length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center">Ainda não há conversas.</p>
              ) : (
                latestPosts.map((p) => (
                  <Link
                    key={p.id}
                    href="/community"
                    className="group flex items-start gap-2.5 rounded-xl p-1.5 transition hover:bg-accent/40"
                  >
                    <Avatar user={p.author} size={26} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-xs font-bold text-foreground group-hover:text-primary transition">
                          {p.author.fullName}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">· {timeAgo(p.createdAt)}</span>
                      </div>
                      <p className="line-clamp-2 text-[11px] text-muted-foreground mt-0.5 leading-snug">
                        {p.content}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Destaque da semana / Como usar a plataforma */}
      <section className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Como usar a plataforma</p>
        <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-center">
            {/* Lado esquerdo */}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Destaque da semana
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
                Comece sua jornada com o RCS Prime Cursos hoje
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Cursos completos, mentorias ao vivo, materiais de apoio e uma comunidade ativa para você evoluir diariamente rumo à sua aprovação.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/courses"
                  className="rounded-xl bg-[#3bff8d] px-5 py-2.5 text-xs font-bold text-[#051b10] shadow-sm hover:brightness-110 transition"
                >
                  Ver os cursos
                </Link>
                <Link
                  href="/materials"
                  className="rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-accent/60 transition"
                >
                  Explorar materiais
                </Link>
              </div>
            </div>

            {/* Lado direito: Vídeo / Thumbnail ilustrativa */}
            <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-[#07110c] shadow-md group">
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: "radial-gradient(circle at 50% 50%, rgba(59, 255, 141, 0.25), rgba(7, 17, 12, 0.95))",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600/90 text-white shadow-xl transition group-hover:scale-110">
                  <Play className="h-6 w-6 fill-white ml-0.5" />
                </div>
                <p className="mt-3 font-serif text-sm font-bold text-white drop-shadow">
                  RCS Prime Cursos: Como Estudar pelo Edital
                </p>
                <span className="mt-1 text-[10px] font-semibold text-muted-foreground">Assista na plataforma</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
