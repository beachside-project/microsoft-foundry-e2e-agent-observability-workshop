# Lab 01: 開発環境のセットアップ

## 1. GitHub Codespaces を起動する

1. サンドボックスを用意するため、[リポジトリを Fork](https://github.com/Azure-Samples/microsoft-foundry-e2e-agent-observability-workshop/fork) して自分のプロファイルに取り込みます。
1. Fork したリポジトリで GitHub Codespace を起動します。
    - リポジトリ(ブラウザ)の青い Code ボタンをクリック
    - Codespaces タブを選択
    - Create Codespace をクリック
1. 新しいブラウザタブで VS Code 環境が開きます。
    - IDE が完全に読み込まれるまで待ちます
    - ターミナルがアクティブになるのを確認します
    - 完了まで数分かかる場合があります
1. おめでとうございます。開発環境の準備が整いました。

## 2. Setup-Env スクリプトを実行する

_お使いの Azure が複数のテナントに属している場合は、最初に以下を実行してください_

```bash
# 既定のテナントを設定 (ログインに使用)
az login --tenant <TENANT_ID>

# 既定のサブスクリプションを設定
az account set --subscription <SUBSCRIPTION_NAME_OR_ID>

# 以下のコマンドで、今回利用するサブスクリプションにログインされているかを確認
az account show
```

_また、VS Code の Foundry Toolkit for VS Code と Azure 拡張機能が正しいテナントを使用しているかも確認してください_。

1. Azure 拡張機能のアイコンをクリック - Accounts & Tenants タブを見て、1 つだけがチェックされていることを確認します。
1. Foundry Toolkit for VS Code のアイコンをクリック - My Resources を見て、Default の Foundry Project に、ハンズオンで作成した Foundry project が設定されていることを確認します。


1. VS Code のターミナルで、次のコマンドを実行します:

    ```bash
    ./labs/notebooks-jp/setup-env.sh
    ```

1. 以下のように Azure へのログインを求められます。この手順を完了し、スクリプトが最後まで実行されるのを待ちます。
    ![Run Env Script](assets/26-run-env-script.png)

1. 成功メッセージが表示され、`labs/notebooks` フォルダーに適切な変数が設定された `.env` ファイルが作成されているはずです。
    ![Dev Env Ready](assets/27-dev-env-ready.png)
1. おめでとうございます。ローカル環境変数の設定が完了しました。

## 3. 進む道を選ぶ

**※ 今回のハンズオンでは、[README.sdk.md](./../1-prompt-agents/README.sdk.md) を選びます。**

| Option | 説明 |
| :--- | :--- |
| [README.sdk.md](./../1-prompt-agents/README.sdk.md) | **Microsoft Foundry SDK を使用し、コードを 1 ステップずつ追っていく従来のコードファーストのパス** |
| [README.skills.md](./../1-prompt-agents/README.skills.md) | "observe" Foundry Skills を使って _observe-optimize_ ループを駆動する、Early Preview のコーディングエージェント パス |

1 つのパスを完了したら、このステップに戻ってもう一方を試すこともできます。今後コーディングエージェントとスキルが開発ワークフローをどのように加速させるかを早めに体感するために、まず Foundry Skills のパスから試すことをお勧めします。
