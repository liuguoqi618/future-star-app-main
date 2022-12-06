import React, { useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { languageOptions, storeLocale } from '../locale'

import { InterText, WorkSansText } from '../components/CustomText'
import DropDownPicker from '../components/DropDownPicker'

export default function SetLanguageScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { t, i18n } = useTranslation()

  const dropDownRef = useRef()
  const [language, setLanguage] = useState('en')

  const onReadyPressed = () => {
    storeLocale(language)
    i18n.changeLanguage(language)
    navigation.replace('Main')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={{ flex: 1 }} />

      <WorkSansText weight={700} style={{ fontSize: 22, color: '#303940' }}>
        {t('language.set')}
      </WorkSansText>

      <View style={{ marginTop: 16, paddingHorizontal: 20, width: '100%' }}>
        <DropDownPicker
          ref={dropDownRef}
          value={language}
          setValue={setLanguage}
          options={languageOptions}
        />
      </View>

      <View style={{ flex: 2 }} />

      <TouchableOpacity style={styles.ready} onPress={onReadyPressed}>
        <InterText weight={600} style={{ marginLeft: 8, fontSize: 16, color: '#FFFFFF' }}>
          {t('language.ready')}
        </InterText>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  filter: {
    height: 40,
    minHeight: 40,
    borderColor: '#DDE2E4',
    borderRadius: 4,
  },
  filterText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#303940',
  },
  filterPlaceholder: {
    color: '#84919A',
  },
  filterDropdown: {
    borderColor: '#DDE2E4',
    borderRadius: 4,
  },
  ready: {
    flexDirection: 'row',
    backgroundColor: '#0E73F6',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: '75%',
  },
})
