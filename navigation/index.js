import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import SetLanguageScreen from '../screens/SetLanguageScreen';
import MainTabNavigator from './MainTabNavigator';
import WithdrawScreen from '../screens/wallet/WithdrawScreen';
import ConvertScreen from '../screens/wallet/ConvertScreen';
// import ProfileNavigator from './ProfileNavigator';
import AuthNavigator from './AuthNavigator';
import ActivitySreen from '../screens/activity/ActivityScreen';
import VideoScreen from '../screens/home/VideoScreen';
import VideoAdScreen from '../screens/home/VideoAdScreen';
import OldVersionScreen from '../screens/OldVersionScreen';
import FitnessScreen from '../screens/fitness/FitnessScreen';
import FitnessHistoryScreen from '../screens/fitness/FitnessHistoryScreen';
import TopUpScreen from '../screens/wallet/TopUpScreen'
import WalletScreen from '../screens/wallet/WalletScreen'
import FSCScreen from '../screens/wallet/FSCScreen'
import USDTScreen from '../screens/wallet/USDTScreen'
import BNBScreen from '../screens/wallet/BNBScreen'

import ReadScreen from '../screens/home/ReadScreen'
import SearchScreen from '../screens/home/SearchScreen'

import FriendScreen from '../screens/friend/FriendScreen';
import InviteScreen from '../screens/friend/InviteScreen';

import EditScreen from '../screens/profile/EditScreen'
import AccountScreen from '../screens/profile/AccountScreen'
import LanguageScreen from '../screens/profile/LanguageScreen'
import ResetPasswordScreen from '../screens/profile/ResetPasswordScreen'
import ContactScreen from '../screens/profile/ContactScreen'
import VerificationScreen from '../screens/profile/VerificationScreen'
import SelectCountry2Screen from '../screens/profile/SelectyCountry2Screen'

const MainStack = createStackNavigator();

const RootNavigator = () => {
  const {Navigator, Screen} = MainStack;

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name="SplashScreen" component={SplashScreen} />
      <Screen name="SetLanguageScreen" component={SetLanguageScreen} />
      <Screen name="Main" component={MainTabNavigator} />
      <Screen name="Auth" component={AuthNavigator} />
      {/* <Screen name="Profile" component={ProfileNavigator} /> */}
      <Screen name="ConvertScreen" component={ConvertScreen} />
      <Screen name="ActivityScreen" component={ActivitySreen} />
      <Screen name="VideoScreen" component={VideoScreen} />
      <Screen name="VideoAdScreen" component={VideoAdScreen} initialParams={{ videoId: null }} />
      <Screen name="OldVersionScreen" component={OldVersionScreen} />
      <Screen name="FitnessScreen" component={FitnessScreen} />
      <Screen name="FitnessHistoryScreen" component={FitnessHistoryScreen} />

      <Screen name="ReadScreen" component={ReadScreen} />
      <Screen name="SearchScreen" component={SearchScreen} />

      <Screen name="FriendScreen" component={FriendScreen} />
      <Screen name="InviteScreen" component={InviteScreen} />

      <Screen name="WalletScreen" component={WalletScreen} />
      <Screen name="FSCScreen" component={FSCScreen} />
      <Screen name="USDTScreen" component={USDTScreen} />
      <Screen name="BNBScreen" component={BNBScreen} />
      <Screen name="TopUpScreen" component={TopUpScreen} />
      <Screen name="WithdrawScreen" component={WithdrawScreen} />

      <Screen name="EditScreen" component={EditScreen} />
      <Screen name="AccountScreen" component={AccountScreen} />
      <Screen name="LanguageScreen" component={LanguageScreen} />
      <Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      <Screen name="ContactScreen" component={ContactScreen} />
      <Screen name="VerificationScreen" component={VerificationScreen} />
      <Screen name="SelectCountry2Screen" component={SelectCountry2Screen} />
    </Navigator>
  );
};

export default RootNavigator;
