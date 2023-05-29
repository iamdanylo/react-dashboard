import { PlaceRequest, PlaceResponse, EditPlaceRequest, GetReservationsRequest, GetReservationsResponse } from 'types/places';
import { SubscriptionsResponse } from 'types/subscriptions';
import axiosApi from './config';
import moment from 'moment';

const PlacesApi = {
  createPlace(data: PlaceRequest): Promise<PlaceResponse> {
    const url = 'places';
    return axiosApi.post(url, data);
  },
  editPlace(data: EditPlaceRequest): Promise<PlaceResponse> {
    const url = `places/${data.id}`;
    return axiosApi.put(url, data.data);
  },
  getPlaces(): Promise<PlaceResponse[]> {
    const url = 'places';
    return axiosApi.get(url);
  },
  getPlaceById(id: string): Promise<PlaceResponse> {
    const url = `places/${id}`;
    return axiosApi.get(url);
  },
  deletePlace(id: string): Promise<PlaceResponse> {
    const url = `places/${id}`;
    return axiosApi.delete(url);
  },
  getSubscriptions(): Promise<SubscriptionsResponse[]> {
    const url = `subscription`;
    return axiosApi.get(url);
  },
  getReservationsByPlaceId({
    placeId = '',
    limit = '10',
    offset = 0,
    startDate = null,
  }: GetReservationsRequest): Promise<GetReservationsResponse> {
    const endDate = moment(startDate).add(1, 'days').startOf('day');

    const params = new URLSearchParams({
      limit,
      offset: offset.toString(),
    });
    const url = `/reservations/place/${placeId}?${params.toString()}
    ${startDate && endDate ? `&filter[startDate]=${moment(startDate).startOf('day').toDate()}&filter[endDate]=${endDate.toDate()}` : ''}`;

    return axiosApi.get(url);
  },
};

export default PlacesApi;
