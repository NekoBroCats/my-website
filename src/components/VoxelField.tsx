import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

/**
 * Hero背景のボクセルフィールド。
 * 白黒のアイソメトリック立方体グリッドが、カーソルに近づくほどグレーへ変化し浮き上がる。
 * - reduced-motion: 静的描画のみ
 * - モバイル: 密度を落とし、ポインタ追従を無効化
 * - Heroが画面外のときはrAFを停止
 */
export function VoxelField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const interactive = !reduced && !isMobile;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // グリッド設定
    const cell = isMobile ? 34 : 44; // 菱形の幅
    const cubeH = cell * 0.5; // 菱形の高さ
    const depth = cell * 0.32; // 側面の高さ

    interface Cube {
      i: number;
      j: number;
      x: number;
      y: number;
      base: number; // 0 = 白, 1 = 黒
      scale: number; // 個体差(余白を作る)
      lift: number; // 現在の浮き上がり量
      mix: number; // 現在のグレー混合率
    }

    let cubes: Cube[] = [];
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
          if (r < 0.62) continue;
          const r2 = rand(j * 31 + 7, i * 17 + 3);
          const base = r2 > 0.86 ? 1 : 0;
          const scale = 0.62 + r2 * 0.28;
          cubes.push({ i, j, x, y, base, scale, lift: 0, mix: 0 });
        }
      }
      staticDrawn = false;
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
      for (const c of cubes) {
        let targetMix = 0;
        let targetLift = 0;
        if (interactive) {
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
        drawCube(c);
      }
    }

    function loop() {
      drawFrame();
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      running = true;
      if (interactive) {
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

    layout();

    const resizeObserver = new ResizeObserver(() => {
      layout();
      if (!interactive) drawFrame();
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

    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      canvas.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      stop();
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
