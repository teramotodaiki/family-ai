# Family AI

## 起動手順（iOS シミュレータ / Dev Client）

- 前提条件: Xcode（Simulator 含む）、Node 18+/npm 10、CocoaPods（自動で実行されます）
- 依存インストール（ルート）: `npm install`
- Dev Client をビルドしてインストール（初回のみ）:
  - `cd apps/main`
  - `npx expo run:ios`（シミュレータに Dev Client を作成・起動）
- 開発サーバ起動（以降の開発はこれで十分）:
  - `cd apps/main && npm run dev`（= `expo start -c`）
  - Dev Client から表示された開発サーバに接続

注意: 現在は Dev Client 前提です（Expo Go は利用しません）。

## プロジェクト構成

- メインアプリ: `apps/main`
- 共通 UI パッケージ: `packages/ui`

## トラブルシュート

- シミュレータが開かない: `open -a Simulator` を実行してから再度 `npx expo run:ios`
- Pod 関連エラー（Dev Build 時）: `cd apps/main/ios && pod install` 後に再実行
- 依存解決が不安定: ルートで `rm -rf node_modules package-lock.json && npm install`
- Worklets/初期化エラー: 依存を追加・変更した場合は Dev Client を再ビルド（`npx expo run:ios`）

## メモ

- `EXPO_PUBLIC_` プレフィックスの環境変数はクライアントに公開されます。秘匿値は含めない方針を推奨します。

## 配布（TestFlight）

- 前提: Apple Developer Program 加入、App Store Connect 権限
- 注意: EAS コマンドは必ず `apps/main` ディレクトリで実行する（`apps/main/eas.json` を参照）
- 手順:
  - `cd apps/main`
  - 初回のみ: `eas login`
  - ビルド: `eas build -p ios --profile production`
  - 提出: `eas submit -p ios --latest`

## よく使うコマンド

- 前提: 以降の EAS コマンドは `apps/main` で実行
- 開発サーバ起動（推奨）: `cd apps/main && npm run dev`
- iOS Dev Client（ローカル）: `cd apps/main && npx expo run:ios`
- iOS 実機 Release ビルド（常時利用向け）:
  - `cd apps/main && npx expo run:ios --configuration Release --device <UDID>`
- EAS Dev Build（内部配布・開発用）:
  - `cd apps/main && eas build -p ios --profile development`
- EAS Production Build（TestFlight / Store 提出）:
  - `cd apps/main && eas build -p ios --profile production`
- TestFlight 提出（プロンプト最小化設定済み）:
  - `cd apps/main && eas submit -p ios --latest --profile production`
  - 補足: `apps/main/eas.json` は `appVersionSource: "remote"` と `submit.production.ios.ascAppId` を設定済み

## E2E（Maestro）

- 前提: `brew install maestro`（macOS）、iOS シミュレータ（例: iPhone 15）、Dev Client 使用
- Dev Client 準備（初回のみ）:
  - `cd apps/main && npx expo run:ios --no-bundler -d "iPhone 15"`
  - バンドラ起動: 別ターミナルで `npx expo start --dev-client`
- テスト実行: `cd apps/main && npm run e2e`
- 任意の環境変数: `EXPO_PUBLIC_OPENAI_API_KEY`（未設定でも基本シナリオは動作）
- トラブル時:
  - `expo-linking` 関連で失敗する場合は `cd apps/main && npx expo install expo-linking && npx expo run:ios --no-bundler -d "iPhone 15"`

## 実装メモ（ナビゲーション）

- 画面遷移は Expo Router（v3）を使用
- Drawer は `expo-router/drawer` を採用（Anywhere スワイプ、`drawerType: 'slide'` で押し出し）
- Chat 画面は `(drawer)` グループ配下（Drawer の子画面）として実装
