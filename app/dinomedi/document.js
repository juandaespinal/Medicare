import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.bgdataLayer = window.bgdataLayer || [];
function bge(){bgdataLayer.push(arguments);}
bge('init', "905533115567479296");
            `,
          }}
        />
        <script async src="https://api.topnotchs.site/ad/events.js?pixel_id=905533115567479296"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
