import type { ProcessStep } from "../types";

export const processSteps: ProcessStep[] = [
  {
    id: "observe",
    en: "Observe",
    ja: "観察する",
    description:
      "まず、なんか引っかかったところをそのまま置いておく。盤面を回したら急に読めなくなるとか、色が同じに見えないとか、そういう小さいズレから始まる。",
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
      "すぐに答えを出さずに、前提を一個だけ動かしてみる。重力の向き、見る距離、置く順番。大きなテーマより、その一個の変更のほうが大事なことが多い。",
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
      "紙でも、アクリルでも、Unityでも、とにかく一回外に出す。頭の中では成立していても、手で持った瞬間にだめなことが普通にある。",
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
      "人に渡して、変な使われ方をされるのを見る。説明した通りに遊ばれなかったところは、失敗というより、だいたい次に直す場所。",
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
      "見え方、触り方、置く間隔、文字の量を少しずつ直す。最後はかなり細かいです。1mmとか、1行とか、手を伸ばす角度とか。",
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
      "最後に、作ったものを人に渡せる言葉に戻す。ルールブック、キャプション、面談での説明。ここで急に整えすぎると嘘っぽくなるので、作っていたときの引っかかりも残す。",
    glyph: [
      { x: 0, y: 1, tone: "black" },
      { x: 1, y: 1, tone: "black" },
      { x: 2, y: 1, tone: "black" },
      { x: 2, y: 0, tone: "gray" },
      { x: 2, y: 2, tone: "gray" },
    ],
  },
];
