import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getCardHistory, getMyCards } from '../../apis/card'

import CustomScreenHeader from '../../components/CustomScreenHeader'
import CardBase from '../../components/card/CardBaseV1'
import { WorkSansText, InterText } from '../../components/CustomText'
import DropDownPicker from '../../components/DropDownPicker'

const cardsEmpty = require('../../assets/images/Card/cards-empty.png')

export default function MyCardsScreen({ navigation }) {
  const { t } = useTranslation()

  const [myCards, setMyCards] = useState([])
  const [myCardsLoaded, setMyCardsLoaded] = useState(false)

  useEffect(() => {
    getMyCards().then((result) => {
      setMyCards(result.data.data)
    }).catch(e => {
      console.log(e)
    }).finally(() => {
      setMyCardsLoaded(true)
    })
  }, [])

  return (
    <View style={styles.container}>
      <CustomScreenHeader title={t('card.myCards')} />

      <FlatList
        data={myCards}
        renderItem={({item}) =>
          <CardBase key={item.star} owned {...item} {...item.attributes} />
        }
        ListFooterComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={() =>
          !myCardsLoaded ?
          <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0E73F6" />
          </View> :
          <View style={{ height: 300, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            <Image source={cardsEmpty} />
            <WorkSansText weight={700} style={{ fontSize: 22, color: '#303940', marginBottom: 12 }}>
              {t('card.noCards')}
            </WorkSansText>
            <InterText style={{ textAlign: 'center', fontSize: 14, color: '#303940', lineHeight: 20 }}>
              {t('card.noCards2')}
            </InterText>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF0F2',
  },
  filterWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    // backgroundColor: '#FFFFFF',
    // borderBottomWidth: 1,
    // borderBottomColor: '#EEF0F2',
    // zIndex: 100,
  },
  filter: {
    height: 40,
    minHeight: 40,
    borderColor: '#DDE2E4',
    borderRadius: 4,
  },
  filterText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#303940',
  },
  filterPlaceholder: {
    color: '#84919A',
  },
  filterDropdown: {
    borderColor: '#DDE2E4',
    borderRadius: 4,
  },
})

