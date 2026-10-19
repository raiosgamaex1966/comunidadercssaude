"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Home,
  BookOpen,
  Users,
  FileText,
  Newspaper,
  Video,
  GraduationCap,
  Bookmark,
  NotebookPen,
  Download,
  Settings,
  LifeBuoy,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  Search,
  LayoutDashboard,
  HeartPulse,
  Target,
  LogOut,
  Headphones,
  Smartphone,
  Share,
  PlusSquare,
  Check,
} from "lucide-react";
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

const MOBILE = ["/overview", "/courses", "/community", "/anotacoes", "/concursos"];

export type Notif = { id: number; title: string; body: string | null; link: string | null; read: boolean };

export function Shell({
  user,
  unread,
  notifs,
  children,
}: {
  user: SessionUser;
  unread: number;
  notifs: Notif[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    setIsIframe(typeof window !== "undefined" && window.self !== window.top);

    // Theme initialization
    const saved = localStorage.getItem("rcs-theme") as "dark" | "light" | null;
    const initialTheme = saved || "dark";
    setTheme(initialTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(initialTheme);

    // PWA Standalone check
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsStandalone(true);
    }

    // iOS Detection
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    // Listen for install prompt on Android/Chrome/Edge
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("rcs-theme", next);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
  }

  async function handleInstallClick() {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setDeferredPrompt(null);
        }
      } catch {
        setShowInstallModal(true);
      }
    } else {
      setShowInstallModal(true);
    }
  }

  const groups = Array.from(new Set(NAV.map((n) => n.group)));

  const sidebar = (
    <nav className="flex h-full flex-col bg-card" aria-label="Menu principal">
      <div className="flex items-center justify-between px-5 py-5 border-b border-border/40">
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

      {/* Botão de instalação no app móvel dentro do menu gaveta */}
      {!isStandalone && (
        <div className="mx-3 mt-3 lg:hidden">
          <button
            onClick={() => {
              setOpen(false);
              handleInstallClick();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/15 border border-primary/40 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/25 transition"
          >
            <Smartphone className="h-4 w-4" />
            <span>Instalar App no Celular</span>
          </button>
        </div>
      )}

      <div className="scrollbar-thin flex-1 overflow-y-auto px-3 py-3">
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
                          ? "bg-primary/15 text-primary font-bold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r before:bg-primary"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
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
                  ? "bg-primary/15 text-primary font-bold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r before:bg-primary"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <LayoutDashboard className="h-4 w-4" /> Painel de gestão
            </Link>
          </div>
        )}
      </div>

      {/* Acompanhe a comunidade */}
      <div className="mx-3 mb-3 rounded-2xl border border-border/60 bg-muted/40 p-3">
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
    <>
      {/* Modal Simulador iPhone para Administradores no Desktop */}
      {mobilePreview && !isIframe && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[390px] mb-3 flex items-center justify-between rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2.5 text-xs text-neutral-200 shadow-2xl">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-emerald-400" />
              <div>
                <p className="font-bold text-white leading-tight">Simulador iPhone (390 x 844 px)</p>
                <p className="text-[10px] text-neutral-400">Ambiente mobile 100% responsivo</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobilePreview(false)}
              className="rounded-xl bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xs font-bold text-neutral-200 hover:text-white transition cursor-pointer"
            >
              Fechar ✕
            </button>
          </div>

          {/* Moldura de Celular com Iframe real */}
          <div className="w-[390px] h-[780px] max-h-[85vh] rounded-[48px] border-[10px] border-neutral-800 bg-card shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden relative flex flex-col">
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-neutral-800 rounded-full z-50 pointer-events-none" />
            <iframe
              src={pathname}
              className="w-full h-full border-0 bg-background"
              title="Simulador Mobile RCS"
            />
          </div>
        </div>
      )}

      <div className="min-h-screen bg-background lg:grid lg:grid-cols-[250px_1fr] overflow-x-hidden">
        {/* Sidebar Desktop */}
        <aside className="sticky top-0 hidden h-screen border-r border-border bg-card lg:block">{sidebar}</aside>

        {/* Drawer Mobile */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-[270px] bg-card shadow-2xl animate-in slide-in-from-left duration-200">
              {sidebar}
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex min-h-screen flex-col bg-background">
          <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-2 px-3 sm:px-6">
              {/* Left: Hamburger + Brand on mobile */}
              <div className="flex items-center gap-2 min-w-0">
                <button
                  className="btn-ghost p-2 -ml-1 text-foreground lg:hidden shrink-0"
                  onClick={() => setOpen(true)}
                  aria-label="Mostrar menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <Link href="/overview" className="flex items-center gap-2 lg:hidden min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-xs">
                    RCS
                  </div>
                  <span className="font-serif font-bold text-sm truncate max-w-[120px] sm:max-w-none text-foreground">
                    Comunidade Saúde RCS
                  </span>
                </Link>
              </div>

              {/* Search with Ctrl K (desktop / tablet) */}
              <form action="/courses" className="hidden flex-1 max-w-md sm:flex mx-2">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 h-10 w-full focus-within:border-primary">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    name="q"
                    placeholder="Buscar aulas, mentorias, materiais..."
                    className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <span className="rounded border border-border/80 bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    Ctrl K
                  </span>
                </div>
              </form>

              {/* Right Action Icons (Responsive) */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {/* Botão Simulador Mobile (Para Administrador em Desktop) */}
                {user.role === "admin" && !isIframe && (
                  <button
                    type="button"
                    onClick={() => setMobilePreview(true)}
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground hover:bg-accent active:scale-95 shrink-0"
                    title="Simulador de formato celular (Admin)"
                  >
                    <Smartphone className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="text-[11px] font-bold">📱 Modo Celular</span>
                  </button>
                )}

                {/* Botão Instalar (Visível no Celular e Desktop) */}
                {!isStandalone && (
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20 active:scale-95 shrink-0"
                    title="Instalar no Celular / Computador"
                  >
                    <Download className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-[11px] font-bold">Instalar</span>
                  </button>
                )}

                {/* Botão de Troca de Tema (Claro / Escuro) */}
                <button
                  className="btn-ghost p-2 text-foreground"
                  onClick={toggleTheme}
                  aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
                  title={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-muted-foreground hover:text-amber-400 transition" />
                  ) : (
                    <Moon className="h-4 w-4 text-muted-foreground hover:text-primary transition" />
                  )}
                </button>

                {/* Notificações */}
                <div className="relative">
                  <button
                    className="btn-ghost relative p-2 text-foreground"
                    onClick={() => setNotifOpen((o) => !o)}
                    aria-label="Notificações"
                    aria-haspopup="menu"
                    aria-expanded={notifOpen}
                  >
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {unread > 0 ? unread : "9+"}
                    </span>
                  </button>
                  {notifOpen && (
                    <div className="card absolute right-0 mt-2 w-80 overflow-hidden shadow-2xl z-50 bg-card border border-border">
                      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                        <p className="text-sm font-semibold text-foreground">Notificações</p>
                        {unread > 0 && (
                          <form action="/api/notifications/read" method="post">
                            <button className="text-xs font-semibold text-primary">Marcar todas</button>
                          </form>
                        )}
                      </div>
                      <ul className="max-h-80 overflow-y-auto">
                        {notifs.length === 0 && (
                          <li className="px-4 py-6 text-center text-sm text-muted-foreground">Sem notificações</li>
                        )}
                        {notifs.map((n) => (
                          <li
                            key={n.id}
                            className={cn("border-b border-border px-4 py-3 last:border-0", !n.read && "bg-primary/5")}
                          >
                            <Link href={n.link ?? "#"} onClick={() => setNotifOpen(false)}>
                              <p className="text-sm font-semibold text-foreground">{n.title}</p>
                              {n.body && <p className="text-xs text-muted-foreground">{n.body}</p>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Avatar do Usuário */}
                <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-border bg-card py-1 pl-1.5 pr-2 sm:pr-3">
                  <Avatar user={user} size={28} />
                  <div className="hidden md:block text-left">
                    <p className="max-w-[100px] truncate text-xs font-semibold leading-tight text-foreground">
                      {user.fullName}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {user.role === "admin" ? "Administrador" : "Aluno"}
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold text-amber-500">
                    👑 Pro
                  </span>
                </div>

                {/* Botão Sair */}
                <form action="/api/auth/logout" method="post" className="hidden sm:block">
                  <button className="btn-ghost p-2" aria-label="Sair" title="Sair">
                    <LogOut className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </form>
              </div>
            </div>
          </header>

          {/* Área principal do conteúdo */}
          <main className="flex-1 px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:pb-8">{children}</main>

          {/* Barra de Navegação Inferior Móvel */}
          <nav
            className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card/95 backdrop-blur lg:hidden"
            aria-label="Navegação rápida"
          >
            {NAV.filter((n) => MOBILE.includes(n.to)).map(({ to, label, icon: Icon }) => {
              const active = pathname === to || (to !== "/overview" && pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  href={to}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition active:scale-95",
                    active ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                  <span className="truncate max-w-[60px] text-center">
                    {label === "Meu Concurso" ? "Concursos" : label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Modal de Instruções de Instalação (PWA no Celular) */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl text-foreground">
            <button
              onClick={() => setShowInstallModal(false)}
              className="btn-ghost absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/30 mb-4">
              <Smartphone className="h-6 w-6" />
            </div>

            <h3 className="font-serif text-xl font-bold text-foreground">
              Instalar Comunidade Saúde RCS
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Tenha acesso rápido direto da sua tela inicial como um aplicativo nativo.
            </p>

            <div className="mt-5 space-y-3 rounded-2xl border border-border bg-muted/40 p-4 text-xs leading-relaxed">
              {isIOS ? (
                <>
                  <p className="font-bold text-primary flex items-center gap-1.5">
                    <Share className="h-4 w-4" /> No iPhone ou iPad (Safari):
                  </p>
                  <ol className="list-decimal pl-4 space-y-2 text-foreground/90">
                    <li>
                      Toque no botão <strong>Compartilhar</strong> (ícone do quadrado com a seta para cima na barra inferior do Safari).
                    </li>
                    <li>
                      Role as opções para baixo e toque em <strong>&quot;Adicionar à Tela de Início&quot;</strong>.
                    </li>
                    <li>
                      Toque em <strong>&quot;Adicionar&quot;</strong> no canto superior direito para confirmar.
                    </li>
                  </ol>
                </>
              ) : (
                <>
                  <p className="font-bold text-primary flex items-center gap-1.5">
                    <Download className="h-4 w-4" /> No Android (Chrome):
                  </p>
                  <ol className="list-decimal pl-4 space-y-2 text-foreground/90">
                    <li>
                      Toque no menu de <strong>três pontinhos (⋮)</strong> no canto superior direito do navegador.
                    </li>
                    <li>
                      Selecione <strong>&quot;Instalar aplicativo&quot;</strong> ou <strong>&quot;Adicionar à tela inicial&quot;</strong>.
                    </li>
                    <li>
                      Confirme tocando em <strong>&quot;Instalar&quot;</strong>.
                    </li>
                  </ol>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="w-full rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:brightness-110 transition shadow-sm"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Avatar({
  user,
  size = 32,
}: {
  user: { fullName: string; avatarUrl?: string | null };
  size?: number;
}) {
  return user.avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.avatarUrl}
      alt={user.fullName}
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-accent font-bold text-primary"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(user.fullName)}
    </span>
  );
}
