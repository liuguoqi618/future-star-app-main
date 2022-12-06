import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { InterText } from './CustomText'

const renderError = ({ text1, text2 }) => {
  const onPress = () => {
    Toast.hide()
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{
        width: '90%',
        borderRadius: 6,
        paddingVertical: 10,
        backgroundColor: '#3C464E',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
      }}>
        <MaterialIcons name="error" style={{
          fontSize: 24,
          color: '#F76287',
        }} />
        <View style={{
          flex: 1,
          marginHorizontal: 10,
        }}>
          { text1 &&
            <InterText style={{ fontSize: 14, color: 'white' }}>
              {text1}{text2 ? ': ' : ''}
              { text2 && <Text style={{ fontSize: 14 }}>{text2}</Text>}
            </InterText>
          }
        </View>
      </View>
    </TouchableOpacity>
  )
}

const renderInfo = ({ text1, text2 }) => {
  const onPress = () => {
    Toast.hide()
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{
        width: '90%',
        borderRadius: 6,
        paddingVertical: 10,
        backgroundColor: '#3C464E',
        flexDirection: 'row',
        paddingHorizontal: 10,
      }}>
        <Ionicons name="checkmark-circle" style={{
          fontSize: 20,
          color: '#47D16C',
        }} />
        <View style={{
          flex: 1,
          marginHorizontal: 10,
        }}>
          { text1 &&
            <InterText style={{ fontSize: 14, color: 'white' }}>
              {text1}{text2 ? ': ' : ''}
              { text2 && <Text style={{ fontSize: 14 }}>{text2}</Text>}
            </InterText>
          }
        </View>
      </View>
    </TouchableOpacity>
  )
}

export const toastConfig = {
  error: renderError,
  info: renderInfo,
  any_custom_type: () => {},
}

export default function ToastProvider() {
  const insets = useSafeAreaInsets()

  return (
    <Toast
      config={toastConfig}
      visibilityTime={2500}
      topOffset={insets.top + 10}
      bottomOffset={insets.bottom + 10}
      // ref={(ref) => Toast.setRef(ref)}
    />
  )
}
