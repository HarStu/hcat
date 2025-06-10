import { z } from 'zod';

export const tools = {
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

