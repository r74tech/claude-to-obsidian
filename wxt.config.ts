import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Claude to Obsidian',
    description: 'Export Claude.ai conversations to Markdown and Obsidian format',
    permissions: [
      'activeTab',
      'storage',
      'clipboardWrite'
    ],
    host_permissions: [
      'https://claude.ai/*'
    ],
    action: {
      default_popup: 'popup.html',
      default_title: 'Export Claude conversation'
    }
  }
});
