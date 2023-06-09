import React from 'react';
import { Box, Button, HStack, SimpleGrid, Text, useToast } from '@chakra-ui/react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { DataLoaderForm } from './data-loader-form';
import { ModelForm } from './model-form';
import { TrainerForm } from './trainer-form';
import { GeneralInfoForm } from './general-info';
import { useForm, UseFormReturn } from 'react-hook-form';
import { CreateTemplateInputs } from '../../dtos';
import * as YAML from 'js-yaml';
import { CREATE_TEMPLATE_DEFAULT_VALUE, TEMPLATE_DATASET_DEFAULT, TEMPLATE_GLOBAL_DEFAULT } from '../../constants';
import { toastBaseConfig } from '../../utils';
import { useQueryClient } from 'react-query';
import { CachePrefixKeys } from '../../constants';
import { TemplateApi } from '../../apis';

export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

type TemplateId = 'general-info' | 'data_loader' | 'model' | 'trainer';

export interface FormProps {
  parentForm: UseFormReturn<CreateTemplateInputs, any, undefined>;
}

export const CreateTemplate = () => {
  const queryClient = useQueryClient();
  const [templateId, setTemplateId] = React.useState<TemplateId>('general-info');

  const createTemplateForm = useForm<CreateTemplateInputs>({ defaultValues: CREATE_TEMPLATE_DEFAULT_VALUE });
  const [isSubmiting, setIsSubmiting] = React.useState<boolean>(false);

  const toast = useToast();

  const handleCreateTemplateFormSubmit = React.useCallback(async (data: CreateTemplateInputs) => {
    console.log('Submit form with data: ', JSON.stringify(data, null, 2));
    // Start loading
    setIsSubmiting(true);
    try {
      // TODO: Submit data to server
      await sleep(5000);
      TemplateApi.createTemplate(data.name, {
        global: TEMPLATE_GLOBAL_DEFAULT,
        dataset: TEMPLATE_DATASET_DEFAULT,
        ...data.config,
      });

      // Update after created
      toast({ ...toastBaseConfig, title: 'Create template successfully', status: 'success' });
      queryClient.invalidateQueries([CachePrefixKeys.TEMPLATE_LIST]);
      createTemplateForm.reset();
    } catch (e) {
      // TODO: handle error
      toast({ ...toastBaseConfig, title: 'Create template failed', status: 'error' });
    } finally {
      // End loading
      setIsSubmiting(false);
    }
  }, []);

  const nextStep = React.useMemo(() => {
    switch (templateId) {
      case 'general-info':
        return () => setTemplateId('data_loader');
      case 'data_loader':
        return () => setTemplateId('model');
      case 'model':
        return () => setTemplateId('trainer');
      case 'trainer':
        return createTemplateForm.handleSubmit(handleCreateTemplateFormSubmit);
    }
  }, [templateId]);

  const previousStep = React.useMemo(() => {
    switch (templateId) {
      case 'general-info':
        return null;
      case 'data_loader':
        return () => setTemplateId('general-info');
      case 'model':
        return () => setTemplateId('data_loader');
      case 'trainer':
        return () => setTemplateId('model');
    }
  }, [templateId]);

  return (
    <>
      <Text fontSize="28px" fontWeight="800">
        Zoogle | Create template
      </Text>
      <Text fontSize="16px" fontWeight="500">
        Create your custom training models
      </Text>
      <SimpleGrid spacing="20px" columns={2}>
        <Box overflowY="auto" m="-10px" p="10px" minW="300px" maxW="500px">
          {(() => {
            switch (templateId) {
              case 'general-info':
                return <GeneralInfoForm parentForm={createTemplateForm} />;
              case 'data_loader':
                return <DataLoaderForm parentForm={createTemplateForm} />;
              case 'model':
                return <ModelForm parentForm={createTemplateForm} />;
              case 'trainer':
                return <TrainerForm parentForm={createTemplateForm} />;
            }
          })()}
          {/* Footer */}
          <HStack mt="10px" w="100%" justify="end">
            {!!previousStep && (
              <Button leftIcon={<FiArrowLeft />} colorScheme="blue" variant="outline" onClick={previousStep}>
                Back
              </Button>
            )}
            <Button
              rightIcon={<FiArrowRight />}
              colorScheme="blue"
              onClick={nextStep}
              isLoading={isSubmiting}
              isDisabled={templateId === 'general-info' && !createTemplateForm.watch('name')}
            >
              {templateId === 'trainer' ? 'Submit' : 'Next'}
            </Button>
          </HStack>
        </Box>
        <Box h="100%">
          <Text fontSize="18" fontWeight="medium">
            Previewer &ldquo;{createTemplateForm.watch('name')}&rdquo;
          </Text>
          <Box
            w="100%"
            h="calc(100vh - 200px)"
            as="pre"
            border="1px dashed #1115"
            borderRadius="10px"
            p="10px"
            width="100%"
            overflowX="auto"
          >
            {YAML.dump(createTemplateForm.watch('config'))}
          </Box>
        </Box>
      </SimpleGrid>
    </>
  );
};
