import 'rsuite/dist/rsuite.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Box, Center, ChakraProvider, Spinner, Image } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from '../theme';
import { useInitialize } from '../hooks';
import RepIcon from '../assets/logos/RepIcon.svg';

import NextNProgress from 'nextjs-progressbar';

// PouchDB
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import '../styles/variables.css';
import '../styles/global.css';
import { WarningModal } from '../components';

PouchDB.plugin(PouchDBFind);

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function Root({ Component, pageProps }: AppPropsWithLayout) {
  if (!process.env.NEXT_RUNTIME && window.location.pathname === '/redirect') {
    var linkToNavigate;
    var instanceParams: any = {};
    // Replace these urls with your app package urls
    const whiteListedURLs = ['rep://com.rawbots.rep', 'rep://com.rawbots.rep/auth'];
    try {
      var url: any = new URL(location.href);
      var hash = url.hash.substr(1);
      var hashParams: any = {};
      if (hash) {
        hashParams = hash.split('&').reduce(function(result: any, item: any) {
          var parts = item.split('=');
          result[parts[0]] = parts[1];
          return result;
        }, {});
      }
      var queryParams: any = {};
      for (var key of url.searchParams.keys()) {
        queryParams[key] = url.searchParams.get(key);
      }
      var error = '';
      try {
        if (Object.keys(hashParams).length > 0 && hashParams.state) {
          instanceParams = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(hashParams.state)))) || {};
          if (hashParams.error) error = hashParams.error;
        } else if (Object.keys(queryParams).length > 0 && queryParams.state) {
          instanceParams = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(queryParams.state)))) || {};
          if (queryParams.error) error = queryParams.error;
        }
      } catch (e) {
        console.error(e);
      }

      // communicate to android/ios package
      if (whiteListedURLs.includes(instanceParams.redirectUri)) {
        linkToNavigate = instanceParams.redirectUri + location.search + location.hash;
        window.location.href = linkToNavigate;
      } else {
        console.error('Please whitelist, ', instanceParams.redirectUri, 'or use whitelisted URLs');
        // alert("Please whitelist, ", instanceParams.redirectUri, "or use whitelisted URLs")
      }
    } catch (err) {
      console.error(err, 'error in redirect');
      window.close();
    }
    return null;
  }
  return MyApp({ Component, pageProps } as any);
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  const { appState } = useInitialize();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <NextNProgress
          showOnShallow={true}
          options={{
            showSpinner: false,
          }}
        />
        {appState.loading.value && (
          <Center zIndex="1000" position="fixed" left="0" top="0" w="100%" h="100%">
            <Box position="relative">
              <Center position="absolute" top="50%" left="50%" transform="translate(-50%,-50%)">
                <Spinner w="60px" h="60px" color="violetPrimary" />
              </Center>
              <Image alt="" src={RepIcon.src} />
            </Box>
          </Center>
        )}
        {appState.ready.value && getLayout(<Component {...pageProps} />)}
        {appState.ready.value && (
          // <StorageDepositModal />
          <>
            <WarningModal />
          </>
        )}
      </ChakraProvider>
    </QueryClientProvider>
  );
}
