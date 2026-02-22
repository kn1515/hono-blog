import { Fragment } from "hono/jsx/jsx-runtime";
import { Pagination } from "../components/Pagination";
import { PostGridContainer } from "../components/PostGridContainer";
import { PostSummarySection } from "../components/PostSummarySection";
import { ViewToggle } from "../components/ViewToggle";
import { getPosts } from "../lib/posts";

export default function Top() {
  const pageNum = 1;
  const { posts, hasPrev, hasNext } = getPosts(pageNum);
  return (
    <Fragment>
      <ViewToggle />
      <div id="post-list-view">
        {posts.map((post) => {
          return <PostSummarySection post={post} />;
        })}
      </div>
      <div id="post-grid-view" style="display:none;">
        <PostGridContainer posts={posts} />
      </div>
      <Pagination pageNumber={pageNum} hasPrev={hasPrev} hasNext={hasNext} />
    </Fragment>
  );
}
