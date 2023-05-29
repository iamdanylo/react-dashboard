export type Place = {
  _id: string;
  name: string;
  membersOnly: boolean;
  code: string;
  description: string;
  address: string;
  type: string;
  city: City;
  contactInfo: string;
  tags: string[];
};

export type City = {
  _id: string;
  name: string;
  code: string;
  country: Country;
  timeZone: string;
};

export type Country = {
  _id: string;
  name: string;
  code: string;
  currency: string;
};

export enum PlaceTypes {
  ACCESS_PARTNER = 'access_partner',
  HOUSE = 'house',
  VENUE = 'venue'
}

export enum PlaceTags {
  WIFI = 'wifi',
  PRIVATE_ROOMS = 'private rooms',
  POOL = 'pool',
  SHOWERS = 'showers',
  COFFEE = 'coffee',
  FOOD = 'food',
  GOOD_FOR_MEETINGS = 'good for meetings'
}

export enum DaysOfWeekEnum {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export const placeTypesOptions = [
  { value: PlaceTypes.ACCESS_PARTNER, label: 'Access partner' },
  { value: PlaceTypes.HOUSE, label: 'House' },
  { value: PlaceTypes.VENUE, label: 'Venue' },
];

export const placeTagsOptions = [
  { value: PlaceTags.COFFEE, label: 'COFFEE' },
  { value: PlaceTags.FOOD, label: 'FOOD' },
  { value: PlaceTags.GOOD_FOR_MEETINGS, label: 'GOOD FOR MEETINGS' },
  { value: PlaceTags.POOL, label: 'POOL' },
  { value: PlaceTags.PRIVATE_ROOMS, label: 'PRIVATE ROOMS' },
  { value: PlaceTags.SHOWERS, label: 'SHOWERS' },
  { value: PlaceTags.WIFI, label: 'WIFI' },
];