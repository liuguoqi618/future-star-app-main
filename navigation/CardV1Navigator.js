import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import CardScreen from '../screens-v1/card/CardScreen'
// import CardHistoryScreen from '../screens/card/CardHistoryScreen'
import MyCardsScreen from '../screens-v1/card/MyCardsScreen'
import RulesScreen from '../screens-v1/card/RulesScreen'

const CardStack = createStackNavigator()

const CardNavigator = () => {
  const { Navigator, Screen } = CardStack

  return (
    <Navigator screenOptions={{
      headerShown: false,
    }}>
      <Screen name="CardScreen" component={CardScreen} />
      <Screen name="MyCardsScreen" component={MyCardsScreen} />
      <Screen name="RulesScreen" component={RulesScreen} />
      {/* <Screen name="CardHistoryScreen" component={CardHistoryScreen} /> */}
    </Navigator>
  )
}

export default CardNavigator
