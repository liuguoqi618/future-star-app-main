import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'

import { InterText } from '../CustomText'
import moment from 'moment'
import { LinearGradient } from 'expo-linear-gradient'

const splashImage = require('../../assets/images/Card/card-splash.png')
const tokenIcon = require('../../assets/images/Card/token.png')
const starIcon = require('../../assets/images/Card/star.png')
const starGreyIcon = require('../../assets/images/Card/star-grey.png')

export default function CardBase(props) {
  const {
    owned, level,
    cardPurchased, max_acquire, daily_supply, total_supply, cost, requirement, effective_days, onObtainPressed,
    effectiveEnd, effectiveStart, totalEarned,
  } = props
  const { t, i18n } = useTranslation()
  const { width } = useWindowDimensions()

  const remaining = max_acquire - cardPurchased

  let daysLeft = 0
  if (owned) {
    const endDate = new Date(effectiveEnd)
    const startDate = new Date()
    daysLeft = Math.trunc((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
  }

  return (
    <Pressable onPress={onObtainPressed}>
      <LinearGradient
        colors={['#528FF9', '#526FF1']}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={styles.container}
      >
        <Image source={splashImage} style={{ position: 'absolute', bottom: 0, width: width - 40, height: '100%' }} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <InterText weight={600} style={{ fontSize: 20, color: '#FFFFFF' }}>
            {t(level > 0 ? 'card.cardDesc' : 'card.cardDesc_zero', { star: level, plural: level === 1 ? '' : 's' })}
          </InterText>
          { !owned ?
            <InterText style={{ marginLeft: 5, fontSize: 12, color: '#DDE2E4' }}>
              {t('card.remaining', { remaining, total: max_acquire })}
            </InterText> : null
          }
          <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
            { level === 0 ?
              <Image source={starGreyIcon} style={{ height: 16, width: 16 }} /> : null
            }
            { Array.from(Array(level).keys()).map(s =>
              <Image key={s} source={starIcon} style={{ height: 16, width: 16 }} />
            )}
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
          { owned ? (
            <>
              { daysLeft > 0 ?
                <InterText weight={500} style={{ fontSize: 14, color: '#FFFFFF' }}>
                  {t('card.expire', { days: daysLeft })}
                </InterText> : null
              }
              <InterText weight={500} style={{ marginLeft: 3, fontSize: 14, color: '#DDE2E4' }}>
                ({moment(effectiveStart).format('MMM DD YYYY')} - {moment(effectiveEnd).format('MMM DD YYYY')})
              </InterText>
            </>
            ) :
            <InterText weight={500} style={{ flex: 1, fontSize: 14, color: '#FFFFFF' }}>
              {t('card.valid', { days: effective_days })}
            </InterText>
          }
        </View>
        { !owned ?
          <InterText weight={500} style={{ fontSize: 14 ,color: '#FFFFFF' }}>
            {t('card.potential', { dailyProd: daily_supply })}
            <InterText weight={600} style={{ fontSize: 14 ,color: '#FFFFFF' }}>
              {total_supply} FSC
            </InterText>
          </InterText> : null
        }
        {!owned ?
          <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
            { requirement ?
              <>
                <InterText style={{ flex: 1, marginLeft: -5, textAlign: 'right', fontSize: 12, color: '#FFFFFF' }} numberOfLines={1}>
                  {t('card.memberReq2', {
                    users: ['en', 'zhch'].includes(i18n.language) ? t(numberToWord[requirement.number]) : requirement.number,
                    star: requirement.level,
                    plural: requirement.level === 1 ? '' : 's',
                  })}
                </InterText>
                <View style={{ width: 1, height: 14, marginHorizontal: 4, backgroundColor: '#FFFFFF' }} />
              </> : null
            }
            <InterText style={[
              { fontSize: 12, color: '#FFFFFF', marginRight: 8 },
              !requirement && { flex: 1, textAlign: 'right' },
            ]}>
              {t('card.spend')} {cost} FSC
            </InterText>
            <TouchableOpacity style={styles.purchase} onPress={onObtainPressed}>
              <InterText weight={600} style={{ fontSize: 14, color: '#0E73F6' }}>
                {t('card.obtain')}
              </InterText>
            </TouchableOpacity>
          </View> :
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <InterText weight={500} style={{ fontSize: 12, color: '#FFFFFF', marginRight: 8 }}>
              {t('card.earned')}{' '}
              <InterText weight={600} style={{ fontSize: 14, color: '#67E48B' }}>
                {totalEarned}
              </InterText>
              <InterText weight={600} style={{ fontSize: 14, color: '#FFFFFF' }}>
                /{total_supply}{' '}FSC
              </InterText>
            </InterText>
          </View>
        }
      </LinearGradient>
    </Pressable>
  )
}

const numberToWord = ['word.Zero', 'word.One', 'word.Two', 'word.Three', 'word.Four', 'word.Five', 'word.Six', 'word.Seven', 'word.Eight', 'word.Nine' ]

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  details: {
    backgroundColor: '#E7F2FF',
    borderRadius: 4,
    padding: 8,
  },
  purchase: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },
})
