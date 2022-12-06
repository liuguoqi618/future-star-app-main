import axios from 'axios'
import Toast from 'react-native-toast-message';
import i18n from 'i18next';

import configs from '../configs'

const instance = axios.create({
  baseURL: configs.API_BASE_URL,
  timeout: configs.API_TIMEOUT,
})

instance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.message === `timeout of ${configs.API_TIMEOUT}ms exceeded`) {
    Toast.show({ type: 'error', text1: i18n.t('axios.error1') })
    error.isTimeout = true
  }
  return Promise.reject(error);
});

export default instance

export const setToken = async token => {
  try {
    instance.defaults.headers.common.authorization = token
    // await AsyncStorage.setItem(StorageKey.ACCESS_TOKEN, token)
  } catch (e) {
    console.log(e)
  }
}

export const removeToken = async () => {
  delete instance.defaults.headers.common.authorization
  // await AsyncStorage.removeItem(StorageKey.ACCESS_TOKEN)
}
