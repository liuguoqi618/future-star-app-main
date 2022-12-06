import React, { useCallback, useContext, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { Entypo, Feather } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GlobalContext } from '../../context/GlobalContext'
import { useTranslation } from 'react-i18next'
import { useFocusEffect } from '@react-navigation/native'
import { checkPurchaseCard, getCardList, getCardSummary } from '../../apis/card'
import Toast from 'react-native-toast-message'
import medals from '../../utils/medals'

import { InterText, WorkSansText } from '../../components/CustomText'
import CardBase from '../../components/card/CardBaseV1'
import ModalBase from '../../components/ModalBase'
import Popover from '../../components/Popover'
import LoadingModal from '../../components/LoadingModal'
import ObtainCardModal from '../../components/card/ObtainCardModal'

const splashImage = require('../../assets/images/Card/splash.png')
const defaultAvatarIcon = require('../../assets/images/TopBar/default-avatar.png');

export default function CardScreen({ navigation }) {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()

  const [{ isLoggedIn, avatarUrl, username, starLevel }, dispatch] = useContext(GlobalContext)

  const [isLoading, setIsLoading] = useState(false)

  const [cardNumber, setCardNumber] = useState(0)
  const [totalEarning, setTotalEarning] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)

  const [cardList, setCardList] = useState([])
  const [cardListLoaded, setCardListLoaded] = useState(false)

  // const [currentCard, setCurrentCard] = useState()
  // const [requirements, setRequirements] = useState(0)

  const obtainCardModalRef = useRef()

  const getCards = useCallback(() => {
    getCardSummary().then(result => {
      setCardNumber(result.data.data.cardNumber)
      setTotalEarning(result.data.data.totalEarning)
      setTotalSupply(result.data.data.totalSupply)
      dispatch({
        type: 'SET_STAR_CARD',
        data: {
          starLevel: result.data.data.currentLevel,
        },
      })
    })

    getCardList().then((result) => {
      setCardList(result.data.data)
    }).catch(e => {
      console.log(e)
    }).finally(() => {
      setCardListLoaded(true)
    })
  }, [dispatch])

  useFocusEffect(getCards)

  const tryObtainCard = (card) => {
    // if (isLoggedIn) {
    setIsLoading(true)
    checkPurchaseCard(card.level).then(result => {
      setIsLoading(false)
      // const requirements = requirements.balance < card.cost
      // setRequirements(result.data.data)
      // setCurrentCard(card)
      // obtainCardSheetRef.current.open()
      obtainCardModalRef.current.show(card, result.data.data)
    }).catch(e => {
      console.log(e)
      Toast.show({ type: 'error', text1: t('card.error1') })
    })
    // } else {
    //   navigation.navigate('Auth')
    // }
  }

  const renderHeader = () =>
    <View style={styles.container}>
      <View style={styles.splashWrap}>
        <View style={[styles.splash, { width }]}>
          <Image source={splashImage} style={{ height: '100%', width: '100%' }} />
        </View>
      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: insets.top,
        paddingVertical: 12,
      }}>
        <WorkSansText weight={700} style={{ fontSize: 18, color: '#FFFFFF' }}>
          {t('card.title')}
        </WorkSansText>
        <View style={{ position: 'absolute', right: 12 }}>
          <Pressable onPress={() => navigation.navigate('RulesScreen')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="info" size={16} color="#FFFFFF" />
              <InterText weight={500} style={{ marginLeft: 3, fontSize: 14, color: '#FFFFFF' }}>
                {t('card.rules')}
              </InterText>
            </View>
          </Pressable>
          {/* <Popover
            TriggerComponent={() =>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="info" size={16} color="#FFFFFF" />
                <InterText weight={500} style={{ marginLeft: 3, fontSize: 12, color: '#FFFFFF' }}>
                  {t('card.rules')}
                </InterText>
              </View>
            }
            triggerProps={{ customStyles: { TriggerTouchableComponent: Pressable }}}
            backgroundColor="#303940"
          >
            <InterText style={{ fontSize: 12, color: '#FFFFFF' }}>
              {t('card.rules-1')}
            </InterText>
            <InterText style={{ fontSize: 12, color: '#FFFFFF' }}>
              {t('card.rules-2')}
            </InterText>
            <InterText style={{ fontSize: 12, color: '#FFFFFF' }}>
              {t('card.rules-3')}
            </InterText>
            <InterText style={{ fontSize: 12, color: '#FFFFFF' }}>
              {t('card.rules-4')}
            </InterText>
            <InterText style={{ fontSize: 12, color: '#FFFFFF' }}>
              {t('card.rules-5')}
            </InterText>
          </Popover> */}
        </View>
      </View>

      <View style={{ marginHorizontal: 12 }}>
        <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Image
              source={isLoggedIn && avatarUrl ? {uri: avatarUrl} : defaultAvatarIcon}
              style={{ width: 60, height: 60, borderRadius: 30 }}
            />
            { starLevel >= 0 ?
              <Image
                source={medals[starLevel]}
                style={{ height: 23, width: 18, position: 'absolute', bottom: 0, right: 0 }}
              /> : null
            }
          </View>
          <View style={{ marginLeft: 8 }}>
            <WorkSansText weight={600} style={{ fontSize: 20, color: '#FFFFFF' }}>
              {username}
            </WorkSansText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <WorkSansText weight={500} style={{ fontSize: 14, color: '#FFFFFF', marginRight: 3 }}>
                {starLevel < 7 ? t(memberNames[starLevel]) : ''}
              </WorkSansText>
              <Popover
                TriggerComponent={() =>
                  <Feather name="info" size={16} color="#FFFFFF" />
                }
                triggerProps={{ customStyles: { TriggerTouchableComponent: Pressable }}}
                backgroundColor="#303940"
              >
                <InterText style={{ fontSize: 12, color: '#FFFFFF' }}>
                  {t('card.starLeveDesc')}
                </InterText>
              </Popover>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <InterText weight={600} style={{ fontSize: 16, color: '#A23FEE' }}>
              {cardNumber}
              <InterText weight={500} style={{ fontSize: 10, color: '#252C32' }}>
                {' '}{t(cardNumber === 1 ? 'card.cardSingle' : 'card.cardPlural')}
              </InterText>
            </InterText>
            <InterText weight={500} style={{ flex: 1, textAlign: 'center', fontSize: 12, color: '#252C32', marginTop: 4 }}>
              {t('card.totalCards')}
            </InterText>
          </View>
          <View style={{ height: '100%', width: 1, backgroundColor: '#E5E9EB' }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <InterText weight={600} style={{ fontSize: 16, color: '#A23FEE' }}>
              {totalSupply}
              <InterText weight={500} style={{ fontSize: 10, color: '#252C32' }}>
                {' '}FSC
              </InterText>
            </InterText>
            <InterText weight={500} style={{ flex: 1, textAlign: 'center', fontSize: 12, color: '#252C32', marginTop: 4 }}>
              {t('card.revenueCap')}
            </InterText>
          </View>
          <View style={{ height: '100%', width: 1, backgroundColor: '#E5E9EB' }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <InterText weight={600} style={{ fontSize: 16, color: '#22C348' }}>
              {totalEarning}
              <InterText weight={500} style={{ fontSize: 10, color: '#252C32' }}>
                {' '}FSC
              </InterText>
            </InterText>
            <InterText weight={500} style={{ flex: 1, textAlign: 'center', fontSize: 12, color: '#252C32', marginTop: 4 }}>
              {t('card.cumulativeIncome')}
            </InterText>
          </View>
        </View>

        <View style={{ marginTop: 16, backgroundColor: '#FFFFFF', overflow: 'hidden', borderRadius: 12 }}>
          <TouchableOpacity style={[styles.section, { marginTop: 0 }]} onPress={() => navigation.navigate('MyCardsScreen')}>
            <>
              <InterText weight={500} style={{ fontSize: 16, color: '#252C32', flex: 1 }}>
                {t('card.myCards2')}
              </InterText>
              <Entypo name="chevron-thin-right" size={18} color="#1A2024" />
            </>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.underline} />
          <InterText weight={600} style={{ flex: 1, fontSize: 18, color: '#1A2024' }}>
            {t('card.get')}
          </InterText>
        </View>
      </View>
    </View>

  return (
    <>
      <FlatList
        data={cardList}
        renderItem={({item}) =>
          <CardBase key={item.title} {...item} onObtainPressed={() => tryObtainCard(item)} />
        }
        ListHeaderComponent={renderHeader}
        ListFooterComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={() =>
          !cardListLoaded ?
          <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0E73F6" />
          </View> : null
        }
      />

      <ObtainCardModal
        ref={obtainCardModalRef}
        refresh={() => {
          getCards()
          navigation.navigate('MyCardsScreen')
        }}
      />

      <LoadingModal visible={isLoading} />
    </>
  )
}

const memberNames = {
  '-1': 'card.member-new',
  '0': 'card.member-0',
  '1': 'card.member-1',
  '2': 'card.member-2',
  '3': 'card.member-3',
  '4': 'card.member-4',
  '5': 'card.member-5',
  '6': 'card.member-6',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF0F2',
  },
  splashWrap: {
    height: 1400,
    width: 1400,
    position: 'absolute',
    top: -1200,
    borderRadius: 700,
    alignSelf: 'center',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  splash: {
    backgroundColor: '#506FFE',
    height: 200,
  },
  section: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
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
})
