import type React from 'react';
import type { ExportFormat } from '../../../types/claude-api';

interface ExportOptionsProps {
  exportFormat: ExportFormat;
  includeThinking: boolean;
  includeTools: boolean;
  includeMetadata: boolean;
  onFormatChange: (format: ExportFormat) => void;
  onThinkingChange: (value: boolean) => void;
  onToolsChange: (value: boolean) => void;
  onMetadataChange: (value: boolean) => void;
  onExport: () => void;
  isLoading: boolean;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  exportFormat,
  includeThinking,
  includeTools,
  includeMetadata,
  onFormatChange,
  onThinkingChange,
  onToolsChange,
  onMetadataChange,
  onExport,
  isLoading,
}) => {
  return (
    <div className="export-options">
      <div className="option-group">
        <h3>Export Format</h3>
        <label>
          <input
            type="radio"
            value="markdown"
            checked={exportFormat === 'markdown'}
            onChange={(e) => onFormatChange(e.target.value as ExportFormat)}
          />
          Markdown (Standard)
        </label>
        <label>
          <input
            type="radio"
            value="obsidian"
            checked={exportFormat === 'obsidian'}
            onChange={(e) => onFormatChange(e.target.value as ExportFormat)}
          />
          Obsidian (with Admonitions)
        </label>
      </div>

      <div className="option-group">
        <h3>Include Options</h3>
        <label>
          <input
            type="checkbox"
            checked={includeThinking}
            onChange={(e) => onThinkingChange(e.target.checked)}
          />
          Include Thinking Blocks
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeTools}
            onChange={(e) => onToolsChange(e.target.checked)}
          />
          Include Tool Usage
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeMetadata}
            onChange={(e) => onMetadataChange(e.target.checked)}
          />
          Include Metadata
        </label>
      </div>

      <button
        className="export-button"
        type="button"
        onClick={onExport}
        disabled={isLoading}
      >
        {isLoading ? 'Exporting...' : 'Export Conversation'}
      </button>
    </div>
  );
};
