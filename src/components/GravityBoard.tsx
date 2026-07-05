import { useState } from "react";
import { haptic } from "../lib/haptics";

type Dir = 0 | 1 | 2 | 3; // 0:下 1:左 2:上 3:右

interface Piece {
  id: number;
  tone: "black" | "white" | "gray";
  x: number;
  y: number;
}

const SIZE = 4;

const initialPieces: Piece[] = [
  { id: 1, tone: "black", x: 0, y: 3 },
  { id: 2, tone: "white", x: 1, y: 3 },
  { id: 3, tone: "black", x: 1, y: 2 },
  { id: 4, tone: "white", x: 2, y: 3 },
  { id: 5, tone: "gray", x: 2, y: 2 },
  { id: 6, tone: "black", x: 3, y: 3 },
];

/** 重力方向に従って全駒を「落下」させる */
function applyGravity(pieces: Piece[], dir: Dir): Piece[] {
  const result = pieces.map((p) => ({ ...p }));
  const occupied = new Set<string>();
  const key = (x: number, y: number) => `${x},${y}`;

  // 落下方向の先にある駒から順に処理する
  const sorted = [...result].sort((a, b) => {
    switch (dir) {
      case 0: return b.y - a.y;
      case 2: return a.y - b.y;
      case 1: return a.x - b.x;
      case 3: return b.x - a.x;
    }
  });

  for (const p of sorted) {
    let { x, y } = p;
    const step = () => {
      switch (dir) {
        case 0: return { nx: x, ny: y + 1 };
        case 2: return { nx: x, ny: y - 1 };
        case 1: return { nx: x - 1, ny: y };
        case 3: return { nx: x + 1, ny: y };
      }
    };
    for (;;) {
      const { nx, ny } = step();
      if (nx < 0 || nx >= SIZE || ny < 0 || ny >= SIZE || occupied.has(key(nx, ny))) break;
      x = nx;
      y = ny;
    }
    occupied.add(key(x, y));
    p.x = x;
    p.y = y;
  }
  return result;
}

const dirLabels = ["↓ 下", "← 左", "↑ 上", "→ 右"] as const;

/**
 * VOXEL ROW / YONもくを象徴するミニ盤面。
 * ボタンで重力方向を回転させると、駒が新しい重力に従って再配置される。
 * 完全なゲームではなく「前提が変わると配置(=判断)が変わる」ことを伝える装置。
 */
export function GravityBoard() {
  const [dir, setDir] = useState<Dir>(0);
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);

  const rotate = () => {
    haptic([12, 40, 8]);
    const next = ((dir + 1) % 4) as Dir;
    setDir(next);
    setPieces((prev) => applyGravity(prev, next));
  };

  const cell = 100 / SIZE;

  return (
    <div className="caption-box">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="spec-label">Interactive — Gravity Board</p>
        <button
          type="button"
          onClick={rotate}
          className="btn btn-ghost px-3 py-1.5 text-xs"
          aria-label={`重力の向きを回転する(現在: ${dirLabels[dir]})`}
        >
          重力を回す {dirLabels[dir]}
        </button>
      </div>
      <div
        className="relative aspect-square w-full max-w-60 border border-(--line-strong)"
        role="img"
        aria-label="重力の向きによって駒の配置が変わる4×4の盤面デモ"
      >
        {/* グリッド線 */}
        {Array.from({ length: SIZE - 1 }, (_, i) => (
          <div key={`g${i}`} aria-hidden="true">
            <div
              className="absolute h-full border-l border-(--line)"
              style={{ left: `${cell * (i + 1)}%` }}
            />
            <div
              className="absolute w-full border-t border-(--line)"
              style={{ top: `${cell * (i + 1)}%` }}
            />
          </div>
        ))}
        {/* 駒 */}
        {pieces.map((p) => (
          <div
            key={p.id}
            className="gravity-piece absolute rounded-full border border-(--ink)"
            style={{
              width: `${cell * 0.62}%`,
              height: `${cell * 0.62}%`,
              left: `${cell * 0.19}%`,
              top: `${cell * 0.19}%`,
              transform: `translate(${p.x * 100 * (1 / 0.62)}%, ${p.y * 100 * (1 / 0.62)}%)`,
              background:
                p.tone === "black" ? "var(--ink)" : p.tone === "white" ? "var(--paper)" : "var(--gray-4)",
            }}
          />
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-(--gray-5)">
        盤面の前提(重力)が変わると、同じ駒でも配置が変わる。
        <br />
        VOXEL ROW / YONもくの中核にある考え方です。
      </p>
    </div>
  );
}
