import instane from '../instane';

export const visitor = {
  login: async (values) => {
    const url = '/login';
    try {
      const res = await instane.post(url, values, {
        headers: {
          Authorization: undefined,
        },
      });
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  changePassword: async (values) => {
    const url = '/change-password';
    try {
      const res = await instane.post(url, values, {
        headers: {
          Authorization: undefined,
        },
      });
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  confirmChagePassword: async (values) => {
    const url = '/send-request';
    try {
      const res = await instane.post(url, values, {
        headers: {
          Authorization: undefined,
        },
      });
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },
};
