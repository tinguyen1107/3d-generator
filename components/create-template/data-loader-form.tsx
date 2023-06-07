import React from 'react';
import { FormControl, FormLabel, Text, VStack, Radio, RadioGroup, HStack, Checkbox } from '@chakra-ui/react';
import { FormProps } from '.';

export const DataLoaderForm = ({ parentForm }: FormProps) => {
  return (
    <form>
      <VStack mt="10px" align="start">
        <Text fontSize="24px" fontWeight="800">
          Data loader (2/4)
        </Text>

        <Text fontSize="18px" fontWeight="700">
          Train
        </Text>
        <FormControl>
          <FormLabel>Batch Size</FormLabel>
          <RadioGroup
            value={`${parentForm.watch('config.data_loader.train.params.batch_size')}`}
            onChange={(val) => parentForm.setValue('config.data_loader.train.params.batch_size', Number(val))}
          >
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
          <Checkbox {...parentForm.register('config.data_loader.train.params.shuffle')} />
        </FormControl>

        <Text fontSize="18px" fontWeight="700">
          Validation
        </Text>
        <FormControl>
          <FormLabel>Batch Size</FormLabel>
          <RadioGroup
            value={`${parentForm.watch('config.data_loader.val.params.batch_size')}`}
            onChange={(val) => parentForm.setValue('config.data_loader.val.params.batch_size', Number(val))}
          >
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
