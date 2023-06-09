import axios from 'axios';
import { BASE_URL } from '../constants';

export const ModelApi = Object.freeze({
  sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  },
  async getModels(): Promise<string[]> {
    try {
      const url = new URL(`software/v1/model/list`, BASE_URL);
      const res = await axios.get(url.toString());
      return res.data;
    } catch (e) {
      return [];
    }
  },
});
