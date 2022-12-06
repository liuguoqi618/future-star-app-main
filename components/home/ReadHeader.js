import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

import { WorkSansText } from '../CustomText'

export default function Header() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { height: 56 + insets.top, paddingTop: insets.top }]}>
      <View style={{ marginHorizontal: 16, flex: 1 }}>
        <WorkSansText weight={700} style={{ textAlign: 'center', fontSize: 18, color: '#303940' }}>
          {t('read.headlines')}
        </WorkSansText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
    backgroundColor: '#FFFFFF',
  },
})
