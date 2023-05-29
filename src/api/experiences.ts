import {
  GetExperienceByIdRequest,
  GetExperienceByIdResponse,
  CreateExperienceRequest,
  GetExperiencesResponse,
  GetExperiencesRequest,
  GetExperienceByTimeSlotIdRequest,
  GetExperienceByTimeSlotIdResponse,
  UpdateExperienceRequest,
  DeleteExperienceRequest
} from 'types/experiences';
import axiosApi from './config';

const experiencesApi = {
  getUpcomingExperiences({
    query = '',
    limit = '10',
    offset = 0,
    startDateTime = '',
    endDateTime = '',
  }: GetExperiencesRequest): Promise<GetExperiencesResponse> {
    const params = new URLSearchParams({
      query: query,
      limit,
      offset: offset.toString(),
    });

    const url = `experiences/upcoming?${params.toString()}${startDateTime ? `&filter[startDateTime]=${startDateTime}` : ''}${endDateTime ? `&filter[endDateTime]=${endDateTime}` : ''}`;
    return axiosApi.get(url);
  },
  getHistoryExperiences({
    query = '',
    limit = '10',
    offset = 0,
    startDateTime = '',
    endDateTime = '',
  }: GetExperiencesRequest): Promise<GetExperiencesResponse> {
    const params = new URLSearchParams({
      query: query,
      limit,
      offset: offset.toString(),
    });

    const url = `experiences/history?${params.toString()}${startDateTime ? `&filter[startDateTime]=${startDateTime}` : ''}${endDateTime ? `&filter[endDateTime]=${endDateTime}` : ''}`;
    return axiosApi.get(url);
  },
  getExperienceById(data: GetExperienceByIdRequest): Promise<GetExperienceByIdResponse> {
    const url = `experiences/${data.id}`;
    return axiosApi.get(url);
  },
  getExperienceByTimeSlotId(data: GetExperienceByTimeSlotIdRequest): Promise<GetExperienceByTimeSlotIdResponse> {
    const url = `experiences/${data.experienceId}/${data.timeSlotId}`;
    return axiosApi.get(url);
  },
  createExperience(data: CreateExperienceRequest): Promise<void> {
    const url = 'experiences';
    return axiosApi.post(url, data);
  },
  updateExperience(data: UpdateExperienceRequest): Promise<void> {
    const url = `experiences/${data.id}`;
    return axiosApi.put(url, data.data);
  },
  deleteExperience(data: DeleteExperienceRequest): Promise<void> {
    const url = `experiences/${data.experienceId}`;
    return axiosApi.delete(url, {
      data: {
        forceDeleteExperience: data.forceDeleteExperience,
      }
    });
  }
};

export default experiencesApi;
