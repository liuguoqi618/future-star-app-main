import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import ProfileScreen from '../screens-v1/profile/ProfileScreen'

const ProfileStack = createStackNavigator()

const ProfileNavigator = () => {
  const { Navigator, Screen } = ProfileStack

  return (
    <Navigator screenOptions={{
      headerShown: false,
    }}>
      <Screen name="ProfileScreen" component={ProfileScreen} />
    </Navigator>
  )
}

export default ProfileNavigator
