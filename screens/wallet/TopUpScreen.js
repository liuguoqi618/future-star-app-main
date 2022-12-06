import {Entypo} from '@expo/vector-icons';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {InterText, WorkSansText} from '../../components/CustomText';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import {getTopUpAddress} from '../../apis/wallet';

const logo = require('../../assets/images/Wallet/logo.png');
const shareLogo = require('../../assets/images/Wallet/share.png');
const copyLogo = require('../../assets/images/Wallet/copy.png');
const warningIcon = require('../../assets/images/Wallet/warning.png');

export default function TopUpScreen({navigation, route}) {
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();
  const {currency} = route.params;

  const [address, setAddress] = useState('');

  useEffect(() => {
    getTopUpAddress(currency)
      .then(result => {
        setAddress(result.data.data.address);
      })
      .catch(e => console.log(e));
  }, [currency]);

  const shareAddress = () => {
    Share.share({
      message: address,
    });
  };

  const copyAddress = () => {
    Clipboard.setString(address);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors[currency],
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}>
      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => navigation.goBack()}>
          <Entypo name="chevron-thin-left" size={24} color="#FFFFFF" />
        </Pressable>
        <View style={{marginHorizontal: 16, flex: 1}}>
          <WorkSansText
            weight={700}
            style={{textAlign: 'center', fontSize: 18, color: '#FFFFFF'}}>
            {t('wallet.topUpTitle', {currency})}
          </WorkSansText>
        </View>
        <View style={{width: 30}} />
      </View>

      <ScrollView>
        <View style={styles.body}>
          <View style={styles.warning}>
            <Image source={warningIcon} style={{ width: 24, height: 24 }} />
            <InterText weight={500} style={{ marginLeft: 8, flex: 1, fontSize: 14, color: '#F2271C' }}>
              {t('wallet.topUpWarning')}
            </InterText>
          </View>
          {/* <InterText style={{fontSize: 14, color: '#84919A'}}>
            {t('wallet.topUpDesc')}
            <InterText style={{textDecorationLine: 'underline'}}>
              {t('wallet.customerService')}
            </InterText>
          </InterText> */}

          <View style={styles.qrCode}>
            {address ? (
              <QRCode value={address} size={160} />
            ) : (
              <ActivityIndicator size="large" color="#0E73F6" />
            )}
          </View>
        </View>
        <View style={styles.body2}>
          <View style={styles.address}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <InterText style={{fontSize: 12, color: '#84919A'}}>
                {t('wallet.address')}
              </InterText>
              <View style={styles.badge}>
                <InterText
                  weight={600}
                  style={{fontSize: 12, color: '#0452C8'}}>
                  BSC
                </InterText>
              </View>
            </View>
            <InterText
              style={{
                textAlign: 'center',
                marginHorizontal: 20,
                marginTop: 8,
                fontSize: 12,
                color: '#252C32',
              }}>
              {address}
            </InterText>
          </View>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={styles.action} onPress={shareAddress}>
              <>
                <Image source={shareLogo} style={{width: 16, height: 16}} />
                <InterText
                  style={{marginLeft: 5, fontSize: 14, color: '#252C32'}}>
                  {t('word.share')}
                </InterText>
              </>
            </TouchableOpacity>
            <TouchableOpacity style={styles.action} onPress={copyAddress}>
              <>
                <Image source={copyLogo} style={{width: 16, height: 16}} />
                <InterText
                  style={{marginLeft: 5, fontSize: 14, color: '#252C32'}}>
                  {t('word.copy')}
                </InterText>
              </>
            </TouchableOpacity>
          </View>
        </View>

        <Image
          source={logo}
          style={{marginTop: 24, width: 158, height: 48, alignSelf: 'center'}}
        />
      </ScrollView>
    </View>
  );
}

const colors = {
  FSC: '#4094F7',
  USDT: '#55B197',
  BNB: '#F4BC33',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 56,
  },
  body: {
    backgroundColor: '#F6F8F9',
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    marginHorizontal: 12,
    marginTop: 24,
    paddingVertical: 32,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  qrCode: {
    marginTop: 32,
    height: 200,
    width: 200,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body2: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  address: {
    backgroundColor: '#EEF0F2',
    borderRadius: 6,
    paddingVertical: 12,
    borderColor: '#EEF0F2',
    borderWidth: 1,
    alignItems: 'center',
  },
  badge: {
    borderColor: '#0452C8',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#D7EDFF',
    marginLeft: 3,
    paddingHorizontal: 3,
  },
  action: {
    marginTop: 16,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  warning: {
    backgroundColor: '#FED6CD',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
});
