---
name: microsoft-foundry
description: "Foundry agent をエンドツーエンドで deploy / 評価 / 管理: Docker build、ACR push、hosted / prompt agent の作成、コンテナ起動、batch eval、continuous eval、prompt optimizer ワークフロー、agent.yaml、trace からの dataset キュレーション。USE FOR: Foundry への agent デプロイ、hosted agent、agent 作成、agent invoke、agent 評価、batch eval 実行、continuous eval、continuous monitoring、continuous eval ステータス、prompt 最適化、prompt 改善、prompt optimizer、agent instructions の最適化、agent instructions の改善、system prompt の最適化、モデルデプロイ、Foundry project、RBAC、ロール割り当て、権限、quota、capacity、リージョン、agent のトラブルシューティング、デプロイ失敗、trace からの dataset 作成、dataset バージョン管理、eval トレンド、AI Services 作成、Cognitive Services、Foundry リソース作成、リソースプロビジョニング、knowledge index、agent monitoring、デプロイのカスタマイズ、オンボーディング、可用性。DO NOT USE FOR: Azure Functions、App Service、一般的な Azure デプロイ (azure-deploy を使用)、一般的な Azure 準備 (azure-prepare を使用)。"
license: MIT
metadata:
  author: Microsoft
  version: "1.1.13"
---

# Microsoft Foundry Skill

この skill は、開発者が Microsoft Foundry リソースを扱う際に役立ち、モデルの検出とデプロイ、AI agent の開発ライフサイクル全体、評価ワークフロー、トラブルシューティングをカバーします。

## 事前実行の要件

> **必須: いずれかのワークフローを実行する前に、必ず Azure MCP の `foundry` ツールを呼び出し、利用可能な Foundry MCP ツールと関連パラメーターを確認してください。** この最初の `foundry` 呼び出しは、検出 / ヘルプのステップとして扱ってください。この skill においては、Azure MCP `foundry` が Foundry 関連 MCP 操作の必須エントリーポイントです。

## Sub-Skills

> **必須: ワークフロー固有のステップを実行する前に、必ず対応するSub skill ドキュメントを読んでください。** sub-skill ドキュメントを読まずに、そのワークフロー固有の MCP ツールを呼び出さないでください。MCP ツールのパラメーターを既に知っている場合でも、この規則は適用されます。sub-skill ドキュメントには、従う必要のあるワークフロー手順、事前チェック、検証ロジックが含まれます。このルールは、同じ skill が既にロードされていても、別のワークフローをトリガーするユーザーからの新しいメッセージごとに適用されます。

この skill には、特定のワークフロー向けの専用 sub-skill が含まれます。**該当するタスクに一致する場合は、メイン skill ではなくこちらを使用してください:**

