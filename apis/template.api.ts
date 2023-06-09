import axios from 'axios';
import moment from 'moment';
import { BASE_URL } from '../constants';
import { PredictDto, Template, TemplateConfig, TemplateStatus } from '../dtos';
import * as YAML from 'js-yaml';

export const TemplateApi = Object.freeze({
  sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  },

  async getExtractorList(): Promise<string[]> {
    try {
      const url = new URL(`/extractor/list`, BASE_URL);
      // const res = await axios.get(url.toString());
      return ['CurveNet', 'abc', 'def'];
    } catch (e) {
      return [];
    }
  },
  async getModels(): Promise<string[]> {
    try {
      const url = new URL(`/model/list`, BASE_URL);
      const res = await axios.get(url.toString());
      return ['abc', 'def'];
    } catch (e) {
      return [];
    }
  },
  async getTemplates(): Promise<Template[]> {
    try {
      const res = await axios.get(BASE_URL + '/template_management/template/list');
    } catch (e) { }
    // return res.data;
    const data: Template[] = [
      {
        id: 'template_01',
        name: 'test 01',
        status: 'pending',
        createdAt: moment('11/05/2023 15:12', 'DD/MM/YYYY HH:mm').unix(),
      },
      {
        id: 'template_02',
        name: 'test 02',
        status: 'finished',
        createdAt: moment('11/05/2023 15:12', 'DD/MM/YYYY HH:mm').unix(),
      },
      {
        id: 'template_03',
        name: 'test 03',
        status: 'training',
        createdAt: moment('11/05/2023 15:12', 'DD/MM/YYYY HH:mm').unix(),
      },
    ];
    return data;
  },
  async getTemplateStatusById(id: string): Promise<TemplateStatus> {
    console.log(id, 'fetch');
    try {
      const res = await axios.get(BASE_URL + `/template_management/template/${id}/status`);
      return res.data;
    } catch (e) { }
    // return res.data;
    if (id == 'template_01') return 'pending';
    else if (id == 'template_02') return 'training';
    else if (id == 'template_03') return 'finished';

    return 'pending';
  },
  async createTemplate(templateName: string, templateConfig: TemplateConfig): Promise<boolean> {
    try {
      const payload = {
        template_name: templateName,
        template: YAML.dump(templateConfig),
      };
      console.log(payload);
      await this.sleep(5000);
      // const res = await axios.post(BASE_URL + '/template_management/template/create', payload);
      return true;
    } catch (e) {
      return false;
    }
  },
  async trainTemplate(id: string): Promise<boolean> {
    try {
      const res = await axios.get(BASE_URL + `/template_machine/train/${id}`);
      return true;
    } catch (e) {
      return false;
    }
  },
  async predictWithTemplate(id: string, query: string): Promise<string[]> {
    // try {
    //   const url = new URL(`/template_machine/predict/${id}`, BASE_URL);
    //   url.searchParams.append('n_item', '4');
    //   url.searchParams.append('query', query);
    //   const res = await axios.get(url.toString());
    //   const predicts: PredictDto = JSON.parse(res.data);
    //
    //   return predicts.abc.pred_ids.slice(0, 4).map((e: string) => e + '.obj');
    // } catch (e) {
    //   return [];
    // }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    let result: string[] = [];
    while (result.length < 4) {
      result.push(String(Math.floor(Math.random() * 11)));
    }
    return result.map((e) => e + '.obj');
  },
});

// const mapToAccounts = (raws: any[]): AccountDto[] => {
//   return raws.map<AccountDto>((item) => {
//     return mapToRawAccount(item);
//   });
// };
//
// const mapToRawAccount = (item: any): AccountDto => {
//   const about_me: AboutMeDto = item[1]?.about_me ? JSON.parse(atob(item[1]?.about_me)) : null;
//   const displayName = about_me == null ? '' : about_me.first_name + ' ' + about_me.last_name;
//   return {
//     id: item[0],
//     numFollowers: item[1]?.num_followers,
//     numFollowing: item[1]?.num_following,
//     numPosts: item[1]?.num_posts,
//     lastPostHeight: item[1]?.last_post_height,
//     avatar: item[1]?.avatar,
//     thumbnail: item[1]?.thumbnail,
//     bio: about_me == null ? '' : about_me.about ?? '',
//     displayName,
//     invitedBy: item?.invited_by,
//     relatedConversations: item[1]?.related_conversations,
//     messagePubKey: item[1]?.message_pub_key,
//     about_me,
//   };
// };
//
// const mapToAccount = (item: any): AccountDto => {
//   const about_me: AboutMeDto = item?.about_me ? JSON.parse(atob(item?.about_me)) : null;
//   let displayName = '';
//   if (!!about_me) {
//     if (!!about_me.first_name) displayName += about_me.first_name;
//     if (!!about_me.last_name) displayName += ' ' + about_me.last_name;
//   }
//   displayName = displayName.trim();
//   return {
//     id: item.account_id,
//     numFollowers: item.num_followers,
//     numFollowing: item.num_following,
//     numPosts: item.num_posts,
//     lastPostHeight: item.last_post_height,
//     avatar: item.avatar,
//     thumbnail: item.thumbnail,
//     bio: about_me == null ? '' : about_me.about ?? '',
//     displayName,
//     invitedBy: item.invited_by,
//     relatedConversations: item.related_conversations,
//     messagePubKey: item.message_pub_key,
//     about_me,
//   };
// };
