import React from 'react';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { DataLoaderForm } from './data-loader-form';
import { ModelForm } from './model-form';
import { TrainerForm } from './trainer-form';
import { GeneralInfoForm } from './general-info';
import { useForm, UseFormReturn } from 'react-hook-form';
import { CreateTemplateInputs } from '../../dtos';

type TemplateId = 'general-info' | 'data_loader' | 'model' | 'trainer';

export interface FormProps {
  parentForm: UseFormReturn<CreateTemplateInputs, any, undefined>;
}

export const CreateTemplate = () => {
  const [templateId, setTemplateId] = React.useState<TemplateId>('general-info');
  const nextStep = React.useCallback(() => {
    switch (templateId) {
      case 'general-info':
        setTemplateId('data_loader');
        break;
      case 'data_loader':
        setTemplateId('model');
        break;
      case 'model':
        setTemplateId('trainer');
        break;
      case 'trainer':
        break;
    }
  }, [templateId]);

  const previousStep = React.useCallback(() => {
    switch (templateId) {
      case 'general-info':
        break;
      case 'data_loader':
        setTemplateId('general-info');
        break;
      case 'model':
        setTemplateId('data_loader');
        break;
      case 'trainer':
        setTemplateId('model');
        break;
    }
  }, [templateId]);

  const createTemplateForm = useForm<CreateTemplateInputs>();

  return (
    <>
      <Text fontSize="28px" fontWeight="800">
        Zoogle | Create template
      </Text>
      <Text fontSize="16px" fontWeight="500">
        Create your custom training models
      </Text>
      <Box overflowY="auto" m="-10px" p="10px" maxW="400px">
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
          {templateId !== 'general-info' && (
            <Button leftIcon={<FiArrowLeft />} colorScheme="teal" variant="outline" onClick={previousStep}>
              Back
            </Button>
          )}
          <Button rightIcon={<FiArrowRight />} colorScheme="teal" onClick={nextStep}>
            {templateId === 'trainer' ? 'Submit' : 'Next'}
          </Button>
        </HStack>
      </Box>
    </>
  );
};
