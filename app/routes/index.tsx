import { Fragment } from "hono/jsx/jsx-runtime";
import { Pagination } from "../components/Pagination";
import { PostGridContainer } from "../components/PostGridContainer";
import { PostSummarySection } from "../components/PostSummarySection";
import ViewToggle from "../islands/ViewToggle";
import { getPosts } from "../lib/posts";

export default function Top() {
  const pageNum = 1;
  const { posts, hasPrev, hasNext } = getPosts(pageNum);
  return (
    <Fragment>
      <ViewToggle>
        <div data-view="list" style="display:none;">
          {posts.map((post) => {
            return <PostSummarySection post={post} />;
          })}
        </div>
        <div data-view="grid">
          <PostGridContainer posts={posts} />
        </div>
      </ViewToggle>
      <Pagination pageNumber={pageNum} hasPrev={hasPrev} hasNext={hasNext} />
    </Fragment>
  );
}
