export const VOICES = {
  alex: process.env.ELEVENLABS_VOICE_ALEX || 'pNInz6obpgDQGcFmaJgB',
  jamie: process.env.ELEVENLABS_VOICE_JAMIE || 'EXAVITQu4vr4xnSDxMaL',
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function addPacing(text: string): string {
  return text
    .replace(/\.\s/g, '.  ')
    .replace(/,\s/g, ',  ')
    .replace(/\?\s/g, '?  ')
    .replace(/!\s/g, '!  ')
    .replace(/\.\.\./g, '...  ')
}

export async function generateSpeech(text: string, host: 'alex' | 'jamie'): Promise<Buffer> {
  const voiceId = VOICES[host]
  const pacedText = addPacing(text)

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY!,
    },
    body: JSON.stringify({
      text: pacedText,
      model_id: 'eleven_turbo_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.4,
        use_speaker_boost: true,
      },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`ElevenLabs error: ${err}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

export async function generateAllLines(
  lines: Array<{ host: 'alex' | 'jamie'; line: string }>
): Promise<Array<{ host: string; audio: Buffer }>> {
  const results = []
  for (const line of lines) {
    const audio = await generateSpeech(line.line, line.host)
    results.push({ host: line.host, audio })
    await sleep(500)
  }
  return results
}