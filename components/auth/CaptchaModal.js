import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { TextInput, LogBox, Modal, Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { SvgXml } from 'react-native-svg';

import { InterText } from '../CustomText'
import { MaterialIcons } from '@expo/vector-icons';

LogBox.ignoreLogs(['Invalid `viewBox` prop'])

const CaptchaModal = forwardRef(({
  onConfirm, refresh,
}, ref) => {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  const [visible, setIsVisible] = useState(false)

  const [captcha, setCaptcha] = useState()
  const [input, setInput] = useState('')

  useImperativeHandle(ref, () => ({
    show, hide,
  }))

  const show = (captchaString) => {
    setIsVisible(true)
    setCaptcha(captchaString)
    setInput('')
  }

  const hide = () => {
    setIsVisible(false)
    setCaptcha('')
  }

  const confirm = () => {
    setIsVisible(false)
    setCaptcha('')
    if (onConfirm) {
      onConfirm(input)
    }
  }

  return (
    <Modal transparent visible={visible}>
      <Pressable style={styles.background} disabled>
        <View style={[styles.container, { width: width - 40 }]}>
          <InterText weight={600} style={{ fontSize: 16, color: '#5B6871' }}>
            {t('auth.captcha')}
          </InterText>
          { captcha ?
            <View style={{ width: '100%', height: 50 }}>
              <SvgXml xml={captcha} width="100%" height="100%" />
            </View> : null
          }
          <View style={styles.inputWrapper}>
            <TextInput
              value={input}
              onChangeText={setInput}
              style={styles.input}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Pressable onPress={refresh}>
              <MaterialIcons name="refresh" size={30} color="black" />
            </Pressable>
            <TouchableOpacity style={styles.confirm} onPress={confirm}>
              <InterText weight={600} style={{ fontSize: 16, color: '#FFFFFF' }}>
                {t('auth.confirm')}
              </InterText>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  )
})

export default CaptchaModal

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
  },
  inputWrapper: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    borderColor: '#DDE2E4',
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#252C32',
    height: 40,
  },
})
