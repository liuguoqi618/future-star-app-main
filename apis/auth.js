import axios from '../utils/axios';

export const callSignup = async ({email, phoneNumber, token}) => {
  console.log(email, phoneNumber, token);
  return await axios.post(
    '/api/user/register',
    {
      email,
      phoneNumber,
    },
    {
      headers: {
        authorization: token,
      },
    },
  );
};

export const callOnboard = async (userName, inviteCode, jwtToken) => {
  if (jwtToken) {
    return await axios.post(
      '/api/invite/onBoard',
      {
        userName,
        inviteCode,
      },
      {
        headers: {
          authorization: jwtToken,
        },
      },
    );
  } else {
    return await axios.post('/api/invite/onBoard', {
      userName,
      inviteCode,
    });
  }
};

export const callLogin = async token => {
  return await axios.post(
    '/api/user/login',
    {},
    {
      headers: {
        authorization: token,
      },
    },
  );
};

export const preRegisterUser = async (userName, type, challengeId, challengeAnswer) => {
  return await axios.post('/api/user/preRegister', { type, userName, challengeId, challengeAnswer });
};

export const getCaptcha = async () => {
  return await axios.get('/api/user/registerChallenge')
}

export const checkCaptcha = async (user, challengeId, challengeAnswer) => {
  return await axios.get(`/api/user/checkAnswer?user=${encodeURIComponent(user)}&challengeId=${challengeId}&challengeAnswer=${challengeAnswer}`);
};

export const checkUserExists = async (user) => {
  return await axios.get(`/api/user/userExists/${encodeURIComponent(user)}`);
}

export const checkUserStatus = async (user) => {
  return await axios.get(`/api/user/userStatus/${encodeURIComponent(user)}`);
}
