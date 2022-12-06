import React, { useEffect, useRef, useState } from 'react'
import { Image, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-toast-message'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { forgetPassword, resetPassword } from '../../cognito'
import * as Sentry from '@sentry/react-native';
import configs from '../../configs';

import { InterText } from '../../components/CustomText'
import CustomScreenHeader from '../../components/CustomScreenHeader'
import LoadingModal from '../../components/LoadingModal'
import CountryCodePicker from '../../components/auth/CountryCodePicker';

const eyeIcon = require('../../assets/images/Auth/eye.png')
const eyeCrossIcon = require('../../assets/images/Auth/eye-cross.png')

export default function ForgotPasswordScreen({ navigation }) {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  const [mode, setMode] = useState(0) // 0: phone, 1: email

  const [callCode, setCallCode] = useState(null);
  const [phone, setPhone] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [code, setCode] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)

  const [callCodeError, setCallCodeError] = useState(false);
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [repeatError, setRepeatError] = useState('')
  const [codeError, setCodeError] = useState('')

  const [codeTimer, setCodeTimer] = useState(-1)
  const codeTimerInterval = useRef()

  const callCodeValid = !!callCode
  const phoneNumber = (callCodeValid ? callCode.phoneCode : '') + (phone).replace(/[^0-9]/g, '')

  const [disableReset, setDisableReset] = useState(false)

  useEffect(() => {
    return () => {
      clearInterval(codeTimerInterval.current)
    }
  }, [])

  useEffect(() => {
    if (codeTimer < 0) {
      clearInterval(codeTimerInterval.current)
    }
  }, [codeTimer])

  useEffect(() => {
    setEmailError('')
    setPasswordError('')
    setRepeatError('')
    setCodeError('')
  }, [email, password, repeatPassword, code])

  const onSendCode = () => {
    if (mode === 0 ? (phone.length === 0 || !callCodeValid) : (email.length === 0)) {
      setEmailError('error')
      return
    }

    setCodeTimer(60)
    codeTimerInterval.current = setInterval(() => setCodeTimer(time => time - 1), 1000)

    if (configs.release === 'prod') {
      Sentry.withScope(scope => {
        scope.setUser({
          userName: mode === 0 ? phoneNumber : email,
        });
        Sentry.captureMessage('Forget password request');
      });
    }

    forgetPassword(mode === 0 ? phoneNumber : email,
      () => {
        if (configs.release === 'prod') {
          Sentry.withScope(scope => {
            scope.setUser({
              userName: mode === 0 ? phoneNumber : email,
            });
            Sentry.captureMessage('Forget password code sent');
          });
        }
      }, (err) => {
        if (configs.release === 'prod') {
          Sentry.withScope(scope => {
            scope.setUser({
              userName: mode === 0 ? phoneNumber : email,
            });
            scope.setContext({
              event: 'Forget password. unable to send code',
            })
            Sentry.captureException(err);
          });
        }
        setCodeTimer(-1)
        clearInterval(codeTimerInterval.current)
      }
    )
  }

  const onResetPassword = async () => {
    if (password !== repeatPassword) {
      setRepeatError(t('auth.error3'))
      return
    }

    if (!(/^\S{8,99}$/).test(password)) {
      setPasswordError(t('auth.error4'))
      return
    }

    setDisableReset(true)

    if (configs.release === 'prod') {
      Sentry.withScope(scope => {
        scope.setUser({
          userName: mode === 0 ? phoneNumber : email,
        });
        Sentry.captureMessage('Forget password. Attempt reset');
      });
    }

    resetPassword(mode === 0 ? phoneNumber : email, code, password, () => {
      Toast.show({ type: 'info', text1: t('auth.passChangeSuccess')})
      setDisableReset(false)
      if (configs.release === 'prod') {
        Sentry.withScope(scope => {
          scope.setUser({
            userName: mode === 0 ? phoneNumber : email,
          });
          Sentry.captureMessage('Forget password. reset success');
        });
      }
      navigation.goBack()
    }, (err) => {
      if (configs.release === 'prod') {
        Sentry.withScope(scope => {
          scope.setUser({
            userName: mode === 0 ? phoneNumber : email,
          });
          scope.setContext({
            event: 'Forget password. unable to reset password',
          })
          Sentry.captureException(err);
        });
      }
      if (err.code === 'CodeMismatchException') {
        setCodeError(t('auth.error6'))
      } else {
        Toast.show({ type: 'info', text1: t('auth.passChangeSuccess')})
        setDisableReset(false)
        navigation.goBack()
      }
      setDisableReset(false)
    })
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <CustomScreenHeader title={t('auth.forgotPassword')} />

      <View style={{ marginHorizontal: 20 }}>
        <View style={{ marginVertical: 24 }}>
          <InterText weight={700} style={{ fontSize: 28, color: '#000000' }}>
            {t('auth.forgotTitle')}
          </InterText>
          <InterText weight={500} style={{ fontSize: 14, color: '#000000' }}>
            {t('auth.forgotDesc')}
          </InterText>
        </View>

        <View style={styles.modeSelect}>
          <Pressable
            style={[styles.mode, mode === 0 && styles.modeSelected]}
            onPress={() => setMode(0)}
            disabled={mode === 0}
          >
            <InterText weight={600} style={{ fontSize: 16, color: mode === 0 ? '#FFFFFF' : '#5B6871' }}>
              {t('auth.phone')}
            </InterText>
          </Pressable>
          <Pressable
            style={[styles.mode, mode === 1 && styles.modeSelected]}
            onPress={() => setMode(1)}
            disabled={mode === 1}
          >
            <InterText weight={600} style={{ fontSize: 16, color: mode === 1 ? '#FFFFFF' : '#5B6871' }}>
              {t('auth.email2')}
            </InterText>
          </Pressable>
        </View>

        { mode === 0 ?
          <>
            <InterText style={{marginTop: 16, fontSize: 14, color: '#252C32'}}>
              {t('auth.phone2')}
            </InterText>

            <View style={[styles.inputWrapper, emailError && {borderColor: '#F2271C'}, { paddingLeft: 0 }]}>
              <View style={{width: 90}}>
                <CountryCodePicker
                  value={callCode}
                  setValue={setCallCode}
                  error={callCodeError}
                />
              </View>
              {/* <TextInput
                value={callCode}
                onChangeText={(text) => setCallCode(() => {
                  if (text.charAt(0) === '+') {
                    return text
                  } else {
                    return '+' + text
                  }
                })}
                style={[styles.callCode, !callCodeValid && { color: '#F2271C' }]}
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
              {emailError ?? ''}
            </InterText>
          </> :
          <>
            <InterText style={{marginTop: 16, fontSize: 14, color: '#252C32'}}>
              {t('auth.email')}
            </InterText>

            <View
              style={[styles.inputWrapper, emailError && {borderColor: '#F2271C'}]}>
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
        }

        <InterText style={{ marginTop: 16, fontSize: 14, color: '#252C32' }}>
          {t('auth.verificationCode')}
        </InterText>

        <View style={[
          styles.inputWrapper,
          codeError && { borderColor: '#F2271C' },
        ]}>
          <TextInput
            value={code}
            onChangeText={setCode}
            style={styles.input}
            placeholder={t('auth.inputVerification')}
          />
          <TouchableOpacity disabled={codeTimer > 0} onPress={onSendCode}>
            <InterText weight={500} style={{ fontSize: 14, color: '#0E73F6' }}>
              {codeTimer > 0 ? codeTimer : t('auth.sendCode')}
            </InterText>
          </TouchableOpacity>
        </View>

        <InterText style={{ marginTop: 5, fontSize: 12, color: '#F2271C' }}>
          {codeError ?? ''}
        </InterText>

        <InterText style={{ marginTop: 5, fontSize: 14, color: '#252C32' }}>
          {t('auth.password')}
        </InterText>

        <View style={[
          styles.inputWrapper,
          passwordError && { borderColor: '#F2271C' },
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
              style={{ height: 24, width: 24 }}
            />
          </Pressable>
        </View>

        <InterText style={{ marginTop: 5, fontSize: 12, color: '#F2271C' }}>
          {passwordError ?? ''}
        </InterText>

        <InterText style={{ marginTop: 5, fontSize: 14, color: '#252C32' }}>
          {t('auth.repeatPass')}
        </InterText>

        <View style={[
          styles.inputWrapper,
          repeatError && { borderColor: '#F2271C' },
        ]}>
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
              style={{ height: 24, width: 24 }}
            />
          </Pressable>
        </View>

        <InterText style={{ marginTop: 5, fontSize: 12, color: '#F2271C' }}>
          {repeatError ?? ''}
        </InterText>

        <TouchableOpacity style={styles.login} onPress={onResetPassword} disabled={disableReset}>
          <InterText weight={600} style={{ fontSize: 16, color: '#FFFFFF' }}>
            {t('auth.resetPassword')}
          </InterText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.noAccount, { marginBottom: insets.bottom + 20 }]}
          onPress={navigation.goBack}
        >
          <InterText weight={600} style={{ fontSize: 16, color: '#0E73F6' }}>
            {t('auth.cancel')}
          </InterText>
        </TouchableOpacity>
      </View>

      <LoadingModal visible={disableReset} />
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    marginTop: 40,
    marginBottom: 10,
  },
  noAccount: {
    flexDirection: 'row',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
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
})
