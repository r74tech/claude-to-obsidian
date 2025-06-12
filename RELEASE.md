# リリース手順

## 自動リリースの使い方

GitHub Actionsを使用して自動的にビルドとリリースが行われます。

### 1. バージョンを更新

```bash
# パッチバージョン更新 (1.0.0 → 1.0.1)
pnpm version:patch

# マイナーバージョン更新 (1.0.0 → 1.1.0)
pnpm version:minor

# メジャーバージョン更新 (1.0.0 → 2.0.0)
pnpm version:major
```

### 2. タグをプッシュ

```bash
# 変更をコミット
git add .
git commit -m "Release v1.0.1"

# タグをプッシュ（これがリリースをトリガーします）
git push && git push --tags
```

### 3. 自動処理

以下が自動的に実行されます：

1. ChromeとFirefox版のビルド
2. zipファイルの作成
3. GitHubリリースの作成
4. zipファイルのアップロード
5. リリースノートの自動生成

### 4. リリースの確認

[Releases](https://github.com/r74/claude-to-obsidian/releases)ページで確認できます。

## ローカルでのビルド確認

リリース前にローカルでビルドを確認：

```bash
# クリーンビルド
rm -rf .output/
pnpm build
pnpm build:firefox

# zipファイル作成
pnpm zip
pnpm zip:firefox

# 生成されたファイルを確認
ls -la .output/
```

## トラブルシューティング

- **ビルドエラー**: `pnpm compile`で型エラーがないか確認
- **権限エラー**: リポジトリの Settings > Actions > General で権限を確認
- **タグの重複**: 既存のタグを削除してから再度プッシュ

```bash
# タグを削除（ローカル）
git tag -d v1.0.0

# タグを削除（リモート）
git push origin :refs/tags/v1.0.0
```
