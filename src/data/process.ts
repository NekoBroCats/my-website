import type { ProcessStep } from "../types";

export const processSteps: ProcessStep[] = [
  {
    id: "observe",
    en: "Observe",
    ja: "観察する",
    description:
      "人間の認識、判断、違和感、社会の中の二項対立を観察する。制作はいつも「なにかがズレている」という気づきから始まる。",
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
      "観察したズレを「別の視点から見ると何が起きるか?」という問いに変換する。前提を一つ入れ替えるだけで、見える景色は変わる。",
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
      "問いをルール、形状、空間、UI、素材、動きとして試作する。頭の中の仮説を、他者が触れる形に出すのがこの段階。",
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
      "他者がどう反応するかを見る。想定通りに使われないことこそが、次の設計のための最も重要なデータになる。",
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
      "見え方、触り方、遊び方、伝わり方を調整する。体験の解像度は、この反復の回数で決まる。",
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
      "作品を、他者に伝わる言葉と体験へ変換する。キャプション、ルールブック、プレゼンテーション。伝わって初めて、作品は完成する。",
    glyph: [
      { x: 0, y: 1, tone: "black" },
      { x: 1, y: 1, tone: "black" },
      { x: 2, y: 1, tone: "black" },
      { x: 2, y: 0, tone: "gray" },
      { x: 2, y: 2, tone: "gray" },
    ],
  },
];
