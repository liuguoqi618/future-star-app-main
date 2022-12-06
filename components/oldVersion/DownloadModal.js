import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { ActivityIndicator, Modal, Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { InterText } from '../CustomText'
import { useTranslation } from 'react-i18next'

const DownloadModal = forwardRef(({
}, ref) => {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  const [visible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useImperativeHandle(ref, () => ({
    show, hide, finishLoading,
  }))

  const show = () => setIsVisible(true)
  const hide = () => {
    setIsVisible(false)
    setIsLoading(true)
  }
  const finishLoading = () => setIsLoading(false)

  return (
    <Modal transparent visible={visible}>
      <Pressable style={styles.background} onPress={hide}>
        <View style={[styles.container, { width: width - 40 }]}>
          { !isLoading ?
            <>
              <View style={{ marginTop: 12 }}>
                <InterText weight={600} style={{ fontSize: 16, color: '#5B6871' }}>
                  {t('oldVersion.text6')}
                </InterText>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.confirm} onPress={hide}>
                  <InterText weight={600} style={{ fontSize: 16, color: '#FFFFFF' }}>
                    {t('wallet.gotIt')}
                  </InterText>
                </TouchableOpacity>
              </View>
            </> :
            <>
              <InterText weight={600} style={{ fontSize: 16, color: '#5B6871' }}>
                {t('oldVersion.text5')}
              </InterText>
              <View style={{ height: 120, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0E73F6" />
              </View>
            </>
          }
        </View>
      </Pressable>
    </Modal>
  )
})

export default DownloadModal

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
  confirmLong: {
    flex: 1,
  },
})
