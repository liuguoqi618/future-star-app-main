import React, { useCallback, useContext, useState } from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { TabBar, TabView } from 'react-native-tab-view'
import { useFocusEffect } from '@react-navigation/native'
import { getCardList, getGuestCards, getMyCards } from '../../apis/card'
import { GlobalContext } from '../../context/GlobalContext'

import Header from '../../components/card/Header'
import { InterText } from '../../components/CustomText'
import CardList from './CardList'
import MyCards from './MyCards'

export default function CardScreen() {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  const [{ isLoggedIn }] = useContext(GlobalContext)

  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'cardList', title: 'card.cardList' },
    { key: 'myCards', title: 'card.myCards' },
  ])

  const [cardList, setCardList] = useState([])
  const [cardListLoaded, setCardListLoaded] = useState(false)
  const [myCards, setMyCards] = useState([])
  const [myCardsLoaded, setMyCardsLoaded] = useState(false)

  const refreshCard = useCallback(() => {
    if (index === 0) {
      if (isLoggedIn) {
        getCardList().then((result) => {
          setCardList(result.data.data)
        }).catch(e => {
          console.log(e)
        }).finally(() => {
          setCardListLoaded(true)
        })
      } else {
        getGuestCards().then((result) => {
          setCardList(result.data.data)
        }).catch(e => {
          console.log(e)
        }).finally(() => {
          setCardListLoaded(true)
        })
      }
    } else if (index === 1) {
      if (isLoggedIn) {
        getMyCards().then((result) => {
          setMyCards(result.data.data)
        }).catch(e => {
          console.log(e)
        }).finally(() => {
          setMyCardsLoaded(true)
        })
      } else {
        setMyCards([])
        setMyCardsLoaded(true)
      }
    }
  }, [index, isLoggedIn])

  useFocusEffect(refreshCard)

  const renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.tabIndicator}
        style={styles.tabBar}
        labelStyle={styles.tabLabel}
        renderLabel={({ route }) =>
          <InterText weight={600} style={styles.tabLabel}>
            {t(route.title)}
          </InterText>
        }
      />
    )
  }

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'cardList':
        return <CardList jumpTo={jumpTo} cardList={cardList} cardListLoaded={cardListLoaded} refresh={refreshCard} />
      case 'myCards':
        return <MyCards jumpTo={jumpTo} cardList={myCards} cardListLoaded={myCardsLoaded} />
    }
  }

  return (
    <View style={styles.container}>
      <Header />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={renderTabBar}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF0F2',
  },
  tabIndicator: {
    backgroundColor: '#000000',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
  },
  tabLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#3C464E',
  },
})
