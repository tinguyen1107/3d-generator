import { FeedbackInput, ReportApi } from '../apis/report.api';

export class ReportRepo {
  static async feedback(feedbackInput: FeedbackInput): Promise<void> {
    return ReportApi.feedback(feedbackInput);
  }
  static async report(accountId: string, description: string): Promise<void> {
    return ReportApi.report(accountId, description);
  }
}
