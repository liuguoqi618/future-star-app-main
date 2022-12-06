import React, {useCallback, useContext, useRef, useState} from 'react'
import {ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import {useTranslation} from 'react-i18next'
import {useFocusEffect} from '@react-navigation/native'
import {getConversionRate, getWalletInfo} from '../../apis/wallet'
import { formatBalance } from '../../utils/numbers'
import { GlobalContext } from '../../context/GlobalContext'
import { getVerifyStatus } from '../../apis/verify'
import { getWalletSummary } from '../../apis/user'

import {InterText, PoppinsText} from '../../components/CustomText'
import CustomScreenHeader from '../../components/CustomScreenHeader'
import LoadingModal from '../../components/LoadingModal'
import VerifyModal from '../../components/wallet/VerifyModal'
import SelectCurrencySheet from '../../components/wallet/SelectCurrencySheet'

const fscpToken = require('../../assets/images/Wallet/fscp-token.png')
const fscToken = require('../../assets/images/Wallet/fsc-token.png')
const usdtToken = require('../../assets/images/Wallet/usdt-token.png')
const bnbToken = require('../../assets/images/Wallet/bnb-token.png')
const fscBack = require('../../assets/images/Wallet/fsc-background.png')
const usdtBack = require('../../assets/images/Wallet/usdt-background.png')
const bnbBack = require('../../assets/images/Wallet/bnb-background.png')

const actionConvert = require('../../assets/images/Wallet/action-convert.png');
const actionBuy = require('../../assets/images/Wallet/action-buy.png');
const actionWithdraw = require('../../assets/images/Wallet/action-withdraw-2.png');

export default function WalletScreen({navigation}) {
  const {t} = useTranslation()

  const [{}, dispatch] = useContext(GlobalContext)

  const [isLoading, setIsLoading] = useState(false)

  // 0: withdraw, 1: top up, else no action
  const [currencySelectMode, setCurrencySelectMode] = useState(-1)

  const [totalBalance, setTotalBalance] = useState(0)
  const [walletLoading, setWalletLoading] = useState(true)

  const [fscpBalance, setFscpBalance] = useState(0)
  const [fscBalance, setFscBalance] = useState(0)
  const [usdtBalance, setUsdtBalance] = useState(0)
  const [bnbBalance, setBnbBalance] = useState(0)

  const [FSCToUSDTRatio, setFSCToUSDTRatio] = useState(1)
  const [FSCToBNBRatio, setFSCToBNBRatio] = useState(1)

  const selectCurrencyRef = useRef()
  const verifyModalRef = useRef()

  useFocusEffect(
    useCallback(() => {
      getWalletSummary().then(result => {
        setTotalBalance(result.data.data.totalBalanceUSDT)
        setWalletLoading(false)
      }).catch(e => console.log(e))

      getWalletInfo().then(result => {
        let wallet = result.data.data
        setFscBalance(() => {
          let index = wallet.findIndex(w => w.currency === 'FSC')
          if (index >= 0) {
            return wallet[index].balance
          } else {
            return 0
          }
        })
        setUsdtBalance(() => {
          let index = wallet.findIndex(w => w.currency === 'USDT')
          if (index >= 0) {
            return wallet[index].balance
          } else {
            return 0
          }
        })
        setBnbBalance(() => {
          let index = wallet.findIndex(w => w.currency === 'BNB')
          if (index >= 0) {
            return wallet[index].balance
          } else {
            return 0
          }
        })
      }).catch(e => console.log(e))

      getConversionRate().then(result => {
        setFSCToUSDTRatio(result.data.data.FSCtoUSDTRatio)
        setFSCToBNBRatio(result.data.data.FSCtoBNBRatio)
      }).catch(e => console.log(e))
    }, []),
  )

  const onCurrencySelect = (currency) => {
    if (currencySelectMode === 0) {
      navigation.navigate('WithdrawScreen', { currency })
    } else if (currencySelectMode === 1) {
      navigation.navigate('TopUpScreen', { currency })
    }
  }

  return (
    <View style={styles.container}>
      <CustomScreenHeader title={t('wallet.title')} titleAlign="left" />

      <ScrollView>
        <View style={{ marginHorizontal: 12 }}>
          <LinearGradient
            colors={['#0EA2F6', '#0E73F6']}
            start={{x: 0, y: 0.5}}
            end={{x: 1, y: 0.5}}
            style={styles.banner}
          >
            <InterText style={{ fontSize: 12, color: '#FFFFFF' }}>
              {t('wallet.totalAssets')}
            </InterText>
            <View style={{flexDirection: 'row', alignItems: 'center' }}>
              { !walletLoading ?
                <InterText style={{ fontSize: 16, color: '#FFFFFF' }}>
                  ${' '}
                  <InterText weight={600} style={{ fontSize: 24, color: '#FFFFFF' }}>
                    {formatBalance(totalBalance, 100)}
                  </InterText>
                </InterText> :
                <View style={{ marginTop: 6 }}>
                  <ActivityIndicator color="#FFFFFF" />
                </View>
              }
            </View>
          </LinearGradient>

          <View>
            <View style={styles.actionBar}>
              <TouchableOpacity
                style={styles.action}
                onPress={async () => {
                  // setIsLoading(true)
                  // try {
                  //   const result = await getVerifyStatus()
                  //   setIsLoading(false)
                  //   if (result.data.data.status === 1) {
                      setCurrencySelectMode(0)
                      selectCurrencyRef.current.open()
                  //   } else {
                  //     verifyModalRef.current.show()
                  //   }
                  //   dispatch({
                  //     type: 'SET_VERIFICATION_STATUS',
                  //     data: {
                  //       verificationStatus: result.data.data,
                  //     },
                  //   })
                  // } catch (e) {
                  //   console.log(e)
                  // }
                }}>
                <Image
                  source={actionWithdraw}
                  style={{height: 20, width: 20}}
                />
                <InterText
                  weight={600}
                  style={{marginLeft: 3, fontSize: 14, color: '#1A2024'}}>
                  {t('wallet.withdraw')}
                </InterText>
              </TouchableOpacity>
              <View style={{width: 1, height: 20, backgroundColor: '#E5E9EB'}} />
              <TouchableOpacity
                style={styles.action}
                onPress={() => {
                  setCurrencySelectMode(1)
                  selectCurrencyRef.current.open()
                  // navigation.navigate('TopUpScreen', {currency: 'FSC'})
                }}>
                <Image source={actionBuy} style={{height: 20, width: 20}} />
                <InterText
                  weight={600}
                  style={{marginLeft: 3, fontSize: 14, color: '#1A2024'}}>
                  {t('wallet.topUp')}
                </InterText>
              </TouchableOpacity>
              <View style={{ width: 1, height: 20, backgroundColor: '#E5E9EB'}} />
              <TouchableOpacity
                style={styles.action}
                // onPress={() => convertSheetRef.current.open()}
              >
                <Image
                  source={actionConvert}
                  style={{height: 20, width: 20}}
                />
                <InterText
                  weight={600}
                  style={{marginLeft: 3, fontSize: 14, color: '#1A2024'}}>
                  {t('wallet.convert')}
                </InterText>
              </TouchableOpacity>
            </View>
          </View>

          <InterText weight={600} style={{ marginTop: 24, fontSize: 18, color: '#1A2024' }}>
            {t('wallet.assets')}
          </InterText>

          <View style={styles.viewWrap}>
            <TouchableOpacity style={styles.currencyItem}>
              <>
                <Image source={fscpToken} style={{ height: 44, width: 44 }} />
                <InterText weight={600} style={{ marginHorizontal: 12, flex: 1, fontSize: 14, color: '#252C32' }}>
                  {t('wallet.starPoints')}
                </InterText>
                <View>
                  <InterText weight={600} style={{ textAlign: 'right', fontSize: 16, color: '#252C32' }}>
                    {fscpBalance}
                  </InterText>
                  <InterText style={{ textAlign: 'right', fontSize: 12, color: '#828282' }}>
                    ≈ $XXXX
                  </InterText>
                </View>
              </>
            </TouchableOpacity>
          </View>

          <View style={styles.viewWrap}>
            <TouchableOpacity style={styles.currencyItem} onPress={() => navigation.navigate('FSCScreen')}>
              <>
                <Image source={fscToken} style={{ height: 44, width: 44 }} />
                <InterText weight={600} style={{ marginHorizontal: 12, flex: 1, fontSize: 14, color: '#252C32' }}>
                  FSC
                </InterText>
                <View>
                  <InterText weight={600} style={{ textAlign: 'right', fontSize: 16, color: '#252C32' }}>
                    {formatBalance(fscBalance)}
                  </InterText>
                  <InterText style={{ textAlign: 'right', fontSize: 12, color: '#828282' }}>
                    ≈ ${formatBalance(fscBalance * FSCToUSDTRatio)}
                  </InterText>
                </View>
              </>
            </TouchableOpacity>
          </View>

          <View style={styles.viewWrap}>
            <TouchableOpacity style={styles.currencyItem} onPress={() => navigation.navigate('USDTScreen')}>
              <>
                <Image source={usdtToken} style={{ height: 44, width: 44 }} />
                <InterText weight={600} style={{ marginHorizontal: 12, flex: 1, fontSize: 14, color: '#252C32' }}>
                  USDT
                </InterText>
                <View>
                  <InterText weight={600} style={{ textAlign: 'right', fontSize: 16, color: '#252C32' }}>
                    {formatBalance(usdtBalance, 100)}
                  </InterText>
                  <InterText style={{ textAlign: 'right', fontSize: 12, color: '#828282' }}>
                    ≈ ${formatBalance(usdtBalance, 100)}
                  </InterText>
                </View>
              </>
            </TouchableOpacity>
          </View>

          <View style={styles.viewWrap}>
            <TouchableOpacity style={styles.currencyItem} onPress={() => navigation.navigate('BNBScreen')}>
              <>
                <Image source={bnbToken} style={{ height: 44, width: 44 }} />
                <InterText weight={600} style={{ marginHorizontal: 12, flex: 1, fontSize: 14, color: '#252C32' }}>
                  BNB
                </InterText>
                <View>
                  <InterText weight={600} style={{ textAlign: 'right', fontSize: 16, color: '#252C32' }}>
                    {formatBalance(bnbBalance)}
                  </InterText>
                  <InterText style={{ textAlign: 'right', fontSize: 12, color: '#828282' }}>
                    ≈ ${formatBalance(bnbBalance * FSCToUSDTRatio / FSCToBNBRatio)}
                  </InterText>
                </View>
              </>
            </TouchableOpacity>
          </View>

          {/* <Pressable onPress={() => navigation.navigate('FSCScreen')}>
            <LinearGradient
              colors={['#0EA2F6', '#0E73F6']}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={styles.card}
            >
              <Image source={fscBack} style={styles.back} />
              <Image source={fscToken} style={{height: 35, width: 35}} />
              <View style={{marginTop: 8}}>
                <PoppinsText weight={600} style={styles.desc}>
                  {t('wallet.fscBalance')}
                </PoppinsText>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                  <PoppinsText weight={700} style={styles.balance}>
                    {formatBalance(fscBalance)}
                  </PoppinsText>
                  <View style={{flex: 1}} />
                  <View style={styles.viewWrap}>
                    <TouchableOpacity
                      style={styles.view}
                      onPress={() => navigation.navigate('FSCScreen')}>
                      <InterText
                        weight={600}
                        style={{fontSize: 14, color: '#0E73F6'}}>
                        {t('wallet.view')}
                      </InterText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Pressable> */}

          {/* <Pressable onPress={() => navigation.navigate('USDTScreen')}>
            <LinearGradient
              colors={['#74E1C2', '#53AE94']}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={styles.card}>
              <Image source={usdtBack} style={styles.back} />
              <Image source={usdtToken} style={{height: 35, width: 35}} />
              <View style={{marginTop: 8}}>
                <PoppinsText weight={600} style={styles.desc}>
                  {t('wallet.usdtBalance')}
                </PoppinsText>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                  <PoppinsText weight={700} style={styles.balance}>
                    {formatBalance(usdtBalance)}
                  </PoppinsText>
                  <View style={{flex: 1}} />
                  <View style={styles.viewWrap}>
                    <TouchableOpacity
                      style={styles.view}
                      onPress={() => navigation.navigate('USDTScreen')}>
                      <InterText
                        weight={600}
                        style={{fontSize: 14, color: '#50AF95'}}>
                        {t('wallet.view')}
                      </InterText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Pressable> */}

          {/* <Pressable onPress={() => navigation.navigate('BNBScreen')}>
            <LinearGradient
              colors={['#FFD774', '#F3BA2F']}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={styles.card}>
              <Image source={bnbBack} style={[styles.back, { width: 123, height: 123, right: -20, bottom: -20 }]} />
              <Image source={bnbToken} style={{height: 35, width: 35}} />
              <View style={{marginTop: 8}}>
                <PoppinsText weight={600} style={styles.desc}>
                  {t('wallet.bnbBalance')}
                </PoppinsText>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                  <PoppinsText weight={700} style={styles.balance}>
                    {formatBalance(bnbBalance)}
                  </PoppinsText>
                  <View style={{flex: 1}} />
                  <View style={styles.viewWrap}>
                    <TouchableOpacity
                      style={styles.view}
                      onPress={() => navigation.navigate('BNBScreen')}>
                      <InterText
                        weight={600}
                        style={{fontSize: 14, color: '#F3BA2F'}}>
                        {t('wallet.view')}
                      </InterText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Pressable> */}
        </View>
      </ScrollView>

      <SelectCurrencySheet
        ref={selectCurrencyRef}
        onSelect={onCurrencySelect}
      />

      <VerifyModal
        ref={verifyModalRef}
        onConfirm={() => {
          verifyModalRef.current.hide()
          navigation.navigate('VerificationScreen')
        }}
      />

      <LoadingModal visible={isLoading} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF0F2',
  },
  banner: {
    height: 90,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: 16,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  action: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewWrap: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  currencyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
