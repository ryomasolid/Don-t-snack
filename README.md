# Don't Snack

間食記録アプリ。毎日の間食の有無をチェックし、カレンダーでストリークを確認できる。

**対象プラットフォーム:** iOS のみ

---

## 技術スタック

- **Expo** ~54 / **React Native** 0.81
- **Firebase** 12（Anonymous Auth + Firestore）
- **Jotai** 2（グローバル状態管理）
- **AdMob**（react-native-google-mobile-ads）

---

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` を作成し、Firebase と AdMob の値を設定する。`.env` がテンプレートとして置いてある。

```bash
cp .env .env.local
```

`.env.local` を編集：

```env
EXPO_PUBLIC_FIREBASE_API_KEY="..."
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
EXPO_PUBLIC_FIREBASE_PROJECT_ID="..."
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
EXPO_PUBLIC_FIREBASE_APP_ID="..."
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID="..."
EXPO_PUBLIC_BANNER_AD_UNIT1_ID="..."
EXPO_PUBLIC_BANNER_AD_UNIT2_ID="..."
```

### 3. EAS へのログイン（初回のみ）

```bash
npx eas-cli login
```

---

## 開発サーバーの起動

### ngrok トンネル経由（デフォルト）

```bash
npm start
```

ngrok がタイムアウトする場合は LAN モードを使う。

### LAN 経由（同一 WiFi ネットワーク推奨）

```bash
npm run start:lan
```

### Dev Client について

このプロジェクトは `expo-dev-client` を使用しているため、Expo Go アプリではなくカスタムビルドの **Dev Client** をデバイスにインストールして接続する必要がある。

---

## ビルド（EAS Build）

### Dev Client ビルド（開発用）

```bash
npx eas build --profile development --platform ios
```

### プレビュービルド（内部配布）

```bash
npx eas build --profile preview --platform ios
```

### 本番ビルド

```bash
npx eas build --profile production --platform ios
```

---

## App Store への申請

```bash
npx eas submit --platform ios
```

---

## プロジェクト構成

```
app/
  (tabs)/
    check.tsx       # 今日の間食チェック画面
    calendar.tsx    # カレンダー履歴・ストリーク画面
components/
  ContainerComponent.tsx  # テーマ対応ラッパー
  CustomHeader.tsx
hooks/
  useCalendarLogic.ts     # カレンダーロジック
  useThemeStyles.ts
store/
  atoms.ts                # Jotai atoms（colorAtom, calendarAtom）
  firestore.ts            # Firebase CRUD
```
