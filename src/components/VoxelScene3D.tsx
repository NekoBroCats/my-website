import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { haptic } from "../lib/haptics";
import { VoxelField } from "./VoxelField";

export type RollDir = "up" | "down" | "left" | "right";

interface VoxelScene3DProps {
  /** 転がし操作を外部(ボタン)から呼ぶための参照 */
  rollRef?: React.MutableRefObject<((dir: RollDir) => void) | null>;
}

// up = -z, down = +z, left = -x, right = +x (盤面をXZ平面として扱う)
const DIR_VECTORS: Record<RollDir, { dx: number; dz: number }> = {
  up: { dx: 0, dz: -1 },
  down: { dx: 0, dz: 1 },
  left: { dx: -1, dz: 0 },
  right: { dx: 1, dz: 0 },
};

const WORLD_UP = new THREE.Vector3(0, 1, 0);

// 決定的な擬似乱数(VoxelField.tsxのrand()と同じ手法)
function rand(i: number, j: number): number {
  const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

interface CubeData {
  id: number;
  i: number; // 初期列
  j: number; // 初期行
  base: 0 | 1; // 0=白 1=黒
}

interface CubeAnimState {
  // 現在の論理グリッド位置(アニメーション完了後の整数値)
  gx: number;
  gz: number;
  // 現在描画中の位置・回転
  pos: THREE.Vector3;
  quat: THREE.Quaternion;
  // 進行中のステップ列(各要素は1マス分の移動)
  steps: { fromX: number; fromZ: number; toX: number; toZ: number }[];
  stepIndex: number;
  stepT: number; // 0..1 現在ステップの進捗
  delay: number; // 開始遅延(秒)
  mixColor: number; // グレー混合率(カーソル近接)
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/** axis周りにvをangle回転させたベクトルを返す */
function rotateAroundAxis(v: THREE.Vector3, axis: THREE.Vector3, angle: number): THREE.Vector3 {
  return v.clone().applyAxisAngle(axis, angle);
}

function buildGrid(isMobile: boolean): { cols: number; rows: number; cubes: CubeData[] } {
  const cols = isMobile ? 11 : 20;
  const rows = isMobile ? 16 : 13;
  const density = isMobile ? 0.24 : 0.42;
  const cubes: CubeData[] = [];
  let id = 0;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const r = rand(i, j);
      if (r >= density) continue;
      const r2 = rand(j * 31 + 7, i * 17 + 3);
      const base: 0 | 1 = r2 > 0.82 ? 1 : 0;
      cubes.push({ id: id++, i, j, base });
    }
  }
  return { cols, rows, cubes };
}

/**
 * 占有グリッドに基づき、各cubeの目標位置までの「1マスずつのステップ列」を解決する。
 * 目標端に近い順から処理することで、他のcubeを通り抜けない。
 */
function resolveRoll(
  cubes: CubeData[],
  positions: Map<number, { gx: number; gz: number }>,
  dir: RollDir,
  cols: number,
  rows: number,
): Map<number, { fromX: number; fromZ: number; toX: number; toZ: number }[]> {
  const { dx, dz } = DIR_VECTORS[dir];
  const occupied = new Set<string>();
  for (const c of cubes) {
    const p = positions.get(c.id)!;
    occupied.add(`${p.gx},${p.gz}`);
  }

  // 目標端(移動方向側)に近い順に処理: dxやdzが正なら座標降順、負なら昇順
  const order = [...cubes].sort((a, b) => {
    const pa = positions.get(a.id)!;
    const pb = positions.get(b.id)!;
    const da = dx !== 0 ? pa.gx : pa.gz;
    const db = dx !== 0 ? pb.gx : pb.gz;
    return dx > 0 || dz > 0 ? db - da : da - db;
  });

  const stepsMap = new Map<number, { fromX: number; fromZ: number; toX: number; toZ: number }[]>();

  for (const c of order) {
    const p = positions.get(c.id)!;
    let gx = p.gx;
    let gz = p.gz;
    const steps: { fromX: number; fromZ: number; toX: number; toZ: number }[] = [];
    occupied.delete(`${gx},${gz}`);
    while (true) {
      const nx = gx + dx;
      const nz = gz + dz;
      if (nx < 0 || nx >= cols || nz < 0 || nz >= rows) break;
      const key = `${nx},${nz}`;
      if (occupied.has(key)) break;
      steps.push({ fromX: gx, fromZ: gz, toX: nx, toZ: nz });
      gx = nx;
      gz = nz;
    }
    occupied.add(`${gx},${gz}`);
    positions.set(c.id, { gx, gz });
    stepsMap.set(c.id, steps);
  }

  return stepsMap;
}

