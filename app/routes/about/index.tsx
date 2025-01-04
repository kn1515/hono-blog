import { css } from "hono/css";
import { Fragment } from "hono/jsx/jsx-runtime";
import { Heading } from "../../components/Heading";
import { blue } from "../../styles/color";

const linkCss = css`
  color: ${blue};
  text-decoration: none;
`;

const profileCss = css`
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid ${blue};
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const profileImageCss = css`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const profileTextCss = css`
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
`;

const qualificationsCss = css`
  margin-top: 1rem;
`;

const qualificationCss = css`
  margin-bottom: 0.5rem;
`;

export const title = "about";

export default function About() {
  return (
    <Fragment>
      <Heading>Profile</Heading>
      <div class={profileCss}>
        <img
          src={"https://github.com/kn1515.png"}
          alt="Profile"
          class={profileImageCss}
        />
        <div class={profileTextCss}>
          <p>
            こんにちは！ぽんと申します。
            <br />
            ソフトウェアエンジニアとして、フロントエンドとバックエンドの両方の開発に携わっています。
          </p>
          <p>
            関関同立のうちいずれかの文系学部を卒業したのち、
            <br />
            2019年から現在まで、 とあるSIerで働いています。
          </p>
          <p>
            SecurityやOS、低レイヤな話題に関心があります。
            <br />
            趣味はプログラミング、読書、旅行です。新しい技術を学ぶことが大好きで、常にスキルを向上させるために努力しています。
          </p>
          <p>
            このブログでは、技術的なトピックや日常の出来事について書いています。ぜひご覧ください！
          </p>
        </div>
      </div>
      <Heading>所持資格</Heading>
      <div class={profileCss}>
        <div class={qualificationsCss}>
          <div class={qualificationCss}>
            <span>ITパスポート</span>
          </div>
          <div class={qualificationCss}>
            <span>基本情報技術者</span>
          </div>
          <div class={qualificationCss}>
            <span>応用情報技術者</span>
          </div>
          <div class={qualificationCss}>
            <span>情報処理安全確保支援士 (合格)</span>
          </div>
          <div class={qualificationCss}>
            <span>LPIC-1</span>
          </div>
          <div class={qualificationCss}>
            <span>AWS Certified Solutions Architect - Associate</span>
          </div>
          <div class={qualificationCss}>
            <span>Google Cloud Associate Cloud Engineer</span>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
