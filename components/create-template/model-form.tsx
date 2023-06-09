import React from 'react';
import { FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { FormProps } from '.';
import { Select } from 'chakra-react-select';
import { useQuery } from 'react-query';
import { CachePrefixKeys } from '../../constants';
import { TemplateApi } from '../../apis';

export const ModelForm = ({ parentForm }: FormProps) => {
  const extractorListQuery = useQuery([CachePrefixKeys.TEMPLATE_EXTRACTOR_TEXT_NAME], () =>
    TemplateApi.getExtractorList()
  );
  const extractorList = React.useMemo(() => {
    if (extractorListQuery.data)
      return extractorListQuery.data.map((e) => {
        return { label: e, value: e };
      });
    else return [];
  }, [extractorListQuery.data?.length]);
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
        <FormLabel>Name{JSON.stringify(extractorList)}</FormLabel>
        <Select
          defaultValue={{
            label: parentForm.getValues('config.model.extractor.pointcloud.name'),
            value: parentForm.getValues('config.model.extractor.pointcloud.name'),
          }}
          onChange={(val) => {
            if (!!val?.label) parentForm.setValue('config.model.extractor.pointcloud.name', val?.label);
          }}
          options={extractorList}
        />
      </FormControl>
      <Text fontSize="14px" fontWeight="500">
        Text {/* fetch api cho user chon /software/v1/extractor/list */}
      </Text>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Select
          defaultValue={{
            label: parentForm.getValues('config.model.extractor.text.name'),
            value: parentForm.getValues('config.model.extractor.text.name'),
          }}
          onChange={(val) => {
            if (!!val?.label) parentForm.setValue('config.model.extractor.text.name', val?.label);
          }}
          options={extractorList}
        />
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
