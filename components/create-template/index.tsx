import React from 'react';
import { Box, Button, HStack, SimpleGrid, Text, Textarea } from '@chakra-ui/react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { DataLoaderForm } from './data-loader-form';
import { ModelForm } from './model-form';
import { TrainerForm } from './trainer-form';
import { GeneralInfoForm } from './general-info';
import { useForm, UseFormReturn } from 'react-hook-form';
import { CreateTemplateInputs } from '../../dtos';
import * as YAML from 'js-yaml';


type TemplateId = 'general-info' | 'data_loader' | 'model' | 'trainer';

export interface FormProps {
  parentForm: UseFormReturn<CreateTemplateInputs, any, undefined>;
}

export const CreateTemplate = () => {
  const [templateId, setTemplateId] = React.useState<TemplateId>('general-info');
  const nextStep = React.useMemo(() => {
    switch (templateId) {
      case 'general-info':
        return () => setTemplateId('data_loader');
      case 'data_loader':
        return () => setTemplateId('model');
      case 'model':
        return () => setTemplateId('trainer');
      case 'trainer':
        return () => createTemplateForm;
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

  const createTemplateForm = useForm<CreateTemplateInputs>({
    defaultValues: {
      config: {
        data_loader: {
          train: {
            params: {
              batch_size: 16,
              num_workers: 2,
              shuffle: true,
            },
          },
          val: {
            params: {
              num_workers: 2,
              batch_size: 16,
            },
          },
        },
        model: {
          name: 'BaselineModel',
          embed_dim: 128,
          xbm: {
            enable_epoch: 1000000,
            memory_size: 1024,
          },
          extractor: {
            pointcloud: {
              name: 'CurveNet',
              params: {},
            },
            text: {
              name: 'LangExtractor',
              params: {
                pretrained: 'bert-base-uncased',
                freeze: true,
              },
            },
          },
          encoder: {
            pointcloud: {
              num_hidden_layer: 2,
            },
            text: {
              num_hidden_layer: 2,
            },
          },
        },
        trainer: {
          lr: 0.001,
          lr_scheduler: {
            params: {
              milestones: [120, 250, 350, 500],
              gamma: 0.5,
            },
          },
          use_fp16: false,
          debug: false,
          num_epochs: 10,
          clip_grad: 10.0,
          evaluate_interval: 1,
          log_interval: 1,
          save_interval: 1,
        },
        callbacks: [
          {
            name: 'ModelCheckpoint',
            params: {
              filename: 'baseline-{epoch}-{NN:.4f}-{mAP:.4f}-{train_loss:.4f}-{val_loss:.4f}',
              monitor: 'NN',
              verbose: true,
              save_top_k: 1,
              mode: 'min',
            },
          },
        ],
      }

      // {
      //   data_loader: {
      //     train: {
      //       params: {
      //         batch_size: 16,
      //         shuffle: true,
      //         num_workers: 2
      //       }
      //
      //     }
      //   }
      // }

    }
  });

  return (
    <>
      <Text fontSize="28px" fontWeight="800">
        Zoogle | Create template
      </Text>
      <Text fontSize="16px" fontWeight="500">
        Create your custom training models
      </Text>
      <SimpleGrid spacing="20px" columns={2}>
        <Box overflowY="auto" m="-10px" p="10px" minW="300px" maxW="500px" >
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
              isDisabled={templateId === 'general-info' && !createTemplateForm.watch('name')}
            >
              {templateId === 'trainer' ? 'Submit' : 'Next'}
            </Button>
          </HStack>
        </Box>
        <Box h="100%">
          <Text fontSize="20px" fontWeight="medium">
            Preview template "{createTemplateForm.watch('name')}"
          </Text>
          <Box w="100%" h="calc(100vh - 200px)" as="pre" border="1px dashed #1115" borderRadius="10px" p="10px" width="100%" overflowX="auto">
            {YAML.dump(createTemplateForm.watch('config'))}
          </Box>
        </Box>
      </SimpleGrid>
    </>
  );
};
