import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { FormProps } from '.';

export const TrainerForm = ({ parentForm }: FormProps) => {
  return (
    <form>
      <VStack mt="10px" align="start">
        <Text fontSize="20px" fontWeight="800">
          Trainer (4/4)
        </Text>
        <FormControl>
          <FormLabel>Learning rate</FormLabel>
          <Input />
        </FormControl>

        <Text fontSize="16px" fontWeight="700">
          Learing rate Scheduler
        </Text>
        <FormControl>
          <FormLabel>Gamma (0.001 - 0.010)</FormLabel>
          <CustomNumberInput
            min={0.001}
            max={0.01}
            step={0.0001}
            defVal={0.004}
            format={(val) => Number(val).toFixed(4)}
            value={parentForm.watch('config.trainer.lr_scheduler.params.gamma')}
            onChange={(val) => parentForm.setValue('config.trainer.lr_scheduler.params.gamma', val)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Number of epochs (10-100)</FormLabel>
          <CustomNumberInput
            min={10}
            max={100}
            step={1}
            defVal={40}
            value={parentForm.watch('config.trainer.num_epochs')}
            onChange={(val) => parentForm.setValue('config.trainer.num_epochs', val)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Clip grad (10-20)</FormLabel>
          <CustomNumberInput
            min={10}
            max={20}
            step={1}
            defVal={15}
            value={parentForm.watch('config.trainer.clip_grad')}
            onChange={(val) => parentForm.setValue('config.trainer.clip_grad', val)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Log interval (1-10)</FormLabel>
          <CustomNumberInput
            min={1}
            max={10}
            step={1}
            defVal={5}
            value={parentForm.watch('config.trainer.log_interval')}
            onChange={(val) => parentForm.setValue('config.trainer.log_interval', val)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Save interval (1-10)</FormLabel>
          <CustomNumberInput
            min={1}
            max={10}
            step={1}
            defVal={5}
            value={parentForm.watch('config.trainer.save_interval')}
            onChange={(val) => parentForm.setValue('config.trainer.save_interval', val)}
          />
        </FormControl>
      </VStack>
    </form>
  );
};

interface CustomSliderProps {
  min: number;
  max: number;
  step: number;
  format?: (val: string | number) => string | number;
  defVal: number;
  value: number;
  onChange: (val: number) => void;
}

// const CustomSlider = ({ min, max, step, defVal, value, onChange, format }: CustomSliderProps) => {
//   React.useEffect(() => {
//     if (!!value) {
//       onChange(defVal)
//     }
//   }, [defVal]);
//   return (
//     <Box p="4px 0" maxW="200px">
//       <Slider
//         aria-label="slider-ex-6"
//         min={min}
//         max={max}
//         value={value}
//         step={step}
//         defaultValue={defVal}
//         onChange={onChange}
//       >
//         <SliderTrack>
//           <SliderFilledTrack />
//         </SliderTrack>
//         <SliderThumb />
//       </Slider>
//     </Box>
//   );
// };

const CustomNumberInput = ({ min, max, step, defVal, value, onChange, format }: CustomSliderProps) => {
  React.useEffect(() => {
    if (!value) {
      onChange(defVal)
    }
  }, [defVal]);
  return (
    <NumberInput
      allowMouseWheel
      min={min}
      max={max}
      step={step}
      format={format}
      value={value}
      onChange={(_s, n) => onChange(n)} >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};
