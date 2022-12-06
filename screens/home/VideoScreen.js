import React, {useContext, useEffect, useRef, useState} from 'react';
import {AppState, Pressable, StyleSheet, useWindowDimensions, View} from 'react-native';
import Video from 'react-native-video';
import {GlobalContext} from '../../context/GlobalContext';
import CryptoAES from 'crypto-js/aes';
import configs from '../../configs';
import {readArticle} from '../../apis/article';
import { recordBannerView } from '../../apis/video';
import { InterText } from '../../components/CustomText';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VideoScreen({navigation, route}) {
  const { videoUrl, watchId, isAd, isBanner, bannerWatchTime } = route.params;

  const insets = useSafeAreaInsets()
  const { width, height } = useWindowDimensions()
  const [{isLoggedIn}] = useContext(GlobalContext);

  const watchTime = useRef(0);
  const appState = useRef(AppState.currentState);

  const [paused, setPaused] = useState(false)
  const pausedRef = useRef()
  pausedRef.current = paused

  const progressInterval = useRef()
  const [watchCounter, setWatchCounter] = useState(bannerWatchTime ? bannerWatchTime : 30)

  useEffect(() => {
    // handle app minimize and focus
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setPaused(false)
        watchTime.current = 0
      } else if (
        nextAppState.match(/inactive|background/) &&
        appState.current === 'active'
      ) {
        setPaused(true)
        // FOR NOT AN AD
        try {
          if (isLoggedIn && watchTime.current && watchId && !isAd) {
            const message = { articleId: watchId, readTime: watchTime.current }
            const cipher = CryptoAES.encrypt(JSON.stringify(message), configs.ARTICLE_READ_KEY).toString()
            readArticle(cipher)
          }
        } catch (e) {
          console.log(e)
        }
      }

      appState.current = nextAppState
    })

    watchTime.current = 0

    return () => {
      subscription.remove()

      try {
        // FOR NOT AN AD
        if (isLoggedIn && watchTime.current && watchId && !isAd) {
          const message = { articleId: watchId, readTime: watchTime.current }
          const cipher = CryptoAES.encrypt(JSON.stringify(message), configs.ARTICLE_READ_KEY).toString()
          readArticle(cipher)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [watchId, isLoggedIn, isAd])

  // FOR AD ONLY; when watch counter completes, send to backend
  useEffect(() => {
    try {
      if (watchCounter === 0 && isLoggedIn && watchId && isAd) {
        if (!isBanner) {
          const message = { articleId: watchId, readTime: 30 }
          const cipher = CryptoAES.encrypt(
            JSON.stringify(message),
            configs.ARTICLE_READ_KEY,
          ).toString();
          readArticle(cipher);
        } else {
          const message = { bannerId: watchId, watchTime: 30 }
          const cipher = CryptoAES.encrypt(
            JSON.stringify(message),
            configs.ARTICLE_READ_KEY,
          ).toString();
          recordBannerView(cipher)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }, [watchCounter, isLoggedIn, watchId, isAd, isBanner])

  const onVideoEnd = async () => {
    navigation.goBack()
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => navigation.goBack()}>
          <Entypo name="chevron-thin-left" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
      { videoUrl ?
        <Pressable style={styles.video} onPress={() => setPaused(p => !p)}>
          <Video
            source={{
              uri: videoUrl,
            }}
            onLoad={(data) => {
              const { duration } = data
              if (progressInterval.current) {
                clearInterval(progressInterval.current)
              }

              progressInterval.current = setInterval(() => {
                if (!pausedRef.current) {
                  setWatchCounter(c => c - 1)
                  watchTime.current = watchTime.current + 1;
                }
              }, 1000)

              const minWatchTime = duration >= 30 ? 30 : Math.trunc(duration)
              setWatchCounter(minWatchTime)
            }}
            onEnd={onVideoEnd}
            style={styles.player}
            resizeMode="contain"
            paused={paused}
          />
          { paused ?
            <View style={{ position: 'absolute', top: (height - 56) / 2 - 25, left: width / 2 - 25 }}>
              <Ionicons name="play" size={50} color="rgba(255,255,255,0.5)" />
            </View> : null
          }
        </Pressable> : null
      }
      { isAd && watchCounter > 0 ?
        <View style={[styles.timer, { bottom: insets.bottom + 16 }]}>
          <InterText style={{ fontSize: 10, color: '#FFFFFF' }}>
            {Math.max(0, watchCounter)}
          </InterText>
        </View> : null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  video: {
    overflow: 'hidden',
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  player: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
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
  ready: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 12,
  },
});

