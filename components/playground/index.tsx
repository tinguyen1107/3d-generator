import React from 'react';
import { Box, Button, Center, Grid, GridItem, HStack, Input, Spinner, Text, VStack } from '@chakra-ui/react';
import { Wrapper } from '../';
import { Select } from 'chakra-react-select';
import { CachePrefixKeys } from '../../constants';
import { ModelApi, TemplateApi } from '../../apis';
import { useQuery } from 'react-query';

type PredictDto = {
  abc: {
    pred_ids: [string];
    scores: [number];
  };
};

export const Playground = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [model, setModel] = React.useState<string>();
  const [listItem, setListItem] = React.useState<string[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);

  const handleOnSubmitButtonClick = React.useCallback(async () => {
    console.log('Submit: ', inputRef.current?.value);
    if (!!inputRef.current && !!inputRef.current.value && !!model) {
      const value = inputRef.current.value;
      setLoading(true);

      const predicts = await TemplateApi.predictWithTemplate(model, value);

      setListItem(predicts);

      setLoading(false);

      // Clear input field
      inputRef.current.value = '';
    }
  }, []);

  const listModelQuery = useQuery([CachePrefixKeys.MODEL_LIST], () => ModelApi.getModels());
  const listModels = React.useMemo(() => {
    if (listModelQuery.data)
      return listModelQuery.data.map((e) => {
        return {
          label: e,
          value: e,
          variant: 'outline', // The option variant overrides the global
        };
      });
    else return [];
  }, [listModelQuery.data]);

  // TODO: select models
  return (
    <>
      <Text fontSize="36px" fontWeight="700">
        Zoogle | 3D Generator
      </Text>
      <VStack maxW="500px" align="stretch">
        <Text fontSize="18px" fontWeight="700">
          Choose model
        </Text>
        <Select placeholder="Model 01..." onChange={(val) => setModel(val?.value)} options={listModels} />
        <Text fontSize="18px" fontWeight="700">
          Input any text
        </Text>
        <HStack>
          <Input ref={inputRef} placeholder="Abc.." />
          <Button colorScheme="blue" isLoading={isLoading} onClick={handleOnSubmitButtonClick}>
            Submit
          </Button>
        </HStack>
      </VStack>
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
