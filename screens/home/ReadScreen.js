import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
  AppState, ActivityIndicator, Animated,
  Image, PanResponder, Pressable, ScrollView, Share,
  StyleSheet, TouchableOpacity, useWindowDimensions, View,
} from 'react-native'
import { Foundation, Ionicons } from '@expo/vector-icons'
import moment from 'moment'
import { numberToShortString } from '../../utils/numbers'
import { useTranslation } from 'react-i18next'
import { GlobalContext } from '../../context/GlobalContext'
import CryptoAES from 'crypto-js/aes'
import configs from '../../configs'
import Toast from 'react-native-toast-message'
import AutoImage from '../../components/AutoImage'
import { getLoginCredentials, removeLoginCredentials, removeRefreshToken, setRefreshToken } from '../../utils/storage'
import { userLogin } from '../../cognito'
import { callLogin } from '../../apis/auth'
import { useFocusEffect } from '@react-navigation/native'
import { getArticle, getComments, likeArticle, readArticle, unlikeArticle } from '../../apis/article'
import * as ExpoSplashScreen from 'expo-splash-screen'

import CustomScreenHeader from '../../components/CustomScreenHeader'
import { InterText } from '../../components/CustomText'
import CommentSheet from '../../components/home/CommentSheet'
import { removeToken, setToken } from '../../utils/axios'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import LoadingModal from '../../components/LoadingModal'

const defaultAvatarIcon = require('../../assets/images/Home/default-avatar.png')
const like = require('../../assets/images/Home/like.png')
const likeLiked = require('../../assets/images/Home/like-liked.png')
const comment = require('../../assets/images/Home/comment.png')

