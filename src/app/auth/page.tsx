import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import { AuthThemeToggle } from "./AuthTheme";

export const dynamic = "force-dynamic";
export const metadata = { title: "Entrar — RCS Prime Cursos" };

export default async function AuthPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/overview");

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-200 relative flex flex-col justify-between">
      {/* Top bar with Logo (mobile) and Theme Switcher */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-6 flex items-center justify-between z-20">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 border border-primary/40 text-primary font-bold">
            <span className="font-mono text-sm">RCS</span>
          </div>
          <span className="font-serif font-bold text-lg tracking-tight text-foreground">
            RCS Prime Cursos
          </span>
        </Link>
        <AuthThemeToggle />
      </header>

      {/* Main Container */}
      <div className="relative mx-auto grid w-full max-w-7xl lg:grid-cols-[1.1fr_1fr] items-center p-4 sm:p-8 lg:p-12 my-auto">
        {/* Lado Esquerdo idêntico ao Print 04 */}
        <section className="hidden lg:flex flex-col justify-between py-6 pr-12">
          {/* Conteúdo Central */}
          <div className="space-y-4 max-w-lg">
            <h1 className="font-serif text-5xl xl:text-6xl font-bold tracking-tight text-foreground leading-[1.08]">
              Continue de <br />
              onde parou.
            </h1>

            <p className="text-sm xl:text-base text-muted-foreground leading-relaxed max-w-md">
              Seus cursos, as mentorias e a comunidade de quem se prepara de verdade para concursos da saúde.
            </p>
          </div>

          {/* Card Flutuante de Depoimento idêntico ao Print 04 */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-[#12221b]/95 backdrop-blur-md p-4 max-w-sm shadow-xl space-y-3 text-white">
            <p className="text-xs text-white/90 italic leading-relaxed">
              &ldquo;É ter alguém muito bom, que sabe o que eu preciso estudar, à disposição a qualquer hora.&rdquo;
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                  BM
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Bruno Mendes</p>
                  <p className="text-[10px] text-white/60">Técnico de Enfermagem & Concursado</p>
                </div>
              </div>

              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/40" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-white/70 pt-1">
              <div className="flex -space-x-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-white font-bold text-[8px] ring-2 ring-[#12221b]">
                  SP
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-white font-bold text-[8px] ring-2 ring-[#12221b]">
                  RJ
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 text-white font-bold text-[8px] ring-2 ring-[#12221b]">
                  MG
                </span>
              </div>
              <span>Membros de São Paulo, Rio, Minas e todo o Brasil</span>
            </div>
          </div>
        </section>

        {/* Lado Direito: Formulário de Autenticação */}
        <section className="flex flex-col items-center justify-center w-full py-4">
          <LoginForm />
        </section>
      </div>

      <footer className="w-full text-center py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} RCS Prime Cursos — Todos os direitos reservados.
      </footer>
    </main>
  );
}
