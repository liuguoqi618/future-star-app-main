import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { ActivityIndicator, Modal, Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

import { InterText } from '../CustomText'
import { purchaseCard } from '../../apis/card'

const ObtainCardModal = forwardRef(({ refresh }, ref) => {
  const { t, i18n } = useTranslation()
  const { width } = useWindowDimensions()
  const navigation = useNavigation()

  const [visible, setIsVisible] = useState(false)
  const [card, setCard] = useState()
  const [requirements, setRequirements] = useState(0)
  const [state, setState] = useState(0)

  useImperativeHandle(ref, () => ({
    show, hide,
  }))

  const show = (c, r) => {
    setState(0)
    setCard(c)
    setRequirements(r)
    setIsVisible(true)
  }
  const hide = () => {
    setState(0)
    setCard(null)
    setRequirements(0)
    setIsVisible(false)
  }

  const onConfirm = async () => {
    if (state === 0) {
      setState(-1)
      if (requirements.balance < card.cost) {
        setState(2)
      } else if (requirements.requirement && !requirements.requirement.requirementMet) {
        setState(3)
      } else {
          try {
            await purchaseCard(card.level)
            setState(1)
          } catch (e) {
            console.log(e)
            hide()
            Toast.show({ type: 'error', text1: t('card.error1') })
          }
        }
    } else if (state === 1) {
      hide()
      if (refresh) {
        refresh()
      }
    } else if (state === 2) {
      hide()
      navigation.navigate('TopUpScreen', { currency: 'FSC' })
    } else if (state === 3) {
      hide()
      navigation.navigate('InviteScreen')
    }
  }

  const titles = [
    'card.confirmBuy',
    'card.obtainedSuccess',
    'card.insufficientFSC',
    'card.insufficientMember',
  ]

  const descriptions = [
    'card.confirmBuyDesc',
    'card.obtainedSuccessDesc',
    'card.insufficientFSCDesc',
    'card.insufficientMemberDesc',
  ]

  const confirmText = [
    'card.yes',
    'card.okay',
    'card.topUp',
    'card.inviteFriends',
  ]

  if (!card) {
    return null
  }

  return (
    <Modal transparent visible={visible}>
      <Pressable style={styles.background}>
        { state !== -1 ?
          <View style={[styles.container, { width: width - 40 }]}>
            <InterText weight={600} style={{ fontSize: 16, color: '#252C32', textAlign: 'center' }}>
              {t(titles[state], { cost: card.cost })}
            </InterText>

            <View>
              <View style={{ marginTop: 12 }}>
                <InterText style={{ fontSize: 14, color: '#5B6871', textAlign: 'center' }}>
                  {t(descriptions[state], {
                    cost: card.cost,
                    earning: card.total_supply,
                    days: card.effective_days,
                    member: card.requirement ? t('card.memberReq2', {
                      users: ['en', 'zhch'].includes(i18n.language) ?
                        t(numberToWord[card.requirement.number]).toLocaleLowerCase() :
                        card.requirement.number,
                      star: card.requirement.level,
                      plural: card.requirement.level === 1 ? '' : 's',
                    }) : '',
                    member2: card.requirement ? t('card.memberReq2', {
                      users: ['en', 'zhch'].includes(i18n.language) ?
                        t(numberToWord[card.requirement.number]).toLocaleLowerCase() :
                        card.requirement.number,
                      star: card.requirement.level,
                      plural: card.requirement.level === 1 ? '' : 's',
                    }) : '',
                  })}
                </InterText>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.confirm} onPress={onConfirm}>
                  <InterText weight={600} style={{ fontSize: 14, color: '#FFFFFF' }}>
                    {t(confirmText[state])}
                  </InterText>
                </TouchableOpacity>
              </View>
              { state !== 1 ?
                <TouchableOpacity onPress={hide}>
                  <InterText weight={600} style={{ marginTop: 12, fontSize: 14, color: '#5B6871', textAlign: 'center' }}>
                    {t('card.cancel')}
                  </InterText>
                </TouchableOpacity> : null
              }
            </View>
          </View> :
          <ActivityIndicator size="large" color="#0E73F6" />
        }
      </Pressable>
    </Modal>
  )
})

export default ObtainCardModal

const numberToWord = ['word.Zero', 'word.One', 'word.Two', 'word.Three', 'word.Four', 'word.Five', 'word.Six', 'word.Seven', 'word.Eight', 'word.Nine' ]

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(125, 125, 125, 0.5)',
  },
  container: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 16,
  },
  confirm: {
    flexDirection: 'row',
    backgroundColor: '#0E73F6',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 24,
    flex: 1,
  },
})
