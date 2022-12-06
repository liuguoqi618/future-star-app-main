import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import CustomScreenHeader from '../../components/CustomScreenHeader'
import { InterText, WorkSansText } from '../../components/CustomText'

const telegramIcon = require('../../assets/images/Profile/telegram.png')
const whatsappIcon = require('../../assets/images/Profile/whatsapp.png')

const telegramContact = '@Future_Starweb3'
const telegramGroup = 'https://t.me/FutureStarweb'
const whatsappContact = '+18094657511'
const whatsappGroup = 'https://chat.whatsapp.com/BBeqMXRjKFcEKKs62mvXBi'

export default function ContactScreen({ navigation }) {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  return (
    <ScrollView style={styles.container}>
      <CustomScreenHeader title={t('profile.contactUs')} />

      <View style={styles.contact}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16  }}>
          <Image source={telegramIcon} style={{ width: 48, height: 48 }} />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <WorkSansText weight={600} style={{ fontSize: 18, color: '#2DA4DC' }}>
              {t('profile.contactTelegram')}
            </WorkSansText>
            <InterText style={{ fontSize: 14, color: '#000000' }}>
              {telegramContact}
            </InterText>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.join, { backgroundColor: '#29A0DA' }]}
          onPress={() => Linking.openURL(telegramGroup)}
        >
          <WorkSansText weight={600} style={{ fontSize: 16, color: '#FFFFFF' }}>
            {t('profile.joinTelegram')}
          </WorkSansText>
        </TouchableOpacity>
      </View>

      <View style={styles.contact}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16  }}>
          <Image source={whatsappIcon} style={{ width: 48, height: 48 }} />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <WorkSansText weight={600} style={{ fontSize: 18, color: '#25D366' }}>
              {t('profile.contactWhatsApp')}
            </WorkSansText>
            <InterText style={{ fontSize: 14, color: '#000000' }}>
              {whatsappContact}
            </InterText>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.join, { backgroundColor: '#25D366' }]}
          onPress={() => Linking.openURL(whatsappGroup)}
        >
          <WorkSansText weight={600} style={{ fontSize: 16, color: '#FFFFFF' }}>
            {t('profile.joinWhatsApp')}
          </WorkSansText>
        </TouchableOpacity>
      </View>

      <View style={{ height: insets.bottom }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contact: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
    overflow: 'hidden',
    marginTop: 24,
    marginHorizontal: 12,
  },
  join: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
})
