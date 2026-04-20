import { NextRequest, NextResponse } from 'next/server'
import { mergeAudioFiles } from '@/lib/audio'
import fs from 'fs'
import path from 'path'
import os from 'os'

export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  try {
    const { audioData, username } = await req.json()
    if (!audioData || !Array.isArray(audioData)) {
      return NextResponse.json({ error: 'Invalid audio data' }, { status: 400 })
    }

    const outputPath = path.join(os.tmpdir(), `roastcast-${username}-${Date.now()}.mp3`)

    const buffers = audioData.map((item: any) => ({
      audio: Buffer.from(item.audio, 'base64'),
      sfx: item.sfx,
    }))

    await mergeAudioFiles(buffers, outputPath)

    const fileBuffer = fs.readFileSync(outputPath)
    fs.unlinkSync(outputPath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="roastcast-${username}.mp3"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Audio merge failed' }, { status: 500 })
  }
}