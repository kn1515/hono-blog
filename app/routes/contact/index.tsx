import { css } from 'hono/css'
import { Fragment } from 'hono/jsx/jsx-runtime'
import { Author } from '../../components/Author'
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

export const title = 'PrivacyPolicy'

export default function PrivacyPolicy() {
  return (
    <Fragment>
      <br />
      当サイトのお問い合わせにつきましては、X(旧Twitter)のDMよりお願いいたします。
      <br />
      個人情報の取り扱い等は利用規約、プライバシーポリシーをご参照ください。
      <br />
      <br />
      <Author />
      <a href='/user-terms/' target='_blank' rel='noopener noreferrer'>
        利用規約
      </a>
      <br />
      <a href='/privacy-policy/'>プライバシーポリシー</a>
    </Fragment>
  )
}
