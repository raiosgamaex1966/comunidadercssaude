"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/courses?${params.toString()}`);
  }

  return (
    <select
      aria-label="Ordenar cursos"
      defaultValue={defaultValue}
      onChange={(e) => handleChange(e.target.value)}
      className="h-9 rounded-xl border border-border bg-card px-2.5 text-xs text-foreground outline-none focus:border-primary cursor-pointer"
    >
      <option value="recent">Mais recentes</option>
      <option value="title">Título (A-Z)</option>
      <option value="progress">Progresso</option>
    </select>
  );
}
