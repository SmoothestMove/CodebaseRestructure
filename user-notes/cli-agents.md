# CLI Agents (Umbrella Guide)

This guide summarizes common AI and coding CLI tools with high-level Description, Usage, Installation, and Configuration. It is not specific to any single codebase.

## General Patterns for AI CLI Tools

#### Description
- CLIs provide fast access to model APIs for chat/generation, file operations, and automations.

#### Usage
- Common verbs: `init`, `chat`, `generate/run`, `models list`, `files upload`, `sessions`.
- Prefer `--json` for scripting and specify `--model` explicitly.
- Feed input via stdin or `--input`; pipe outputs into tools like `jq`.

#### Prerequisites
- API keys for the vendors you plan to invoke (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, etc.) stored in env vars or a secrets manager.
- Network connectivity and permissions to call the respective endpoints (`https://api.openai.com`, `https://cloud.google.com/vertex-ai`, etc.).
- Local CLI or SDK installs (`openai`, `gcloud`, `anthropic-sdk`, etc.), plus a configured default project/organization when required.

#### Installation
- Global installs via `npm i -g <cli>` or `pip install <cli>`, or vendor binaries.
- Validate with `--help`/`--version` and run a quick “hello world” prompt to confirm networking and keys.

#### Available Tools
- Common feature families across CLIs: `models` (list/select), `chat`/`responses` (text/multimodal), `files` (upload/manage), `images`/`audio` (gen + transcribe/tts), and sometimes `assistants`/`batches` (vendor-specific).


#### Configuration
- Export API keys: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY` (names vary by vendor).
- Run `init` when available to set defaults (model, org/project, output format).
- Keep an `AGENT.md` with role/rules and a config file (YAML/JSON) for defaults and file inclusion rules.

---

## Google

### Gemini CLI

#### Description
- Command-line access patterns for Google’s Gemini models to run chat and generation tasks from the terminal.
- Primary purpose: quick ad-hoc prompting, automation in scripts/CI, and fast prototyping.
- Best use cases: text generation, summarization, code assistance, and testing prompts without a full app.

#### Usage
- Official access is via SDKs or Google Cloud's CLI for Vertex AI. Common flows:
  - SDK (JS): `@google/genai` with `ai.models.generateContent(...)`, `ai.chats.*`, streaming, files.
  - Vertex AI CLI: `gcloud ai models list`, `gcloud ai endpoints`, and related subcommands.
- Common flags (SDK/CLI patterns): select `--model` (e.g., `gemini-2.5-flash`), pass input via stdin or `--input`, prefer `--format=json` (gcloud) for scripting.
- Project docs sometimes include `GEMINI.md` for app-specific integration guidance.

#### Prerequisites 
- Google Cloud project with billing enabled plus Vertex AI/Gemini API access.
- `gcloud` SDK installed and authenticated (`gcloud init` + `gcloud auth application-default login`) or Node.js 18+ for `@google/genai`.
- Secure storage of credentials such as `GEMINI_API_KEY`, service account JSON, or ADC so scripts can authenticate.

#### Installation
- SDK (Node): `npm install @google/genai` (official Google Gen AI SDK).
- Vertex AI CLI: install Google Cloud SDK, then `gcloud` (see Google Cloud docs). Initialize: `gcloud init` and `gcloud auth application-default login`.

#### Configuration
- For AI Studio: set `GOOGLE_API_KEY` or `GEMINI_API_KEY` (server-side recommended).
- For Vertex AI: authenticate with `gcloud auth application-default login` and set `GOOGLE_CLOUD_PROJECT` and `GOOGLE_CLOUD_LOCATION`.
- Optionally maintain local defaults (model, JSON output) for consistency in scripts/CI.

#### Available Tools
- `read-file` (read local files)
- `edit` (edit files)
- `web-fetch` (fetch web content)
- `shell` (execute shell commands)
- `search` (Google Search grounding)
- `write-file` (write files)
- `list-processes` (list system processes)
- `run-python` (run Python code snippets)
- `api-call` (call external APIs)
Source: GitHub repository and documentation on Gemini CLI built-in tools.

---

### Jules CLI

#### Description
- Not a standardized, widely documented CLI across major AI vendors; often a third‑party “agent” CLI wrapper.
- Primary purpose and best use cases vary by vendor; typically orchestrating agent workflows from the terminal.

#### Usage
- Typical verbs (patterns): `init`, `run`, `chat`, `task`, plus agent config files like `AGENT.md`.
- May support markdown/JSON config for tools, memory, and model selection.

#### Prerequisites
- A supported runtime (Node.js 18+/Python 3.10+) for the published package and its agent wrappers.
- Valid API keys or tokens for the vendor/service that Jules orchestrates, along with any required workspace/project IDs.
- A repo-local `AGENT.md` or config file that defines the agent rules, toolchain, and prompts before running `jules` commands.

#### Installation
- Often global via `npm i -g jules-cli` or `pip install jules-cli` (verify with vendor documentation).

#### Configuration
- Expect an `init` flow to scaffold config, set API keys, and choose defaults.
- Maintain an `AGENT.md` with rules/instructions and a project YAML/JSON for models and tooling.

#### Available Tools
- `git-status`, `git-pull`, `git-commit` (Git repo operations)
- `run-tests` (execute test suites)
- `generate-tests` (auto-generate tests)
- `refactor` (automated code refactoring)
- `create-feature-branch` (create git branches)
- `submit-pr` (submit pull requests)
- `run-linter` (run linter checks)
- `async-task` (schedule async coding tasks)
Source: Google Labs announcement, blog posts, Jules CLI documentation.

---

## OpenAI

### Codex CLI

#### Description
- A terminal-based coding assistant harness that can explore repos, run shell commands, edit files, and track a plan.
- Primary purpose: streamline codebase edits, documentation, and scripted operations.
- Best use cases: refactors, doc updates, and repeatable command workflows.

#### Usage
- Conversational control that executes shell commands, applies patches, and can maintain a task plan.
- Prefer project scripts (e.g., `npm run dev`, `npm run build`) over ad-hoc commands.

#### Prerequisites
- Access to this working environment that already exposes the Codex CLI and a valid `OPENAI_API_KEY`.
- Network access from the terminal to reach OpenAI endpoints (`https://api.openai.com`), respecting any proxy settings in use.
- Project-aware defaults (model, temperature, org) kept via shell vars or local config to avoid misconfigured commands.

