import React from 'react';
import {
  Box,
  Slider,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import { FormProps } from '.';

export const TrainerForm = ({ parentForm }: FormProps) => {
  const [sliderValue, setSliderValue] = React.useState(0.004);
  return (
    <form>
      <VStack mt="10px" align="start">
        <Text fontSize="20px" fontWeight="800">
          Trainer
        </Text>
        <FormControl>
          <FormLabel>Learning rate</FormLabel>
          <Input />
        </FormControl>

        <Text fontSize="16px" fontWeight="700">
          Learing rate Scheduler
        </Text>
        <FormControl>
          <FormLabel>Gamma</FormLabel>
          <Text>{sliderValue}</Text>
          <CustomSlider min={0.001} max={0.01} step={0.0005} defVal={0.004} onChange={setSliderValue} />
        </FormControl>

        <FormControl>
          <FormLabel>Number of epochs (10-100)</FormLabel>
          <Text>{sliderValue}</Text>
          <CustomSlider min={10} max={100} step={1} defVal={40} onChange={setSliderValue} />
        </FormControl>
        <FormControl>
          <FormLabel>Clip grad (10-20)</FormLabel>
          <Text>{sliderValue}</Text>
          <CustomSlider min={10} max={20} step={1} defVal={15} onChange={setSliderValue} />
        </FormControl>
        <FormControl>
          <FormLabel>Log interval (1-10)</FormLabel>
          <Text>{sliderValue}</Text>
          <CustomSlider min={1} max={10} step={1} defVal={5} onChange={setSliderValue} />
        </FormControl>
        <FormControl>
          <FormLabel>Save interval (1-10)</FormLabel>
          <Text>{sliderValue}</Text>
          <CustomSlider min={1} max={10} step={1} defVal={5} onChange={setSliderValue} />
        </FormControl>
      </VStack>
    </form>
  );
};

interface CustomSliderProps {
  min: number;
  max: number;
  step: number;
  defVal: number;
  onChange: (val: number) => void;
}

const CustomSlider = ({ min, max, step, defVal, onChange }: CustomSliderProps) => {
  return (
    <Box p="4px 0">
      <Slider aria-label="slider-ex-6" min={min} max={max} step={step} defaultValue={defVal} onChange={onChange}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
};
