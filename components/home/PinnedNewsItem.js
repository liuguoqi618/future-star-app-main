import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { InterText } from '../CustomText'
import { Octicons } from '@expo/vector-icons'

export default function PinnedNewsItem({ article }) {
  const navigation = useNavigation()


  return (
    <View style={{ backgroundColor: '#FFFFFF' }}>
      <TouchableOpacity onPress={() => navigation.navigate('ReadScreen', { articleId: article._id })}>
        <View style={styles.newsItem}>
          <Octicons name="dot-fill" size={20} color="#5B6871" />
          <InterText weight={600} style={{ flex: 1, marginLeft: 12, fontSize: 14, color: '#3C464E' }} numberOfLines={2}>
            {article.title}
          </InterText>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  newsItem: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ads: {
    backgroundColor: '#EEF0F2',
    paddingHorizontal: 8,
    borderRadius: 4,
  },
})
