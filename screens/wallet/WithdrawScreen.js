import React, {useRef, useState, useEffect} from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useTranslation} from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import StorageKey from '../../constants/storage'
import {AntDesign} from '@expo/vector-icons'
import {
  getWithdrawFee,
  getWalletInfo,
  withdrawUSDT,
  withdrawBNB,
  withdrawFSC,
} from '../../apis/wallet'
import { formatBalance } from '../../utils/numbers'

import {InterText} from '../../components/CustomText'
import CustomScreenHeader from '../../components/CustomScreenHeader'
import ModalBase from '../../components/ModalBase'
import ScanSheet from '../../components/wallet/ScanSheet'
import { BarCodeScanner } from 'expo-barcode-scanner'

const fscToken = require('../../assets/images/Wallet/fsc-token.png')
const usdtToken = require('../../assets/images/Wallet/usdt-token.png')
const bnbToken = require('../../assets/images/Wallet/bnb-token.png')
const withdrawArrow = require('../../assets/images/Wallet/withdraw-arrow.png')
const minimumIcon = require('../../assets/images/Wallet/minimum.png')
const reminderIcon = require('../../assets/images/Wallet/reminder.png')
const scanIcon = require('../../assets/images/Wallet/scan-qr.png')

export default function WithdrawScreen({navigation, route}) {
  const { currency } = route.params
  const {t} = useTranslation()
  const insets = useSafeAreaInsets()

  const [showReminder, setShowReminder] = useState(false)

  const [balance, setBalance] = useState(0)
  const [withdrawFee, setWithdrawFee] = useState(0)
  const [minFee, setMinFee] = useState(0)
  const [minWithdraw, setMinWithdraw] = useState(0)

  // const [usdtBalance, setUsdtBalance] = useState(0)
  // const [USDTWithdrawFee, setUSDTWithdrawFee] = useState(0)

  const [amount, setAmount] = useState(0)
  const [address, setAddress] = useState('')

  const withdrawModalRef = useRef()
  const scanSheetRef = useRef()

  const currencies = {
    FSC: { id: 'FSC', image: fscToken, text: 'wallet.fscBalance2' },
    USDT: { id: 'USDT', image: usdtToken, text: 'wallet.usdtBalance2' },
    BNB: { id: 'BNB', image: bnbToken, text: 'wallet.bnbBalance2' },
  }

  const amountValid =
    Number(amount).toString() === amount &&
    !isNaN(Number(amount)) &&
    Number(amount) > 0 &&
    Number(amount) <= balance;

  const canConfirm = amountValid &&
    (Number(amount) >= minWithdraw) &&
    (withdrawFee > 0 || minFee > 0)

  useEffect(() => {
    getWalletInfo().then(result => {
      let wallet = result.data.data
      setBalance(() => {
        let index = wallet.findIndex(w => w.currency === currency)
        if (index >= 0) {
          return wallet[index].balance
        } else {
          return 0
        }
      })
    }).catch(e => console.log(e))

    getWithdrawFee().then(result => {
      if (currency === 'BNB') {
        setWithdrawFee(Number(result.data.data.BNBWithdrawFee))
        setMinFee(Number(result.data.data.MinBNBWithdrawFee))
        setMinWithdraw(Number(result.data.data.MINBNBWithdraw))
      } else if (currency === 'USDT') {
        setWithdrawFee(Number(result.data.data.USDTWithdrawFlatFee))
        setMinFee(Number(result.data.data.USDTWithdrawFlatFee))
        setMinWithdraw(Number(result.data.data.MINUSDTWithdraw))
      } else if (currency === 'FSC') {
        setWithdrawFee(Number(result.data.data.FSCWithdrawFee))
        setMinFee(Number(result.data.data.MinFSCWithdrawFee))
        setMinWithdraw(Number(result.data.data.MINFSCWithdraw))
      }
    }).catch(e => console.log(e))


    if (currency === 'USDT') {
      AsyncStorage.getItem(StorageKey.USDT_WITHDRAW_MINIMUM_REMINDER).then(value => {
        if (!value) {
          setShowReminder(true)
        }
      })
    } else if (currency === 'BNB') {
      AsyncStorage.getItem(StorageKey.BNB_WITHDRAW_MINIMUM_REMINDER).then(value => {
        if (!value) {
          setShowReminder(true)
        }
      })
    } else if (currency === 'FSC') {
      AsyncStorage.getItem(StorageKey.FSC_WITHDRAW_MINIMUM_REMINDER).then(value => {
        if (!value) {
          setShowReminder(true)
        }
      })
    }
  }, [currency])

  const closeReminder = () => {
    if (currency === 'USDT') {
      AsyncStorage.setItem(StorageKey.USDT_WITHDRAW_MINIMUM_REMINDER, 'CLOSED').then(
        () => setShowReminder(false),
      )
    } else if (currency === 'BNB') {
      AsyncStorage.setItem(StorageKey.BNB_WITHDRAW_MINIMUM_REMINDER, 'CLOSED').then(
        () => setShowReminder(false),
      )
    } else if (currency === 'FSC') {
      AsyncStorage.setItem(StorageKey.FSC_WITHDRAW_MINIMUM_REMINDER, 'CLOSED').then(
        () => setShowReminder(false),
      )
    }
  }

  const tryConfirm = async () => {
    try {
      withdrawModalRef.current.show()
      if (currency === 'BNB') {
        await withdrawBNB(amount, address.trim())
      } else if (currency === 'USDT') {
        await withdrawUSDT(amount, address.trim())
      } else if (currency === 'FSC') {
        await withdrawFSC(amount, address.trim())
      }
      withdrawModalRef.current.finishLoading()
    } catch (err) {
      console.log(err)
    }
  }

  const tryScan = async () => {
    BarCodeScanner.requestPermissionsAsync().then(result => {
      if (result.status === 'granted') {
        scanSheetRef.current.open()
      }
    })
  }

  return (
    <ScrollView style={styles.container}>
      <CustomScreenHeader title={t('wallet.withdraw')} />

      {showReminder ? (
        <View style={styles.reminder}>
          <Image source={reminderIcon} style={{height: 24, width: 24}} />
          <InterText
            weight={500}
            style={{
              flex: 1,
              marginHorizontal: 5,
              fontSize: 14,
              color: '#1A2024',
            }}>
            {t('wallet.reminder', { currency, minimum: minWithdraw })}
          </InterText>
          <TouchableOpacity onPress={closeReminder}>
            <AntDesign name="close" size={24} color="#B0BABF" />
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.withdraw}>
        <View style={styles.from}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <InterText style={{flex: 1, fontSize: 12, color: '#303940'}}>
              {t('wallet.from')}
            </InterText>
            <InterText style={{fontSize: 12, color: '#303940'}}>
              {t(currencies[currency].text, { balance: formatBalance(balance) })}
            </InterText>
          </View>
          <View
            style={{marginTop: 12, flexDirection: 'row', alignItems: 'center'}}>
            <Image source={currencies[currency].image} style={{height: 35, width: 35}} />
            <InterText
              weight={600}
              style={{marginHorizontal: 12, fontSize: 18, color: '#1A2024'}}>
              {currency}
            </InterText>
            <TextInput
              value={amount}
              onChangeText={(text) => setAmount(() => {
                if (text.slice(-1) === '.' || text.slice(-1) === '0') {
                  return text
                } else if (!isNaN(Number(text))) {
                  return (Math.trunc(100000 * Number(text)) / 100000).toString()
                } else {
                  return text
                }
              })}
              placeholder="0.00"
              placeholderTextColor="#9AA6AC"
              keyboardType="numeric"
              style={[
                styles.amount,
                {color: amountValid ? '#303940' : '#9AA6AC'},
              ]}
            />
          </View>
        </View>
        <View style={styles.arrow}>
          <Image source={withdrawArrow} style={styles.arrowIcon} />
        </View>
        <View style={styles.to}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <InterText style={{ flex: 1, fontSize: 12, color: '#303940'}}>
              {t('wallet.toWallet')}
            </InterText>
            <TouchableOpacity onPress={tryScan}>
              <Image source={scanIcon} style={{ height: 20, width: 20 }} />
            </TouchableOpacity>
          </View>
          <TextInput
            value={address}
            onChangeText={setAddress}
            multiline
            placeholder={t('wallet.inputAddress')}
            placeholderTextColor="#84919A"
            style={styles.address}
          />
        </View>
      </View>

      {amount < minWithdraw && ['USDT', 'BNB'].includes(currency) ? (
        <View
          style={{flexDirection: 'row', marginHorizontal: 12, marginTop: 16}}>
          <Image source={minimumIcon} style={{height: 23, width: 23}} />
          <InterText style={{fontSize: 12, color: '#F2271C'}}>
            {t('wallet.minimum', { currency, minimum: minWithdraw })}
          </InterText>
        </View>
      ) : null}

      <View style={styles.details}>
        <View style={styles.detail}>
          <InterText weight={500} style={{flex: 1, fontSize: 14}}>
            {t('wallet.processFee')}
          </InterText>
          <InterText weight={500} style={{fontSize: 14}}>
            { currency !== 'USDT' ?
              formatBalance(Math.max(minFee, amount * withdrawFee)) :
              formatBalance(minFee)
            } {currency}
          </InterText>
        </View>
        <View style={{height: 1, backgroundColor: '#EEF0F2'}} />
        <View style={styles.detail}>
          <InterText weight={500} style={{flex: 1, fontSize: 14}}>
            {t('wallet.remaining', { currency })}
          </InterText>
          <InterText weight={500} style={{fontSize: 14}}>
            {formatBalance(balance - amount)} {currency}
          </InterText>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.confirm, !canConfirm && styles.disabled]}
        onPress={tryConfirm}
        disabled={!canConfirm}>
        <InterText weight={600} style={{fontSize: 16, color: '#FFFFFF'}}>
          {t('wallet.confirm')}
        </InterText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancel}
        onPress={() => navigation.goBack()}>
        <InterText weight={600} style={{fontSize: 16, color: '#0E73F6'}}>
          {t('wallet.cancel')}
        </InterText>
      </TouchableOpacity>

      <View style={{height: insets.bottom}} />

      <ModalBase
        ref={withdrawModalRef}
        title={t('wallet.withdrawing', { currency })}
        description={t('wallet.withdrawingDesc', { currency })}
        onConfirm={() => {
          withdrawModalRef.current.hide()
          navigation.goBack()
        }}
      />

      <ScanSheet ref={scanSheetRef} setAddress={setAddress} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF0F2',
  },
  reminder: {
    marginHorizontal: 12,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
  },
  withdraw: {
    marginHorizontal: 12,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
  },
  from: {
    backgroundColor: '#EEF0F2',
    height: 91,
    padding: 12,
    borderRadius: 6,
  },
  amount: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    flex: 1,
    textAlign: 'right',
  },
  arrow: {
    height: 16,
    alignItems: 'center',
    zIndex: 99,
  },
  arrowIcon: {
    height: 32,
    width: 32,
    position: 'absolute',
    zIndex: 99,
    top: -8,
  },
  to: {
    backgroundColor: '#EEF0F2',
    height: 114,
    padding: 12,
    borderRadius: 6,
  },
  address: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#303940',

    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    flex: 1,
    borderRadius: 6,
    textAlignVertical: 'top',
  },
  details: {
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 12,
    marginTop: 16,
  },
  detail: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirm: {
    flexDirection: 'row',
    backgroundColor: '#0E73F6',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginHorizontal: 12,
  },
  cancel: {
    flexDirection: 'row',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 12,
  },
  disabled: {
    backgroundColor: '#B0BABF',
  },
})
