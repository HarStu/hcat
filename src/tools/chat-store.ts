import { generateId } from 'ai'
import type { Message } from 'ai'
import { existsSync, mkdirSync } from 'fs'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'
import { db } from '~/server/db/db'
import { chats } from '~/server/db/schema'

export async function createChat(): Promise<String> {
  // TEMP PLACEHOLDER -- SHOULD BE REPLACED WITH DB IMPLEMENTATION
  const newId = generateId()
  await writeFile(getChatFile(newId), '[]') // create chat file

  await db.insert(chats).values({
    id: newId as string,
    createdAt: new Date()
  })

  return newId
}

function getChatFile(id: string): string {
  const chatDir = path.join(process.cwd(), '.chats')
  if (!existsSync(chatDir)) {
    mkdirSync(chatDir, { recursive: true })
  }
  return path.join(chatDir, `${id}.json`)
}

export async function loadChat(id: string): Promise<Message[]> {
  return JSON.parse(await readFile(getChatFile(id), 'utf8'))
}

export async function saveChat({ id, messages }: { id: string, messages: Message[] }): Promise<void> {
  const content = JSON.stringify(messages, null, 2);
  await writeFile(getChatFile(id), content)
  console.log(await readFile(getChatFile(id), 'utf8'))
}