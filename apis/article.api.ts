import { Descendant } from 'slate';
import { getContainer } from '../core';
import { TransactionAction } from '../core/types';
import { IPFSUtils, RequestUtils } from '../utils';

enum ContractMethods {
  write_article = 'post',
}

export type CreateArticleInput = {
  title: string;
  // subtitle: string;
  // body: string;
  body: Descendant[];
  tags: string[];
  categoryId: string;
  featuredImage: string;
};

export const ArticleApi = Object.freeze({
  async createArticle(input: CreateArticleInput): Promise<void> {
    const actions: TransactionAction[] = [];
    const encodeBody = JSON.stringify(input.body);
    const hash = await IPFSUtils.uploadDataToIPFS({ data: encodeBody });

    actions.push({
      methodName: ContractMethods.write_article,
      args: {
        // tags: ['default', 'xyz'],
        // category_id: input.categoryId,
        title: input.title,
        body: hash,
        post_type: {
          type: 'Article',
        },
        media: {
          type: 'Image',
          url: input.featuredImage,
        },
        topic_id: 'default',
      },
    });

    console.log('Write article', actions);
    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/blog/',
    });
  },
});
