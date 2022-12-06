import axios from '../utils/axios';

export const getAppVersion = async () => {
  return await axios.get('/api/version');
};
