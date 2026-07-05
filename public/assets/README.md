# 画像アセット配置ガイド

画像が未配置の作品もサイトは壊れません(SVGビジュアルで成立します)。

## 現在の配置状況

サイトが実際に読み込むのは `works/web/` 内の最適化済みコピー(1600px幅・JPEG品質82)です。
`works/` 直下の各フォルダは元データ置き場で、サイトからは参照されません。

| 表示箇所 | ファイル | 元データ |
|---|---|---|
| VOXEL ROW(カード・詳細) | `works/web/voxel-row-main.jpg` | `works/voxelrow/VoxelRow_Hand_1.jpg` |
| 錯視トランプ(カード・詳細) | `works/web/illusion-cards-main.jpg` | `works/illusioncards/illusion-cards-main.jpg.jpg` |
| MOODORGAN(カード) | `works/web/moodorgan-main.jpg` | `works/Moodorgan/DSC_0138.jpg` |
| MOODORGAN(詳細・ポスター原画) | `works/web/moodorgan-poster.jpg` | `works/Moodorgan/moodorgan-01.jpg` |

## 未配置(画像募集中)の作品

| 作品 | 推奨内容 |
|---|---|
| YONもく | 立体盤と駒の実物写真(回転中の盤面が理想) |
| VRChat UI | ワールド内スクリーンショット |
| Unity Technical | 巡回MOB・NavMeshの動作画面 |
| 3DCG / Product Modeling | Arnoldレンダリング画像 |

追加するときは `src/data/works.ts` の該当作品の `image` にパスを設定してください(横1600px程度に縮小推奨)。

## OGP(SNSシェア用画像)

| ファイル名 | 推奨サイズ | 用途 |
|---|---|---|
| `ogp.png` | 1200×630 | X / Facebook / Slack等でのシェア画像 |
