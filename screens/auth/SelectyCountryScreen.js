import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, TextInput, View, StyleSheet, FlatList, Pressable, Platform } from 'react-native'
import CountryFlag from 'react-native-country-flag'
import areaCode from '../../utils/areaCode'

import CustomScreenHeader from '../../components/CustomScreenHeader'
import { InterText } from '../../components/CustomText'

const searchIcon = require('../../assets/images/Auth/search.png')

export default function SelectCountryScreen({ navigation, route }) {
  const { t } = useTranslation()

  const { value, setValue } = route.params

  const currentIndex = value ? areaCode.findIndex(o => o.code === value.code) : -1
  const currentValue = currentIndex >= 0 ? areaCode[currentIndex] : null

  const [input, setInput] = useState('')

  const onItemSelected = useCallback((item) => {
    setValue(item)
    navigation.goBack()
  }, [setValue, navigation])

  const MemoizedItem = memo(CountryItem, (prevItem, nextItem) => {
    return prevItem.code === nextItem.code && prevItem.selected === nextItem.selected
  })

  return (
    <View style={styles.container}>
      <CustomScreenHeader title={t('countries.select')} />
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <Image source={searchIcon} style={{ height: 20, width: 20 }} />
          <TextInput
            value={input}
            onChangeText={setInput}
            style={styles.input}
            placeholder={t('search.search')}
            placeholderTextColor="#84919A"
          />
        </View>
      </View>
      <FlatList
        data={areaCode.filter(c => t(c.label).toLocaleLowerCase().includes(input.toLocaleLowerCase()))}
        renderItem={({ item }) =>
          <MemoizedItem
            item={item}
            selected={currentValue && currentValue.code === item.code && currentValue.phoneCode === item.phoneCode}
            onPress={onItemSelected}
          />
        }
      />
    </View>
  )
}

const CountryItem = ({ item, onPress, selected }) => {
  const { t } = useTranslation()

  return (
    <Pressable
      style={[
        styles.item,
        selected && styles.itemSelected,
      ]}
      onPress={() => onPress(item)}
    >
      {Platform.OS === 'android' ? <CountryFlag isoCode={item.code} size={25} /> : null}
      <InterText weight={600} style={{ marginLeft: Platform.OS === 'android' ? 8 : 0, flex: 1, fontSize: 14, color: '#303940' }}>
        {t(item.label)} ({item.phoneCode})
      </InterText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  item: {
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
  searchBarWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  searchBar: {
    borderColor: '#DEE5EF',
    borderWidth: 1,
    borderRadius: 4,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginLeft: 3,
  },
})
