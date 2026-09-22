# 詩吟SNS

五・七・五で投稿する詩吟SNSのMVP。Next.js (App Router) + TypeScript + Prisma (SQLite) のフルスタック構成。

## 機能

- **投稿**: 上の句(5拍)・中の句(7拍)・下の句(5拍)を詠んで投稿。写真の添付も可能。
- **音数バリデーション**: 各句の拍(モーラ)数を判定し、ちょうど・字足らず・字余り(±1拍まで許容)・拍数エラー(投稿ブロック)をリアルタイム表示。
- **感想(コメント)**: 自由な文章でも、5・7・5モードでも投稿可能。5・7・5モードでちょうど達成すると+5ptの報酬。
- **簡易ポイント制度**: 見事な五・七・五の感想を返すとユーザーにポイントが加算され、ヘッダーに表示される。
- **認証**: ユーザー名/パスワードによる簡易認証 (NextAuth Credentials + bcrypt)。

## 音数(モーラ)判定について

外部の形態素解析辞書は使わず、簡易ルールベースで判定しています。

- ひらがな・カタカナ1文字 = 1拍
- 拗音(ゃゅょ等の小書き文字)は直前の文字と結合し、拍を増やさない
- 促音(っ/ッ)・撥音(ん/ン)・長音符(ー)は1拍として数える
- 空白・句読点・記号は数えない
- **漢字は読みを持たないため1文字=1拍として近似**しています(例: 「夏」は本来2拍だが1拍として数える)。正確な拍数で投稿したい場合はひらがな表記を推奨します。(→ [#2](https://github.com/handa-ryo/sigin-sns/issues/2))

実装は `src/lib/mora.ts` を参照してください。

## AI添削・詩の評価について(未実装・将来検討)

投稿への本格的なAI添削・評価機能は今回のMVPスコープには含めていません。現時点で実装しているのは「感想が5・7・5を達成しているか」の自動判定のみです。将来的にLLM APIと連携した添削・評価を追加する場合は、評価基準(季語・情景・独創性など何を評価するか)をあらためて設計する必要があります。(→ [#1](https://github.com/handa-ryo/sigin-sns/issues/1))

## セットアップ

```bash
npm install
cp .env.example .env   # DATABASE_URL / AUTH_SECRET を設定 (AUTH_SECRET は `openssl rand -base64 32` 等で生成)
npx prisma migrate dev
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開く。

## 技術スタック

- Next.js 16 (App Router, Server Actions)
- TypeScript
- Prisma 7 (SQLite, better-sqlite3 driver adapter)
- NextAuth v5 (Credentials provider)
- Tailwind CSS

## 既知の制約 / 今後の課題

課題はGitHub Issuesで管理しています。

- モーラ判定は簡易近似(上記参照)。漢字混じりの投稿では実際の拍数とズレる場合がある。→ [#2](https://github.com/handa-ryo/sigin-sns/issues/2)
- 画像はローカルの `public/uploads` に保存。本番運用時はオブジェクトストレージ(S3等)への移行を推奨。→ [#3](https://github.com/handa-ryo/sigin-sns/issues/3)
- パスワードリセットやメール認証は未実装。→ [#4](https://github.com/handa-ryo/sigin-sns/issues/4)
- AI添削・作品評価は未実装(将来検討事項)。→ [#1](https://github.com/handa-ryo/sigin-sns/issues/1)
