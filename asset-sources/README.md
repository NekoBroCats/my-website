# Local Asset Sources

このフォルダは、公開前の元素材置き場です。写真の撮影元データ、PSD、候補画像、巨大ファイルを置けますが、Gitにはコミットしません。

## 置き場所

| フォルダ/ファイル | 内容 | 公開時の書き出し先 |
|---|---|---|
| `works/voxelrow/` | VOXEL ROWの元写真、PSD、未圧縮候補素材 | `public/assets/works/web/voxel-row-*.jpg` |
| `works/illusioncards/` | 錯視トランプの元写真、候補素材 | `public/assets/works/web/illusion-cards-*.jpg` |
| `works/Moodorgan/` | MOODORGANの元写真、候補素材 | `public/assets/works/web/moodorgan-*.jpg` |
| `works/Myface.jpg` | 旧プロフィール候補 | `public/assets/profile/yamane-portrait.jpg` |
| `works/jqYpnhuU_400x400.jpg` | 旧アイコン/プロフィール候補 | 用途名を決めて `public/assets/` 以下に最適化コピー |

## 使い方

1. 元素材はここに置く。
2. サイトで使うものだけを軽量化して `public/assets/` にコピーする。
3. 公開素材を追加したら `public/assets/README.md` と該当フォルダのREADMEに用途を追記する。
