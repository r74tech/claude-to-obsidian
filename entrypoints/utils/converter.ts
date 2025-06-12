import { ClaudeConversation, ChatMessage, MessageContent, ExportFormat, ExportOptions } from '../../types/claude-api';

export function convertConversation(
  conversation: ClaudeConversation,
  options: ExportOptions
): string {
  if (options.format === 'markdown') {
    return convertToMarkdown(conversation, options);
  } else {
    return convertToObsidian(conversation, options);
  }
}

function convertToMarkdown(conversation: ClaudeConversation, options: ExportOptions): string {
  const lines: string[] = [];
  
  // Add frontmatter if metadata is requested
  if (options.includeMetadata) {
    lines.push('---');
    lines.push(`title: "${conversation.name || 'Claude Conversation'}"`);
    lines.push(`date: ${formatDate(conversation.created_at)}`);
    lines.push(`model: ${conversation.model}`);
    lines.push(`project: ${conversation.project.name}`);
    lines.push(`url: https://claude.ai/chat/${conversation.uuid}`);
    lines.push('tags:');
    lines.push('  - claude');
    lines.push('  - conversation');
    lines.push('---');
    lines.push('');
  }
  
  // Add title with link to Claude conversation
  const conversationUrl = `https://claude.ai/chat/${conversation.uuid}`;
  lines.push(`# [${conversation.name || 'Claude Conversation'}](${conversationUrl})`);
  lines.push('');
  
  // Convert messages
  conversation.chat_messages.forEach(message => {
    lines.push(...convertMessageToMarkdown(message, options));
    lines.push('');
  });
  
  return lines.join('\n');
}

function convertToObsidian(conversation: ClaudeConversation, options: ExportOptions): string {
  const lines: string[] = [];
  
  // Add frontmatter
  lines.push('---');
  lines.push(`title: "${conversation.name || 'Claude Conversation'}"`);
  lines.push(`date: ${formatDate(conversation.created_at)}`);
  lines.push(`model: ${conversation.model}`);
  lines.push(`project: ${conversation.project.name}`);
  lines.push(`url: https://claude.ai/chat/${conversation.uuid}`);
  lines.push('tags:');
  lines.push('  - claude');
  lines.push('  - conversation');
  lines.push('---');
  lines.push('');
  
  // Add title with link to Claude conversation
  const conversationUrl = `https://claude.ai/chat/${conversation.uuid}`;
  lines.push(`# [${conversation.name || 'Claude Conversation'}](${conversationUrl})`);
  lines.push('');
  
  // Convert messages
  conversation.chat_messages.forEach(message => {
    lines.push(...convertMessageToObsidian(message, options));
    lines.push('');
  });
  
  return lines.join('\n');
}

function convertMessageToMarkdown(message: ChatMessage, options: ExportOptions): string[] {
  const lines: string[] = [];
  
  // Add message header
  if (message.sender === 'human') {
    lines.push('## 👤 Human');
  } else {
    lines.push('## 🤖 Assistant');
  }
  lines.push('');
  
  // Add attachments if any
  if (message.attachments && message.attachments.length > 0) {
    lines.push('**📎 Attachments:**');
    message.attachments.forEach(attachment => {
      lines.push(`- ${attachment.file_name || 'Unknown file'} (${attachment.file_type || 'Unknown type'})`);
    });
    lines.push('');
  }
  
  // Add files if any
  if ((message.files && message.files.length > 0) || (message.files_v2 && message.files_v2.length > 0)) {
    lines.push('**📄 Files:**');
    const allFiles = [...(message.files || []), ...(message.files_v2 || [])];
    allFiles.forEach(file => {
      lines.push(`- ${file.file_name || 'Unknown file'} (${file.file_type || 'Unknown type'})`);
    });
    lines.push('');
  }
  
  // Process content blocks
  message.content.forEach(content => {
    const contentLines = convertContentToMarkdown(content, options);
    lines.push(...contentLines);
  });
  
  return lines;
}

function convertMessageToObsidian(message: ChatMessage, options: ExportOptions): string[] {
  const lines: string[] = [];
  
  // Add message header
  if (message.sender === 'human') {
    lines.push('## 👤 Human');
  } else {
    lines.push('## 🤖 Assistant');
  }
  lines.push('');
  
  // Add attachments if any
  if (message.attachments && message.attachments.length > 0) {
    lines.push('```ad-abstract');
    lines.push('title: 📎 Attachments');
    lines.push('collapse: closed');
    lines.push('');
    message.attachments.forEach(attachment => {
      lines.push(`- ${attachment.file_name || 'Unknown file'} (${attachment.file_type || 'Unknown type'})`);
    });
    lines.push('```');
    lines.push('');
  }
  
  // Add files if any
  if ((message.files && message.files.length > 0) || (message.files_v2 && message.files_v2.length > 0)) {
    lines.push('```ad-abstract');
    lines.push('title: 📄 Files');
    lines.push('collapse: closed');
    lines.push('');
    const allFiles = [...(message.files || []), ...(message.files_v2 || [])];
    allFiles.forEach(file => {
      lines.push(`- ${file.file_name || 'Unknown file'} (${file.file_type || 'Unknown type'})`);
    });
    lines.push('```');
    lines.push('');
  }
  
  // Process content blocks
  message.content.forEach(content => {
    const contentLines = convertContentToObsidian(content, options);
    lines.push(...contentLines);
  });
  
  return lines;
}

