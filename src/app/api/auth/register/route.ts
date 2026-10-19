import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, hashPassword } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";

function redirectTo(path: string, status = 303) {
  return new Response(null, { status, headers: { Location: path } });
}

export async function POST(request: Request) {
  await ensureSeeded();
  const form = await request.formData();
  const fullName = String(form.get("fullName") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");

  // Captcha anti-robô
  const cNum1 = Number(form.get("captchaNum1"));
  const cOp = String(form.get("captchaOp") ?? "+");
  const cNum2 = Number(form.get("captchaNum2"));
  const cAnswer = Number(form.get("captchaAnswer"));

  const fail = (message: string) =>
    redirectTo(`/auth?tab=register&erro=${encodeURIComponent(message)}`);

  if (!fullName || fullName.length < 2) return fail("Informe seu nome completo.");
  if (!/^\S+@\S+\.\S+$/.test(email)) return fail("Informe um e-mail válido.");
  if (!password || password.length < 6) return fail("A senha deve ter no mínimo 6 caracteres.");

  // Validação matemática do desafio anti-robô
  const expected = cOp === "+" ? cNum1 + cNum2 : cNum1 - cNum2;
  if (isNaN(cAnswer) || cAnswer !== expected) {
    return fail(
      `Verificação anti-robô incorreta. O resultado de ${cNum1} ${cOp} ${cNum2} não é ${cAnswer}. Tente novamente.`
    );
  }

  // Verifica se o e-mail já existe
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return fail("Este e-mail já está cadastrado. Faça login para continuar.");
  }

  // Cria o novo usuário
  const passwordHash = await hashPassword(password);
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      fullName,
      passwordHash,
      role: "member",
      active: true,
      country: "Brasil",
    })
    .returning();

  await createSession(newUser.id);
  return redirectTo("/overview");
}
