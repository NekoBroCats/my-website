# Works Asset Notes

このフォルダは、サイトで公開される作品画像の置き場所です。撮影元データ・候補画像・PSD・巨大ファイルは `asset-sources/works/` に置き、ここには入れません。

## 公開用

| フォルダ | 内容 | Git |
|---|---|---|
| `web/` | サイトで実際に読み込む軽量化済み画像 | コミットする |

## ローカル作業用の対応先

| フォルダ/ファイル | 内容 | Git |
|---|---|---|
| `asset-sources/works/voxelrow/` | VOXEL ROWの元写真、PSD、未圧縮候補素材 | コミットしない |
| `asset-sources/works/illusioncards/` | 錯視トランプの元写真、候補素材 | コミットしない |
| `asset-sources/works/Moodorgan/` | MOODORGANの元写真、候補素材 | コミットしない |
| `asset-sources/works/Myface.jpg` | 旧プロフィール候補 | コミットしない |
| `asset-sources/works/jqYpnhuU_400x400.jpg` | 旧アイコン/プロフィール候補 | コミットしない |

公開に使うときは、元データを直接参照せず、`web/` または `../profile/` に用途名で書き出してから参照します。
