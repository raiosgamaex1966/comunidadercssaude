"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  Share2,
  Star,
  Globe,
  Folder,
  Plus,
  X,
  Search,
  Network,
  BookOpen,
  Layers,
  Check,
  ArrowRight,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import {
  createNote,
  toggleNoteFavorite,
  deleteNote,
  duplicateNote,
  renameNote,
  moveNoteFolder,
} from "@/lib/actions";

export interface NoteItem {
  id: number;
  title: string;
  content: string | null;
  folder: string;
  favorite: boolean;
  updatedAt: Date;
}

export function AnotacoesClient({
  notesList,
  folders,
  initialQuery = "",
  initialTab = "todas",
}: {
  notesList: NoteItem[];
  folders: string[];
  initialQuery?: string;
  initialTab?: string;
}) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [search, setSearch] = useState<string>(initialQuery);
  const [showNewMapModal, setShowNewMapModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [customFolders, setCustomFolders] = useState<string[]>(folders);

  // Menu de opções (...) de cada card (Print 05)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [renamingNote, setRenamingNote] = useState<{ id: number; title: string } | null>(null);
  const [movingNote, setMovingNote] = useState<{ id: number; currentFolder: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Notas do RCS Prime Cursos
  const communityMaps = [
    {
      id: "pub-1",
      title: "4 REGRAS SIMPLES - LEGISLAÇÃO SUS",
      subtitle: "Publicado pelo RCS Prime Cursos",
      content:
        "Princípios Fundamentais do SUS:\n- Universalidade\n- Integralidade\n- Equidade\n- Descentralização com comando único",
      folder: "SUS",
      date: "há 2 dias",
    },
    {
      id: "pub-2",
      title: "MNEMÔNICOS DE ENFERMAGEM & CÁLCULO DE MEDICAÇÃO",
      subtitle: "Publicado pelo RCS Prime Cursos",
      content:
        "Regra das gotas e microgotas:\n- Gotas/min = Volume / (Tempo em horas x 3)\n- Microgotas/min = Volume / Tempo em horas",
      folder: "Enfermagem",
      date: "há 5 dias",
    },
  ];

  // Filtro
  const filteredUserNotes = notesList.filter((n) => {
    const matchesSearch =
      !search ||
      `${n.title} ${n.content ?? ""}`.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === "todas") return true;
    if (activeTab === "favoritos") return n.favorite;
    if (activeTab === "publicados") return false;
    return n.folder === activeTab;
  });

  // Modelos do Modal "Novo mapa" (Prints 02, 03, 04)
  const templates = [
    {
      id: "blank",
      title: "Em branco",
      desc: "Só o tema central, para começar do zero.",
      tag: "Novo mapa",
      tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      content: JSON.stringify({
        nodes: [
          {
            id: "root",
            type: "mindMap",
            position: { x: 450, y: 280 },
            data: { label: "Novo mapa", color: "#22c55e", isRoot: true },
          },
        ],
        edges: [],
      }),
    },
    {
      id: "class-summary",
      title: "Resumo de aula",
      desc: "Ideia principal, conceitos, exemplos e o que aplicar.",
      tag: "Resumo de aula",
      tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      bars: ["bg-purple-500", "bg-cyan-500", "bg-amber-500"],
      content: JSON.stringify({
        nodes: [
          {
            id: "root",
            type: "mindMap",
            position: { x: 380, y: 260 },
            data: { label: "Resumo da aula", color: "#22c55e", isRoot: true },
          },
          {
            id: "n-conceitos",
            type: "mindMap",
            position: { x: 190, y: 220 },
            data: { label: "Conceitos", color: "#a855f7" },
          },
          {
            id: "n-c1",
            type: "mindMap",
            position: { x: 10, y: 180 },
            data: { label: "Conceito 1", color: "#a855f7" },
          },
          {
            id: "n-c2",
            type: "mindMap",
            position: { x: 10, y: 250 },
            data: { label: "Conceito 2", color: "#a855f7" },
          },
          {
            id: "n-aplicar",
            type: "mindMap",
            position: { x: 40, y: 350 },
            data: { label: "Como aplicar no meu projeto", color: "#f43f5e" },
          },
          {
            id: "n-ideia",
            type: "mindMap",
            position: { x: 630, y: 180 },
            data: { label: "Ideia principal", color: "#06b6d4" },
          },
          {
            id: "n-exemplos",
            type: "mindMap",
            position: { x: 630, y: 250 },
            data: { label: "Exemplos", color: "#ec4899" },
          },
          {
            id: "n-duvidas",
            type: "mindMap",
            position: { x: 630, y: 340 },
            data: { label: "Dúvidas para a mentoria", color: "#f59e0b" },
          },
        ],
        edges: [
          {
            id: "e-root-conceitos",
            source: "root",
            target: "n-conceitos",
            sourceHandle: "left",
            targetHandle: "right",
            type: "bezier",
            style: { stroke: "#a855f7", strokeWidth: 2 },
          },
          {
            id: "e-conceitos-c1",
            source: "n-conceitos",
            target: "n-c1",
            sourceHandle: "left",
            targetHandle: "right",
            type: "bezier",
            style: { stroke: "#a855f7", strokeWidth: 2 },
          },
          {
            id: "e-conceitos-c2",
            source: "n-conceitos",
            target: "n-c2",
            sourceHandle: "left",
            targetHandle: "right",
            type: "bezier",
            style: { stroke: "#a855f7", strokeWidth: 2 },
          },
          {
            id: "e-root-aplicar",
            source: "root",
            target: "n-aplicar",
            sourceHandle: "left",
            targetHandle: "right",
            type: "bezier",
            style: { stroke: "#f43f5e", strokeWidth: 2 },
          },
          {
            id: "e-root-ideia",
            source: "root",
            target: "n-ideia",
            sourceHandle: "right",
            targetHandle: "left",
            type: "bezier",
            style: { stroke: "#06b6d4", strokeWidth: 2 },
          },
          {
            id: "e-root-exemplos",
            source: "root",
            target: "n-exemplos",
            sourceHandle: "right",
            targetHandle: "left",
            type: "bezier",
            style: { stroke: "#ec4899", strokeWidth: 2 },
          },
          {
            id: "e-root-duvidas",
            source: "root",
            target: "n-duvidas",
            sourceHandle: "right",
            targetHandle: "left",
            type: "bezier",
            style: { stroke: "#f59e0b", strokeWidth: 2 },
          },
        ],
      }),
    },
    {
      id: "brainstorm",
      title: "Brainstorm",
      desc: "Ideias soltas em volta de um tema, para depois escolher.",
      tag: "Ideias",
      tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
      bars: ["bg-cyan-400", "bg-pink-500", "bg-yellow-400"],
      content: JSON.stringify({
        nodes: [
          {
            id: "root",
            type: "mindMap",
            position: { x: 400, y: 250 },
            data: { label: "Brainstorm", color: "#38bdf8", isRoot: true },
          },
          {
            id: "n-a",
            type: "mindMap",
            position: { x: 180, y: 200 },
            data: { label: "Ideia A", color: "#06b6d4" },
          },
          {
            id: "n-b",
            type: "mindMap",
            position: { x: 620, y: 200 },
            data: { label: "Ideia B", color: "#ec4899" },
          },
          {
            id: "n-c",
            type: "mindMap",
            position: { x: 400, y: 370 },
            data: { label: "Ideia C", color: "#eab308" },
          },
        ],
        edges: [
          {
            id: "e-root-a",
            source: "root",
            target: "n-a",
            sourceHandle: "left",
            targetHandle: "right",
            type: "bezier",
            style: { stroke: "#06b6d4", strokeWidth: 2 },
          },
          {
            id: "e-root-b",
            source: "root",
            target: "n-b",
            sourceHandle: "right",
            targetHandle: "left",
            type: "bezier",
            style: { stroke: "#ec4899", strokeWidth: 2 },
          },
          {
            id: "e-root-c",
            source: "root",
            target: "n-c",
            sourceHandle: "bottom",
            targetHandle: "top",
            type: "bezier",
            style: { stroke: "#eab308", strokeWidth: 2 },
          },
        ],
      }),
    },
    {
      id: "project-plan",
      title: "Plano de projeto",
      desc: "Objetivo, etapas, tarefas e prazos de um app ou site.",
      tag: "Meu projeto",
      tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
      bars: ["bg-blue-500", "bg-orange-500"],
      content: JSON.stringify({
        nodes: [
          {
            id: "root",
            type: "mindMap",
            position: { x: 400, y: 250 },
            data: { label: "Plano de Estudos", color: "#22c55e", isRoot: true },
          },
          {
            id: "n-obj",
            type: "mindMap",
            position: { x: 180, y: 200 },
            data: { label: "Objetivo / Edital", color: "#3b82f6" },
          },
          {
            id: "n-f1",
            type: "mindMap",
            position: { x: 620, y: 170 },
            data: { label: "Fase 1: Teoria", color: "#f59e0b" },
          },
          {
            id: "n-f2",
            type: "mindMap",
            position: { x: 620, y: 240 },
            data: { label: "Fase 2: Questões", color: "#f59e0b" },
          },
          {
            id: "n-f3",
            type: "mindMap",
            position: { x: 620, y: 310 },
            data: { label: "Fase 3: Revisão", color: "#f59e0b" },
          },
        ],
        edges: [
          {
            id: "e-1",
            source: "root",
            target: "n-obj",
            sourceHandle: "left",
            targetHandle: "right",
            type: "bezier",
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          },
          {
            id: "e-2",
            source: "root",
            target: "n-f1",
            sourceHandle: "right",
            targetHandle: "left",
            type: "bezier",
            style: { stroke: "#f59e0b", strokeWidth: 2 },
          },
          {
            id: "e-3",
            source: "root",
            target: "n-f2",
            sourceHandle: "right",
            targetHandle: "left",
            type: "bezier",
            style: { stroke: "#f59e0b", strokeWidth: 2 },
          },
          {
            id: "e-4",
            source: "root",
            target: "n-f3",
            sourceHandle: "right",
            targetHandle: "left",
            type: "bezier",
            style: { stroke: "#f59e0b", strokeWidth: 2 },
          },
        ],
      }),
    },
    {
      id: "swot",
      title: "Análise SWOT",
      desc: "Forças, fraquezas, oportunidades e ameaças.",
      tag: "Análise SWOT",
      tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
      bars: ["bg-blue-400", "bg-indigo-400"],
      content: JSON.stringify({
        nodes: [
          {
            id: "root",
            type: "mindMap",
            position: { x: 400, y: 250 },
            data: { label: "Análise SWOT Concurso", color: "#22c55e", isRoot: true },
          },
          {
            id: "s",
            type: "mindMap",
            position: { x: 180, y: 170 },
            data: { label: "Forças (Strengths)", color: "#22c55e" },
          },
          {
            id: "w",
            type: "mindMap",
            position: { x: 180, y: 320 },
            data: { label: "Fraquezas (Weaknesses)", color: "#f43f5e" },
          },
          {
            id: "o",
            type: "mindMap",
            position: { x: 620, y: 170 },
            data: { label: "Oportunidades", color: "#06b6d4" },
          },
          {
            id: "t",
            type: "mindMap",
            position: { x: 620, y: 320 },
            data: { label: "Ameaças", color: "#f59e0b" },
          },
        ],
        edges: [
          {
            id: "es",
            source: "root",
            target: "s",
            sourceHandle: "left",
            targetHandle: "right",
            type: "bezier",
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
          {
            id: "ew",
            source: "root",
            target: "w",
            sourceHandle: "left",
            targetHandle: "right",
            type: "bezier",
            style: { stroke: "#f43f5e", strokeWidth: 2 },
          },
          {
            id: "eo",
            source: "root",
            target: "o",
            sourceHandle: "right",
            targetHandle: "left",
            type: "bezier",
            style: { stroke: "#06b6d4", strokeWidth: 2 },
          },
          {
            id: "et",
            source: "root",
            target: "t",
            sourceHandle: "right",
            targetHandle: "left",
            type: "bezier",
            style: { stroke: "#f59e0b", strokeWidth: 2 },
          },
        ],
      }),
    },
    {
      id: "book-summary",
      title: "Resumo de livro",
      desc: "Tese, capítulos, citações e o que levar para a prática.",
      tag: "Livro",
      tagColor: "bg-red-500/20 text-red-400 border-red-500/40",
      bars: ["bg-red-400", "bg-amber-400"],
      content: JSON.stringify({
        nodes: [
          {
            id: "root",
            type: "mindMap",
            position: { x: 400, y: 250 },
            data: { label: "Resumo de Livro", color: "#f43f5e", isRoot: true },
          },
          {
            id: "tese",
            type: "mindMap",
            position: { x: 180, y: 220 },
            data: { label: "Tese Central", color: "#f59e0b" },
          },
          {
            id: "caps",
            type: "mindMap",
            position: { x: 620, y: 220 },
            data: { label: "Capítulos Chave", color: "#38bdf8" },
          },
        ],
        edges: [
          {
            id: "eb1",
            source: "root",
            target: "tese",
            sourceHandle: "left",
            targetHandle: "right",
            type: "bezier",
            style: { stroke: "#f59e0b", strokeWidth: 2 },
          },
          {
            id: "eb2",
            source: "root",
            target: "caps",
            sourceHandle: "right",
            targetHandle: "left",
            type: "bezier",
            style: { stroke: "#38bdf8", strokeWidth: 2 },
          },
        ],
      }),
    },
    {
      id: "study-week",
      title: "Semana de estudos",
      desc: "O que estudar em cada dia, em formato de lista.",
      tag: "Semana de estudos",
      tagColor: "bg-purple-500/20 text-purple-400 border-purple-500/40",
      bars: ["bg-purple-400", "bg-pink-400", "bg-cyan-400"],
      content: JSON.stringify({
        nodes: [
          {
            id: "root",
            type: "mindMap",
            position: { x: 400, y: 250 },
            data: { label: "Cronograma Semanal", color: "#a855f7", isRoot: true },
          },
          {
            id: "seg",
            type: "mindMap",
            position: { x: 180, y: 180 },
            data: { label: "Segunda: Português", color: "#06b6d4" },
          },
          {
            id: "ter",
            type: "mindMap",
            position: { x: 180, y: 280 },
            data: { label: "Terça: Legislação SUS", color: "#22c55e" },
          },
          {
            id: "qua",
            type: "mindMap",
            position: { x: 620, y: 180 },
            data: { label: "Quarta: Raciocínio Lógico", color: "#ec4899" },
          },
          {
            id: "qui",
            type: "mindMap",
            position: { x: 620, y: 280 },
            data: { label: "Quinta: Específica", color: "#f59e0b" },
          },
        ],
        edges: [
          {
            id: "eseg",
            source: "root",
            target: "seg",
            sourceHandle: "left",
            targetHandle: "right",
            type: "bezier",
            style: { stroke: "#06b6d4", strokeWidth: 2 },
          },
          {
            id: "eter",
            source: "root",
            target: "ter",
            sourceHandle: "left",
            targetHandle: "right",
            type: "bezier",
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
          {
            id: "equa",
            source: "root",
            target: "qua",
            sourceHandle: "right",
            targetHandle: "left",
            type: "bezier",
            style: { stroke: "#ec4899", strokeWidth: 2 },
          },
          {
            id: "equi",
            source: "root",
            target: "qui",
            sourceHandle: "right",
            targetHandle: "left",
            type: "bezier",
            style: { stroke: "#f59e0b", strokeWidth: 2 },
          },
        ],
      }),
    },
    {
      id: "process-flow",
      title: "Fluxograma de processo",
      desc: "Passo a passo com decisão e setas: um guia do processo.",
      tag: "Processo",
      tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      content: JSON.stringify({
        nodes: [
          {
            id: "root",
            type: "mindMap",
            position: { x: 400, y: 250 },
            data: { label: "Triagem Manchester", color: "#22c55e", isRoot: true },
          },
          {
            id: "verm",
            type: "mindMap",
            position: { x: 180, y: 190 },
            data: { label: "Vermelho: Emergência", color: "#f43f5e" },
          },
          {
            id: "amar",
            type: "mindMap",
            position: { x: 180, y: 290 },
            data: { label: "Amarelo: Urgente", color: "#f59e0b" },
          },
          {
            id: "verd",
            type: "mindMap",
            position: { x: 620, y: 240 },
            data: { label: "Verde: Pouco Urgente", color: "#22c55e" },
          },
        ],
        edges: [
          {
            id: "ev",
            source: "root",
            target: "verm",
            sourceHandle: "left",
            targetHandle: "right",
            type: "bezier",
            style: { stroke: "#f43f5e", strokeWidth: 2 },
          },
          {
            id: "ea",
            source: "root",
            target: "amar",
            sourceHandle: "left",
            targetHandle: "right",
            type: "bezier",
            style: { stroke: "#f59e0b", strokeWidth: 2 },
          },
          {
            id: "eg",
            source: "root",
            target: "verd",
            sourceHandle: "right",
            targetHandle: "left",
            type: "bezier",
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
        ],
      }),
    },
    {
      id: "client-proposal",
      title: "Proposta para cliente",
      desc: "Problema do cliente, solução, entregas, preço e prazos.",
      tag: "Proposta",
      tagColor: "bg-teal-500/20 text-teal-400 border-teal-500/40",
      bars: ["bg-teal-400", "bg-orange-400"],
      content: JSON.stringify({
        nodes: [
          {
            id: "root",
            type: "mindMap",
            position: { x: 400, y: 250 },
            data: { label: "Proposta do Projeto", color: "#06b6d4", isRoot: true },
          },
          {
            id: "prob",
            type: "mindMap",
            position: { x: 180, y: 220 },
            data: { label: "Diagnóstico Inicial", color: "#f59e0b" },
          },
          {
            id: "sol",
            type: "mindMap",
            position: { x: 620, y: 220 },
            data: { label: "Entregas & Solução", color: "#22c55e" },
          },
        ],
        edges: [
          {
            id: "eprob",
            source: "root",
            target: "prob",
            sourceHandle: "left",
            targetHandle: "right",
            type: "bezier",
            style: { stroke: "#f59e0b", strokeWidth: 2 },
          },
          {
            id: "esol",
            source: "root",
            target: "sol",
            sourceHandle: "right",
            targetHandle: "left",
            type: "bezier",
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
        ],
      }),
    },
  ];

  function handleAddFolder(e: React.FormEvent) {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    if (!customFolders.includes(newFolderName.trim())) {
      setCustomFolders([...customFolders, newFolderName.trim()]);
    }
    setActiveTab(newFolderName.trim());
    setNewFolderName("");
    setShowNewFolderModal(false);
  }

  function handleRenameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!renamingNote || !renamingNote.title.trim()) return;
    startTransition(async () => {
      await renameNote(renamingNote.id, renamingNote.title.trim());
      setRenamingNote(null);
    });
  }

  function handleMoveFolderSubmit(folderName: string) {
    if (!movingNote) return;
    startTransition(async () => {
      await moveNoteFolder(movingNote.id, folderName);
      setMovingNote(null);
    });
  }

  function handleDuplicate(id: number) {
    setOpenMenuId(null);
    startTransition(async () => {
      await duplicateNote(id);
    });
  }

  function handleDelete(id: number) {
    setOpenMenuId(null);
    if (confirm("Tem certeza que deseja apagar este mapa mental?")) {
      startTransition(async () => {
        await deleteNote(id);
      });
    }
  }

  return (
    <div
      onClick={() => setOpenMenuId(null)}
      className="space-y-6 pb-12"
    >
      {/* 1. Top Hero Card estilo PH Community / Comunidade Saúde RCS (Print 01 e 05) */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-primary">
            Anotações
          </span>

          <h1 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Organize suas ideias <br />
            <span className="text-primary">em mapas mentais</span>
          </h1>

          <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Crie mapas mentais e notas para seus estudos, ligue cada nota às aulas e, se quiser,
            publique para a comunidade ver.
          </p>
        </div>

        {/* Efeito decorativo sutil */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      </div>

      {/* 2. Barra Superior: Busca + Botão "Novo mapa" (Print 01 e 05) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nos mapas"
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition"
          />
        </div>

        <button
          onClick={() => setShowNewMapModal(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#3bff8d] px-4 py-2.5 text-xs font-bold text-[#051b10] hover:brightness-110 transition shadow-sm shrink-0"
        >
          <Plus className="h-4 w-4" /> Novo mapa
        </button>
      </div>

      {/* 3. Grid com Sidebar de Categorias + Área de Conteúdo */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar de Abas / Categorias */}
        <aside className="space-y-6">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("todas")}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition",
                activeTab === "todas"
                  ? "bg-accent text-primary font-bold shadow-sm"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Network className="h-4 w-4" /> Todas
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-[#3bff8d]">
                {notesList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("favoritos")}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition",
                activeTab === "favoritos"
                  ? "bg-accent text-primary font-bold shadow-sm"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Star className="h-4 w-4" /> Favoritos
              </span>
              <span className="text-[10px] text-muted-foreground">
                {notesList.filter((n) => n.favorite).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("publicados")}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition",
                activeTab === "publicados"
                  ? "bg-accent text-primary font-bold shadow-sm"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Globe className="h-4 w-4" /> Publicados pela Comunidade
              </span>
              <span className="text-[10px] text-muted-foreground">{communityMaps.length}</span>
            </button>
          </div>

          {/* Seção Pastas */}
          <div>
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Pastas
            </p>
            <div className="space-y-1">
              {customFolders.map((f) => {
                const count = notesList.filter((n) => n.folder === f).length;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveTab(f)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-medium transition",
                      activeTab === f
                        ? "bg-accent text-primary font-bold shadow-sm"
                        : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                    )}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <Folder className="h-4 w-4 shrink-0" /> {f}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{count}</span>
                  </button>
                );
              })}

              <button
                onClick={() => setShowNewFolderModal(true)}
                className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-xs text-muted-foreground hover:bg-accent/40 hover:text-foreground transition"
              >
                <Plus className="h-4 w-4" /> Nova pasta
              </button>
            </div>
          </div>
        </aside>

        {/* Área Principal de Mapas */}
        <div>
          {activeTab === "publicados" ? (
            /* Lista de Mapas Publicados pela Comunidade */
            <div className="grid gap-3 sm:grid-cols-2">
              {communityMaps.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between hover:border-primary/50 transition group"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-primary font-semibold">
                      <Globe className="h-3.5 w-3.5" />
                      <span>{m.subtitle}</span>
                    </div>
                    <h3 className="mt-2 font-serif text-base font-bold text-foreground group-hover:text-primary transition">
                      {m.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                      {m.content}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                    <span className="rounded-md border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {m.folder}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{m.date}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredUserNotes.length === 0 ? (
            /* Estado Vazio */
            <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
                <Network className="h-7 w-7" />
              </div>

              {activeTab === "favoritos" ? (
                <>
                  <h3 className="font-serif text-lg font-bold text-foreground">Nenhum favorito ainda</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground max-w-sm">
                    Toque na estrela de um mapa para ele aparecer aqui.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-serif text-lg font-bold text-foreground">Nenhum mapa aqui ainda</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground max-w-sm">
                    Crie o primeiro: um tema central, ramos, notas, vídeos e áudios.
                  </p>
                  <button
                    onClick={() => setShowNewMapModal(true)}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#3bff8d] px-5 py-2.5 text-xs font-bold text-[#051b10] hover:brightness-110 transition shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> Novo mapa
                  </button>
                </>
              )}
            </div>
          ) : (
            /* Lista de Mapas Salvos (Exatamente como o Print 05) */
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredUserNotes.map((n) => (
                <div
                  key={n.id}
                  className="relative rounded-2xl border border-border bg-card p-4 flex items-center justify-between hover:border-primary/50 transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Ícone verde de Nós/Mapa Mental (Print 05) */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-primary">
                      <Network className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/anotacoes/${n.id}`}
                        className="block font-semibold text-sm text-foreground group-hover:text-primary transition hover:underline truncate"
                      >
                        {n.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Atualizado {timeAgo(n.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Ações: Estrela e Menu (...) (Print 05) */}
                  <div className="relative flex items-center gap-1 shrink-0 ml-2">
                    <form action={toggleNoteFavorite.bind(null, n.id)}>
                      <button
                        type="submit"
                        aria-label="Favoritar"
                        className="p-1.5 text-muted-foreground hover:text-amber-400 transition"
                      >
                        <Star
                          className={cn("h-4 w-4", n.favorite && "fill-amber-400 text-amber-400")}
                        />
                      </button>
                    </form>

                    <button
                      type="button"
                      aria-label="Mais opções"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === n.id ? null : n.id);
                      }}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition rounded-lg hover:bg-muted"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {/* Popover Dropdown de Opções (Print 05) */}
                    {openMenuId === n.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-full mt-1.5 z-40 w-44 rounded-xl border border-border bg-card py-1 shadow-2xl backdrop-blur-md text-xs text-foreground"
                      >
                        {/* Renomear */}
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            setRenamingNote({ id: n.id, title: n.title });
                          }}
                          className="flex w-full items-center gap-2.5 px-3.5 py-2 hover:bg-white/10 text-left transition"
                        >
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Renomear</span>
                        </button>

                        {/* Mover para... */}
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            setMovingNote({ id: n.id, currentFolder: n.folder });
                          }}
                          className="flex w-full items-center justify-between px-3.5 py-2 hover:bg-white/10 text-left transition"
                        >
                          <span className="flex items-center gap-2.5">
                            <Folder className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Mover para...</span>
                          </span>
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        </button>

                        {/* Duplicar */}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(n.id)}
                          className="flex w-full items-center gap-2.5 px-3.5 py-2 hover:bg-white/10 text-left transition"
                        >
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Duplicar</span>
                        </button>

                        <div className="my-1 border-t border-white/10" />

                        {/* Apagar */}
                        <button
                          type="button"
                          onClick={() => handleDelete(n.id)}
                          className="flex w-full items-center gap-2.5 px-3.5 py-2 text-red-400 hover:bg-red-500/20 text-left transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Apagar</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Modal "Novo mapa" (Print 01 e 02) */}
      {showNewMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowNewMapModal(false)}
              className="btn-ghost absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">Novo mapa</h2>
              <p className="mt-1 text-xs text-muted-foreground max-w-xl">
                Comece em branco ou a partir de um modelo. Depois dá para mudar tudo: textos, layout e tema.
              </p>
            </div>

            {/* Grid dos Modelos */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {templates.map((tpl) => (
                <form key={tpl.id} action={createNote} className="flex">
                  <input
                    type="hidden"
                    name="title"
                    value={tpl.id === "blank" ? "Novo mapa" : tpl.title}
                  />
                  <input type="hidden" name="content" value={tpl.content} />
                  <input type="hidden" name="folder" value="Geral" />

                  <button
                    type="submit"
                    className="group flex w-full flex-col justify-between rounded-xl border border-border bg-muted/40 p-3.5 text-left transition hover:border-primary/50 hover:bg-accent/40"
                  >
                    <div>
                      {/* Mini preview visual */}
                      <div className="mb-3 flex items-center gap-1.5">
                        <span
                          className={cn(
                            "rounded-md border px-2 py-0.5 text-[9px] font-bold",
                            tpl.tagColor
                          )}
                        >
                          {tpl.tag}
                        </span>
                        {tpl.bars && (
                          <div className="flex gap-1 ml-auto">
                            {tpl.bars.map((barColor, i) => (
                              <span key={i} className={cn("h-1.5 w-3 rounded-full", barColor)} />
                            ))}
                          </div>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition">
                        {tpl.title}
                      </h4>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                        {tpl.desc}
                      </p>
                    </div>
                  </button>
                </form>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal "Nova pasta" */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setShowNewFolderModal(false)}
              className="btn-ghost absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="font-serif text-lg font-bold text-foreground">Nova pasta</h2>

            <form onSubmit={handleAddFolder} className="mt-4 space-y-4">
              <div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Nome da pasta"
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent/50 hover:text-foreground transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#3bff8d] px-5 py-2 text-xs font-bold text-[#051b10] hover:brightness-110 transition shadow-sm"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal "Renomear" (Print 05) */}
      {renamingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setRenamingNote(null)}
              className="btn-ghost absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="font-serif text-lg font-bold text-foreground">Renomear mapa mental</h2>

            <form onSubmit={handleRenameSubmit} className="mt-4 space-y-4">
              <div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={renamingNote.title}
                  onChange={(e) =>
                    setRenamingNote({ ...renamingNote, title: e.target.value })
                  }
                  placeholder="Novo título"
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRenamingNote(null)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent/50 hover:text-foreground transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#3bff8d] px-5 py-2 text-xs font-bold text-[#051b10] hover:brightness-110 transition shadow-sm"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Modal "Mover para pasta" (Print 05) */}
      {movingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setMovingNote(null)}
              className="btn-ghost absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="font-serif text-lg font-bold text-foreground">Mover para pasta</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Selecione o destino para este mapa mental.
            </p>

            <div className="mt-4 space-y-1.5 max-h-60 overflow-y-auto">
              {["Geral", ...customFolders.filter((f) => f !== "Geral")].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => handleMoveFolderSubmit(f)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-medium transition ${
                    movingNote.currentFolder === f
                      ? "bg-primary/20 text-primary font-bold border border-primary/40"
                      : "bg-muted/50 text-foreground hover:bg-accent/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Folder className="h-4 w-4" /> {f}
                  </span>
                  {movingNote.currentFolder === f && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setMovingNote(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent/50 hover:text-foreground transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
