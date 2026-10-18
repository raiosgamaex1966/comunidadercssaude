import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { PageHero } from "@/components/PageHero";
import {
  Target, Flame, Trophy, Award, CheckCircle2, Circle, Clock, Sparkles,
  BookOpen, Headphones, NotebookPen, Users, ArrowRight, ShieldCheck, Zap
} from "lucide-react";

export const metadata = { title: "Missões e Conquistas" };

interface MissionItem {
  id: string;
  title: string;
  desc: string;
  xp: number;
  completed: boolean;
  actionText: string;
  actionHref: string;
  icon: any;
}

export default async function MissoesPage() {
  const user = await requireUser();

  const dailyMissions: MissionItem[] = [
    {
      id: "d1",
      title: "Assistir a uma aula completa",
      desc: "Assista a qualquer vídeoaula do seu curso hoje para manter o ritmo.",
      xp: 50,
      completed: true,
      actionText: "Ir para cursos",
      actionHref: "/courses",
      icon: BookOpen,
    },
    {
      id: "d2",
      title: "Ouvir um episódio de Podcast",
      desc: "Aproveite um áudio de revisão com legislação ou enfermagem/radiologia.",
      xp: 40,
      completed: false,
      actionText: "Ouvir podcast",
      actionHref: "/podcasts",
      icon: Headphones,
    },
    {
      id: "d3",
      title: "Registrar uma Anotação de Estudo",
      desc: "Anote um conceito-chave, mnemônico ou resumo do dia.",
      xp: 30,
      completed: false,
      actionText: "Criar nota",
      actionHref: "/anotacoes",
      icon: NotebookPen,
    },
    {
      id: "d4",
      title: "Interagir na Comunidade",
      desc: "Deixe um comentário, dúvida ou incentivo para outro colega de concurso.",
      xp: 35,
      completed: false,
      actionText: "Acessar feed",
      actionHref: "/community",
      icon: Users,
    },
  ];

  const weeklyMissions: MissionItem[] = [
    {
      id: "w1",
      title: "Completar 5 aulas na semana",
      desc: "Meta de consistência semanal para cobrir o conteúdo do edital.",
      xp: 150,
      completed: true,
      actionText: "Ver progresso",
      actionHref: "/my-learning",
      icon: Zap,
    },
    {
      id: "w2",
      title: "Manter ofensiva de 3 dias seguidos",
      desc: "Estude ao menos 15 minutos por dia consecutivamente.",
      xp: 180,
      completed: false,
      actionText: "Minha jornada",
      actionHref: "/my-learning",
      icon: Flame,
    },
    {
      id: "w3",
      title: "Baixar ou revisar um PDF da Biblioteca",
      desc: "Estude por resumos em PDF ou tabelas de legislação.",
      xp: 80,
      completed: true,
      actionText: "Ver materiais",
      actionHref: "/materials",
      icon: ShieldCheck,
    },
  ];

  const badges = [
    { name: "Primeiro Passo", desc: "Criou conta e iniciou os estudos", unlocked: true, icon: Trophy },
    { name: "Foco Total", desc: "3 dias consecutivos de ofensiva", unlocked: true, icon: Flame },
    { name: "Ouvinte Ávido", desc: "Ouvinte de 5+ episódios de podcasts", unlocked: false, icon: Headphones },
    { name: "Mestre do SUS", desc: "Completou o módulo da Lei 8.080 e 8.142", unlocked: false, icon: Award },
    { name: "Pronto pro Edital", desc: "Alcançou 80% do curso concluído", unlocked: false, icon: Target },
  ];

  const totalDaily = dailyMissions.length;
  const completedDaily = dailyMissions.filter((m) => m.completed).length;
  const dailyProgressPercent = Math.round((completedDaily / totalDaily) * 100);

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <PageHero
        title="Missões e Metas"
        lead="Ganhe pontos de experiência (XP), cumpra desafios diários e mantenha a consistência rumo à aprovação."
      />

      {/* Gamification status card */}
      <div className="card overflow-hidden bg-gradient-to-r from-card via-card to-accent/30 p-6 shadow-sm border border-border">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="badge border-primary/40 bg-primary/10 text-primary font-bold">
                Nível 3 · Residente Dedicado
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                <Flame className="h-4 w-4 fill-amber-400 text-amber-400" /> 3 dias seguidos
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Olá, {user.fullName.split(" ")[0]}!
            </h2>
            <p className="text-sm text-muted-foreground">
              Você já acumulou <span className="font-bold text-foreground">620 XP</span> nesta temporada. Faltam 180 XP para o Nível 4.
            </p>
          </div>

          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-muted-foreground">Progresso do Nível</span>
              <span className="text-primary font-semibold">620 / 800 XP</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: "77%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Missions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
              <Sparkles className="h-5 w-5 text-primary" /> Missões Diárias
            </h3>
            <p className="text-xs text-muted-foreground">Renovam todos os dias à meia-noite.</p>
          </div>
          <span className="badge border-border text-xs">
            {completedDaily}/{totalDaily} concluídas ({dailyProgressPercent}%)
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {dailyMissions.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className={`card flex flex-col justify-between p-4 transition-all ${
                  m.completed ? "border-primary/30 bg-primary/[0.03]" : "hover:border-primary/40"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        m.completed ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold leading-snug ${m.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {m.title}
                        </h4>
                        <span className="text-xs font-semibold text-primary">+{m.xp} XP</span>
                      </div>
                    </div>
                    {m.completed ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex justify-end">
                  {m.completed ? (
                    <span className="text-xs font-medium text-primary flex items-center gap-1">
                      Concluída hoje
                    </span>
                  ) : (
                    <Link
                      href={m.actionHref}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      {m.actionText} <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Weekly Missions */}
      <section className="space-y-4">
        <div>
          <h3 className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
            <Target className="h-5 w-5 text-primary" /> Desafios da Semana
          </h3>
          <p className="text-xs text-muted-foreground">Foco de longo prazo para consolidar a matéria.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {weeklyMissions.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className={`card flex flex-col justify-between p-4 ${
                  m.completed ? "border-primary/30 bg-primary/[0.03]" : ""
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="badge border-primary/30 text-[11px] font-bold text-primary">
                      +{m.xp} XP
                    </span>
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-foreground">{m.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    {m.completed ? "100%" : "33%"}
                  </span>
                  <Link
                    href={m.actionHref}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {m.actionText} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Badges / Conquistas */}
      <section className="space-y-4">
        <div>
          <h3 className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
            <Trophy className="h-5 w-5 text-primary" /> Insígnias de Conquista
          </h3>
          <p className="text-xs text-muted-foreground">Distintivos especiais desbloqueados ao atingir marcos de estudo.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.name}
                className={`card flex flex-col items-center p-4 text-center transition-all ${
                  b.unlocked
                    ? "border-primary/40 bg-card"
                    : "opacity-40 grayscale border-border"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    b.unlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="mt-3 text-xs font-bold text-foreground">{b.name}</h4>
                <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{b.desc}</p>
                <span className={`mt-2 text-[10px] font-bold uppercase ${b.unlocked ? "text-primary" : "text-muted-foreground"}`}>
                  {b.unlocked ? "Desbloqueada" : "Bloqueada"}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
