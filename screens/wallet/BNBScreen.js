import React, {useCallback, useContext, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import moment from 'moment';
import {getTransactionRecord, getWalletInfo} from '../../apis/wallet';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {formatBalance} from '../../utils/numbers';
import { GlobalContext } from '../../context/GlobalContext';
import { getVerifyStatus } from '../../apis/verify';

import {InterText, PoppinsText} from '../../components/CustomText';
import CustomScreenHeader from '../../components/CustomScreenHeader';
import VerifyModal from '../../components/wallet/VerifyModal';

const bnbToken = require('../../assets/images/Wallet/bnb-token.png');
const actionConvert = require('../../assets/images/Wallet/action-convert.png');
const actionBuy = require('../../assets/images/Wallet/action-buy.png');
const actionWithdraw = require('../../assets/images/Wallet/action-withdraw-2.png');
const historyIcon = require('../../assets/images/Wallet/history.png');
const historyEarn = require('../../assets/images/Wallet/history-earn.png');
const historyConvert = require('../../assets/images/Wallet/history-convert.png');
const historyWithdraw = require('../../assets/images/Wallet/history-withdraw.png');

const pageSize = 10;

export default function FSCScreen({navigation}) {
  const {t} = useTranslation();

  const [{}, dispatch] = useContext(GlobalContext)

  const [bnbBalance, setBnbBalance] = useState(0);

  const [history, setHistory] = useState([]);
  const isScrolledBottom = useRef(false);
  const loadingNewPage = useRef(false);

  const [showLoader, setShowLoader] = useState(true)

  const verifyModalRef = useRef()

  useFocusEffect(
    useCallback(() => {
      getWalletInfo()
        .then(result => {
          let wallet = result.data.data;
          setBnbBalance(() => {
            let index = wallet.findIndex(w => w.currency === 'BNB');
            if (index >= 0) {
              return wallet[index].balance;
            } else {
              return 0;
            }
          });
        })
        .catch(e => console.log(e));

      getTransactionRecord({page: 1, size: pageSize, currency: 'BNB'})
        .then(result => {
          setHistory(result.data.data);
        })
        .catch(e => console.log(e));
    }, []),
  );

  const onMomentumScrollEnd = async () => {
    if (isScrolledBottom.current && !loadingNewPage.current) {
      try {
        // if (history.length % pageSize !== 0) {
        //   return;
        // }
        loadingNewPage.current = true;
        const result = await getTransactionRecord({
          page: Math.floor(history.length / pageSize) + 1,
          size: pageSize,
          currency: 'BNB',
        });
        setHistory(prev => {
          let arr = [...prev, ...result.data.data];
          return arr.filter(
            (v, i, a) => a.findIndex(v2 => v2._id === v._id) === i,
          );
        });
        if (result.data.data.length === 0) {
          setShowLoader(false)
        }
      } catch (e) {
        console.log(e);
      } finally {
        loadingNewPage.current = false;
      }
    }
  };

  const renderHistoryItem = ({item}) => {
    const typeExists = !!historyComponents[item.type];

    return (
      <View style={styles.item}>
        <View style={{height: 38, width: 38}}>
          {typeExists ? (
            <Image
              source={historyComponents[item.type].icon}
              style={{height: 38, width: 38, borderRadius: 19}}
            />
          ) : null}
        </View>
        <View style={{flex: 1, marginHorizontal: 12}}>
          <InterText
            weight={600}
            numberOfLines={1}
            style={{lineHeight: 16, fontSize: 14, color: '#1A2024'}}>
            {typeExists
              ? t(historyComponents[item.type].title, {
                  currency: 'BNB',
                  currencyTo: historyComponents[item.type].convertTo,
                  currencyFrom: historyComponents[item.type].convertFrom,
                })
              : ''}
          </InterText>
          <InterText
            weight={600}
            numberOfLines={1}
            style={{lineHeight: 20, fontSize: 12, color: '#828282'}}>
            {moment(new Date(item.createTime)).format('MMM D, YYYY')}
          </InterText>
        </View>
        <InterText
          weight={600}
          style={{
            fontSize: 12,
            color: typeExists ? historyComponents[item.type].color : '#0E73F6',
          }}>
          {formatBalance(item.amount)} BNB
        </InterText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CustomScreenHeader title={t('wallet.title')} titleAlign="left" />

      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        onScroll={({nativeEvent}) => {
          isScrolledBottom.current = isScrollToBottom(nativeEvent);
        }}
        onMomentumScrollEnd={onMomentumScrollEnd}
        ListHeaderComponent={() => (
          <>
            <LinearGradient
              colors={['#FFD774', '#F3BA2F']}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={styles.banner}>
              <PoppinsText weight={600} style={styles.desc}>
                {t('wallet.bnbBalance')}
              </PoppinsText>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={bnbToken} style={{height: 24, width: 24}} />
                <PoppinsText weight={700} style={styles.balance}>
                  {formatBalance(bnbBalance)}
                </PoppinsText>
              </View>
            </LinearGradient>

            <View>
              <View style={styles.actionBar}>
                <TouchableOpacity
                  style={styles.action}
                  onPress={() =>
                    navigation.navigate('ConvertScreen', {
                      currency1: 'BNB',
                      currency2: 'FSC',
                    })
                  }>
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
                <View
                  style={{width: 1, height: 20, backgroundColor: '#E5E9EB'}}
                />
                <TouchableOpacity
                  style={styles.action}
                  onPress={() => {
                    navigation.navigate('TopUpScreen', {currency: 'BNB'});
                  }}>
                  <Image source={actionBuy} style={{height: 20, width: 20}} />
                  <InterText
                    weight={600}
                    style={{marginLeft: 3, fontSize: 14, color: '#1A2024'}}>
                    {t('wallet.topUp')}
                  </InterText>
                </TouchableOpacity>
                <View
                  style={{width: 1, height: 20, backgroundColor: '#E5E9EB'}}
                />
                <TouchableOpacity
                  style={styles.action}
                  onPress={async () => {
                    const result = await getVerifyStatus()
                    if (result.data.data.status === 1) {
                      navigation.navigate('WithdrawScreen', {currency: 'BNB'})
                    } else {
                      verifyModalRef.current.show()
                    }
                    dispatch({
                      type: 'SET_VERIFICATION_STATUS',
                      data: {
                        verificationStatus: result.data.data,
                      },
                    })
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
              </View>
            </View>

            <View style={styles.history}>
              <Image source={historyIcon} style={{height: 20, width: 20}} />
              <InterText
                weight={600}
                style={{marginLeft: 3, fontSize: 12, color: '#1A2024'}}>
                {t('wallet.history')}
              </InterText>
            </View>
          </>
        )}
        ListFooterComponent={() =>
          <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
            { showLoader ? <ActivityIndicator color="#0E73F6" /> : null }
          </View>
        }
      />

      <VerifyModal
        ref={verifyModalRef}
        onConfirm={() => {
          verifyModalRef.current.hide()
          navigation.navigate('VerificationScreen')
        }}
      />
    </View>
  );
}

const isScrollToBottom = nativeEvent => {
  const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
};

const historyComponents = {
  deposit: {
    icon: historyEarn,
    title: 'wallet.topUpTitle',
    convertTo: '',
    convertFrom: 'FSC',
    color: '#0E73F6',
  },
  'FSC convert BNB': {
    icon: historyConvert,
    title: 'wallet.currencyConvertFrom',
    convertTo: '',
    convertFrom: 'FSC',
    color: '#119C2B',
  },
  'BNB convert FSC': {
    icon: historyConvert,
    title: 'wallet.currencyConvertTo',
    convertTo: 'FSC',
    convertFrom: '',
    color: '#1A2024',
  },
  'BNB Withdraw': {
    icon: historyWithdraw,
    title: 'wallet.currencyWithdraw',
    convertTo: '',
    convertFrom: '',
    color: '#1A2024',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF0F2',
  },
  banner: {
    height: 119,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  desc: {
    lineHeight: 27,
    fontSize: 18,
    color: '#FFFFFF',
  },
  balance: {
    marginLeft: 5,
    lineHeight: 36,
    fontSize: 24,
    color: '#FFFFFF',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  action: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  history: {
    height: 52,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  item: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
});
