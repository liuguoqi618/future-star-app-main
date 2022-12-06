import React, { useContext, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { useTranslation } from 'react-i18next'
import { checkPurchaseCard, purchaseCard } from '../../apis/card'
import { GlobalContext } from '../../context/GlobalContext'
import { useNavigation } from '@react-navigation/native'

import CardBase from '../../components/card/CardBase'
import ObtainCardSheet from '../../components/card/ObtainCardSheet'
import ModalBase from '../../components/ModalBase'

function CardList({ cardList, cardListLoaded, refresh }) {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const [{ isLoggedIn }] = useContext(GlobalContext)

  const [currentCard, setCurrentCard] = useState()
  const [requirements, setRequirements] = useState(0)

  const obtainCardSheetRef = useRef()
  const purchasingModalRef = useRef()

  const tryObtainCard = (card) => {
    if (isLoggedIn) {
      checkPurchaseCard(card.level).then(result => {
        setRequirements(result.data.data)
        setCurrentCard(card)
        obtainCardSheetRef.current.open()
      }).catch(e => {
        console.log(e)
        Toast.show({ type: 'error', text1: t('card.error1') })
      })
    } else {
      navigation.navigate('Auth')
    }
  }

  const tryPurchaseCard = async (level) => {
    try {
      obtainCardSheetRef.current.close()
      await new Promise(resolve => setTimeout(resolve, 500))
      purchasingModalRef.current.show()
      await purchaseCard(level)
      purchasingModalRef.current.finishLoading()
      refresh()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <FlatList
        data={cardList}
        renderItem={({item}) =>
          <CardBase key={item.title} {...item} onObtainPressed={() => tryObtainCard(item)} />
        }
        ListFooterComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={() =>
          !cardListLoaded ?
          <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0E73F6" />
          </View> : null
        }
      />
      <ObtainCardSheet
        ref={obtainCardSheetRef}
        card={currentCard}
        requirements={requirements}
        purchase={tryPurchaseCard}
      />
      <ModalBase
        ref={purchasingModalRef}
        title=""
        description={t('card.purchased')}
        onConfirm={() => purchasingModalRef.current.hide()}
      />
    </>
  )
}

export default React.memo(CardList)
