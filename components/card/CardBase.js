import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import { InterText } from '../CustomText'
import moment from 'moment'

const tokenIcon = require('../../assets/images/Card/token.png')
const starIcon = require('../../assets/images/Card/star.png')
const starGreyIcon = require('../../assets/images/Card/star-grey.png')

export default function CardBase(props) {
  const {
    owned, level,
    cardPurchased, max_acquire, daily_supply, cost, requirement, onObtainPressed,
    effectiveEnd, effectiveStart, totalEarned,
  } = props
  const { t, i18n } = useTranslation()

  const remaining = max_acquire - cardPurchased

  let daysLeft = 0
  if (owned) {
    const endDate = new Date(effectiveEnd)
    const startDate = new Date()
    daysLeft = Math.trunc((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.greyWrapper}>
          { level === 0 ?
            <Image source={starGreyIcon} style={{ height: 12, width: 12 }} /> : null
          }
          { Array.from(Array(level).keys()).map(s =>
            <Image key={s} source={starIcon} style={{ height: 12, width: 12 }} />
          )}
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          { !owned && remaining ?
            <View style={[styles.greyWrapper, { marginLeft: 8 }]}>
              <InterText weight={500} style={{ fontSize: 12, color: '#1A2024' }} numberOfLines={1}>
                {t('card.remaining', { remaining, total: max_acquire })}
              </InterText>
            </View> : null
          }
          { owned ?
            <View style={[styles.greyWrapper, { marginLeft: 8 }]}>
              <InterText weight={500} style={{ fontSize: 12, color: '#1A2024' }}>
                { daysLeft > 0 ?
                  t('card.expire', { days: daysLeft }) :
                  `${moment(effectiveStart).format('MMM DD YYYY')} - ${moment(effectiveEnd).format('MMM DD YYYY')}`
                }
              </InterText>
            </View> : null
          }
        </View>
        { !owned ?
          <TouchableOpacity style={[styles.blueWrapper, { marginLeft: 8 }]} onPress={onObtainPressed}>
            <AntDesign name="plus" size={14} color="#FFFFFF" />
            <InterText weight={600} style={{ marginLeft: 3, fontSize: 14, color: '#FFFFFF' }}>
              {t('card.obtain')}
            </InterText>
          </TouchableOpacity> : null
        }
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
        <InterText weight={600} style={{ fontSize: 16, color: '#252C32' }}>
          {t(level > 0 ? 'card.cardDesc' : 'card.cardDesc_zero', { star: level, plural: level === 1 ? '' : 's' })}
        </InterText>
        <InterText weight={500} style={{ marginLeft: 5, fontSize: 12 ,color: '#1A2024' }}>
          {t('card.dailyProd', { dailyProd: daily_supply })}
        </InterText>
      </View>
      {!owned ?
        <View style={styles.details}>
          <InterText weight={600} style={{ fontSize: 10, color: '#6E7C87', marginBottom: 8 }}>
            {t('card.required')}
          </InterText>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <View style={[styles.whiteWrapper, { marginRight: 8 }]}>
              <Image source={tokenIcon} style={{ height: 13, width: 13 }} />
              <InterText weight={500} style={{ marginLeft: 3, fontSize: 12, color: '#303940' }} numberOfLines={1}>
                {cost}
              </InterText>
            </View>
            { requirement ?
              <View style={styles.whiteWrapper}>
                <InterText weight={500} style={{ marginLeft: 3, fontSize: 12, color: '#303940' }} numberOfLines={1}>
                  {t('card.memberReq', {
                    users: requirement.number,
                    star: ['en', 'zhch'].includes(i18n.language) ? t(numberToWord[requirement.level]) : requirement.level,
                    plural: requirement.level === 1 ? '' : 's',
                  })}
                </InterText>
              </View> : null
            }
          </View>
        </View> :
        <View style={styles.details}>
          <InterText weight={600} style={{ fontSize: 10, color: '#6E7C87', marginBottom: 8 }}>
            {t('card.totalEarning')}{' '}
            { daysLeft > 0 ? t('card.until', { date: moment(effectiveEnd).format('MMM DD').toUpperCase() }) : ''}
          </InterText>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={tokenIcon} style={{ height: 16, width: 16 }} />
            <InterText weight={600} style={{ marginLeft: 3, fontSize: 14, color: '#1A2024' }}>
              {totalEarned}
            </InterText>
          </View>
        </View>
      }
    </View>
  )
}

const numberToWord = ['word.Zero', 'word.One', 'word.Two', 'word.Three', 'word.Four', 'word.Five', 'word.Six', 'word.Seven', 'word.Eight', 'word.Nine' ]

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 8,
  },
  greyWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 19,
    paddingHorizontal: 8,
    backgroundColor: '#F6F8F9',
  },
  blueWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    height: 24,
    paddingHorizontal: 8,
    backgroundColor: '#0E73F6',
  },
  details: {
    backgroundColor: '#E7F2FF',
    borderRadius: 4,
    padding: 8,
  },
  whiteWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    height: 19,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
})
