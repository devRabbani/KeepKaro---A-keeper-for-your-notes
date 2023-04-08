import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Now Keep your all important notes, links and share with your friends"
        />
        <meta name="theme-color" content="#d90429" />
        <meta name="color-scheme" content="light dark" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://keepkaro.canwebe.in" />
        <meta name="twitter:title" content="KeepKaro" />
        <meta
          name="twitter:description"
          content="Now Keep your all important notes, links and share with your friends"
        />
        <meta
          name="twitter:image"
          content="https://keepkaro.canwebe.in/logo192.png"
        />
        <meta name="twitter:creator" content="@Iamrrk__" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="KeepKaro" />
        <meta
          property="og:description"
          content="Now Keep your all important notes, links and share with your friends"
        />
        <meta property="og:site_name" content="KeepKaro" />
        <meta property="og:url" content="https://keepkaro.canwebe.in" />
        <meta
          property="og:image"
          content="https://keepkaro.canwebe.in/logo512.png"
        />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
