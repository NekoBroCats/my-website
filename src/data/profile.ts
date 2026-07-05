export const profile = {
  name: "山根瑛之輔",
  nameEn: "Yamane Akinosuke",
  title: "Perception Designer / Prototype Creator",
  titleJa: "認識を設計する、企画・試作型クリエイター",
  heroStatement: [
    "同じものを見ているはずなのに、人によって答えがズレる。",
    "そのズレを、遊びや展示や、触れる試作品として置いてみたい。",
  ],
  email: "kurisutaruchirudoren@gmail.com",
  /** リンク先が確定していないものは href を null にしてプレースホルダー表示する */
  links: [
    { label: "GitHub", href: null as string | null, note: "準備中" },
    { label: "X (Twitter)", href: null as string | null, note: "準備中" },
  ],
  quickScan: {
    person: "見え方やルールが少し変わった瞬間に、人の判断がどうズレるのかをよく見ています。",
    representative: "VOXEL ROW / YONもく / 目を信用しきれないトランプ / VRChatで感じたUIの違和感",
    tech: "Unity / C# / UdonSharp / Maya / Arnold / アクリルや紙の試作 / グラフィック",
    target: "玩具、展示、体験型プロダクト、VR空間。まだ仕様が固まりきっていない段階の試作。",
  },
  statement: {
    lead: "白か黒か、で終わらないところが気になります。",
    paragraphs: [
      "たとえば白い駒と黒い駒を並べるだけでも、盤面を回した瞬間に、さっきまで見えていた勝ち筋が急に怪しくなります。色もそうです。同じ色のはずなのに、隣に置く線のせいで違って見える。そういう「いや、さっきまでそう見えてたんだけど」という瞬間が気になります。",
      "作るときは、まずその違和感をしばらく触ります。すぐにきれいなコンセプト名にはしません。紙にルールを書いたり、アクリルの厚みを変えたり、Unityでとりあえず動かしたりして、人の判断がどのタイミングでズレるのかを見ます。",
      "グラフィックだけ、コードだけ、企画だけ、というよりは、問いを一回ものにしてみるタイプです。遊べるのか、持てるのか、近づいたら分かるのか、説明しなくても触り方が見えるのか。そこまで行ってから、やっと言葉に戻します。",
    ],
    keywords: ["違和感", "手で触る", "見え方", "言葉に戻す"],
  },
} as const;
