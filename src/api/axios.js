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

export const getUserSelection = (values) => {
  return axios.post(`/user/selection`, values);
};

export const createUser = (values) => {
  return axios.post(`/user/create`, values);
};

export const updateUser = (id, values) => {
  return axios.post(`/user/update/${id}`, values);
};

export const deleteUser = (id) => {
  return axios.post(`/user/delete/${id}`);
};

export const transferRole = (id) => {
  return axios.post(`/user/transfer/${id}`);
};

export const updateProfile = (values) => {
  return axios.post(`/user/update-profile`, values);
};

export const changePassword = (values) => {
  return axios.post(`/user/change-password`, values);
};

//Master data
export const getMasterDataSelection = (values) => {
  return axios.post(`/master-data/list`, values);
};

export const createMasterData = (values) => {
  return axios.post(`/master-data/create`, values);
};

export const updateMasterData = (id, values) => {
  return axios.post(`/master-data/update/${id}`, values);
};

export const deleteMasterData = (id) => {
  return axios.post(`/master-data/delete/${id}`);
};

//Faculty
export const getFacultySelection = () => {
  return axios.post(`/faculty/selection`);
};

export const getFacultyList = (values) => {
  return axios.post(`/faculty/list`, values);
};

export const createFaculty = (values) => {
  return axios.post(`/faculty/create`, values);
};

export const updateFaculty = (id, values) => {
  return axios.post(`/faculty/update/${id}`, values);
};

export const deleteFaculty = (id) => {
  return axios.post(`/faculty/delete/${id}`);
};

//Department
export const getDepartmentSelection = (values) => {
  return axios.post(`/department/selection`, values);
};

export const getDepartmentList = (values) => {
  return axios.post(`/department/list`, values);
};

export const createDepartment = (values) => {
  return axios.post(`/department/create`, values);
};

export const updateDepartment = (id, values) => {
  return axios.post(`/department/update/${id}`, values);
};

export const deleteDepartment = (id) => {
  return axios.post(`/department/delete/${id}`);
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

export const getAllRole = () => {
  return axios.post(`/role/all`);
};

//Subject
export const getSubjectList = (values) => {
  return axios.post(`/subject/list`, values);
};

export const getSubjectSelection = (values) => {
  return axios.post(`/subject/selection`, values);
};

export const createSubject = (values) => {
  return axios.post(`/subject/create`, values);
};

export const updateSubject = (id, values) => {
  return axios.post(`/subject/update/${id}`, values);
};

export const deleteSubject = (id) => {
  return axios.post(`/subject/delete/${id}`);
};

//Upload file
export const uploadFile = (values) => {
  return axios.post(`/test/upload-file`, values);
};

//Intern
export const getInternList = (values) => {
  return axios.post(`/intern/list`, values);
};

export const createIntern = (values) => {
  return axios.post(`/intern/create`, values);
};

export const updateIntern = (id, values) => {
  return axios.post(`/intern/update/${id}`, values);
};

export const deleteIntern = (id) => {
  return axios.post(`/intern/delete/${id}`);
};

//Teaching
export const getTeachingList = (values) => {
  return axios.post(`/teaching/list`, values);
};

export const createTeaching = (values) => {
  return axios.post(`/teaching/create`, values);
};

export const updateTeaching = (id, values) => {
  return axios.post(`/teaching/update/${id}`, values);
};

export const deleteTeaching = (id) => {
  return axios.post(`/teaching/delete/${id}`);
};

//Exam
export const getExamList = (values) => {
  return axios.post(`/exam/list`, values);
};

export const getAssignSelection = (id) => {
  return axios.post(`/exam/assign-selection/${id}`);
};

export const createExam = (values) => {
  return axios.post(`/exam/create`, values);
};

export const updateExam = (id, values) => {
  return axios.post(`/exam/update/${id}`, values);
};

export const deleteExam = (id) => {
  return axios.post(`/exam/delete/${id}`);
};

//Student
export const getStudentList = (values) => {
  return axios.post(`/student/list`, values);
};

export const createStudent = (values) => {
  return axios.post(`/student/create`, values);
};

export const updateStudent = (id, values) => {
  return axios.post(`/student/update/${id}`, values);
};

export const deleteStudent = (id) => {
  return axios.post(`/student/delete/${id}`);
};
