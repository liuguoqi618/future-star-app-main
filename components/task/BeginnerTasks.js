import React, { useCallback, useRef, useState } from 'react'
import { View, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { getBeginnerTasks } from '../../apis/tasks'
import { beginnerTaskLabels } from '../../utils/tasks'
import { languageToFeedFilter } from '../../locale'

import { InterText } from '../../components/CustomText'
import { getVerifyStatus } from '../../apis/verify'
import VerifyModal from '../wallet/VerifyModal'
import SelectCurrencySheet from '../wallet/SelectCurrencySheet'
import LoadingModal from '../LoadingModal'

const beginnerTaskImage = require('../../assets/images/Task/beginner-task.png')

export default function BeginnerTasks() {
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()

  const [isLoading, setIsLoading] = useState(true)
  const [beginnerTasks, setBeginnerTasks] = useState([])
  const [remaining, setRemaining] = useState(0)

  const [tutorialArticleId, setTutorialArticleId] = useState('')
  const [tutorialVideoId, setTutorialVideoId] = useState('')

  const [verifyLoading, setVerifyLoading] = useState(false)

  // 0: withdraw, 1: top up, else no action
  const [currencySelectMode, setCurrencySelectMode] = useState(-1)

  const verifyModalRef = useRef()
  const selectCurrencyRef = useRef()

  useFocusEffect(useCallback(() => {
    getBeginnerTasks().then(result => {
      const tutorialArticle = result.data.data.articleId.find(a => a.language === languageToFeedFilter(i18n.language))
      if (tutorialArticle) {
        setTutorialArticleId(tutorialArticle.id)
      }
      const tutorialVideo = result.data.data.videoId.find(a => a.language === languageToFeedFilter(i18n.language))
      if (tutorialVideo) {
        setTutorialVideoId(tutorialVideo.id)
      }
      setRemaining(result.data.data.remaining)
      setBeginnerTasks(result.data.data.tasks)
      setIsLoading(false)
    })
  }, [i18n]))

  const actions = {
    'view_usermenu': () => {
      navigation.navigate('ReadScreen', { articleId: tutorialArticleId })
    },
    'watch_intro_video': () => {
      navigation.navigate('VideoAdScreen', { videoId: tutorialVideoId })
    },
    'finish_verify': () => {
      navigation.navigate('Profile')
      navigation.navigate('VerificationScreen')
    },
    'first_get_card': () => {
      navigation.navigate('Card')
    },
    'first_finish_daily_task': () => {
      navigation.navigate('ActivityScreen')
    },
    'first_finish_step_task': () => {
      navigation.navigate('FitnessScreen')
    },
    'first_invite_user': () => {
      navigation.navigate('InviteScreen')
    },
    'first_convert_FSC_to_USDT': () => {
      navigation.navigate('ConvertScreen', {
        currency1: 'FSC',
        currency2: 'USDT',
      })
    },
    'first_withdraw_USDT': async () => {
      setVerifyLoading(true)
      // setCurrencySelectMode(0)
      try {
        const result = await getVerifyStatus()
        setVerifyLoading(false)
        if (result.data.data.status === 1) {
          // selectCurrencyRef.current.open()
          navigation.navigate('WithdrawScreen', { currency: 'USDT' })
        } else {
          verifyModalRef.current.show()
        }
      } catch (e) {
        console.log(e)
      }
    },
    'first_deposit': () => {
      setCurrencySelectMode(1)
      selectCurrencyRef.current.open()
    },
  }

  const onCurrencySelect = (currency) => {
    if (currencySelectMode === 0) {
      navigation.navigate('WithdrawScreen', { currency })
    } else if (currencySelectMode === 1) {
      navigation.navigate('TopUpScreen', { currency })
    }
  }

  return (
    <View style={[styles.section, { paddingBottom: 0 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.underline} />
        <InterText weight={600} style={{ flex: 1, fontSize: 18, color: '#1A2024' }}>
          {t('tasks.beginnerTask')}
        </InterText>
        { !isLoading ?
          <InterText style={{ fontSize: 13, color: '#0E73F6' }}>
            {t('tasks.earn', { FSC: remaining })}
          </InterText> : null
        }
      </View>
      { !isLoading ?
        beginnerTasks.filter((b, i) => {
          if (b.type === 'first_get_card') {
            return false
          } else if (!tutorialArticleId && i === 0) {
            return false
          } else if (!tutorialVideoId && i === 1) {
            return false
          } else {
            return true
          }
        }).map((task, i) =>
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <InterText weight={500} style={{ fontSize: 16, color: '#3C464E' }}>
                {t(beginnerTaskLabels[task.type])}
              </InterText>
              <View style={{ flexDirection: 'row' }}>
                <InterText style={{ fontSize: 14, color: '#0E73F6', marginRight: 8 }}>
                  {t('tasks.reward')}
                </InterText>
                <Image source={beginnerTaskImage} style={{ width: 18, height: 18 }} />
                <InterText weight={600} style={{ marginLeft: 3, fontSize: 14, color: '#0E73F6' }}>
                  {task.bonus} FSC
                </InterText>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (actions[task.type]) {
                  actions[task.type]()
                }
              }}
              disabled={task.finished}
            >
              <LinearGradient
                colors={task.finished ? ['#FFFFFF', '#FFFFFF'] : ['#53B5FF', '#1472FF']}
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
                style={[styles.beginnerToDo, task.finished && { borderColor: '#0E73F6' }]}
              >
                <InterText style={{ fontSize: 12, color: task.finished ? '#0E73F6' : '#FFFFFF' }}>
                  {t(task.finished ? 'tasks.completed' : 'tasks.toFinish')}
                </InterText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) :
        <View style={{ height: 300, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#0E73F6" />
        </View>
      }

      <SelectCurrencySheet
        ref={selectCurrencyRef}
        onSelect={onCurrencySelect}
      />

      <VerifyModal
        ref={verifyModalRef}
        onConfirm={() => {
          verifyModalRef.current.hide()
          navigation.navigate('VerificationScreen')
        }}
      />

      <LoadingModal visible={verifyLoading} />
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
    backgroundColor: '#0E73F6',
    overflow: 'hidden',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  beginnerToDo: {
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
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
