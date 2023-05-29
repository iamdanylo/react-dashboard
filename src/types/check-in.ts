import { Checkin } from "models/checkin";
import { DateRange } from '../pages/check-in/dateFilter';


export type GetCheckInsRequest = {
  date?: DateRange | null;
  placeId?: string;
  limit?: string;
  offset?: number;
  sort?: string | null;
  query?: string;
};

export type GetCheckInsResponse = {
  data: Checkin[];
  total: number;
};
