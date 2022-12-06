import React, { useContext, useEffect } from 'react'
import { Image, Share, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import Clipboard from '@react-native-clipboard/clipboard'

import { InterText, WorkSansText } from '../../components/CustomText'
import { GlobalContext } from '../../context/GlobalContext'
import { getInviteCode } from '../../apis/friend'

const earnTogetherIcon = require('../../assets/images/Friend/earn-together.png')

export default function InviteScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const [{ inviteCode }, dispatch] = useContext(GlobalContext)

  useEffect(() => {
    getInviteCode().then(result => {
      if (result.data.data.code) {
        dispatch({
          type: 'SET_INVITE_CODE',
          data: {
            inviteCode: result.data.data.code,
          },
        })
      }
    })
  }, [dispatch])

  const shareCode = async () => {
    try {
      await Share.share({ message: inviteCode })
    } catch (e) {
      console(e)
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { height: 60 + insets.top, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
        <WorkSansText
          weight={700}
          style={{ flex: 1, textAlign: 'center', fontSize: 18, color: '#303940' }}
        >
          {t('friend.invite2')}
        </WorkSansText>
        <View style={{ width: 24 }} />
      </View>
      <WorkSansText weight={700} style={{ fontSize: 22, color: '#303940', marginTop: 30 }}>
        {t('friend.earnTogether')}
      </WorkSansText>
      <WorkSansText style={{ fontSize: 14, color: '#303940', marginBottom: 30, marginHorizontal: 28, textAlign: 'center' }}>
        {t('friend.earnDesc')}
      </WorkSansText>
      <Image
        source={earnTogetherIcon}
        style={{ width: width - 56, height: (width - 56) / 1260 * 828 }}
        resizeMode="contain"
      />
      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <InterText weight={600} style={{ fontSize: 16, color: '#303940' }}>
          {t('friend.inviteCode')}
        </InterText>
        <WorkSansText weight={700} style={{ marginHorizontal: 5, fontSize: 18, color: '#303940' }}>
          {inviteCode}
        </WorkSansText>
        <TouchableOpacity onPress={() => Clipboard.setString(inviteCode)}>
          <MaterialIcons name="content-copy" size={18} color="black" style={{transform: [{scaleY: -1}]}} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.share} onPress={shareCode}>
        <InterText weight={600} style={{ marginLeft: 8, fontSize: 16, color: '#FFFFFF' }}>
          {t('friend.share')}
        </InterText>
      </TouchableOpacity>
      <View style={{ height: insets.bottom }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  topBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
  },
  share: {
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