const CUBE_COLOR_WHITE = new THREE.Color("#eeeeea");
const CUBE_COLOR_BLACK = new THREE.Color("#1a1a1e");
const CUBE_COLOR_GRAY = new THREE.Color("#8d8d8a");

interface SceneProps {
  cubes: CubeData[];
  cols: number;
  rows: number;
  reduced: boolean;
  isMobile: boolean;
  rollRequestRef: React.MutableRefObject<RollDir | null>;
}

function Scene({ cubes, cols, rows, reduced, isMobile, rollRequestRef }: SceneProps) {
  const { size, camera } = useThree();
  const groundRef = useRef<THREE.Mesh>(null);
  const pointerWorld = useRef<THREE.Vector3 | null>(null);

  // 各cubeの現在論理位置(整数グリッド座標)
  const positionsRef = useRef<Map<number, { gx: number; gz: number }>>(
    new Map(cubes.map((c) => [c.id, { gx: c.i, gz: c.j }])),
  );

  const meshRefs = useRef<Map<number, THREE.Mesh>>(new Map());
  const animStates = useRef<Map<number, CubeAnimState>>(
    new Map(
      cubes.map((c) => [
        c.id,
        {
          gx: c.i,
          gz: c.j,
          pos: new THREE.Vector3(c.i, 0.5, c.j),
          quat: new THREE.Quaternion(),
          steps: [],
          stepIndex: 0,
          stepT: 0,
          delay: 0,
          mixColor: 0,
        },
      ]),
    ),
  );

  const isAnimatingRef = useRef(false);

  // 稜線(細いインクの罫線)用の共有ジオメトリ/マテリアル。
  // 密に積まれても白キューブ同士の境界が消えないようにする(2D版の罫線美学の継承)
  const edgesGeometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
    [],
  );
  const edgesMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#111113",
        transparent: true,
        opacity: 0.3,
      }),
    [],
  );
  useEffect(() => {
    return () => {
      edgesGeometry.dispose();
      edgesMaterial.dispose();
    };
  }, [edgesGeometry, edgesMaterial]);

  // 中心を基準にグリッドをセンタリングするオフセット
  const offsetX = (cols - 1) / 2;
  const offsetZ = (rows - 1) / 2;

  // フィールドの角をビュー空間へ投影し、縦横どちらも収まるようにカメラの視錐を調整
  useEffect(() => {
    const cam = camera as THREE.OrthographicCamera;
    cam.position.set(10, 12, 10);
    cam.lookAt(0, 0, 0);
    cam.updateMatrixWorld(true);
    const toView = cam.matrixWorld.clone().invert();
    const hx = cols / 2 + 0.5;
    const hz = rows / 2 + 0.5;
    let maxX = 0;
    let maxY = 0;
    // y=1.5はタンブル中の頂点高さ(√2/2 + 0.5√2 ≈ 1.41)を覆う
    for (const cx of [-hx, hx])
      for (const cy of [0, 1.5])
        for (const cz of [-hz, hz]) {
          const p = new THREE.Vector3(cx, cy, cz).applyMatrix4(toView);
          maxX = Math.max(maxX, Math.abs(p.x));
          maxY = Math.max(maxY, Math.abs(p.y));
        }
    const aspect = size.width / size.height;
    const halfH = Math.max(maxY, maxX / aspect) * 1.06;
    cam.top = halfH;
    cam.bottom = -halfH;
    cam.left = -halfH * aspect;
    cam.right = halfH * aspect;
    cam.updateProjectionMatrix();
  }, [camera, size, cols, rows]);

  const performRollInternal = useCallback(
    (dir: RollDir) => {
      const positions = positionsRef.current;

      if (isAnimatingRef.current && !reduced) {
        // 割り込み: 進行中の各cubeを「現在ステップ完了時点」の位置に確定させてから新規計算
        for (const [id, anim] of animStates.current) {
          if (anim.stepIndex < anim.steps.length) {
            const step = anim.steps[anim.stepIndex];
            // まだ動き出していない(ディレイ待ちで進捗0)なら現セルに留める
            const notStarted = anim.stepIndex === 0 && anim.stepT === 0 && anim.delay > 0;
            const sx = notStarted ? step.fromX : step.toX;
            const sz = notStarted ? step.fromZ : step.toZ;
            anim.gx = sx;
            anim.gz = sz;
            positions.set(id, { gx: sx, gz: sz });
          }
          anim.pos.set(anim.gx - offsetX, 0.5, anim.gz - offsetZ);
          anim.quat.identity();
          anim.steps = [];
          anim.stepIndex = 0;
          anim.stepT = 0;
        }
      }

      const stepsMap = resolveRoll(cubes, positions, dir, cols, rows);

      // 処理順(目標端に近い順)に基づいてstaggerを割り当てる
      const { dx, dz } = DIR_VECTORS[dir];
      const order = [...cubes].sort((a, b) => {
        const pa = animStates.current.get(a.id)!;
        const pb = animStates.current.get(b.id)!;
        const da = dx !== 0 ? pa.gx : pa.gz;
        const db = dx !== 0 ? pb.gx : pb.gz;
        return dx > 0 || dz > 0 ? db - da : da - db;
      });

      order.forEach((c, idx) => {
        const anim = animStates.current.get(c.id)!;
        const steps = stepsMap.get(c.id) ?? [];
        anim.steps = steps;
        anim.stepIndex = 0;
        anim.stepT = 0;
        anim.delay = order.length > 1 ? (idx / (order.length - 1)) * 0.2 : 0;

        if (steps.length > 0) {
          const last = steps[steps.length - 1];
          anim.gx = last.toX;
          anim.gz = last.toZ;
        }

        if (reduced) {
          // reduced-motion: 目標位置へ即時ジャンプ
          anim.pos.set(anim.gx - offsetX, 0.5, anim.gz - offsetZ);
          anim.quat.identity();
          anim.steps = [];
          anim.stepIndex = 0;
        }
      });

      isAnimatingRef.current = !reduced && order.some((c) => (stepsMap.get(c.id)?.length ?? 0) > 0);
    },
    [cubes, cols, rows, reduced, offsetX, offsetZ],
  );

  useEffect(() => {
    rollRequestRef.current = null;
  }, [rollRequestRef]);

  // ホバー解除後もグレーが減衰しきるまでは更新を続けるためのフラグ
  const colorsActiveRef = useRef(false);

  useFrame((_, delta) => {
    // 転がしリクエストのチェック
    let rolledNow = false;
    if (rollRequestRef.current) {
      const dir = rollRequestRef.current;
      rollRequestRef.current = null;
      performRollInternal(dir);
      rolledNow = true;
    }

    // カーソル近接によるグレー化(デスクトップ・reduced-motionでない場合のみ)
    const pointerActive = !isMobile && !reduced && pointerWorld.current;

    // 完全静止・ホバー無し・色も初期状態ならフレームの仕事をスキップ(負荷抑制)
    // (rolledNow: reduced-motion時の即時反映もメッシュへ反映する必要がある)
    if (!rolledNow && !isAnimatingRef.current && !pointerActive && !colorsActiveRef.current) return;

    let anyAnimating = false;
    let maxMix = 0;

    for (const c of cubes) {
      const anim = animStates.current.get(c.id)!;
      const mesh = meshRefs.current.get(c.id);
      if (!mesh) continue;

      if (anim.steps.length > 0 && anim.stepIndex < anim.steps.length) {
        anyAnimating = true;
        if (anim.delay > 0) {
          anim.delay -= delta;
        } else {
          anim.stepT += delta / 0.16;
          const step = anim.steps[anim.stepIndex];
          const { dx, dz } = DIR_VECTORS[dir_from_step(step)];
          const dirVec = new THREE.Vector3(dx, 0, dz);
          const axis = new THREE.Vector3().crossVectors(WORLD_UP, dirVec).normalize();

          const startPos = new THREE.Vector3(
            step.fromX - offsetX,
            0.5,
            step.fromZ - offsetZ,
          );
          const pivot = new THREE.Vector3(
            step.fromX - offsetX + dx * 0.5,
            0,
            step.fromZ - offsetZ + dz * 0.5,
          );

          const t = Math.min(anim.stepT, 1);
          const eased = easeInOutQuad(t);
          const angle = eased * (Math.PI / 2);

          // axis = up×dir に対して +angle が「前方へ倒れ込む」正しい向き(頂点を通る弧を描く)
          const rotated = rotateAroundAxis(startPos.clone().sub(pivot), axis, angle);
          anim.pos.copy(pivot).add(rotated);

          const stepQuat = new THREE.Quaternion().setFromAxisAngle(axis, angle);
          anim.quat.copy(stepQuat);

          if (anim.stepT >= 1) {
            // ステップ完了: 整数グリッドへスナップし回転をリセット(誤差蓄積防止)
            anim.pos.set(step.toX - offsetX, 0.5, step.toZ - offsetZ);
            anim.quat.identity();
            anim.stepIndex += 1;
            anim.stepT = 0;
          }
        }
      }

      // カーソル近接グレー化のターゲット計算
      let targetMix = 0;
      if (pointerActive) {
        const dxp = anim.pos.x - pointerWorld.current!.x;
        const dzp = anim.pos.z - pointerWorld.current!.z;
        const dist = Math.hypot(dxp, dzp);
        const radius = 2.5;
        if (dist < radius) {
          targetMix = 1 - dist / radius;
        }
      }
      anim.mixColor += (targetMix - anim.mixColor) * 0.15;
      if (anim.mixColor < 0.001) anim.mixColor = 0;
      maxMix = Math.max(maxMix, anim.mixColor);

      mesh.position.copy(anim.pos);
      mesh.quaternion.copy(anim.quat);

      const mat = mesh.material as THREE.MeshStandardMaterial;
      const base = c.base === 0 ? CUBE_COLOR_WHITE : CUBE_COLOR_BLACK;
      mat.color.copy(base).lerp(CUBE_COLOR_GRAY, anim.mixColor);
    }

    isAnimatingRef.current = anyAnimating;
    colorsActiveRef.current = maxMix > 0;
  });

  function dir_from_step(step: { fromX: number; fromZ: number; toX: number; toZ: number }): RollDir {
    const dx = step.toX - step.fromX;
    const dz = step.toZ - step.fromZ;
    if (dx === 1) return "right";
    if (dx === -1) return "left";
    if (dz === 1) return "down";
    return "up";
  }

  const handlePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (isMobile || reduced) return;
      pointerWorld.current = e.point.clone();
    },
    [isMobile, reduced],
  );

  const handlePointerLeave = useCallback(() => {
    pointerWorld.current = null;
  }, []);

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight
        position={[6, 12, 4]}
        intensity={0.7}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <mesh
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[Math.max(cols, rows) * 3, Math.max(cols, rows) * 3]} />
        <shadowMaterial opacity={0.12} transparent />
      </mesh>
      {cubes.map((c) => (
        <mesh
          key={c.id}
          ref={(m) => {
            if (m) meshRefs.current.set(c.id, m);
            else meshRefs.current.delete(c.id);
          }}
          position={[c.i - offsetX, 0.5, c.j - offsetZ]}
          castShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={c.base === 0 ? "#fafafa" : "#1a1a1e"}
            roughness={0.9}
            metalness={0}
          />
          {/* 稜線: メッシュの子なのでタンブル(位置・回転)に追従する */}
          <lineSegments geometry={edgesGeometry} material={edgesMaterial} />
        </mesh>
      ))}
    </>
  );
}

