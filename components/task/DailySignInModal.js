import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { ActivityIndicator, Image, Modal, Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { LinearGradient } from 'expo-linear-gradient'

import { InterText } from '../CustomText'

const medalImage = require('../../assets/images/Task/medal.png')

const DailySignInModal = forwardRef((props, ref) => {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  const [visible, setIsVisible] = useState(false)

  const [reward, setReward] = useState(100)

  useImperativeHandle(ref, () => ({
    show, hide,
  }))

  const show = (value) => {
    setReward(value)
    setIsVisible(true)
  }
  const hide = () => setIsVisible(false)

  return (
    <Modal transparent visible={visible}>
      <Pressable style={styles.background} onPress={hide}>
        <LinearGradient
          colors={['#53ACFC', '#0560E5']}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          style={[styles.container, { width: width - 40 }]}
        >
          <View style={{ alignItems: 'center' }}>
            <Image source={medalImage} style={{ height: 150, width: 174 }} />
            <InterText weight={600} style={{ position: 'absolute', bottom: 18, fontSize: 16, color: '#FFFFFF' }}>
              {t('tasks.congratulations')}
            </InterText>
          </View>

          <InterText weight={600} style={{ marginTop: 16, fontSize: 16, color: '#FFFFFF' }}>
            {t('tasks.signinSuccess')}
          </InterText>

          <InterText weight={700} style={{ marginTop: 20, fontSize: 36, color: '#FFFFFF' }}>
            +{reward} FSC
          </InterText>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={styles.confirm} onPress={hide}>
              <InterText weight={600} style={{ fontSize: 14, color: '#000000' }}>
                {t('wallet.gotIt')}
              </InterText>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Pressable>
    </Modal>
  )
})

export default DailySignInModal

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(125, 125, 125, 0.5)',
  },
  container: {
    marginHorizontal: 20,
    borderRadius: 6,
    padding: 16,
    alignItems: 'center',
  },
  confirm: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 24,
    flex: 1,
  },
})
