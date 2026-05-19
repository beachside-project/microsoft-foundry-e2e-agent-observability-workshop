# Foundry Skills を使った Contoso Travel（プロンプトエージェント）の観察と最適化

[microsoft-foundry スキル](https://github.com/microsoft/GitHub-Copilot-for-Azure/blob/main/plugin/skills/microsoft-foundry/SKILL.md) は、GitHub Copilot などのコーディングエージェントが Microsoft Foundry AI エージェントのライフサイクル全体を管理する方法を学ぶための包括的なガイドです。このスキルは、この devcontainer に AI Toolkit 拡張機能と一緒にインストールされる GitHub Copilot for Azure 拡張機能の一部です。

## 1. Sub-skillsの理解

microsoft-foundry スキルは、Microsoft Foundry でホストされている AI エージェントのデプロイ・評価・呼び出し・トラブルシューティングなど、主要な機能を網羅した構造化ワークフロー（_sub-skills_）を提供します。

現在利用可能なサブスキルの一覧を以下に示します。なお、これらはアーリープレビュー段階であり、不具合や破壊的変更が生じる可能性があります。**今回は「observe」スキルに注目します — フィードバックをお待ちしています。**


| ワークフロー | 機能 |
|:---|:---|
| create | 新しいエージェントプロジェクトをスキャフォールドする（Python/C#、Microsoft Agent Framework や LangGraph などのフレームワーク対応）|
| deploy | コードをコンテナ化し、Azure Container Registry にプッシュし、エージェントのデプロイを作成・起動・停止する |
| invoke | エージェントにメッセージを送信し、シングルまたはマルチターンの会話を実行する |
| observe 🌟 | バッチ評価によるエージェント品質の評価、プロンプトの最適化、バージョン間の比較を行う |
| trace | App Insights でトレースを照会し、レイテンシや障害を分析する |
| troubleshoot | コンテナログを確認し、デプロイ障害を診断する |
| eval-datasets | 本番トレースから評価データセットを収集し、回帰を追跡する |
| models/deploy-model | リージョンをまたいだ容量探索により AI モデルをデプロイする |
| project/create | 新しい Azure AI Foundry プロジェクトをプロビジョニングする |
| rbac | 権限とロールの割り当てを管理する |
| quota | キャパシティ／クォータを確認・管理する |
| | |


## 2. AI Toolkit でデフォルトプロジェクトを設定する

1. GitHub Codespaces の左サイドバーにある AI Toolkit アイコンをクリックする
1. **My Resources** タブで「Set default」オプションをクリックし、先ほど作成した Foundry プロジェクトを設定する
1. まだサインインしていない場合は、Azure アカウントへのログインを求められる場合がある

_設定が完了すると、Microsoft Foundry ポータルに移動しなくても、使用しているモデルやバージョン付きで作成されたエージェントなど、Microsoft Foundry のアセットを VS Code 上で直接確認できるようになります。_

## 3. Foundry Skill のインストール確認

1. `Control + Shift + P` でコマンドパレットを開く
1. 「Chat: Configure Skill」を検索し、表示されたリストの下部までスクロールする
1. `microsoft-foundry` が一覧に表示されていることを確認する — クリックするとインストール済みサブスキルの詳細を確認できる

必要に応じて:

1. 「AI Toolkit: Install Foundry Skill」を検索して選択し、最新のスキルがインストールされていることを確認する
1. 以下のような確認メッセージが表示されます — 前の設定手順で確認したのと同じファイルへのリンクです:
    ```
    AI Toolkit: Foundry skill 'microsoft-foundry' installed to '~/.agents/skills/microsoft-foundry/'.
    ```

_Foundry Skills の機能がコーディングエージェントで利用可能になります_


## 4. （オプション）Sub-Skills を探索する

サブスキルを有効化するには、コーディングエージェントとの会話の中で「エントリーポイント」として認識されるキーワードをある程度把握しておく必要があります。ここでは `observe` を例に、具体的な内容を確認してみましょう。

1. コマンドパレットを開く（Control + Shift + P）
1. 「Chat: Configure Skills」を検索する
1. microsoft-foundry オプションを選択してクリックする
1. エディターに `SKILL.md` ファイルが開く
1. マークダウンプレビューのための _Preview_ アイコンをクリックする
1. テーブルの中から「observe」ツールを探し、リンクされたマークダウンファイルをクリックする

<details>

<summary> <b>クリックして詳細を展開する</b> </summary>

上記の最後のステップで、コーディングエージェントが参照する指示書が開きます。次のような内容になっているはずです:

![observe](./../0-setup/assets/30-observability-loop.png)


さらにスクロールすると「Entry Points」セクションが表示されます。ここでは、_observe_ スキルにマッピングされるユーザーの意図を示すキーワードやプロンプトの例が確認できます。

![observe](./../0-setup/assets/31-entry-points.png)

さらにスクロールすると、コーディングエージェントが次に何をすべきかの詳細なガイダンスが表示されます。このスキルでは、コーディングエージェントがリポジトリの状態（環境変数を含む）を確認して方向性を把握し、評価のベストプラクティスに沿ってワークフローを開始するよう設計されています。

![observe](./../0-setup/assets/32-loop-overview.png)

</details>

## 5. GitHub Copilot Chat を起動する

いよいよスキルを試す時です。GitHub Copilot Chat が必要です。関連するモデルを選択できる無料プランが利用可能なはずです。なお、モデルの選択によってはプレミアムリクエストを消費する場合があります。

1. GitHub Copilot Chat ボタンをクリックする — サイドパネルが開きます
1. MCP サーバーの起動を促されたら、_Foundry MCP_ サーバーが有効になっていることを確認する
    - コマンドパレットを開く（Control + Shift + P）
    - 「MCP: List Servers」を検索する
    - Foundry MCP を探し、必要に応じてサーバーを起動する
1. Copilot Chat のテキスト入力欄の下にあるツールアイコンをクリックすると、現在有効な MCP サーバーとコーディングエージェントが利用できるツールを確認・管理できる


## 6. 「observe」スキルを試す

関連するタスクをコーディングエージェントに指示して、observe スキルをトリガーしてみましょう。

Copilot Chat ウィンドウで次のプロンプトを入力してください:

```bash
Evaluate my agent at <endpoint> using the observe skill
```

`<endpoint>` は Foundry プロジェクトのエンドポイントリンクに置き換えてください。エンドポイントとスキル名を明示するのは、特定のスキルを確実にトリガーするためのヒントを与える方法です。ただし、コーディングエージェントの動作は非決定論的であるため、foundry-skills の利用には現時点で試行錯誤が必要な場合があります。

## 7. フィードバックの収集と共有

オブザーバビリティループを開始すると、エージェントはエージェント実装を改善するために取れるアクションを次々と提案します。_直感に従ってさまざまなオプションを試してみてください。_

1. 進める中で入力したプロンプトを記録してください。何が起こったか、遭遇した問題などを記録し、共有してください！
1. Foundry ポータルで「Ask AI」を使って結果（プロジェクトの状態）を説明させたり、Copilot Chat に追加のコンテキストを提供させたりして、理解を深めてみましょう。

試せること（例）:

1. 評価データセットを作成する
1. エージェントエンドポイントに対してバッチ評価を実行する
1. カスタム評価者を作成する
1. プロンプトを最適化して新しいエージェントバージョンを作成する
1. バッチ評価の結果を基に2つのバージョンを比較する
