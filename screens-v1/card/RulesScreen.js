import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'


import CustomScreenHeader from '../../components/CustomScreenHeader'
import { InterText } from '../../components/CustomText'
import { getGuestCards } from '../../apis/card'

export default function RulesScreen({ navigation }) {
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(true)
  const [cardList, setCardList] = useState([])

  useEffect(() => {
    getGuestCards().then((result) => {
      setCardList(result.data.data)
      setIsLoading(false)
    }).catch(e => {
      console.log(e)
    })
  }, [])

  return (
    <View style={styles.container}>
      <CustomScreenHeader title={t('card.rules')} />

      { isLoading ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0E73F6" />
        </View> :
        <ScrollView>
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-1')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-2')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-3')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-4')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-5')}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-6')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[0].max_acquire}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-13')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[0].total_supply}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-14', { days: cardList[0].effective_days })}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-7')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[1].max_acquire}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[1].cost}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[1].total_supply}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-14', { days: cardList[1].effective_days })}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-8')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[2].max_acquire}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[2].cost}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[2].total_supply}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-14', { days: cardList[2].effective_days })}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-9')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[3].max_acquire}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[3].cost}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[3].total_supply}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-14', { days: cardList[3].effective_days })}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-10')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[4].max_acquire}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[4].cost}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[4].total_supply}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-14', { days: cardList[4].effective_days })}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-11')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[5].max_acquire}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[5].cost}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[5].total_supply}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-14', { days: cardList[5].effective_days })}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-12')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[6].max_acquire}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[6].cost}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[6].total_supply}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-14', { days: cardList[6].effective_days })}
              </InterText>
            </View>

            <View style={{ height: 12 }} />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-1')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-15')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-16')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-17')}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-6')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[0].daily_supply}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                50%
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {''}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-7')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[1].daily_supply}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                9%
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {''}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-8')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[2].daily_supply}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                9%
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {''}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-9')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[3].daily_supply}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                8%
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.memberReq', {
                  users: t(numberToWord[cardList[3].requirement.number]),
                  star: cardList[3].requirement.level,
                })}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-10')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[4].daily_supply}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                7%
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.memberReq', {
                  users: t(numberToWord[cardList[4].requirement.number]),
                  star: cardList[4].requirement.level,
                })}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-11')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[5].daily_supply}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                6%
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.memberReq', {
                  users: t(numberToWord[cardList[5].requirement.number]),
                  star: cardList[5].requirement.level,
                })}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.rules-0-12')}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {cardList[6].daily_supply}
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                6%
              </InterText>
              <InterText weight={600} style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                {t('card.memberReq', {
                  users: t(numberToWord[cardList[6].requirement.number]),
                  star: cardList[6].requirement.level,
                })}
              </InterText>
            </View>

            <View style={{ height: 12 }} />

            <InterText weight={600} style={styles.text}>
              {t('card.rules-1-1')}
            </InterText>
            <InterText weight={600} style={styles.text}>
              {t('card.rules-1-2')}
            </InterText>
            <InterText weight={600} style={styles.text}>
              {t('card.rules-1-3')}
            </InterText>
            <InterText weight={600} style={styles.text}>
              {t('card.rules-1-4')}
            </InterText>
            <InterText weight={600} style={styles.text}>
              {t('card.rules-1-5')}
            </InterText>
          </View>
        </ScrollView>
      }
    </View>
  )
}

const numberToWord = ['word.Zero', 'word.One', 'word.Two', 'word.Three', 'word.Four', 'word.Five', 'word.Six', 'word.Seven', 'word.Eight', 'word.Nine' ]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF0F2',
  },
  section: {
    marginHorizontal: 12,
    marginVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
  },
  text: {
    fontSize: 12,
    color: '#1A2024',
  },
})

