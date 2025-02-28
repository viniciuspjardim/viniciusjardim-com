import fs from 'fs'
import path from 'path'
import OpenAI from 'openai'
import { env } from '~/env.mjs'

export const openAi = new OpenAI({
  apiKey: env.OPEN_AI_API_KEY,
})

export async function createSpeech(slug: string, input: string) {
  const speechFile = path.resolve(`./public/${slug}.mp3`)

  const mp3 = await openAi.audio.speech.create({
    model: 'tts-1-hd',
    voice: 'nova',
    input,
  })

  console.log('createSpeech =>', { slug, speechFile })
  const buffer = Buffer.from(await mp3.arrayBuffer())
  await fs.promises.writeFile(speechFile, buffer)
}
