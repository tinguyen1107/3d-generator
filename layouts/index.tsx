import React, { ReactNode } from 'react';
// import { HeaderLeft, HeaderType, HeaderRight, HeaderMid, FooterType, MainMenu } from '../components';
import { Box, Circle, HStack, Grid, GridItem, VStack, useColorMode, Text, Divider } from '@chakra-ui/react';
// import { FaAppStore, FaGooglePlay } from 'react-icons/fa';

export type LayoutType = 'single' | '1_2_1' | '6_8_10' | '1_3';

type LayoutProps = {
  type?: LayoutType;
  midChildren: React.ReactNode;
  rightChildren?: React.ReactNode;
  title?: string | ReactNode;
  privateKey?: CryptoKey;
  isBack?: boolean;
  showPostViewByBar?: boolean;
};

export const Layout: React.FunctionComponent<LayoutProps> = ({ type = '1_2_1', midChildren, rightChildren }) => {
  const headerHeight = { base: '55px', md: '80px' };
  const headerRef = React.useRef<any>();
  const col_span_left = {
    base: 0,
    md: 5,
    lg: 6,
  };

  const col_span_mid =
    type == '6_8_10'
      ? {
        base: 24,
        md: 19,
        lg: 8,
      }
      : type == '1_3'
        ? {
          base: 24,
          md: 19,
          lg: 18,
        }
        : {
          base: 24,
          md: 19,
          lg: 12,
        };

  const col_span_right =
    type == '6_8_10'
      ? {
        base: 0,
        md: 0,
        lg: 10,
      }
      : type == '1_3'
        ? {
          base: 0,
        }
        : {
          base: 0,
          md: 0,
          lg: 6,
        };

  // HEADER

  const col_span_left_header = {
    base: 0,
    md: 5,
    lg: 6,
  };

  const col_span_mid_header =
    type == 'single'
      ? {
        base: 24,
        md: 11,
        lg: 12,
      }
      : type == '6_8_10'
        ? {
          base: 24,
          md: 9,
          lg: 8,
        }
        : {
          base: 24,
          md: 11,
          lg: 12,
        };

  const col_span_right_header =
    type == '6_8_10'
      ? {
        base: 10,
        lg: 10,
      }
      : {
        base: 0,
        md: 8,
        lg: 6,
      };

  return (
    <Box
      sx={{
        '--container-max-width': '1116px',
      }}
      mb="30px"
    >
      {/* Background */}
      <HStack position="fixed" top="20%" w="100%" h="100%" margin="0 auto" justify="center" alignItems="top">
        <Circle
          size="490px"
          bg="#ff7a00"
          opacity={{ base: '0.3', sm: '0.5' }}
          filter={{ base: 'blur(40px)', sm: 'blur(100px)' }}
        />
        <Circle
          size="490px"
          bg="#9747FF"
          opacity={{ base: '0.3', sm: '0.5' }}
          filter={{ base: 'blur(40px)', sm: 'blur(100px)' }}
        />
      </HStack>
      {/* Header Background */}
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        h={headerHeight}
        ref={headerRef}
        zIndex="100"
        backdropFilter="auto"
        backdropBlur="50px"
      />
      <VStack width="100%" minH="calc(100vh - 100px)" position="relative">
        <Grid
          maxW="var(--container-max-width)"
          minW="200px"
          w="100%"
          padding={{ base: '0 15px', md: '0 24px' }}
          templateColumns={`repeat(24, minmax(0, 1fr))`}
          templateRows={`${headerHeight} minmax(0, 1fr)`}
          columnGap={{ base: '0px', md: '24px' }}
          rowGap="12px"
          h="100%"
        >
          {/* <GridItem top="0" zIndex="101" colSpan={24}>
            <HStack
              w="100%"
              p="5px"
              justifyContent="flex-end"
              spacing="12px"
              color="textPrimary"
            >
              <Text fontWeight="600">Download AR application</Text>
              <HStack
                spacing="5px"
                as="a"
                href="https://play.google.com/store/apps/details?id=com.Rawbots.RawbotsAR"
                target="blank"
                _hover={{
                  textDecoration: 'none',
                }}
                _focus={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <FaGooglePlay />
                <Text>Android</Text>
              </HStack>
              <HStack
                spacing="5px"
                as="a"
                href="https://apps.apple.com/vn/app/rawbots-ar/id1642849895"
                target="blank"
                _hover={{
                  textDecoration: 'none',
                }}
                _focus={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <FaAppStore />
                <Text>iOS</Text>
              </HStack>
            </HStack>
            <Divider />
          </GridItem> */}
          <GridItem
            top="0"
            position="sticky"
            zIndex="101"
            colSpan={col_span_left_header}
            h={headerHeight}
            display={{
              base: 'none',
              md: 'block',
            }}
          >
            {/*
             *<HeaderLeft headerHeight={headerHeight} /> */}
          </GridItem>
          <GridItem top="0" position="sticky" zIndex="101" colSpan={col_span_mid_header} h={headerHeight}>
            {/* type != 'single' ? (
              <HeaderMid
                title={title}
                isBack={isBack}
                privateKey={privateKey}
                headerHeight={headerHeight}
                showPostViewByBar={showPostViewByBar}
              />
            ) : (
              <HStack w="100%" height={headerHeight} justify="space-between" display={{ base: 'flex', md: 'none' }}>
                <HeaderLeft headerHeight={headerHeight} />
                <HeaderRight headerHeight={headerHeight} />
              </HStack>
            ) */}
          </GridItem>
          <GridItem
            top="0"
            position="sticky"
            zIndex="101"
            colSpan={col_span_right_header}
            h={headerHeight}
            display={{
              base: 'none',
              md: 'block',
            }}
          >
            {/*
              <HeaderRight headerHeight={headerHeight} />
                 */}
          </GridItem>
          {type != 'single' ? (
            <>
              <GridItem
                colSpan={col_span_left}
                display={{
                  base: 'none',
                  md: 'block',
                }}
              >
                {/*
                <MainMenu />
                 */}
              </GridItem>
              <GridItem colSpan={col_span_mid}>{midChildren}</GridItem>
              <GridItem
                colSpan={col_span_right}
                display={{
                  base: 'none',
                  lg: 'block',
                }}
              >
                <Box position="sticky" top="92px">
                  {rightChildren}
                </Box>
              </GridItem>
            </>
          ) : (
            <>
              <GridItem colSpan={24}>{midChildren}</GridItem>
            </>
          )}
        </Grid>
      </VStack>
    </Box>
  );
};
