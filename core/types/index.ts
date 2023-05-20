import { NearConnector } from '../blockchain/near';

export type Container = {
  bcConnector: NearConnector;
};

export type ApiGetListInput = {
  from_index: number;
  limit: number;
};

export type GetListInput<T extends {} = {}> = Omit<PouchDB.Find.FindRequest<T>, 'selector'> & {
  selector?: PouchDB.Find.Selector;
};

export type ModalStateType = {
  onOpen: (...args: any) => any;
  onClose: (...args: any) => any;
};

export type TransactionAction = {
  methodName: string;
  args: object;
  gas?: string;
  deposit?: string;
};

export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;
export type StateWithLoading<T = {}> = T & {
  loading: boolean;
  error?: string | object;
};
