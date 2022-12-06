import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { GlobalContext } from '../../context/GlobalContext'
import { getStepData } from '../../apis/fitness'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { getTaskProgress } from '../../apis/user'
import { getProgressReached, setProgressReached } from '../../utils/storage'

import { InterText } from '../../components/CustomText'
import Header from '../../components/home/HeaderV1'
import InviteBanner from '../../components/home/InviteBanner'
import ModalBase from '../../components/ModalBase'
import { formatBalance } from '../../utils/numbers'
import LoginModal from '../../components/LoginModal'
import ComingSoonModal from '../../components/ComingSoonModal'

const checkInImage = require('../../assets/images/Home/check-in.png')
const headlinesImage = require('../../assets/images/Home/headlines.png')
const wheelImage = require('../../assets/images/Home/wheel.png')
const lotteryImage = require('../../assets/images/Home/lottery.png')
const petImage = require('../../assets/images/Home/pet.png')
const person1Image = require('../../assets/images/Home/person-1.png')
const person2Image = require('../../assets/images/Home/person-2.png')
const person3Image = require('../../assets/images/Home/person-3.png')
const dog1Image = require('../../assets/images/Home/dog-1.png')
const splash1Image = require('../../assets/images/Task/splash-1.png')

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  const [{isLoggedIn, starLevel, activity, steps, targetSteps}, dispatch] = useContext(GlobalContext)

  const [possiblePoints, setPossiblePoints] = useState(0)

  const [potentialEarn, setPotentialEarn] = useState(0)

  const completeRef = useRef()
  const loginRef = useRef()
  const comingSoonRef = useRef()

  useFocusEffect(useCallback(() => {
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
      .catch(e => console.log(e))

      getStepData()
      .then(result => {
        setPotentialEarn(result.data.data.current.targetIncome);
        dispatch({
          type: 'SET_STEPS',
          data: {
            steps: result.data.data.current.steps,
            targetSteps: result.data.data.current.targetSteps,
            potentialEarn: result.data.data.current.targetIncome,
          },
        })
      })
      .catch(e => console.log(e))
    }
  }, [isLoggedIn, dispatch, t]))

  return (
    <View style={styles.container}>
      <Header navigation={navigation} isLoggedIn={isLoggedIn} loginRef={loginRef} />
      <ScrollView>
        <View style={{ marginHorizontal: 12 }}>
          { isLoggedIn && starLevel >= 0 ?
            <>
              <TouchableOpacity onPress={() => navigation.navigate('ActivityScreen')}>
                <LinearGradient
                  colors={['#55B8FE', '#1371FF']}
                  start={{x: 0, y: 0.5}}
                  end={{x: 1, y: 0.5}}
                  style={styles.banner}
                >
                  <View style={{ flex: 1 }}>
                    <InterText weight={600} style={{ fontSize: 16, color: '#FFFFFF' }}>
                      {t('homeV1.activityTitle')}
                    </InterText>
                    <InterText weight={400} style={{ fontSize: 12, color: '#FFFFFF' }}>
                      {t('homeV1.activityDesc', { FSC: possiblePoints, USDT: Math.trunc(100 * (possiblePoints / 100)) / 100 })}
                    </InterText>
                  </View>
                  <View style={{ marginLeft: 8, justifyContent: 'center', alignItems: 'center' }}>
                    <AnimatedCircularProgress
                      size={60}
                      width={8}
                      lineCap="round"
                      fill={Math.min(activity, 100)}
                      tintColor="#FFFFFF"
                      backgroundColor="#006DFC"
                      rotation={0}
                    />
                    <InterText weight={900} style={{ position: 'absolute', fontSize: 12, color: '#FFFFFF' }}>
                      {activity}
                    </InterText>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('FitnessScreen')}>
                <LinearGradient
                  colors={['#0ADE6E', '#03D4AA']}
                  start={{x: 0, y: 0.5}}
                  end={{x: 1, y: 0.5}}
                  style={styles.banner}
                >
                  <View style={{ flex: 1 }}>
                    <InterText weight={600} style={{ fontSize: 16, color: '#FFFFFF' }}>
                      {t('homeV1.moveToEarn')}
                    </InterText>
                    <InterText weight={400} style={{ fontSize: 12, color: '#FFFFFF' }}>
                      {t('homeV1.moveToEarnDesc', { FSC: potentialEarn, USDT: Math.trunc(100 * (potentialEarn / 100)) / 100 })}
                    </InterText>
                  </View>
                  <View style={{ marginLeft: 8, justifyContent: 'center', alignItems: 'center' }}>
                    <AnimatedCircularProgress
                      size={60}
                      width={8}
                      lineCap="round"
                      fill={Math.min((steps / targetSteps) * 100, 100)}
                      tintColor="#FFFFFF"
                      backgroundColor="#00C191"
                      rotation={0}
                    />
                    <InterText weight={900} style={{ position: 'absolute', fontSize: 12, color: '#FFFFFF' }}>
                      {steps}
                    </InterText>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </> : null
          }

          { isLoggedIn && starLevel < 0 ?
            <View style={[styles.banner1, { justifyContent: 'center', alignItems: 'center', height: (width - 24) / 1340 * 476 }]}>
              <Image
                source={splash1Image}
                style={{ position: 'absolute', width: width - 24, height: (width - 24) / 1340 * 476 }}
                resizeMode="stretch"
              />
              <InterText weight={600} style={{ textAlign: 'center', fontSize: 20, color: '#FFFFFF' }}>
                {t('tasks.getStarCard')}
              </InterText>
              <InterText weight={500} style={{ marginTop: 4, textAlign: 'center', fontSize: 12, color: '#FFFFFF' }}>
                {t('tasks.getStarCardDesc')}
              </InterText>
              <TouchableOpacity style={styles.getStarCard} onPress={() => navigation.navigate('Card')}>
                <InterText weight={600} style={{ fontSize: 14, color: '#0E73F6' }}>
                  {t('tasks.getItNow')}
                </InterText>
              </TouchableOpacity>
            </View> : null
          }

          { !isLoggedIn ?
            <View style={[styles.banner1, { justifyContent: 'center', alignItems: 'center', height: (width - 24) / 1340 * 476 }]}>
              <Image
                source={splash1Image}
                style={{ position: 'absolute', width: width - 24, height: (width - 24) / 1340 * 476 }}
                resizeMode="stretch"
              />
              <InterText weight={600} style={{ textAlign: 'center', fontSize: 20, color: '#FFFFFF' }}>
                {t('homeV1.welcome')}
              </InterText>
              <InterText weight={500} style={{ marginTop: 4, textAlign: 'center', fontSize: 12, color: '#FFFFFF' }}>
                {t('homeV1.welcomeDesc')}
              </InterText>
              <TouchableOpacity style={styles.getStarCard} onPress={() => navigation.navigate('Auth')}>
                <InterText weight={600} style={{ fontSize: 14, color: '#0E73F6' }}>
                  {t('homeV1.loginNow')}
                </InterText>
              </TouchableOpacity>
            </View> : null
          }

          <View style={styles.drawer}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => {
                if (!isLoggedIn) {
                  loginRef.current.show()
                } else {
                  navigation.navigate('Task', { screen: 'TaskScreen', params: { callCheckIn: true }})
                }
              }}>
                <Image source={checkInImage} style={{ height: 48, width: 48 }} />
              </TouchableOpacity>
              <InterText weight={600} style={styles.drawerText}>
                {t('homeV1.checkIn')}
              </InterText>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => {
                navigation.navigate('Read')
              }}>
                <Image source={headlinesImage} style={{ height: 48, width: 48 }} />
              </TouchableOpacity>
              <InterText weight={600} style={styles.drawerText}>
                {t('homeV1.headlines')}
              </InterText>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => {
                comingSoonRef.current.show()
              }}>
                <Image source={wheelImage} style={{ height: 48, width: 48 }} />
              </TouchableOpacity>
              <InterText weight={600} style={styles.drawerText}>
                {t('homeV1.wheel')}
              </InterText>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => {
                comingSoonRef.current.show()
              }}>
                <Image source={lotteryImage} style={{ height: 48, width: 48 }} />
              </TouchableOpacity>
              <InterText weight={600} style={styles.drawerText}>
                {t('homeV1.lottery')}
              </InterText>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => {
                comingSoonRef.current.show()
              }}>
                <Image source={petImage} style={{ height: 48, width: 48 }} />
              </TouchableOpacity>
              <InterText weight={600} style={styles.drawerText}>
                {t('homeV1.pet')}
              </InterText>
            </View>
          </View>

          <InterText weight={600} style={{ marginTop: 16, fontSize: 16, color: '#1A2024' }}>
            {t('homeV1.recommended')}
          </InterText>

          <InviteBanner navigation={navigation} isLoggedIn={isLoggedIn} loginRef={loginRef} />

          <View style={{ marginTop: 12, flexDirection: 'row' }}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('Read')}>
              <LinearGradient
                colors={['#CCE1FF', '#B0C5FF']}
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
                style={styles.actions}
              >
                <Image
                  source={person1Image}
                  style={{
                    position: 'absolute',
                    right: 0,
                    bottom: -5,
                    height: 93,
                    width: 63,
                    opacity: 0.5,
                  }}
                  resizeMode="contain"
                />
                <InterText weight={600} style={{ fontSize: 14, color: '#1A2024' }}>
                  {t('homeV1.watchNews')}
                </InterText>
                <InterText weight={400} style={{ fontSize: 12, color: '#1A2024' }}>
                  {t('homeV1.watchNewsDesc')}
                </InterText>
              </LinearGradient>
            </TouchableOpacity>
            <View style={{ width: 12 }} />
            <TouchableOpacity style={{ flex: 1 }} onPress={() => {
              if (!isLoggedIn) {
                loginRef.current.show()
              } else {
                navigation.navigate('FitnessScreen')
              }
            }}>
              <LinearGradient
                colors={['#FFC03E', '#FFD689']}
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
                style={styles.actions}
              >
                <Image
                  source={person2Image}
                  style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    height: 93,
                    width: 93,
                    opacity: 0.5,
                  }}
                  resizeMode="contain"
                />
                <InterText weight={600} style={{ fontSize: 14, color: '#1A2024' }}>
                  {t('homeV1.walking')}
                </InterText>
                <InterText weight={400} style={{ fontSize: 12, color: '#1A2024' }}>
                  {t('homeV1.walkingDesc')}
                </InterText>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 12, marginBottom: 16, flexDirection: 'row' }}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => {
              navigation.navigate('VideoAdScreen')
            }}>
              <LinearGradient
                colors={['#FFDAD8', '#FFAEA9']}
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
                style={styles.actions}
              >
                <Image
                  source={person3Image}
                  style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    height: 93,
                    width: 93,
                    opacity: 0.5,
                  }}
                  resizeMode="contain"
                />
                <InterText weight={600} style={{ fontSize: 14, color: '#1A2024' }}>
                  {t('homeV1.watchAds')}
                </InterText>
                <InterText weight={400} style={{ fontSize: 12, color: '#1A2024' }}>
                  {t('homeV1.watchAdsDesc')}
                </InterText>
              </LinearGradient>
            </TouchableOpacity>
            <View style={{ width: 12 }} />
            <TouchableOpacity style={{ flex: 1 }} onPress={() => {
              comingSoonRef.current.show()
            }}>
              <LinearGradient
                colors={['#E7CEFF', '#C891FF']}
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
                style={styles.actions}
              >
                <Image
                  source={dog1Image}
                  style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    height: 93,
                    width: 95,
                    opacity: 0.5,
                  }}
                  resizeMode="contain"
                />
                <InterText weight={600} style={{ fontSize: 14, color: '#1A2024' }}>
                  {t('homeV1.starPet')}
                </InterText>
                <InterText weight={400} style={{ fontSize: 12, color: '#1A2024' }}>
                  {t('homeV1.starPetDesc')}
                </InterText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ModalBase
        ref={completeRef}
        title={t('activity.completeTitle')}
        description={t('activity.completeDesc')}
        description2={`${formatBalance(possiblePoints)} FSC`}
        description3={t('activity.completeFooter')}
        alternateDesign
        onConfirm={() => completeRef.current.hide()}
      />

      <LoginModal ref={loginRef} />

      <ComingSoonModal ref={comingSoonRef} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF0F2',
  },
  banner: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
  },
  drawer: {
    marginTop: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  drawerText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
    color: '#303940',
    flex: 1,
  },
  actions: {
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 93,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  banner1: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#4094F7',
    overflow: 'hidden',
  },
  getStarCard: {
    marginTop: 12,
    alignSelf: 'center',
    width: '70%',
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
})
