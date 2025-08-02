import { UTApi, UTFile } from 'uploadthing/server'

export const utApi = new UTApi()

export async function upload(buffer: Buffer, slug: string) {
  const file = new UTFile([new Uint8Array(buffer)], `${slug}.mp3`)
  return utApi.uploadFiles([file])
}
