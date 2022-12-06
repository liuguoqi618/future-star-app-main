const amazonCognitoIdentity = require('amazon-cognito-identity-js');
import {getUserMigrationStatus} from '../apis/user';
import configs from '../configs';
import {getRefreshToken} from '../utils/storage';
import {migrateUser} from '../apis/user';
const poolData = {
  UserPoolId: configs.AWS_USER_POOL_ID,
  ClientId: configs.AWS_CLIENT_ID,
};
const userPool = new amazonCognitoIdentity.CognitoUserPool(poolData);
const migratedPoolData = {
  UserPoolId: configs.MIGRATED_AWS_USER_POOL_ID,
  ClientId: configs.MIGRATED_AWS_CLIENT_ID,
};
const migratedUserPool = new amazonCognitoIdentity.CognitoUserPool(
  migratedPoolData,
);

export const userLogin = async (
  email,
  password,
  onLoginSuccess,
  onLoginFailure,
  firstTimeLogin = false,
) => {
  let migrated = true;
  let USERPOOL = userPool;
  try {
    const {data} = await getUserMigrationStatus(email);
    migrated = data.data.migrated;
    if (migrated) {
      // console.log('using new cognito');
      USERPOOL = migratedUserPool;
    }
  } catch (err) {
    console.log('err: ', err, err.code);
  }
  const authenticationDetails = new amazonCognitoIdentity.AuthenticationDetails(
    {
      Username: email,
      Password: password,
    },
  );
  const userDetails = {
    Username: email,
    Pool: USERPOOL,
  };
  const cognitoUser = new amazonCognitoIdentity.CognitoUser(userDetails);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: async data => {
      onLoginSuccess(data);
      if (!migrated) {
        if (email.startsWith('+')) {
          await migrateUser(
            'phone_number',
            email,
            password,
            data.idToken.jwtToken,
          );
        } else {
          await migrateUser(
            'email',
            email,
            password,
            data.idToken.jwtToken,
          );
        }
      }
    },
    onFailure: async err => {
      console.log(err.code);
      if (err && err.code) {
        onLoginFailure(err);
      } else {
        console.log(
          'An error has occurred. Please check your parameters and try again',
        );
      }
    },
  });
};

export const sendCode = async (
  email,
  password,
  type,
  onCreateAccountSuccess,
  onCreateAccountFail,
) => {
  let attributeList = [];
  let migrated = true;
  let USERPOOL = userPool;
  try {
    const {data} = await getUserMigrationStatus(email);
    migrated = data.data.migrated;
    if (!migrated) {
      // console.log('using new cognito');

      USERPOOL = migratedUserPool;
    }
  } catch (err) {
    console.log('err: ', err, err.code);
  }
  attributeList.push(
    new amazonCognitoIdentity.CognitoUserAttribute({
      Name: type,
      Value: email,
    }),
  );
  USERPOOL.signUp(email, password, attributeList, null, async (err, data) => {
    if (err) {
      onCreateAccountFail(err);
    } else {
      onCreateAccountSuccess();
    }
  });
};

export const resendCode = async (
  email,
  onCreateAccountSuccess,
  onCreateAccountFail,
) => {
  // console.log('enter resend code: ', email);
  let migrated = true;
  let USERPOOL = userPool;
  try {
    const {data} = await getUserMigrationStatus(email);
    migrated = data.data.migrated;
    if (migrated) {
      // console.log('resend code using new cognito');

      USERPOOL = migratedUserPool;
    }
  } catch (err) {
    console.log('err: ', err, err.code);
  }
  const userDetails = {
    Username: email,
    Pool: USERPOOL,
  };
  const cognitoUser = new amazonCognitoIdentity.CognitoUser(userDetails);
  cognitoUser.resendConfirmationCode((err, result) => {
    if (err) {
      onCreateAccountFail(err);
    } else {
      onCreateAccountSuccess(result);
    }
  });
};

export const checkUserStatus = async (email, password, onSuccess, onFail) => {
  let migrated = true;
  let USERPOOL = userPool;
  try {
    const {data} = await getUserMigrationStatus(email);
    migrated = data.data.migrated;
    if (migrated) {
      USERPOOL = migratedUserPool;
    }
  } catch (err) {
    console.log('err: ', err, err.code);
  }
  const userDetails = {
    Username: email,
    Pool: USERPOOL,
  };

  const cognitoUser = new amazonCognitoIdentity.CognitoUser(userDetails);
  const authDetails = new amazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: password,
  });

  cognitoUser.authenticateUser(authDetails, {
    onSuccess: () => {
      const currentUser = userPool.getCurrentUser();
      if (currentUser) {
        cognitoUser.getUserData((err, result) => {
          if (err) {
            onFail(err);
          } else {
            onSuccess(result);
          }
        });
      }
    },
    onFailure: err => {
      onFail(err);
      // console.log(err);
    },
  });
};

