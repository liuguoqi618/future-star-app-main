import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import CardScreen from '../screens/card/CardScreen'
import CardHistoryScreen from '../screens/card/CardHistoryScreen'


const CardStack = createStackNavigator()

const CardNavigator = () => {
  const { Navigator, Screen } = CardStack

  return (
    <Navigator screenOptions={{
      headerShown: false,
    }}>
      <Screen name="CardScreen" component={CardScreen} />
      <Screen name="CardHistoryScreen" component={CardHistoryScreen} />
    </Navigator>
  )
}

export default CardNavigator
