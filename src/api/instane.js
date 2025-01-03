import axios from 'axios';
import Cookies from 'js-cookie';

const instane = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL_API,
  // baseURL: 'https://90ae-2405-4802-1d5a-1eb0-cc0e-4677-cca1-8a68.ngrok-free.app',
  headers: {
    'ngrok-skip-browser-warning': '1',
  },
});
instane.interceptors.request.use(
  (req) => {
    const token = Cookies.get('access_token');
    if (token) {
      req.headers['Authorization'] = `Bearer ${token}`;
    }
    return req;
  },
  (err) => {
    return Promise.reject(err);
  },
);

instane.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default instane;
