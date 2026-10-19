"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight, ShieldCheck, RefreshCw, UserCheck } from "lucide-react";

export function LoginForm() {
  const params = useSearchParams();
  const erro = params.get("erro");
  const tabParam = params.get("tab");
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState<"login" | "register">(tabParam === "register" ? "register" : "login");

  // Desafio Matemático Anti-Robô
  const [captcha, setCaptcha] = useState<{ n1: number; n2: number; op: "+" | "-" }>({ n1: 7, n2: 4, op: "+" });
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  function generateCaptcha() {
    const isSum = Math.random() > 0.4;
    if (isSum) {
      const n1 = Math.floor(Math.random() * 12) + 2;
      const n2 = Math.floor(Math.random() * 9) + 1;
      setCaptcha({ n1, n2, op: "+" });
    } else {
      const n1 = Math.floor(Math.random() * 10) + 6;
      const n2 = Math.floor(Math.random() * 5) + 1;
      setCaptcha({ n1, n2, op: "-" });
    }
    setCaptchaInput("");
    setCaptchaError("");
  }

  useEffect(() => {
    generateCaptcha();
  }, [tab]);

  const expectedResult = captcha.op === "+" ? captcha.n1 + captcha.n2 : captcha.n1 - captcha.n2;

  function handleRegisterSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (tab === "register") {
      const parsed = Number(captchaInput.trim());
      if (isNaN(parsed) || parsed !== expectedResult) {
        e.preventDefault();
        setCaptchaError(`Resultado incorreto (${captcha.n1} ${captcha.op} ${captcha.n2} = ${expectedResult}). Verifique e tente novamente.`);
        return;
      }
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Tab Switcher idêntico ao Print 04 */}
      <div className="flex rounded-full bg-muted/60 p-1 mb-6 border border-border/40">
        <button
          type="button"
          onClick={() => {
            setTab("login");
            setCaptchaError("");
          }}
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
          onClick={() => {
            setTab("register");
            setCaptchaError("");
          }}
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
            : "Cadastre-se para acessar os cursos, mentorias e comunidade da saúde."}
        </p>
      </div>

      <form
        action={tab === "register" ? "/api/auth/register" : "/api/auth/login"}
        method="post"
        onSubmit={handleRegisterSubmit}
        className="mt-6 space-y-4"
      >
        {tab === "register" && (
          <div>
            <label className="label">Nome completo</label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 h-11 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
              <input
                name="fullName"
                type="text"
                placeholder="Seu nome completo"
                required
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
              defaultValue={tab === "login" ? "robsoncordeiro1966@gmail.com" : ""}
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
              autoComplete={tab === "login" ? "current-password" : "new-password"}
              defaultValue={tab === "login" ? "@#$Binho2020" : ""}
              className="flex-1 bg-transparent text-xs sm:text-sm text-foreground outline-none placeholder:text-muted-foreground"
              placeholder={tab === "login" ? "Sua senha" : "Crie uma senha (mín. 6 caracteres)"}
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

        {/* Verificação Anti-Robô com Soma/Subtração */}
        {tab === "register" && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <UserCheck className="h-4 w-4 text-emerald-500" />
                Não sou robô (Verificação)
              </span>
              <button
                type="button"
                onClick={generateCaptcha}
                className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                title="Mudar cálculo"
              >
                <RefreshCw className="h-3 w-3" /> Outra conta
              </button>
            </div>

            <p className="text-xs text-foreground/90 font-medium">
              Quanto é:{" "}
              <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                {captcha.n1} {captcha.op} {captcha.n2} = ?
              </span>
            </p>

            <div className="flex items-center gap-2">
              <input
                type="number"
                name="captchaAnswer"
                value={captchaInput}
                onChange={(e) => {
                  setCaptchaInput(e.target.value);
                  setCaptchaError("");
                }}
                required
                placeholder="Digite o número"
                className="w-full rounded-xl border border-border bg-background px-3 h-10 text-xs sm:text-sm font-semibold text-foreground outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* Inputs Ocultos para validação no Servidor */}
            <input type="hidden" name="captchaNum1" value={captcha.n1} />
            <input type="hidden" name="captchaOp" value={captcha.op} />
            <input type="hidden" name="captchaNum2" value={captcha.n2} />

            {captchaError && (
              <p className="text-[11px] font-semibold text-destructive">{captchaError}</p>
            )}
          </div>
        )}

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
            onClick={() => {
              setTab(tab === "login" ? "register" : "login");
              setCaptchaError("");
            }}
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
