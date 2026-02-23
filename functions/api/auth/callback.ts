interface Env {
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
}

function getCookie(request: Request, name: string): string | null {
  const cookies = request.headers.get('Cookie') || ''
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export const onRequestGet: PagesFunction<Env> = async context => {
  const url = new URL(context.request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  if (!code || !state) {
    return new Response('Missing code or state', { status: 400 })
  }

  // Verify state matches the cookie
  const savedState = getCookie(context.request, 'gh_oauth_state')
  if (!savedState || savedState !== state) {
    return new Response('Invalid state parameter', { status: 403 })
  }

  // Parse return URL from state
  let returnTo = '/'
  try {
    const parsed = JSON.parse(atob(state))
    returnTo = parsed.returnTo || '/'
  } catch {
    // fallback to root
  }

  // Exchange code for access token
  const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'ponnlog-blog',
    },
    body: JSON.stringify({
      client_id: context.env.GITHUB_CLIENT_ID,
      client_secret: context.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })

  if (!tokenResp.ok) {
    return new Response('Failed to exchange token', { status: 502 })
  }

  const tokenData = (await tokenResp.json()) as {
    access_token?: string
    error?: string
  }

  if (tokenData.error || !tokenData.access_token) {
    return new Response(`OAuth error: ${tokenData.error || 'unknown'}`, {
      status: 400,
    })
  }

  // Set token as httpOnly cookie and redirect back
  const cookieOptions = [
    `gh_token=${tokenData.access_token}`,
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    'Path=/api',
    'Max-Age=604800', // 7 days
  ].join('; ')

  // Clear the OAuth state cookie
  const clearState =
    'gh_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=0'

  return new Response(null, {
    status: 302,
    headers: [
      ['Location', returnTo],
      ['Set-Cookie', cookieOptions],
      ['Set-Cookie', clearState],
    ],
  })
}
