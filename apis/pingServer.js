import axios from 'axios';
import configs from '../configs';

export const pingUSServer = async () => {
  try {
    const startTime = new Date().getTime();
    const {data} = await axios.get(`${configs.API_BASE_URL}/health`);
    const endTime = new Date().getTime();
    console.log('US: ', data, endTime - startTime);
    return endTime - startTime;
  } catch (err) {
    console.log(err);
    return -1;
  }
};

export const pingSingaporeServer = async () => {
  try {
    const startTime = new Date().getTime();
    const {data} = await axios.get(`${configs.API_BASE_URL_SINGAPORE}/health`);
    const endTime = new Date().getTime();
    console.log('Singapore: ', data, endTime - startTime);
    return endTime - startTime;
  } catch (err) {
    console.log(err);
    return -1;
  }
};
