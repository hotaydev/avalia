import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <body className="grid-background bg-gray-50 min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
