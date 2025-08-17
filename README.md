# Family AI

## 起動手順（iOS シミュレータ）

- 前提条件: Xcode（Simulator 含む）、Node 18+/npm 10、（Dev Build 時のみ）CocoaPods
- 依存インストール: `npm install`
- Expo Go で起動: `npm run dev:main` を実行し、Dev サーバーで `i` を押す
- 開発ビルド（ネイティブ依存が必要な場合）: `npm run ios -w apps/main`

## プロジェクト構成

- メインアプリ: `apps/main`
- 共通 UI パッケージ: `packages/ui`

## トラブルシュート

- シミュレータが開かない: `open -a Simulator` → ターミナルで `i`
- Pod 関連エラー（Dev Build 時）: `cd apps/main/ios && pod install` 後に再実行
- 依存解決が不安定: ルートで `rm -rf node_modules package-lock.json && npm install`

## メモ

- `EXPO_PUBLIC_` プレフィックスの環境変数はクライアントに公開されます。秘匿値は含めない方針を推奨します。

## 配布（TestFlight）

- 前提: Apple Developer Program 加入、App Store Connect 権限
- 注意: EAS コマンドは必ず `apps/main` ディレクトリで実行する
- 手順:
  - `cd apps/main`
  - 初回のみ: `eas login`
  - ビルド: `eas build -p ios --profile production`
  - 提出: `eas submit -p ios --latest`

## よく使うコマンド

- 前提: 以降の EAS コマンドは `apps/main` で実行
- 開発サーバー起動: `npm run dev:main`
- iOS 開発ビルド起動: `npm run ios -w apps/main`
- iOS 実機 Release ビルド（常時利用向け）:
  - `cd apps/main && npx expo run:ios --configuration Release --device <UDID>`
- EAS Dev Build（内部配布・開発用）:
  - `cd apps/main && eas build -p ios --profile development`
- EAS Production Build（TestFlight / Store 提出）:
  - `cd apps/main && eas build -p ios --profile production`