export const signUp = async (email, validationCode, onSuccess, onFail) => {
  let migrated = true;
  let USERPOOL = userPool;
  try {
    const {data} = await getUserMigrationStatus(email);
    migrated = data.data.migrated;
    if (migrated) {
      // console.log('using new cognito');
      USERPOOL = migratedUserPool;
    }
  } catch (err) {
    console.log('err: ', err, err.code);
  }
  const userDetails = {
    Username: email,
    Pool: USERPOOL,
  };

  const cognitoUser = new amazonCognitoIdentity.CognitoUser(userDetails);

  cognitoUser.confirmRegistration(validationCode, true, async (err, data) => {
    if (err) {
      onFail(err);
    } else {
      onSuccess(data);
    }
  });
};

export const forgetPassword = async (
  email,
  onSendCodeSucess,
  onSendCodeFail,
) => {
  //give code
  let migrated = true;
  let USERPOOL = userPool;
  try {
    const {data} = await getUserMigrationStatus(email);
    migrated = data.data.migrated;
    if (migrated) {
      // console.log('using new cognito');

      USERPOOL = migratedUserPool;
    }
  } catch (err) {
    console.log('err: ', err, err.code);
  }

  const userDetails = {
    Username: email,
    Pool: USERPOOL,
  };
  const cognitoUser = new amazonCognitoIdentity.CognitoUser(userDetails);
  cognitoUser.forgotPassword({
    onSuccess: async data => {
      onSendCodeSucess();
    },
    onFailure: err => {
      console.log(err);
      onSendCodeFail(err);
    },
  });
};

export const resetPassword = async (
  email,
  code,
  password,
  onConfirmSuccess,
  onConfirmFailed,
) => {
  //changepassword
  let migrated = true;
  let USERPOOL = userPool;
  try {
    const {data} = await getUserMigrationStatus(email);
    migrated = data.data.migrated;
    if (migrated) {
      // console.log('using new cognito');

      USERPOOL = migratedUserPool;
    }
  } catch (err) {
    console.log('err: ', err, err.code);
  }
  const userDetails = {
    Username: email,
    Pool: USERPOOL,
  };
  const cognitoUser = new amazonCognitoIdentity.CognitoUser(userDetails);
  cognitoUser.confirmPassword(code, password, {
    onSuccess: async () => {
      onConfirmSuccess();
      // console.log('password reset success');
    },
    onFailure: async err => {
      console.log(err);
      onConfirmFailed(err);
    },
  });
};

export const changePassword = async (
  email,
  originalPassword,
  newPassword,
  onSuccess,
  onFail,
) => {
  let migrated = true;
  let USERPOOL = userPool;
  try {
    const {data} = await getUserMigrationStatus(email);
    migrated = data.data.migrated;
    if (migrated) {
      // console.log('using new cognito');

      USERPOOL = migratedUserPool;
    }
  } catch (err) {
    console.log('err: ', err, err.code);
  }
  const userDetails = {
    Username: email,
    Pool: USERPOOL,
  };

  const cognitoUser = new amazonCognitoIdentity.CognitoUser(userDetails);
  const authDetails = new amazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: originalPassword,
  });

  cognitoUser.authenticateUser(authDetails, {
    onSuccess: () => {
      const currentUser = USERPOOL.getCurrentUser();
      if (currentUser) {
        cognitoUser.changePassword(
          originalPassword,
          newPassword,
          (err, result) => {
            if (err) {
              onFail(err);
            } else {
              onSuccess(result);
            }
          },
        );
      }
    },
    onFailure: err => {
      console.log(err);
      onFail();
    },
  });
};
export const refreshAccessToken = async (onSuccess, onFail) => {
  let cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    const refreshToken = await getRefreshToken();
    const token = new amazonCognitoIdentity.CognitoRefreshToken({
      RefreshToken: refreshToken,
    });
    cognitoUser.refreshSession(token, (err, session) => {
      if (err) {
        console.log(err);
        onFail(err);
      } else {
        const jwt = session.getIdToken().getJwtToken();
        onSuccess(jwt);
      }
    });
  } else {
    cognitoUser = migratedUserPool.getCurrentUser();
    if (cognitoUser) {
      const refreshToken = await getRefreshToken();
      const token = new amazonCognitoIdentity.CognitoRefreshToken({
        RefreshToken: refreshToken,
      });
      cognitoUser.refreshSession(token, (err, session) => {
        if (err) {
          console.log(err);
          onFail(err);
        } else {
          const jwt = session.getIdToken().getJwtToken();
          onSuccess(jwt);
        }
      });
    } else {
      console.log('Expired');
    }
  }
};