class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    // WebGL初期化失敗時などは2Dフォールバックへ委ねる(ログは既定のコンソールで十分)
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export default function VoxelScene3D({ rollRef }: VoxelScene3DProps) {
  const reduced = useReducedMotion();
  const [isMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches,
  );
  const { cols, rows, cubes } = useMemo(() => buildGrid(isMobile), [isMobile]);
  const rollRequestRef = useRef<RollDir | null>(null);

  const performRoll = useCallback((dir: RollDir) => {
    rollRequestRef.current = dir;
    haptic([12, 40, 8]);
  }, []);

  useEffect(() => {
    if (rollRef) rollRef.current = performRoll;
    return () => {
      if (rollRef) rollRef.current = null;
    };
  }, [rollRef, performRoll]);

  const handleClick = useCallback(() => {
    const dirs: RollDir[] = ["up", "down", "left", "right"];
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    performRoll(dir);
  }, [performRoll]);

  return (
    <CanvasErrorBoundary fallback={<VoxelField />}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        shadows
        orthographic
        camera={{ position: [10, 12, 10], zoom: 1, near: 0.1, far: 100 }}
        aria-hidden="true"
        className="cursor-pointer"
        onClick={handleClick}
      >
        <Scene
          cubes={cubes}
          cols={cols}
          rows={rows}
          reduced={reduced}
          isMobile={isMobile}
          rollRequestRef={rollRequestRef}
        />
      </Canvas>
    </CanvasErrorBoundary>
  );
}
