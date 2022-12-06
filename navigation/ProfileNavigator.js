import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import ProfileScreen from '../screens/profile/ProfileScreen'
import EditScreen from '../screens/profile/EditScreen'
import AccountScreen from '../screens/profile/AccountScreen'
import LanguageScreen from '../screens/profile/LanguageScreen'
import ResetPasswordScreen from '../screens/profile/ResetPasswordScreen'
import ContactScreen from '../screens/profile/ContactScreen'
import VerificationScreen from '../screens/profile/VerificationScreen'
import SelectCountry2Screen from '../screens/profile/SelectyCountry2Screen'

const ProfileStack = createStackNavigator()

const ProfileNavigator = () => {
  const { Navigator, Screen } = ProfileStack

  return (
    <Navigator screenOptions={{
      headerShown: false,
    }}>
      <Screen name="ProfileScreen" component={ProfileScreen} />
      <Screen name="EditScreen" component={EditScreen} />
      <Screen name="AccountScreen" component={AccountScreen} />
      <Screen name="LanguageScreen" component={LanguageScreen} />
      <Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      <Screen name="ContactScreen" component={ContactScreen} />
      <Screen name="VerificationScreen" component={VerificationScreen} />
      <Screen name="SelectCountry2Screen" component={SelectCountry2Screen} />
    </Navigator>
  )
}

export default ProfileNavigator