export default function ReadScreen({ navigation, route }) {
  const { articleId } = route.params
  const { width } = useWindowDimensions()
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  const [{ isLoggedIn }, dispatch] = useContext(GlobalContext)
  const [isLoading, setIsLoading] = useState(true)
  const [article, setArticle] = useState()

  const [comments, setComments] = useState([])

  const readStart = useRef()
  const appState = useRef(AppState.currentState)

  const [commentsLoading, setCommentsLoading] = useState(false)
  const commentSheetRef = useRef()

  const isAd = useRef(false)
  isAd.current = article ? article.isAd : false

  const [watchCounter, setWatchCounter] = useState(30)

  useEffect(() => {
    const startup = async () => {
      try {
        // await ExpoSplashScreen.hideAsync()

        // let loggedIn = isLoggedIn

        // if (!isLoggedIn) {
        //   const credentials = await getLoginCredentials()

        //   if (credentials) {
        //     const { email, phoneNumber, password } = JSON.parse(credentials)
        //     let userIdentity = email
        //     if (!email) {
        //       userIdentity = phoneNumber
        //     }
        //     userLogin(userIdentity, password, async data => {
        //       try {
        //         const jwtToken = data.idToken.jwtToken
        //         const result = await callLogin(jwtToken)
        //         if (result.data.data.status === 1) {
        //           removeToken()
        //           removeRefreshToken()
        //           removeLoginCredentials()
        //         } else if (result.data.data.status === 0) {
        //           setToken(jwtToken)
        //           setRefreshToken(data.refreshToken.token)
        //           dispatch({
        //             type: 'LOG_IN',
        //             data: {
        //               username: result.data.data.userName,
        //               avatarUrl: result.data.data.avatarUrl,
        //               email: result.data.data.email,
        //               phoneNumber: result.data.data.phoneNumber,
        //               inviteCode: result.data.data.inviteCode,
        //             },
        //           })
        //           loggedIn = true
        //         }
        //       } catch (e) {
        //         console.log(e.response.data.message)
        //         removeToken()
        //         removeRefreshToken()
        //         removeLoginCredentials()
        //       }
        //     }, async (e) => {
        //       console.log(e)
        //       removeToken()
        //       removeRefreshToken()
        //       removeLoginCredentials()
        //     })
        //   } else {
        //     removeToken()
        //     removeRefreshToken()
        //     removeLoginCredentials()
        //   }
        // }

        const result = await getArticle(articleId, isLoggedIn)
        setArticle(result.data.data)

        setIsLoading(false)
      } catch (e) {
        console.log(e)
      }
    }

    startup()

    // handle app minimize and focus
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        readStart.current = Date.now()
      } else if (
        nextAppState.match(/inactive|background/) &&
        appState.current === 'active'
      ) {
        try {
          if (isLoggedIn && readStart.current && !isAd.current) {
            const message = { articleId, readTime: Math.trunc((Date.now() - readStart.current) / 1000) }
            const cipher = CryptoAES.encrypt(JSON.stringify(message), configs.ARTICLE_READ_KEY).toString()
            readArticle(cipher)
          }
        } catch (e) {
          console.log(e)
        }
      }

      appState.current = nextAppState
    })

    const interval = setInterval(() => {
      setWatchCounter(c => c - 1)
    }, 1000)

    return () => {
      if (interval) {
        clearInterval(interval)
      }

      subscription.remove()
    }
  }, [articleId, isLoggedIn, dispatch])

  useFocusEffect(useCallback(() => {
    readStart.current = Date.now()

    return () => {
      try {
        if (isLoggedIn && readStart.current && !isAd.current) {
          const message = { articleId, readTime: Math.trunc((Date.now() - readStart.current) / 1000) }
          const cipher = CryptoAES.encrypt(JSON.stringify(message), configs.ARTICLE_READ_KEY).toString()
          readArticle(cipher)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [articleId, isLoggedIn]))

  // FOR AD ONLY; when watch counter completes, send to backend
  useEffect(() => {
    try {
      if (watchCounter === 0 && isLoggedIn && isAd.current) {
        const message = { articleId, readTime: Math.trunc((Date.now() - readStart.current) / 1000) }
        const cipher = CryptoAES.encrypt(JSON.stringify(message), configs.ARTICLE_READ_KEY).toString()
        readArticle(cipher)
      }
    } catch (e) {
      console.log(e)
    }
  }, [watchCounter, isLoggedIn, articleId])

  const pan = useRef(new Animated.ValueXY()).current

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) >= 40,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => Math.abs(gestureState.dx) >= 40,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        })
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y },
        ],
        {useNativeDriver: false}
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset()
      },
    })
  ).current

  const shareArticle = async () => {
    await Share.share({
      message: 'https://www.futurestargroup.com/',
    })
  }

  const likePressed = async () => {
    if (!article.liked) {
      setArticle(prev => ({ ...prev, liked: true, likes: prev.likes + 1 }))
      likeArticle(articleId).catch((e) => {
        console.log(e)
        Toast.show({ type: 'error', text1: t('read.error1') })
        setArticle(prev => ({ ...prev, liked: false, likes: prev.likes - 1 }))
      })
    } else {
      setArticle(prev => ({ ...prev, liked: false, likes: prev.likes - 1 }))
      unlikeArticle(articleId).catch((e) => {
        console.log(e)
        Toast.show({ type: 'error', text1: t('read.error2') })
        setArticle(prev => ({ ...prev, liked: false, likes: prev.likes - 1 }))
      })
    }
  }

  const commentPressed = async () => {
    setCommentsLoading(true)
    try {
      const result = await getComments(articleId, isLoggedIn)
      setComments(result.data.data)
      commentSheetRef.current.open()
    } catch (e) {
      console.log(e)
      Toast.show({ type: 'error', text1: t('read.error3') })
    } finally {
      setCommentsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <CustomScreenHeader
        // onBack={() => navigation.replace('HomeScreen')}
        renderRightComponent={() =>
          <Pressable onPress={shareArticle}>
            <Ionicons name="share-outline" size={24} color="black" />
          </Pressable>
        }
      />
      { !isLoading ?
        <>
          <ScrollView style={styles.content}>
            <View style={{ height: 20 }} />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={article.avatarUrl ? { uri: article.avatarUrl } : defaultAvatarIcon}
                style={{ height: 48, width: 48, borderRadius: 24 }}
                resizeMode="contain"
              />
              <View style={{ marginLeft: 10 }}>
                <InterText weight={600} style={{ fontSize: 16, color: '#1A2024' }}>
                  {article.author}
                </InterText>
                <InterText weight={400} style={{ fontSize: 14, color: '#84919A' }}>
                  {moment(new Date(article.createTime)).format('MMM D, YYYY')} • {t('read.duration', { duration: article.readDuration })}
                </InterText>
              </View>
            </View>
            <InterText weight={700} style={{ marginTop: 28, fontSize: 20, color: '#1A2024' }}>
              {article.title}
            </InterText>
            {/* <InterText weight={500} style={{ marginTop: 8, fontSize: 16, color: '#1A2024' }}>
              {article.title}
            </InterText> */}
            { article.imageUrl ?
              <AutoImage imageUrl={article.imageUrl} /> : null
            }
            {article.content.map((c, i) => {
              if (c.type === 'video') {
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => navigation.navigate('VideoScreen', { videoUrl: c.content })}
                    style={{ marginVertical: 16 }}
                  >
                    <>
                      <AutoImage imageUrl={c.cover} />
                      <Foundation
                        name="play-video"
                        size={20}
                        color="rgba(180, 180, 180, 0.57)"
                        style={{ position: 'absolute', bottom: 5, right: 5 }}
                      />
                    </>
                  </TouchableOpacity>
                )
              } else if (c.type === 'image') {
                return (
                  <AutoImage key={i} imageUrl={c.content} />
                )
              } else {
                return (
                  <InterText key={i} style={{ marginTop: 16, fontSize: 14, color: '#48535B', lineHeight: 20 }}>
                    {c.content}
                  </InterText>
                )
              }
            })}
            <View style={{ height: 60 }} />
          </ScrollView>
          <Animated.View
            style={[
              styles.floatMenu,
              {
                left: (width - 162) / 2,
                transform: [{
                  translateX: Animated.diffClamp(pan.x, -(width - 162) / 2, (width - 162) / 2),
                }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity
              disabled={!isLoggedIn}
              style={[styles.floatButton, { opacity: isLoggedIn ? 1 : 0.3 }]}
              onPress={likePressed}
            >
              <Image source={article.liked ? likeLiked : like} style={styles.floatIcon} />
              <InterText weight={500} style={{ fontSize: 14, color: article.liked ? '#0E73F6' : '#1A2024' }}>
                {numberToShortString(article.likes)}
              </InterText>
            </TouchableOpacity>
            <View style={{ height: 15, width: 1, backgroundColor: '#EEF0F2' }} />
            <TouchableOpacity
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
              onPress={commentPressed}
            >
              <Image source={comment} style={styles.floatIcon} />
              <InterText weight={500} style={{ fontSize: 14, color: '#1A2024' }}>
                {numberToShortString(article.comments)}
              </InterText>
            </TouchableOpacity>
          </Animated.View>
          { isAd.current && watchCounter > 0 ?
            <View style={[styles.timer, { top: 16 + 56 + insets.top }]}>
              <InterText style={{ fontSize: 10, color: '#FFFFFF' }}>
                {Math.max(0, watchCounter)}
              </InterText>
            </View> : null
          }
        </> :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0E73F6" />
        </View>
      }

      <CommentSheet
        articleId={articleId}
        comments={comments}
        setComments={setComments}
        isLoggedIn={isLoggedIn}
        ref={commentSheetRef}
        commentCount={article ? article.comments : 0}
        incrementComment={() => setArticle(prev => ({ ...prev, comments: prev.comments + 1 }))}
      />

      <LoadingModal visible={commentsLoading} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    // paddingTop: 20,
    paddingHorizontal: 12,
  },
  floatMenu: {
    backgroundColor: 'white',
    width: 162,
    height: 36,
    position: 'absolute',
    bottom: 16,
    borderRadius: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(91, 104, 113, 0.24)',

    flexDirection: 'row',
    alignItems: 'center',
  },
  floatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatIcon: {
    height: 20,
    width: 20,
    marginRight: 5,
  },
  timer: {
    backgroundColor: '#595959',
    height: 22,
    width: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
  },
})
