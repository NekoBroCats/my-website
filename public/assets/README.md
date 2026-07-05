# Asset Inventory

このフォルダは、GitHub Pagesで公開される静的素材置き場です。公開に必要な軽量素材だけをコミットし、撮影元データ・PSD・候補写真・巨大ファイルはコミットしません。

## コミットしてよい公開素材

| 素材 | 用途 | 参照元 |
|---|---|---|
| `ogp.png` | SNS共有用OGP画像 | `index.html` |
| `profile/yamane-portrait.jpg` | Aboutページのプロフィール写真 | `src/components/About.tsx` |
| `works/web/voxel-row-main.jpg` | VOXEL ROWのカード/詳細メイン画像 | `src/data/works.ts` |
| `works/web/voxel-row-01.jpg` | VOXEL ROWの詳細ギャラリー: 立体構造全体 | `src/data/works.ts` |
| `works/web/voxel-row-02.jpg` | VOXEL ROWの詳細ギャラリー: 手元の操作/配置 | `src/data/works.ts` |
| `works/web/voxel-row-03.jpg` | VOXEL ROWの詳細ギャラリー: 盤面/構造ディテール | `src/data/works.ts` |
| `works/web/illusion-cards-main.jpg` | 錯視トランプのカード/詳細メイン画像 | `src/data/works.ts` |
| `works/web/illusion-cards-01.jpg` | 錯視トランプの詳細ギャラリー: カード全体 | `src/data/works.ts` |
| `works/web/illusion-cards-02.jpg` | 錯視トランプの詳細ギャラリー: 錯視パターン | `src/data/works.ts` |
| `works/web/illusion-cards-03.jpg` | 錯視トランプの詳細ギャラリー: 使用イメージ | `src/data/works.ts` |
| `works/web/moodorgan-main.jpg` | MOODORGANのカード/詳細メイン画像 | `src/data/works.ts` |
| `works/web/moodorgan-poster.jpg` | MOODORGANの詳細ポスター画像 | `src/data/works.ts` |
| `works/web/moodorgan-01.jpg` | MOODORGANの詳細ギャラリー: 展示/ポスター | `src/data/works.ts` |
| `works/web/moodorgan-02.jpg` | MOODORGANの詳細ギャラリー: 体験/展示風景 | `src/data/works.ts` |
| `works/web/moodorgan-03.jpg` | MOODORGANの詳細ギャラリー: ディテール | `src/data/works.ts` |

## コミットしない素材

元データは `asset-sources/` に置き、Gitには入れません。`public/` 配下に元データを置くとローカルビルド時に `dist` へコピーされるため、公開用に軽量化した画像だけを `public/assets/` に置きます。

| 場所 | 内容 | 扱い |
|---|---|---|
| `asset-sources/works/voxelrow/` | VOXEL ROWの撮影元、PSD、未圧縮/巨大素材 | 必要な画像だけ `public/assets/works/web/` に軽量化してコピー |
| `asset-sources/works/illusioncards/` | 錯視トランプの撮影元/候補写真 | 必要な画像だけ `public/assets/works/web/` に軽量化してコピー |
| `asset-sources/works/Moodorgan/` | MOODORGANの撮影元/候補写真 | 必要な画像だけ `public/assets/works/web/` に軽量化してコピー |
| `asset-sources/works/Myface.jpg` | 旧プロフィール候補画像 | 使う場合は `public/assets/profile/yamane-portrait.jpg` に最適化して置く |
| `asset-sources/works/jqYpnhuU_400x400.jpg` | 旧アイコン/プロフィール候補画像 | 使う場合は用途名でリネームして最適化する |

## 出し入れルール

1. 元データは `asset-sources/works/<work-name>/` に置く。
2. サイトで使う画像だけ `public/assets/works/web/` にコピーし、横幅1600px程度・JPEG品質80前後を目安に軽量化する。
3. 新しい公開画像を追加したら、このファイルと `works/web/README.md` に「何の素材か」を追記する。
4. 画像パスを変更したら `src/data/works.ts` または参照元コンポーネントも更新する。
