import { Html, Head, Main, NextScript } from 'next/document';
import { ColorModeScript } from '@chakra-ui/react';
import { theme } from '../theme';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.cdnfonts.com/css/sakkal-majalla-2" rel="stylesheet" />
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
      <script type="text/javascript" src="https://js.api.here.com/v3/3.1/mapsjs-core.js" defer />
      <script type="text/javascript" src="https://js.api.here.com/v3/3.1/mapsjs-service.js" defer />
      <script type="text/javascript" src="https://js.api.here.com/v3/3.1/mapsjs-ui.js" defer />
      <script type="text/javascript" src="https://js.api.here.com/v3/3.1/mapsjs-mapevents.js" defer />
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/2.3.1/jsencrypt.min.js"
        integrity="sha512-zDvrqenA0eFJZCxBsryzUZcvihvNlEXbteMv62yRxdhR4s7K1aaz+LjsRyfk6M+YJLyAJEuuquIAI8I8GgLC8A=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        defer
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__DRAFT_GKX = {
          'draft_tree_data_support': true,
        }`,
        }}
      ></script>
    </Html>
  );
}
