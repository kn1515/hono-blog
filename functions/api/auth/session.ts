type Env = {}

function getCookie(request: Request, name: string): string | null {
  const cookies = request.headers.get('Cookie') || ''
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export const onRequestGet: PagesFunction<Env> = async context => {
  const token = getCookie(context.request, 'gh_token')

  if (!token) {
    return new Response(JSON.stringify({ authenticated: false }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Fetch user info from GitHub
  const resp = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'ponnlog-blog',
    },
  })

  if (!resp.ok) {
    // Token is invalid/expired – clear it
    return new Response(JSON.stringify({ authenticated: false }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie':
          'gh_token=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0',
      },
    })
  }

  const user = (await resp.json()) as {
    login: string
    avatar_url: string
  }

  return new Response(
    JSON.stringify({
      authenticated: true,
      user: { login: user.login, avatarUrl: user.avatar_url },
    }),
    { headers: { 'Content-Type': 'application/json' } },
  )
}
