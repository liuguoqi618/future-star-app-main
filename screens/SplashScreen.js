import React, { useContext, useEffect } from 'react'
import { callLogin } from '../apis/auth'
import { userLogin } from '../cognito'
import { GlobalContext } from '../context/GlobalContext'
import { getAppLocale, getLoginCredentials, removeLoginCredentials, removeRefreshToken, setRefreshToken } from '../utils/storage'
import { removeToken, setToken } from '../utils/axios'
import { View } from 'react-native'
import * as ExpoSplashScreen from 'expo-splash-screen'

export default function SplashScreen({ navigation }) {
  const [{}, dispatch] = useContext(GlobalContext)

  useEffect(() => {
    const startup = async () => {
      let destination = 'Main'
      const storedLocale = await getAppLocale()
      if (!storedLocale) {
        destination = 'SetLanguageScreen'
      }

      const credentials = await getLoginCredentials()

      if (credentials) {
        const { email, phoneNumber, password } = JSON.parse(credentials)
        let userIdentity = email
        if (!email) {
          userIdentity = phoneNumber
        }
        userLogin(userIdentity, password, async data => {
          try {
            const jwtToken = data.idToken.jwtToken
            const result = await callLogin(jwtToken)
            if (result.data.data.status === 1) {
              removeToken()
              removeRefreshToken()
              removeLoginCredentials()
              await ExpoSplashScreen.hideAsync()
              navigation.replace(destination)
            } else if (result.data.data.status === 0) {
              setToken(jwtToken)
              setRefreshToken(data.refreshToken.token)
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
              })

              await ExpoSplashScreen.hideAsync()
              navigation.replace(destination)
            }
          } catch (e) {
            console.log(e.response.data.message)
            removeToken()
            removeRefreshToken()
            removeLoginCredentials()
            await ExpoSplashScreen.hideAsync()
            navigation.replace(destination)
          }
        }, async (e) => {
          console.log(e)
          removeToken()
          removeRefreshToken()
          removeLoginCredentials()
          await ExpoSplashScreen.hideAsync()
          navigation.replace(destination)
        })
      } else {
        removeToken()
        removeRefreshToken()
        removeLoginCredentials()
        await ExpoSplashScreen.hideAsync()
        navigation.replace(destination)
      }
    }

    startup()
  }, [dispatch, navigation])

  return (
    <View />
  )
}
