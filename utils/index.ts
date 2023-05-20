import { UseToastOptions } from '@chakra-ui/react';
import moment from 'moment';
import { PRICE_FRACTION_DIGITS, RATIO_AMOUT_TO_CREATE_TASK } from '../constants';

export * from './auth.utils';
export * from './modal.utils';

export const calcAmountToCreateTask = ({ price, max_participants }: { price: string; max_participants: number }) => {
  return Number((Number(price) * max_participants * RATIO_AMOUT_TO_CREATE_TASK).toFixed(PRICE_FRACTION_DIGITS));
};

export const toastBaseConfig: UseToastOptions = {
  position: 'top',
  duration: 3500,
  isClosable: true,
};

export const toastNotCompleteFeature: UseToastOptions = {
  title: 'Feature in development',
  description: '',
  status: 'warning',
  ...toastBaseConfig,
};

export const getTimeAgo = (time: number) => {
  const arr = moment(time).fromNow(true).split(' ');
  return (arr[0] == 'a' ? '1' : arr[0]) + arr[1].charAt(0);
};

export const getMessageFromExecutionError = (executionError: string): string | undefined => {
  const res = /'(.*)'/.exec(executionError);
  let message: string | undefined = undefined;
  if (!!res && res?.length > 0) {
    message = res[1];
  }
  return message;
};

export const to_slug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s-_])/g, '')
    .replace(/(\s+)/g, '_')
    .replace(/_+/g, '_')
    .replace(/^-+|-+$/g, '');
};

export function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export function ab2str(buf: any) {
  // @ts-ignore
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
