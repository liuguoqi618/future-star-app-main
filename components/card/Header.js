import React, { useContext } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { WorkSansText } from '../CustomText'
import { useNavigation } from '@react-navigation/native'
import { GlobalContext } from '../../context/GlobalContext'

const historyIcon = require('../../assets/images/Card/history.png')

export default function Header(props) {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const navigation = useNavigation()

  const [{ isLoggedIn }] = useContext(GlobalContext)

  return (
    <View style={[styles.topBar, { height: 60 + insets.top, paddingTop: insets.top }]}>
      <WorkSansText weight={700} style={{ flex: 1, fontSize: 22, color: '#303940' }}>
        {t('card.title')}
      </WorkSansText>
      { isLoggedIn ?
        <TouchableOpacity onPress={() => navigation.navigate('CardHistoryScreen')}>
          <Image source={historyIcon} style={{ height: 26, width: 26 }} />
        </TouchableOpacity> : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
  },
})
