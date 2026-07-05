/** Quick Scan(採用担当者向け) / Deep Dive(現場・面接官向け) の閲覧モード */
export type ViewMode = "quick" | "deep";

/** 作品を読む3つの視点 */
export type LensKey = "thought" | "tech" | "recruiter";

export const LENS_LABELS: Record<LensKey, string> = {
  thought: "思想",
  tech: "技術",
  recruiter: "採用視点",
};

/** カード・詳細のビジュアルシステム識別子(画像未配置でも成立させるための描画キー) */
export type WorkVisual =
  | "yonmoku"
  | "voxel"
  | "illusion"
  | "moodorgan"
  | "vr"
  | "unity"
  | "cg";

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
  /** 問題意識 */
  problem: string;
  /** 再定義した問い */
  reframing: string;
  /** 制作プロセス(カード用の短い記述) */
  processShort: string;
  /** 使用技術・素材・ツール */
  tools: string[];
  /** 見せたい能力 */
  abilities: string[];
  /** 採用担当者向けの要約(Recruiter Lens) */
  recruiterSummary: string;
  /** What this proves */
  proof: string[];
  detail: WorkDetailContent;
  /** 視点切替(思想/技術/採用)ごとの読み解き */
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
}

export type SkillLevel =
  | "can-design-with"
  | "can-prototype"
  | "can-use"
  | "can-explain"
  | "learning";

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  "can-design-with": "設計に使える",
  "can-prototype": "試作できる",
  "can-use": "使える",
  "can-explain": "説明できる",
  learning: "学習中",
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
