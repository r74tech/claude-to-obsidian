export default defineContentScript({
  matches: ['*://claude.ai/*'],
  main() {
    console.log('Claude to Obsidian: Content script loaded');

    // Listen for messages from the popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'getPageInfo') {
        const pageInfo = getPageInfo();
        sendResponse(pageInfo);
      } else if (request.action === 'getConversationData') {
        getConversationData()
          .then(data => sendResponse({ success: true, data }))
          .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep the message channel open for async response
      }
    });
  }
});

function getPageInfo() {
  const url = window.location.href;
  const conversationIdMatch = url.match(/\/chat\/([a-f0-9-]+)/);
  const conversationId = conversationIdMatch ? conversationIdMatch[1] : null;
  
  // Try to get organization ID from various sources
  let organizationId = null;
  
  // Method 1: Check local storage
  try {
    const storageKeys = Object.keys(localStorage);
    for (const key of storageKeys) {
      if (key.includes('organization')) {
        const value = localStorage.getItem(key);
        if (value) {
          const parsed = JSON.parse(value);
          if (parsed.uuid || parsed.id) {
            organizationId = parsed.uuid || parsed.id;
            break;
          }
        }
      }
    }
  } catch (e) {
    console.error('Error accessing localStorage:', e);
  }
  
  // Method 2: Check the page for organization info
  if (!organizationId) {
    // This is a fallback - we'll extract from API calls
    organizationId = '809b2a93-fd04-4e2b-b18c-439526d5a9a2'; // Default fallback
  }
  
  return {
    isClaudeChat: conversationId !== null,
    conversationId,
    organizationId,
    url
  };
}

async function getConversationData() {
  const pageInfo = getPageInfo();
  
  if (!pageInfo.isClaudeChat) {
    throw new Error('Not a Claude chat page');
  }
  
  if (!pageInfo.conversationId) {
    throw new Error('Could not find conversation ID');
  }
  
  // Construct the API URL
  const apiUrl = `https://claude.ai/api/organizations/${pageInfo.organizationId}/chat_conversations/${pageInfo.conversationId}?tree=True&rendering_mode=messages&render_all_tools=true`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching conversation data:', error);
    throw error;
  }
}