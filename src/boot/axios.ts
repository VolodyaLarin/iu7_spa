import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import config from 'src/config';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

export const api = axios.create({ baseURL: config.api.baseUrl });

export const updateToken = () => {
  const token = localStorage.getItem('api_token') || '';
  api.defaults.headers.common.Authorization = `${token}`;
};

updateToken();

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});
