import React from 'react';
import { FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { FormProps } from '.';

export const ModelForm = ({ parentForm }: FormProps) => {
  return (
    <VStack mt="10px" align="start">
      <Text fontSize="24px" fontWeight="800">
        Model (3/4)
      </Text>
      <FormControl>
        <FormLabel>Embed Dim</FormLabel>
        <Input {...parentForm.register('config.model.embed_dim')} />
      </FormControl>

      <Text fontSize="18px" fontWeight="700">
        Extractor
      </Text>
      <Text fontSize="14px" fontWeight="500">
        Point Cloud {/* fetch api cho user chon /software/v1/extractor/list */}
      </Text>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input {...parentForm.register('config.model.extractor.pointcloud.name')} />
      </FormControl>
      <Text fontSize="14px" fontWeight="500">
        Text {/* fetch api cho user chon /software/v1/extractor/list */}
      </Text>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input {...parentForm.register('config.model.extractor.text.name')} />
      </FormControl>

      <Text fontSize="18px" fontWeight="700">
        Encoder
      </Text>
      <Text fontSize="14px" fontWeight="500">
        Point Cloud
      </Text>
      <FormControl>
        <FormLabel>Number of hidden layers</FormLabel>
        <Input {...parentForm.register('config.model.encoder.pointcloud.num_hidden_layer')} />
      </FormControl>
      <Text fontSize="14px" fontWeight="500">
        Text
      </Text>
      <FormControl>
        <FormLabel>Number of hidden layers</FormLabel>
        <Input {...parentForm.register('config.model.encoder.text.num_hidden_layer')} />
      </FormControl>
    </VStack>
  );
};
