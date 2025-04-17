import OpenAI from 'openai'
import { env } from '~/env'

export const openAi = new OpenAI({
  apiKey: env.OPEN_AI_API_KEY,
})

export async function createSpeech(input: string) {
  const mp3 = await openAi.audio.speech.create({
    model: 'gpt-4o-mini-tts',
    voice: 'nova',
    input,
    // TODO: add model instructions
    instructions: '',
  })

  return Buffer.from(await mp3.arrayBuffer())
}
