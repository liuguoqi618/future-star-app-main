import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {signUp, userLogin, resendCode} from '../../cognito';
import {setToken} from '../../utils/axios';
import Toast from 'react-native-toast-message';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {setRefreshToken} from '../../utils/storage';
import * as Sentry from '@sentry/react-native';
import configs from '../../configs';

import {InterText} from '../../components/CustomText';
import LoadingModal from '../../components/LoadingModal';
import SignUpCompleteModal from '../../components/auth/SignUpCompleteModal';

export default function ConfirmCodeScreen({navigation, route}) {
  const {t} = useTranslation();
  const {height} = useWindowDimensions();

  const {mode, userName, email, phoneNumber, password} = route.params;

  const [code, setCode] = useState('');

  const [codeError, setCodeError] = useState('');

  const [codeTimer, setCodeTimer] = useState(-1);
  const codeTimerInterval = useRef();

  const [disableSignup, setDisableSignup] = useState(false);

  const canSignUp = code.length > 0;

  const signupModalRef = useRef()

  useEffect(() => {
    return () => {
      clearInterval(codeTimerInterval.current);
    };
  }, []);

  useEffect(() => {
    if (codeTimer < 0) {
      clearInterval(codeTimerInterval.current);
    }
  }, [codeTimer]);

  useEffect(() => {
    setCodeError('');
  }, [code]);

  const onSendCode = () => {
    setCodeTimer(60);
    codeTimerInterval.current = setInterval(
      () => setCodeTimer(time => time - 1),
      1000,
    );
    if (configs.release === 'prod') {
      Sentry.withScope(scope => {
        scope.setUser({
          userName,
        });
        Sentry.captureMessage('Code already sent. Resend code.');
      });
    }
    resendCode(
      userName,
      () => {
        // success
        if (configs.release === 'prod') {
          Sentry.withScope(scope => {
            scope.setUser({
              userName,
            });
            Sentry.captureMessage('Code already sent. Resend code. Success');
          });
        }
      },
      (e) => {
        if (configs.release === 'prod') {
          Sentry.withScope(scope => {
            scope.setUser({
              userName,
            });
            scope.setContext({
              event: 'Code already sent. Resend code. Failed',
            })
            Sentry.captureException(e);
          });
        }
        Toast.show({type: 'error', text1: t('auth.error7')});
        setCodeTimer(-1);
        clearInterval(codeTimerInterval.current);
      },
    );
  };

  const onSignup = async () => {
    const onSignupSuccess = () => {
      if (password) {
        if (configs.release === 'prod') {
          Sentry.withScope(scope => {
            scope.setUser({
              userName,
            });
            Sentry.captureMessage('Sign up complete. Attempt login');
          });
        }

        const onLoginSuccess = async data => {
          try {
            const jwtToken = data.idToken.jwtToken;
            // console.log('register jwtToken: ', jwtToken);
            if (configs.release === 'prod') {
              Sentry.withScope(scope => {
                scope.setUser({
                  userName,
                });
                Sentry.captureMessage('Sign up complete. Login complete. Calling api/user/register');
              });
            }
            setToken(jwtToken);
            setRefreshToken(data.refreshToken.token);
            setDisableSignup(false);
            navigation.replace('OnboardScreen', {
              email,
              phoneNumber,
              password,
              jwtToken,
            });
            // const result = await callSignup({
            //   email,
            //   phoneNumber,
            //   token: jwtToken,
            // });
            // if (configs.release === 'prod') {
            //   Sentry.withScope(scope => {
            //     scope.setUser({
            //       userName,
            //     });
            //     scope.setContext(result.data.data)
            //     Sentry.captureMessage('Sign up complete. Login complete. api/user/register complete');
            //   });
            // }
            // if (result.data.data.status === 1) {

            // } else {
            //   setDisableSignup(false);
            //   navigation.goBack();
            // }
          } catch (e) {
            if (configs.release === 'prod') {
              Sentry.withScope(scope => {
                scope.setUser({
                  userName,
                });
                scope.setContext({
                  event: 'Sign up complete. Login complete. api/user/register failed',
                })
                Sentry.captureException(e);
              });
            }
            console.log(e);
          }
        };

        const onLoginFail = (err) => {
          Toast.show({type: 'error', text1: t('auth.error7')});
          if (configs.release === 'prod') {
            Sentry.withScope(scope => {
              scope.setUser({
                userName,
              });
              scope.setContext({
                event: 'Sign up complete. Login failed.',
              })
              Sentry.captureException(err);
            });
          }
        };

        userLogin(
          userName,
          password,
          onLoginSuccess,
          onLoginFail,
          true,
        );
      } else {
        setDisableSignup(false)
        signupModalRef.current.show()
      }
    };

    const onSignupFail = error => {
      if (configs.release === 'prod') {
        Sentry.withScope(scope => {
          scope.setUser({
            userName,
          });
          scope.setContext({
            event: 'Sign up failed',
          })
          Sentry.captureException(error);
        });
      }
      if (error.code === 'CodeMismatchException') {
        setCodeError(t('auth.error6'));
      } else {
        // undefined error
        Toast.show({type: 'error', text1: t('auth.error7')});
      }
      setDisableSignup(false);
    };

    setDisableSignup(true);
    if (configs.release === 'prod') {
      Sentry.withScope(scope => {
        scope.setUser({
          userName,
        });
        Sentry.captureMessage('Sign up');
      });
    }
    signUp(
      userName,
      code,
      onSignupSuccess,
      onSignupFail,
    );
  };

  return (
    <View
      style={[
        styles.container,
        {height, paddingBottom: initialWindowMetrics.insets.bottom},
      ]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView style={{flex: 1}}>
        <View style={{marginBottom: 24}}>
          <InterText weight={600} style={{fontSize: 14, color: '#0E73F6'}}>
            {t('auth.signup')} 3/4
          </InterText>
          <InterText weight={700} style={{fontSize: 28, color: '#000000'}}>
            {t('auth.codeTitle')}
          </InterText>
          <InterText weight={500} style={{fontSize: 14, color: '#000000'}}>
            {t(mode === 0 ? 'auth.codeDescPhone' : 'auth.codeDescEmail')}
          </InterText>
        </View>

        <InterText style={{marginTop: 8, fontSize: 14, color: '#252C32'}}>
          {t(mode === 0 ? 'auth.phone2' : 'auth.email')}
        </InterText>

        <InterText
          weight={600}
          style={{marginVertical: 10, fontSize: 16, color: '#000000'}}>
          {userName}
        </InterText>

        <InterText style={{marginTop: 5, fontSize: 14, color: '#252C32'}}>
          {t('auth.verificationCode')}
        </InterText>

        <View
          style={[styles.inputWrapper, codeError && {borderColor: '#F2271C'}]}>
          <TextInput
            value={code}
            onChangeText={setCode}
            style={styles.input}
            placeholder={t('auth.inputVerification')}
            keyboardType="number-pad"
          />
          <TouchableOpacity disabled={codeTimer > 0} onPress={onSendCode}>
            <InterText weight={500} style={{fontSize: 14, color: '#0E73F6'}}>
              {codeTimer > 0 ? codeTimer : t('auth.resendCode')}
            </InterText>
          </TouchableOpacity>
        </View>

        <InterText style={{marginTop: 5, fontSize: 12, color: '#F2271C'}}>
          {codeError ?? ''}
        </InterText>
      </KeyboardAwareScrollView>

      <TouchableOpacity
        style={[styles.login, !canSignUp && styles.disabled]}
        onPress={onSignup}
        disabled={!canSignUp || disableSignup}>
        <InterText weight={600} style={{fontSize: 16, color: '#FFFFFF'}}>
          {t('auth.signup')}
        </InterText>
      </TouchableOpacity>

      <LoadingModal visible={disableSignup} />

      <SignUpCompleteModal ref={signupModalRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  inputWrapper: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    borderColor: '#DDE2E4',
    borderWidth: 1,
    marginTop: 4,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#252C32',
    height: 40,
  },
  login: {
    flexDirection: 'row',
    backgroundColor: '#0E73F6',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
    // marginBottom: 10,
  },
  noAccount: {
    flexDirection: 'row',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  disabled: {
    backgroundColor: '#B0BABF',
  },
  modeSelect: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  mode: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
  },
  modeSelected: {
    backgroundColor: '#0E73F6',
  },
  callCode: {
    width: 50,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#252C32',
    height: 40,
    textAlign: 'center',
  },
});
