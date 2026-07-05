import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { haptic } from "../lib/haptics";

export type Gravity = null | 0 | 1 | 2 | 3; // null=初期散布, 0=下 1=左 2=上 3=右

interface VoxelFieldProps {
  /** 現在の重力方向が変わるたびに呼ばれる(ラベル表示用) */
  onGravityChange?: (dir: Gravity) => void;
  /** 外部(HomePageのボタン等)からも重力を回せるようにするための参照 */
  rotateRef?: React.MutableRefObject<(() => void) | null>;
}

/**
 * Hero/Home背景のボクセルフィールド。
 * 白黒のアイソメトリック立方体グリッドが、カーソルに近づくほどグレーへ変化し浮き上がる。
 * クリック/タップで重力方向が90°回転し、全ボクセルがその方向の縁に「積もる」。
 * - reduced-motion: アニメーションせず目標位置へ即時ジャンプ(機能自体は維持)
 * - モバイル: 密度を落とし、ポインタ追従グレー化は無効化(タップでの重力回転は有効)
 * - Heroが画面外のときはrAFを停止
 */
export function VoxelField({ onGravityChange, rotateRef }: VoxelFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    // ポインタ追従によるグレー化・浮き上がりはマウス環境のみ。重力回転は全デバイスで有効。
    const pointerReactive = !reduced && !isMobile;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // グリッド設定(立方体の正比率: 側面高さ = cell * 0.5)
    const cell = isMobile ? 34 : 44; // 菱形の幅
    const cubeH = cell * 0.5; // 菱形の高さ
    const depth = cell * 0.5; // 側面の高さ(立方体化)

    interface Cube {
      i: number;
      j: number;
      x: number;
      y: number;
      tx: number;
      ty: number;
      base: number; // 0 = 白, 1 = 黒
      scale: number; // 個体差(余白を作る)
      lift: number; // 現在の浮き上がり量
      mix: number; // 現在のグレー混合率
    }

    let cubes: Cube[] = [];
    let gravity: Gravity = null;
    const pointer = { x: -9999, y: -9999 };
    let raf = 0;
    let running = false;
    let staticDrawn = false;

    // 決定的な擬似乱数(リロードで印象が変わりすぎないように)
    const rand = (i: number, j: number) => {
      const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
      return v - Math.floor(v);
    };

    function layout() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cubes = [];
      const cols = Math.ceil(width / cell) + 4;
      const rows = Math.ceil(height / (cubeH / 2)) + 6;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * cell + ((j % 2) * cell) / 2;
          const y = (j * cubeH) / 2;
          const r = rand(i, j);
          // 余白を主役にする: 半分以上のセルは空にし、置く場合も大部分は白
          // モバイルは積み上げ時に画面を埋め尽くさないよう密度をさらに下げる(約20%だけ配置)
          const skipThreshold = isMobile ? 0.8 : 0.62;
          if (r < skipThreshold) continue;
          const r2 = rand(j * 31 + 7, i * 17 + 3);
          const base = r2 > 0.86 ? 1 : 0;
          const scale = 0.62 + r2 * 0.28;
          cubes.push({ i, j, x, y, tx: x, ty: y, base, scale, lift: 0, mix: 0 });
        }
      }
      // 重力状態を維持したまま再レイアウトする場合は目標位置を再計算
      if (gravity !== null) applyGravity(gravity, true);
      staticDrawn = false;
    }

    /** 現在の重力方向に従って各cubeの目標位置(tx,ty)を再計算する */
    function applyGravity(dir: Gravity, silent = false) {
      gravity = dir;
      if (dir === null) {
        return;
      }
      if (dir === 0 || dir === 2) {
        // 下 or 上: 横方向に列を作り、下(または上)から積み上げる
        const cols = Math.max(1, Math.floor(width / cell));
        const sorted = [...cubes].sort((a, b) => a.x - b.x);
        sorted.forEach((c, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const tx = col * cell + cell / 2 + (row % 2) * (cell / 2);
          const ty =
            dir === 0
              ? height - row * (cell * 0.42) - cell * 0.4
              : row * (cell * 0.42) + cell * 0.4;
          c.tx = tx;
          c.ty = ty;
        });
      } else {
        // 左 or 右: 縦方向に行を作り、左(または右)から積み上げる
        const rows = Math.max(1, Math.floor(height / (cell * 0.5)));
        const sorted = [...cubes].sort((a, b) => a.y - b.y);
        sorted.forEach((c, i) => {
          const row = i % rows;
          const col = Math.floor(i / rows);
          const ty = row * (cell * 0.5) + cell / 4 + (col % 2) * (cell / 4);
          const tx =
            dir === 1
              ? col * (cell * 0.42) + cell * 0.4
              : width - col * (cell * 0.42) - cell * 0.4;
          c.tx = tx;
          c.ty = ty;
        });
      }
      if (!silent) onGravityChange?.(dir);
    }

    /** 重力方向を (null→0→1→2→3→0…) と進める */
    function rotateGravity() {
      const next: Gravity = gravity === null ? 0 : (((gravity + 1) % 4) as Gravity);
      haptic([12, 40, 8]);
      applyGravity(next);
      if (reduced) {
        // reduced-motion時はアニメーションせず目標位置へ即時ジャンプ
        for (const c of cubes) {
          c.x = c.tx;
          c.y = c.ty;
        }
        drawFrame();
      }
    }

    function shade(hex: number, mixGray: number, factor: number): string {
      // base 0(白)/1(黒) と グレー混合率から面の色を作る
      const white = 250;
      const black = 22;
      const gray = 140;
      let v = hex === 0 ? white : black;
      v = v + (gray - v) * mixGray;
      v = Math.round(v * factor);
      return `rgb(${v},${v},${v})`;
    }

    function drawCube(c: Cube) {
      const x = c.x;
      const y = c.y - c.lift;
      // カーソルが近づくとわずかに大きくなり、存在感が変わる
      const s = c.scale * (1 + c.mix * 0.12);
      const hw = (cell / 2) * s;
      const hh = (cubeH / 2) * s;
      const d = depth * s;

      // top
      ctx!.beginPath();
      ctx!.moveTo(x, y - hh);
      ctx!.lineTo(x + hw, y);
      ctx!.lineTo(x, y + hh);
      ctx!.lineTo(x - hw, y);
      ctx!.closePath();
      ctx!.fillStyle = shade(c.base, c.mix, 1);
      ctx!.fill();
      ctx!.strokeStyle = "rgba(17,17,19,0.16)";
      ctx!.lineWidth = 1;
      ctx!.stroke();

      // left face
      ctx!.beginPath();
      ctx!.moveTo(x - hw, y);
      ctx!.lineTo(x, y + hh);
      ctx!.lineTo(x, y + hh + d);
      ctx!.lineTo(x - hw, y + d);
      ctx!.closePath();
      ctx!.fillStyle = shade(c.base, c.mix, 0.86);
      ctx!.fill();
      ctx!.stroke();

      // right face
      ctx!.beginPath();
      ctx!.moveTo(x + hw, y);
      ctx!.lineTo(x, y + hh);
      ctx!.lineTo(x, y + hh + d);
      ctx!.lineTo(x + hw, y + d);
      ctx!.closePath();
      ctx!.fillStyle = shade(c.base, c.mix, 0.72);
      ctx!.fill();
      ctx!.stroke();
    }

    function drawFrame() {
      ctx!.clearRect(0, 0, width, height);
      const radius = 220;
      // 下の段から上の段へ(y降順)描くことで、上に載る立方体の側面が下の上面に重なり、積み上がりとして知覚される
      const ordered = [...cubes].sort((a, b) => b.y - a.y);
      for (const c of ordered) {
        let targetMix = 0;
        let targetLift = 0;
        if (pointerReactive) {
          const dx = c.x - pointer.x;
          const dy = c.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < radius) {
            const t = 1 - dist / radius;
            targetMix = t;
            targetLift = t * 10;
          }
        }
        c.mix += (targetMix - c.mix) * 0.12;
        c.lift += (targetLift - c.lift) * 0.12;
        // 格子への再パッキング位置へ追従
        c.x += (c.tx - c.x) * 0.07;
        c.y += (c.ty - c.y) * 0.07;
        drawCube(c);
      }
    }

    function loop() {
      drawFrame();
      raf = requestAnimationFrame(loop);
    }

    // アニメーションが必要か(ポインタ反応 or 重力アニメーション中)
    const alwaysAnimate = !reduced;

    function start() {
      if (running) return;
      running = true;
      if (alwaysAnimate) {
        raf = requestAnimationFrame(loop);
      } else if (!staticDrawn) {
        drawFrame();
        staticDrawn = true;
      }
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    // canvas自体への直接クリックのみ重力を回転させる(前景コンテンツのクリックは奪わない)
    const onPointerDown = () => {
      rotateGravity();
    };

    layout();

    const resizeObserver = new ResizeObserver(() => {
      layout();
      if (!alwaysAnimate) drawFrame();
    });
    resizeObserver.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    if (pointerReactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      canvas.addEventListener("pointerleave", onPointerLeave);
    }
    canvas.addEventListener("pointerdown", onPointerDown);

    if (rotateRef) rotateRef.current = rotateGravity;

    return () => {
      stop();
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      if (rotateRef) rotateRef.current = null;
    };
  }, [reduced, onGravityChange, rotateRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full cursor-pointer"
    />
  );
}
