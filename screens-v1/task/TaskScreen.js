import React, { useCallback, useContext, useState } from 'react'
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, useWindowDimensions, Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import { GlobalContext } from '../../context/GlobalContext'
import { AntDesign, Feather } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'

import { InterText } from '../../components/CustomText'
import Header from '../../components/task/Header'
import InviteBanner from '../../components/home/InviteBanner'
import Popover from '../../components/Popover'
import DailyCheckIn from '../../components/task/DailyCheckIn'
import BeginnerTasks from '../../components/task/BeginnerTasks'
import { getSummary } from '../../apis/tasks'

const splash1Image = require('../../assets/images/Task/splash-1.png')
const splash2Image = require('../../assets/images/Task/splash-2.png')
const splash3Image = require('../../assets/images/Task/splash-3.png')

export default function TaskScreen({ navigation, route }) {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  const { callCheckIn } = route.params

  const [{ isLoggedIn, starLevel }] = useContext(GlobalContext)

  const [activityEarning, setActivityEarning] = useState(0)
  const [walkEarning, setWalkEarning] = useState(0)
  const [totalEarning, setTotalEarning] = useState(0)

  const [convertRatio, setConvertRatio] = useState(100)

  useFocusEffect(useCallback(() => {
    getSummary().then(result => {
      setActivityEarning(result.data.data.taskIncome)
      setWalkEarning(result.data.data.stepIncome)
      setTotalEarning(result.data.data.potentialEarn)
      setConvertRatio(result.data.data.USDT_TO_FSC_RATIO)
    })
  }, []))

  return (
    <View style={styles.container}>
      <ScrollView>
        <Header />
        <View style={{ marginHorizontal: 12 }}>
          { starLevel < 0 ?
            <View style={[styles.banner1, { alignItems: 'center' }]}>
              <Image source={splash1Image} style={{ position: 'absolute', width: width - 24, height: 200 }} />
              <InterText weight={600} style={{ textAlign: 'center', fontSize: 20, color: '#FFFFFF' }}>
                {t('tasks.getStarCard')}
              </InterText>
              <InterText weight={500} style={{ marginTop: 4, textAlign: 'center', fontSize: 12, color: '#FFFFFF' }}>
                {t('tasks.getStarCardDesc')}
              </InterText>
              <View style={styles.getStarCard}>
                <InterText weight={600} style={{ fontSize: 14, color: '#0E73F6' }}>
                  {t('tasks.getItNow')}
                </InterText>
              </View>
            </View> :
            <>
              <View style={[styles.banner1, { height: (width - 24) / 1340 * 476 }]}>
                <Image
                  source={splash1Image}
                  style={{ position: 'absolute', width: width - 24, height: (width - 24) / 1340 * 476 }}
                  resizeMode="stretch"
                />
                <View style={{ flex: 1, justifyContent: 'center', marginTop: 12 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                      <InterText weight={600} style={{ fontSize: 18, color: '#FFFFFF' }}>
                        {t('tasks.totalCurrentIncome')}
                      </InterText>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <InterText style={{ fontSize: 12, color: '#FFFFFF' }}>
                          {t('tasks.totalEarning', { FSC: totalEarning })}
                          <Popover
                            TriggerComponent={() =>
                              <View style={{ marginLeft: 4, marginBottom: -4 }}>
                                <Feather name="info" size={14} color="#FFFFFF" />
                              </View>
                            }
                            triggerProps={{ customStyles: { TriggerTouchableComponent: Pressable }}}
                            backgroundColor="#303940"
                          >
                            <InterText style={{ fontSize: 12, color: '#FFFFFF' }}>
                              {t('tasks.cardRule')}
                            </InterText>
                          </Popover>
                        </InterText>
                      </View>
                    </View>
                    <View style={{ marginLeft: 20 }}>
                      <InterText weight={600} style={{ textAlign: 'right', fontSize: 24, color: '#FFFFFF' }}>
                        {activityEarning + walkEarning}
                        <InterText style={{ fontSize: 16 }}>
                          {' '}FSC
                        </InterText>
                      </InterText>
                      <InterText weight={500} style={{ textAlign: 'right', fontSize: 12, color: '#FFFFFF' }}>
                        ≈ {Math.trunc((activityEarning + walkEarning)) / convertRatio} USDT
                      </InterText>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
                  onPress={() => navigation.navigate('Card')}
                >
                  <>
                    <InterText style={{ fontSize: 12, color: '#FFFFFF', textDecorationLine: 'underline', marginRight: 8 }}>
                      {t('tasks.upgradeStar')}
                    </InterText>
                    <AntDesign name="arrowright" size={20} color="#FFFFFF" />
                  </>
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 16, flexDirection: 'row' }}>
                <TouchableOpacity style={styles.banner2} onPress={() => navigation.navigate('ActivityScreen')}>
                  <>
                    <Image
                      source={splash2Image}
                      style={{
                        position: 'absolute',
                        width: (width + 24) / 2,
                        height: (width + 24) / 2 / 646 * 392,
                      }}
                    />
                    <InterText weight={600} style={{ textAlign: 'center', fontSize: 14, color: '#FFFFFF' }}>
                      {t('tasks.activityTaskIncome')}
                    </InterText>
                    <InterText weight={500} style={{ marginTop: 8, textAlign: 'center', fontSize: 16, color: '#FFFFFF' }}>
                      {activityEarning}
                      <InterText style={{ fontSize: 14 }}>
                        {' '}FSC
                      </InterText>
                    </InterText>
                  </>
                </TouchableOpacity>
                <View style={{ width: 16 }} />
                <TouchableOpacity style={styles.banner2} onPress={() => navigation.navigate('FitnessScreen')}>
                  <>
                    <Image
                      source={splash3Image}
                      style={{
                        position: 'absolute',
                        width: (width + 24) / 2,
                        height: (width + 24) / 2 / 646 * 392,
                      }}
                    />
                    <InterText weight={600} style={{ textAlign: 'center', fontSize: 14, color: '#FFFFFF' }}>
                      {t('tasks.walkToEarnIncome')}
                    </InterText>
                    <InterText weight={500} style={{ marginTop: 8, textAlign: 'center', fontSize: 16, color: '#FFFFFF' }}>
                      {walkEarning}
                      <InterText style={{ fontSize: 14 }}>
                        {' '}FSC
                      </InterText>
                    </InterText>
                  </>
                </TouchableOpacity>
              </View>
            </>
          }

          <DailyCheckIn navigation={navigation} callCheckIn={callCheckIn} />

          <BeginnerTasks />

          <InviteBanner navigation={navigation} isLoggedIn={isLoggedIn} />
        </View>
        <View style={{ height: 16 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF0F2',
  },
  banner1: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#0E73F6',
    overflow: 'hidden',
  },
  banner2: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#4094F7',
    overflow: 'hidden',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
