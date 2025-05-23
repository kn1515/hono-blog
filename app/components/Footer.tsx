import { format } from "@formkit/tempo";
import { css } from "hono/css";
import { blue } from "../styles/color";
import { verticalRhythmUnit } from "../styles/variables";

const footerCss = css`
  padding: ${verticalRhythmUnit}rem 0;
  text-align: center;

  & span {
    display: inline-block;
    padding-top: ${verticalRhythmUnit * 0.5}rem;
    font-size: 0.8rem;
  }

  & a {
    color: ${blue};
    text-decoration: none;
  }
`;

export function Footer() {
  const now = new Date();
  return (
    <footer class={footerCss}>
      {/*
      <script
        async
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      />
      <ins
        class='adsbygoogle'
        style='display: block'
        data-ad-client='ca-pub-4xxxxxxxxxxxxxxx'
        data-ad-slot='24xxxxxxxx'
        data-ad-format='auto'
        data-full-width-responsive='true'
      />
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      <span>
        このサイトではアクセス解析のためにCookieを利用した
        <a href='https://policies.google.com/technologies/partner-sites'>
          Google Analytics
        </a>
        を使用しています。
      </span>
      <br />
      */}
      <span>
        &copy;<time datetime={format(now)}>{format(now, "YYYY")}</time>
        &nbsp;ぽん. Powered By{" "}
        <a href="https://hono.dev/" target="_blank" rel="noopener noreferrer">
          Hono
        </a>
        .
      </span>
      <br className="sm:hidden block" />
      <a href="/user-terms/" target="_blank" rel="noopener noreferrer">
        利用規約
      </a>{" "}
      | <a href="/privacy-policy/">プライバシーポリシー</a>
      <script
        data-name="BMC-Widget"
        data-cfasync="false"
        src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
        data-id="nakata17893"
        data-description="よろしければ投げ銭をお願いします！"
        data-message=""
        data-color="#FF813F"
        data-position="Right"
        data-x_margin="18"
        data-y_margin="18"
      ></script>
    </footer>
  );
}
