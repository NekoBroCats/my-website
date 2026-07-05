import type { WorkVisual } from "../types";

/**
 * 画像未配置でも成立させるための、作品ごとのビジュアルシステム(SVG)。
 * 各作品のテーマをモノクロの図像として描く。実写画像が入ったら差し替え可能。
 */
export function WorkVisualArt({ visual }: { visual: WorkVisual }) {
  switch (visual) {
    case "yonmoku":
      return <YonmokuArt />;
    case "voxel":
      return <VoxelArt />;
    case "illusion":
      return <IllusionArt />;
    case "moodorgan":
      return <MoodorganArt />;
    case "vr":
      return <VrArt />;
    case "unity":
      return <UnityArt />;
    case "cg":
      return <CgArt />;
  }
}

const svgProps = {
  viewBox: "0 0 400 240",
  className: "h-full w-full",
  "aria-hidden": true,
  role: "presentation",
} as const;

/* YONもく: 回転する盤と重力を受ける駒 */
function YonmokuArt() {
  return (
    <svg {...svgProps}>
      <g transform="translate(200 130)">
        {/* 盤(菱形) */}
        <polygon points="0,-64 128,0 0,64 -128,0" fill="none" stroke="#111113" strokeWidth="1.5" />
        <polygon points="0,-40 80,0 0,40 -80,0" fill="none" stroke="#c9c9c6" strokeWidth="1" />
        {/* グリッド線 */}
        <line x1="-64" y1="-32" x2="64" y2="32" stroke="#c9c9c6" strokeWidth="1" />
        <line x1="64" y1="-32" x2="-64" y2="32" stroke="#c9c9c6" strokeWidth="1" />
        {/* 駒 */}
        <circle cx="-40" cy="-6" r="13" fill="#111113" />
        <circle cx="6" cy="-28" r="13" fill="#fdfdfc" stroke="#111113" strokeWidth="1.5" />
        <circle cx="44" cy="10" r="13" fill="#8d8d8a" />
        <circle cx="-4" cy="22" r="13" fill="#111113" />
        {/* 重力矢印 */}
        <g stroke="#111113" strokeWidth="1.5" fill="none">
          <path d="M 150 -70 A 90 90 0 0 1 178 -8" />
          <path d="M 172 -20 L 178 -8 L 185 -19" />
        </g>
      </g>
      <text x="24" y="220" fontSize="10" letterSpacing="3" fill="#8d8d8a" fontFamily="Inter, sans-serif">
        GRAVITY / ROTATION
      </text>
    </svg>
  );
}

/* VOXEL ROW: 透明ガイドの中のボクセル積層 */
function VoxelArt() {
  const cube = (x: number, y: number, tone: string, s = 26) => {
    const hw = s;
    const hh = s * 0.5;
    const d = s * 0.6;
    return (
      <g key={`${x}-${y}-${tone}`} transform={`translate(${x} ${y})`}>
        <polygon points={`0,${-hh} ${hw},0 0,${hh} ${-hw},0`} fill={tone} stroke="#111113" strokeWidth="1" />
        <polygon points={`${-hw},0 0,${hh} 0,${hh + d} ${-hw},${d}`} fill={tone} opacity="0.75" stroke="#111113" strokeWidth="1" />
        <polygon points={`${hw},0 0,${hh} 0,${hh + d} ${hw},${d}`} fill={tone} opacity="0.55" stroke="#111113" strokeWidth="1" />
      </g>
    );
  };
  return (
    <svg {...svgProps}>
      {/* アクリルガイド(透明の枠) */}
      <g stroke="#c9c9c6" strokeWidth="1" fill="none">
        <polygon points="200,28 320,88 200,148 80,88" />
        <line x1="80" y1="88" x2="80" y2="178" />
        <line x1="320" y1="88" x2="320" y2="178" />
        <line x1="200" y1="148" x2="200" y2="238" />
        <polyline points="80,178 200,238 320,178" />
      </g>
      {cube(174, 150, "#fdfdfc")}
      {cube(226, 150, "#111113")}
      {cube(200, 163, "#8d8d8a")}
      {cube(200, 124, "#fdfdfc")}
      <text x="24" y="220" fontSize="10" letterSpacing="3" fill="#8d8d8a" fontFamily="Inter, sans-serif">
        PHYSICAL VOXEL
      </text>
    </svg>
  );
}

/* 錯視トランプ: ストライプ越しの2つの円 */
function IllusionArt() {
  return (
    <svg {...svgProps}>
      <defs>
        <pattern id="stA" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="5" fill="#111113" />
        </pattern>
        <pattern id="stB" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect y="5" width="10" height="5" fill="#111113" />
        </pattern>
        <clipPath id="cardL">
          <rect x="70" y="40" width="110" height="160" rx="8" />
        </clipPath>
        <clipPath id="cardR">
          <rect x="220" y="40" width="110" height="160" rx="8" />
        </clipPath>
      </defs>
      <rect x="70" y="40" width="110" height="160" rx="8" fill="#fdfdfc" stroke="#111113" strokeWidth="1.5" />
      <rect x="220" y="40" width="110" height="160" rx="8" fill="#fdfdfc" stroke="#111113" strokeWidth="1.5" />
      <g clipPath="url(#cardL)">
        <circle cx="125" cy="120" r="34" fill="#8d8d8a" />
        <rect x="70" y="40" width="110" height="160" fill="url(#stA)" />
      </g>
      <g clipPath="url(#cardR)">
        <circle cx="275" cy="120" r="34" fill="#8d8d8a" />
        <rect x="220" y="40" width="110" height="160" fill="url(#stB)" />
      </g>
      <text x="24" y="220" fontSize="10" letterSpacing="3" fill="#8d8d8a" fontFamily="Inter, sans-serif">
        SAME GRAY?
      </text>
    </svg>
  );
}

