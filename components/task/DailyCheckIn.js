import React, { useCallback, useRef, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, useWindowDimensions, ActivityIndicator, Pressable } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'
import { Feather } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { dailySignIn, getDailySignIn } from '../../apis/tasks'

import { InterText } from '../../components/CustomText'
import DailySignInModal from '../../components/task/DailySignInModal'
import Popover from '../../components/Popover'

const dailyImage = require('../../assets/images/Task/daily.png')
const dailyCompleteImage = require('../../assets/images/Task/daily-complete.png')

export default function DailyCheckIn({ navigation, callCheckIn }) {
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(true)

  const [weeklyAttendance, setWeeklyAttendance] = useState(0)
  const [dailyRewards, setDailyRewards] = useState([0,0,0,0,0,0,0])
  const [dailyDays, setDailyDays] = useState(0)
  const [dailyTotal, setDailyTotal] = useState(0)
  const [checkedInToday, setCheckedInToday] = useState(false)

  const dailySignInModalRef = useRef()

  useFocusEffect(useCallback(() => {
    getDailySignIn().then(result => {
      setWeeklyAttendance(result.data.data.attends.length)
      setDailyRewards(result.data.data.ATTEND_INCOME)
      setDailyDays(result.data.data.continuousDays)
      setDailyTotal(result.data.data.total)
      setCheckedInToday(result.data.data.checkedInToday)
      setIsLoading(false)
    }).catch(e => console.log(e))
  }, []))

  // useFocusEffect(useCallback(() => {
  //   if (callCheckIn) {
  //     claimDaily()
  //     navigation.setParams({
  //       callCheckIn: false,
  //     })
  //   }
  // }, [navigation, callCheckIn, claimDaily]))

  const claimDaily = useCallback(async () => {
    if (!checkedInToday) {
      try {
        setCheckedInToday(true)
        await dailySignIn()
        dailySignInModalRef.current.show(dailyRewards[weeklyAttendance])
        setWeeklyAttendance(v => v + 1)
      } catch (e) {
        console.log(e)
        setCheckedInToday(false)
      }
    }
  }, [checkedInToday, dailyRewards, weeklyAttendance])

  return (
    <View style={styles.section}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.underline} />
        <InterText weight={600} style={{ flex: 1, fontSize: 18, color: '#1A2024' }}>
          {t('tasks.dailyCheckin')}
        </InterText>
        <Popover
          TriggerComponent={() =>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="info" size={16} color="#48535B" />
              <InterText style={{ marginLeft: 3, fontSize: 12, color: '#48535B' }}>
                {t('tasks.checkInRules')}
              </InterText>
            </View>
          }
          triggerProps={{ customStyles: { TriggerTouchableComponent: Pressable }}}
          backgroundColor="#303940"
        >
          <InterText style={{ fontSize: 12, color: '#FFFFFF' }}>
            {t('tasks.dailyRule1')}
          </InterText>
          <InterText style={{ fontSize: 12, color: '#FFFFFF' }}>
            {t('tasks.dailyRule2')}
          </InterText>
          <InterText style={{ fontSize: 12, color: '#FFFFFF' }}>
            {t('tasks.dailyRule3')}
          </InterText>
          <InterText style={{ fontSize: 12, color: '#FFFFFF' }}>
            {''}
          </InterText>
          <InterText style={{ fontSize: 12, color: '#FFFFFF' }}>
            {t('tasks.dailyRule4', {
              0: dailyRewards[0],
              1: dailyRewards[1],
              2: dailyRewards[2],
              3: dailyRewards[3],
              4: dailyRewards[4],
              5: dailyRewards[5],
              6: dailyRewards[6],
            })}
          </InterText>
        </Popover>
      </View>

      { !isLoading ?
        <>
          <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
            {dailyRewards.map((d, i) =>
              <View key={i} style={{ flex: 1, maxWidth: 38 }}>
                <View style={[styles.daily, weeklyAttendance >= i + 1 && { backgroundColor: '#1573FF' }]}>
                  <Image
                    source={weeklyAttendance >= i + 1 ? dailyCompleteImage : dailyImage}
                    style={{ width: 20, height:20 }}
                  />
                  <InterText
                    weight={700}
                    style={{
                      marginTop: 3,
                      fontSize: 10,
                      color: weeklyAttendance >= i + 1 ? '#FFFFFF' : '#1A2024',
                    }}
                  >
                    +{d}
                  </InterText>
                </View>
                <InterText weight={500} style={{ marginTop: 2, textAlign: 'center', fontSize: 10, color: '#303940' }}>
                  {t(`tasks.day${i + 1}`)}
                </InterText>
              </View>
            )}
          </View>

          <View style={{ marginTop: 16, flexDirection: 'row' }}>
            <InterText weight={700} style={{ fontSize: 12, color: '#303940', flex: 2 }}>
              {t('tasks.consecutiveDays1')}
              <InterText weight={500} style={{ color: '#FF5D15' }}>
                {dailyDays}
              </InterText>
              {t('tasks.consecutiveDays2', { plural: dailyDays > 1 ? 's' : '' })}
            </InterText>
            <View style={{ flex: 1 }} />
            <InterText weight={700} style={{ fontSize: 12, color: '#303940', textAlign: 'right', flex: 2 }}>
              {t('tasks.cumulativeEarning')}
              <InterText weight={500} style={{ color: '#FF5D15' }}>
                {dailyTotal}
              </InterText>
              {' '}FSC
            </InterText>
          </View>

          { !checkedInToday ?
            <TouchableOpacity onPress={claimDaily}>
              <LinearGradient
                colors={['#53B5FF', '#1472FF']}
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
                style={styles.completeDaily}
              >
                <InterText weight={600} style={{ fontSize: 14, color: '#FFFFFF' }}>
                  {t('tasks.signInNow')}
                </InterText>
              </LinearGradient>
            </TouchableOpacity> : null
          }
        </> :
        <View style={{ height: 100, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#0E73F6" />
        </View>
      }

      <DailySignInModal ref={dailySignInModalRef} />
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  underline: {
    width: 36,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#97CEFF',
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  daily: {
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    padding: 6,
    alignItems: 'center',
  },
  completeDaily: {
    marginTop: 20,
    alignSelf: 'center',
    width: '70%',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
