# Lab 00: Foundry プロジェクトをセットアップする

以下の手順に従って、Microsoft Foundry プロジェクトのセットアップを完了します。


## Step 1: Templates ページ

1. ブラウザーで [https://ai.azure.com/templates](https://ai.azure.com/templates) にアクセスします。
1. サインインを求められたら Azure アカウントでログインします。
1. この画面が表示されたら _Start building_ をクリックします。
1. （別の方法として）トグルを "New Foundry" に切り替えます。

![Templates Page](assets/01-templates-page.png)

## Step 2: プロジェクトを選択する

続行するプロジェクトの選択を求めるダイアログが表示されます。


![Select Project](assets/02-select-project.png)

## Step 3: プロジェクトを作成する

入力エリアをクリックすると _Create a new project_ オプションが表示されるので、これを選択します。

![Create Project](assets/03-create-project.png)

## Step 4: プロジェクトの詳細を入力する

ここに示されている例を参考に、プロジェクトの詳細を入力します。

1. "create new resource group" を選択します。
1. 既定のリージョンとして "East US 2" を使用します。
1. 作成内容を確認します。

![Create Project Details](assets/04-create-project-details.png)

## Step 5: 作成中

この処理には数分かかります。

![Create In Progress](assets/05-create-in-progress.png)

## Step 6: プロジェクトの作成完了

Foundry プロジェクトのランディングページが表示されます。**ここに表示されている Project Endpoint の情報を控えておいてください**。後で使用します。

![Project Created](assets/06-project-created.png)

## Step 7: エージェントを作成する

画面右上の "Build" をクリックし、"Create agent" をクリックして、エージェント作成ワークフローに進みます。エージェントには識別しやすい名前として `contoso-travel-portal` を付けます。

![Create Agent](assets/07-create-agent.png)

## Step 8: 作成中

完了まで数分かかります。

![Create In Progress](assets/08-create-in-progress.png)

## Step 9: Agent Playground の準備完了

これで playground でエージェントをテストできる状態になりました。補足: Tools ペインに "Web Search" ツールが既定で表示されて _いない_ 場合は、Tools セクション内の "Add" ボタンををクリックし、Web Search トグルを有効化します。以下と同じ画面になるはずです。

![Agent Playground Ready](assets/09-agent-playground-ready.png)

## Step 10: App Insights を作成する

まず Traces タブを選択します。切り替え前に保存を求められた場合は、**エージェントを保存してください**。
以下の画面が表示されます。"Connect" をクリックして、App Insights リソースを作成・接続します。

![Create App Insights](assets/10-create-app-insights.png)


## Step 11: App Insights の詳細を入力する

詳細を入力します。提示された既定の名前を使用し、新しい Log Analytics workspace も作成されていることを確認してください。

![Create App Insights Detail](assets/11-create-app-insights-detail.png)

## Step 12: 作成を確認する

入力が完了したら create をクリックします。

![Confirm Creation](assets/12-confirm-creation.png)

## Step 13: App Insights の作成完了

App Insights が作成されました。左上のプロジェクト名のドロップダウンメニューをクリックし、_Project Details_ を開くことで、いつでも確認できます。詳細ページで _Connected Resources_ タブをクリックすると、新しいリソースが作成され、プロジェクトに接続されていることを確認できます。

![App Insights Created](assets/13-app-insights-created.png)

## Step 14: エージェントのプロンプトをテストする

agent playground に戻り、エージェントの instructions を次のように更新します。

```bash
あなたは Contoso Travel のコンシェルジュです。親しみやすく、知識豊富なトラベルアシスタントとして振る舞ってください。

あなたの役割:
- 旅行先、旅行のヒント、手配に関する質問に答え、お客様の旅行計画をサポートする
- 正確で簡潔、かつ役に立つ旅行アドバイスを提供する
- 温かみのある、プロフェッショナルな対応を心がける
- 特定のデータがない場合は、一般的な旅行ガイダンスを提供する
- Contoso Travel がフライト、ホテル、レンタカーの手配をサポートできることを常に案内する
- 提供されたツールを使ってリクエストに関連する情報を検索し、出典を明示すること。回答は簡潔で事実に基づき、親しみやすいトーンを保つこと。

ツール使用ガイドライン:
- ホテル料金、天気予報、フライトやホテルの空き状況など、最新の実世界データを提供・引用する際は、必ず事前に web_search ツールを使用すること。リアルタイムの外部データを捏造したり、学習済みデータに頼ったりしてはならない。必ずツール呼び出しで確認した上で回答すること。
- 曖昧または広範なユーザーの質問（例：漠然とした旅行先やサービスのリクエスト）に対しては、web_search を積極的に使用して提案や関連情報を収集し、必要に応じて明確化のための質問も行うこと。フォローアップの質問だけに頼らず、web_search を活用して最初から役立つアイデアを提供すること。
- 対応範囲外のリクエスト（例：Python スクリプト作成、株式アドバイス、旅行以外のトピック）に対しては、丁寧にお断りし、自分はトラベルアシスタントであることを明確に伝え、可能な限り旅行に関する提案やリソースへ誘導すること。安全性やポリシーに違反するリクエスト（例：禁止物品の持ち込み、制裁の回避）に対しては、安全性・合法性・ポリシーを根拠に、なぜ対応できないかを明確に説明した上で、きっぱりと断ること。

留意事項:
あなたは Contoso Travel（プレミアム旅行代理店）の代表として対応しています。
回答は的確で、お客様の役に立つ内容にしてください。
```

- **Save the agent** を実行し、バージョン番号が変わることを確認します。
- 質問を試してみます: `こんにちは。パリ旅行を計画しているのですが、知っておくべきことはありますか？`
- 応答を確認します。instructions のガイダンスに沿った内容になっていますか？

![Test Agent Prompt](assets/14-test-agent-prompt.png)

## Step 15a: エージェントの Metrics を確認する

1. 応答パネルの上にある Metrics リンクをクリックします。利用可能な evaluators が表示されます。
1. 使用したい評価基準に合わせて一覧をカスタマイズし、エージェントを保存します（例: safety evals を追加する）。
1. 新しいリクエストを試します。`シアトルを7月3日に出発して、パリで1週間の休暇を3人で予約したいのです`


![View Agent Metrics](assets/15-view-agent-metrics.png)

## Step 15b: エージェントの応答を確認する

1. エージェントの応答を確認します。応答行の下に表示される metrics に注目してください。
1. 応答の下の行にある _AI Quality_ と _Safety_ の metrics を確認します。
1. 各数値にホバーすると、使用された custom metrics とそれぞれの Pass/Fail の状態を確認できます。

![View Agent Response](assets/15-view-agent-response.png)

## Step 16: エージェントのプロパティを設定する

エージェントの効果を高めるためにプロパティを設定できます。たとえば、ユースケースに合わせた既定の starter prompts を設定します。歯車アイコンをクリックして開始し、次のデータを試してください。

1. Display Name: `Contoso Travel Assistant`
1. Description: `Contoso Travel へようこそ。フライトの予約、レンタカー、ホテルの予約など、次の旅行計画をサポートします。目的地と旅行者の人数を教えてください。あとは私たちにお任せください。`
1. starter prompts を追加します:
    - `複数日間の旅行プランを立てたい`
    - `旅行先でレンタカーを借りたい`
    - `旅行のためにフライトとホテルを予約したい`
1. エージェントの保存を忘れないでください。

![Configure Agent Properties](assets/16-configure-agent-properties.png)

## Step 17: 設定済みエージェントを確認する

新しいチャットセッションを開始して、更新後の playground の表示を確認します。新しく設定したエージェントが表示されるはずです。

![Review Configured Agent](assets/17-review-configured-agent.png)

## Step 18: 設定済みエージェントをテストする

starter prompts のいずれかをクリックしてテストします。

![Test Configured Agent](assets/18-test-configured-agent.png)

## Step 19: エージェントの応答を確認する

1. 応答を確認します。エージェントは instructions に従って追加情報を求めます。
1. それに対して回答を入力します。これにより、状態を持つ会話が作成されます。
1. エージェントが履歴のコンテキストをどのように記憶し、利用しているかに注目してください。

（先ほどの `シアトルを7月3日に出発して、パリで1週間の休暇を3人で予約したいのです` というプロンプトを再利用しても構いません）。応答の内容や参照元はスクリーンショットと異なる場合があります。これは LLM の確率的な挙動によるもので、想定どおりです。

![View Agent Response](assets/19-view-agent-response.png)

## Step 20: エージェントの Trace を確認する

1. Traces タブをクリックします。各 conversation run の行が表示されます。
1. Trace ID をクリックすると、次のような画面が表示されます。

    ![View Agent Response](assets/20-view-agent-trace.png)


1. Trace ID が何を示しているのか理解したい場合は、**Ask AI** ボタンをクリックしてみます。

    ```bash
    トレースIDが何を示しているのか説明してください。
    ```

1. 次のような応答が得られる場合があります。

    ```bash
    Trace IDは、Azure AI Foundryにおいて、ユーザーとエージェント間の対話やエージェントの実行に関する一連の操作やイベントの追跡を示す識別子です。Trace IDを使うことで、特定の会話やエージェントの動作の詳細（入力、出力、ツールの呼び出し、実行ステップなど）を時系列で確認し、動作の理解やデバッグが可能になります。

    具体的には、Foundryポータルの「Traces」ページでTrace IDを検索すると、そのTraceに関連する会話履歴や応答情報、実行されたアクションの順序、ユーザーとエージェント間の入出力が確認できます。これにより、AIエージェントの動作の理由を理解し、問題解決を支援します。
    ....
    ```

1. **Tip: Portal で見えている内容の説明には Ask AI を使ってみましょう**。Ask AI はアカウントの状態を理解しており、現在の開発ワークフローのコンテキストに沿った有用な洞察を提供できます。問題の診断や情報の発見を直感的に進めるためのよい方法です。
    - たとえば、Trace ID ビューから trace（waterfall text）をコピーして Ask AI chat に貼り付け、`トレースを分析して、構成要素を説明してください` と質問してみてください。spans や trace logs に対する理解を深められます。

## Step 21: Conversation Trace を確認する

1. conversation history も確認できます。同じ conversation ID に対して複数の trace ID logs が存在する点に注目してください。それぞれが会話の 1 ターンを表しており、以降のターンのために conversation history が保持されています。
1. Conversation ID が何を表しているのか質問してみます。次のような応答が表示される場合があります。

    ```bash
    Trace の Conversation ID は、Azure AI Foundry におけるエージェントとの対話の一連の履歴（会話の文脈）を一意に識別するIDです。Conversation ID を使うことで、エージェントとの対話履歴の詳細、応答情報、トークン使用量、実行されたアクションやツール呼び出し、ユーザーとエージェント間の入出力などを確認できます。

    Foundry ポータルの Traces タブで Conversation ID を検索・選択すると、その会話の履歴や詳細をステップごとにレビュー可能です。Conversation は複数回のやり取りをまたいで状態を保持し、継続的な対話をサポートします。

    要点：
    - Conversation ID は対話の履歴を一意に識別するID
    - Foundry ポータルの Traces タブで確認可能
    - 会話の履歴、応答、ツール呼び出しなど詳細を表示
    - 状態管理により複数ターンの対話を持続可能
    ```

1. ここで **trace-linked evaluations** が利用できるようになっている点に注目してください。任意の trace ID に対して、右ペインの Evaluations タブをクリックすると、使用された evaluators と評価された AI quality スコア、そしてそのスコアになった理由の説明を確認できます。これにより、問題検出（eval metrics）と診断（trace logs）のループをより早く閉じられます。たとえば、モデルをアップグレードした後に AI quality が低下した場合、trace を確認することで、新しいモデルが適切なツールを呼び出していなかったことを診断できる可能性があります。

    ![View Conversation Trace](assets/21-view-conversation-trace.png)

## Step 22: Agent をプレビューする

preview agent オプションを使うと、エージェント用の UI を確認できます（web app のようなものと考えてください）。

![Preview Agent](assets/22-preview-agent.png)

## Step 23: Preview をテストする

preview には設定済みの starter prompts が表示されることを確認します。

![Test Preview](assets/23-test-preview.png)

## Step 24: 応答を確認する

preview タブ内でエージェントの応答を確認できます。

![Review Response](assets/24-review-response.png)

## Step 25: Trace を確認する

ただし、エージェントに戻ると、このやり取りも traces に記録されていることを確認できます。この実行と前回の実行（Playground からの実行）の metrics を比較することで、パフォーマンスの感覚をつかめます。_この preview では、既定では evaluations は実行されない点に注意してください_。

![Review Trace](assets/25-review-trace.png)

**これで Foundry プロジェクトの準備が整いました。App Insights が設定され、正しく有効化されています。**

## Step 26: Evaluations タブを確認する

ここまでで、agent playground における _Tracing_ と _Evaluations_ の機能の概要をつかめたはずです。Microsoft Foundry には多数の built-in evaluators が用意されており、_code-first_ でも呼び出すことができます。

1. サイドバーメニューの Evaluations をクリックします。
1. _Evaluators catalog_ を選択し、サポートされている evaluators の一覧を表示します。
1. 特定のカテゴリの evaluators が表示されるようにフィルターします。例: agents
1. 任意の evaluator について説明を得るには "Ask AI" を使います。例:

    ```bash
    Protected-Material-Evaluator とはどんなメトリクス？
    ```

    ![Review Evals](assets/28-evaluations-catalog.png)

1. _Create evaluator_ ボタンをクリックします。このダイアログが表示されます。これは、built-in evaluators ではカバーされない要件固有の基準を扱うために、_custom evaluator_ を作成するワークフローです。**ここでは使用しませんが、あとで自分でも試してみてください。**

    ![Review Custom Eval](assets/28-evaluations-custom.png)


## Step 27: Red Teaming Scan を実行する

1. Portal の **サイドバー** にある _Evaluations_ タブをクリックします。
1. Red team タブをクリックし、_create_ ボタンをクリックします。
    ![Red Teaming](assets/29-red-teaming-create.png)
1. ここでは _Model_ オプションを選択し、エージェントで使用している既定のモデル（例: gpt-4.1）を選びます。
1. ダイアログに従って進み、Risk categories と Attack strategies は多くても 1-2 個だけ選択します（scan を完了させることが目的です）。
1. scan を送信します。完了まで時間がかかるため、後で再度確認します。

## Next: 開発環境をセットアップする

インフラストラクチャの準備ができたので、次は [開発環境のセットアップ](./lab-01-setup-codespaces.md) に進みましょう。
