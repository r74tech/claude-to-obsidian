import { useState, useEffect } from 'react';
import './App.css';
import type { ExportFormat, ExportOptions, ClaudeConversation } from '../../types/claude-api';
import { convertConversation } from '../utils/converter';
import { saveConversation, getAllConversations, deleteConversation, getConversation, type StoredConversation } from '../utils/database';
import { ExportOptions as ExportOptionsComponent, ExportResult, HistoryView, Alert } from './components';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('markdown');
  const [includeThinking, setIncludeThinking] = useState(true);
  const [includeTools, setIncludeTools] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [exportResult, setExportResult] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<StoredConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ClaudeConversation | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'updated' | null>(null);

  useEffect(() => {
    // Get page info when popup opens
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getPageInfo' }, (response: any) => {
          if (chrome.runtime.lastError) {
            setError('Claude to Obsidian extension is not active on this page.');
          } else {
            setPageInfo(response);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    // Load conversations when showing history
    if (showHistory) {
      loadConversations();
    }
  }, [showHistory]);

  const loadConversations = async () => {
    try {
      const saved = await getAllConversations();
      setConversations(saved);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const handleExport = async () => {
    if (!pageInfo?.isClaudeChat) {
      setError('This is not a Claude chat page.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExportResult(null);

    try {
      // Get conversation data
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: 'getConversationData' },
            async (response: any) => {
              if (chrome.runtime.lastError) {
                setError(`Failed to get conversation data: ${chrome.runtime.lastError.message}`);
                setIsLoading(false);
              } else if (!response.success) {
                setError(response.error || 'Failed to get conversation data');
                setIsLoading(false);
              } else {
                const conversation = response.data as ClaudeConversation;
                setCurrentConversation(conversation);

                // Save to IndexedDB
                try {
                  const existingConv = await getConversation(conversation.uuid);
                  await saveConversation(conversation);
                  setSaveStatus(existingConv ? 'updated' : 'saved');
                  setTimeout(() => setSaveStatus(null), 3000);
                } catch (err) {
                  console.error('Failed to save conversation:', err);
                }

                // Convert the conversation
                const options: ExportOptions = {
                  format: exportFormat,
                  includeThinking,
                  includeTools,
                  includeMetadata
                };

                const result = convertConversation(conversation, options);
                setExportResult(result);
                setIsLoading(false);
              }
            }
          );
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const handleExportFromHistory = (conversation: StoredConversation) => {
    const options: ExportOptions = {
      format: exportFormat,
      includeThinking,
      includeTools,
      includeMetadata
    };

    const result = convertConversation(conversation, options);
    setExportResult(result);
    setCurrentConversation(conversation);
    setShowHistory(false);
  };

  const handleDeleteFromHistory = async (conversation: StoredConversation) => {
    if (confirm('Are you sure you want to delete this conversation from history?')) {
      try {
        await deleteConversation(conversation.uuid);
        await loadConversations();
      } catch (err) {
        console.error('Failed to delete conversation:', err);
      }
    }
  };

  const handleCopy = () => {
    if (exportResult) {
      navigator.clipboard.writeText(exportResult).then(() => {
        // Show success message
        const button = document.querySelector('#copy-button') as HTMLButtonElement;
        if (button) {
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }
      });
    }
  };

  const handleDownload = () => {
    if (exportResult && currentConversation) {
      const filename = `claude-conversation-${currentConversation.uuid}.md`;
      const blob = new Blob([exportResult], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="popup-container">
      <h1>Claude to Obsidian</h1>

      {error && <Alert type="error">{error}</Alert>}

      {saveStatus && (
        <Alert type="info">
          Conversation {saveStatus === 'saved' ? 'saved' : 'updated'} to history!
        </Alert>
      )}

      {!showHistory && !exportResult && (
        <div className="main-actions">
          <button className="history-button" type="button" onClick={() => setShowHistory(true)}>
            View History
          </button>
        </div>
      )}

      {showHistory && (
        <HistoryView
          conversations={conversations}
          onBack={() => setShowHistory(false)}
          onExport={handleExportFromHistory}
          onDelete={handleDeleteFromHistory}
        />
      )}

      {pageInfo && !pageInfo.isClaudeChat && !showHistory && (
        <Alert type="warning">
          Please navigate to a Claude.ai chat page to use this extension.
        </Alert>
      )}

      {pageInfo?.isClaudeChat && !exportResult && !showHistory && (
        <ExportOptionsComponent
          exportFormat={exportFormat}
          includeThinking={includeThinking}
          includeTools={includeTools}
          includeMetadata={includeMetadata}
          onFormatChange={setExportFormat}
          onThinkingChange={setIncludeThinking}
          onToolsChange={setIncludeTools}
          onMetadataChange={setIncludeMetadata}
          onExport={handleExport}
          isLoading={isLoading}
        />
      )}

      {exportResult && (
        <ExportResult
          result={exportResult}
          onCopy={handleCopy}
          onDownload={handleDownload}
          onBack={() => setExportResult(null)}
        />
      )}
    </div>
  );
}

export default App;