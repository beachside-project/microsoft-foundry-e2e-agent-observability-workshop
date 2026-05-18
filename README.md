# ワークショップ: 「Microsoft Foundry で AI エージェントを観測・最適化・保護する」

## セッション概要

**所要時間:** 75 分

信頼できる AI エージェントを構築したいですか？難しいのは初回に動かすことではなく、モデルの更新、プロンプトの改良、検索パイプラインのドリフト、実運用で明らかになるエッジケースなどがあっても、アプリケーションのライフタイム全体を通じて **継続的に動作させ続けること** です。これを実現するには、エンドツーエンドの観測性 (observability) を提供する統合プラットフォームが必要です。AI 品質の問題を _検出_ し、_診断_ し、反復的にソリューションのパフォーマンスを _最適化_ できる、シームレスにつながった豊富な開発者ツールが求められます。

このワークショップでは、Microsoft Foundry の観測性プラットフォームを実際に体験するため、以下の 2 つのパスのうちいずれかを進めます:

1. **Foundry SDK を使う** - コードファーストのアプローチで、AI エージェントソリューションのビルド・評価・トレース・レッドチーミングの方法を学びます。
1. **Foundry Skills を使う** - コーディングエージェントのアプローチで、ベースとなる AI エージェントから評価駆動の最適化サイクル全体をオーケストレーションします。

最初のオプションはより伝統的で、関連する概念・ツール・ワークフローを体感できます。2 つ目のオプションは、強化された開発者体験のプレビューであり、観測された結果に基づいて (推測ではなく) コーディングエージェントが「評価-最適化」ループを加速し、データセット作成・バッチ評価実行・バージョン比較・プロンプトや指示の最適化などのアクションを実行します。途中で、エージェントの推論プロセスを観察し、必要に応じて意思決定を導きながら、これらのツールへの直感を養っていきます。

## アプリケーションシナリオ

すべてのラボで一貫したシナリオを使用し、現実的なユースケースの文脈で機能と成果を考えられるようにします。

**Contoso Travel** は架空の中規模旅行代理店で、人間のアドバイザーチームでは旅行予約に関する顧客からの問い合わせ件数に対応しきれなくなっています。彼らは、関連する在庫 (ホテル・フライト・レンタカーなど) を検索してパーソナライズされた推奨を行い、複数ターンにわたる会話の中でカスタマイズされた旅程を提供できる、AI 駆動の旅行アシスタント — 知的なエージェントのシステム — を必要としています。

## ワークショップ概要

このワークショップでは、_計画_ から _プロトタイピング_、そして _本番運用_ までの AI 開発者の道のりをたどります。ワークショップ終了時には、以下のことができるようになっているはずです:

1. OpenTelemetry トレースでエージェントの実行を _観測_ する
1. Foundry skills を活用してエージェントのパフォーマンスを _最適化_ する
1. Red Teaming スキャンでエージェントを攻撃から _保護_ する
1. エージェントを _デプロイ_ し、Ask AI でインサイトを監視・分析する

これらは Microsoft Foundry プラットフォームのツールとワークフローを使って実現します。ワークショップ終了時には、以下のことができるようになっているはずです:

