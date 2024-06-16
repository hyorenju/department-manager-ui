import instane from './instane';

export const excelApi = {
  exportUserList: async (values) => {
    const url = '/user/export';
    try {
      const res = await instane.post(url, values);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  exportClassList: async (values) => {
    const url = '/class/export';
    try {
      const res = await instane.post(url, values);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  exportSubjectList: async (values) => {
    const url = '/subject/export';
    try {
      const res = await instane.post(url, values);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  importInternList: async (values) => {
    const url = '/intern/import';
    try {
      const res = await instane.post(url, values);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  exportInternList: async (values) => {
    const url = '/intern/export';
    try {
      const res = await instane.post(url, values);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  importTeachingList: async (values) => {
    const url = '/teaching/import';
    try {
      const res = await instane.post(url, values);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  exportTeachingList: async (values) => {
    const url = '/teaching/export';
    try {
      const res = await instane.post(url, values);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  importExamList: async (values) => {
    const url = '/exam/import';
    try {
      const res = await instane.post(url, values);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  exportExamList: async (values) => {
    const url = '/exam/export';
    try {
      const res = await instane.post(url, values);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },
};
