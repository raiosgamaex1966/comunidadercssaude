"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Home, BookOpen, Users, FileText, Newspaper, Video, GraduationCap, Bookmark, NotebookPen, Webcam,
  Download, Settings, LifeBuoy, Menu, X, Sun, Moon, Bell, Search, Shield, LayoutDashboard, HeartPulse, Target, LogOut,
  Headphones,
} from "lucide-react";
import { Logo, LogoMark } from "./Logo";
import { cn, initials } from "@/lib/utils";
import type { SessionUser } from "@/lib/auth";

const NAV = [
  { to: "/overview", label: "Início", icon: Home, group: "Menu" },
  { to: "/courses", label: "Cursos", icon: BookOpen, group: "Menu" },
  { to: "/mentorships", label: "Mentorias", icon: Video, group: "Menu" },
  { to: "/materials", label: "Materiais", icon: FileText, group: "Menu" },
  { to: "/community", label: "Comunidade", icon: Users, group: "Menu" },
  { to: "/missoes", label: "Missões", icon: Target, group: "Menu" },
  { to: "/my-learning", label: "Meu Aprendizado", icon: GraduationCap, group: "Menu" },
  { to: "/anotacoes", label: "Anotações", icon: NotebookPen, group: "Menu" },
  { to: "/podcasts", label: "Podcasts", icon: Headphones, group: "Menu" },
  { to: "/concursos", label: "Meu Concurso", icon: HeartPulse, group: "Menu" },
  { to: "/novidades", label: "Novidades", icon: Newspaper, group: "Conta" },
  { to: "/support", label: "Suporte", icon: LifeBuoy, group: "Conta" },
  { to: "/settings", label: "Configurações", icon: Settings, group: "Conta" },
];

const MOBILE = ["/overview", "/courses", "/community", "/missoes", "/my-learning"];

export type Notif = { id: number; title: string; body: string | null; link: string | null; read: boolean };

