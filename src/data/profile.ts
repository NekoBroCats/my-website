export const profile = {
  name: "山根瑛之輔",
  nameEn: "Yamane Akinosuke",
  title: "Perception Designer / Prototype Creator",
  titleJa: "認識をずらす、企画と試作",
  heroStatement: [
    "同じものを見ているのに、答えが変わる。",
    "そのズレを、遊び　展示　触れる試作品に。",
  ],
  email: "kurisutaruchirudoren@gmail.com",
  /** リンク先が確定していないものは href を null にしてプレースホルダー表示する */
  links: [
    { label: "GitHub", href: null as string | null, note: "準備中" },
    { label: "X (Twitter)", href: null as string | null, note: "準備中" },
  ],
  quickScan: {
    person: "見え方。ルール。ずれた瞬間に、判断もずれる。",
    representative: "VOXEL ROW。錯視トランプ。VRChatのUI違和感。",
    tech: "Unity / UdonSharp。Maya / Arnold。紙とアクリル。",
    target: "玩具。展示。体験型プロダクト。固まる前の試作。",
  },
  statement: {
    lead: "白か黒か、で終わらないところ。",
    paragraphs: [
      "白い駒と黒い駒。盤面を回すだけで、さっきまでの勝ち筋が怪しくなる。同じ色のはずなのに、横に線を置くと違って見える。そういう「今、変わった」瞬間が気になります。",
      "作るときは、まずそのズレを触ります。すぐ名前をつけない。紙にルールを書く。アクリルの厚みを変える。Unityで一回動かす。どこで判断が変わったのかを見る。",
      "グラフィック・コード・企画。疑問を一度プロトタイプにして、遊べるのか、持てるのか、近づいたら分かるのか。検証を重ねて、作品にします。",
    ],
    keywords: ["違和感", "手で触る", "見え方", "言葉に戻す"],
  },
} as const;
