import axios from './instane';

export const login = async (values) => {
  return axios.post(`/login`, values, {
    headers: {
      Authorization: undefined,
    },
  });
};

export const getListStudent = async () => {};

export const createStudent = (values) => {
  return axios.post(`/admin/student/create`, values);
};
