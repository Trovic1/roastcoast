import { NextRequest, NextResponse } from 'next/server'
import { generateRoastScript } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { profile, roastData } = await req.json()
    if (!profile || !roastData) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const script = await generateRoastScript(roastData, profile)
    return NextResponse.json({ script })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Script generation failed' }, { status: 500 })
  }
}