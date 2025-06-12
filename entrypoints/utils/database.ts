import Dexie, { type Table } from 'dexie';
import type { ClaudeConversation } from '../../types/claude-api';

export interface StoredConversation extends ClaudeConversation {
  id?: number;
  storedAt: Date;
  lastUpdatedAt: Date;
}

class ClaudeObsidianDB extends Dexie {
  conversations!: Table<StoredConversation>;

  constructor() {
    super('ClaudeToObsidian');
    this.version(1).stores({
      conversations: '++id, uuid, created_at, storedAt',
    });
    
    // Version 2: Add lastUpdatedAt field
    this.version(2).stores({
      conversations: '++id, uuid, created_at, storedAt, lastUpdatedAt',
    }).upgrade(async trans => {
      // Set lastUpdatedAt to storedAt for existing records
      await trans.table('conversations').toCollection().modify(conversation => {
        conversation.lastUpdatedAt = conversation.storedAt;
      });
    });
  }
}

export const db = new ClaudeObsidianDB();

// Helper functions
export async function saveConversation(conversation: ClaudeConversation): Promise<number> {
  // Check if conversation already exists
  const existing = await db.conversations.where('uuid').equals(conversation.uuid).first();
  
  if (existing) {
    // Update existing conversation
    const updated: StoredConversation = {
      ...conversation,
      id: existing.id,
      storedAt: existing.storedAt,
      lastUpdatedAt: new Date(),
    };
    await db.conversations.put(updated);
    return existing.id!;
  } else {
    // Create new conversation
    const stored: StoredConversation = {
      ...conversation,
      storedAt: new Date(),
      lastUpdatedAt: new Date(),
    };
    return await db.conversations.add(stored);
  }
}

export async function getConversation(uuid: string): Promise<StoredConversation | undefined> {
  return await db.conversations.where('uuid').equals(uuid).first();
}

export async function getAllConversations(): Promise<StoredConversation[]> {
  // Get all conversations and sort by lastUpdatedAt (newest first)
  const conversations = await db.conversations.toArray();
  return conversations.sort((a, b) => {
    const dateA = a.lastUpdatedAt || a.storedAt;
    const dateB = b.lastUpdatedAt || b.storedAt;
    return dateB.getTime() - dateA.getTime();
  });
}

export async function deleteConversation(uuid: string): Promise<void> {
  await db.conversations.where('uuid').equals(uuid).delete();
}

export async function clearAllConversations(): Promise<void> {
  await db.conversations.clear();
}