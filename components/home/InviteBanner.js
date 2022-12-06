import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'

import { InterText } from '../CustomText';

const invSplashImage = require('../../assets/images/Home/invitation-splash.png')
const inv1Image = require('../../assets/images/Home/invitation-1.png')
const inv2Image = require('../../assets/images/Home/invitation-2.png')

export default function InviteBanner({ navigation, isLoggedIn, loginRef }) {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  const onPress = () => {
    if (!isLoggedIn) {
      if (loginRef && loginRef.current) {
        loginRef.current.show()
      }
    } else {
      navigation.navigate('InviteScreen')
    }
  }

  return (
    <Pressable
      style={{ marginTop: 12, justifyContent: 'center', overflow: 'hidden' }}
      onPress={onPress}
    >
      <Image
        source={invSplashImage}
        style={{
          width: width - 24,
          height: (width - 40) * 382 / 1340,
        }}
      />
      <Image
        source={inv1Image}
        style={{
          height: (width - 24) * 382 / 1340,
          width: (width - 24) * 382 / 1340 * 760 / 380,
          position: 'absolute',
          right: 11,
          top: 0,
        }}
      />
      <Image
        source={inv2Image}
        style={{
          height: 40,
          width: 40,
          position: 'absolute',
          right: 21,
          bottom: 6,
        }}
      />
      <View style={{ padding: 20, position: 'absolute', flexDirection: 'row' }}>
        <View>
          <InterText weight={600} style={{ fontSize: 18, color: '#FFFFFF' }}>
            {t('homeV1.inviteFriends')}
          </InterText>
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <InterText weight={500} style={{ fontSize: 12, color: '#0E73F6' }}>
              {t('homeV1.inviteFriendsDesc')}
            </InterText>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
