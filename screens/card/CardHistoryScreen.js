import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getCardHistory } from '../../apis/card'

import CustomScreenHeader from '../../components/CustomScreenHeader'
import CardBase from '../../components/card/CardBase'
import { WorkSansText, InterText } from '../../components/CustomText'
import DropDownPicker from '../../components/DropDownPicker'

const cardsEmpty = require('../../assets/images/Card/cards-empty.png')

export default function CardHistoryScreen({ navigation }) {
  const { t } = useTranslation()

  const [cardListLoaded, setCardListLoaded] = useState(false)
  const [cardHistory, setCardHistory] = useState([])

  const [filter, setFilter] = useState(0)

  const dropDownRef = useRef()

  const filterOptions = [
    {label: t('card.sort1'), value: 0 },
    {label: t('card.sort2'), value: 1 },
    {label: t('card.sort3'), value: 2 },
    {label: t('card.sort4'), value: 3 },
    {label: t('card.sort5'), value: 4 },
    {label: t('card.sort6'), value: 5 },
  ]

  useEffect(() => {
    let sort = filter >= 0 ? filter : 0

    getCardHistory(sort).then(result => {
      setCardHistory(result.data.data)
      setCardListLoaded(true)
    })
  }, [filter])

  return (
    <View style={styles.container}>
      <CustomScreenHeader title={t('card.historyTitle')} />

      <View style={styles.filterWrapper}>
      <DropDownPicker
          ref={dropDownRef}
          value={filter}
          setValue={setFilter}
          options={filterOptions}
        />
      </View>

      <FlatList
        data={cardHistory}
        renderItem={({item}) =>
          <CardBase owned key={item.star} {...item}  {...item.attributes} />
        }
        ListFooterComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={() =>
          !cardListLoaded ?
          <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0E73F6" />
          </View> :
        <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={cardsEmpty} />
          <WorkSansText weight={700} style={{ fontSize: 22, color: '#303940', marginBottom: 12 }}>
            {t('card.noHistory')}
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

