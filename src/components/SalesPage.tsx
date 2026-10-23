import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  GraduationCap,
  Headphones,
  HeartPulse,
  LayoutDashboard,
  MessageSquare,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/Logo";

const allFeatures = [
  {
    icon: BookOpen,
    title: "Cursos Estruturados por Edital",
    desc: "Trilhas completas com videoaulas divididas em módulos e tópicos focados para Enfermagem, Técnico de Enfermagem e Radiologia Médica.",
    tag: "Aulas em Vídeo",
  },
  {
    icon: Target,
    title: "Planejador 'Meu Concurso'",
    desc: "Cadastre seu concurso informando órgão, esfera, cargo e banca. O app monta automaticamente o plano de matérias com contagem regressiva da prova.",
    tag: "Exclusivo",
  },
  {
    icon: Video,
    title: "Mentorias ao Vivo e Gravadas",
    desc: "Encontros estratégicos com especialistas em concursos da saúde, plantão de dúvidas ao vivo e gravações sempre acessíveis.",
    tag: "Ao Vivo",
  },
  {
    icon: Users,
    title: "Comunidade Interativa e Feed Social",
    desc: "Espaço exclusivo para trocar dúvidas, debater questões de prova, compartilhar resumos e interagir com outros candidatos em todo o Brasil.",
    tag: "Colaborativo",
  },
  {
    icon: Trophy,
    title: "Missões Semanais e Simulados",
    desc: "Metas de estudo gamificadas e simulados gerais do SUS para testar seu rendimento e manter a consistência da preparação.",
    tag: "Gamificação",
  },
  {
    icon: NotebookPen,
    title: "Caderno Digital e Mapas Mentais",
    desc: "Área de anotações integrada a cada aula com suporte a mapas mentais e resumos esquematizados para revisão rápida.",
    tag: "Produtividade",
  },
  {
    icon: Headphones,
    title: "Podcasts de Revisão em Áudio",
    desc: "Episódios em áudio organizados por matérias e temas essenciais para estudar no trânsito, no intervalo do plantão ou em casa.",
    tag: "Áudio",
  },
  {
    icon: FileText,
    title: "Biblioteca de Materiais em PDF",
    desc: "Apostilas, leis comentadas, tabelas e esquemas didáticos prontos para download e impressão para acompanhar os estudos.",
    tag: "Downloads",
  },
  {
    icon: GraduationCap,
    title: "Painel Meu Aprendizado",
    desc: "Métricas detalhadas do seu progresso, percentual concluído em cada disciplina e histórico de tópicos já dominados.",
    tag: "Estatísticas",
  },
  {
    icon: LayoutDashboard,
    title: "Gestão Completa de Conteúdo",
    desc: "Painel administrativo intuitivo para publicação de aulas, criação de módulos, moderação de conversas e suporte ao aluno.",
    tag: "Painel Admin",
  },
];

const professions = [
  {
    title: "Enfermagem",
    desc: "Trilhas com foco em saúde pública, procedimentos de enfermagem, biossegurança, cálculo de medicamentos e SUS.",
    icon: "🩺",
  },
  {
    title: "Técnico de Enfermagem",
    desc: "Preparação prática cobrindo fundamentos, assistência ao paciente, urgência/emergência e principais bancas.",
    icon: "💉",
  },
  {
    title: "Radiologia Médica",
    desc: "Matérias de anatomia radiológica, física das radiações, proteção radiológica, tomografia e exames contrastados.",
    icon: "🩻",
  },
  {
    title: "Base Comum & SUS",
    desc: "Língua Portuguesa, Raciocínio Lógico-Matemático, Lei Orgânica da Saúde (8.080/90) e Legislação Específica.",
    icon: "⚖️",
  },
];

