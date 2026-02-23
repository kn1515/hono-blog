import { css } from 'hono/css'
import { Fragment } from 'hono/jsx/jsx-runtime'
import { Heading } from '../../components/Heading'
import { blue } from '../../styles/color'

const linkCss = css`
  color: ${blue};
  text-decoration: none;
`

const sectionCss = css`
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid ${blue};
  border-radius: 8px;
  background-color: var(--c-card-bg);
`

const paragraphCss = css`
  margin-bottom: 1rem;
  line-height: 1.5;
  color: var(--c-text-muted);
`

export const title = 'UserTerms'

export default function UserTerms() {
  return (
    <Fragment>
      <Heading>利用規約</Heading>
      <div class={sectionCss}>
        <p class={paragraphCss}>
          以下の各事項をご了承の上、当サイトをご利用ください。
        </p>
        <h2>リンクについて</h2>
        <p class={paragraphCss}>
          当サイトへのリンクを規制することは原則ありません。但し、以下のサイトについてのリンクは禁止とさせていただきます。
        </p>
        <ul>
          <li>当サイトを誹謗中傷するサイトからのリンク</li>
          <li>公序良俗に反するサイトまたは関連するサイトからのリンク</li>
          <li>違法なコンテンツや活動に関与したサイトからのリンク</li>
          <li>その他当サイトが不適切と判断するリンク</li>
        </ul>
        <h2>当サイトから外部サイトへのリンクについて</h2>
        <p class={paragraphCss}>
          当サイトからのリンク先サイトから発生するあらゆる問題に対して当サイトは一切の責任を負いません。
          <br />
          当サイトはユーザー様への便宜のためにリンクを提供いたしますが、当サイトが推薦していることを意味するものではありません。
        </p>
        <h2>著作権について</h2>
        <p class={paragraphCss}>
          当サイト上の文章、画像、映像、音楽、音声、その他の著作物は当ブログおよび運営者、関連会社、第三者有する著作権、特許権、商標権その他の権利により保護されております。
          <br />
          許可なしに、本サービスを通じて入手するいかなる情報、ソフトウェア、製品またはサービスに対しても、変更、複写、頒布、上映、複製、出版、許諾、二次的著作物の作成、譲渡あるいは販売などを行うことはできません。
        </p>
        <h2>プライバシーおよび個人情報の保護</h2>
        <p class={paragraphCss}>
          当サイトのご利用は、ユーザー様ご自身の責任によるものとします。当サイトから入手された情報、データ類により発生した、いかなる問題、損害に関しても一切の責任を負いません。
        </p>
        <h2>クッキー(cookie)について</h2>
        <p class={paragraphCss}>
          当サイトは、ウェブページのアクセス解析サービスであるGoogle
          Analyticsを利用しています。
          <br />
          そのため、一部ページにおいて同サービスにより提供されるcookieを使用しています。
          <br />
          cookieに関する情報、収集される情報についての詳細は、Google
          Analyticsのプライバシーポリシーをご確認ください。
        </p>
        <h2>本利用規約について</h2>
        <p class={paragraphCss}>
          当サイトは、以上の利用規約を必要に応じて予告なく改訂する場合があることをご了承ください。
        </p>
      </div>
    </Fragment>
  )
}
