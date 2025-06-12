# Claude to Obsidian

[![Release](https://github.com/r74/claude-to-obsidian/actions/workflows/release.yml/badge.svg)](https://github.com/r74/claude-to-obsidian/actions/workflows/release.yml)
[![Build Check](https://github.com/r74/claude-to-obsidian/actions/workflows/build-check.yml/badge.svg)](https://github.com/r74/claude-to-obsidian/actions/workflows/build-check.yml)

Export your Claude.ai conversations to Markdown and Obsidian format with a single click!

## ✨ Features

- 📝 Export conversations in standard Markdown or Obsidian format
- 🤔 Include/exclude thinking blocks
- 🛠️ Include/exclude tool usage details
- 📊 Include/exclude metadata (date, model, project)
- 💾 Automatic conversation history with updates
- 📋 One-click copy to clipboard
- 💾 Download as `.md` file
- 🔗 Direct links back to original Claude conversations
- 🌐 Works with Chrome, Edge, Brave, and Firefox

## 📦 Installation

### From Release (Recommended)

1. Go to the [Releases](https://github.com/r74/claude-to-obsidian/releases) page
2. Download the appropriate zip file for your browser
3. Follow the installation instructions in the release notes

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/r74/claude-to-obsidian.git
   cd claude-to-obsidian
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the extension:
   ```bash
   # For Chrome/Edge/Brave
   pnpm build
   
   # For Firefox
   pnpm build:firefox
   ```

4. Load the extension:
   - **Chrome/Edge/Brave**:
     1. Open `chrome://extensions/`
     2. Enable "Developer mode"
     3. Click "Load unpacked"
     4. Select `.output/chrome-mv3` folder
   
   - **Firefox**:
     1. Open `about:debugging`
     2. Click "This Firefox"
     3. Click "Load Temporary Add-on"
     4. Select any file in `.output/firefox-mv2` folder

## 🚀 Usage

1. Navigate to any Claude.ai conversation
2. Click the Claude to Obsidian extension icon
3. Choose your export settings:
   - **Format**: Markdown or Obsidian
   - **Include**: Thinking blocks, Tool usage, Metadata
4. Click "Export Conversation"
5. Copy to clipboard or download the file

## 📄 Export Formats

### Markdown Format
```markdown
---
title: "Your Conversation Title"
date: 2025/01/13 15:30
model: claude-3-opus-20240229
project: personal
url: https://claude.ai/chat/your-conversation-id
tags:
  - claude
  - conversation
---

# [Your Conversation Title](https://claude.ai/chat/your-conversation-id)

## 👤 Human
Your message...

## 🤖 Assistant
Claude's response...
```

### Obsidian Format
Uses Admonition plugin syntax for better organization:
- Thinking blocks: `ad-note`
- Tool usage: `ad-info`
- Tool results: `ad-success` or `ad-warning`

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build for production
pnpm build        # Chrome
pnpm build:firefox # Firefox

# Create release packages
pnpm zip          # Chrome
pnpm zip:firefox  # Firefox

# Type checking
pnpm compile
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🐛 Known Issues

- Large conversations may take a moment to process

## 📚 Resources

- [WXT Framework](https://wxt.dev/)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Firefox Add-on Docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons)
