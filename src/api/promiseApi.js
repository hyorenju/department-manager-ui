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
};
