import { generateId } from 'ai'
import type { Message } from 'ai'
import { db } from '~/server/db/db'
import { eq, asc } from 'drizzle-orm'
import { chats, messages } from '~/server/db/schema'

import type { Game } from '~/lib/games'

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

export async function createChat(game: Game): Promise<string> {
  // TEMP PLACEHOLDER -- SHOULD BE REPLACED WITH DB IMPLEMENTATION
  const newId = generateId()

  await db.insert(chats).values({
    id: newId,
    createdAt: new Date(),
    systemPrompt: game.systemPrompt,
    gameName: game.name,
    requiredTools: game.requiredTools
  })

  return newId
}

export async function loadChat(id: string): Promise<Message[]> {
  const res = await db.select().from(messages).where(eq(messages.chatId, id)).orderBy(asc(messages.createdAt))
  const retrievedMessages: Message[] = res.map(msg => mapDbMsgToMessage(msg))
  return retrievedMessages
}

export async function saveChat({ id, newMessages }: { id: string, newMessages: Message[] }): Promise<void> {

  for (const msg of newMessages) {
    const cloneMsg = structuredClone(msg) as Message & { chatId: string }
    const insertMsg: typeof messages.$inferInsert = {
      ...cloneMsg,
      chatId: id,
      createdAt: cloneMsg.createdAt ? new Date(cloneMsg.createdAt) : new Date()
    }

    await db
      .insert(messages)
      .values(insertMsg)
      .onConflictDoUpdate({
        target: messages.id,
        set: {
          content: insertMsg.content,
          parts: insertMsg.parts,
          toolInvocations: insertMsg.toolInvocations,
          createdAt: insertMsg.createdAt
        }
      })
  }
}
