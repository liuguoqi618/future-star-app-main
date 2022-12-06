import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { ActivityIndicator, Modal, Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { InterText } from './CustomText'
import { useTranslation } from 'react-i18next'

const ModalBase = forwardRef(({
  title,
  description,
  description2,
  description3,
  onConfirm,
  alternateDesign = false,
}, ref) => {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  const [visible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useImperativeHandle(ref, () => ({
    show, hide, finishLoading, showLoaded,
  }))

  const show = () => setIsVisible(true)
  const hide = () => setIsVisible(false)
  const finishLoading = () => setIsLoading(false)
  const showLoaded = () => {
    setIsLoading(false)
    setIsVisible(true)
  }

  return (
    <Modal transparent visible={visible}>
      <Pressable style={styles.background} onPress={hide}>
        <View style={[styles.container, { width: width - 40 }]}>
          { !alternateDesign ?
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={600} style={{ flex: 1, fontSize: 16, color: '#252C32' }}>
                {title}
              </InterText>
              <TouchableOpacity onPress={hide}>
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
            </View> :
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <InterText weight={600} style={{ fontSize: 16, color: '#252C32' }}>
                {title}
              </InterText>
            </View>
          }
          { !isLoading ?
            <>
              <View style={{ marginTop: 12 }}>
                { description ?
                  <InterText style={{ fontSize: 14, color: '#5B6871', textAlign: !alternateDesign ? 'left' : 'center' }}>
                    {description}
                  </InterText> : null
                }
                { description2 ?
                  <InterText weight={700} style={{ fontSize: 36, color: '#0E73F6', textAlign: !alternateDesign ? 'left' : 'center' }}>
                    {description2}
                  </InterText> : null
                }
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity style={[styles.confirm, alternateDesign && styles.confirmLong]} onPress={onConfirm}>
                  <InterText weight={600} style={{ fontSize: 16, color: '#FFFFFF' }}>
                    {t('wallet.gotIt')}
                  </InterText>
                </TouchableOpacity>
              </View>
              { description3 ?
                <InterText weight={600} style={{ marginTop: 12, fontSize: 12, color: '#5B6871', textAlign: !alternateDesign ? 'left' : 'center' }}>
                  {description3}
                </InterText> : null
              }
            </> :
            <View style={{ height: 120, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#0E73F6" />
            </View>
          }
        </View>
      </Pressable>
    </Modal>
  )
})

export default ModalBase

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
