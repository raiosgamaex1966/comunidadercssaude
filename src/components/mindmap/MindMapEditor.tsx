"use client";

import React, { useState, useCallback, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  ArrowLeft,
  Undo2,
  Redo2,
  Search,
  Star,
  GraduationCap,
  Download,
  Maximize2,
  Share2,
  MousePointer2,
  Hand,
  Square,
  Type,
  StickyNote,
  Hash,
  GitFork,
  ArrowUpRight,
  Minus,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";

import { MindMapNode, MindMapNodeData } from "./MindMapNode";
import { saveNoteMindMap, toggleNoteFavorite } from "@/lib/actions";

const nodeTypes = {
  mindMap: MindMapNode,
};

interface NoteData {
  id: number;
  title: string;
  content: string | null;
  favorite: boolean;
  folder: string;
}

interface MindMapEditorProps {
  note: NoteData;
}

function parseInitialContent(note: NoteData): { nodes: Node[]; edges: Edge[] } {
  if (note.content) {
    try {
      const parsed = JSON.parse(note.content);
      if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges) && parsed.nodes.length > 0) {
        return {
          nodes: parsed.nodes,
          edges: parsed.edges,
        };
      }
    } catch {
      // Content is not JSON, check if it's "Resumo" or generate from text
    }
  }

  // Se o título for "Resumo da aula" ou "Resumo de aula", carregar o modelo exato do Print 04
  const lowerTitle = note.title.toLowerCase();
  if (lowerTitle.includes("resumo") || lowerTitle.includes("aula")) {
    return {
      nodes: [
        {
          id: "root",
          type: "mindMap",
          position: { x: 380, y: 260 },
          data: { label: note.title || "Resumo da aula", color: "#22c55e", isRoot: true },
        },
        // Ramo esquerdo 1 (Roxo)
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
        // Ramo esquerdo 2 (Vermelho / Rosa)
        {
          id: "n-aplicar",
          type: "mindMap",
          position: { x: 40, y: 350 },
          data: { label: "Como aplicar no meu projeto", color: "#f43f5e" },
        },
        // Ramo direito 1 (Azul / Ciano)
        {
          id: "n-ideia",
          type: "mindMap",
          position: { x: 630, y: 180 },
          data: { label: "Ideia principal", color: "#06b6d4" },
        },
        // Ramo direito 2 (Pink)
        {
          id: "n-exemplos",
          type: "mindMap",
          position: { x: 630, y: 250 },
          data: { label: "Exemplos", color: "#ec4899" },
        },
        // Ramo direito 3 (Laranja / Amarelo)
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
    };
  }

  // Modelo "Em branco" padrão (Print 02)
  return {
    nodes: [
      {
        id: "root",
        type: "mindMap",
        position: { x: 450, y: 280 },
        data: { label: note.title || "Novo mapa", color: "#22c55e", isRoot: true },
      },
    ],
    edges: [],
  };
}

export function MindMapEditor({ note }: MindMapEditorProps) {
  return (
    <ReactFlowProvider>
      <MindMapEditorInner note={note} />
    </ReactFlowProvider>
  );
}

