import axios from 'axios';
import { getContainer } from '../core';

const REP_BE_URL = 'https://rep-run-notification.tk';

export type FeedbackInput = {
  name: String;
  email: String;
  message: String;
};

export const ReportApi = Object.freeze({
  async feedback(feedbackInput: FeedbackInput): Promise<void> {
    try {
      const { data } = await axios.post(REP_BE_URL + '/feedback', {
        ...feedbackInput,
      });
      return data;
    } catch (err) { }
  },
  async report(accountId: string, description: string): Promise<void> {
    const reporter = getContainer().bcConnector.wallet.getAccountId();

    try {
      const { data } = await axios.post(REP_BE_URL + '/report', {
        accountId: reporter,
        description,
        reportId: accountId,
        reportType: 'user',
      });
      return data;
    } catch (error) { }
  },
});
