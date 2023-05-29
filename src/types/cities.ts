import { City } from 'models/cities'

export type CitiesResponse = City[]

export type EnableCityRequest = {
  data: {
    code: string;
  },
  id: string;
}

export type DisableCityRequest = Omit<EnableCityRequest, 'data'>

export interface ChangeCityResponse extends Omit<City, 'country'> {
  country: string;
}