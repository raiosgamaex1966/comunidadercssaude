"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  GitBranch,
  Type,
  Bold,
  Italic,
  Strikethrough,
  Clock,
  Smile,
  Plus,
  Columns,
  MoreHorizontal,
  Trash2,
  Copy,
  Scissors,
  Clipboard,
  Palette,
} from "lucide-react";

export interface MindMapNodeData {
  label: string;
  color?: string;
  isRoot?: boolean;
  shape?: "pill" | "rectangle" | "note";
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  emoji?: string;
  onChangeLabel?: (id: string, newLabel: string) => void;
  onAddChild?: (id: string) => void;
  onAddSibling?: (id: string) => void;
  onChangeColor?: (id: string, color: string) => void;
  onDeleteNode?: (id: string) => void;
  onToggleFormat?: (id: string, format: "bold" | "italic" | "strikethrough") => void;
  onSetEmoji?: (id: string, emoji: string) => void;
}

const COLOR_PALETTE = [
  { label: "Verde", value: "#22c55e" },
  { label: "Roxo", value: "#a855f7" },
  { label: "Azul Claro", value: "#06b6d4" },
  { label: "Rosa", value: "#ec4899" },
  { label: "Laranja", value: "#f59e0b" },
  { label: "Vermelho", value: "#f43f5e" },
  { label: "Amarelo", value: "#eab308" },
  { label: "Azul", value: "#3b82f6" },
  { label: "Branco", value: "#ffffff" },
];

const EMOJIS = ["💡", "🎯", "⭐", "⚠️", "📌", "✅", "🔥", "📚", "🩺", "💬"];

