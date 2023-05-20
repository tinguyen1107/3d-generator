import { extendTheme } from '@chakra-ui/react';
import { styles } from './styles';
import { config } from './config';
import { semanticTokens } from './semanticTokens';
import { components } from './components';
import { layerStyles } from './layerStyles';

export const theme = extendTheme({
  config,
  styles,
  semanticTokens,
  components,
  layerStyles,
});

export const ReactSelectStyles = {
  control: (styles: any) => {
    return {
      ...styles,
      background: 'bgBody',
      border: 'none',
      borderRadius: 0,
      color: 'white',
      cursor: 'pointer',
      padding: '0 2px',
    };
  },
  singleValue: (styles: any) => {
    return {
      ...styles,
      color: 'bgBody',
      fontSize: '12px',
    };
  },
  menuList: (styles: any) => {
    return {
      ...styles,
      background: 'bgSecondary',
      height: '150px',
    };
  },
  option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
    return {
      ...styles,
      backgroundColor: isDisabled ? undefined : isSelected ? '#FFBF91' : isFocused ? '#555' : undefined,
      color: isDisabled ? undefined : isSelected ? '#333' : isFocused ? '#FFBF91' : '#FFBF91',
      cursor: 'pointer',
      fontSize: '12px',
    };
  },
  placeholder: (styles: any) => ({
    ...styles,
    fontSize: '12px',
  }),
  input: (styles: any) => ({
    ...styles,
    fontSize: '12px',
    color: '#FFBF91',
  }),
  indicatorSeparator: (() => { }) as any,
};
