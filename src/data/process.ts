import type { ProcessStep } from "../types";

export const processSteps: ProcessStep[] = [
  {
    id: "observe",
    en: "Observe",
    ja: "観察する",
    description:
      "まず、引っかかったところを置いておく。盤面を回したら読めない。色が同じに見えない。小さいズレから始まります。",
    glyph: [
      { x: 1, y: 1, tone: "black" },
      { x: 0, y: 0, tone: "white" },
      { x: 2, y: 0, tone: "white" },
      { x: 0, y: 2, tone: "white" },
      { x: 2, y: 2, tone: "white" },
    ],
  },
  {
    id: "reframe",
    en: "Reframe",
    ja: "問い直す",
    description:
      "すぐ答えを出さない。前提を一個だけ動かす。重力の向き。見る距離。置く順番。大きなテーマより、その一個を見る。",
    glyph: [
      { x: 0, y: 1, tone: "black" },
      { x: 1, y: 0, tone: "gray" },
      { x: 2, y: 1, tone: "black" },
      { x: 1, y: 2, tone: "gray" },
    ],
  },
  {
    id: "prototype",
    en: "Prototype",
    ja: "試作する",
    description:
      "紙でも、アクリルでも、Unityでも。一回外に出す。頭の中では成立していても、手で持つとだめなことがある。",
    glyph: [
      { x: 0, y: 2, tone: "black" },
      { x: 1, y: 2, tone: "black" },
      { x: 2, y: 2, tone: "gray" },
      { x: 0, y: 1, tone: "black" },
      { x: 0, y: 0, tone: "gray" },
    ],
  },
  {
    id: "test",
    en: "Test",
    ja: "試してもらう",
    description:
      "人に渡す。変な遊ばれ方を見る。説明通りに遊ばれなかったところは、次に直す場所。",
    glyph: [
      { x: 0, y: 0, tone: "black" },
      { x: 0, y: 1, tone: "black" },
      { x: 2, y: 1, tone: "white" },
      { x: 2, y: 2, tone: "white" },
      { x: 1, y: 1, tone: "gray" },
    ],
  },
  {
    id: "refine",
    en: "Refine",
    ja: "調整する",
    description:
      "見え方。触り方。置く間隔。文字の量。最後はかなり細かいです。1mmとか、1行とか、手を伸ばす角度とか。",
    glyph: [
      { x: 0, y: 1, tone: "black" },
      { x: 1, y: 1, tone: "gray" },
      { x: 2, y: 1, tone: "black" },
    ],
  },
  {
    id: "translate",
    en: "Translate",
    ja: "翻訳する",
    description:
      "最後に、言葉に戻す。ルールブック。キャプション。面談での説明。整えすぎると嘘っぽいので、引っかかりも少し残す。",
    glyph: [
      { x: 0, y: 1, tone: "black" },
      { x: 1, y: 1, tone: "black" },
      { x: 2, y: 1, tone: "black" },
      { x: 2, y: 0, tone: "gray" },
      { x: 2, y: 2, tone: "gray" },
    ],
  },
];
