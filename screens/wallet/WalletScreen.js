import React, {useCallback, useState} from 'react'
import {Image, Pressable, StyleSheet, TouchableOpacity, View} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import {useTranslation} from 'react-i18next'
import {useFocusEffect} from '@react-navigation/native'
import {getWalletInfo} from '../../apis/wallet'
import { formatBalance } from '../../utils/numbers'

import {InterText, PoppinsText} from '../../components/CustomText'
import Header from '../../components/wallet/Header'
import CustomScreenHeader from '../../components/CustomScreenHeader'

const fscToken = require('../../assets/images/Wallet/fsc-token.png')
const usdtToken = require('../../assets/images/Wallet/usdt-token.png')
const bnbToken = require('../../assets/images/Wallet/bnb-token.png')
const fscBack = require('../../assets/images/Wallet/fsc-background.png')
const usdtBack = require('../../assets/images/Wallet/usdt-background.png')
const bnbBack = require('../../assets/images/Wallet/bnb-background.png')

export default function WalletScreen({navigation}) {
  const {t} = useTranslation()
  const [fscBalance, setFscBalance] = useState(0)
  const [usdtBalance, setUsdtBalance] = useState(0)
  const [bnbBalance, setBnbBalance] = useState(0)

  useFocusEffect(
    useCallback(() => {
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
    }, []),
  )

  return (
    <View style={styles.container}>
      <CustomScreenHeader title={t('wallet.title')} titleAlign="left" />

      <Pressable onPress={() => navigation.navigate('FSCScreen')}>
        <LinearGradient
          colors={['#0EA2F6', '#0E73F6']}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}
          style={styles.card}>
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
      </Pressable>

      <Pressable onPress={() => navigation.navigate('USDTScreen')}>
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
      </Pressable>

      <Pressable onPress={() => navigation.navigate('BNBScreen')}>
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
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  card: {
    marginTop: 20,
    marginHorizontal: 12,
    height: 138,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  back: {
    height: 105,
    width: 105,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  desc: {
    lineHeight: 27,
    fontSize: 18,
    color: '#FFFFFF',
  },
  balance: {
    lineHeight: 36,
    fontSize: 24,
    color: '#FFFFFF',
  },
  viewWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
  },
  view: {
    paddingHorizontal: 16,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
  },
})
