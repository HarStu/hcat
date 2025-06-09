import { generateId } from 'ai'
import type { Message } from 'ai'
import { existsSync, mkdirSync } from 'fs'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'

export async function createChat(): Promise<String> {
  const id = generateId()
  // TEMP PLACEHOLDER -- SHOULD BE REPLACED WITH DB IMPLEMENTATION
  await writeFile(getChatFile(id), '[]') // create 
  return id
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
}