function MindMapEditorInner({ note }: MindMapEditorProps) {
  const router = useRouter();
  const initial = parseInitialContent(note);
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
  const [title, setTitle] = useState(note.title);
  const [favorite, setFavorite] = useState(note.favorite);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [activeTool, setActiveTool] = useState<"select" | "pan" | "shape" | "text" | "note" | "branch">("select");
  const [studyMode, setStudyMode] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const reactFlowInstance = useReactFlow();

  // History for Undo / Redo
  const historyRef = useRef<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const historyIndexRef = useRef<number>(-1);

  const pushHistory = useCallback(
    (n: Node[], e: Edge[]) => {
      const history = historyRef.current.slice(0, historyIndexRef.current + 1);
      history.push({ nodes: JSON.parse(JSON.stringify(n)), edges: JSON.parse(JSON.stringify(e)) });
      historyRef.current = history;
      historyIndexRef.current = history.length - 1;
    },
    []
  );

  useEffect(() => {
    pushHistory(nodes, edges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const state = historyRef.current[historyIndexRef.current];
      setNodes(state.nodes);
      setEdges(state.edges);
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const state = historyRef.current[historyIndexRef.current];
      setNodes(state.nodes);
      setEdges(state.edges);
    }
  };

  // Node Callbacks
  const handleChangeLabel = useCallback((id: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: newLabel } } : n))
    );
  }, [setNodes]);

  const handleChangeColor = useCallback((id: string, color: string) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, color } } : n))
    );
    // Also update edge connected to this node
    setEdges((eds) =>
      eds.map((e) => (e.target === id ? { ...e, style: { ...e.style, stroke: color } } : e))
    );
  }, [setNodes, setEdges]);

  const handleToggleFormat = useCallback(
    (id: string, format: "bold" | "italic" | "strikethrough") => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== id) return n;
          const curr = (n.data as unknown as MindMapNodeData)[format];
          return {
            ...n,
            data: {
              ...n.data,
              [format]: !curr,
            },
          };
        })
      );
    },
    [setNodes]
  );

  const handleSetEmoji = useCallback((id: string, emoji: string) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, emoji } } : n))
    );
  }, [setNodes]);

  const handleDeleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      setSelectedNodeId(null);
    },
    [setNodes, setEdges]
  );

  // Add child node
  const handleAddChild = useCallback(
    (parentId: string) => {
      const parent = nodes.find((n) => n.id === parentId);
      if (!parent) return;

      const pData = parent.data as unknown as MindMapNodeData;
      const childColor = pData.color && pData.color !== "#22c55e" ? pData.color : "#38bdf8";

      // Detect if parent is on the left or right side of canvas
      const isLeft = parent.position.x < 350;
      const newX = isLeft ? parent.position.x - 170 : parent.position.x + 190;
      const newY = parent.position.y + (Math.random() * 40 - 20);

      const newId = `node-${Date.now()}`;
      const newNode: Node = {
        id: newId,
        type: "mindMap",
        position: { x: newX, y: newY },
        data: {
          label: "Novo ponto",
          color: childColor,
        },
      };

      const newEdge: Edge = {
        id: `edge-${parentId}-${newId}`,
        source: parentId,
        target: newId,
        sourceHandle: isLeft ? "left" : "right",
        targetHandle: isLeft ? "right" : "left",
        type: "bezier",
        style: { stroke: childColor, strokeWidth: 2 },
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
      setSelectedNodeId(newId);
    },
    [nodes, setNodes, setEdges]
  );

  // Add sibling node
  const handleAddSibling = useCallback(
    (currentId: string) => {
      const incomingEdge = edges.find((e) => e.target === currentId);
      if (incomingEdge) {
        handleAddChild(incomingEdge.source);
      } else {
        handleAddChild(currentId);
      }
    },
    [edges, handleAddChild]
  );

  // Inject callbacks into node data
  const processedNodes = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onChangeLabel: handleChangeLabel,
      onAddChild: handleAddChild,
      onAddSibling: handleAddSibling,
      onChangeColor: handleChangeColor,
      onDeleteNode: handleDeleteNode,
      onToggleFormat: handleToggleFormat,
      onSetEmoji: handleSetEmoji,
    },
  }));

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find((n) => n.id === params.source);
      const color = (sourceNode?.data as unknown as MindMapNodeData)?.color || "#22c55e";
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "bezier",
            style: { stroke: color, strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [nodes, setEdges]
  );

  // Keyboard Shortcuts: Tab for child, Enter for sibling, Delete to remove
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "Tab" && selectedNodeId) {
        e.preventDefault();
        handleAddChild(selectedNodeId);
      } else if (e.key === "Enter" && selectedNodeId) {
        e.preventDefault();
        handleAddSibling(selectedNodeId);
      } else if ((e.key === "Delete" || e.key === "Backspace") && selectedNodeId) {
        e.preventDefault();
        handleDeleteNode(selectedNodeId);
      } else if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, handleAddChild, handleAddSibling, handleDeleteNode]);

  // Selection change
  const onSelectionChange = useCallback(({ nodes: selectedNodes }: { nodes: Node[] }) => {
    if (selectedNodes.length > 0) {
      setSelectedNodeId(selectedNodes[0].id);
    } else {
      setSelectedNodeId(null);
    }
  }, []);

  // Debounced Auto-Save
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    setSaveStatus("saving");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const contentJson = JSON.stringify({
          nodes: nodes.map((n) => ({
            id: n.id,
            type: n.type,
            position: n.position,
            data: {
              label: (n.data as unknown as MindMapNodeData).label,
              color: (n.data as unknown as MindMapNodeData).color,
              isRoot: (n.data as unknown as MindMapNodeData).isRoot,
              bold: (n.data as unknown as MindMapNodeData).bold,
              italic: (n.data as unknown as MindMapNodeData).italic,
              strikethrough: (n.data as unknown as MindMapNodeData).strikethrough,
              emoji: (n.data as unknown as MindMapNodeData).emoji,
            },
          })),
          edges: edges.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            sourceHandle: e.sourceHandle,
            targetHandle: e.targetHandle,
            type: e.type,
            style: e.style,
          })),
        });

        await saveNoteMindMap(note.id, title, contentJson);
        setSaveStatus("saved");
      } catch (err) {
        console.error("Erro ao salvar mapa mental:", err);
        setSaveStatus("saved");
      }
    }, 1200);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [nodes, edges, title, note.id]);

  // Toggle favorite
  const handleToggleFav = () => {
    setFavorite(!favorite);
    startTransition(async () => {
      await toggleNoteFavorite(note.id);
    });
  };

  // Export JSON or image
  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ title, nodes, edges }, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${title || "mapa-mental"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Add Free Node from Toolbar
  const handleAddFreeNode = () => {
    const center = reactFlowInstance.screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    const newId = `node-${Date.now()}`;
    const newNode: Node = {
      id: newId,
      type: "mindMap",
      position: { x: center.x, y: center.y },
      data: {
        label: "Novo ponto",
        color: "#22c55e",
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(newId);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07110c] text-white select-none overflow-hidden">
      {/* 1. TOP BAR (Prints 02, 03, 04) */}
      <header className="relative z-30 flex h-14 items-center justify-between border-b border-white/10 bg-[#07110c]/90 px-4 backdrop-blur-md">
        {/* Left: Back Arrow + Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/anotacoes"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition"
            title="Voltar para Anotações"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Novo mapa"
            className="bg-transparent font-medium text-base text-white outline-none focus:border-b focus:border-emerald-500 w-56 sm:w-80"
          />
        </div>

        {/* Center: Save indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/40">
          {saveStatus === "saving" ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Salvo</span>
            </>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Undo / Redo */}
          <button
            onClick={handleUndo}
            title="Desfazer (Ctrl+Z)"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleRedo}
            title="Refazer (Ctrl+Shift+Z)"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <Redo2 className="h-4 w-4" />
          </button>

          <span className="mx-1 h-4 w-px bg-white/10" />

          {/* Search / Zoom to fit */}
          <button
            onClick={() => reactFlowInstance.fitView({ padding: 0.2, duration: 400 })}
            title="Ajustar visualização"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Star / Favorite */}
          <button
            onClick={handleToggleFav}
            title="Favoritar"
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
              favorite ? "text-amber-400" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Star className={`h-4 w-4 ${favorite ? "fill-amber-400" : ""}`} />
          </button>

          {/* Study Mode Button (Print 02/03/04: 🎓 Estudar) */}
          <button
            onClick={() => setStudyMode(!studyMode)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition shadow-sm ${
              studyMode
                ? "bg-emerald-500 text-[#051b10] shadow-emerald-500/20"
                : "border border-emerald-500/30 bg-emerald-500/10 text-[#3bff8d] hover:bg-emerald-500/20"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Estudar</span>
          </button>

          <span className="mx-1 h-4 w-px bg-white/10" />

          {/* Export */}
          <button
            onClick={handleExport}
            title="Exportar mapa (.json)"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <Download className="h-4 w-4" />
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else {
                document.exitFullscreen().catch(() => {});
              }
            }}
            title="Tela cheia"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 2. FLOATING LEFT TOOLBAR (Prints 02, 03, 04) */}
      <div className="absolute left-4 top-20 z-20 flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-[#0c1a14]/90 p-1.5 shadow-xl backdrop-blur-md">
        {/* Pointer / Select */}
        <button
          onClick={() => setActiveTool("select")}
          title="Selecionar / Mover"
          className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
            activeTool === "select"
              ? "bg-emerald-500/25 text-[#3bff8d] border border-emerald-500/40"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          <MousePointer2 className="h-4 w-4" />
        </button>

        {/* Hand / Pan */}
        <button
          onClick={() => setActiveTool("pan")}
          title="Navegar pelo mapa"
          className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
            activeTool === "pan"
              ? "bg-emerald-500/25 text-[#3bff8d] border border-emerald-500/40"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Hand className="h-4 w-4" />
        </button>

        <span className="my-0.5 h-px w-5 bg-white/10" />

        {/* Shape / Rectangle */}
        <button
          onClick={handleAddFreeNode}
          title="Criar forma / nó"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
        >
          <Square className="h-4 w-4" />
        </button>

        {/* Text node */}
        <button
          onClick={handleAddFreeNode}
          title="Adicionar texto (T)"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
        >
          <Type className="h-4 w-4" />
        </button>

        {/* Sticky Note */}
        <button
          onClick={handleAddFreeNode}
          title="Nota adesiva"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
        >
          <StickyNote className="h-4 w-4" />
        </button>

        {/* Grid / Hash */}
        <button
          onClick={handleAddFreeNode}
          title="Tópico / Grade"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
        >
          <Hash className="h-4 w-4" />
        </button>

        {/* Mind Map Branch */}
        <button
          onClick={() => {
            if (selectedNodeId) handleAddChild(selectedNodeId);
            else handleAddFreeNode();
          }}
          title="Adicionar ramo"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
        >
          <GitFork className="h-4 w-4" />
        </button>

        {/* Arrow connector */}
        <button
          onClick={() => {
            if (selectedNodeId) handleAddChild(selectedNodeId);
          }}
          title="Conector / Seta"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>

        {/* Line */}
        <button
          onClick={handleAddFreeNode}
          title="Linha"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      {/* 3. TOP HELPER PILL (Print 03) */}
      {selectedNodeId && (
        <div className="pointer-events-none absolute top-18 left-1/2 -translate-x-1/2 z-20 rounded-full border border-white/10 bg-[#0c1a14]/90 px-4 py-1.5 text-xs text-muted-foreground shadow-lg backdrop-blur">
          Tab cria um ramo · Enter cria outro · comece a escrever para editar
        </div>
      )}

      {/* 4. CANVAS AREA */}
      <div className="relative flex-1 w-full h-full">
        <ReactFlow
          nodes={processedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          panOnDrag={activeTool === "pan" ? true : [1, 2]}
          selectionOnDrag={activeTool === "select"}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.2}
          maxZoom={2.5}
          defaultEdgeOptions={{
            type: "bezier",
          }}
        >
          <Background color="#163824" gap={20} size={1} />

          {/* Minimap (Print 02/03/04 bottom-left) */}
          <MiniMap
            position="bottom-left"
            nodeStrokeWidth={3}
            nodeColor={(n) => {
              const d = n.data as unknown as MindMapNodeData;
              return d?.color || "#22c55e";
            }}
            maskColor="rgba(7, 17, 12, 0.85)"
            className="!bg-[#07110c] !border !border-white/10 !rounded-xl !overflow-hidden !m-4"
          />

          {/* Controls (Print 02/03/04 bottom-right) */}
          <Controls
            position="bottom-right"
            showInteractive={false}
            className="!bg-[#0e1c15] !border-white/10 !rounded-xl !text-white !m-4 [&>button]:!bg-[#0e1c15] [&>button]:!border-white/10 [&>button]:!fill-white [&>button:hover]:!bg-white/10"
          />
        </ReactFlow>
      </div>

      {/* Study Mode Overlay if active */}
      {studyMode && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 rounded-full border border-emerald-500/40 bg-[#0a1811]/95 px-5 py-2 shadow-2xl backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-300">
            Modo Estudo Ativo — Clique nos nós para revisar e expandir suas memórias!
          </span>
          <button
            onClick={() => setStudyMode(false)}
            className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-white/20"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
