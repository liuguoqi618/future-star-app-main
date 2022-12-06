import React, { useContext } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

import CustomScreenHeader from '../../components/CustomScreenHeader'
import { InterText } from '../../components/CustomText'
import { GlobalContext } from '../../context/GlobalContext'

export default function AccountScreen({ navigation }) {
  const { t } = useTranslation()
  const [{ email, phoneNumber, username }] = useContext(GlobalContext)

  return (
    <View style={styles.container}>
      <CustomScreenHeader title={t('profile.account')} />

      { email ?
        <View style={styles.menuItem}>
          <View style={{ flex: 1 }}>
            <InterText weight={600} style={{ fontSize: 14, color: '#3C464E' }}>
              {t('profile.email')}
            </InterText>
            <InterText style={{ fontSize: 16, color: '#3C464E' }}>
              {email}
            </InterText>
          </View>
        </View> : null
      }

      { phoneNumber ?
        <View style={styles.menuItem}>
          <View style={{ flex: 1 }}>
            <InterText weight={600} style={{ fontSize: 14, color: '#3C464E' }}>
              {t('profile.phoneNumber')}
            </InterText>
            <InterText style={{ fontSize: 16, color: '#3C464E' }}>
              {phoneNumber}
            </InterText>
          </View>
        </View> : null
      }

      <TouchableOpacity onPress={() => navigation.navigate('EditScreen')}>
        <View style={styles.menuItem}>
          <View style={{ flex: 1 }}>
            <InterText weight={600} style={{ fontSize: 14, color: '#3C464E' }}>
              {t('profile.name')}
            </InterText>
            <InterText style={{ fontSize: 16, color: '#3C464E' }}>
              {username}
            </InterText>
          </View>
          <Entypo name="chevron-thin-right" size={24} color="#5B6871" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ResetPasswordScreen')}>
        <View style={styles.menuItem}>
          <View style={{ flex: 1 }}>
            <InterText weight={600} style={{ fontSize: 14, color: '#3C464E' }}>
              {t('profile.password')}
            </InterText>
            <InterText style={{ fontSize: 16, color: '#3C464E' }}>
              ********
            </InterText>
          </View>
          <Entypo name="chevron-thin-right" size={24} color="#5B6871" />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 68,
    borderBottomColor: '#EEF0F2',
    borderBottomWidth: 1,
  },
})
