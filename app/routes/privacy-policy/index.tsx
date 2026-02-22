import { Author } from "../../components/Author";
import { css } from "hono/css";
import { Fragment } from "hono/jsx/jsx-runtime";
import { Heading } from "../../components/Heading";
import { blue } from "../../styles/color";

const linkCss = css`
  color: ${blue};
  text-decoration: none;
`;

const sectionCss = css`
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid ${blue};
  border-radius: 8px;
  background-color: var(--c-card-bg);
`;

const paragraphCss = css`
  margin-bottom: 1rem;
  line-height: 1.5;
  color: var(--c-text-muted);
`;

export const title = "Contact";

export default function Contact() {
  return (
    <Fragment>
      <br />
      当サイトのお問い合わせにつきましては、X(旧Twitter)のDMよりお願いいたします。
      <br />
      <Author />
      <Heading>プライバシーポリシー</Heading>
      <div class={sectionCss}>
        <p class={paragraphCss}>
          ponnlog.com（以下、当サイト）では、「個人情報保護方針(プライバシーポリシー)」を定め個人情報の適切な管理・保護に努めることを表明します。
        </p>
        <p class={paragraphCss}>
          以下の個人情報保護の基本方針は、当サイト及び管轄のメールアドレス経由で入手した個人情報に対して適用されます。
        </p>
        <h2>個人情報</h2>
        <p class={paragraphCss}>
          個人情報とは、当サイトの運営者、ユーザーなど、個人に関する情報であり、当該情報に含まれる特定の個人を識別することができるものを指します。
        </p>
        <h2>当サイトが扱う個人情報</h2>
        <p class={paragraphCss}>
          当サイトが保護する対象の個人情報は以下の範囲と定めます。
        </p>
        <ul>
          <li>お問い合わせより送信していただいた個人情報</li>
          <li>当サイト管轄のメールアドレスに送信していただいた個人情報</li>
        </ul>
        <h2>個人情報の利用目的</h2>
        <p class={paragraphCss}>
          当サイトが取得した個人情報は、以下の目的のために利用いたします。
        </p>
        <ul>
          <li>サービスの提供、ご案内、更新、変更のため</li>
          <li>マーケティング、調査及び分析のため</li>
        </ul>
        <h2>個人情報の管理</h2>
        <p class={paragraphCss}>
          当サイトは収集した個人情報を、厳重に管理し、「個人情報の保護に関する法律」を遵守します。
        </p>
        <h2>個人情報の開示</h2>
        <p class={paragraphCss}>
          当サイトは司法当局等からの要請がある場合を除き、本人の同意なしに第三者に個人情報を提供しません。
        </p>
        <h2>本プライバシーポリシーについて</h2>
        <p class={paragraphCss}>
          当サイトは以上のポリシーを必要に応じて予告なく改訂する場合があることをご了承ください。
        </p>
      </div>
    </Fragment>
  );
}
