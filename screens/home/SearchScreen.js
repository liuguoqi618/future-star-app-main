import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, FlatList, StyleSheet, View, TextInput, TouchableOpacity, useWindowDimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { getFeed } from '../../apis/article'
import { debounce } from 'lodash'

import CustomScreenHeader from '../../components/CustomScreenHeader'
import { InterText, WorkSansText } from '../../components/CustomText'
import NewsItem from '../../components/home/NewsItem'
import ListSeparator from '../../components/ListSeparator'

const defaultAvatarIcon = require('../../assets/images/Home/default-avatar.png')
const searchIcon = require('../../assets/images/Home/search.png')
const trendingIcon = require('../../assets/images/Home/trending.png')
const searchEmpty = require('../../assets/images/Home/search-empty.png')

const pageSize = 10

export default function SearchScreen({ navigation, route }) {
  const { t } = useTranslation()

  const [trending, setTrending] = useState([])

  const [isSearching, setIsSearching] = useState(false)
  const [searchFinished, setSearchFinished] = useState(false)
  const [input, setInput] = useState('')
  const [searchResult, setSearchResult] = useState([])

  useEffect(() => {
    const startup = async () => {
      try {
        const result = await getFeed({ page: 1, size: pageSize })
        if (result.data.data.articles) {
          setTrending(result.data.data.articles)
        } else {
          throw 'error'
        }
      } catch (e) {
        console.log(e)
      }
    }

    startup()
  }, [])

  useEffect(() => {
    _debounce(async () => {
      setIsSearching(true)
      setSearchFinished(false)
      setSearchResult([])

      if (input.length > 0) {
        try {
          const result = await getFeed({ page: 1, size: pageSize, keyword: input })
          if (result.data.data.articles) {
            setSearchResult(result.data.data.articles)
          }
        } catch (e) {
          console.log(e)
        } finally {
          setSearchFinished(true)
        }
      } else {
        setIsSearching(false)
      }
    })
  }, [input])

  const renderListHeader = () =>
    <>
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
      {!isSearching ?
        <View style={styles.trendingHeader}>
          <Image source={trendingIcon} style={{ height: 20, width: 20 }} />
          <InterText weight={600} style={{ marginLeft: 5, fontSize: 12, color: '#1A2024' }}>
            {t('search.trending')}
          </InterText>
        </View> : null
      }
    </>

  const renderSearchItem = ({ item, index }) => {
    if (searchFinished) {
      return (
        <NewsItem article={item} />
      )
    }

    return (
      <View key={index} style={{ backgroundColor: '#FFFFFF' }}>
        <TouchableOpacity
          style={styles.trendingItem}
          onPress={() => navigation.navigate('ReadScreen', { articleId: item._id })}
        >
          <InterText weight={700} style={{ fontSize: 28, color: '#B0BABF' }}>
            {(index + 1).toString().padStart(2, '0')}
          </InterText>
          <View style={{ flex: 1, marginLeft: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={defaultAvatarIcon}
                style={{ height: 16, width: 16, borderRadius: 8 }}
                resizeMode="contain"
              />
              <InterText weight={500} style={{ marginLeft: 4, fontSize: 12, color: '#48535B' }}>
                {item.author}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
              <InterText weight={700} style={{ flex: 1, fontSize: 16, color: '#3C464E' }}>
                {item.title}
              </InterText>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <InterText weight={500} style={{ fontSize: 12, color: '#84919A' }}>
                {moment(new Date(item.createTime)).format('MMM D, YYYY')} • {t('read.duration', { duration: item.readDuration })}
              </InterText>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CustomScreenHeader title={t('search.title')}/>
      {renderListHeader()}
      <FlatList
        data={isSearching ? searchResult : trending}
        renderItem={renderSearchItem}
        ItemSeparatorComponent={() => !isSearching ? null : <ListSeparator />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() =>
          !isSearching || !searchFinished ?
          <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0E73F6" />
          </View> :
          <View style={{ height: 300, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            <Image source={searchEmpty} />
            <WorkSansText weight={700} style={{ fontSize: 22, color: '#303940', marginBottom: 12 }}>
              {t('search.notFound1')}
            </WorkSansText>
            <InterText style={{ textAlign: 'center', fontSize: 14, color: '#303940', lineHeight: 20 }}>
              {t('search.notFound2')}
            </InterText>
          </View>
        }
      />
    </View>
  )
}

const _debounce = debounce((callback) => {
  callback()
}, 500)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF0F2',
  },
  searchBarWrapper: {
    paddingHorizontal: 12,
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
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  trendingItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
})
