import axios from './instane';

//Authorization
export const login = async (values) => {
  return axios.post(`/login`, values, {
    headers: {
      Authorization: undefined,
    },
  });
};

//Manage User
export const getUserList = (values) => {
  return axios.post(`/user/list`, values);
};

export const createUser = (values) => {
  return axios.post(`/user/create-user`, values);
};

export const updateUser = (id, values) => {
  return axios.post(`/user/update/${id}`, values);
};

export const deleteUser = (id) => {
  return axios.post(`/user/delete/${id}`);
};

//Master data
export const getDegreeSelection = (values) => {
  return axios.post(`/master-data/list`, values);
};

//Faculty
export const getFacultySelection = () => {
  return axios.post(`/faculty/selection`);
};

//Department
export const getDepartmentSelection = (values) => {
  return axios.post(`/department/selection`, values);
};

//Class
export const getClassList = (values) => {
  return axios.post(`/class/list`, values);
};

export const createClass = (values) => {
  return axios.post(`/class/create`, values);
};

export const updateClass = (id, values) => {
  return axios.post(`/class/update/${id}`, values);
};

export const deleteClass = (id) => {
  return axios.post(`/class/delete/${id}`);
};

//Role
export const getRoleSelection = () => {
  return axios.post(`/role/selection`);
};
