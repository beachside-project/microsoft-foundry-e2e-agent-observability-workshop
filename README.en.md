# Workshop: "Observe, Optimize & Protect Your AI Agents In Microsoft Foundry"

## Session Description

**Duration:** 75 minutes

Want to build trustworthy AI agents? The hard part lies NOT in making them work the first time, but in **keeping them working continuously** over the lifetime of the application - even as models get updated, prompts get refined, retrieval pipelines drift, and real-world use uncovers edge cases. To do this, we need a unified platform that provides end-to-end observability - 
with rich developer tools that take us seamlessly from _detecting_ AI quality issues to _diagnosing_ them, and _optimizing_ solutions for performance in an iterative fashion.

In this workshop, we'll get hands-on experience with the Microsoft Foundry observabilty platform by exploring one of two available paths:

1. **Using Foundry SDK** - use a code-first approach to learn how you can build, evaluate, trace, and red-team your AI agent solution.
1. **Using Foundry Skills** - use a coding-agent approach to orchestrate a full eval-driven optimization cycle from a base AI agent.

The first option is more traditional, giving you a sense for the concepts, tools and workflows involved. The second option offers an early preview into an enhanced developer experience where the coding agent accelerates the "evaluate-optimize" loop to take actions (like creating datasets, running batch evaluations, comparing versions, optimizing prompts or instructions etc.) based on observed results rather than guesswork. Along the way, you'll build your intuition for these tools by looking at the agent reasoning process and guiding its decision-making when prompted.

## Application Scenario

We'll use a consistent scenario across all labs, allowing us to think about features and outcomes in the context of a real-world use case. 

**Contoso Travel** is a fictitious mid-size travel agency whose team of human advisors can no longer keep up with the volume of customer inquiries for booking travel. They need an AI-powered travel assistant — a system of intelligent agents that can search relevant inventory (e.g., hotels, flights, car rentals) to make personalized recommendations, and deliver customized itimeraries across multi-turn conversations.

## Workshop Overview

In this workshop, we'll trace the AI developer journey from _planning_ to _prototyping_ to _production_. By the end of the workshop, you should be able to:

1. _Observe_ agentic execution with OpenTelemetry traces
1. _Optimize_ agentic performance assisted by Foundry skills
1. _Protect_ agents from attacks using Red Teaming scans
1. _Deploy_ agents, then monitor & analyze insights with Ask AI 

We'll achieve this using the Microsoft Foundry platform tools and workflows. By the end of this workshop you should be able to:

1. _Setup_ a single prompt agent with no code - using the [Foundry portal](https://learn.microsoft.com/en-us/azure/foundry/how-to/navigate-from-classic?view=foundry#navigate-the-portal).
1. _Build_ a multi-agent solution code-first - using [the Foundry SDK](https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/sdk-overview?view=foundry&pivots=programming-language-python)
1. _Observe & Optimize_ an AI agent with coding agents - using [Foundry skills](https://github.com/microsoft/GitHub-Copilot-for-Azure/tree/main/plugin/skills/microsoft-foundry)

<br/>

## Workshop Outline

### 1. Getting Started

This workshop has two paths to choose from:
- **Base Path**: Complete Steps 1 & 2 to setup your infra & dev environment.
- **Path A**: Do Step 3. Uses _Foundry Skills_ to automate the eval-optimize loop.
- **Path B**: Do Step 4. Uses _Foundry SDK_ for traditional coding (manual).

Completing the end-to-end journey with _either_ path can take 60 minutes or more. Pick one to complete - then try the second if time permits.

| Step | Instructions | Tool · Outcome |
|:---|:---|:---|
| 1. | [Infrastructure Setup](./labs/notebooks/0-setup/lab-00-setup-project.md) | Foundry Portal · Setup Foundry project |
| 2. | [Dev Environment Setup](./labs/notebooks/0-setup/lab-01-setup-codespaces.md) | GitHub Codespaces · Setup local .env |
| 3. | [Activate Observe Skill](./labs/notebooks/1-prompt-agents/README.skills.md)| Foundry Skills · Run eval-optimize loop  |
| 4. | [Build It Step-By-Step](./labs/notebooks/1-prompt-agents/README.sdk.md)| Foundry SDK · Go plan-production manually |
| | | |

### 2. Next Steps
The current workshop (v1) is setup for use with _prompt_ agents. The next version (v2) will expand this to showcase _hosted agents_ that use custom code and runtimes with a containerized environment for maximum developer control. Fork & watch the repo for updates in May/June 2026.

**The key takeaway** is that the Microsoft Foundry Observability platform will work effectively with _any_ agent (build using any programming language or framework) provided it supports OpenTelemetry-compliant traces and Responses API compliant endpoints.


### 3. Related Resources 

The Microsoft _Foundry Control Plane_ provides tools and features to support _security, compliance, fleet management and observability_ for your agentic AI solutions - along with a unified role-aware management interface accessed through the "Operate" tab of the Microsoft Foundry portal. 

![FCP](./labs/assets/foundry-control-plane.png)

In this workshop, we put the spotlight on Observability - but we encourage you to explore the resources below to dive deeper into the various components involved.

| Resource | Description |
|----------|-------------|
| [Foundry Control Plane](https://learn.microsoft.com/en-us/azure/foundry/control-plane/overview?view=foundry) | Enterprise-wide visibility, governance, and control of AI agents, models & tools |
| [Observability](https://learn.microsoft.com/en-us/azure/foundry/concepts/observability?view=foundry) | Monitor, understand, and troubleshoot your AI agents |
| [Agent Tracing](https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept?view=foundry) | OpenTelemetry (OTel) protocols & semantic conventions support in Foundry |
| [Evaluations](https://learn.microsoft.com/en-us/azure/foundry/concepts/built-in-evaluators?view=foundry) | Built-in and custom evaluators for quality, safety & agentic performance |
| [Red Teaming](https://learn.microsoft.com/en-us/azure/foundry/concepts/ai-red-teaming-agent?view=foundry) | Adversarial testing for targeted risk categories & attack strategies |
| | |


## Workshop Branches

This workshop is intended to be an evergreen resource that will evolve to reflect the latest Microsoft Foundry platform updates. For convenience, we will maintain _branches_ for prior workshop versions that were delivered at specific events.

| Date | Branch | Description |
|:---|:---|:---|
| Mar 27 2026 | [2026-03-mvp-summit](https://github.com/Azure-Samples/microsoft-foundry-e2e-agent-observability-workshop/tree/2026-03-mvp-summit) | Prompt agent with `observe` skill |
| Apr 04 2026 | [2026-04-aie-europe](https://github.com/Azure-Samples/microsoft-foundry-e2e-agent-observability-workshop/tree/2026-04-aie-europe) | Prompt agent with `observe` skill |
| Apr 18 2026 | [2026-04-msft-tw](https://github.com/Azure-Samples/microsoft-foundry-e2e-agent-observability-workshop/tree/2026-04-aie-europe) | Prompt agent with `observe` skill |
| | | |


## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit [Contributor License Agreements](https://cla.opensource.microsoft.com).

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.