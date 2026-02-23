import { Fragment } from 'hono/jsx/jsx-runtime'
import { HeroSection } from '../components/HeroSection'
import { Pagination } from '../components/Pagination'
import { PostGridContainer } from '../components/PostGridContainer'
import { PostSummarySection } from '../components/PostSummarySection'
import { ViewToggle } from '../components/ViewToggle'
import { getPinnedPosts, getPosts } from '../lib/posts'

export default function Top() {
  const pageNum = 1
  const { posts, hasPrev, hasNext } = getPosts(pageNum)
  const pinnedPosts = getPinnedPosts()
  return (
    <Fragment>
      <HeroSection pinnedPosts={pinnedPosts} />
      <ViewToggle />
      <div id='post-list-view' style='display:none;'>
        {posts.map(post => {
          return <PostSummarySection post={post} />
        })}
      </div>
      <div id='post-grid-view'>
        <PostGridContainer posts={posts} />
      </div>
      <Pagination pageNumber={pageNum} hasPrev={hasPrev} hasNext={hasNext} />
    </Fragment>
  )
}
