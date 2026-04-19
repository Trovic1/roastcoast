import { NextRequest, NextResponse } from 'next/server'
import { analyzeGitHub, buildRoastData } from '@/lib/github'

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json()
    if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 })

    const clean = username
      .replace(/^https?:\/\/github\.com\//i, '')
      .replace(/\//g, '')
      .trim()

    if (!/^[a-zA-Z0-9-]{1,39}$/.test(clean)) {
      return NextResponse.json({ error: 'Invalid GitHub username' }, { status: 400 })
    }

    const profile = await analyzeGitHub(clean)
    const roastData = buildRoastData(profile)

    return NextResponse.json({ profile, roastData })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Analysis failed' }, { status: 500 })
  }
}