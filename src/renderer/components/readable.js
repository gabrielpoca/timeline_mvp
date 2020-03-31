import { JSDOM } from "jsdom";
import * as Readability from "readability";

export default function readable(url, content) {
  const doc = new JSDOM(content, { url });
  const reader = new Readability(doc.window.document);
  const article = reader.parse();

  const newDoc = new JSDOM(article.content, { url });

  const style = newDoc.window.document.createElement("style");
  style.type = "text/css";
  style.appendChild(newDoc.window.document.createTextNode(css));
  newDoc.window.document.head.appendChild(style);

  const link = newDoc.window.document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css?family=Merriweather|Zilla+Slab&display=swap";

  newDoc.window.document.head.appendChild(link);

  const script = newDoc.window.document.createElement("script");
  script.type = "text/javascript";
  script.appendChild(newDoc.window.document.createTextNode(js));
  newDoc.window.document.head.appendChild(script);

  return newDoc.serialize();
}

const js = `
        window.document.addEventListener('click', (e) => {
          e.preventDefault();
          
          window.parent.postMessage({ type: 'iframeClick', url: e.target.closest('a').href });
        });
      `;

const css = `
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-size: 20px;
          font-family: inherit;
        }

        body,
        html {
          width: 100%;
          height: 100%;
          font-size: 20px;
          line-height: 1.4;
          font-family: 'Zilla Slab', sans-serif;
        }

        img {
          height: 100%;
          max-width: calc(100% - 4rem);
          margin: 2rem 0;
          border: 1px solid #333;
        }

        a {
          color: #333;
        }

        h1, h2, h3, h4, h5 {
          font-family: 'Merriweather', serif;
        }

        h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5em;
        }

        h2 {
          font-size: 2rem;
          margin: 1em 0 0.5em;
        }

        h3 {
          font-size: 1.8rem;
          margin: 1em 0 0.5em;
        }

        h4 {
          font-size: 1.6rem;
          margin: 1em 0 0.5em;
        }

        ul,
        ol {
          list-style-type: initial;
          list-style-position: inside;
          margin-top: 1rem;
          margin-bottom: 2rem;
        }

        ol ul,
        ol ul,
        ul ol,
        ul ul {
          padding-left: 2rem;
          margin: 0;
        }

        li {
          margin-bottom: 0.5rem;
        }

        p {
          margin-bottom: 1rem;
        }

        pre {
          background: #f1f1f1;
          padding: 24px;
          margin-bottom: 24px;
          overflow: scroll;
        }

        code {
          font-family: Menlo;
        }

        blockquote {
          border-left: 4px solid #333;
          padding: 4px 0 4px 16px;
          margin-bottom: 24px;
        }

        blockquote p:last-child {
          margin: 0;
        }
      `;
