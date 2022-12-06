import React, { useRef, useState, useContext, useCallback } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GlobalContext} from '../../context/GlobalContext';
import {removeToken} from '../../utils/axios';
import { getShowVerificationFailed, removeLastStepCount, removeLoginCredentials, removeProgressReached, removeRefreshToken, removeShowVerificationFailed, removeShowVerificationReminder, setShowVerificationFailed } from '../../utils/storage';

import {InterText, WorkSansText} from '../../components/CustomText';
import { getVerifyInfo } from '../../apis/verify';
import { useFocusEffect } from '@react-navigation/native';
import IdFailedModal from '../../components/profile/IdFailedModal';

const defaultAvatarIcon = require('../../assets/images/Profile/default-avatar.png');
const accountIcon = require('../../assets/images/Profile/account.png');
const languageIcon = require('../../assets/images/Profile/language.png');
const contactIcon = require('../../assets/images/Profile/contact.png')
const verificationIcon = require('../../assets/images/Profile/verification.png')
const verificationIncompleteIcon = require('../../assets/images/Profile/verification-incomplete.png')
const verificationVerifiedIcon = require('../../assets/images/Profile/verification-verified.png')

export default function ProfileScreen({navigation}) {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const [state, dispatch] = useContext(GlobalContext);

  const [verificationLoading, setVerificationLoading] = useState(false)

  const idModalRef = useRef()

  useFocusEffect(useCallback(() => {
    setVerificationLoading(true)
    getVerifyInfo().then(result => {
      dispatch({
        type: 'SET_VERIFICATION_STATUS',
        data: {
          verificationStatus: result.data.data,
        },
      })
      setVerificationLoading(false)

      if (result.data.data.status === 2) {
        getShowVerificationFailed().then(storage => {
          if (!storage) {
            idModalRef.current.show()
          }
        })
      }
    })
  }, [dispatch]))

  const onLogOutPressed = async () => {
    await removeToken()
    await removeRefreshToken()
    await removeLoginCredentials()
    await removeProgressReached()
    await removeLastStepCount()
    await removeShowVerificationReminder()
    await removeShowVerificationFailed()

    dispatch({
      type: 'LOG_OUT',
    });
    navigation.replace('SplashScreen');
  }

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      {/* <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => navigation.goBack()}>
          <Entypo name="chevron-thin-left" size={24} color="black" />
        </Pressable>
      </View> */}

      <View style={{alignItems: 'center', marginVertical: 40}}>
        <View>
          <Image
            source={state.avatarUrl ? {uri: state.avatarUrl} : defaultAvatarIcon}
            style={{height: 80, width: 80, borderRadius: 40}}
          />
          <Image
            source={state.verificationStatus.status === 1 ?
              verificationVerifiedIcon :
              verificationIncompleteIcon
            }
            style={{ position: 'absolute', top: 0, right: 0, height: 23, width: 23 }}
          />
        </View>
        <WorkSansText weight={600} style={{fontSize: 26, color: '#303940'}}>
          {state.username}
        </WorkSansText>
        <TouchableOpacity onPress={() => navigation.navigate('EditScreen')}>
          <InterText weight={500} style={{fontSize: 14, color: '#3C464E'}}>
            {t('profile.editProfile')}
          </InterText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('AccountScreen')}>
        <View style={styles.menuItem}>
          <Image source={accountIcon} style={{height: 28, width: 28}} />
          <InterText
            weight={600}
            style={{
              marginHorizontal: 16,
              flex: 1,
              fontSize: 16,
              color: '#3C464E',
            }}>
            {t('profile.account')}
          </InterText>
          <Entypo name="chevron-thin-right" size={24} color="#5B6871" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('LanguageScreen')}>
        <View style={styles.menuItem}>
          <Image source={languageIcon} style={{height: 28, width: 28}} />
          <InterText
            weight={600}
            style={{
              marginHorizontal: 16,
              flex: 1,
              fontSize: 16,
              color: '#3C464E',
            }}>
            {t('profile.language')}
          </InterText>
          <Entypo name="chevron-thin-right" size={24} color="#5B6871" />
        </View>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => navigation.navigate('ContactScreen')}>
        <View style={styles.menuItem}>
          <Image source={contactIcon} style={{height: 28, width: 28}} />
          <InterText
            weight={600}
            style={{
              marginHorizontal: 16,
              flex: 1,
              fontSize: 16,
              color: '#3C464E',
            }}>
            {t('profile.contactUs')}
          </InterText>
          <Entypo name="chevron-thin-right" size={24} color="#5B6871" />
        </View>
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={() => navigation.navigate('VerificationScreen')}
        disabled={state.verificationStatus.status === 1 || verificationLoading}
      >
        <View style={styles.menuItem}>
          <Image source={verificationIcon} style={{height: 28, width: 28}} />
          <InterText
            weight={600}
            style={{
              marginHorizontal: 16,
              flex: 1,
              fontSize: 16,
              color: '#3C464E',
            }}>
            {t('profile.idVerif')}
          </InterText>
          {verificationLoading ?
            <ActivityIndicator color="#0E73F6" /> :
            <>
              { state.verificationStatus.status === -1 ?
                <Entypo name="chevron-thin-right" size={24} color="#5B6871" /> : null
              }
              { state.verificationStatus.status === 0 ?
                <InterText weight={600} style={{ color: '#FF8F0B', fontSize: 16 }}>
                  {t('profile.inProgress')}
                </InterText> : null
              }
              { state.verificationStatus.status === 1 ?
                <InterText weight={600} style={{ color: '#22C348', fontSize: 16 }}>
                  {t('profile.idVerified')}
                </InterText> : null
              }
              { state.verificationStatus.status === 2 ?
                <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => idModalRef.current.show()}>
                  <InterText weight={600} style={{ color: '#F2271C', fontSize: 16, marginRight: 3 }}>
                    {t('profile.failed')}
                  </InterText>
                  <Feather name="info" size={16} color="#F2271C" />
                </Pressable> : null
              }
            </>
          }
        </View>
      </TouchableOpacity>

      <View style={{flex: 1}} />

      <TouchableOpacity style={styles.logOut} onPress={onLogOutPressed}>
        <InterText weight={600} style={{fontSize: 16, color: '#FFFFFF'}}>
          {t('profile.logOut')}
        </InterText>
      </TouchableOpacity>

      <IdFailedModal
        ref={idModalRef}
        reasons={state.verificationStatus.reasons}
        onConfirm={() => {
          idModalRef.current.hide()
          navigation.navigate('VerificationScreen')
        }}
        onHide={() => {
          setShowVerificationFailed('CLOSED')
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 68,
    borderBottomColor: '#EEF0F2',
    borderBottomWidth: 1,
  },
  logOut: {
    flexDirection: 'row',
    backgroundColor: '#F2271C',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
});
