import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getCoursesWithProgress, getContinueLesson } from "@/lib/queries";
import {
  Play, BookOpen, Clock, CheckCircle2, Search, ArrowRight,
  Sparkles, ShieldCheck, HeartPulse, Stethoscope, Microscope, Brain, Landmark
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SortSelect } from "@/components/SortSelect";

export const metadata = { title: "Cursos" };

const FILTER_STATES = [
  { k: "all", l: "Todos" },
  { k: "progress", l: "Em andamento" },
  { k: "done", l: "Concluídos" },
  { k: "new", l: "Não iniciados" },
  { k: "soon", l: "Em breve" },
];

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string; sort?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const q = (sp.q ?? "").toLowerCase().trim();
  const estado = sp.estado ?? "all";
  const sort = sp.sort ?? "recent";

  const [all, cont] = await Promise.all([
    getCoursesWithProgress(user.id),
    getContinueLesson(user.id),
  ]);

  // Filtro
  const filtered = all.filter((c) => {
    if (q && !`${c.title} ${c.description ?? ""} ${c.profession ?? ""}`.toLowerCase().includes(q)) return false;
    const isSoon = c.status === "coming_soon";
    const done = c.total > 0 && c.done === c.total;
    if (estado === "soon") return isSoon;
    if (estado === "progress") return c.done > 0 && !done && !isSoon;
    if (estado === "done") return done;
    if (estado === "new") return c.done === 0 && !isSoon;
    return true;
  });

  // Ordenação
  if (sort === "title") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "progress") {
    filtered.sort((a, b) => {
      const pctA = a.total ? a.done / a.total : 0;
      const pctB = b.total ? b.done / b.total : 0;
      return pctB - pctA;
    });
  }

  // Cursos em andamento para o carrossel "Continuar assistindo"
  const inProgressCourses = all.filter((c) => c.status === "published");
  const activeCourse = cont?.course || inProgressCourses[0];
  const activeCourseTitle = activeCourse?.title.toUpperCase() || "SISTEMA ÚNICO DE SAÚDE (SUS)";
  const activeCourseSlug = activeCourse?.slug || "sistema-unico-de-saude";

  // Trilhas temáticas
  const trilhaBase = all.filter((c) => c.area === "comum");
  const trilhaEspecifica = all.filter((c) => c.area === "especifico");

  // Cursos "Em breve"
  const upcomingCourses = [
    {
      id: 991,
      slug: "#",
      title: "SIMULADOS COMENTADOS: IBFC, FGV E CEBRASPE",
      description: "Resolução passo a passo das questões mais recentes de concursos da saúde.",
      category: "Simulados",
      lessons: 10,
    },
    {
      id: 992,
      slug: "#",
      title: "FARMACOLOGIA E CÁLCULO DE MEDICAMENTOS",
      description: "Dosagens, diluições e principais fármacos cobrados em provas de enfermagem.",
      category: "Específica",
      lessons: 8,
    },
  ];

  const href = (p: Partial<{ estado: string; q: string; sort: string }>) => {
    const u = new URLSearchParams({ q: sp.q ?? "", estado, sort, ...p });
    return `/courses?${u.toString()}`;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-16">
      {/* 1. Hero Banner Principal (A Bíblia do Concurso / Trilha Destaque) */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-[#0e1c15] p-6 sm:p-10 shadow-2xl">
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            background: "radial-gradient(circle at 75% 35%, rgba(59, 255, 141, 0.25), transparent 60%)",
          }}
        />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_1fr] items-center">
          <div className="space-y-4">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              A Bíblia dos Concursos da Saúde
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
              Domine as ferramentas. Cubra o edital. Conquiste a sua aprovação definitiva.
            </p>
            <div className="pt-2">
              <Link
                href={`/courses/${activeCourseSlug}${cont?.next ? `?aula=${cont.next.slug}` : ""}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#3bff8d] px-5 py-3 text-xs sm:text-sm font-bold text-[#051b10] shadow-lg shadow-primary/20 hover:brightness-110 transition"
              >
                <Play className="h-4 w-4 fill-current" /> Continuar: {activeCourseTitle}
              </Link>
            </div>
          </div>

          {/* Gráfico 3D / Capa Destaque */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-64 h-80 rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-[#163826] to-[#07130d] p-5 shadow-[0_0_50px_rgba(59,255,141,0.22)] flex flex-col justify-between transform rotate-2 hover:rotate-0 transition duration-500">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold uppercase text-primary border border-primary/40 rounded px-1.5 py-0.5">ED. 2026</span>
                <span className="text-primary font-bold text-xs">RCS PRIME</span>
              </div>
              <div className="text-center space-y-2">
                <p className="font-mono text-xs font-bold text-primary tracking-widest uppercase">GUIA COMPLETO</p>
                <p className="font-serif text-2xl font-black text-white leading-tight">
                  A BÍBLIA DOS CONCURSOS
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Enfermagem · SUS · Radiologia</p>
              </div>
              <div className="border-t border-primary/30 pt-2 flex justify-between text-[10px] text-primary/80">
                <span>COMUNIDADE SAÚDE</span>
                <span>OFICIAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Continuar assistindo (Carrossel Horizontal de Posters) */}
      <section className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-white tracking-tight">Continuar assistindo</h2>
        <div className="scrollbar-thin flex gap-4 overflow-x-auto pb-4 pt-1">
          {inProgressCourses.map((c) => (
            <PosterCard key={c.id} c={c} />
          ))}
        </div>
      </section>

      {/* 3. Trilha 1: DO ZERO AO PRIMEIRO CONCURSO (Com números 1, 2, 3 estilizados) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
          <div>
            <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-white uppercase tracking-tight">
              <span className="text-primary text-base">☵</span> DO ZERO AO PRIMEIRO CONCURSO
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {trilhaBase.length} cursos em sequência · {trilhaBase.filter((c) => c.done === c.total && c.total > 0).length} de {trilhaBase.length} concluídos
            </p>
          </div>
          <Link href="/courses?area=comum" className="text-xs font-semibold text-primary hover:underline">
            Ver trilha →
          </Link>
        </div>

        <div className="scrollbar-thin flex gap-6 overflow-x-auto pb-4 pt-2">
          {trilhaBase.map((c, i) => (
            <NumberedPosterCard key={c.id} c={c} number={i + 1} />
          ))}
        </div>
      </section>

      {/* 4. Trilha 2: CONHECIMENTOS ESPECÍFICOS POR PROFISSÃO (Com números 1, 2, 3) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
          <div>
            <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-white uppercase tracking-tight">
              <span className="text-primary text-base">☵</span> CONHECIMENTOS ESPECÍFICOS POR PROFISSÃO
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Conteúdos práticos e direcionados para Enfermagem, Técnico e Radiologia
            </p>
          </div>
          <Link href="/courses?area=especifico" className="text-xs font-semibold text-primary hover:underline">
            Ver trilha →
          </Link>
        </div>

        <div className="scrollbar-thin flex gap-6 overflow-x-auto pb-4 pt-2">
          {trilhaEspecifica.map((c, i) => (
            <NumberedPosterCard key={c.id} c={c} number={i + 1} />
          ))}
        </div>
      </section>

      {/* 5. Em breve (Cursos em produção) */}
      <section className="space-y-3">
        <div>
          <h2 className="font-serif text-xl font-bold text-white tracking-tight">Em breve</h2>
          <p className="text-xs text-muted-foreground">Cursos em produção. Seja o mais rápido quando estiver pronto.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {upcomingCourses.map((u) => (
            <div
              key={u.title}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-[#0e1c15] p-4 transition hover:border-primary/40"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#132d20] to-[#07130d] p-4 flex flex-col justify-between">
                <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 w-fit">
                  Em breve
                </span>
                <div className="flex items-center justify-center my-auto">
                  <Clock className="h-12 w-12 text-primary/40 group-hover:scale-110 transition duration-300" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{u.category}</p>
              </div>

              <div className="mt-3">
                <h3 className="line-clamp-2 text-xs font-bold uppercase text-white group-hover:text-primary transition">
                  {u.title}
                </h3>
                <p className="mt-1 text-[11px] text-muted-foreground">{u.lessons} aulas previstas</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Todos os cursos (Filtros + Grid de 4 Colunas) */}
      <section className="space-y-5 pt-4 border-t border-border/40">
        <h2 className="font-serif text-xl font-bold text-white tracking-tight">Todos os cursos</h2>

        {/* Barra de Filtros e Busca */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Pills de Estado */}
          <div className="flex flex-wrap gap-2">
            {FILTER_STATES.map((s) => (
              <Link
                key={s.k}
                href={href({ estado: s.k })}
                className={cn(
                  "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition",
                  estado === s.k
                    ? "bg-[#3bff8d] text-[#051b10] shadow-sm font-bold"
                    : "bg-[#0e1c15] border border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
                )}
              >
                {s.l}
              </Link>
            ))}
          </div>

          {/* Busca e Ordenação */}
          <div className="flex items-center gap-2">
            <form className="relative">
              <input
                name="q"
                defaultValue={sp.q}
                placeholder="Buscar curso..."
                className="h-9 w-48 sm:w-60 rounded-xl border border-border bg-[#0e1c15] pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input type="hidden" name="estado" value={estado} />
              <input type="hidden" name="sort" value={sort} />
            </form>

            <SortSelect defaultValue={sort} />
          </div>
        </div>

        {/* Grid 4 Colunas */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-[#0e1c15] p-12 text-center">
            <p className="font-serif text-lg font-bold text-white">Nenhum curso encontrado</p>
            <p className="mt-1 text-xs text-muted-foreground">Tente alterar os filtros ou o termo de busca.</p>
            <Link href="/courses" className="btn-outline mt-4 inline-flex text-xs">
              Limpar filtros
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((c) => (
              <PosterCard key={c.id} c={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Card de Poster Vertical Estilo PH Community
function PosterCard({ c }: { c: any }) {
  const pct = c.total > 0 ? Math.round((c.done / c.total) * 100) : 0;
  const isSoon = c.status === "coming_soon";

  // Ícone por categoria
  const getIcon = () => {
    if (c.profession === "Enfermagem") return Stethoscope;
    if (c.profession === "Radiologia Médica") return Microscope;
    if (c.area === "legislacao") return Landmark;
    if (c.slug?.includes("portuguesa")) return BookOpen;
    if (c.slug?.includes("logico")) return Brain;
    return ShieldCheck;
  };
  const Icon = getIcon();

  return (
    <Link
      href={`/courses/${c.slug}`}
      className="group flex w-[220px] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-[#0e1c15] transition hover:border-primary/50 hover:shadow-xl"
    >
      {/* Capa Vertical 3:4 */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-[#132d20] to-[#07130d] p-4 flex flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,255,141,0.18),transparent_70%)]" />

        {/* Badges superiores */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="rounded-md border border-primary/40 bg-black/60 px-2 py-0.5 text-[10px] font-bold text-primary backdrop-blur">
            {c.done > 0 && c.done < c.total ? "Em progresso" : c.level || "Curso"}
          </span>
          {c.done === c.total && c.total > 0 && (
            <span className="flex items-center gap-1 rounded-md bg-primary/20 border border-primary/40 px-1.5 py-0.5 text-[10px] font-bold text-primary">
              <CheckCircle2 className="h-3 w-3" />
            </span>
          )}
        </div>

        {/* Ícone com brilho central */}
        <div className="relative z-10 flex items-center justify-center my-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_24px_rgba(59,255,141,0.2)] group-hover:scale-110 transition duration-300">
            <Icon className="h-8 w-8" />
          </div>
        </div>

        {/* Rodapé interno da capa */}
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary/80">
            {c.profession || (c.area === "comum" ? "Base Comum" : "Legislação")}
          </p>
        </div>
      </div>

      {/* Conteúdo inferior */}
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <h3 className="line-clamp-2 text-xs font-bold uppercase leading-tight text-white group-hover:text-primary transition">
          {c.title}
        </h3>
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2">
          <span>{c.done}/{c.total} aulas</span>
          <span className="font-semibold text-primary">{pct}%</span>
        </div>
      </div>
    </Link>
  );
}

// Card de Trilha com Número Gigante Neon Vazado (1, 2, 3...) idêntico ao Print 02
function NumberedPosterCard({ c, number }: { c: any; number: number }) {
  const pct = c.total > 0 ? Math.round((c.done / c.total) * 100) : 0;

  // Ícone por categoria
  const getIcon = () => {
    if (c.profession === "Enfermagem") return Stethoscope;
    if (c.profession === "Radiologia Médica") return Microscope;
    if (c.area === "legislacao") return Landmark;
    if (c.slug?.includes("portuguesa")) return BookOpen;
    if (c.slug?.includes("logico")) return Brain;
    return ShieldCheck;
  };
  const Icon = getIcon();

  return (
    <div className="relative flex items-center shrink-0">
      {/* Número Estilizado Gigante Vazado Neon idêntico ao Print 02 */}
      <span
        className="select-none font-sans text-[150px] sm:text-[190px] font-black leading-none text-transparent shrink-0 -mr-8 sm:-mr-10 z-0 drop-shadow-[0_0_18px_rgba(59,255,141,0.35)]"
        style={{
          WebkitTextStroke: "2.5px #3bff8d",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {number}
      </span>

      {/* Card Vertical Poster 3:4 que sobrepõe suavemente o número */}
      <Link
        href={`/courses/${c.slug}`}
        className="group relative z-10 flex w-[210px] sm:w-[220px] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-[#0e1c15] transition hover:border-primary/50 hover:shadow-2xl"
      >
        {/* Capa Vertical 3:4 */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-[#132d20] to-[#07130d] p-3.5 flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,255,141,0.18),transparent_70%)]" />

          {/* Badge superior */}
          <div className="relative z-10">
            {number === 1 ? (
              <span className="rounded-full bg-[#3bff8d] px-2.5 py-0.5 text-[10px] font-bold text-[#051b10] shadow-sm">
                Seu próximo passo
              </span>
            ) : (
              <span className="rounded-md border border-primary/40 bg-black/60 px-2 py-0.5 text-[9px] font-bold text-primary backdrop-blur">
                Etapa {number}
              </span>
            )}
          </div>

          {/* Ícone com brilho neon */}
          <div className="relative z-10 flex items-center justify-center my-auto">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_24px_rgba(59,255,141,0.22)] group-hover:scale-110 transition duration-300">
              <Icon className="h-8 w-8" />
            </div>
          </div>

          {/* Rodapé interno da imagem */}
          <div className="relative z-10 text-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-primary/80">
              MÓDULO 0{number}: INTRODUÇÃO E SETUP
            </p>
          </div>
        </div>

        {/* Rodapé do Card */}
        <div className="p-3.5 flex flex-col justify-between flex-1">
          <h3 className="line-clamp-2 text-xs font-bold uppercase leading-tight text-white group-hover:text-primary transition">
            {c.title}
          </h3>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2">
            <span>{c.done} de {c.total} aulas</span>
            <span className="font-semibold text-primary">{pct}%</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
