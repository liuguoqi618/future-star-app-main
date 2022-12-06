import axios from '../utils/axios';

export const updateUserAvatar = async img => {
  return await axios.post('/api/user/updateAvatar', {img});
};

export const getUserProfile = async () => {
  return await axios.get('/api/user/profile');
};

export const updateUserName = async userName => {
  return await axios.post('/api/user/updateUserName', {userName});
};

export const getTaskProgress = async () => {
  return await axios.get('/api/user/progress');
};

export const getUserMigrationStatus = async userName => {
  return await axios.get(`/api/user/migrated/${userName}`);
};

export const migrateUser = async (regType, userName, password, token) => {
  return await axios.post(
    '/api/user/migration',
    {regType, userName, password},
    {
      headers: {
        authorization: token,
      },
    },
  );
};

export const getWalletSummary = async () => {
  return await axios.get('/api/wallet/summary');
};

export const getInviteSummary = async () => {
  return await axios.get('/api/invite/summary');
};