1. ノーコードで単一プロンプトのエージェントを _セットアップ_ する - [Foundry ポータル](https://learn.microsoft.com/en-us/azure/foundry/how-to/navigate-from-classic?view=foundry#navigate-the-portal) を使用。
1. マルチエージェントソリューションをコードファーストで _構築_ する - [Foundry SDK](https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/sdk-overview?view=foundry&pivots=programming-language-python) を使用。
1. コーディングエージェントで AI エージェントを _観測・最適化_ する - [Foundry skills](https://github.com/microsoft/GitHub-Copilot-for-Azure/tree/main/plugin/skills/microsoft-foundry) を使用。

<br/>

## ワークショップの流れ

### 1. はじめに

このワークショップには、選択できる 2 つのパスがあります:

- **共通パス**: ステップ 1 と 2 を完了して、インフラと開発環境をセットアップします。
- **パス A**: ステップ 3 を実施。_Foundry Skills_ を使って評価-最適化ループを自動化します。
- **パス B**: ステップ 4 を実施。_Foundry SDK_ を使った従来型のコーディング (手動) を行います。

いずれのパスでもエンドツーエンドの旅を完了するには 60 分以上かかる場合があります。まず 1 つを選んで完了し、時間が許せばもう一方も試してみてください。

| ステップ | 手順 | ツール · 成果 |
|:---|:---|:---|
| 1. | [インフラのセットアップ](./labs/notebooks-jp/0-setup/lab-00-setup-project.md) | Foundry ポータル · Foundry プロジェクトをセットアップ |
| 2. | [開発環境のセットアップ](./labs/notebooks-jp/0-setup/lab-01-setup-codespaces.md) | GitHub Codespaces · ローカルの .env をセットアップ |
| 3. | [Observe スキルを有効化](./labs/notebooks-jp/1-prompt-agents/README.skills.md)| Foundry Skills · 評価-最適化ループを実行 |
| 4. | [ステップバイステップで構築](./labs/notebooks-jp/1-prompt-agents/README.sdk.md)| Foundry SDK · 計画から本番まで手動で進める |
| | | |

### 2. 次のステップ

現在のワークショップ (v1) は _プロンプト_ エージェント向けに構成されています。次のバージョン (v2) では、最大限の開発者制御を可能にするコンテナ化された環境上で、カスタムコードとランタイムを使用する _ホスト型エージェント_ を紹介する予定です。2026 年 5 月～ 6 月の更新については、リポジトリを Fork してウォッチしてください。

**重要なポイント** は、Microsoft Foundry の Observability プラットフォームは、OpenTelemetry 準拠のトレースと Responses API 準拠のエンドポイントをサポートしている限り、_任意の_ エージェント (任意のプログラミング言語やフレームワークで構築されたもの) に対して効果的に機能する、ということです。


### 3. 関連リソース

Microsoft の _Foundry コントロールプレーン_ は、エージェント型 AI ソリューションに対する _セキュリティ・コンプライアンス・フリート管理・観測性_ を支援するツールと機能を提供します。さらに、Microsoft Foundry ポータルの「Operate」タブからアクセスできる、ロールに応じた統合管理インターフェイスも備えています。

![FCP](./labs/assets/foundry-control-plane.png)

このワークショップでは Observability にスポットライトを当てていますが、関連する各コンポーネントについて深く掘り下げるため、以下のリソースもぜひご活用ください。

| リソース | 説明 |
|----------|-------------|
| [Foundry Control Plane](https://learn.microsoft.com/en-us/azure/foundry/control-plane/overview?view=foundry) | AI エージェント・モデル・ツールに対する全社的な可視性、ガバナンス、制御 |
| [Observability](https://learn.microsoft.com/en-us/azure/foundry/concepts/observability?view=foundry) | AI エージェントの監視・理解・トラブルシューティング |
| [Agent Tracing](https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept?view=foundry) | Foundry における OpenTelemetry (OTel) プロトコルとセマンティック規約のサポート |
| [Evaluations](https://learn.microsoft.com/en-us/azure/foundry/concepts/built-in-evaluators?view=foundry) | 品質・安全性・エージェント性能のための組み込み評価器とカスタム評価器 |
| [Red Teaming](https://learn.microsoft.com/en-us/azure/foundry/concepts/ai-red-teaming-agent?view=foundry) | 特定のリスクカテゴリと攻撃戦略に対する敵対的テスト |
| | |


## ワークショップのブランチ

このワークショップは、Microsoft Foundry プラットフォームの最新の更新を反映して進化し続ける、長く活用できるリソースとなることを目指しています。利便性のため、特定のイベントで提供された過去のワークショップ版を _ブランチ_ として保持しています。

| 日付 | ブランチ | 説明 |
|:---|:---|:---|
| 2026/03/27 | [2026-03-mvp-summit](https://github.com/Azure-Samples/microsoft-foundry-e2e-agent-observability-workshop/tree/2026-03-mvp-summit) | `observe` スキル付きプロンプトエージェント |
| 2026/04/04 | [2026-04-aie-europe](https://github.com/Azure-Samples/microsoft-foundry-e2e-agent-observability-workshop/tree/2026-04-aie-europe) | `observe` スキル付きプロンプトエージェント |
| 2026/04/18 | [2026-04-msft-tw](https://github.com/Azure-Samples/microsoft-foundry-e2e-agent-observability-workshop/tree/2026-04-aie-europe) | `observe` スキル付きプロンプトエージェント |
| | | |


## コントリビューション

このプロジェクトでは、コントリビューションと提案を歓迎しています。ほとんどのコントリビューションでは、あなたがコントリビューションする権利を有しており、実際に私たちにその利用権を付与することを宣言する Contributor License Agreement (CLA) に同意していただく必要があります。詳細は [Contributor License Agreements](https://cla.opensource.microsoft.com) をご覧ください。

プルリクエストを送信すると、CLA ボットが自動的に CLA の提供が必要かどうかを判定し、PR に適切な装飾を行います (ステータスチェック、コメントなど)。ボットの指示に従ってください。CLA を利用するすべてのリポジトリで、これは一度だけ行えば十分です。

このプロジェクトは [Microsoft オープンソース行動規範](https://opensource.microsoft.com/codeofconduct/) を採用しています。詳細については [行動規範に関する FAQ](https://opensource.microsoft.com/codeofconduct/faq/) を参照するか、追加の質問やコメントがあれば [opencode@microsoft.com](mailto:opencode@microsoft.com) までお問い合わせください。

## 商標

このプロジェクトには、プロジェクト・製品・サービスの商標やロゴが含まれている場合があります。Microsoft の商標やロゴの正当な使用は、[Microsoft の商標およびブランド ガイドライン](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general) に従う必要があります。本プロジェクトの改変版において Microsoft の商標やロゴを使用する場合、混乱を招いたり、Microsoft の後援を示唆したりしてはなりません。第三者の商標やロゴの使用は、当該第三者のポリシーに従う必要があります。
