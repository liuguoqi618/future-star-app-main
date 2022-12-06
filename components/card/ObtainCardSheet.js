import React from 'react'
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import { InterText } from '../CustomText'
import { AntDesign } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'

const tokenIcon = require('../../assets/images/Card/token.png')
const memberIcon = require('../../assets/images/Card/member.png')
const starIcon = require('../../assets/images/Card/star.png')
const starGreyIcon = require('../../assets/images/Card/star-grey.png')

const ObtainCardSheet = React.forwardRef((props, ref) => {
  const { card, requirements, purchase } = props
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()

  return (
    <RBSheet
      ref={ref}
      customStyles={{ container: styles.sheetContainer }}
      animationType="slide"
      keyboardAvoidingViewEnabled
    >
      <View style={styles.sheetHeader}>
        <InterText weight={600} style={{ fontSize: 16, color: '#1A2024' }}>
          {t('card.obtainCard')}
        </InterText>
        <TouchableOpacity
          onPress={() => ref.current.close()}
          style={{ position: 'absolute', right: 20 }}
        >
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      { card ?
        <>
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.greyWrapper}>
                { card.level === 0 ?
                  <Image source={starGreyIcon} style={{ height: 12, width: 12 }} /> : null
                }
                { Array.from(Array(card.level).keys()).map(s =>
                  <Image key={s} source={starIcon} style={{ height: 12, width: 12 }} />
                )}
              </View>
              <View style={[styles.greyWrapper, { marginLeft: 8 }]}>
                <InterText weight={500} style={{ fontSize: 12, color: '#1A2024' }}>
                  {t('card.remaining', { remaining: card.max_acquire - card.cardPurchased, total: card.max_acquire })}
                </InterText>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <InterText weight={600} style={{ fontSize: 16, color: '#252C32' }}>
                {t(card.star > 0 ? 'card.cardDesc' : 'card.cardDesc_zero', { star: card.level })}
              </InterText>
              <InterText weight={500} style={{ marginLeft: 5, fontSize: 12 ,color: '#1A2024' }}>
                {t('card.dailyProd', { dailyProd: card.daily_supply })}
              </InterText>
            </View>
          </View>
          <View style={{ padding: 20 }}>
            <InterText weight={600} style={{ fontSize: 12, color: '#1A2024' }}>
              {t('card.cardReq')}
            </InterText>
            <View style={styles.shadow}>
              <View style={styles.requirement}>
                <Image source={tokenIcon} style={{ height: 34, width: 34 }} />
                <View style={{ marginLeft: 8 }}>
                  <InterText weight={600} style={{ fontSize: 14, color: '#303940' }}>
                    {card.cost}
                  </InterText>
                  { requirements.balance < card.cost ?
                    <InterText weight={500} style={{ fontSize: 12, color: '#F2271C' }}>
                      {t('card.noFunds')}
                    </InterText> : null
                  }
                </View>
              </View>
              { requirements.balance < card.cost ?
                <Pressable style={styles.action} onPress={() => {
                  ref.current.close()
                  navigation.navigate('Wallet')
                }}>
                  <InterText weight={600} style={{ fontSize: 14, color: '#FFFFFF' }}>
                    {t('card.buyCoin')}
                  </InterText>
                </Pressable> : null
              }
            </View>
            { card.requirement ?
              <View style={styles.shadow}>
                <View style={styles.requirement}>
                  <Image source={memberIcon} style={{ height: 34, width: 34 }} />
                  <View style={{ marginLeft: 8 }}>
                    <InterText weight={600} style={{ fontSize: 14, color: '#303940' }}>
                      {t('card.memberReq2', {
                        users: card.requirement.number,
                        star: ['en', 'zhch'].includes(i18n.language) ? t(numberToWord[card.requirement.level]) : card.requirement.level,
                        plural: card.requirement.level === 1 ? '' : 's',
                      })}
                    </InterText>
                    { requirements.requirement && !requirements.requirement.requirementMet ?
                      <InterText weight={500} style={{ fontSize: 12, color: '#F2271C' }}>
                        {t('card.noMembers')}
                      </InterText> : null
                    }
                  </View>
                </View>
                { requirements.requirement && !requirements.requirement.requirementMet ?
                  <Pressable style={styles.action} onPress={() => {
                    ref.current.close()
                    navigation.navigate('InviteScreen')
                  }}>
                    <InterText weight={600} style={{ fontSize: 14, color: '#FFFFFF' }}>
                      {t('card.invite')}
                    </InterText>
                  </Pressable> : null
                }
              </View> : null
            }
            <TouchableOpacity
              style={[
                styles.confirm,
                (
                  (requirements.balance < card.cost) ||
                  (requirements.requirement && !requirements.requirement.requirementMet)
                ) && styles.disabled,
              ]}
              onPress={() => purchase(card.level)}
              disabled={
                (requirements.balance < card.cost) ||
                (requirements.requirement && !requirements.requirement.requirementMet)
              }
            >
              <InterText weight={600} style={{ fontSize: 16, color: '#FFFFFF' }}>
                {t('card.confirm')}
              </InterText>
            </TouchableOpacity>
          </View>
        </> : null
      }
    </RBSheet>
  )
})

const numberToWord = ['word.Zero', 'word.One', 'word.Two', 'word.Three', 'word.Four', 'word.Five', 'word.Six', 'word.Seven', 'word.Eight', 'word.Nine' ]

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 'auto',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    paddingVertical: 16,
    borderBottomColor: '#EEF0F2',
    borderBottomWidth: 1,
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
  section: {
    borderBottomColor: '#EEF0F2',
    borderBottomWidth: 1,
    padding: 20,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  requirement: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  action: {
    backgroundColor: '#0E73F6',
    justifyContent: 'center',
    alignItems: 'center',
    height: 34,
  },
  confirm: {
    backgroundColor: '#0E73F6',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  disabled: {
    backgroundColor: '#B0BABF',
  },
})

export default ObtainCardSheet
