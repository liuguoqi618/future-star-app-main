import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { InterText } from '../CustomText'
import { AntDesign } from '@expo/vector-icons'

const CountryCodePicker = (props) => {
  const navigation = useNavigation()

  const { value, setValue, error } = props
  const { noBorder = false, backgroundColor = '#FFFFFF' } = props

  const currentLabel = value ? value.phoneCode : ''

  return (
    <View>
      <Pressable
        style={[styles.dropdown, { backgroundColor, borderWidth: noBorder ? 0 : 1 }, error && { borderColor: '#FF0000' }]}
        onPress={() => navigation.navigate('SelectCountryScreen', { value, setValue })}
      >
        <InterText numberOfLines={1} style={{ fontSize: 14, color: '#1A2024', flex: 1, marginRight: 8 }}>
          {currentLabel}
        </InterText>
        <AntDesign name="down" size={14} color="#6E7C87" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    height: 40,
    borderRadius: 6,
    borderColor: '#DDE2E4',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  sheetContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 'auto',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    paddingVertical: 16,
    borderBottomColor: '#EEF0F2',
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  sheetItem: {
    height: 40,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  itemSelected: {
    backgroundColor: '#EEF0F2',
  },
})

export default CountryCodePicker
