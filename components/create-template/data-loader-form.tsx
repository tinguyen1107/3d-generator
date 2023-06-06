import React from 'react';
import { FormControl, FormLabel, Text, VStack, Radio, RadioGroup, HStack, Checkbox } from '@chakra-ui/react';
import { FormProps } from '.';

export const DataLoaderForm = ({ parentForm }: FormProps) => {
  const [value, setValue] = React.useState('16');
  const [valueVal, setValueVal] = React.useState('16');
  return (
    <form>
      <VStack mt="10px" align="start">
        <Text fontSize="24px" fontWeight="800">
          Data loader
        </Text>

        <Text fontSize="18px" fontWeight="700">
          Train
        </Text>
        <FormControl>
          <FormLabel>Batch Size</FormLabel>
          <RadioGroup onChange={setValue} value={value}>
            <HStack direction="row">
              <Radio value="16">16 bits</Radio>
              <Radio value="32">32 bits</Radio>
              <Radio value="64">64 bits</Radio>
              <Radio value="128">128 bits</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Shuffle</FormLabel>
          <Checkbox />
        </FormControl>

        <Text fontSize="18px" fontWeight="700">
          Validation
        </Text>
        <FormControl>
          <FormLabel>Batch Size</FormLabel>
          <RadioGroup onChange={setValueVal} value={valueVal}>
            <HStack direction="row">
              <Radio value="16">16 bits</Radio>
              <Radio value="32">32 bits</Radio>
              <Radio value="64">64 bits</Radio>
              <Radio value="128">128 bits</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>
      </VStack>
    </form>
  );
};
