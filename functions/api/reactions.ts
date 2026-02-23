interface Env {
  GITHUB_TOKEN: string
}

function getCookie(request: Request, name: string): string | null {
  const cookies = request.headers.get('Cookie') || ''
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

interface DiscussionSearchResult {
  data?: {
    repository?: {
      discussions?: {
        nodes: {
          id: string
          title: string
          reactions: {
            totalCount: number
          }
          reactionGroups: {
            content: string
            reactors: { totalCount: number }
            viewerHasReacted: boolean
          }[]
        }[]
      }
    }
  }
}

const _FIND_DISCUSSION_QUERY = `
query($owner: String!, $name: String!, $term: String!) {
  repository(owner: $owner, name: $name) {
    discussions(first: 1, categoryId: "DIC_kwDONGoI-M4C3CnG") {
      nodes {
        id
        title
        reactions {
          totalCount
        }
        reactionGroups {
          content
          reactors {
            totalCount
          }
          viewerHasReacted
        }
      }
    }
  }
}
`

const SEARCH_DISCUSSION_QUERY = `
query($query: String!) {
  search(type: DISCUSSION, query: $query, first: 1) {
    nodes {
      ... on Discussion {
        id
        title
        reactions {
          totalCount
        }
        reactionGroups {
          content
          reactors {
            totalCount
          }
          viewerHasReacted
        }
      }
    }
  }
}
`

const ADD_REACTION_MUTATION = `
mutation($subjectId: ID!, $content: ReactionContent!) {
  addReaction(input: { subjectId: $subjectId, content: $content }) {
    reaction {
      content
    }
    subject {
      ... on Discussion {
        reactionGroups {
          content
          reactors {
            totalCount
          }
          viewerHasReacted
        }
      }
    }
  }
}
`

const REMOVE_REACTION_MUTATION = `
mutation($subjectId: ID!, $content: ReactionContent!) {
  removeReaction(input: { subjectId: $subjectId, content: $content }) {
    reaction {
      content
    }
    subject {
      ... on Discussion {
        reactionGroups {
          content
          reactors {
            totalCount
          }
          viewerHasReacted
        }
      }
    }
  }
}
`

async function graphql(
  token: string,
  query: string,
  variables: Record<string, string>,
) {
  const resp = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'ponnlog-blog',
    },
    body: JSON.stringify({ query, variables }),
  })
  return resp.json()
}

async function findDiscussion(token: string, pathname: string) {
  // Search for discussion by title matching the pathname
  const searchQuery = `repo:kn1515/hono-blog in:title "${pathname}" category:Comments`
  const result = (await graphql(token, SEARCH_DISCUSSION_QUERY, {
    query: searchQuery,
  })) as {
    data?: {
      search?: {
        nodes: {
          id: string
          title: string
          reactionGroups: {
            content: string
            reactors: { totalCount: number }
            viewerHasReacted: boolean
          }[]
        }[]
      }
    }
  }

  const nodes = result.data?.search?.nodes || []
  // Find exact match
  return nodes.find(n => n.title === pathname) || null
}

/** GET /api/reactions?path=/posts/hello-world/ */
export const onRequestGet: PagesFunction<Env> = async context => {
  const url = new URL(context.request.url)
  const pathname = url.searchParams.get('path')

  if (!pathname) {
    return new Response(JSON.stringify({ error: 'Missing path parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Use user token if available, otherwise server token
  const userToken = getCookie(context.request, 'gh_token')
  const token = userToken || context.env.GITHUB_TOKEN

  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const discussion = await findDiscussion(token, pathname)

  if (!discussion) {
    return new Response(
      JSON.stringify({
        thumbsUp: 0,
        viewerHasReacted: false,
        authenticated: !!userToken,
      }),
      { headers: { 'Content-Type': 'application/json' } },
    )
  }

  const thumbsUpGroup = discussion.reactionGroups.find(
    g => g.content === 'THUMBS_UP',
  )

  return new Response(
    JSON.stringify({
      thumbsUp: thumbsUpGroup?.reactors.totalCount || 0,
      viewerHasReacted: thumbsUpGroup?.viewerHasReacted || false,
      authenticated: !!userToken,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  )
}

/** POST /api/reactions  body: { path: string } */
export const onRequestPost: PagesFunction<Env> = async context => {
  const userToken = getCookie(context.request, 'gh_token')

  if (!userToken) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: { path?: string }
  try {
    body = (await context.request.json()) as { path?: string }
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const pathname = body.path
  if (!pathname) {
    return new Response(JSON.stringify({ error: 'Missing path' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const discussion = await findDiscussion(userToken, pathname)

  if (!discussion) {
    return new Response(
      JSON.stringify({ error: 'Discussion not found for this article' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const thumbsUpGroup = discussion.reactionGroups.find(
    g => g.content === 'THUMBS_UP',
  )
  const hasReacted = thumbsUpGroup?.viewerHasReacted || false

  // Toggle: remove if already reacted, add if not
  const mutation = hasReacted ? REMOVE_REACTION_MUTATION : ADD_REACTION_MUTATION

  const result = (await graphql(userToken, mutation, {
    subjectId: discussion.id,
    content: 'THUMBS_UP',
  })) as {
    data?: {
      addReaction?: {
        subject: {
          reactionGroups: {
            content: string
            reactors: { totalCount: number }
            viewerHasReacted: boolean
          }[]
        }
      }
      removeReaction?: {
        subject: {
          reactionGroups: {
            content: string
            reactors: { totalCount: number }
            viewerHasReacted: boolean
          }[]
        }
      }
    }
  }

  const updatedGroups =
    result.data?.addReaction?.subject.reactionGroups ||
    result.data?.removeReaction?.subject.reactionGroups ||
    []

  const updatedThumbsUp = updatedGroups.find(g => g.content === 'THUMBS_UP')

  return new Response(
    JSON.stringify({
      thumbsUp: updatedThumbsUp?.reactors.totalCount || 0,
      viewerHasReacted: updatedThumbsUp?.viewerHasReacted || false,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  )
}
