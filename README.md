

<h1 align="center">PortLLM</h1>

<p align="center">
  Portable, Air-Gapped, Cross-Platform Local AI Environment
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows%20|%20macOS%20|%20Linux%20|%20Android-blue?style=flat-square" alt="Platform" />
  <img src="https://img.shields.io/badge/Network-100%25%20Offline-green?style=flat-square" alt="Offline" />
  <img src="https://img.shields.io/badge/License-MIT-red?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Models-GGUF%20Quantized-orange?style=flat-square" alt="Models" />
</p>

---

## Table of Contents

| Section | Description |
| :--- | :--- |
| [What is PortLLM](#what-is-portllm) | Project overview and core value proposition |
| [Why PortLLM](#why-portllm) | Side-by-side comparison with existing solutions |
| [System Architecture](#system-architecture) | Architecture diagram, execution flow, and component breakdown |
| [Directory Structure](#directory-structure) | Complete folder layout with file descriptions |
| [Model Catalog](#model-catalog) | Desktop and mobile model options with hardware requirements |
| [Quick Start: Windows](#windows-setup) | Windows installation and launch instructions |
| [Quick Start: macOS](#macos-setup) | macOS installation and launch instructions |
| [Quick Start: Linux](#linux-setup) | Linux installation and launch instructions |
| [Quick Start: Android](#android-setup-termux) | Android Termux native build and launch |
| [Custom Models](#custom-models) | How to add your own GGUF models |
| [LAN Access](#network-and-lan-access) | Access PortLLM from other devices on local network |
| [Troubleshooting](#troubleshooting) | Common issues and fixes |
| [Security and Privacy](#security-and-privacy) | Data handling and isolation guarantees |
| [License](#license) | MIT License |

---

## What is PortLLM?

PortLLM is an open-source, zero-dependency, portable local AI environment. It runs directly from a USB drive, portable SSD, or local disk folder without installing anything on the host machine.

It packages everything needed for local LLM inference into a single self-contained directory:

* A sandboxed chat interface served at `http://localhost:3333`
* Curated uncensored and standard GGUF models
* Client-side PDF and document processing (no uploads, no cloud)
* Real-time CPU and RAM hardware telemetry dashboard
* Unified cross-platform model sharing (one model copy works on all operating systems)
* Persistent chat history stored locally on the drive

Traditional local AI clients require host system integration, admin permissions, environment setup, and separate model downloads per device. PortLLM removes all of that. Download a model once, carry the drive, and run it on any machine.

---

## Why PortLLM

| Feature | PortLLM | Local LLM Apps (LM Studio, Jan, Ollama GUI) | Cloud AI (ChatGPT, Claude) |
| :--- | :--- | :--- | :--- |
| Portability | Runs from USB / SSD / Flash Drive | Requires host installation | Web browser only |
| Shared Model Weights | Single GGUF copy across all platforms | Duplicate storage per OS | Not applicable |
| Admin Rights Required | No (user-space execution) | Yes (installation) | No |
| Network Required | None (100% offline air-gapped) | Often needed for model pulls | Always required |
| Data Privacy | All data stays on physical drive | Stored in user profile folders | Transmitted to external servers |
| System Modifications | Zero (no registry, no PATH changes) | Modifies system paths and app data | Browser cache only |
| Hardware Telemetry | Built-in CPU and RAM dashboard | Requires external system monitor | Server-side only |
| Mobile Support | Native ARM64 Android via Termux | Desktop only | Mobile app (cloud-based) |

---

## System Architecture

### Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                              PORTLLM RUNTIME ROOT                                 |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +--------------------+  +--------------------+  +-----------------------------+  |
|  | Windows Launcher   |  | macOS / Linux      |  | Android Launcher            |  |
|  | install.bat        |  | install.sh         |  | install.sh (Termux)         |  |
|  | start-portllm.bat  |  | start.sh           |  | start.sh (llama-server)     |  |
|  +---------+----------+  +---------+----------+  +--------------+--------------+  |
|            |                       |                            |                 |
|            +-----------------------+----------------------------+                 |
|                                    |                                              |
|                                    v                                              |
|  +-----------------------------------------------------------------------------+  |
|  |                      SHARED PLATFORM LAYER (Shared/)                        |  |
|  |                                                                             |  |
|  |  +-----------------------+  +---------------------+  +-------------------+  |  |
|  |  | Binaries (bin/)       |  | Models (models/)    |  | Web UI (vendor/)  |  |  |
|  |  | - ollama-windows.exe  |  | - GGUF model files  |  | - Offline JS/CSS  |  |  |
|  |  | - ollama-darwin       |  | - Modelfiles        |  | - PDF.js parser   |  |  |
|  |  | - llama-server        |  | - ollama_data/      |  | - Marked.js       |  |  |
|  |  +-----------------------+  +---------------------+  +-------------------+  |  |
|  |                                                                             |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  |  | Backend Server (chat_server.py)                                       |  |  |
|  |  | - Python stdlib HTTP server on port 3333                              |  |  |
|  |  | - Hardware telemetry collector (CPU/RAM via ctypes)                    |  |  |
|  |  | - Reverse proxy to Ollama (port 11434) / llama.cpp (port 8080)        |  |  |
|  |  | - JSON-based chat history persistence (chat_data/)                    |  |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  +-----------------------------------------------------------------------------+  |
|                                    |                                              |
|                                    v                                              |
|  +-----------------------------------------------------------------------------+  |
|  |                    BROWSER CLIENT (PortLLM_UI.html)                         |  |
|  |  - Single-file standalone web application                                   |  |
|  |  - Glassmorphism UI with background video                                   |  |
|  |  - Zero external CDN dependencies                                           |  |
|  |  - Multi-chat session management                                            |  |
|  |  - Client-side PDF/text/markdown ingestion                                  |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### Execution Flow

```
Step 1  User runs platform launcher (e.g. Windows/start-portllm.bat)
          |
Step 2  Launcher resolves drive paths, sets OLLAMA_MODELS to Shared/models,
        and starts the inference engine in isolated background mode
          |
Step 3  chat_server.py boots on http://localhost:3333, connects to the
        inference daemon, and begins collecting hardware metrics
          |
Step 4  Default browser opens http://localhost:3333 with the fully
        offline web client ready for inference
```

---

## Directory Structure

```
PortLLM/
|
|-- Android/
|   |-- install.sh                 # Termux native compilation and setup
|   |-- start.sh                   # Android server launcher
|
|-- Linux/
|   |-- install.sh                 # Linux engine setup
|   |-- start.sh                   # Linux launcher
|
|-- Mac/
|   |-- install.command            # macOS permissions and runtime setup
|   |-- start.command              # macOS one-click launcher
|
|-- Windows/
|   |-- install.bat                # Windows setup entry point (runs install-core.ps1)
|   |-- install-core.ps1           # PowerShell engine, model downloader, and importer
|   |-- start-portllm.bat          # Windows one-click runtime launcher
|   |-- uninstall.bat              # Cleanup entry point
|   |-- uninstall-core.ps1         # Full uninstall script
|
|-- Shared/
|   |-- PortLLM_UI.html            # Single-file frontend (HTML + CSS + JS)
|   |-- chat_server.py             # Python stdlib HTTP server with hardware telemetry
|   |
|   |-- bin/                       # Pre-compiled inference engine binaries
|   |   |-- ollama-windows.exe     # Windows x64 Ollama runtime
|   |   |-- ollama-darwin          # macOS ARM64/x64 Ollama runtime
|   |   |-- llama-server           # Android ARM64 llama.cpp server
|   |
|   |-- chat_data/                 # Persistent chat logs and session settings (JSON)
|   |
|   |-- config/
|   |   |-- models.json            # Model catalog with download URLs and metadata
|   |
|   |-- models/                    # GGUF model weights and Ollama layer data
|   |   |-- ollama_data/           # Ollama manifest and blob storage
|   |   |-- Modelfile-*            # Per-model configuration files
|   |
|   |-- scripts/                   # Shared utility scripts
|   |
|   |-- vendor/                    # Offline web assets
|       |-- bg_video.mp4           # Background video for glassmorphism UI
|       |-- Inter-*.woff2          # Inter font family (Regular, Medium, SemiBold, Bold)
|       |-- JetBrainsMono-*.woff2  # Monospace font for code blocks
|       |-- marked.min.js          # Markdown renderer
|       |-- highlight.min.js       # Syntax highlighter
|       |-- pdf.min.mjs            # PDF.js document parser
|       |-- fa-all.min.css         # Font Awesome icons
|
|-- portllm-website/               # Landing page source code
|-- .gitignore
|-- README.md
```

---

## Model Catalog

### Desktop Models (Windows, macOS, Linux)

| Model | Parameters | Size | RAM Needed | Best For |
| :--- | :--- | :--- | :--- | :--- |
| Gemma 2 2B Abliterated | 2B | 1.6 GB | 8 GB | Fast general reasoning on any hardware |
| Phi-3.5 Mini 3.8B | 3.8B | 2.2 GB | 8 GB | Logic, math, and structured reasoning |
| Dolphin 2.9 Llama 3 8B | 8B | 4.9 GB | 16 GB | Creative writing, roleplay, open conversation |
| Qwen 3.5 9B Uncensored | 9B | 5.2 GB | 16 GB | Code generation, technical tasks |
| Gemma 4 E4B Ultra Heretic | 4B | 5.3 GB | 16 GB | Complex unrestricted system prompts |
| NemoMix Unleashed 12B | 12B | 7.0 GB | 16-32 GB | Long-form analysis, deep multi-turn context |

### Mobile Models (Android Termux)

| Model | Parameters | Size | RAM Needed | Best For |
| :--- | :--- | :--- | :--- | :--- |
| SmolLM2 1.7B Uncensored | 1.7B | 1.0 GB | 4 GB | Lightweight inference on older phones |
| Qwen 2.5 1.5B Instruct | 1.5B | 1.1 GB | 4 GB | Multilingual tasks on low-memory devices |
| Gemma 2 2B Abliterated | 2B | 1.6 GB | 6 GB | Balanced speed and intelligence on mobile |
| Phi 3.5 Mini 3.8B | 3.8B | 2.2 GB | 8 GB | Advanced reasoning on flagship phones |

### Custom Models

You can use any GGUF model from Hugging Face:

1. Place the `.gguf` file in `Shared/models/`
2. Create a file named `Modelfile-<your_model_name>` in the same folder:
   ```
   FROM /absolute/path/to/your_model.gguf
   PARAMETER temperature 0.7
   PARAMETER top_p 0.9
   ```
3. The model will be available for import on next launch.

You can also paste a direct `.gguf` download URL during the installer prompt to download and configure custom models automatically.

---

## Installation and Usage

### System Requirements

| Component | Minimum | Recommended |
| :--- | :--- | :--- |
| Storage | 8 GB free (USB 3.0+ or SSD) | 16 GB+ on NVMe SSD |
| RAM (2B models) | 8 GB | 8 GB |
| RAM (8B-12B models) | 16 GB | 32 GB |
| Android (Termux) | 6 GB RAM, ARM64 | 8 GB+ RAM |

### Windows Setup

1. Connect your USB drive or open the local PortLLM folder.
2. Navigate to `Windows/` and double-click **install.bat**.
3. Select models from the interactive menu. The installer downloads weights, bootstraps offline assets, and configures model layers.
4. Launch by double-clicking **Windows/start-portllm.bat**.
5. Browser opens automatically at `http://localhost:3333`.

### macOS Setup

```bash
chmod +x Mac/install.command Mac/start.command
./Mac/install.command     # one-time setup
./Mac/start.command       # launch PortLLM
```

Open `http://localhost:3333` in your browser.

### Linux Setup

```bash
chmod +x Linux/install.sh Linux/start.sh
./Linux/install.sh        # one-time setup
./Linux/start.sh          # launch PortLLM
```

Open `http://localhost:3333` in your browser.

### Android Setup (Termux)

**Prerequisites:** Termux from [F-Droid](https://f-droid.org/en/packages/com.termux/) (not Play Store), 6 GB+ RAM, ARM64 processor.

```bash
git clone https://github.com/Abhichy18/PortLLM.git
cd PortLLM
bash Android/install.sh   # compiles llama.cpp natively for ARM64
bash Android/start.sh     # select Option 1 for PortLLM UI
```

Run `termux-wake-lock` before starting the server to prevent Android from killing background inference.

### Local Disk Installation

PortLLM also works as a permanent local AI workspace on your internal drive:

1. Clone or download this repository to a local folder (e.g. `C:\PortLLM`).
2. Run the installer for your OS.
3. Run the start script.

Running from an internal NVMe SSD improves model loading speeds up to 10x compared to USB flash drives.

---

## Network and LAN Access

Run inference on your powerful desktop and access the chat from any device on your local network.

1. Start PortLLM on the host machine.
2. The terminal displays your network address:
   ```
   Local Access:   http://localhost:3333
   Network Access: http://192.168.1.XX:3333
   ```
3. Open the Network Access URL on any phone, tablet, or laptop connected to the same Wi-Fi.
4. All data remains local to the host machine.

---

## Troubleshooting

| Problem | Cause | Fix |
| :--- | :--- | :--- |
| Setup hangs at "Importing AI models" (Step 7) | PowerShell output pipe deadlock when capturing large GGUF layer streams, or relative Modelfile paths failing against a system-level Ollama daemon | Fixed in latest install-core.ps1: uses absolute GGUF paths and direct process execution without output redirection |
| Background video not visible in chat UI | CSS stacking context: html element background paints over negative z-index video layer | Fixed in latest PortLLM_UI.html: html/body set to transparent with a separate fallback canvas div at z-index -3 |
| Script closes instantly on Windows | Windows App Execution Aliases intercepting the python command | Right-click install.bat and select "Run as Administrator", or disable Python app aliases in Windows Settings |
| "AI Engine Not Found" error | Installer was not run before the start script | Run install.bat (or install.sh) first to download the inference engine and model files |
| Very slow text generation | Model exceeds available system memory, causing disk swap | Choose a smaller model (Gemma 2 2B or Phi-3.5 Mini). Use an NVMe SSD for best speed. |
| Port 3333 already in use | Previous PortLLM session or another service on that port | Close existing Python/Ollama processes via Task Manager, then re-launch |

---

## Security and Privacy

* **Air-Gapped Execution:** No prompt data, uploaded documents, or chat histories leave the local machine. Zero network calls, zero telemetry.
* **User-Space Isolation:** PortLLM does not modify the Windows Registry, system PATH, global package managers, or any host system configuration.
* **Uncensored Models:** Models marked as abliterated or uncensored have had alignment safeguards removed at the weight level. They follow direct instructions without refusals. Users are fully responsible for generated content.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
