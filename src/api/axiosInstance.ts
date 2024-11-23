import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://15.164.204.26', // Spring Boot 서버 URL
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request:', config);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Response Error:', error.response);
    } else {
      console.error('Error without response:', error);
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
