import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { WorkSansText } from './CustomText'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function CustomScreenHeader({
  title, onBack, renderRightComponent, titleAlign = 'center',
}) {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { height: 56 + insets.top, paddingTop: insets.top }]}>
      <Pressable hitSlop={10} onPress={() => {
        if (onBack) {
          onBack()
        } else {
          navigation.goBack()
        }
      }}>
        <Entypo name="chevron-thin-left" size={24} color="black" />
      </Pressable>
      <View style={{ marginHorizontal: 16, flex: 1 }}>
        {title ?
          <WorkSansText weight={700} style={{ textAlign: titleAlign, fontSize: 18, color: '#303940' }}>
            {title}
          </WorkSansText> : null
        }
      </View>
      <View style={{ width: 30 }}>
        {renderRightComponent ? renderRightComponent() : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
    backgroundColor: '#FFFFFF',
  },
})
