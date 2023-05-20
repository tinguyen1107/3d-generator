import { SystemStyleObject } from '@chakra-ui/react';

export const layerStyles: Record<string, SystemStyleObject> = {
  arrowSlider: {
    w: '64px',
    h: '64px',
    borderRadius: 'full',
    bg: '#EEEEEE',
    opacity: 0.5,
    color: 'textSecondary',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    transitionDuration: '0.2s',
    _hover: {
      opacity: 1,
    },
  },
  optionSelect: {
    padding: '8px 22px',
    cursor: 'pointer',
    _hover: {
      bg: '#eee',
    },
    fontSize: '12px',
  },
  singleValueSelect: {
    padding: '8px 22px',
    cursor: 'pointer',
    position: 'absolute',
    fontSize: '12px',
    textColor: '#3A3A3A',
  },
};