| Sub-skill | 使用するタイミング | 参照 |
|-----------|-------------|-----------|
| **deploy** | コンテナ化、ビルド、ACR への push、agent デプロイの作成 / 更新 / クローン | [deploy](foundry-agent/deploy/deploy.md) |
| **invoke** | agent へのメッセージ送信、シングルターン / マルチターンの会話 | [invoke](foundry-agent/invoke/invoke.md) |
| **observe** | agent の品質評価、batch eval の実行、失敗の分析、prompt の最適化、agent instructions の改善、バージョン比較、CI/CD モニタリングのセットアップ、本番環境での continuous evaluation の有効化 | [observe](foundry-agent/observe/observe.md) |
| **trace** | trace のクエリ、レイテンシ / 失敗の分析、App Insights の `customEvents` を介した eval 結果と特定レスポンスの相関付け | [trace](foundry-agent/trace/trace.md) |
| **troubleshoot** | hosted agent のログ表示、テレメトリのクエリ、失敗の診断 | [troubleshoot](foundry-agent/troubleshoot/troubleshoot.md) |
| **create** | 新しい hosted agent アプリケーションの作成。Microsoft Agent Framework、LangGraph、またはカスタムフレームワークを、Python または C# で、`responses` または `invocations` プロトコル上でサポートします。 | [create](foundry-agent/create/create-hosted.md) |
| **faos-optimize** | 既存の Python agent コードを、evaluator を対象とした instructions / model / temperature のチューニングポイントを組み込んだ FAOS (Foundry Agent Optimization Service) 最適化対応バージョンに変換し、デプロイ前にレビューのため停止します。 | [faos-optimize](foundry-agent/faos-optimize/faos-optimize.md) |
| **eval-datasets** | 本番 trace を評価用 dataset に取り込み、dataset のバージョンと分割を管理し、評価メトリクスを時系列で追跡し、リグレッションを検出し、trace からデプロイまでの完全なリネージを維持します。次のような場合に使用: trace からの dataset 作成、dataset のバージョン管理、評価トレンド、リグレッション検出、dataset 比較、eval リネージ。 | [eval-datasets](foundry-agent/eval-datasets/eval-datasets.md) |
| **project/create** | agent とモデルをホストする新しい Azure AI Foundry project の作成。Foundry のオンボーディングや新規インフラのセットアップ時に使用します。 | [project/create/create-foundry-project.md](project/create/create-foundry-project.md) |
| **resource/create** | Azure CLI を使った Azure AI Services マルチサービスリソース (Foundry リソース) の作成。AI Services リソースを細かい制御で手動プロビジョニングする際に使用します。 | [resource/create/create-foundry-resource.md](resource/create/create-foundry-resource.md) |
| **private-network** | Foundry のネットワーク分離に関する質問への回答**および** VNet 分離 (BYO VNet、Managed VNet、ハイブリッド) を伴う Foundry のデプロイ。アーキテクチャの概念、テンプレート選択、デプロイ、デプロイ後の検証をカバーします。 | [resource/private-network/private-network.md](resource/private-network/private-network.md) |
| **models/deploy-model** | インテリジェントなルーティングを備えた統合モデルデプロイ。クイック preset デプロイ、フルカスタマイズデプロイ (version / SKU / capacity / RAI)、リージョン横断のキャパシティ検出を処理します。サブ skill にルーティング: `preset` (クイックデプロイ)、`customize` (フル制御)、`capacity` (可用性の検出)。 | [models/deploy-model/SKILL.md](models/deploy-model/SKILL.md) |
| **quota** | Microsoft Foundry リソースの quota と capacity の管理。quota 使用量の確認、quota 不足によるデプロイ失敗のトラブルシューティング、quota 増加のリクエスト、capacity 計画時に使用します。 | [quota/quota.md](quota/quota.md) |
| **rbac** | Microsoft Foundry リソースに対する RBAC 権限、ロール割り当て、マネージド ID、サービスプリンシパルの管理。アクセス制御、権限監査、CI/CD セットアップに使用します。 | [rbac/rbac.md](rbac/rbac.md) |

> 💡 **ヒント:** 完全なオンボーディングフロー: `project/create` (パブリック) または `private-network` (VNet 分離) → `models/deploy-model` → agent ワークフロー (`create` → `deploy` → `invoke`)。

> 💡 **モデルデプロイ:** すべてのデプロイシナリオには `models/deploy-model` を使用してください。クイック preset デプロイ、フル制御のカスタマイズデプロイ、リージョン横断のキャパシティ検出の間をインテリジェントにルーティングします。

> 💡 **Prompt 最適化:** 「prompt を最適化して」「agent instructions を改善して」のようなリクエストには、[observe](foundry-agent/observe/observe.md) をロードし、その eval 駆動ワークフローを通じて `prompt_optimize` MCP ツールを使用してください。

## インフラストラクチャのライフサイクル

ユーザーの意図を正しいインフラストラクチャのワークフローに対応付けてください。

| ユーザーの意図 | ワークフロー |
|-------------|---------|
| 「Foundry を作って」/「Foundry をセットアップして」(あいまい) | `AskUserQuestion` を使用: (a) AI Services リソースのみ、(b) パブリックアクセスの project、(c) ネットワーク分離付きの project のどれか? ルーティング: (a) → [resource/create](resource/create/create-foundry-resource.md)、(b) → [project/create](project/create/create-foundry-project.md)、(c) → [private-network](resource/private-network/private-network.md) |
| VNet 分離付きで Foundry をセットアップ | [private-network](resource/private-network/private-network.md) |
| Foundry project の作成 (パブリック) | [project/create](project/create/create-foundry-project.md) |
| ベアな Foundry リソースの作成 | [resource/create](resource/create/create-foundry-resource.md) |

## Agent 開発ライフサイクル

ユーザーの意図を正しい agent ワークフローに対応付けてください。実行前に各サブ skill を順に読んでください。

| ユーザーの意図 | ワークフロー (この順序で読む) |
|-------------|------------------------|
| ゼロから新しい agent を作成 | [create](foundry-agent/create/create-hosted.md) → [deploy](foundry-agent/deploy/deploy.md) → [invoke](foundry-agent/invoke/invoke.md) |
| 既存の Python agent を FAOS 最適化可能にする | [faos-optimize](foundry-agent/faos-optimize/faos-optimize.md) → レビュー → deploy → invoke |
| agent のデプロイ (コードは既に存在) | deploy → invoke |
| コード変更後の agent の更新 / 再デプロイ | deploy → invoke |
| agent の invoke / テスト / チャット | invoke |
| agent の prompt や instructions の最適化 / 改善 | observe (Step 4: Optimize) |
| agent の評価と最適化 (フルループ) | observe |
| Continuous evaluation モニタリングの有効化 | observe (Step 6: CI/CD & Monitoring) |
| agent の問題のトラブルシューティング | invoke → troubleshoot |
| 壊れた agent の修正 (トラブルシューティング + 再デプロイ) | invoke → troubleshoot → 修正適用 → deploy → invoke |

