import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal, Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'

import { InterText } from '../CustomText'

const SignUpCompleteModal = forwardRef((props, ref) => {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const navigation = useNavigation()

  const [visible, setIsVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    show, hide,
  }))

  const show = () => setIsVisible(true)
  const hide = () => {
    setIsVisible(false)
    navigation.goBack()
  }

  return (
    <Modal transparent visible={visible}>
      <Pressable style={styles.background} onPress={hide}>
        <View style={[styles.container, { width: width - 40 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <InterText weight={600} style={{ fontSize: 16, color: '#252C32' }}>
              {t('auth.signupComplete')}
            </InterText>
          </View>

          <View style={{ marginTop: 12 }}>
            <InterText style={{ fontSize: 14, color: '#5B6871', textAlign: 'center' }}>
              {t('auth.pleaseLogin')}
            </InterText>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={styles.confirm} onPress={hide}>
              <InterText weight={600} style={{ fontSize: 14, color: '#FFFFFF' }}>
                {t('auth.okay')}
              </InterText>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  )
})

export default SignUpCompleteModal

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(125, 125, 125, 0.5)',
  },
  container: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 16,
  },
  confirm: {
    flexDirection: 'row',
    backgroundColor: '#0E73F6',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 24,
    flex: 1,
  },
})
