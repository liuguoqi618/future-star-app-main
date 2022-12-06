import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'
import { InterText } from '../CustomText'
import { useTranslation } from 'react-i18next'
import { Foundation } from '@expo/vector-icons'

const defaultAvatarIcon = require('../../assets/images/Home/default-avatar.png')

export default function NewsItem({ article }) {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  const [displayWidth, setDisplayWidth] = useState(width * 0.3)
  const [displayHeight, setDisplayHeight] = useState(width * 0.3)

  const videoOnly = article.containsVideo && article.content.length === 1
  const videoUrl = article.content[0].content

  const imageUrl =
    videoOnly ? (
      article.content[0].cover
    ) : (
      article.imageUrl ? (
        article.imageUrl
      ) :
      article.containsImage ? article.content.find(a => a.type === 'image').content : ''
    )

  useEffect(() => {
    if (imageUrl) {
      Image.getSize(imageUrl, (w, h) => {
        if (videoOnly) {
          setDisplayHeight((width - 40) / w * h)
          setDisplayWidth(width - 40)
        } else if (h / w > 1.2) {
          setDisplayHeight(100)
          setDisplayWidth(100 / h * w)
        } else {
          setDisplayHeight(width * 0.3 / w * h)
          setDisplayWidth(width * 0.3)
        }
      })
    }

  }, [width, imageUrl, videoOnly])

  return (
    <View style={{ backgroundColor: '#FFFFFF' }}>
      <TouchableOpacity onPress={() => {
        if (videoOnly) {
          navigation.navigate('VideoScreen', { videoUrl, watchId: article._id, isAd: article.isAd })
        } else {
          navigation.navigate('ReadScreen', { articleId: article._id })
        }
      }}>
        <View style={styles.newsItem}>
          { !videoOnly ?
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={article.avatarUrl ? { uri: article.avatarUrl } : defaultAvatarIcon}
                  style={{ height: 16, width: 16, borderRadius: 8 }}
                  resizeMode="contain"
                />
                <InterText weight={500} style={{ marginLeft: 4, fontSize: 12, color: '#48535B' }}>
                  {article.author}
                </InterText>
                <View style={{ flex: 1 }} />
                { article.isAd ?
                  <View style={styles.ads}>
                    <InterText weight={500} style={{ fontSize: 12, color: '#9AA6AC' }}>
                      {t('read.ads')}
                    </InterText>
                  </View> : null
                }
              </View>
              <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                <InterText weight={700} style={{ flex: 1, fontSize: 16, color: '#3C464E' }}>
                  {article.title}
                </InterText>
                { imageUrl ?
                  <Image
                    source={{ uri: imageUrl }}
                    style={{ width: displayWidth, height: displayHeight, marginLeft: 8 }}
                    resizeMode="contain"
                  /> : null
                }
              </View>
              <View style={{ flexDirection: 'row' }}>
                <InterText weight={500} style={{ fontSize: 12, color: '#84919A' }}>
                  {moment(new Date(article.createTime)).format('MMM D, YYYY')} • {t('read.duration', { duration: article.readTime })}
                </InterText>
              </View>
            </> :
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <InterText weight={700} style={{ flex: 1, fontSize: 16, color: '#3C464E' }}>
                  {article.title}
                </InterText>
              </View>
              { imageUrl ?
                <View>
                  <Image
                    source={{ uri: imageUrl }}
                    style={{ width: displayWidth, height: displayHeight }}
                    resizeMode="contain"
                  />
                  <Foundation
                    name="play-video"
                    size={20}
                    color="rgba(180, 180, 180, 0.57)"
                    style={{ position: 'absolute', bottom: 5, right: 5 }}
                  />
                </View> : null
              }
              { article.isAd ?
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                  <View style={styles.ads}>
                    <InterText weight={500} style={{ fontSize: 12, color: '#9AA6AC' }}>
                      {t('read.ads')}
                    </InterText>
                  </View>
                </View> : null
              }
            </>
          }
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  newsItem: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  ads: {
    backgroundColor: '#EEF0F2',
    paddingHorizontal: 8,
    borderRadius: 4,
  },
})
