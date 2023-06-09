export type Template = {
  id: string;
  name: string;
  status: TemplateStatus;
  createdAt: number;
};

export type TemplateStatus = 'pending' | 'training' | 'ready';