export function Shell({ user, unread, notifs, children }: { user: SessionUser; unread: number; notifs: Notif[]; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const t = (localStorage.getItem("rcs-theme") as "dark" | "light") || "dark";
    setTheme(t);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(t);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("rcs-theme", next);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
  }

  const groups = Array.from(new Set(NAV.map((n) => n.group)));

  const sidebar = (
    <nav className="flex h-full flex-col" aria-label="Menu principal">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/overview" className="flex items-center gap-2.5" aria-label="Comunidade Saúde RCS — página inicial">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 border border-primary/40 text-primary font-bold">
            <span className="font-mono text-xs">RCS</span>
          </div>
          <span className="font-serif font-bold text-base tracking-tight text-foreground">Comunidade Saúde RCS</span>
        </Link>
        <button className="btn-ghost p-2 lg:hidden" onClick={() => setOpen(false)} aria-label="Esconder menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-2">
        {groups.map((g) => (
          <div key={g} className="mb-4">
            <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{g}</p>
            <ul className="space-y-0.5">
              {NAV.filter((n) => n.group === g).map(({ to, label, icon: Icon }) => {
                const active = pathname === to || (to !== "/overview" && pathname.startsWith(to));
                return (
                  <li key={to}>
                    <Link
                      href={to}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                        active
                          ? "bg-[#0e271c] text-[#3bff8d] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r before:bg-primary"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-[#3bff8d]" : "text-muted-foreground")} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {user.role === "admin" && (
          <div className="mb-4">
            <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Admin</p>
            <Link
              href="/admin"
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                pathname.startsWith("/admin")
                  ? "bg-[#0e271c] text-[#3bff8d] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r before:bg-primary"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <LayoutDashboard className="h-4 w-4" /> Painel de gestão
            </Link>
          </div>
        )}
      </div>

      {/* Acompanhe a comunidade */}
      <div className="mx-3 mb-3 rounded-2xl border border-border/50 bg-[#0a1811]/60 p-3">
        <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Acompanhe a comunidade</p>
        <div className="mt-2 space-y-0.5">
          <a
            href="https://chat.whatsapp.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-xs font-semibold text-foreground/90 transition hover:bg-accent hover:text-primary"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 text-xs">💬</span>
            Grupo no WhatsApp
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-xs font-semibold text-foreground/90 transition hover:bg-accent hover:text-primary"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 text-xs">📸</span>
            Instagram
          </a>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-border bg-[#07110c] lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[270px] bg-[#07110c] shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="flex min-h-screen flex-col bg-[#07110c]">
        <header className="sticky top-0 z-40 border-b border-border bg-[#07110c]/90 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button className="btn-ghost p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Mostrar menu">
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/overview" className="flex items-center gap-2 lg:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-xs">RCS</div>
              <span className="font-serif font-bold text-sm">Comunidade Saúde RCS</span>
            </Link>

            {/* Search with Ctrl K */}
            <form action="/courses" className="hidden flex-1 max-w-md sm:flex">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-[#0e1c15] px-3 h-10 w-full focus-within:border-primary">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  name="q"
                  placeholder="Buscar aulas, mentorias, materiais..."
                  className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                />
                <span className="rounded border border-border/80 bg-background/40 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  Ctrl K
                </span>
              </div>
            </form>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
              >
                <Download className="h-3.5 w-3.5" /> Instalar
              </button>

              <button className="btn-ghost p-2" onClick={toggleTheme} aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}>
                {theme === "dark" ? <Sun className="h-4 w-4 text-muted-foreground" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
              </button>

              <div className="relative">
                <button className="btn-ghost relative p-2" onClick={() => setNotifOpen((o) => !o)} aria-label="Notificações" aria-haspopup="menu" aria-expanded={notifOpen}>
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-[#051b10]">
                    {unread > 0 ? unread : "9+"}
                  </span>
                </button>
                {notifOpen && (
                  <div className="card absolute right-0 mt-2 w-80 overflow-hidden shadow-2xl z-50 bg-[#0e1c15] border border-border">
                    <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                      <p className="text-sm font-semibold">Notificações</p>
                      {unread > 0 && (
                        <form action="/api/notifications/read" method="post">
                          <button className="text-xs font-semibold text-primary">Marcar todas</button>
                        </form>
                      )}
                    </div>
                    <ul className="max-h-80 overflow-y-auto">
                      {notifs.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted-foreground">Sem notificações</li>}
                      {notifs.map((n) => (
                        <li key={n.id} className={cn("border-b border-border px-4 py-3 last:border-0", !n.read && "bg-primary/5")}>
                          <Link href={n.link ?? "#"} onClick={() => setNotifOpen(false)}>
                            <p className="text-sm font-semibold">{n.title}</p>
                            {n.body && <p className="text-xs text-muted-foreground">{n.body}</p>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* User profile pill matching screenshots */}
              <div className="flex items-center gap-2 rounded-full border border-border bg-[#0e1c15] py-1 pl-1.5 pr-3">
                <Avatar user={user} size={28} />
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-xs font-bold uppercase tracking-tight truncate max-w-[140px] text-foreground">
                    {user.fullName}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {user.role === "admin" ? "Administrador" : "Aluno"}
                  </p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                  👑 Pro
                </span>
              </div>

              <form action="/api/auth/logout" method="post">
                <button className="btn-ghost p-2" aria-label="Sair" title="Sair"><LogOut className="h-4 w-4 text-muted-foreground" /></button>
              </form>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card/95 backdrop-blur lg:hidden" aria-label="Navegação rápida">
          {NAV.filter((n) => MOBILE.includes(n.to)).map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link key={to} href={to} className={cn("flex flex-col items-center gap-1 py-2 text-[10px] font-semibold", active ? "text-primary" : "text-muted-foreground")}>
                <Icon className="h-5 w-5" />
                {label === "Meu Aprendizado" ? "Aprendizado" : label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function Avatar({ user, size = 32 }: { user: { fullName: string; avatarUrl?: string | null }; size?: number }) {
  return user.avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.avatarUrl} alt={user.fullName} width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-accent font-bold text-primary"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(user.fullName)}
    </span>
  );
}
