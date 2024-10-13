import instane from './instane';

export const promiseApi = {
  readFromDaoTao: async (id) => {
    const url = `/teaching/read-from-daotao/${id}`;
    try {
      const res = await instane.post(url);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  createTask: async (values) => {
    const url = `/task/create`;
    try {
      const res = await instane.post(url, values);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  updateParticipant: async (values) => {
    const url = `/user-task/update`;
    try {
      const res = await instane.post(url, values);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },
};
