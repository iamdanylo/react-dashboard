import { City } from 'models/cities'

export type PlaceResponse = {
  _id: string;
  name: string;
  code?: string;
  description: string;
  address: string;
  membersOnly: boolean;
  type: string;
  city: City,
  rooms: Room[];
  contactInfo: string;
  tags: string[];
  allowedSubscriptions: string[],
  isReservationEnabled: boolean,
  image: string,
  availability: string[],
}

export type PlaceRequest = {
  name: string;
  description: string;
  address: string;
  type: string;
  city: string;
  membersOnly: boolean;
  contactInfo: string;
  tags: string[];
  allowedSubscriptions?: string[],
}

export type EditPlaceRequest = {
  data: PlaceRequest;
  id: string;
}

export type GetReservationsRequest = {
  placeId: string;
  startDate: string | null | Date;
  offset?: number;
  limit?: string;
}

export type Room = {
  name: string;
  _id: string;
  times: string[];
}

export interface ReservedRoom {
  createdAt: string;
  date: string;
  place: string;
  rooms: Room[];
  user: string;
  _id: string;
}

export interface GetReservationsResponse {
  data: ReservedRoom[];
  total: number;
}
