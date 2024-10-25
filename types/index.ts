export * from "./sdk";
export * from "./schema";
export * from "./model";

export interface IAction<T = any> {
  type: string;
  payload: T;
}

export type DispatchAsync<T = any> = (action: IAction<T>) => void;
