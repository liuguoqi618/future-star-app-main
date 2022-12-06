import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal, Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { InterText } from '../CustomText'
import { useTranslation } from 'react-i18next'

const VerifyModal = forwardRef(({
  onConfirm,
  onHide,
}, ref) => {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  const [visible, setIsVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    show, hide,
  }))

  const show = () => setIsVisible(true)
  const hide = () => {
    setIsVisible(false)
    if (onHide) {
      onHide()
    }
  }

  return (
    <Modal transparent visible={visible}>
      <Pressable style={styles.background} onPress={hide}>
        <View style={[styles.container, { width: width - 40 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <InterText weight={600} style={{ flex: 1, fontSize: 16, color: '#252C32' }}>
              {''}
            </InterText>
            <TouchableOpacity onPress={hide}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <InterText weight={600} style={{ fontSize: 16, color: '#5B6871' }}>
            {t('wallet.enableWithdraw')}
          </InterText>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={styles.later} onPress={hide}>
              <InterText weight={600} style={{ fontSize: 16, color: '#0E73F6' }}>
                {t('profile.later')}
              </InterText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirm} onPress={onConfirm}>
              <InterText weight={600} style={{ fontSize: 16, color: '#FFFFFF' }}>
                {t('profile.verifyId')}
              </InterText>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  )
})

export default VerifyModal

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
  later: {
    flexDirection: 'row',
    borderColor: '#0E73F6',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 24,
    marginRight: 12,
  },
})
