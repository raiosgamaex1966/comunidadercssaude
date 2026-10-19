"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export function LoginForm() {
  const params = useSearchParams();
  const erro = params.get("erro");
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Tab Switcher idêntico ao Print 04 */}
      <div className="flex rounded-full bg-muted/60 p-1 mb-6 border border-border/40">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={`flex-1 rounded-full py-1.5 text-xs font-bold transition shadow-sm ${
            tab === "login"
              ? "bg-[#0e8749] text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          className={`flex-1 rounded-full py-1.5 text-xs font-bold transition ${
            tab === "register"
              ? "bg-[#0e8749] text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Criar conta
        </button>
      </div>

      <div className="space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {tab === "login" ? "Bem-vindo de volta" : "Criar sua conta"}
        </h1>
        <p className="text-xs text-muted-foreground">
          {tab === "login"
            ? "Entre para continuar seus cursos e falar com a comunidade."
            : "Junte-se à comunidade de preparação para concursos da saúde."}
        </p>
      </div>

      <form action="/api/auth/login" method="post" className="mt-6 space-y-4">
        {tab === "register" && (
          <div>
            <label className="label">Nome completo</label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 h-11 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
              <input
                name="fullName"
                type="text"
                placeholder="Seu nome completo"
                className="flex-1 bg-transparent text-xs sm:text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        )}

        <div>
          <label className="label">E-mail</label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 h-11 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              name="email"
              type="email"
              autoComplete="email"
              defaultValue="robsoncordeiro1966@gmail.com"
              className="flex-1 bg-transparent text-xs sm:text-sm text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="voce@exemplo.com"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label !mb-0">Senha</label>
            {tab === "login" && (
              <a
                href="#esqueci"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Para redefinir sua senha, solicite suporte com o administrador ou equipe pedagógica.");
                }}
                className="text-[11px] text-muted-foreground hover:text-primary transition"
              >
                Esqueci a senha
              </a>
            )}
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 h-11 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
            <LockKeyhole className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              name="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              defaultValue="@#$Binho2020"
              className="flex-1 bg-transparent text-xs sm:text-sm text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Sua senha"
              required
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="shrink-0 text-muted-foreground hover:text-foreground transition p-1"
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {erro && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive animate-in fade-in"
          >
            {erro}
          </p>
        )}

        <button
          type="submit"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0e8749] py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-[0.99] transition cursor-pointer"
        >
          <span>{tab === "login" ? "Entrar" : "Cadastrar na plataforma"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Rodapé do formulário idêntico ao Print 04 */}
      <div className="mt-5 text-center">
        <p className="text-xs text-muted-foreground">
          {tab === "login" ? "Ainda não é membro? " : "Já possui conta? "}
          <button
            type="button"
            onClick={() => setTab(tab === "login" ? "register" : "login")}
            className="font-bold text-[#0e8749] hover:underline cursor-pointer"
          >
            {tab === "login" ? "Criar conta" : "Fazer login"}
          </button>
        </p>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>Conexão segura. Seus dados ficam protegidos.</span>
        </div>
      </div>
    </div>
  );
}
