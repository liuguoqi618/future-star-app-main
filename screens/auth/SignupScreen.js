import React, {useEffect, useRef, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import {checkCaptcha, checkUserStatus, getCaptcha} from '../../apis/auth';
import * as Sentry from '@sentry/react-native';
import configs from '../../configs';
import { resendCode } from '../../cognito';

import {InterText} from '../../components/CustomText';
import LoadingModal from '../../components/LoadingModal';
import CountryCodePicker from '../../components/auth/CountryCodePicker';
import CaptchaModal from '../../components/auth/CaptchaModal';

export default function SignupScreen({navigation}) {
  const {t} = useTranslation();
  const { height } = useWindowDimensions()

  const [mode, setMode] = useState(0); // 0: phone, 1: email

  const [callCode, setCallCode] = useState(null);
  const [phone, setPhone] = useState('');

  const [email, setEmail] = useState('');

  const [callCodeError, setCallCodeError] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [challengeId, setChallengeId] = useState();

  const [disableSignup, setDisableSignup] = useState(false);

  const [userExists, setUserExists] = useState(false);

  const captchaModalRef = useRef();

  const callCodeValid = !!callCode
  const phoneNumber = (callCodeValid ? callCode.phoneCode : '') + (phone).replace(/[^0-9]/g, '')

  const canSignUp = (mode === 0 ? phone.length > 0 && callCodeValid : email.length > 0)
    // (mode === 0 ? phone.length > 0 && callCodeValid : email.length > 0) &&
    // password.length > 0 &&
    // repeatPassword.length > 0 &&
    // userAgree;

  useEffect(() => {
    setPhoneError('');
    setEmailError('');
    setCallCodeError(false);
  }, [email, phone, callCode]);

  const tryGetCaptcha = async () => {
    if (mode === 0) {
      if (phone.length === 0 || callCode.length === 0) {
        setPhoneError(t('auth.error12'));
      }
    } else {
      if (email.length === 0) {
        setEmailError(t('auth.error12'));
      }
    }

    // if (password !== repeatPassword) {
    //   setRepeatError(t('auth.error3'));
    //   return;
    // }

    // if (!/^\S{8,99}$/.test(password)) {
    //   setPasswordError(t('auth.error4'));
    //   return;
    // }

    setDisableSignup(true);
    setChallengeId(null);

    try {
      const result = await checkUserStatus(mode === 0 ? phoneNumber : email)
      console.log(result.data.data.userStatus)
      if (result.data.data.userStatus !== 4) {
        if (mode === 0) {
          setPhoneError(t('auth.error10'));
        } else {
          setEmailError(t('auth.error11'));
        }
        setDisableSignup(false);
        return
      } else {
        setUserExists(true)
      }
    } catch (e) {
      setUserExists(false)
      // user does not exist, continue
    }

    if (configs.release === 'prod') {
      Sentry.withScope(scope => {
        scope.setUser({
          userName: mode === 0 ? phoneNumber : email,
        });
        Sentry.captureMessage('Request CAPTCHA');
      });
    }
    getCaptcha()
      .then(result => {
        setDisableSignup(false);
        setChallengeId(result.data.data.challengeId);
        captchaModalRef.current.show(result.data.data.base64);
      })
      .catch(e => {
        if (configs.release === 'prod') {
          Sentry.withScope(scope => {
            scope.setUser({
              userName: mode === 0 ? phoneNumber : email,
            });
            scope.setContext({
              event: 'Request CAPTCHA failed',
            })
            Sentry.captureException(e);
          });
        }
        if (!e.isTimeout) {
          Toast.show({type: 'error', text1: t('auth.error7')});
        }
        console.log(e);
        setDisableSignup(false);
      });
  };

  const getNewCaptcha = () => {
    captchaModalRef.current.hide();
    setDisableSignup(true);
    setChallengeId(null);
    if (configs.release === 'prod') {
      Sentry.withScope(scope => {
        scope.setUser({
          userName: mode === 0 ? phoneNumber : email,
        });
        Sentry.captureMessage('Refresh CAPTCHA');
      });
    }
    getCaptcha()
      .then(result => {
        setDisableSignup(false);
        setChallengeId(result.data.data.challengeId);
        captchaModalRef.current.show(result.data.data.base64);
      })
      .catch(e => {
        if (configs.release === 'prod') {
          Sentry.withScope(scope => {
            scope.setUser({
              userName: mode === 0 ? phoneNumber : email,
            });
            scope.setContext({
              event: 'Refresh CAPTCHA failed',
            })
            Sentry.captureException(e);
          });
        }
        console.log(e);
        if (!e.isTimeout) {
          Toast.show({type: 'error', text1: t('auth.error7')});
        }
        setDisableSignup(false);
      });
  };

  const onContinue = async challengeAnswer => {
    setDisableSignup(true);

    try {
      await checkCaptcha(
        mode === 0 ? phoneNumber : email,
        challengeId,
        challengeAnswer,
      );
    } catch (e) {
      Toast.show({type: 'error', text1: t('auth.error13')});
      setDisableSignup(false);
      if (configs.release === 'prod') {
        Sentry.withScope(scope => {
          scope.setUser({
            userName: mode === 0 ? phoneNumber : email,
          });
          Sentry.captureMessage('CAPTCHA incorrect');
        });
      }
      return;
    }

    if (configs.release === 'prod') {
      Sentry.withScope(scope => {
        scope.setUser({
          userName: mode === 0 ? phoneNumber : email,
        });
        Sentry.captureMessage('CAPTCHA Verified');
      });
    }

    if (userExists) {
      resendCode(
        mode === 0 ? phoneNumber : email,
        () => {
          if (configs.release === 'prod') {
            Sentry.withScope(scope => {
              scope.setUser({
                userName: mode === 0 ? phoneNumber : email,
              });
              Sentry.captureMessage('Sending user already exists. Resending code');
            });
          }
          setDisableSignup(false);
          navigation.replace('ConfirmCodeScreen', {
            mode,
            userName: mode === 0 ? phoneNumber : email,
            phoneNumber,
            email,
          });
        },
        e => {
          if (configs.release === 'prod') {
            Sentry.withScope(scope => {
              scope.setUser({
                userName: mode === 0 ? phoneNumber : email,
              });
              scope.setContext({
                event: 'Sign up and resend code',
              })
              Sentry.captureException(e);
            });
          }
          setDisableSignup(false);
          if (!e.isTimeout) {
            Toast.show({type: 'error', text1: t('auth.error7')});
          }
        },
      );
    } else {
      setDisableSignup(false)
      navigation.replace('PasswordScreen', {
        mode,
        userName: mode === 0 ? phoneNumber : email,
        phoneNumber,
        email,
        challengeId,
        challengeAnswer,
      })
    }
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
        <InterText style={{ flex: 1, textAlign: 'right', fontSize: 16, color: '#84919A' }}>
          v1.0.{configs.APP_VERSION}
        </InterText>
      </View>

      <KeyboardAwareScrollView style={{paddingHorizontal: 12}}>
        <View style={{marginBottom: 24}}>
          <InterText weight={600} style={{fontSize: 14, color: '#0E73F6'}}>
            {t('auth.signup')} 1/4
          </InterText>
          <InterText weight={700} style={{fontSize: 28, color: '#000000'}}>
            {t('auth.signUpTitle')}
          </InterText>
          <InterText weight={500} style={{fontSize: 14, color: '#000000'}}>
            {t('auth.signUpDesc')}
          </InterText>
        </View>

        {/* <View style={styles.modeSelect}>
          <Pressable
            style={[styles.mode, mode === 0 && styles.modeSelected]}
            onPress={() => setMode(0)}
            disabled={mode === 0}>
            <InterText
              weight={600}
              style={{fontSize: 16, color: mode === 0 ? '#FFFFFF' : '#5B6871'}}>
              {t('auth.phone')}
            </InterText>
          </Pressable>
          <Pressable
            style={[styles.mode, mode === 1 && styles.modeSelected]}
            onPress={() => setMode(1)}
            disabled={mode === 1}>
            <InterText
              weight={600}
              style={{fontSize: 16, color: mode === 1 ? '#FFFFFF' : '#5B6871'}}>
              {t('auth.email2')}
            </InterText>
          </Pressable>
        </View> */}

        {mode === 0 ? (
          <>
            <InterText style={{marginTop: 16, fontSize: 14, color: '#252C32'}}>
              {t('auth.phone2')}
            </InterText>

            <View
              style={[
                styles.inputWrapper,
                phoneError && {borderColor: '#F2271C'},
                {paddingLeft: 0},
              ]}>
              <View style={{width: 90}}>
                <CountryCodePicker
                  value={callCode}
                  setValue={setCallCode}
                  error={callCodeError}
                />
              </View>
              {/* <TextInput
                  value={callCode}
                  onChangeText={text =>
                    setCallCode(() => {
                      if (text.charAt(0) === '+') {
                        return text.slice(0, 4);
                      } else {
                        return ('+' + text).slice(0, 4);
                      }
                    })
                  }
                  style={[styles.callCode, !callCodeValid && {color: '#F2271C'}]}
                  keyboardType="numeric"
                /> */}
              <TextInput
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                placeholder={t('auth.inputPhone')}
                keyboardType="phone-pad"
              />
            </View>

            <InterText style={{marginTop: 5, fontSize: 12, color: '#F2271C'}}>
              {phoneError ?? ''}
            </InterText>
          </>
        ) : (
          <>
            <InterText style={{marginTop: 16, fontSize: 14, color: '#252C32'}}>
              {t('auth.email')}
            </InterText>

            <View
              style={[
                styles.inputWrapper,
                emailError && {borderColor: '#F2271C'},
              ]}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder={t('auth.inputEmail')}
              />
            </View>

            <InterText style={{marginTop: 5, fontSize: 12, color: '#F2271C'}}>
              {emailError ?? ''}
            </InterText>
          </>
        )}

        {/* <InterText style={{marginTop: 5, fontSize: 14, color: '#252C32'}}>
          {t('auth.password')}
        </InterText>

        <View
          style={[
            styles.inputWrapper,
            passwordError && {borderColor: '#F2271C'},
          ]}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            placeholder={t('auth.inputPass')}
          />
          <Pressable onPress={() => setShowPassword(v => !v)}>
            <Image
              source={showPassword ? eyeCrossIcon : eyeIcon}
              style={{height: 24, width: 24}}
            />
          </Pressable>
        </View>

        <InterText style={{marginTop: 5, fontSize: 12, color: '#F2271C'}}>
          {passwordError ?? ''}
        </InterText>

        <InterText style={{marginTop: 5, fontSize: 14, color: '#252C32'}}>
          {t('auth.repeatPass')}
        </InterText>

        <View
          style={[styles.inputWrapper, repeatError && {borderColor: '#F2271C'}]}>
          <TextInput
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            secureTextEntry={!showRepeatPassword}
            style={styles.input}
            placeholder={t('auth.inputPass')}
          />
          <Pressable onPress={() => setShowRepeatPassword(v => !v)}>
            <Image
              source={showRepeatPassword ? eyeCrossIcon : eyeIcon}
              style={{height: 24, width: 24}}
            />
          </Pressable>
        </View>

        <InterText style={{marginTop: 5, fontSize: 12, color: '#F2271C'}}>
          {repeatError ?? ''}
        </InterText>

        <View style={{flexDirection: 'row'}}>
          <CheckBox
            value={userAgree}
            onValueChange={setUserAgree}
            tintColors={{true: '#4094F7', false: '#DDE2E4'}}
            tintColor="#DDE2E4"
            onFillColor="#4094F7"
          />
          <View>
            <InterText
              weight={600}
              style={{
                marginLeft: Platform.OS === 'ios' ? 3 : 0,
                fontSize: 14,
                color: '#252C32',
              }}>
              {t('auth.readAgree')}
              <InterText
                weight={600}
                style={{
                  fontSize: 14,
                  color: '#0E73F6',
                  textDecorationLine: 'underline',
                }}
                onPress={() => Linking.openURL(tosUrl)}>
                {t('auth.userAgree')}
              </InterText>
              {t('auth.and')}
              <InterText
                weight={600}
                style={{
                  fontSize: 14,
                  color: '#0E73F6',
                  textDecorationLine: 'underline',
                }}
                onPress={() => Linking.openURL(ppUrl)}>
                {t('auth.privacyPolicy')}
              </InterText>
            </InterText>
          </View>
        </View> */}
      </KeyboardAwareScrollView>

      <TouchableOpacity
        style={[styles.login, !canSignUp && styles.disabled]}
        onPress={tryGetCaptcha}
        disabled={!canSignUp || disableSignup}>
        <InterText weight={600} style={{fontSize: 16, color: '#FFFFFF'}}>
          {t('auth.continue')}
        </InterText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.noAccount}
        onPress={navigation.goBack}>
        <InterText weight={600} style={{fontSize: 16, color: '#0E73F6'}}>
          {t('auth.haveAccount')}
        </InterText>
      </TouchableOpacity>

      <LoadingModal visible={disableSignup} />

      <CaptchaModal
        refresh={getNewCaptcha}
        onConfirm={onContinue}
        ref={captchaModalRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 12,
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
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 10,
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
