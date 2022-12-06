import React, { useContext, useEffect, useRef, useState } from 'react'
import { Platform, StyleSheet, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { callOnboard } from '../../apis/auth'
import { GlobalContext } from '../../context/GlobalContext'
import Toast from 'react-native-toast-message'
import { initialWindowMetrics } from 'react-native-safe-area-context'
import { getFitnessRequested, setFitnessAccepted, setFitnessRequested, setLoginCredentials } from '../../utils/storage'
import { request, PERMISSIONS } from 'react-native-permissions';
import * as Sentry from '@sentry/react-native';
import configs from '../../configs';

import { InterText } from '../../components/CustomText'
import RequestModal from '../../components/fitness/RequestModal'
import LoadingModal from '../../components/LoadingModal'

export default function OnboardScreen({ navigation, route }) {
  const { t } = useTranslation()
  const { height } = useWindowDimensions()

  const [,dispatch] = useContext(GlobalContext)

  const [username, setUsername] = useState('')
  const [code, setCode] = useState('')

  const [codeError, setCodeError] = useState('')

  const [disableOnboard, setDisableOnboard] = useState(false)

  const canOnboard = username.length > 0 && code.length > 0

  const { email, phoneNumber, password, jwtToken } = route.params

  const requestFitnessRef = useRef()

  useEffect(() => {
    setCodeError('')
  }, [code])

  const onOnboard = async () => {
    setDisableOnboard(true)
    try {
      if (configs.release === 'prod') {
        Sentry.withScope(scope => {
          scope.setUser({
            userName: email ? email : phoneNumber,
          });
          scope.setContext({
            username,
            code,
          })
          Sentry.captureMessage('Onboard requested');
        });
      }
      const result = await callOnboard(username, code, jwtToken)

      if (configs.release === 'prod') {
        Sentry.withScope(scope => {
          scope.setUser({
            userName: email ? email : phoneNumber,
          });
          Sentry.captureMessage('Onboard complete');
        });
      }

      setLoginCredentials(JSON.stringify({ email, phoneNumber, password }))
      // dispatch({ type: 'LOG_IN', data: { username }})
      dispatch({
        type: 'LOG_IN',
        data: {
          username: result.data.data.userName,
          avatarUrl: result.data.data.avatarUrl,
          email: result.data.data.email,
          phoneNumber: result.data.data.phoneNumber,
          inviteCode: result.data.data.inviteCode,
          verificationStatus: { status: -1 },
          starLevel: -1,
        },
      })

      const fitness = await getFitnessRequested()
      setDisableOnboard(false)
      if (!fitness) {
        requestFitnessRef.current.show()
        setFitnessRequested('true')
      } else {
        navigation.navigate('Main')
      }
    } catch (e) {
      console.log(e.response.data)
      setDisableOnboard(false)
      if (configs.release === 'prod') {
        Sentry.withScope(scope => {
          scope.setUser({
            userName: email ? email : phoneNumber,
          });
          scope.setContext({
            event: 'Onboard',
          })
          Sentry.captureException(e);
        });
      }
      if (e.response.data.message.message === 'code error') {
        setCodeError(t('auth.error8'))
      } else {
        // undefined error
        Toast.show({ type: 'error', text1: t('auth.error7')})
      }
    }
  }

  const onFitnessConfirm = async () => {
    requestFitnessRef.current.hide()
    setFitnessAccepted('true')
    if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION)
    } else {
      request(PERMISSIONS.IOS.MOTION)
    }
    navigation.navigate('Main')
  }

  const onFitnessDeny = () => {
    requestFitnessRef.current.hide()
    navigation.goBack()
  }

  return (
    <View style={[styles.container, { height, paddingBottom: initialWindowMetrics.insets.bottom }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={navigation.goBack}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView style={{ paddingHorizontal: 20 }}>
        <View style={{ marginVertical: 24 }}>
          <InterText weight={600} style={{ fontSize: 14, color: '#0E73F6' }}>
            {t('auth.signup')} 4/4
          </InterText>
          <InterText weight={700} style={{ fontSize: 28, color: '#000000' }}>
            {t('auth.personalTitle')}
          </InterText>
          <InterText weight={500} style={{ fontSize: 14, color: '#000000' }}>
            {''}
          </InterText>
        </View>

        <InterText style={{ marginTop: 16, fontSize: 14, color: '#252C32' }}>
          {t('auth.username')}
        </InterText>

        <View style={styles.inputWrapper}>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder={t('auth.inputUsername')}
          />
        </View>

        <InterText style={{ marginTop: 16, fontSize: 14, color: '#252C32' }}>
          {t('auth.invitation')}
        </InterText>

        <View style={[
          styles.inputWrapper,
          codeError && { borderColor: '#F2271C' },
        ]}>
          <TextInput
            value={code}
            onChangeText={setCode}
            style={styles.input}
            placeholder={t('auth.inputInvite')}
            />
        </View>

        <InterText style={{ marginTop: 5, fontSize: 12, color: '#F2271C' }}>
          {codeError ?? ''}
        </InterText>
      </KeyboardAwareScrollView>

      <TouchableOpacity
        style={[styles.earn, !canOnboard && styles.disabled]}
        onPress={onOnboard}
        disabled={!canOnboard || disableOnboard}
      >
        <InterText weight={600} style={{ fontSize: 16, color: '#FFFFFF' }}>
          {t('auth.letsEarn')}
        </InterText>
      </TouchableOpacity>

      <LoadingModal visible={disableOnboard} />

      <RequestModal
        ref={requestFitnessRef}
        onConfirm={onFitnessConfirm}
        onDeny={onFitnessDeny}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 20,
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
  earn: {
    flexDirection: 'row',
    backgroundColor: '#0E73F6',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginHorizontal: 20,
    // marginBottom: 20,
  },
  disabled: {
    backgroundColor: '#B0BABF',
  },
})
