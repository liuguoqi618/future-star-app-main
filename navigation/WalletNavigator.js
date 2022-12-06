import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import WalletScreen from '../screens/wallet/WalletScreen'
import FSCScreen from '../screens/wallet/FSCScreen'
import USDTScreen from '../screens/wallet/USDTScreen'
import BNBScreen from '../screens/wallet/BNBScreen'

const WalletStack = createStackNavigator()

const WalletNavigator = () => {
  const { Navigator, Screen } = WalletStack

  return (
    <Navigator screenOptions={{
      headerShown: false,
    }}>
      <Screen name="WalletScreen" component={WalletScreen} />
      <Screen name="FSCScreen" component={FSCScreen} />
      <Screen name="USDTScreen" component={USDTScreen} />
      <Screen name="BNBScreen" component={BNBScreen} />
    </Navigator>
  )
}

export default WalletNavigator
