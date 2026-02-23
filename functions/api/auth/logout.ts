type Env = {}

export const onRequestPost: PagesFunction<Env> = async context => {
  const url = new URL(context.request.url)
  const returnTo = url.searchParams.get('return_to') || '/'

  return new Response(null, {
    status: 302,
    headers: {
      Location: returnTo,
      'Set-Cookie':
        'gh_token=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0',
    },
  })
}
