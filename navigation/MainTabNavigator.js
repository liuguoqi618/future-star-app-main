import React, {useContext, useEffect, useRef} from 'react';
import {
  AppState,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {userLogin} from '../cognito';
import Toast from 'react-native-toast-message';

import {GlobalContext} from '../context/GlobalContext';
import {InterText} from '../components/CustomText';
import {useKeyboard} from '@react-native-community/hooks';
import {removeToken, setToken} from '../utils/axios';
import {
  getFitnessAccepted,
  getLastStepCount,
  getLoginCredentials,
  removeLoginCredentials,
  removeProgressReached,
  removeRefreshToken,
  setLastStepCount,
  setRefreshToken,
} from '../utils/storage';
import {useNavigation} from '@react-navigation/native';
import {getAppVersion} from '../apis/version';
import configs from '../configs';

// import HomeNavigator from './HomeNavigator';
// import CardNavigator from './CardNavigator';
import FriendScreen from '../screens/friend/FriendScreen';
import WalletNavigator from './WalletNavigator';

import HomeNavigator from './HomeV1Navigator';
import TaskNavigator from './TaskNavigator';
import CardNavigator from './CardV1Navigator';
import ReadNavigator from './HomeNavigator';
import ProfileNavigator from './ProfileV1Navigator'

import useStepTracker from '../hooks/useStepTracker';
import LoginModal from '../components/LoginModal';

// const homeIcon = require('../assets/images/MainTab/home.png');
// const homeSelectedIcon = require('../assets/images/MainTab/home-selected.png');
// const cardIcon = require('../assets/images/MainTab/card.png');
// const cardSelectedIcon = require('../assets/images/MainTab/card-selected.png');
// const cardDisabledIcon = require('../assets/images/MainTab/card-disabled.png');
const friendIcon = require('../assets/images/MainTab/friends.png');
const friendSelectedIcon = require('../assets/images/MainTab/friends-selected.png');
const walletIcon = require('../assets/images/MainTab/wallet.png');
const walletSelectedIcon = require('../assets/images/MainTab/wallet-selected.png');

const homeIcon = require('../assets/images/MainTab/home-2.png');
const homeSelectedIcon = require('../assets/images/MainTab/home-2-selected.png');
const taskIcon = require('../assets/images/MainTab/task.png');
const taskSelectedIcon = require('../assets/images/MainTab/task-selected.png');
const cardIcon = require('../assets/images/MainTab/card-2.png');
const cardSelectedIcon = require('../assets/images/MainTab/card-2-selected.png');
const newsIcon = require('../assets/images/MainTab/news.png');
const newsSelectedIcon = require('../assets/images/MainTab/news-selected.png');
const profileIcon = require('../assets/images/MainTab/profile.png');
const profileSelectedIcon = require('../assets/images/MainTab/profile-selected.png');

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const {Navigator, Screen} = Tab;
  const { t } = useTranslation()
  const [{isLoggedIn}, dispatch] = useContext(GlobalContext);
  const keyboard = useKeyboard();
  const navigation = useNavigation();

  const loginRef = useRef()
  loginRef.current = isLoggedIn

  const appState = useRef(AppState.currentState);

  useStepTracker(isLoggedIn)

  useEffect(() => {
    const checkAppVersion = () => {
      getAppVersion()
        .then(result => {
          let version = result.data.data.version;
          if (version !== configs.APP_VERSION) {
            navigation.reset({index: 0, routes: [{name: 'OldVersionScreen'}]});
          }
        })
        .catch(e => console.log(e));
    };

    const refreshLogin = async () => {
      const credentials = await getLoginCredentials()

      if (credentials) {
        // const onFail = () => {
        //   removeToken()
        //   removeRefreshToken()
        //   removeLoginCredentials()
        //   removeProgressReached()
        //   Toast.show({ type: 'error', text1: t('auth.error9') })
        //   dispatch({
        //     type: 'LOG_OUT',
        //   })
        // }

        const { email, phoneNumber, password } = JSON.parse(credentials)
        let userIdentity = email
        if (!email) {
          userIdentity = phoneNumber
        }
        userLogin(userIdentity, password, async data => {
          try {
            setToken(data.idToken.jwtToken)
            setRefreshToken(data.refreshToken.token)
          } catch (e) {
            console.log(e.response.data.message)
            // onFail()
          }
        }, async (e) => {
          console.log(e)
          // onFail()
        })
      } else {
        // removeToken()
        // removeRefreshToken()
        // removeLoginCredentials()
        // removeProgressReached()
      }
    }

    // handle app minimize and focus
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkAppVersion()
        // updateSteps()
        refreshLogin()
      }

      appState.current = nextAppState;
    });

    checkAppVersion();

    const interval2 = setInterval(() => {
      checkAppVersion()
    }, 600000) // refresh every 10 minutes

    return () => {
      subscription.remove();
      clearInterval(interval2)
    };
  }, [navigation, dispatch, t]);

  return (
    <Navigator
      initialRouteName="Home"
      tabBar={props =>
        keyboard.keyboardShown ? null : <CustomTabBar {...props} />
      }
      screenOptions={{
        headerShown: false,
      }}>
      <Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? homeSelectedIcon : homeIcon}
              style={styles.tabBarIcon}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Screen
        name="Task"
        component={TaskNavigator}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? taskSelectedIcon : taskIcon}
              style={styles.tabBarIcon}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Screen
        name="Card"
        component={CardNavigator}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? cardSelectedIcon : cardIcon}
              style={styles.tabBarIcon}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Screen
        name="Read"
        component={ReadNavigator}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? newsSelectedIcon : newsIcon}
              style={styles.tabBarIcon}
              resizeMode="contain"
            />
          ),
        }}
      />
      {/* <Screen
        name="Friend"
        component={FriendScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? friendSelectedIcon : friendIcon}
              style={styles.tabBarIcon}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Screen
        name="Wallet"
        component={WalletNavigator}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? walletSelectedIcon : walletIcon}
              style={styles.tabBarIcon}
              resizeMode="contain"
            />
          ),
        }}
      /> */}
      <Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? profileSelectedIcon : profileIcon}
              style={styles.tabBarIcon}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Navigator>
  );
}

const CustomTabBar = props => {
  const {navigation, descriptors, state} = props;
  const [{isLoggedIn}] = useContext(GlobalContext);
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();

  const loginRef = useRef()

  const guestTabs = ['Home', 'Read'];

  return (
    <View
      style={[
        styles.bottomBar,
        {height: 56 + insets.bottom, paddingBottom: insets.bottom},
      ]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isLoggedIn && !guestTabs.includes(route.name)) {
            // navigation.navigate('Auth');
            loginRef.current.show()
            return;
          }

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        return (
          <Pressable
            key={route.key}
            style={styles.tab}
            activeOpacity={index === 2 ? 0.2 : 1}
            onPress={onPress}>
            {descriptors[route.key].options.tabBarIcon({focused: isFocused})}
            <InterText
              style={[styles.tabName, isFocused && styles.tabNameSelected]}>
              {/* {isLoggedIn || guestTabs.includes(route.name)
                ? t(`bottomBar.${route.name}`)
                : ''} */}
              {t(`bottomBar.${route.name}`)}
            </InterText>
          </Pressable>
        );
      })}

      <LoginModal ref={loginRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
  },
  topBarLogin: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: '#0E73F6',
    borderRadius: 100,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEF0F2',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarIcon: {
    height: 24,
    width: 24,
  },
  tabName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: '#9AA6AC',
  },
  tabNameSelected: {
    color: '#0E73F6',
  },
  tabNameHidden: {
    color: 'rgba(255,255,255,0)',
  },
});
