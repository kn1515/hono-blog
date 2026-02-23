interface Env {
  GITHUB_TOKEN: string
}

interface DiscussionNode {
  title: string
  url: string
  reactionGroups: {
    content: string
    reactors: { totalCount: number }
  }[]
}

interface GraphQLResponse {
  data?: {
    repository?: {
      discussions?: {
        nodes: DiscussionNode[]
      }
    }
  }
  errors?: { message: string }[]
}

const QUERY = `
query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    discussions(first: 100, categoryId: "DIC_kwDONGoI-M4C3CnG") {
      nodes {
        title
        url
        reactionGroups {
          content
          reactors {
            totalCount
          }
        }
      }
    }
  }
}
`

export const onRequestGet: PagesFunction<Env> = async context => {
  const token = context.env.GITHUB_TOKEN
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const resp = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'ponnlog-blog',
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { owner: 'kn1515', name: 'hono-blog' },
    }),
  })

  if (!resp.ok) {
    return new Response(JSON.stringify({ error: 'GitHub API error' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const json = (await resp.json()) as GraphQLResponse
  if (json.errors) {
    return new Response(JSON.stringify({ error: 'GraphQL error' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const nodes = json.data?.repository?.discussions?.nodes || []

  const discussions = nodes.map(node => {
    const totalReactions = node.reactionGroups.reduce(
      (sum, g) => sum + g.reactors.totalCount,
      0,
    )
    const thumbsUp =
      node.reactionGroups.find(g => g.content === 'THUMBS_UP')?.reactors
        .totalCount || 0

    return {
      pathname: node.title,
      discussionUrl: node.url,
      totalReactions,
      thumbsUp,
    }
  })

  return new Response(JSON.stringify({ discussions }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