#### Installation
- Provided by the working environment or tool distribution; no single universal install line.

#### Configuration
- Respect repository conventions (path aliases, env files) when operating on a project.
- Keep changes minimal and focused, and use JSON output modes from commands when scripting.

Note: OpenAI also provides an official `openai` CLI via SDKs.
- Install (typical): `npm i -g openai`
- Usage examples: `openai models list`, `openai chat.completions.create --model gpt-4o --input "Hello"`
- Configure: set `OPENAI_API_KEY` in your environment; optionally use a config file for defaults.

#### Available Tools
- `interactive` (start interactive coding session)
- `run-test` (run tests)
- `code-complete` (auto-complete code)
- `docs-lookup` (API documentation queries)
- `generate-pr` (generate pull requests)
- `refactor` (refactor code)
- `debug` (debugging assistance)
- `repo-inspect` (inspect repo files)
- `execute-code` (run code snippets)

---

## Anthropic

### Claude Code

#### Description
- Anthropic’s coding assistant, commonly used via IDE extensions; some environments expose CLI flows via SDKs or wrappers.
- Best use cases: code navigation, refactors, generation, and planning through structured briefs.

#### Usage
- Typical patterns: `chat` or “messages.create” operations with a `--model` (e.g., `claude-3-5-sonnet`).
- IDE-centric workflows often start from a session brief template and run inside the editor.

#### Prerequisites
- Anthropic account with `claude` API access and an `ANTHROPIC_API_KEY` or shared workspace key.
- Installed Claude Code tooling (extension/CLI) compatible with the shell or IDE being used.
- Workspace brief or `AGENTS.md` describing goals, code boundaries, and any sensitive files to avoid.

#### Installation
- IDE marketplace for the Claude Code extension, or install SDKs that provide command-line entry points.