## Agent: .foundry ワークスペース標準

すべての agent ソースフォルダーは、Foundry 固有の状態を `.foundry/` 配下に保持してください:

```text
<agent-root>/
  .foundry/
    agent-metadata.yaml
    agent-metadata.prod.yaml
    datasets/
    evaluators/
    results/
```

- `agent-metadata.yaml` は、ローカル / 開発用メタデータファイルとして推奨されます。`agent-metadata.prod.yaml` のようなオプションのサイドカーファイルは、1 つのファイル内で複数の環境を混在させることなく、単一の本番または CI 対象環境を保持できます。
- `datasets/` と `evaluators/` はローカルキャッシュフォルダーです。最新である場合は再利用し、リフレッシュや上書きの前にユーザーに確認してください。
- 正規のスキーマとワークフロールールは [Agent Metadata Contract](references/agent-metadata-contract.md) を参照してください。

## Agent: セットアップ参照

- [Standard Agent Setup](references/standard-agent-setup.md) - カスタマー管理データ、検索、AI Services リソースを使った標準的な capability-host セットアップ。

## Agent: Project コンテキストの解決

agent skill は、**まだ把握していない設定値が必要なときにのみ**このステップを実行してください。値 (agent root、環境、project エンドポイント、agent 名など) が既にユーザーのメッセージや同セッション内の前の skill から判明している場合は、その値の解決をスキップしてください。

### Step 1: Agent Root の検出

ワークスペース内で `agent-metadata.yaml` または `agent-metadata.<env>.yaml` を含む `.foundry/` フォルダーを検索します。

- **1 件一致** → その agent root を使用。
- **複数一致** → ユーザーに対象の agent フォルダーを選択させる。
- **一致なし** → create/deploy ワークフローではセットアップ中に新しい `.foundry/` フォルダーをシードする。それ以外のワークフローでは停止し、どの agent ソースフォルダーを初期化するかをユーザーに確認する。

agent root を選択した後は、すべてのローカル `.foundry` キャッシュ調査、ソース調査、evaluator の提案、dataset の提案、prompt 最適化のコンテキストを、そのフォルダー内のみで行ってください。ユーザーが明示的に root を切り替えない限り、兄弟の agent フォルダーをスキャンしては**いけません**。

### Step 2: メタデータファイルの選択と環境の解決

選択した agent root 内で、次の順序でメタデータファイルを選択します:

1. ユーザーまたはワークフローによって明示的に指定されたメタデータのファイル名 / パス
2. 明示的な環境が既にわかっており、`.foundry/agent-metadata.<env>.yaml` が存在する場合、そのファイル
3. `.foundry/agent-metadata.yaml`
4. 複数のメタデータファイルが残っていて上記のルールで選択できない場合は、ユーザーに選択を求める

選択したメタデータファイルを読み込み、次の順序で環境を解決します:

1. ユーザーが明示的に指定した環境
2. 選択したメタデータファイルがちょうど 1 つの環境を定義している場合は、それを使用
3. 同セッションの早い段階で既に選択された環境
4. メタデータ内の `defaultEnvironment`

選択したメタデータファイルに依然として複数の環境が含まれ、上記のルールで選択できない場合は、ユーザーに選択を求めてください。選択した agent root、メタデータファイル、環境は、すべてのワークフローサマリーで可視に保ってください。

選択した環境が古い `testSuites[]` メタデータを公開しており `evaluationSuites[]` が存在しない場合、このセッションでは `testSuites[]` をソースとして扱い、各エントリをメモリ内で `evaluationSuites[]` の形式に正規化してから続行してください。さらに古く、レガシーな `testCases[]` のみが公開されている場合も、そのリストを同様に正規化してください。dataset と evaluator のフィールドを保持し、既存の `tags` をそのまま保ち、`tags.tier` が存在しない場合に限りレガシーの `priority` を `tags.tier` にマップしてください: `P0` -> `smoke`、`P1` -> `regression`、`P2` -> `coverage`。

### Step 3: 共通設定の解決

選択したメタデータファイル内の選択した環境をプライマリソースとして使用します:

