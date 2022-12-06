import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {formatBalance} from '../../utils/numbers';
import {
  getWalletInfo,
  getConversionRate,
  convertCurrency,
} from '../../apis/wallet';

import {InterText} from '../../components/CustomText';
import CustomScreenHeader from '../../components/CustomScreenHeader';
import ModalBase from '../../components/ModalBase';

const fscToken = require('../../assets/images/Wallet/fsc-token.png');
const usdtToken = require('../../assets/images/Wallet/usdt-token.png');
const bnbToken = require('../../assets/images/Wallet/bnb-token.png')
const convertIcon = require('../../assets/images/Wallet/convert.png');

export default function WithdrawScreen({ navigation, route }) {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const { currency1, currency2 } = route.params

  /*
    0: FSC -> USDT
    1: USDT -> FSC
    2: FSC -> BNB
    3: BNB -> FSC
  */
  const [mode, setMode] = useState(() => {
    if (currency1 === 'FSC') {
      if (currency2 === 'USDT') {
        return 0
      } else {
        return 2
      }
    }
    if (currency2 === 'FSC') {
      if (currency1 === 'USDT') {
        return 1
      } else {
        return 2
      }
    }
  })

  const [amount, setAmount] = useState(0)

  const [fscBalance, setFscBalance] = useState(0)
  const [usdtBalance, setUsdtBalance] = useState(0)
  const [bnbBalance, setBnbBalance] = useState(0)

  const [FSCToUSDTRatio, setFSCToUSDTRatio] = useState(0)
  const [FSCToBNBRatio, setFSCToBNBRatio] = useState(0)
  const [fscConvertFee, setFSCConvertFee] = useState(0)

  const configurations = [
    {
      currency1: 'FSC',
      currency2: 'USDT',
      ratio: FSCToUSDTRatio,
      fee: fscConvertFee,
      currency1Icon: fscToken,
      currency2Icon: usdtToken,
      currency1Text: 'wallet.fscBalance2',
      currency2Text: 'wallet.usdtBalance2',
      currency1Balance: fscBalance,
      currency2Balance: usdtBalance,
    },
    {
      currency1: 'USDT',
      currency2: 'FSC',
      ratio: FSCToUSDTRatio > 0 ? 1 / FSCToUSDTRatio : 0,
      fee: 0,
      currency1Icon: usdtToken,
      currency2Icon: fscToken,
      currency1Text: 'wallet.usdtBalance2',
      currency2Text: 'wallet.fscBalance2',
      currency1Balance: usdtBalance,
      currency2Balance: fscBalance,
    },
    {
      currency1: 'FSC',
      currency2: 'BNB',
      ratio: FSCToBNBRatio,
      fee: fscConvertFee,
      currency1Icon: fscToken,
      currency2Icon: bnbToken,
      currency1Text: 'wallet.fscBalance2',
      currency2Text: 'wallet.bnbBalance2',
      currency1Balance: fscBalance,
      currency2Balance: bnbBalance,
    },
    {
      currency1: 'BNB',
      currency2: 'FSC',
      ratio: FSCToBNBRatio > 0 ? 1 / FSCToBNBRatio : 0,
      fee: 0,
      currency1Icon: bnbToken,
      currency2Icon: fscToken,
      currency1Text: 'wallet.bnbBalance2',
      currency2Text: 'wallet.fscBalance2',
      currency1Balance: bnbBalance,
      currency2Balance: fscBalance,
    },
  ]

  const currentConfig = configurations[mode]

  const switchMode = [1, 0, 3, 2]

  const withdrawModalRef = useRef();

  const amountValid =
    Number(amount).toString() === amount &&
    !isNaN(Number(amount)) &&
    Number(amount) > 0 &&
    Number(amount) <= currentConfig.currency1Balance;

  useEffect(() => {
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
      setFSCConvertFee(result.data.data.FSCtoUSDTFee)
    }).catch(e => console.log(e))
  }, []);

  const tryConfirm = async () => {
    try {
      withdrawModalRef.current.show();
      await convertCurrency(currentConfig.currency1, currentConfig.currency2, Number(amount))
      withdrawModalRef.current.finishLoading();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <CustomScreenHeader title={t('wallet.convert')} />

      <View style={styles.withdraw}>
        <View style={styles.from}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <InterText style={{flex: 1, fontSize: 12, color: '#303940'}}>
              {t('wallet.from')}
            </InterText>
            <InterText style={{fontSize: 12, color: '#303940'}}>
              {t(currentConfig.currency1Text, {balance: formatBalance(currentConfig.currency1Balance)})}
            </InterText>
          </View>
          <View
            style={{marginTop: 12, flexDirection: 'row', alignItems: 'center'}}>
            <Image source={currentConfig.currency1Icon} style={{height: 35, width: 35}} />
            <InterText
              weight={600}
              style={{marginHorizontal: 12, fontSize: 18, color: '#1A2024'}}>
              {currentConfig.currency1}
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
          <Pressable style={styles.arrowIcon} onPress={() => {
            setAmount('0')
            setMode(m => switchMode[m])
          }}>
            <Image source={convertIcon} style={styles.arrowIcon} />
          </Pressable>
        </View>
        <View style={styles.to}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <InterText style={{flex: 1, fontSize: 12, color: '#303940'}}>
              {t('wallet.to')}
            </InterText>
            <InterText style={{fontSize: 12, color: '#303940'}}>
              {t(currentConfig.currency2Text, {balance: formatBalance(currentConfig.currency2Balance)})}
            </InterText>
          </View>
          <View
            style={{marginTop: 12, flexDirection: 'row', alignItems: 'center'}}>
            <Image source={currentConfig.currency2Icon} style={{height: 35, width: 35}} />
            <InterText
              weight={600}
              style={{marginHorizontal: 12, fontSize: 18, color: '#1A2024'}}>
              {currentConfig.currency2}
            </InterText>
            <InterText weight={600} style={styles.converted} numberOfLines={1}>
              {currentConfig.ratio > 0
                ? Math.trunc(1000000000 * (Number(amount) * (1 - currentConfig.fee) * currentConfig.ratio)) / 1000000000
                : 0}
            </InterText>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detail}>
          <InterText weight={500} style={{flex: 1, fontSize: 14}}>
            {t('wallet.processFee')}
          </InterText>
          <InterText weight={500} style={{ fontSize: 14 }}>
            {amountValid ? formatBalance(amount * currentConfig.fee) : 0} FSC
          </InterText>
        </View>
        <View style={{height: 1, backgroundColor: '#EEF0F2'}} />
        <View style={styles.detail}>
          <InterText weight={500} style={{flex: 1, fontSize: 14}}>
            {t('wallet.remainingFSC')}
          </InterText>
          <InterText weight={500} style={{fontSize: 14}}>
            { amountValid ?
              formatBalance(currentConfig.currency1Balance - amount) :
              formatBalance(currentConfig.currency1Balance)
            } FSC
          </InterText>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.confirm, !amountValid && styles.disabled]}
        onPress={tryConfirm}
        disabled={!amountValid}
      >
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
        title={t('wallet.convertingFSC', { currency: currentConfig.currency2 })}
        description={t('wallet.convertingFSCDesc', { currency1: currentConfig.currency1, currency2: currentConfig.currency2 })}
        onConfirm={() => {
          withdrawModalRef.current.hide();
          navigation.goBack();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF0F2',
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
    justifyContent: 'center',
    zIndex: 99,
  },
  arrowIcon: {
    height: 32,
    width: 32,
    position: 'absolute',
    zIndex: 99,
  },
  to: {
    backgroundColor: '#EEF0F2',
    height: 91,
    padding: 12,
    borderRadius: 6,
  },
  converted: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    flex: 1,
    textAlign: 'right',
    color: '#303940',
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
    marginHorizontal: 20,
  },
  disabled: {
    backgroundColor: '#B0BABF',
  },
});
