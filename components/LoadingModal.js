import React from 'react'
import { ActivityIndicator, Modal, View } from 'react-native'

export default function LoadingModal({ visible }) {
  return (
    <Modal visible={visible} transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(125, 125, 125, 0.3)', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0E73F6" />
      </View>
    </Modal>
  )
}
