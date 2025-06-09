import { generateId } from 'ai'
import type { Message, UIMessage } from 'ai'
import { existsSync, mkdirSync } from 'fs'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'
import { db } from '~/server/db/db'
import { eq, asc } from 'drizzle-orm'
import { chats, messages } from '~/server/db/schema'

type DbMessage = typeof messages.$inferSelect

function mapDbMsgToMessage(dbMessage: DbMessage): Message {
  return {
    id: dbMessage.id,
    parts: dbMessage.parts as Message['parts'],
    role: dbMessage.role as Message['role'],
    content: dbMessage.content,
    createdAt: dbMessage.createdAt ? new Date(dbMessage.createdAt) : undefined,
    toolInvocations: dbMessage.toolInvocations as Message['toolInvocations'] ?? undefined
  }
}

export async function createChat(): Promise<String> {
  // TEMP PLACEHOLDER -- SHOULD BE REPLACED WITH DB IMPLEMENTATION
  const newId = generateId()

  await db.insert(chats).values({
    id: newId as string,
    createdAt: new Date()
  })

  return newId
}

export async function loadChat(id: string): Promise<Message[]> {
  const res = await db.select().from(messages).where(eq(messages.chatId, id)).orderBy(asc(messages.createdAt))
  const retrievedMessages: Message[] = res.map(msg => mapDbMsgToMessage(msg))
  return retrievedMessages
}

export async function saveChat({ id, newMessages }: { id: string, newMessages: Message[] }): Promise<void> {
  for (let msg of newMessages) {
    let newMsg = structuredClone(msg) as Message & { chatId: string }
    newMsg.chatId = id
    const values: typeof messages.$inferInsert = newMsg
    await db.insert(messages).values(values)
  }
}