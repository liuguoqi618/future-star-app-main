import axios from '../utils/axios';

export const getWalletInfo = async () => {
  return await axios.get('/api/wallet');
};

export const getWithdrawFee = async () => {
  return await axios.get('/api/wallet/withdraw');
};

export const getConversionRate = async () => {
  return await axios.get('/api/wallet/convert');
};

export const getTransactionRecord = async ({page, size, currency}) => {
  return await axios.get(
    '/api/wallet/transaction?' +
      (page ? `page=${page}&` : '') +
      (size ? `size=${size}&` : '') +
      (currency ? `currency=${currency}` : ''),
  );
};

export const getTopUpAddress = async (currency = 'BNB') => {
  return await axios.get(`/api/metamask/${currency}`);
};

export const withdrawBNB = async (amount, metamask) => {
  return await axios.post('/api/wallet/withdraw/bnb', {amount, metamask});
};

export const withdrawUSDT = async (amount, metamask) => {
  return await axios.post('/api/wallet/withdraw/usdt', {amount, metamask});
};

export const withdrawFSC = async (amount, metamask) => {
  return await axios.post('/api/wallet/withdraw/fsc', {amount, metamask});
};

export const convertCurrency = async (from, to, amount) => {
  return await axios.post('/api/wallet/convert', {from, to, amount});
};
