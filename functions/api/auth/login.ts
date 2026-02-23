interface Env {
  GITHUB_CLIENT_ID: string
}

export const onRequestGet: PagesFunction<Env> = async context => {
  const clientId = context.env.GITHUB_CLIENT_ID
  if (!clientId) {
    return new Response('OAuth not configured', { status: 500 })
  }

  const url = new URL(context.request.url)
  const returnTo = url.searchParams.get('return_to') || '/'

  // Generate a random state parameter for CSRF protection
  const state = btoa(
    JSON.stringify({
      returnTo,
      nonce: crypto.randomUUID(),
    }),
  )

  const redirectUri = `${url.origin}/api/auth/callback`

  const githubUrl = new URL('https://github.com/login/oauth/authorize')
  githubUrl.searchParams.set('client_id', clientId)
  githubUrl.searchParams.set('redirect_uri', redirectUri)
  githubUrl.searchParams.set('scope', 'public_repo')
  githubUrl.searchParams.set('state', state)

  // Store state in a short-lived cookie for verification
  return new Response(null, {
    status: 302,
    headers: {
      Location: githubUrl.toString(),
      'Set-Cookie': `gh_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=600`,
    },
  })
}
