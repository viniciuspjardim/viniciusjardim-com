import OpenAI from 'openai'
import { env } from '~/env'

export const MAX_TEXT_SIZE = 4096

export const openAi = new OpenAI({
  apiKey: env.OPEN_AI_API_KEY,
})

function splitTextIntoChunks(text: string, maxChunkSize = MAX_TEXT_SIZE) {
  if (text.length <= maxChunkSize) {
    return [text]
  }

  let currentChunk = ''
  const chunks: string[] = []
  const lines = text.split('\n')

  for (const line of lines) {
    if (currentChunk.length + line.length + 1 <= maxChunkSize) {
      currentChunk = currentChunk + '\n' + line
    } else {
      chunks.push(currentChunk)
      currentChunk = line
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk)
  }

  return chunks
}

function concatenateMp3Buffers(buffers: Buffer[]) {
  return Buffer.concat(buffers)
}

export async function createSpeech(input: string) {
  const chunks = splitTextIntoChunks(input)

  if (chunks.length === 1) {
    const mp3 = await openAi.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice: 'nova',
      input: chunks[0]!,
    })

    return Buffer.from(await mp3.arrayBuffer())
  }

  const speechPromises = chunks.map(async (chunk) => {
    const mp3 = await openAi.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice: 'nova',
      input: chunk,
    })

    return Buffer.from(await mp3.arrayBuffer())
  })

  try {
    const mp3BufferResults = await Promise.all(speechPromises)
    return concatenateMp3Buffers(mp3BufferResults)
  } catch (_error) {
    throw new Error(`Failed to generate speech out of ${chunks.length} chunks`)
  }
}