#### Available Tools
- `Read` (read file contents)
- `Grep` (search regex in files)
- `Glob` (file pattern matching)
- `Bash` (execute shell commands)
- `Edit` (edit file contents)
- `Lint` (run linters)
- `Format` (code formatting)
- `Run-Test` (execute tests)
- `Deploy` (trigger deployment scripts)
Source: Official Claude CLI documentation and CLI reference.

#### Configuration
- Set `ANTHROPIC_API_KEY` in your environment.
- Maintain a concise session brief (goals, file paths, constraints) and optionally an `AGENTS.md` for rules.

---

## Atlassian CLI

### Rovo Dev

#### Description
- Rovo Dev CLI is an ACLI extension that brings Rovo GenAI workflows into the terminal so you can generate, review, refactor, debug, document, and test code without leaving the shell.
- It stays connected to Atlassian (Jira, Confluence, Bitbucket) so you can surface work item context, push updates, and keep sessions, prompts, and memories scoped to the current workspace.
- Streaming responses, deep planning, tool permissions, and integrations with MCP servers/subagents are all exposed through the CLI to accelerate complex development work and reduce context-switching.

#### Usage
- Run `acli rovodev run` to enter interactive mode (optionally with `--shadow`, `--restore`, or `--yolo`) or pass a single instruction (`acli rovodev run [instruction]`) when you just need one task.
- Use `acli rovodev serve [port]` for server mode, `acli rovodev config` to edit `~/.rovodev/config.yml`, `acli rovodev run --config-file [dir]` for alternate configs, and `acli rovodev --help` / `acli rovodev <command> --help` to explore flags.
- Inside interactive mode slash commands control sessions (`/sessions`, `/clear`, `/prune`), saved prompts (`/prompts`), memory (`/memory`, `/memory init`, `/memory reflect`), Jira integrations (`/jira`), productivity helpers (`/copy`, `/yolo`), system status (`/status`, `/usage`), models (`/models`), MCP servers (`/mcp`), directories (`/directories`), subagents (`/subagents`), and editing or exiting (`/exit`, `/quit`).

#### Prerequisites
- Ensure at least one Atlassian site has Rovo Dev activated and has an assigned pool of Rovo Dev credits before using the CLI.
- Install the Atlassian Command Line Interface (ACLI) on macOS/Linux/Windows and have an Atlassian account that can authenticate to the target cloud.
- Generate a scoped Rovo Dev API token (via the auto-link or Atlassian profile) that grants admin, chat, delete/manage/read/write/search (Jira/Confluence/Bitbucket/Rovo) permissions so ACLI can act on your behalf.

#### Installation
- Install or update ACLI, authorize by running `acli rovodev auth login` with the copied token, then invoke `acli rovodev run` to start interactive mode.
- If the automatic token link is unavailable, create one manually: choose the Rovo Dev template, set a name/expiry, select the required scopes, and copy the value for authentication.

#### Available Tools
- CLI primitives such as `acli rovodev run` (interactive, shadow, restore, YOLO) and `acli rovodev serve` (server mode) let you orchestrate workflows from the terminal.
- Slash commands expose sessions, prompt libraries, memory management, Jira/project helpers, productivity shortcuts (`/copy`, `/yolo`), system insight (`/status`, `/usage`), and environment controls (`/models`, `/mcp`, `/directories`, `/subagents`).
- Tool permissions in `toolPermissions` allow/ask/deny file operations, bash command regexes, Atlassian actions, and external path access; YOLO mode bypasses prompts in trusted workspaces.
- Source: Atlassian Support *Use Rovo Dev CLI*, *Rovo Dev CLI commands*, *Use tools in Rovo Dev CLI*, *Install and run Rovo Dev CLI on your device*.

#### Configuration
- The default YAML config at `~/.rovodev/config.yml` (editable via `acli rovodev config`) tunes agent behavior (modelId, temperature, streaming, deep planning), sessions (autoRestore, persistenceDir), Atlassian connections, console output, logging, MCP servers, tool permissions, and credit sites.
- Supply `--config-file` to run from alternate configs, migrate legacy memory files via `/memory init`, and store user/project memories in `~/.rovodev/AGENTS.md` / workspace `AGENTS.md` files.