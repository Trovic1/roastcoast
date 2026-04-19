import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export interface DialogueLine {
  host: 'alex' | 'jamie'
  line: string
  sfx?: 'rimshot' | 'laugh' | 'gasp' | 'applause' | 'transition'
}

export async function generateRoastScript(roastData: any, profile: any): Promise<DialogueLine[]> {
  const prompt = `You are writing a hilarious roast podcast called "RoastCast" with two hosts:
- ALEX: The savage, dry-humor host. Delivers brutal but clever observations.
- JAMIE: The hype person who makes everything worse with reactions and additional burns.

Today's victim: GitHub user "${profile.username}"

Profile data:
- Account age: ${roastData.accountAgeYears} years
- Total public repos: ${roastData.totalRepos}
- Followers: ${profile.followers}, Following: ${profile.following} (ratio: ${roastData.followerRatio})
- Languages used: ${roastData.languages.join(', ') || 'None detected'}
- Abandoned repos (no updates in 12+ months): ${roastData.abandonedRepos.join(', ') || 'None'}
- Zero-star repos: ${roastData.zeroStarCount}
- Repos with no description: ${roastData.emptyDescCount}
- Suspicious repo names: ${roastData.suspiciousRepoNames.join(', ') || 'None'}
- Best repo: ${roastData.mostStarred ? `${roastData.mostStarred.name} (${roastData.mostStarred.stars} stars)` : 'Nothing noteworthy'}
- Bio: "${roastData.bio || 'empty — they could not even write a bio'}"
- Has a website: ${roastData.hasWebsite ? 'yes' : 'no'}
- Some repo names: ${roastData.repoNames.slice(0, 8).join(', ')}

Write a 90-second podcast script (15-20 dialogue lines). Be funny, smart, meme-aware, dev-culture savvy.
Roast their habits, name choices, abandonment issues, empty readmes, follower counts, and delusions of grandeur.
End with a "Final Score" rating out of 10 from Alex.

IMPORTANT: Return ONLY a valid JSON array. No markdown, no backticks, no explanation. Format exactly:
[
  { "host": "alex", "line": "...", "sfx": "transition" },
  { "host": "jamie", "line": "...", "sfx": "laugh" }
]

SFX options (use max 5 total, only when it truly lands): "rimshot" "laugh" "gasp" "applause" "transition"`

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.9,
    max_tokens: 2000,
  })

  const text = response.choices[0].message.content || '[]'
  const clean = text.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch {
    throw new Error('Failed to parse script — try again')
  }
}