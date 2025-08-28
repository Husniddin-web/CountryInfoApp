export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPaginated<T> {
  items: T[];
  meta: IPaginationMeta;
}

export interface IResponse<T> {
  data: T;
  statusCode: number;
  message: string | string[];
}
