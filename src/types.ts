/** 短く読む / ちゃんと読む の閲覧モード */
export type ViewMode = "quick" | "deep";

/** 作品を読む3つの視点 */
export type LensKey = "thought" | "tech" | "recruiter";

export const LENS_LABELS: Record<LensKey, string> = {
  thought: "考えたこと",
  tech: "作ったところ",
  recruiter: "仕事につなげるなら",
};

/** カード・詳細のビジュアルシステム識別子(画像未配置でも成立させるための描画キー) */
export type WorkVisual =
  | "voxel-row"
  | "voxel"
  | "illusion"
  | "moodorgan"
  | "vr"
  | "unity"
  | "cg"
  | "site";

export interface WorkDetailContent {
  overview: string;
  problem: string;
  reframing: string;
  concept: string;
  process: string[];
  implementation: string;
  outcome: string;
  next: string;
}

export interface Work {
  id: string;
  title: string;
  titleEn?: string;
  category: string;
  keywords: string[];
  /** 一言で言うと何か */
  oneLiner: string;
  summary: string;
  /** 気になっていたこと */
  problem: string;
  /** 再定義した問い */
  reframing: string;
  /** 制作プロセス(カード用の短い記述) */
  processShort: string;
  /** 使用技術・素材・ツール */
  tools: string[];
  /** この作品から見える作り方 */
  abilities: string[];
  /** 仕事や面談で見てほしいところ */
  recruiterSummary: string;
  /** この作品から伝わること */
  proof: string[];
  detail: WorkDetailContent;
  /** 視点切替ごとの読み解き */
  lenses: Record<LensKey, string>;
  visual: WorkVisual;
  /** メイン画像(public/assets 配下)。null または読み込み失敗時はSVGビジュアルで成立する */
  image: string | null;
  /** 画像の代替テキスト */
  imageAlt?: string;
  /** 詳細モーダル用の画像(未指定なら image を使う) */
  imageDetail?: string;
  /** 詳細モーダルに表示する追加ギャラリー画像 */
  gallery?: { src: string; alt: string }[];
  /** 面談で聞かれる前に答える基本情報。未入力の項目は表示されない */
  meta?: {
    /** 担当・役割(例: 企画・設計・実装(個人制作)) */
    role?: string;
    /** 制作時期・期間(例: 2025年 / 約3ヶ月) */
    period?: string;
    /** 形態(例: 大学授業課題 / 自主制作 / 展示出品) */
    format?: string;
  };
  /** 一覧の先頭で大きく見せる代表作 */
  featured?: boolean;
}

export type SkillLevel =
  | "can-design-with"
  | "can-prototype"
  | "can-use"
  | "can-explain"
  | "learning";

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  "can-design-with": "よく使う",
  "can-prototype": "手を動かせる",
  "can-use": "必要なら使う",
  "can-explain": "話せる",
  learning: "触っている",
};

export interface Skill {
  name: string;
  level: SkillLevel;
  /** クリックで飛べる関連作品のid */
  relatedWorkIds: string[];
}

export interface SkillCategory {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  skills: Skill[];
}

export interface ProcessStep {
  id: string;
  en: string;
  ja: string;
  description: string;
  /** 3x3グリッド上のセル配置。ボクセルグリフとして描画する */
  glyph: { x: number; y: number; tone: "black" | "gray" | "white" }[];
}
