import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from '../screens/home/HomeScreen'

const HomeStack = createStackNavigator()

const HomeNavigator = () => {
  const { Navigator, Screen } = HomeStack

  return (
    <Navigator screenOptions={{
      headerShown: false,
    }}>
      <Screen name="HomeScreen" component={HomeScreen} />
    </Navigator>
  )
}

export default HomeNavigator
