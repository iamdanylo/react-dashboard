import { Partner } from 'models/partner';

export type GetPartnersResponse = {
  data: Partner[];
  total: number;
};

export type GetPartnersRequest = {
  limit?: string;
};