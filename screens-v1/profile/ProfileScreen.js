import React, { useRef, useState, useContext, useCallback } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GlobalContext} from '../../context/GlobalContext';
import {removeToken} from '../../utils/axios';
import {
  getShowVerificationFailed, removeLastStepCount, removeLoginCredentials, removeProgressReached, removeRefreshToken,
  removeShowVerificationFailed, removeShowVerificationReminder, setShowVerificationFailed,
} from '../../utils/storage';
import medals from '../../utils/medals'
import { getDailySignIn } from '../../apis/tasks';
import configs from '../../configs';
import { LinearGradient } from 'expo-linear-gradient';
import { getInviteSummary, getWalletSummary } from '../../apis/user';
import { formatBalance } from '../../utils/numbers';
import { useFocusEffect } from '@react-navigation/native';
import { getVerifyInfo } from '../../apis/verify';

import {InterText, WorkSansText} from '../../components/CustomText';
import IdFailedModal from '../../components/profile/IdFailedModal';

const splashImage = require('../../assets/images/Profile/splash.png')
const defaultAvatarIcon = require('../../assets/images/Profile/default-avatar.png')
const checkedInIcon = require('../../assets/images/Profile/checkin.png')
const checkInIcon = require('../../assets/images/Profile/checkin-2.png')
const walletIcon = require('../../assets/images/Profile/wallet.png')
const membersIcon = require('../../assets/images/Profile/members.png')
const withdrawIcon = require('../../assets/images/Profile/withdraw.png')
const contactIcon = require('../../assets/images/Profile/contact-2.png')
const languageIcon = require('../../assets/images/Profile/language-2.png')
const verifyIcon = require('../../assets/images/Profile/verify-id.png')
const settingsIcon = require('../../assets/images/Profile/settings.png')

