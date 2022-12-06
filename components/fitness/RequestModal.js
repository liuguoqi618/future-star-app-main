import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal, Platform, Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { InterText } from '../CustomText'

const RequestModal = forwardRef(({ onConfirm, onDeny }, ref) => {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

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
              {t(Platform.OS === 'android' ? 'fitness.modalGoogle' : 'fitness.modalApple')}
            </InterText>
          </View>

          <View style={{ marginTop: 12 }}>
            <InterText weight={500} style={{ fontSize: 14, color: '#5B6871' }}>
              {t('fitness.modalDesc')}
            </InterText>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.confirm} onPress={onConfirm}>
              <InterText weight={600} style={{ fontSize: 16, color: '#FFFFFF' }}>
                {t('fitness.confirm')}
              </InterText>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.deny} onPress={onDeny}>
              <InterText weight={600} style={{ fontSize: 16, color: '#5B6871' }}>
                {t('fitness.deny')}
              </InterText>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  )
})

export default RequestModal

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
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0E73F6',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 12,
  },
  deny: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: '#6BB3FA',
    height: 40,
    // borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 12,
  },
})
