import React from 'react';
import { Box, Button, Center, Grid, GridItem, HStack, Input, Spinner, Text } from '@chakra-ui/react';
import { Wrapper } from '../';

type PredictDto = {
  abc: {
    pred_ids: [string];
    scores: [number];
  };
};

export const Playround = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [listItem, setListItem] = React.useState<string[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);

  const handleOnSubmitButtonClick = React.useCallback(async () => {
    console.log('Submit: ', inputRef.current?.value);
    if (!!inputRef.current && !!inputRef.current.value) {
      const value = inputRef.current.value;
      setLoading(true);

      const res = (await blackbox(value)) as [string];
      setListItem(res);

      setLoading(false);

      // Clear input field
      inputRef.current.value = '';
    }
  }, []);

  const blackbox = React.useCallback(async (input: string) => {
    // let url = new URL('/predict', 'http://0.0.0.0:8888');
    // url.searchParams.append('n_item', '4');
    // url.searchParams.append('sentence', input);
    //
    // const rawRes = (await axios.get(url.toString(), { headers: {} })).data;
    // const res: PredictDto = JSON.parse(rawRes);
    //
    // return res.abc.pred_ids.slice(0, 4).map((e: string) => e + '.obj');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    let result: string[] = [];
    while (result.length < 4) {
      result.push(String(Math.floor(Math.random() * 11)));
    }
    return result.map((e) => e + '.obj');
  }, []);

  // TODO: select models
  return (
    <>
      <Text fontSize="36px" fontWeight="700">
        Zoogle | 3D Generator
      </Text>
      <Text fontSize="24px" fontWeight="700">
        Input any text
      </Text>
      <HStack mt="10px">
        <Input ref={inputRef} placeholder="Abc.." />
        <Button onClick={handleOnSubmitButtonClick}>Submit</Button>
      </HStack>
      <Box overflowY="auto">
        {isLoading ? (
          <Center w="100%" h="400px">
            <Spinner size="xl" thickness="4px" opacity="0.6" />
          </Center>
        ) : listItem.length == 0 ? (
          <Center w="100%" h="400px">
            <Text fontSize="32px" fontWeight="500" opacity="0.5">
              No Models found
            </Text>
          </Center>
        ) : (
          <Grid
            mt="15px"
            flex={1}
            w="100%"
            templateColumns={{
              base: 'repeat(1, minmax(300px, 1fr))',
              md: `repeat(${listItem.length / 2}, minmax(300px, 1fr))`,
            }}
            gap="10px"
          >
            {listItem.map((item, id) => (
              <GridItem key={`${id}_${item}`} h="300px">
                <Box h="100%" border="solid 1px #bbb" borderRadius="10px" overflow="hidden">
                  <Wrapper link={item} />
                </Box>
              </GridItem>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
};
