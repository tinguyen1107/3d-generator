import React from 'react';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

interface CustomSliderProps {
  min: number;
  max: number;
  step: number;
  format?: (val: string | number) => string | number;
  defVal: number;
  value: number;
  onChange: (val: number) => void;
}

export const CustomNumberInput = ({ min, max, step, defVal, value, onChange, format }: CustomSliderProps) => {
  React.useEffect(() => {
    if (!value) {
      onChange(defVal);
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
      onChange={(_s, n) => onChange(n)}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};