export default function ProfileScreen({navigation}) {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions()
  const [{
    isLoggedIn, avatarUrl, username,
    starLevel, verificationStatus, email, phoneNumber,
  }, dispatch] = useContext(GlobalContext)

  const [verificationLoading, setVerificationLoading] = useState(false)

  const [totalBalance, setTotalBalance] = useState(0)
  const [totalEarning, setTotalEarning] = useState(0)
  const [walletLoading, setWalletLoading] = useState(true)

  const [totalInvited, setTotalInvited] = useState(0)
  const [invitedToday, setInvitedToday] = useState(0)
  const [inviteLoading, setInviteLoading] = useState(true)

  const [checkedInToday, setCheckedInToday] = useState(false)
  const [checkInLoading, setCheckInLoading] = useState(false)

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
    }).catch(e => console.log(e))

    getWalletSummary().then(result => {
      setTotalBalance(result.data.data.totalBalanceUSDT)
      setTotalEarning(result.data.data.totalIncomeUSDT)
      setWalletLoading(false)
    }).catch(e => console.log(e))

    getInviteSummary().then(result => {
      setTotalInvited(result.data.data.totalMember)
      setInvitedToday(result.data.data.todayMember)
      setInviteLoading(false)
    }).catch(e => console.log(e))

    getDailySignIn().then(result => {
      setCheckedInToday(result.data.data.checkedInToday)
    }).catch(e => console.log(e))
  }, [dispatch]))

  const claimDaily = async () => {
    navigation.navigate('Task', { screen: 'TaskScreen', params: { callCheckIn: true }})
    // setCheckInLoading(true)
    // try {
    //   await dailySignIn()
    //   setCheckedInToday(true)
    // } catch (e) {
    //   console.log(e)
    // } finally {
    //   setCheckInLoading(false)
    // }
  }

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
    <ScrollView style={styles.container}>
      <View style={styles.splashWrap}>
        <LinearGradient
          colors={['#3B97FA', '#3A77F9']}
          start={{x: 0.5, y: 1}}
          end={{x: 0.5, y: 0}}
          style={[styles.splash, { width }]}
        >
          <Image source={splashImage} style={{ height: '100%', width: '100%' }} />
        </LinearGradient>
      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: insets.top,
        paddingVertical: 12,
      }}>
        <WorkSansText weight={700} style={{ fontSize: 18, color: '#FFFFFF' }}>
          {t('profile.personalCenter')}
        </WorkSansText>
      </View>

      <View style={{ marginHorizontal: 12 }}>
        <View style={styles.main1}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View>
              <Image
                source={isLoggedIn && avatarUrl ? { uri: avatarUrl } : defaultAvatarIcon}
                style={{ width: 48, height: 48, borderRadius: 24 }}
              />
            </View>
            <View style={{ marginHorizontal: 8, flex: 1 }}>
              <WorkSansText weight={600} style={{ fontSize: 18, color: '#1A2024' }}>
                {username}
              </WorkSansText>
              <WorkSansText numberOfLines={1} style={{ flex: 1, fontSize: 12, color: '#1A2024' }}>
                {email ? email : phoneNumber}
              </WorkSansText>
            </View>
            { checkedInToday ?
              <View style={styles.checkedIn}>
                <Image source={checkedInIcon} style={{ height: 12, width: 12 }} />
                <WorkSansText weight={500} style={{ fontSize: 14, color: '#FFFFFF', marginLeft: 3 }}>
                  {t('profile.checkedIn')}
                </WorkSansText>
              </View> :
              <TouchableOpacity style={styles.checkIn} onPress={claimDaily}>
                { !checkInLoading ?
                  <>
                    <Image source={checkInIcon} style={{ height: 12, width: 12 }} />
                    <WorkSansText weight={500} style={{ fontSize: 14, color: '#4094F7', marginLeft: 3 }}>
                      {t('profile.checkIn')}
                    </WorkSansText>
                  </> :
                  <ActivityIndicator color="#4094F7" />
                }
              </TouchableOpacity>
            }
          </View>
        </View>
        <View style={styles.main2}>
          <View style={{ width: 21 }}>
            { starLevel >= 0 ?
              <Image
                source={medals[starLevel]}
                style={{ height: 23, width: 18 }}
              /> : null
            }
          </View>
          <WorkSansText weight={500} style={{ flex: 1, fontSize: 14, color: '#FFFFFF', marginRight: 3 }}>
            {t('profile.currentRating')}{starLevel < 7 ? t(memberNames[starLevel]) : ''}
          </WorkSansText>
          <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('Card')}>
            <WorkSansText weight={500} style={{ fontSize: 14, color: '#FFFFFF' }}>
              {t('profile.viewStarCard')}
            </WorkSansText>
            <Entypo name="chevron-thin-right" size={14} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.section1}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={walletIcon} style={{ height: 24, width: 24 }} />
            <InterText weight={600} style={{ flex: 1, marginLeft: 3, fontSize: 16, color: '#1A2024' }}>
              {t('profile.wallet')}
            </InterText>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('WalletScreen')}>
              <WorkSansText weight={500} style={{ fontSize: 14, color: '#5B6871' }}>
                {t('profile.details')}
              </WorkSansText>
              <Entypo name="chevron-thin-right" size={16} color="#5B6871" />
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            { !walletLoading ?
              <>
                <View style={{ flex: 1 }}>
                  <InterText weight={500} style={{ fontSize: 12, color: '#6E7C87' }}>
                    {t('profile.totalEarning')}
                  </InterText>
                  <InterText weight={500} style={{ fontSize: 16, color: '#1A2024' }}>
                    ≈{formatBalance(totalEarning, 100)}
                    <InterText weight={400} style={{ fontSize: 12, color: '#1A2024' }}>
                      {' '}USDT
                    </InterText>
                  </InterText>
                </View>
                <View style={{ flex: 1 }}>
                  <InterText weight={500} style={{ fontSize: 12, color: '#6E7C87' }}>
                    {t('profile.totalBalance')}
                  </InterText>
                  <InterText weight={500} style={{ fontSize: 16, color: '#1A2024' }}>
                    ≈{formatBalance(totalBalance, 100)}
                    <InterText weight={400} style={{ fontSize: 12, color: '#1A2024' }}>
                      {' '}USDT
                    </InterText>
                  </InterText>
                </View>
              </> :
              <View style={{ flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color="#0E73F6" />
              </View>
            }
          </View>
        </View>

        <View style={styles.section1}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={membersIcon} style={{ height: 24, width: 24 }} />
            <InterText weight={600} style={{ flex: 1, marginLeft: 3, fontSize: 16, color: '#1A2024' }}>
              {t('profile.members')}
            </InterText>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('FriendScreen')}>
              <WorkSansText weight={500} style={{ fontSize: 14, color: '#5B6871' }}>
                {t('profile.details')}
              </WorkSansText>
              <Entypo name="chevron-thin-right" size={16} color="#5B6871" />
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            { !inviteLoading ?
              <>
                <View style={{ flex: 1 }}>
                  <InterText weight={500} style={{ fontSize: 12, color: '#6E7C87' }}>
                    {t('profile.totalPeople')}
                  </InterText>
                  <InterText weight={500} style={{ fontSize: 16, color: '#1A2024' }}>
                    {totalInvited}
                  </InterText>
                </View>
                <View style={{ flex: 1 }}>
                  <InterText weight={500} style={{ fontSize: 12, color: '#6E7C87' }}>
                    {t('profile.addedToday')}
                  </InterText>
                  <InterText weight={500} style={{ fontSize: 16, color: '#1A2024' }}>
                    {invitedToday}
                  </InterText>
                </View>
              </> :
              <View style={{ flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color="#0E73F6" />
              </View>
            }
          </View>
        </View>

        <View style={styles.section2}>
          <TouchableOpacity onPress={() => navigation.navigate('WalletScreen')}>
            <View style={styles.menuItem}>
              <Image source={withdrawIcon} style={{ width: 18, height: 18 }} />
              <InterText weight={500} style={{ flex: 1, marginHorizontal: 3, fontSize: 16, color: '#1A2024' }}>
                {t('profile.withdraw')}
              </InterText>
              <Entypo name="chevron-thin-right" size={16} color="#5B6871" />
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => navigation.navigate('ContactScreen')}>
            <View style={styles.menuItem}>
              <Image source={contactIcon} style={{ width: 18, height: 18 }} />
              <InterText weight={500} style={{ flex: 1, marginHorizontal: 3, fontSize: 16, color: '#1A2024' }}>
                {t('profile.contactUs')}
              </InterText>
              <Entypo name="chevron-thin-right" size={16} color="#5B6871" />
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => navigation.navigate('LanguageScreen')}>
            <View style={styles.menuItem}>
              <Image source={languageIcon} style={{ width: 18, height: 18 }} />
              <InterText weight={500} style={{ flex: 1, marginHorizontal: 3, fontSize: 16, color: '#1A2024' }}>
                {t('profile.changeLanguage')}
              </InterText>
              <Entypo name="chevron-thin-right" size={16} color="#5B6871" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section2}>
          <TouchableOpacity
            onPress={() => navigation.navigate('VerificationScreen')}
            disabled={verificationStatus.status === 1 || verificationLoading}
          >
            <View style={styles.menuItem}>
              <Image source={verifyIcon} style={{ width: 18, height: 18 }} />
              <InterText weight={500} style={{ flex: 1, marginHorizontal: 3, fontSize: 16, color: '#1A2024' }}>
                {t('profile.idVerif')}
              </InterText>
              {verificationLoading ?
                <ActivityIndicator color="#0E73F6" /> :
                <>
                  { verificationStatus.status === -1 ?
                    <Entypo name="chevron-thin-right" size={16} color="#5B6871" /> : null
                  }
                  { verificationStatus.status === 0 ?
                    <InterText weight={600} style={{ color: '#FF8F0B', fontSize: 16 }}>
                      {t('profile.inProgress')}
                    </InterText> : null
                  }
                  { verificationStatus.status === 1 ?
                    <InterText weight={600} style={{ color: '#22C348', fontSize: 16 }}>
                      {t('profile.idVerified')}
                    </InterText> : null
                  }
                  { verificationStatus.status === 2 ?
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
          <TouchableOpacity onPress={() => navigation.navigate('AccountScreen')}>
            <View style={styles.menuItem}>
              <Image source={settingsIcon} style={{ width: 18, height: 18 }} />
              <InterText weight={500} style={{ flex: 1, marginHorizontal: 3, fontSize: 16, color: '#1A2024' }}>
                {t('profile.settings')}
              </InterText>
              <Entypo name="chevron-thin-right" size={16} color="#5B6871" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logOut} onPress={onLogOutPressed}>
        <InterText weight={600} style={{fontSize: 16, color: '#FFFFFF'}}>
          {t('profile.logOut')}
        </InterText>
      </TouchableOpacity>

      <InterText style={{ marginTop: 12, marginRight: 20, textAlign: 'right', fontSize: 16, color: '#84919A' }}>
        v1.0.{configs.APP_VERSION}
      </InterText>

      <View style={{ height: 16 }} />

      <IdFailedModal
        ref={idModalRef}
        reasons={verificationStatus.reasons}
        onConfirm={() => {
          idModalRef.current.hide()
          navigation.navigate('VerificationScreen')
        }}
        onHide={() => {
          setShowVerificationFailed('CLOSED')
        }}
      />
    </ScrollView>
  );
}

const memberNames = {
  '-1': 'card.member-new',
  '0': 'card.member-0',
  '1': 'card.member-1',
  '2': 'card.member-2',
  '3': 'card.member-3',
  '4': 'card.member-4',
  '5': 'card.member-5',
  '6': 'card.member-6',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF0F2',
  },
  splashWrap: {
    height: 1400,
    width: 1400,
    position: 'absolute',
    top: -1200,
    borderRadius: 700,
    alignSelf: 'center',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  splash: {
    // backgroundColor: '#3B97FA',
    height: 200,
  },
  section1: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  main1: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: 16,
  },
  main2: {
    backgroundColor: '#0E73F6',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  user: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#EEF0F2',
    borderRadius: 100,
  },
  checkedIn: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 8,
    backgroundColor: '#4094F7',
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIn: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#4094F7',
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  section2: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 16,
  },
  logOut: {
    flexDirection: 'row',
    backgroundColor: '#F2271C',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
});
