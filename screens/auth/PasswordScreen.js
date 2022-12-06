import React, {useEffect, useState} from 'react';
import {
  Image,
  Linking,
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
import CheckBox from '@react-native-community/checkbox';
import { sendCode } from '../../cognito';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets, initialWindowMetrics} from 'react-native-safe-area-context';
import { preRegisterUser } from '../../apis/auth';
import * as Sentry from '@sentry/react-native';
import configs from '../../configs';

import {InterText} from '../../components/CustomText';
import LoadingModal from '../../components/LoadingModal';

const eyeIcon = require('../../assets/images/Auth/eye.png');
const eyeCrossIcon = require('../../assets/images/Auth/eye-cross.png');

const tosUrl =
  'https://docs.google.com/document/d/15r1LmXV5oBKfvSzTfwTzGNNPONivJOPwRDAsYm2bMoA/';
const ppUrl =
  'https://docs.google.com/document/d/16aUXrIuqCApkhXKeVAyuRTS5UEluLglaTtj7Qzo6C-Q/';

export default function PasswordScreen({navigation, route}) {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions()

  const { mode, userName, phoneNumber, email, challengeId, challengeAnswer } = route.params

  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [repeatError, setRepeatError] = useState('');

  const [userAgree, setUserAgree] = useState(false);

  const [disableSignup, setDisableSignup] = useState(false);

  const canSignUp =  password.length > 0 && repeatPassword.length > 0 && userAgree

  useEffect(() => {
    setPasswordError('');
    setRepeatError('');
  }, [password, repeatPassword]);

  const onSendCode = async () => {
    if (password !== repeatPassword) {
      setRepeatError(t('auth.error3'));
      return;
    }

    if (!/^\S{8,99}$/.test(password)) {
      setPasswordError(t('auth.error4'));
      return;
    }

    setDisableSignup(true);

    if (configs.release === 'prod') {
      Sentry.withScope(scope => {
        scope.setUser({
          userName,
        });
        Sentry.captureMessage('Call Send Code');
      });
    }

    sendCode(
      userName,
      password,
      mode === 0 ? 'phone_number' : 'email',
      async () => {
        if (configs.release === 'prod') {
          Sentry.withScope(scope => {
            scope.setUser({
              userName,
            });
            Sentry.captureMessage('Sign up and send code to user');
          });
        }
        try {
          await preRegisterUser(
            userName,
            mode === 0 ? 'phone_number' : 'email',
            challengeId,
            challengeAnswer,
          );
          setDisableSignup(false);
          navigation.replace('ConfirmCodeScreen', {
            mode,
            userName,
            phoneNumber,
            email,
            password,
          });
        } catch (e) {
          if (configs.release === 'prod') {
            Sentry.withScope(scope => {
              scope.setUser({
                userName,
              });
              scope.setContext({
                event: 'Preregister failed',
              })
              Sentry.captureException(e);
            });
          }
          if (!e.isTimeout) {
            Toast.show({type: 'error', text1: t('auth.error7')});
          }
          setDisableSignup(false);
        }
      },
      error => {
        if (configs.release === 'prod') {
          Sentry.withScope(scope => {
            scope.setUser({
              userName,
            });
            scope.setContext({
              event: 'Sign up and send code',
            })
            Sentry.captureException(error);
          });
        }
        // undefined error
        Toast.show({type: 'error', text1: t('auth.error7')});
        console.log(error)
        setDisableSignup(false);
      },
    );
  };

  return (
    <View
      style={[
        styles.container,
        {height, paddingBottom: initialWindowMetrics.insets.bottom},
      ]}>
      <View style={[styles.topBar, {marginTop: insets.top}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
        <InterText style={{ flex: 1, textAlign: 'right', fontSize: 16, color: '#84919A' }}>
          v1.0.{configs.APP_VERSION}
        </InterText>
      </View>

      <KeyboardAwareScrollView style={{ paddingHorizontal: 12 }}>
        <View style={{ marginBottom: 24 }}>
          <InterText weight={600} style={{fontSize: 14, color: '#0E73F6'}}>
            {t('auth.signup')} 2/4
          </InterText>
          <InterText weight={700} style={{fontSize: 28, color: '#000000'}}>
            {t('auth.signUpTitle')}
          </InterText>
          <InterText weight={500} style={{fontSize: 14, color: '#000000'}}>
            {t('auth.signUpDesc')}
          </InterText>
        </View>

        <InterText style={{ marginTop: 8, fontSize: 14, color: '#252C32'}}>
          {t(mode === 0 ? 'auth.phone2' : 'auth.email')}
        </InterText>

        <InterText
          weight={600}
          style={{ fontSize: 16, color: '#000000' }}>
          {userName}
        </InterText>

        <InterText style={{marginTop: 10, fontSize: 14, color: '#252C32'}}>
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
          <View style={{ flex: 1 }}>
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
        </View>
      </KeyboardAwareScrollView>

      <TouchableOpacity
        style={[styles.login, !canSignUp && styles.disabled]}
        onPress={onSendCode}
        disabled={!canSignUp || disableSignup}>
        <InterText weight={600} style={{fontSize: 16, color: '#FFFFFF'}}>
          {t('auth.sendCode')}
        </InterText>
      </TouchableOpacity>

      <LoadingModal visible={disableSignup} />
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
