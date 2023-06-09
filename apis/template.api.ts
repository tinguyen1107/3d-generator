import axios from 'axios';
import { BASE_URL } from '../constants';
import { PredictDto, Template, TemplateConfig, TemplateStatus } from '../dtos';
import * as YAML from 'js-yaml';

export const TemplateApi = Object.freeze({
  sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  },

  async getExtractorPointCloudList(): Promise<string[]> {
    try {
      const url = new URL('software/v1/extractor/list/pointcloud', BASE_URL);
      const res = await axios.get(url.toString());
      return res.data;
    } catch (e) {
      return [];
    }
  },
  async getExtractorTextList(): Promise<string[]> {
    try {
      const url = new URL('software/v1/extractor/list/text', BASE_URL);
      const res = await axios.get(url.toString());
      return res.data;
    } catch (e) {
      return [];
    }
  },
  async getTemplates(): Promise<Template[]> {
    try {
      const url = new URL('software/v1/template_management/template/list', BASE_URL);
      const res = await axios.get(url.toString());
      return res.data.map((temp: any) => {
        return {
          id: temp.template_id,
          name: temp.template_name,
          status: temp.status,
          createdAt: temp.create_at
        }
      });
    } catch (e) {
      return [];
    }
  },
  async getTemplateStatusById(id: string): Promise<TemplateStatus | undefined> {
    try {
      const url = new URL(`software/v1/template_management/template/${id}/status`, BASE_URL);
      const res = await axios.get(url.toString());
      return res.data;
    } catch (e) {
      return;
    }
  },
  async createTemplate(templateName: string, templateConfig: TemplateConfig): Promise<boolean> {
    try {
      const payload = {
        template_name: templateName,
        template: YAML.dump(templateConfig),
      };
      const url = new URL('software/v1/template_management/template/create', BASE_URL);
      await axios.post(url.toString(), payload);
      return true;
    } catch (e) {
      return false;
    }
  },
  async deleteTemplate(id: string): Promise<boolean> {
    try {
      const url = new URL(`software/v1/template_management/template/delete/${id}`, BASE_URL);
      await axios.delete(url.toString());
      return true;
    } catch (e) {
      return false;
    }
  },
  async trainTemplate(id: string): Promise<boolean> {
    try {
      const url = new URL(`software/v1/template_machine/train/${id}`, BASE_URL);
      await axios.get(url.toString());
      return true;
    } catch (e) {
      return false;
    }
  },
  async predictWithTemplate(id: string, query: string): Promise<string[]> {
    try {
      const url = new URL(`software/v1/template_machine/predict/${id}`, BASE_URL);
      url.searchParams.append('n_item', '6');
      url.searchParams.append('sentence', query);
      const res = await axios.get(url.toString());
      const predicts: PredictDto = JSON.parse(res.data);

      return predicts.abc.pred_ids.slice(0, 6).map((e: string) => e + '.obj');
    } catch (e) {
      return [];
    }
  },
});
