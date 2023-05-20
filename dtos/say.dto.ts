import { StaticImageData } from 'next/image';

export type SayDto = {
  name: string;
  date: string;
  content: string;
  image: string | StaticImageData;
  numOfLikes: number;
  numOfComment: number;
  numOfResay: number;
};
