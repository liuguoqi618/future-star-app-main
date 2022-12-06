import React, { forwardRef, useState } from 'react'
import { FlatList, Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

import { InterText } from './CustomText'
import { AntDesign } from '@expo/vector-icons'

const DropDownPicker = forwardRef((props, ref) => {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const { height } = useWindowDimensions()

  const { value, setValue, options, onConfirm: _onConfirm } = props
  const { noBorder = false, backgroundColor = '#FFFFFF' } = props

  const [currentValue, setCurrentValue] = useState(value)
  const currentIndex = options.findIndex(o => o.value === value)
  const currentLabel = currentIndex >= 0 ? options[currentIndex].label : ''

  const onCancel = () => {
    ref.current.close()
    setTimeout(() => setCurrentValue(value), 500)
  }

  const onConfirm = () => {
    setValue(currentValue)
    if (_onConfirm) {
      _onConfirm(currentValue)
    }
    ref.current.close()
  }

  return (
    <View>
      <Pressable
        style={[styles.dropdown, { backgroundColor, borderWidth: noBorder ? 0 : 1 }]}
        onPress={() => ref.current.open()}
      >
        <InterText style={{ fontSize: 14, color: '#1A2024', flex: 1, marginRight: 16 }}>
          {currentLabel}
        </InterText>
        <AntDesign name="down" size={14} color="#6E7C87" />
      </Pressable>
      <RBSheet
        ref={ref}
        customStyles={{ container: styles.sheetContainer }}
        animationType="slide"
      >
        <View style={{ height: height / 2, paddingBottom: insets.bottom }}>
          <View style={styles.sheetHeader}>
            <TouchableOpacity onPress={onCancel}>
              <InterText style={{ fontSize: 16, color: '#9AA6AC' }}>
                {t('word.cancel')}
              </InterText>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={onConfirm}>
              <InterText style={{ fontSize: 16, color: '#0E73F6' }}>
                {t('word.confirm')}
              </InterText>
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            renderItem={({ item }) =>
              <Pressable
                style={[styles.sheetItem, currentValue === item.value && styles.itemSelected]}
                onPress={() => setCurrentValue(item.value)}
              >
                <InterText weight={600} style={{ fontSize: 14, color: '#303940' }}>
                  {item.label}
                </InterText>
              </Pressable>
            }
          />
        </View>
      </RBSheet>
    </View>
  )
})

const styles = StyleSheet.create({
  dropdown: {
    height: 40,
    borderRadius: 6,
    borderColor: '#DDE2E4',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  itemSelected: {
    backgroundColor: '#EEF0F2',
  },
})

export default DropDownPicker
