import { Request } from 'express';

export type LanguageCodes = {
  am: string;
  en?: string;
  ru?: string;
};

export type TranslationKeys = {
  id?: string;
  lgCode: string;
  field: string;
  value: string;
};

export type ReorderPayload = {
  orders: Order[];
};

type Order = {
  id: string;
  order: number;
};

export type PaginationPayload = {
  page?: number;
  limit?: number;
};

export type PaginationParams = {
  skip: number;
  take: number;
};

export interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

export type SearchParams = {
  search?: string;
};

export type SearchPayload = {
  search?: string;
};
