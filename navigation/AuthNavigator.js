import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import LoginScreen from '../screens/auth/LoginScreen'
import ForgotPasswordScreen from '../screens/auth/ForgetPasswordScreen'
import SignupScreen from '../screens/auth/SignupScreen'
import OnboardScreen from '../screens/auth/OnboardScreen'
import ConfirmCodeScreen from '../screens/auth/ConfirmCodeScreen'
import SelectCountryScreen from '../screens/auth/SelectyCountryScreen'
import PasswordScreen from '../screens/auth/PasswordScreen'

const AuthStack = createStackNavigator()

const AuthNavigator = () => {
  const { Navigator, Screen } = AuthStack

  return (
    <Navigator screenOptions={{
      headerShown: false,
    }}>
      <Screen name="LoginScreen" component={LoginScreen} />
      <Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Screen name="SignupScreen" component={SignupScreen} />
      <Screen name="ConfirmCodeScreen" component={ConfirmCodeScreen} />
      <Screen name="OnboardScreen" component={OnboardScreen} />
      <Screen name="SelectCountryScreen" component={SelectCountryScreen} />
      <Screen name="PasswordScreen" component={PasswordScreen} />
    </Navigator>
  )
}

export default AuthNavigator
