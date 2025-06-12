import type React from 'react';

interface ExportResultProps {
  result: string;
  onCopy: () => void;
  onDownload: () => void;
  onBack: () => void;
}

export const ExportResult: React.FC<ExportResultProps> = ({
  result,
  onCopy,
  onDownload,
  onBack,
}) => {
  return (
    <div className="export-result">
      <h3>Export Complete!</h3>
      <div className="result-actions">
        <button id="copy-button" type="button" onClick={onCopy}>
          Copy to Clipboard
        </button>
        <button type="button" onClick={onDownload}>
          Download File
        </button>
      </div>
      <details className="preview-container">
        <summary>Preview</summary>
        <pre>{result.substring(0, 500)}...</pre>
      </details>
      <button className="back-button" type="button" onClick={onBack}>
        Export Another
      </button>
    </div>
  );
};
