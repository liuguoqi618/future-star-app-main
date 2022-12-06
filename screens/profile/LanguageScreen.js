import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { languageOptions, storeLocale } from '../../locale'
import { AntDesign } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import CustomScreenHeader from '../../components/CustomScreenHeader'
import { InterText } from '../../components/CustomText'

export default function LanguageScreen({ navigation }) {
  const { t, i18n } = useTranslation()
  const insets = useSafeAreaInsets()

  const changeLanguage = (l) => {
    storeLocale(l)
    i18n.changeLanguage(l)
    navigation.goBack()
  }

  return (
    <ScrollView style={styles.container}>
      <CustomScreenHeader title={t('profile.changeLanguage')} />

      {languageOptions.map(l =>
        <TouchableOpacity key={l.value} disabled={i18n.language === l.value} onPress={() => changeLanguage(l.value)}>
          <View style={styles.item}>
            <InterText weight={600} style={{ flex: 1, fontSize: 16, color: '#3C464E' }}>
              {l.label}
            </InterText>
            { i18n.language === l.value ?
              <AntDesign name="checkcircle" size={20} color="#22C348" /> : null
            }
          </View>
        </TouchableOpacity>
      )}

      <View style={{ height: insets.bottom }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 12,
  },
})