export const MindMapNode = memo(function MindMapNode({
  id,
  data,
  selected,
}: NodeProps) {
  const nodeData = data as unknown as MindMapNodeData;
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(nodeData.label || "");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const color = nodeData.color || (nodeData.isRoot ? "#22c55e" : "#38bdf8");

  useEffect(() => {
    setLabelText(nodeData.label || "");
  }, [nodeData.label]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (labelText.trim() && labelText !== nodeData.label) {
      nodeData.onChangeLabel?.(id, labelText.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      setLabelText(nodeData.label || "");
      setIsEditing(false);
    }
  };

  return (
    <div className="relative group">
      {/* Handles for bezier branches (left and right) */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-2 !h-2 !bg-[#3bff8d] !border !border-black opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-2 !h-2 !bg-[#3bff8d] !border !border-black opacity-0 group-hover:opacity-100 transition-opacity"
      />
      {/* Also top/bottom handles for multidirectional flow */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-2 !h-2 !bg-[#3bff8d] !border !border-black opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-2 !h-2 !bg-[#3bff8d] !border !border-black opacity-0 group-hover:opacity-100 transition-opacity"
      />

      {/* Node Body */}
      <div
        onDoubleClick={() => setIsEditing(true)}
        style={{
          borderColor: color,
        }}
        className={`relative flex items-center justify-center min-w-[110px] max-w-[280px] px-5 py-2 text-center transition-all duration-150 select-none ${
          nodeData.shape === "rectangle"
            ? "rounded-xl"
            : nodeData.shape === "note"
            ? "rounded-md bg-[#252516] border"
            : "rounded-2xl"
        } ${
          selected
            ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#07110c] shadow-lg shadow-emerald-950/50"
            : "shadow-sm"
        } bg-[#07110c] border-[1.5px]`}
      >
        {/* Selection anchor points (Print 03 corner green handles) */}
        {selected && (
          <>
            <span className="absolute -top-1 -left-1 h-2 w-2 rounded-xs bg-[#22c55e] border border-white" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-xs bg-[#22c55e] border border-white" />
            <span className="absolute -bottom-1 -left-1 h-2 w-2 rounded-xs bg-[#22c55e] border border-white" />
            <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-xs bg-[#22c55e] border border-white" />
          </>
        )}

        {/* Content / Editor */}
        <div className="flex items-center gap-1.5 min-w-0">
          {nodeData.emoji && <span className="text-sm shrink-0">{nodeData.emoji}</span>}
          {isEditing ? (
            <input
              ref={inputRef}
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-center font-medium text-sm text-white outline-none"
            />
          ) : (
            <span
              className={`block truncate text-sm font-medium text-white ${
                nodeData.bold ? "font-bold" : ""
              } ${nodeData.italic ? "italic" : ""} ${
                nodeData.strikethrough ? "line-through text-white/70" : ""
              }`}
            >
              {nodeData.label || "Novo ponto"}
            </span>
          )}
        </div>
      </div>

      {/* Floating Action Menu below selected node (Print 03) */}
      {selected && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-0.5 rounded-full border border-white/15 bg-[#0a1811]/95 px-2 py-1 shadow-2xl backdrop-blur-md"
        >
          {/* Color Dot Button */}
          <button
            type="button"
            title="Alterar cor"
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowEmojiPicker(false);
              setShowMoreMenu(false);
            }}
            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/10"
          >
            <span
              className="h-3.5 w-3.5 rounded-full border border-white/40 shadow-sm"
              style={{ backgroundColor: color }}
            />
          </button>

          {/* Add Child Branch Button */}
          <button
            type="button"
            title="Novo ponto filho (Tab)"
            onClick={() => nodeData.onAddChild?.(id)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
          >
            <GitBranch className="h-3.5 w-3.5" />
          </button>

          {/* Edit text */}
          <button
            type="button"
            title="Editar texto"
            onClick={() => setIsEditing(true)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
          >
            <Type className="h-3.5 w-3.5" />
          </button>

          {/* Bold */}
          <button
            type="button"
            title="Negrito"
            onClick={() => nodeData.onToggleFormat?.(id, "bold")}
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition ${
              nodeData.bold
                ? "bg-emerald-500/30 text-emerald-300"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Bold className="h-3 w-3" />
          </button>

          {/* Italic */}
          <button
            type="button"
            title="Itálico"
            onClick={() => nodeData.onToggleFormat?.(id, "italic")}
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs italic transition ${
              nodeData.italic
                ? "bg-emerald-500/30 text-emerald-300"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Italic className="h-3 w-3" />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            title="Tachado"
            onClick={() => nodeData.onToggleFormat?.(id, "strikethrough")}
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition ${
              nodeData.strikethrough
                ? "bg-emerald-500/30 text-emerald-300"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Strikethrough className="h-3 w-3" />
          </button>

          {/* Emoji */}
          <button
            type="button"
            title="Ícone / Emoji"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              setShowColorPicker(false);
              setShowMoreMenu(false);
            }}
            className="flex h-6 w-6 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
          >
            <Smile className="h-3.5 w-3.5" />
          </button>

          {/* Plus (quick add child) */}
          <button
            type="button"
            title="Adicionar ramo rápido"
            onClick={() => nodeData.onAddChild?.(id)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-emerald-400 hover:bg-emerald-500/20"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>

          {/* More options (...) */}
          <button
            type="button"
            title="Mais opções"
            onClick={() => {
              setShowMoreMenu(!showMoreMenu);
              setShowColorPicker(false);
              setShowEmojiPicker(false);
            }}
            className="flex h-6 w-6 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Color Picker Dropdown */}
      {selected && showColorPicker && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 rounded-xl border border-white/15 bg-[#0a1811] p-2 shadow-2xl backdrop-blur-md"
        >
          {COLOR_PALETTE.map((c) => (
            <button
              key={c.value}
              type="button"
              title={c.label}
              onClick={() => {
                nodeData.onChangeColor?.(id, c.value);
                setShowColorPicker(false);
              }}
              className="h-5 w-5 rounded-full border border-white/30 hover:scale-125 transition-transform"
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      )}

      {/* Emoji Picker Dropdown */}
      {selected && showEmojiPicker && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 rounded-xl border border-white/15 bg-[#0a1811] p-2 shadow-2xl backdrop-blur-md"
        >
          <button
            type="button"
            title="Remover emoji"
            onClick={() => {
              nodeData.onSetEmoji?.(id, "");
              setShowEmojiPicker(false);
            }}
            className="px-1 text-xs text-muted-foreground hover:text-white"
          >
            Nenhum
          </button>
          {EMOJIS.map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => {
                nodeData.onSetEmoji?.(id, em);
                setShowEmojiPicker(false);
              }}
              className="h-6 w-6 rounded hover:bg-white/10 text-sm flex items-center justify-center"
            >
              {em}
            </button>
          ))}
        </div>
      )}

      {/* Context Menu Dropdown (Print 03) */}
      {selected && showMoreMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-full mt-14 left-1/2 -translate-x-1/2 z-40 w-52 rounded-xl border border-white/15 bg-[#0a1811] py-1.5 shadow-2xl backdrop-blur-md text-xs text-white"
        >
          <button
            type="button"
            onClick={() => {
              nodeData.onAddChild?.(id);
              setShowMoreMenu(false);
            }}
            className="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10 text-left"
          >
            <span>Novo ponto filho</span>
            <kbd className="rounded border border-white/20 px-1 text-[10px] text-muted-foreground">Tab</kbd>
          </button>

          <button
            type="button"
            onClick={() => {
              nodeData.onAddSibling?.(id);
              setShowMoreMenu(false);
            }}
            className="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10 text-left"
          >
            <span>Novo ponto irmão</span>
            <kbd className="rounded border border-white/20 px-1 text-[10px] text-muted-foreground">Enter</kbd>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              setShowMoreMenu(false);
            }}
            className="flex w-full items-center px-3 py-1.5 hover:bg-white/10 text-left"
          >
            <span>Editar texto</span>
          </button>

          <div className="my-1 border-t border-white/10" />

          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(nodeData.label || "");
              setShowMoreMenu(false);
            }}
            className="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10 text-left"
          >
            <span>Copiar texto</span>
            <kbd className="rounded border border-white/20 px-1 text-[10px] text-muted-foreground">Ctrl C</kbd>
          </button>

          <div className="my-1 border-t border-white/10" />

          <button
            type="button"
            onClick={() => {
              nodeData.onDeleteNode?.(id);
              setShowMoreMenu(false);
            }}
            className="flex w-full items-center justify-between px-3 py-1.5 text-red-400 hover:bg-red-500/20 text-left"
          >
            <span>Excluir ramo</span>
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
});
