import { axiosClient } from './axiosClient';

export const userApi = {
  getUserProfile: async (id: string) => {
    return await axiosClient.get(`/user/${id}/profile`);
  },
  updateUserProfile: async (id: string, userData: FormData) => {
    return await axiosClient.patch(`/user/${id}/profile`, userData);
  },
  deleteUserProfile: async (id: string) => {
    return await axiosClient.delete(`/user/${id}/profile`);
  },
};
