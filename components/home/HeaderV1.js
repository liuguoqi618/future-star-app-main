import React, { useContext, useRef } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import medals from '../../utils/medals'
import { AntDesign } from '@expo/vector-icons';

import {GlobalContext} from '../../context/GlobalContext';
import {InterText} from '../CustomText';
import LoginModal from '../LoginModal';

export default function Header() {
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();
  const navigation = useNavigation();

  const [{ isLoggedIn, starLevel }] = useContext(GlobalContext);

  const loginRef = useRef()

  return (
    <View style={[
      styles.topBar,
      {height: 60 + insets.top, paddingTop: insets.top},
    ]}>
      { isLoggedIn && starLevel >= 0 ?
        <Image
          source={medals[starLevel]}
          style={{ height: 34, width: 26 }}
        /> :
        <View />
      }
      <TouchableOpacity onPress={() => {
        if (!isLoggedIn) {
          loginRef.current.show()
        } else {
          navigation.navigate('Card')
        }
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <InterText style={{ textAlign: 'right', fontSize: 12, color: '#48535B', marginRight: 3 }}>
            {t('homeV1.upgradeStar')}
          </InterText>
          <AntDesign name="arrowright" size={16} color="#48535B" />
        </View>
      </TouchableOpacity>

      <LoginModal ref={loginRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
    justifyContent: 'space-between',
  },
  topBarLogin: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: '#0E73F6',
    borderRadius: 100,
  },
});