function convertContentToMarkdown(content: MessageContent, options: ExportOptions): string[] {
  const lines: string[] = [];
  
  switch (content.type) {
    case 'text':
      if (content.text) {
        lines.push(content.text);
        
        // Add citations if any
        if (content.citations && content.citations.length > 0) {
          lines.push('');
          lines.push('**Sources:**');
          content.citations.forEach((citation, index) => {
            if (citation.url) {
              lines.push(`${index + 1}. [${citation.title || citation.url}](${citation.url})`);
            } else if (citation.title) {
              lines.push(`${index + 1}. ${citation.title}`);
            }
          });
        }
        
        lines.push('');
      }
      break;
      
    case 'thinking':
      if (options.includeThinking && content.thinking) {
        lines.push('<details>');
        lines.push('<summary>🤔 Thinking</summary>');
        lines.push('');
        lines.push(content.thinking);
        lines.push('');
        lines.push('</details>');
        lines.push('');
      }
      break;
      
    case 'tool_use':
      if (options.includeTools) {
        lines.push('<details>');
        lines.push(`<summary>🔧 Tool: ${content.name || 'Unknown'}</summary>`);
        lines.push('');
        lines.push('**Input:**');
        lines.push('~~~json');
        lines.push(JSON.stringify(content.input, null, 2));
        lines.push('~~~');
        lines.push('');
        lines.push('</details>');
        lines.push('');
      }
      break;
      
    case 'tool_result':
      if (options.includeTools && content.content) {
        content.content.forEach(result => {
          if (result.text) {
            lines.push('<details>');
            lines.push('<summary>📊 Tool Result</summary>');
            lines.push('');
            
            // Check if the result is JSON
            const trimmedText = result.text.trim();
            if (trimmedText.startsWith('{') || trimmedText.startsWith('[')) {
              try {
                const parsed = JSON.parse(trimmedText);
                lines.push('~~~json');
                lines.push(JSON.stringify(parsed, null, 2));
                lines.push('~~~');
              } catch {
                // Not valid JSON, output as regular text in code block
                lines.push('~~~');
                lines.push(result.text);
                lines.push('~~~');
              }
            } else {
              // Plain text, still wrap in code block
              lines.push('~~~');
              lines.push(result.text);
              lines.push('~~~');
            }
            
            lines.push('');
            lines.push('</details>');
            lines.push('');
          }
        });
      }
      break;
  }
  
  return lines;
}

function convertContentToObsidian(content: MessageContent, options: ExportOptions): string[] {
  const lines: string[] = [];
  
  switch (content.type) {
    case 'text':
      if (content.text) {
        lines.push(content.text);
        
        // Add citations if any
        if (content.citations && content.citations.length > 0) {
          lines.push('');
          lines.push('```ad-quote');
          lines.push('title: 🔖 Sources');
          lines.push('collapse: closed');
          lines.push('');
          content.citations.forEach((citation, index) => {
            if (citation.url) {
              lines.push(`${index + 1}. [${citation.title || citation.url}](${citation.url})`);
            } else if (citation.title) {
              lines.push(`${index + 1}. ${citation.title}`);
            }
          });
          lines.push('```');
        }
        
        lines.push('');
      }
      break;
      
    case 'thinking':
      if (options.includeThinking && content.thinking) {
        lines.push('```ad-note');
        lines.push('title: 🤔 Thinking');
        lines.push('collapse: closed');
        lines.push('');
        lines.push(content.thinking);
        lines.push('```');
        lines.push('');
      }
      break;
      
    case 'tool_use':
      if (options.includeTools) {
        lines.push('```ad-info');
        lines.push(`title: 🔧 Tool: ${content.name || 'Unknown'}`);
        lines.push('collapse: closed');
        lines.push('');
        lines.push('**Input:**');
        lines.push('~~~json');
        lines.push(JSON.stringify(content.input, null, 2));
        lines.push('~~~');
        lines.push('```');
        lines.push('');
      }
      break;
      
    case 'tool_result':
      if (options.includeTools && content.content) {
        content.content.forEach(result => {
          if (result.text) {
            const isError = content.is_error;
            lines.push(`\`\`\`ad-${isError ? 'warning' : 'success'}`);
            lines.push('title: 📊 Tool Result');
            lines.push('collapse: closed');
            lines.push('');
            
            // Check if the result is JSON
            const trimmedText = result.text.trim();
            if (trimmedText.startsWith('{') || trimmedText.startsWith('[')) {
              try {
                const parsed = JSON.parse(trimmedText);
                lines.push('~~~json');
                lines.push(JSON.stringify(parsed, null, 2));
                lines.push('~~~');
              } catch {
                // Not valid JSON, output as regular text
                lines.push('~~~');
                lines.push(result.text);
                lines.push('~~~');
              }
            } else {
              lines.push('~~~');
              lines.push(result.text);
              lines.push('~~~');
            }
            
            lines.push('```');
            lines.push('');
          }
        });
      }
      break;
  }
  
  return lines;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}