import type React from 'react';
import type { StoredConversation } from '../../utils/database';

interface HistoryViewProps {
  conversations: StoredConversation[];
  onBack: () => void;
  onExport: (conversation: StoredConversation) => void;
  onDelete: (conversation: StoredConversation) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  conversations,
  onBack,
  onExport,
  onDelete,
}) => {
  return (
    <div className="history-view">
      <button className="back-button" type="button" onClick={onBack}>
        ← Back
      </button>
      <h2>Conversation History</h2>
      {conversations.length === 0 ? (
        <p className="no-history">No conversations saved yet.</p>
      ) : (
        <div className="history-list">
          {conversations.map((conv) => (
            <div key={conv.uuid} className="history-item">
              <div className="history-info">
                <strong>{conv.name || 'Untitled Conversation'}</strong>
                <small>
                  Created: {new Date(conv.created_at).toLocaleDateString()}
                  {conv.lastUpdatedAt && (
                    <>
                      {' • '}
                      Updated: {new Date(conv.lastUpdatedAt).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </>
                  )}
                </small>
              </div>
              <div className="history-actions">
                <button type="button" onClick={() => onExport(conv)}>Export</button>
                <button type="button" onClick={() => onDelete(conv)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
