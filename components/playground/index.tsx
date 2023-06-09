import React from 'react';
import { Box, Button, Center, Grid, GridItem, HStack, Input, Spinner, Text, VStack } from '@chakra-ui/react';
import { Wrapper } from '../';
import { Select } from 'chakra-react-select';
import { CachePrefixKeys } from '../../constants';
import { ModelApi, TemplateApi } from '../../apis';
import { useQuery } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useRouter } from 'next/router';

export const Playground = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [model, setModel] = React.useState<string>();
  const [listItem, setListItem] = React.useState<string[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const router = useRouter()

  const handleOnSubmitButtonClick = React.useCallback(async () => {
    console.log('Submit: ', inputRef.current?.value);
    if (!!inputRef.current && !!inputRef.current.value && !!model) {
      console.log("model", model)
      const value = inputRef.current.value;
      setLoading(true);

      const predicts = await TemplateApi.predictWithTemplate(model, value);

      setListItem(predicts);

      const url = new URL("render-model", window.location.origin);
      url.searchParams.append("id", "0");
      url.searchParams.append("models", predicts.join(','))
      router.push(url)

      setLoading(false);

      // Clear input field
      inputRef.current.value = '';
    }
  }, [model]);

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
    else return [{ label: "a", value: "b" }];
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
        <Select placeholder="Model 01..." onChange={(val) => {
          console.log("FUCK", val)
          setModel(val?.value)
        }} options={listModels} />
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
    </>
  );
};
