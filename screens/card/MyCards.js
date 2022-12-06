import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, FlatList, Image, View } from 'react-native'

import CardBase from '../../components/card/CardBase'
import { WorkSansText, InterText } from '../../components/CustomText'

const cardsEmpty = require('../../assets/images/Card/cards-empty.png')

function MyCards({ cardList, cardListLoaded }) {
  const { t } = useTranslation()

  return (
    <FlatList
      data={cardList}
      renderItem={({item}) =>
        <CardBase key={item.star} owned {...item} {...item.attributes} />
      }
      ListFooterComponent={() => <View style={{ height: 16 }} />}
      ListEmptyComponent={() =>
        !cardListLoaded ?
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
  )
}

export default React.memo(MyCards)
