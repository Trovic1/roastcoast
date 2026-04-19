import { NextRequest, NextResponse } from 'next/server'
import { generateAllLines } from '@/lib/elevenlabs'

export async function POST(req: NextRequest) {
  try {
    const { script } = await req.json()
    if (!script || !Array.isArray(script)) {
      return NextResponse.json({ error: 'Invalid script' }, { status: 400 })
    }

    const audioBuffers = await generateAllLines(script)

    const audioData = audioBuffers.map((item, i) => ({
      host: item.host,
      audio: item.audio.toString('base64'),
      sfx: script[i]?.sfx || null,
    }))

    return NextResponse.json({ audioData })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Voice generation failed' }, { status: 500 })
  }
}