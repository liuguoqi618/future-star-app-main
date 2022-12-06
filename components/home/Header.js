import React, {useCallback, useContext, useRef, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { formatBalance } from '../../utils/numbers'
import Toast from 'react-native-toast-message'
import { getProgressReached, setProgressReached } from '../../utils/storage'

import {GlobalContext} from '../../context/GlobalContext';
import {InterText} from '../CustomText';
import {getTaskProgress} from '../../apis/user';
import ModalBase from '../ModalBase';
import { getMyCards } from '../../apis/card';
import Popover from '../Popover';

const defaultAvatarIcon = require('../../assets/images/TopBar/default-avatar.png');
const activityIcon = require('../../assets/images/TopBar/activity.png');
const avatarOptionsIcon = require('../../assets/images/TopBar/avatar-options.png');

export default function Header() {
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();
  const navigation = useNavigation();

  const [{isLoggedIn, avatarUrl, activity}, dispatch] = useContext(GlobalContext);
  const [possiblePoints, setPossiblePoints] = useState(0)

  const activityRef = useRef()
  const completeRef = useRef()

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        getTaskProgress()
        .then(async result => {
          setPossiblePoints(result.data.data.potentialEarn)

          const newActivity = result.data.data.total

          const milestone = await getProgressReached()

          if (!milestone) {
          } else if (newActivity >= 100 && Number(milestone) < 100) {
            completeRef.current.showLoaded()
          } else if (newActivity >= 75 && Number(milestone) < 75) {
            Toast.show({ type: 'info', text1: t('activity.complete75')})
          } else if (newActivity >= 50 && Number(milestone) < 50) {
            Toast.show({ type: 'info', text1: t('activity.complete50')})
          } else if (newActivity >= 25 && Number(milestone) < 25) {
            Toast.show({ type: 'info', text1: t('activity.complete25')})
          }

          setProgressReached(newActivity.toString())

          dispatch({
            type: 'SET_ACTIVITY_PROGRESS',
            data: {
              activity: newActivity,
            },
          });
        })
        .catch(e => console.log(e));
      }
    }, [isLoggedIn, dispatch, t]),
  );

  const onActivityPress = () => {
    getMyCards().then((result) => {
      const myCards = result.data.data
      if (myCards.length === 0) {
        activityRef.current.open()
      } else {
        navigation.navigate('ActivityScreen')
      }
    })
  }

  return (
    <View
      style={[
        styles.topBar,
        {height: 60 + insets.top, paddingTop: insets.top},
      ]}>
      <Pressable
        onPress={() => navigation.navigate('Profile')}
        disabled={!isLoggedIn}>
        <Image
          source={
            isLoggedIn && avatarUrl ? {uri: avatarUrl} : defaultAvatarIcon
          }
          style={{height: 36, width: 36, borderRadius: 18}}
        />
        {isLoggedIn ? (
          <Image
            source={avatarOptionsIcon}
            style={{
              height: 12,
              width: 12,
              position: 'absolute',
              right: 0,
              bottom: 0,
            }}
            resizeMode="contain"
          />
        ) : null}
      </Pressable>
      <View style={{flex: 1}} />
      {!isLoggedIn ? (
        <TouchableOpacity
          style={styles.topBarLogin}
          onPress={() => navigation.navigate('Auth')}>
          <InterText weight={600} style={{fontSize: 14, color: '#FFFFFF'}}>
            {t('home.login')}
          </InterText>
        </TouchableOpacity>
      ) : (
        <Popover
          ref={activityRef}
          triggerProps={{ disabled: true }}
          backgroundColor="#303940"
          TriggerComponent={() =>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={onActivityPress}>
              <Image
                source={activityIcon}
                style={{height: 24, width: 24}}
                resizeMode="contain"
              />
              <InterText
                weight={700}
                style={{fontSize: 16, color: '#48535B', marginLeft: 5}}>
                {Math.min(Math.max(activity, 0), 100)}%
              </InterText>
            </TouchableOpacity>
          }
        >
          <InterText weight={500} style={{ fontSize: 12, color: '#FFFFFF' }}>
            {t('activity.noCard')}
          </InterText>

          <InterText
            onPress={() => {
              activityRef.current.close()
              navigation.navigate('CardScreen')
            }}
            weight={500}
            style={{
              marginTop: 16,
              fontSize: 12,
              color: '#FFFFFF',
              textDecorationLine: 'underline',
              }}
          >
            {t('activity.getCard')}
          </InterText>
        </Popover>
      )}
      <ModalBase
        ref={completeRef}
        title={t('activity.completeTitle')}
        description={t('activity.completeDesc')}
        description2={`${formatBalance(possiblePoints)} FSC`}
        description3={t('activity.completeFooter')}
        alternateDesign
        onConfirm={() => completeRef.current.hide()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
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
});
