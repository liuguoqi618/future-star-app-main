import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

import { WorkSansText } from '../CustomText'

export default function Header() {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()

  return (
    <View style={[styles.topBar, { height: 60 + insets.top, paddingTop: insets.top }]}>
      <WorkSansText weight={700} style={{ flex: 1, fontSize: 22, color: '#303940' }}>
        {t('wallet.title')}
      </WorkSansText>
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
