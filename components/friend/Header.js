import React from 'react'
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { AntDesign, Entypo } from '@expo/vector-icons'

import { InterText, WorkSansText } from '../CustomText'
import Popover from '../Popover'

const inviteIcon = require('../../assets/images/Friend/invite.png')

export default function Header() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()

  return (
    <View style={[styles.topBar, { height: 60 + insets.top, paddingTop: insets.top }]}>
      <Pressable hitSlop={10} onPress={() => navigation.goBack()}>
        <Entypo name="chevron-thin-left" size={24} color="black" />
      </Pressable>
      <WorkSansText weight={700} style={{ flex: 1, marginLeft: 5, fontSize: 22, color: '#303940' }}>
        {t('friend.title')}
      </WorkSansText>
      <Popover
        TriggerComponent={() =>
          <AntDesign name="questioncircleo" size={24} color="black" />
        }
      >
        <InterText style={{ fontSize: 12, color: '#1A2024' }}>
          {t('friend.info1')}
        </InterText>
        <InterText style={{ fontSize: 12, color: '#1A2024' }}>
          {t('friend.info2')}
        </InterText>
        <InterText style={{ fontSize: 12, color: '#1A2024' }}>
          {t('friend.info3')}
        </InterText>
        <InterText style={{ fontSize: 12, color: '#1A2024' }}>
          {t('friend.info4')}
        </InterText>
        <InterText style={{ fontSize: 12, color: '#1A2024' }}>
          {t('friend.info5')}
        </InterText>
        <InterText style={{ fontSize: 12, color: '#1A2024' }}>
          {t('friend.info6')}
        </InterText>
        <InterText style={{ fontSize: 12, color: '#1A2024' }}>
          {t('friend.info7')}
        </InterText>
        <InterText style={{ fontSize: 12, color: '#1A2024' }}>
          {t('friend.info8')}
        </InterText>
        <InterText style={{ fontSize: 12, color: '#1A2024' }}>
          {t('friend.info9')}
        </InterText>
        <InterText style={{ fontSize: 12, color: '#1A2024' }}>
          {t('friend.info10')}
        </InterText>
        <InterText style={{ fontSize: 12, color: '#1A2024' }}>
          {t('friend.info11')}
        </InterText>
        <InterText style={{ fontSize: 12, color: '#1A2024' }}>
          {t('friend.info12')}
        </InterText>
        <InterText style={{ fontSize: 12, color: '#1A2024' }}>
          {t('friend.info13')}
        </InterText>
      </Popover>
    </View>
  )
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
  },
})
