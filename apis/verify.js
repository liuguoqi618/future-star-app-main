import axios from '../utils/axios';

export const submitIdVerification = async (data) => {
  return await axios.post('/api/ID/', data);
};

export const uploadIDPhoto = async (base64) => {
  return await axios.post('/api/ID/photo', { base64 });
};

export const getVerifyInfo = async () => {
  return await axios.get('/api/ID/ID');
}

export const getVerifyStatus = async () => {
  return await axios.get('/api/ID/status');
};
