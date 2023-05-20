import { getContainer } from '../core';
import { ApiGetListInput } from '../core/types';
import { CategoryDto } from '../dtos';

enum ContractMethods {
  categories = 'categories',
  new_category = 'new_category',
  get_categories = 'get_categories',
}

export const CategoryApi = Object.freeze({
  async getCategory(): Promise<CategoryDto[]> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_categories,
      args: {},
    });

    console.log(
      'cate',
      res.map((val: any) => mapToCategory(val))
    );
    return res.map((val: any) => mapToCategory(val));
  },

  async create(payload: { topic_name: string }): Promise<void> {
    await getContainer().bcConnector.callChangeMethod({
      methodName: ContractMethods.new_category,
      args: payload,
    });
  },
  ///
  async getList(payload: ApiGetListInput): Promise<CategoryDto[]> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.categories,
      args: payload,
    });
    return res;
  },
});

function mapToCategory(data: any): CategoryDto {
  return {
    ...data,
    numArticles: data.numArticles,
    createdAt: data.createdAt,
  };
}