export function SalesPage() {
  return (
    <main className="min-h-screen bg-[#f3f7f5] text-[#0d281e]">
      {/* Topo / Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#d4e4dc] bg-[#f3f7f5]/95 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
          <Link href="/" aria-label="RCS Prime Cursos" className="shrink-0">
            <Logo size={36} />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-[#456356]">
            <a href="#funcionalidades" className="transition hover:text-[#0a8352]">
              Funcionalidades
            </a>
            <a href="#trilhas" className="transition hover:text-[#0a8352]">
              Trilhas & Profissões
            </a>
            <a href="#metodologia" className="transition hover:text-[#0a8352]">
              Metodologia
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0a8352] hover:bg-[#086c43] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition active:scale-95"
            >
              <span>Acessar</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_20%,rgba(10,131,82,0.14),transparent_28rem),radial-gradient(circle_at_12%_10%,rgba(10,131,82,0.1),transparent_32rem)]" />

        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Lado Esquerdo: Textos e Chamadas */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0a8352]/30 bg-[#0a8352]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0a8352]">
              <HeartPulse className="h-4 w-4" />
              <span>Sua Profissão em Primeiro Lugar</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0d281e] leading-[1.08]">
              Sua comunidade de ensino.{" "}
              <span className="text-[#0a8352]">Todo o conteúdo nas suas mãos.</span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[#4b6659]">
              O <strong>RCS Prime Cursos</strong> reúne em um único ambiente tudo o que você precisa para ser aprovado: cursos por área, planos de estudo customizados para o seu edital, mentorias ao vivo, simulados e uma comunidade colaborativa.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#0a8352] hover:bg-[#086c43] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition active:scale-95"
              >
                <span>Acessar a plataforma</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#funcionalidades"
                className="inline-flex items-center gap-2 rounded-xl border border-[#0a8352]/40 bg-white hover:bg-[#0a8352]/10 px-5 py-3.5 text-sm font-bold text-[#0d281e] shadow-xs transition"
              >
                <span>Conhecer recursos</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#d4e4dc]/80 text-xs font-bold text-[#425e51]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0a8352] shrink-0" />
                <span>Planos por edital e banca</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0a8352] shrink-0" />
                <span>Mentorias com especialistas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0a8352] shrink-0" />
                <span>Acesso web e celular (PWA)</span>
              </div>
            </div>
          </div>

          {/* Lado Direito: APRESENTAÇÃO VISUAL COMPLETA DO APP (Mockup de Alta Resolução) */}
          <div className="relative">
            {/* Moldura da Interface do App */}
            <div className="rounded-3xl border border-[#c7dcd0] bg-white p-3 sm:p-4 shadow-[0_25px_60px_-15px_rgba(10,131,82,0.2)]">
              {/* Top Bar da Janela */}
              <div className="flex items-center justify-between border-b border-[#e5efe8] pb-3 mb-3 px-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-[10px] text-muted-foreground font-semibold">
                    app.comunidadesaudercs.com.br
                  </span>
                </div>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Ao vivo
                </span>
              </div>

              {/* Corpo da Demonstração da Plataforma */}
              <div className="rounded-2xl bg-[#0e1d16] p-4 sm:p-5 text-white space-y-4 shadow-inner">
                {/* Cabeçalho Interno do Mockup */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                      RCS
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">RCS Prime Cursos</p>
                      <p className="text-[9px] text-white/60">Ambiente do Concurseiro</p>
                    </div>
                  </div>
                  <span className="rounded-md bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">
                    👑 Membro Pro
                  </span>
                </div>

                {/* Banner de Destaque / Próximo Passo */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold">
                    <span className="uppercase tracking-wider">🎯 Seu Próximo Passo</span>
                    <span>68% Concluído</span>
                  </div>
                  <p className="font-serif text-base font-bold text-white">
                    Língua Portuguesa para Concursos
                  </p>
                  <p className="text-[11px] text-white/70">
                    Próxima aula: Módulo 01 — Interpretação de Textos e Sintaxe
                  </p>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: "68%" }} />
                  </div>
                </div>

                {/* Grid com Cursos e Recursos em Destaque */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <p className="text-[10px] font-bold text-emerald-400">🩺 ENFERMAGEM</p>
                    <p className="font-bold text-white mt-1 text-[11px]">Legislação do SUS</p>
                    <p className="text-[9px] text-white/60">32 aulas · Materiais em PDF</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <p className="text-[10px] font-bold text-emerald-400">🩻 RADIOLOGIA</p>
                    <p className="font-bold text-white mt-1 text-[11px]">Técnicas Radiológicas</p>
                    <p className="text-[9px] text-white/60">24 aulas · Questões comentadas</p>
                  </div>
                </div>

                {/* Card de Notificação de Mentoria */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🗓️</span>
                    <div>
                      <p className="text-[10px] font-bold text-emerald-300">Mentoria ao Vivo</p>
                      <p className="text-[9px] text-white/70">Revisão de Provas da Saúde</p>
                    </div>
                  </div>
                  <span className="rounded bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-[#041f11]">
                    Entrar
                  </span>
                </div>
              </div>

              {/* Badges Flutuantes em torno do Mockup */}
              <div className="mt-3 flex flex-wrap gap-2 justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#d4e4dc] bg-[#f3f7f5] px-3 py-1.5 text-[11px] font-bold text-[#0d281e]">
                  <Target className="h-3.5 w-3.5 text-[#0a8352]" />
                  <span>Plano por cargo e banca</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#d4e4dc] bg-[#f3f7f5] px-3 py-1.5 text-[11px] font-bold text-[#0d281e]">
                  <MessageSquare className="h-3.5 w-3.5 text-[#0a8352]" />
                  <span>Comunidade colaborativa</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção 2: Apresentação de TODAS as Funcionalidades */}
      <section id="funcionalidades" className="border-t border-[#d4e4dc] bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0a8352]">
              Tudo o que você precisa em um só lugar
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0d281e]">
              Construído para a realidade dos concursos da saúde
            </h2>
            <p className="text-sm sm:text-base text-[#4b6659] leading-relaxed">
              Diga adeus a pastas desorganizadas e materiais espalhados. O RCS Prime Cursos reúne conteúdo estruturado, metodologia de fixação e tecnologia para acelerar sua aprovação.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <article
                  key={feat.title}
                  className="rounded-3xl border border-[#dce9e1] bg-[#f9fbf9] p-6 transition-all hover:-translate-y-1 hover:border-[#0a8352]/40 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a8352]/10 text-[#0a8352] border border-[#0a8352]/20">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="rounded-full bg-[#0a8352]/10 border border-[#0a8352]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#0a8352]">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-xl font-bold text-[#0d281e]">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#4b6659] leading-relaxed">
                    {feat.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seção 3: Trilhas e Profissões */}
      <section id="trilhas" className="py-20 sm:py-24 bg-[#0a2016] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" /> Foco Especializado
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Matérias organizadas de acordo com seu edital.
              </h2>
              <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                Cada concurso tem suas peculiaridades. No RCS Prime Cursos você encontra matérias divididas estrategicamente entre a base comum, a legislação aplicável e os tópicos técnicos de cada especialidade.
              </p>

              <div className="pt-2">
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-xs sm:text-sm font-bold text-[#041f11] transition shadow-md"
                >
                  <span>Começar a estudar agora</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {professions.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10 hover:border-emerald-500/40"
                >
                  <span className="text-3xl">{p.icon}</span>
                  <h3 className="mt-3 font-serif text-lg font-bold text-white">{p.title}</h3>
                  <p className="mt-1.5 text-xs text-white/70 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção 4: Metodologia e Como Funciona */}
      <section id="metodologia" className="py-20 sm:py-24 bg-[#f3f7f5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0a8352]">
              Passo a Passo
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#0d281e]">
              Como funciona sua jornada na plataforma
            </h2>
            <p className="text-sm text-[#4b6659]">
              Um método linear e eficiente para você focar apenas no que cai na prova.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Cadastre seu Concurso",
                desc: "Informe o órgão desejado, a esfera (Federal, Estadual ou Municipal), o cargo e a data da sua prova.",
              },
              {
                step: "02",
                title: "Receba o Plano Pronto",
                desc: "O sistema mapeia todas as matérias comuns, legislação e específicas exigidas pelo edital.",
              },
              {
                step: "03",
                title: "Estude com Conteúdo Completo",
                desc: "Assista às videoaulas, baixe resumos em PDF, escute podcasts e faça simulados semanais.",
              },
              {
                step: "04",
                title: "Tire Dúvidas na Comunidade",
                desc: "Participe das mentorias ao vivo e compartilhe experiências no feed de concurseiros da saúde.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-3xl border border-[#d4e4dc] bg-white p-6 shadow-xs space-y-3"
              >
                <span className="font-mono text-3xl font-bold text-[#0a8352]/40">
                  {s.step}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#0d281e]">{s.title}</h3>
                <p className="text-xs text-[#4b6659] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Final de Chamada */}
      <section className="px-4 pb-20 sm:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-br from-[#0e3b26] to-[#082417] p-8 sm:p-14 text-center text-white shadow-xl space-y-6">
          <div className="flex justify-center">
            <LogoMark size={48} />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold max-w-2xl mx-auto leading-tight">
            Pronto para transformar sua preparação para concursos da saúde?
          </h2>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-white/80 leading-relaxed">
            Entre agora mesmo no RCS Prime Cursos e tenha acesso completo aos cursos, mentorias, simulados e ao planejador de estudos por edital.
          </p>

          <div className="pt-2">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 px-8 py-4 text-sm font-bold text-[#041f11] shadow-lg transition active:scale-95"
            >
              <span>Cadastrar ou Entrar na Comunidade</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="border-t border-[#d4e4dc] bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#556d62]">
          <Logo size={28} />
          <p>© {new Date().getFullYear()} RCS Prime Cursos — Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="/auth" className="hover:text-[#0a8352] font-semibold">
              Área do Aluno
            </Link>
            <Link href="/auth" className="hover:text-[#0a8352] font-semibold">
              Painel de Gestão
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
