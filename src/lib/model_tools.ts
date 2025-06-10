import { z } from 'zod';

export type ToolName = 'winTheGame' | 'loseTheGame'

export const model_tools = {
  winTheGame: {
    description: "Use when the player has won the game you are roleplaying",
    parameters: z.object({}),
    execute: async ({ }) => {
      return true
    }
  },
  loseTheGame: {
    description: "Use when the player has lost the game you are roleplaying",
    parameters: z.object({}),
    execute: async ({ }) => {
      return true
    }
  }
}

