import React from 'react';
import { FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { FormProps } from '.';
import { Select } from 'chakra-react-select';
import { useQuery } from 'react-query';
import { CachePrefixKeys } from '../../constants';
import { TemplateApi } from '../../apis';
import { CustomNumberInput } from './custom-number-input';

export const ModelForm = ({ parentForm }: FormProps) => {
  const extractorPointCloudListQuery = useQuery([CachePrefixKeys.TEMPLATE_EXTRACTOR_POINTCLOUD_NAME], () =>
    TemplateApi.getExtractorPointCloudList()
  );
  const extractorPointCloudList = React.useMemo(() => {
    if (extractorPointCloudListQuery.data)
      return extractorPointCloudListQuery.data.map((e) => {
        return { label: e, value: e };
      });
    else return [];
  }, [extractorPointCloudListQuery.data?.length]);

  const extractorTextListQuery = useQuery([CachePrefixKeys.TEMPLATE_EXTRACTOR_TEXT_NAME], () =>
    TemplateApi.getExtractorTextList()
  );
  const extractorTextList = React.useMemo(() => {
    if (extractorTextListQuery.data)
      return extractorTextListQuery.data.map((e) => {
        return { label: e, value: e };
      });
    else return [];
  }, [extractorTextListQuery.data?.length]);
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
        <Select
          defaultValue={{
            label: parentForm.getValues('config.model.extractor.pointcloud.name'),
            value: parentForm.getValues('config.model.extractor.pointcloud.name'),
          }}
          onChange={(val) => {
            if (!!val?.label) parentForm.setValue('config.model.extractor.pointcloud.name', val?.label);
          }}
          options={extractorPointCloudList}
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
          options={extractorTextList}
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
        <CustomNumberInput
          min={1}
          max={5}
          step={1}
          defVal={3}
          value={parentForm.watch('config.model.encoder.pointcloud.num_hidden_layer')}
          onChange={(val) => parentForm.setValue('config.model.encoder.pointcloud.num_hidden_layer', val)}
        />
      </FormControl>
      <Text fontSize="14px" fontWeight="500">
        Text
      </Text>
      <FormControl>
        <FormLabel>Number of hidden layers</FormLabel>
        <CustomNumberInput
          min={1}
          max={5}
          step={1}
          defVal={3}
          value={parentForm.watch('config.model.encoder.text.num_hidden_layer')}
          onChange={(val) => parentForm.setValue('config.model.encoder.text.num_hidden_layer', val)}
        />
      </FormControl>
    </VStack>
  );
};
