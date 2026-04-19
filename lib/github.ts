export interface GitHubProfile {
  username: string
  name: string | null
  bio: string | null
  followers: number
  following: number
  public_repos: number
  created_at: string
  avatar_url: string
  location: string | null
  company: string | null
  blog: string | null
  repos: RepoData[]
}

export interface RepoData {
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
  open_issues_count: number
  size: number
}

export async function analyzeGitHub(username: string): Promise<GitHubProfile> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  }

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers }),
  ])

  if (!userRes.ok) {
    if (userRes.status === 404) throw new Error('GitHub user not found')
    throw new Error('Failed to fetch GitHub profile')
  }

  const user = await userRes.json()
  const repos: any[] = reposRes.ok ? await reposRes.json() : []

  const repoData: RepoData[] = repos.slice(0, 20).map((r) => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stargazers_count: r.stargazers_count,
    forks_count: r.forks_count,
    updated_at: r.updated_at,
    topics: r.topics || [],
    open_issues_count: r.open_issues_count,
    size: r.size,
  }))

  return {
    username: user.login,
    name: user.name,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    public_repos: user.public_repos,
    created_at: user.created_at,
    avatar_url: user.avatar_url,
    location: user.location,
    company: user.company,
    blog: user.blog,
    repos: repoData,
  }
}

export function buildRoastData(profile: GitHubProfile) {
  const now = new Date()

  const abandonedRepos = profile.repos.filter((r) => {
    const monthsAgo = (now.getTime() - new Date(r.updated_at).getTime()) / (1000 * 60 * 60 * 24 * 30)
    return monthsAgo > 12
  })

  const languages = [...new Set(profile.repos.map((r) => r.language).filter(Boolean))]
  const accountAgeYears = Math.floor(
    (now.getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)
  )

  const suspiciousRepoNames = profile.repos.filter((r) =>
    /todo|test|temp|asdf|untitled|new-|copy|backup|old|learning|practice|tutorial/i.test(r.name)
  )

  const mostStarred = [...profile.repos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0]

  return {
    accountAgeYears,
    abandonedRepos: abandonedRepos.map((r) => r.name),
    zeroStarCount: profile.repos.filter((r) => r.stargazers_count === 0).length,
    emptyDescCount: profile.repos.filter((r) => !r.description).length,
    languages,
    suspiciousRepoNames: suspiciousRepoNames.map((r) => r.name),
    mostStarred: mostStarred
      ? { name: mostStarred.name, stars: mostStarred.stargazers_count }
      : null,
    followerRatio:
      profile.following > 0
        ? (profile.followers / profile.following).toFixed(2)
        : 'infinity',
    totalRepos: profile.public_repos,
    bio: profile.bio,
    hasWebsite: !!profile.blog,
    repoNames: profile.repos.map((r) => r.name),
  }
}