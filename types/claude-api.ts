// Claude API Response Types

export interface ClaudeConversation {
  uuid: string;
  name: string;
  summary: string;
  model: string;
  created_at: string;
  updated_at: string;
  settings: ConversationSettings;
  is_starred: boolean;
  project_uuid: string;
  current_leaf_message_uuid: string;
  chat_messages: ChatMessage[];
  project: Project;
}

export interface ConversationSettings {
  enabled_web_search: boolean;
  enabled_sourdough: boolean;
  enabled_mcp_tools: Record<string, boolean>;
  paprika_mode: string;
  preview_feature_uses_artifacts: boolean;
  enabled_artifacts_attachments: boolean;
}

export interface Project {
  uuid: string;
  name: string;
}

export interface ChatMessage {
  uuid: string;
  text: string;
  content: MessageContent[];
  sender: 'human' | 'assistant';
  index: number;
  created_at: string;
  updated_at: string;
  truncated: boolean;
  stop_reason?: string;
  attachments: Attachment[];
  files: File[];
  files_v2: FileV2[];
  sync_sources: unknown[];
  parent_message_uuid: string;
}

export interface MessageContent {
  start_timestamp: string;
  stop_timestamp: string;
  type: 'text' | 'thinking' | 'tool_use' | 'tool_result';
  text?: string;
  thinking?: string;
  name?: string;
  input?: unknown;
  content?: ToolResultContent[];
  message?: string;
  is_error?: boolean;
  citations: Citation[];
  summaries?: ThinkingSummary[];
  cut_off?: boolean;
}

export interface ToolResultContent {
  type: 'text';
  text: string;
  uuid: string;
}

export interface ThinkingSummary {
  summary: string;
}

export interface Citation {
  index?: string;
  url?: string;
  title?: string;
}

export interface Attachment {
  id?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
}

export interface File {
  file_name?: string;
  file_type?: string;
  file_size?: number;
  extracted_content?: string;
}

export interface FileV2 {
  file_name?: string;
  file_type?: string;
  file_size?: number;
  extracted_content?: string;
}

// Export format types
export type ExportFormat = 'markdown' | 'obsidian';

export interface ExportOptions {
  format: ExportFormat;
  includeThinking: boolean;
  includeTools: boolean;
  includeMetadata: boolean;
}