/* MOODORGAN: 感情のダイヤルと広告的構図 */
function MoodorganArt() {
  return (
    <svg {...svgProps}>
      <rect x="130" y="30" width="140" height="180" rx="4" fill="#fdfdfc" stroke="#111113" strokeWidth="1.5" />
      {/* ダイヤル */}
      <circle cx="200" cy="96" r="38" fill="none" stroke="#111113" strokeWidth="1.5" />
      <line x1="200" y1="96" x2="224" y2="70" stroke="#111113" strokeWidth="2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 200 + Math.cos(rad) * 44;
        const y1 = 96 + Math.sin(rad) * 44;
        const x2 = 200 + Math.cos(rad) * 48;
        const y2 = 96 + Math.sin(rad) * 48;
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8d8d8a" strokeWidth="1.5" />;
      })}
      {/* スライダー */}
      <g stroke="#111113" strokeWidth="1">
        <line x1="152" y1="160" x2="248" y2="160" />
        <line x1="152" y1="178" x2="248" y2="178" />
      </g>
      <rect x="186" y="154" width="10" height="12" fill="#111113" />
      <rect x="222" y="172" width="10" height="12" fill="#8d8d8a" />
      <text x="24" y="220" fontSize="10" letterSpacing="3" fill="#8d8d8a" fontFamily="Inter, sans-serif">
        SET YOUR MOOD
      </text>
    </svg>
  );
}

/* VR: 一点透視の部屋と、UIとしての椅子 */
function VrArt() {
  return (
    <svg {...svgProps}>
      <g stroke="#111113" strokeWidth="1" fill="none">
        <rect x="140" y="70" width="120" height="90" />
        <line x1="40" y1="16" x2="140" y2="70" />
        <line x1="360" y1="16" x2="260" y2="70" />
        <line x1="40" y1="224" x2="140" y2="160" />
        <line x1="360" y1="224" x2="260" y2="160" />
      </g>
      <g stroke="#c9c9c6" strokeWidth="1">
        <line x1="90" y1="43" x2="90" y2="197" />
        <line x1="310" y1="43" x2="310" y2="197" />
        <line x1="90" y1="197" x2="310" y2="197" />
      </g>
      {/* 椅子 = インターフェース */}
      <g transform="translate(200 168)" stroke="#111113" strokeWidth="1.5" fill="#fdfdfc">
        <rect x="-16" y="-14" width="32" height="8" />
        <line x1="-14" y1="-6" x2="-14" y2="10" />
        <line x1="14" y1="-6" x2="14" y2="10" />
        <rect x="-16" y="-34" width="4" height="22" fill="#111113" stroke="none" />
      </g>
      <circle cx="200" cy="115" r="3" fill="#111113" />
      <text x="24" y="220" fontSize="10" letterSpacing="3" fill="#8d8d8a" fontFamily="Inter, sans-serif">
        SPACE AS INTERFACE
      </text>
    </svg>
  );
}

/* Unity: NavMeshの経路とノード */
function UnityArt() {
  return (
    <svg {...svgProps}>
      <g stroke="#c9c9c6" strokeWidth="1" fill="none">
        <polygon points="60,180 160,120 300,140 340,200 200,220" />
        <polygon points="160,120 210,60 320,80 300,140" />
      </g>
      <path
        d="M 80 178 L 150 130 L 230 132 L 250 100 L 305 90"
        fill="none"
        stroke="#111113"
        strokeWidth="1.5"
        strokeDasharray="5 5"
      />
      {[
        [80, 178],
        [150, 130],
        [230, 132],
        [250, 100],
        [305, 90],
      ].map(([x, y], idx) => (
        <circle key={idx} cx={x} cy={y} r={idx === 0 ? 6 : 3.5} fill={idx === 0 ? "#111113" : "#fdfdfc"} stroke="#111113" strokeWidth="1.5" />
      ))}
      <text x="24" y="220" fontSize="10" letterSpacing="3" fill="#8d8d8a" fontFamily="Inter, sans-serif">
        NAVMESH / RUNTIME
      </text>
    </svg>
  );
}

/* 3DCG: プロダクトの三面図的シルエット */
function CgArt() {
  return (
    <svg {...svgProps}>
      {/* 本体 */}
      <g transform="translate(200 120)">
        <rect x="-70" y="-44" width="140" height="88" rx="12" fill="#fdfdfc" stroke="#111113" strokeWidth="1.5" />
        <rect x="-52" y="-28" width="66" height="46" rx="4" fill="#111113" />
        <circle cx="42" cy="-6" r="14" fill="none" stroke="#111113" strokeWidth="1.5" />
        <circle cx="42" cy="-6" r="6" fill="#8d8d8a" />
        <rect x="26" y="22" width="32" height="6" rx="3" fill="#c9c9c6" />
        {/* 分割線 */}
        <line x1="-70" y1="10" x2="70" y2="10" stroke="#c9c9c6" strokeWidth="1" />
      </g>
      {/* 寸法線 */}
      <g stroke="#8d8d8a" strokeWidth="1">
        <line x1="130" y1="182" x2="270" y2="182" />
        <line x1="130" y1="176" x2="130" y2="188" />
        <line x1="270" y1="176" x2="270" y2="188" />
      </g>
      <text x="24" y="220" fontSize="10" letterSpacing="3" fill="#8d8d8a" fontFamily="Inter, sans-serif">
        PRODUCT STUDY
      </text>
    </svg>
  );
}
