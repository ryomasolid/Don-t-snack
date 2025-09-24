# DontSnack

🍭 **「DontSnack」は、モバイルアプリです。** あなたの食生活を記録し、間食をしない習慣を築くお手伝いをします。\
このアプリは、ExpoとReact Nativeをベースに構築されております。

---

## 🚀 はじめに

### インストールと実行

1.  このリポジトリをクローンします。
    ```bash
    git clone [https://github.com/your-username/dont-snack.git](https://github.com/your-username/dont-snack.git)
    cd dont-snack
    ```
2.  依存関係をインストールします。
    ```bash
    npm install
    ```
3.  プロジェクトを起動します。
    ```bash
    npx expo start --tunnel -c
    ```
4.  QRコードが表示されたら、お使いのスマートフォンの**Expo Go**アプリでスキャンするか、ブラウザでアクセスしてください。

---

## ビルドと提出
このプロジェクトのiOSアプリをビルドして、App Store Connectに提出するまでの手順は以下の通りです。

1.  アプリのビルド
アプリのバイナリファイル（.ipa）を生成します。
    ```bash
    npx eas build -p ios
    ```
このコマンドは、Expo Application Services (EAS) を使って、クラウド上でプロジェクトをビルドし、署名済みのバイナリを生成します。
2.  App Store Connectへの提出
生成されたバイナリをAppleのApp Store Connectにアップロードします。
    ```bash
    eas submit --platform ios
    ```
このコマンドを実行すると、ビルドされたアプリがApp Store Connectに提出され、テスターへの配布や審査提出が可能になります。

---

## 🛠️ 使用技術

このプロジェクトは、最新のクロスプラットフォーム開発技術を活用しています。

* **Expo**: React Nativeフレームワークをベースに、迅速な開発とビルドプロセスを可能にします。
* **Expo Router**: ファイルベースのルーティングシステムで、ナビゲーションをシンプルにします。
* **React Native**: iOS、Android、Web向けにネイティブなユーザーインターフェースを構築するためのフレームワークです。
* **Firebase**: バックエンドサービス（認証、データベースなど）を提供します。
* **Jotai**: ステート管理ライブラリで、シンプルかつ効率的なグローバルステート管理を実現します。
* **React Navigation**: アプリ内の画面間ナビゲーションを管理します。
* **React Native Calendars**: 日付選択やカレンダー機能を提供します。
* **TypeScript**: 型安全なJavaScriptコードを作成し、開発中のエラーを減らします。

---