| メタデータフィールド | 解決される値 | 使用先 |
|----------------|-------------|---------|
| `environments.<env>.projectEndpoint` | Project エンドポイント | deploy, invoke, observe, trace, troubleshoot |
| `environments.<env>.agentName` | Agent 名 | invoke, observe, trace, troubleshoot |
| `environments.<env>.azureContainerRegistry` | ACR レジストリ名 / イメージ URL プレフィックス | deploy |
| `environments.<env>.evaluationSuites[]` | Dataset + evaluator + タグのバンドル | observe, eval-datasets |

### Step 4: 不足メタデータのブートストラップ (Create/Deploy のみ)

create/deploy が新しい `.foundry` ワークスペースを初期化中で、メタデータフィールドがまだ不足している場合は、プロジェクトルートに `azure.yaml` が存在するか確認してください。存在する場合は `azd env get-values` を実行し、デフォルトでは `agent-metadata.yaml`、ワークフローが明示的に別の環境固有のファイルを対象としている場合は `agent-metadata.<env>.yaml` をシードしてください。

メタデータの書き込み (deploy、自動セットアップ、dataset リフレッシュ、trace から dataset への更新) では、選択したメタデータファイルに `evaluationSuites[]` のみを永続化してください。選択したファイルが推奨される単一環境ファイルの場合は、その 1 つの環境ブロックのみを書き換えてください。選択したファイルがレガシーの複数環境ファイルの場合は、選択した環境ブロックのみを書き換えてください。兄弟のメタデータファイル間で環境を自動的にコピー / マージしては**いけません**。選択した環境がまだ古い `testSuites[]` やレガシーの `testCases[]` を使っている場合は、`evaluationSuites[]` に書き換え、書き換えたエントリから移行済みの `priority` フィールドを削除してください。

| azd 変数 | シード先 |
|-------------|-------|
| `AZURE_AI_PROJECT_ENDPOINT` または `AZURE_AIPROJECT_ENDPOINT` | `environments.<env>.projectEndpoint` |
| `AZURE_CONTAINER_REGISTRY_NAME` または `AZURE_CONTAINER_REGISTRY_ENDPOINT` | `environments.<env>.azureContainerRegistry` |
| `AZURE_SUBSCRIPTION_ID` | trace / troubleshoot のルックアップ用 Azure サブスクリプション |

### Step 5: 不足値の収集

`ask_user` または `askQuestions` ツールは、ユーザーのメッセージ、セッションコンテキスト、メタデータ、azd ブートストラップから**解決できなかった値に対してのみ**使用してください。skill が必要とする可能性のある一般的な値:

- **Agent root** — `.foundry/agent-metadata*.yaml` を含む対象フォルダー
- **メタデータファイル** — ローカル / 開発用の `agent-metadata.yaml`、または `agent-metadata.prod.yaml` のような明示的なサイドカー
- **環境** — `dev`、`prod`、またはメタデータ内のその他の環境キー
- **Project エンドポイント** — AI Foundry project エンドポイント URL
- **Agent 名** — 対象 agent の名前

> 💡 **ヒント:** ユーザーが agent パス、環境、project エンドポイント、agent 名を既に提供している場合は、直接抽出してください。再度尋ねないでください。

## Agent: Agent タイプ

すべての agent skill は 2 つの agent タイプをサポートします:

| タイプ | Kind | 説明 |
|------|------|-------------|
| **Prompt** | `"prompt"` | モデルデプロイをバックエンドとする LLM ベースの agent |
| **Hosted** | `"hosted"` | カスタムコードを実行するコンテナベースの agent |

必要に応じて、`agent_get` MCP ツールを使って agent のタイプを判別してください。

## ツール使用の規約

- ユーザーから情報を収集する際は `ask_user` または `askQuestions` ツールを使用してください
- 長時間実行または独立したサブタスク (環境変数のスキャン、ステータスポーリング、Dockerfile の生成など) を委任するには `task` または `runSubagent` ツールを使用してください
- 直接 CLI コマンドを実行するよりも、利用可能な場合は Azure MCP ツールを優先してください
- CLI コマンドの構文を埋め込むのではなく、公式の Microsoft ドキュメント URL を参照してください

## 追加リソース

- [Foundry Hosted Agents](https://learn.microsoft.com/azure/ai-foundry/agents/concepts/hosted-agents?view=foundry)
- [Foundry Agent Runtime Components](https://learn.microsoft.com/azure/ai-foundry/agents/concepts/runtime-components?view=foundry)

## SDK クイックリファレンス

- [Python](references/sdk/foundry-sdk-py.md)
