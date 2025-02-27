# Chicken Chat

## 概要
Chicken Chatは、リアルタイムチャット機能を持ち、一定時間で履歴が削除される特徴を持つチャットアプリケーションです。

## デプロイ情報
- **Supabase**: [管理ダッシュボード](https://supabase.com/dashboard/project/vwxsftjecjgtgjwvcpzs)
- **Vercel**: [デプロイ環境](https://vercel.com/naoya25s-projects/chicken-chat)

## 機能
- リアルタイムチャット
- 一定時間でのチャット履歴自動削除
- ユーザーフレンドリーなインターフェース

## 技術スタック
- **フロントエンド/バックエンド**: Next.js
- **データベース**: Supabase
- **ホスティング**: Vercel

## インストール方法
```bash
# リポジトリのクローン
git clone [リポジトリURL]
cd chicken-chat

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 使い方
1. アプリケーションにアクセス
2. ユーザー名を入力してチャットルームに参加
3. メッセージを送信して他のユーザーとリアルタイムでコミュニケーション

## 開発者向け情報
環境変数の設定が必要です。`.env.local`ファイルを作成し、以下の変数を設定してください：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```
