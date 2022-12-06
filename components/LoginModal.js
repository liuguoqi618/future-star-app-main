import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal, Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { InterText } from './CustomText'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'

const LoginModal = forwardRef((props, ref) => {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const navigation = useNavigation()

  const [visible, setIsVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    show, hide,
  }))

  const show = () => setIsVisible(true)
  const hide = () => setIsVisible(false)

  return (
    <Modal transparent visible={visible}>
      <Pressable style={styles.background} onPress={hide}>
        <View style={[styles.container, { width: width - 40 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <InterText weight={600} style={{ fontSize: 16, color: '#252C32' }}>
              {t('homeV1.loginFirst')}
            </InterText>
          </View>

          <View>
            <View style={{ marginTop: 12 }}>
              <InterText style={{ fontSize: 14, color: '#5B6871', textAlign: 'center' }}>
                {t('homeV1.loginFirstDesc')}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity style={styles.confirm} onPress={() => {
                hide()
                navigation.navigate('Auth')
              }}>
                <InterText weight={600} style={{ fontSize: 14, color: '#FFFFFF' }}>
                  {t('homeV1.loginNow')}
                </InterText>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={hide}>
              <InterText weight={600} style={{ marginTop: 12, fontSize: 14, color: '#5B6871', textAlign: 'center' }}>
                {t('profile.later')}
              </InterText>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  )
})

export default LoginModal

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
