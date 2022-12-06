import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Image,
  Platform,
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
import { userLogin } from '../../cognito';
import {callLogin, callSignup, checkUserStatus} from '../../apis/auth';
import {setToken} from '../../utils/axios';
import {GlobalContext} from '../../context/GlobalContext';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {
  getFitnessRequested,
  setFitnessAccepted,
  setFitnessRequested,
  setLoginCredentials,
  setRefreshToken,
} from '../../utils/storage';
import {resendCode} from '../../cognito';
import {languageOptions, storeLocale} from '../../locale';
import {request, PERMISSIONS} from 'react-native-permissions';
import * as Sentry from '@sentry/react-native';
import configs from '../../configs';
import Toast from 'react-native-toast-message';

import {InterText} from '../../components/CustomText';
import DropDownPicker from '../../components/DropDownPicker';
import RequestModal from '../../components/fitness/RequestModal';
import LoadingModal from '../../components/LoadingModal';
import CountryCodePicker from '../../components/auth/CountryCodePicker';
import BannedModal from '../../components/BannedModal';

const eyeIcon = require('../../assets/images/Auth/eye.png');
const eyeCrossIcon = require('../../assets/images/Auth/eye-cross.png');

export default function LoginScreen({navigation}) {
  const {t, i18n} = useTranslation();
  const {height} = useWindowDimensions();

  const [, dispatch] = useContext(GlobalContext);

  const [mode, setMode] = useState(0); // 0: phone, 1: email

  const [callCode, setCallCode] = useState(null);
  const [phone, setPhone] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [callCodeError, setCallCodeError] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dropDownRef = useRef();
  const [language, setLanguage] = useState(i18n.language);

  const callCodeValid = !!callCode;
  const phoneNumber = (callCodeValid ? callCode.phoneCode : '') + (phone).replace(/[^0-9]/g, '');

  const canLogin =
    (mode === 0 ? phone.length > 0 && callCodeValid : email.length > 0) &&
    password.length > 0;

  const requestFitnessRef = useRef();
  const bannedModalRef = useRef();

  const [disableLogin, setDisabledLogin] = useState(false);

  useEffect(() => {
    setPhoneError('');
    setEmailError('');
    setPasswordError('');
    setCallCodeError(false);
  }, [email, password, phone, callCode]);

  const onLogin = async () => {
    try {
      setDisabledLogin(true)
      const result = await checkUserStatus(mode === 0 ? phoneNumber : email)
      if (result.data.data.userStatus === -1) {
        bannedModalRef.current.show()
        return
      } else if (result.data.data.userStatus === 2) {
        bannedModalRef.current.show()
        return
      } else if (result.data.data.userStatus === 4) {
        if (mode === 0) {
          setPhoneError(t('auth.error14'));
        } else {
          setEmailError(t('auth.error14'));
        }
        setDisabledLogin(false);
        return
      }
    } catch (e) {
      // user does not exist
      if (mode === 0) {
        setPhoneError(t('auth.error15'));
      } else {
        setEmailError(t('auth.error15'));
      }
      setDisabledLogin(false);
      return
    }

    const onLoginSuccess = async data => {
      try {
        if (configs.release === 'prod') {
          Sentry.withScope(scope => {
            scope.setUser({
              userName: mode === 0 ? phoneNumber : email,
            });
            Sentry.captureMessage('Login successful. Calling api/user/login');
          });
        }
        const jwtToken = data.idToken.jwtToken;
        const result = await callLogin(jwtToken);
        if (result.data.data.status === 1) {
          if (configs.release === 'prod') {
            Sentry.withScope(scope => {
              scope.setUser({
                userName: mode === 0 ? phoneNumber : email,
              });
              Sentry.captureMessage('Api login successful. user not onboard');
            });
          }
          setToken(jwtToken);
          setRefreshToken(data.refreshToken.token);
          setDisabledLogin(false);
          navigation.replace('OnboardScreen', {
            email,
            phoneNumber,
            password,
            jwtToken,
          });
        } else if (result.data.data.status === 0) {
          if (configs.release === 'prod') {
            Sentry.withScope(scope => {
              scope.setUser({
                userName: mode === 0 ? phoneNumber : email,
              });
              Sentry.captureMessage('Login successful');
            });
          }
          setToken(jwtToken);
          setRefreshToken(data.refreshToken.token);
          setLoginCredentials(JSON.stringify({email, phoneNumber, password}));
          dispatch({
            type: 'LOG_IN',
            data: {
              username: result.data.data.userName,
              avatarUrl: result.data.data.avatarUrl,
              email: result.data.data.email,
              phoneNumber: result.data.data.phoneNumber,
              inviteCode: result.data.data.inviteCode,
              verificationStatus: result.data.data.verificationStatus,
              starLevel: result.data.data.starLevel,
            },
          });

          const fitness = await getFitnessRequested();
          setDisabledLogin(false);
          if (!fitness) {
            requestFitnessRef.current.show();
            setFitnessRequested('true');
          } else {
            navigation.goBack();
          }
        } else {
          setDisabledLogin(false);
          Toast.show({type: 'error', text1: t('auth.error7')});
        }
      } catch (e) {
        console.log(e.response.data.message);
        setDisabledLogin(false);
        if (e.response.data.message === 'userIsNotFound') {
          if (mode === 0) {
            setPhoneError(t('auth.error1'));
          } else {
            setEmailError(t('auth.error1'));
          }
        } else if (e.response.data.status === 409) {
          bannedModalRef.current.show();
        }
      }
    };

    const onLoginFail = e => {
      console.log(e.code)
      if (configs.release === 'prod') {
        Sentry.withScope(scope => {
          scope.setUser({
            userName: mode === 0 ? phoneNumber : email,
          });
          scope.setContext({
            event: 'Login failed',
          })
          Sentry.captureException(e);
        });
      }

      setPasswordError(t('auth.error16'));
      setDisabledLogin(false)
    }

    setDisabledLogin(true);
    // checkUserStatus(
    //   mode === 0 ? phoneNumber : email,
    //   password,
    //   () => {},
    //   () => {},
    // );
    userLogin(
      mode === 0 ? phoneNumber : email,
      password,
      onLoginSuccess,
      onLoginFail,
    );
  };

  const onFitnessConfirm = async () => {
    requestFitnessRef.current.hide();
    setFitnessAccepted('true');
    if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);
    } else {
      request(PERMISSIONS.IOS.MOTION);
    }
    navigation.goBack();
  };

  const onFitnessDeny = () => {
    requestFitnessRef.current.hide();
    navigation.goBack();
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

      <KeyboardAwareScrollView style={{ paddingHorizontal: 12 }}>
        <View style={{marginVertical: 24}}>
          <InterText weight={700} style={{fontSize: 28, color: '#000000'}}>
            {t('auth.loginTitle')}
          </InterText>
          <InterText weight={500} style={{fontSize: 14, color: '#000000'}}>
            {t('auth.loginDesc')}
          </InterText>
        </View>

        <View style={styles.modeSelect}>
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
        </View>

        {mode === 0 ? (
          <>
            <InterText style={{marginTop: 16, fontSize: 14, color: '#252C32'}}>
              {t('auth.phone2')}
            </InterText>

            <View
              style={[
                styles.inputWrapper,
                (phoneError) && {borderColor: '#F2271C'},
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
                      return text;
                    } else {
                      return '+' + text;
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
                (emailError) && {borderColor: '#F2271C'},
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

        <InterText style={{marginTop: 5, fontSize: 14, color: '#252C32'}}>
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

        <View
          style={{marginTop: 5, flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <DropDownPicker
              ref={dropDownRef}
              value={language}
              setValue={setLanguage}
              options={languageOptions}
              onConfirm={locale => {
                storeLocale(locale);
                i18n.changeLanguage(locale);
              }}
            />
          </View>
          <View
            style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPasswordScreen')}>
              <InterText weight={500} style={{fontSize: 14, color: '#0E73F6'}}>
                {t('auth.forgotQ')}
              </InterText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <TouchableOpacity
        style={[styles.login, !canLogin && styles.disabled]}
        onPress={onLogin}
        disabled={!canLogin || disableLogin}>
        <InterText weight={600} style={{fontSize: 16, color: '#FFFFFF'}}>
          {t('auth.login')}
        </InterText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.noAccount}
        onPress={() => navigation.navigate('SignupScreen')}>
        <InterText weight={600} style={{fontSize: 16, color: '#0E73F6'}}>
          {t('auth.noAccount')}
        </InterText>
      </TouchableOpacity>

      <RequestModal
        ref={requestFitnessRef}
        onConfirm={onFitnessConfirm}
        onDeny={onFitnessDeny}
      />

      <LoadingModal visible={disableLogin} />

      <BannedModal ref={bannedModalRef} />
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
    // marginBottom: 20,
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
