import React, {useEffect, useState, useRef, useContext} from 'react';
import {
  AppState,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import ModalBase from '../../components/ModalBase';
import Video from 'react-native-video';
import {useTranslation} from 'react-i18next';
import CryptoAES from 'crypto-js/aes';
import configs from '../../configs';
import {getHomepageVideo, recordVideoView} from '../../apis/video';
import {languageToFeedFilter} from '../../locale';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GlobalContext} from '../../context/GlobalContext';
import {Entypo, Ionicons, AntDesign} from '@expo/vector-icons';

import {InterText} from '../../components/CustomText';

const pageSize = 10;

export default function VideoAdScreen({navigation, route}) {
  const goBackRef = useRef();
  const {t, i18n} = useTranslation();
  const insets = useSafeAreaInsets();
  const {height, width} = useWindowDimensions();

  const {videoId} = route.params;

  const [{isLoggedIn}] = useContext(GlobalContext);

  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);

  const [paused, setPaused] = useState(false);
  const pausedRef = useRef();
  pausedRef.current = paused;

  const progressInterval = useRef();
  const [watchCounter, setWatchCounter] = useState(30);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // handle app minimize and focus
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setPaused(false);
      } else if (
        nextAppState.match(/inactive|background/) &&
        appState.current === 'active'
      ) {
        setPaused(true);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // fetch videos
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const language = languageToFeedFilter(i18n.language);
        let filter = {language};
        if (videoId) {
          filter = {videoId};
        }
        const result = await getHomepageVideo(filter);
        setVideos(result.data.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchVideo();
  }, [i18n.language, navigation, videoId]);

  // when watch counter completes, send to backend
  useEffect(() => {
    if (
      watchCounter === 0 &&
      isLoggedIn &&
      videos[index] &&
      videos[index]._id
    ) {
      try {
        const message = {
          videoId: videos[index]._id,
          watchTime: 30,
        };
        const cipher = CryptoAES.encrypt(
          JSON.stringify(message),
          configs.ARTICLE_READ_KEY,
        ).toString();
        recordVideoView(cipher);
      } catch (e) {
        console.log(e);
      }
    }
  }, [watchCounter, isLoggedIn, videos, index]);

  const onVideoEnd = async () => {
    setTimeout(() => {
      goToNextAd();
    }, 1000);
  };

  const goToNextAd = () => {
    if (index + 1 === videos.length) {
      setIndex(0);
      setVideos(v => {
        const shuffled = [...v];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      });
    } else {
      setIndex(i => i + 1);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <View style={styles.header}>
        <Pressable
          hitSlop={10}
          onPress={() => {
            if (watchCounter > 0) {
              goBackRef.current.show();
              goBackRef.current.finishLoading();
            } else {
              navigation.goBack();
            }
          }}>
          <Entypo name="chevron-thin-left" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
      {videos.length > 0 && videos[index].link ? (
        <Pressable style={styles.video} onPress={() => setPaused(p => !p)}>
          <Video
            source={{
              // uri: videos[index].link,
              uri: videos[index].videoHLS['1080'].url,
              type: 'm3u8',
            }}
            onLoad={data => {
              const {duration} = data;
              if (progressInterval.current) {
                clearInterval(progressInterval.current);
              }
              progressInterval.current = setInterval(() => {
                if (!pausedRef.current) {
                  setWatchCounter(c => c - 1);
                }
              }, 1000);
              const minWatchTime =
                videos[index].minWatchTime <= duration
                  ? videos[index].minWatchTime
                  : Math.trunc(duration);
              setWatchCounter(minWatchTime);
              if (videos[index].author === 'FutureStarterTask') {
                setWatchCounter(data.duration);
              }
            }}
            onEnd={onVideoEnd}
            style={styles.player}
            resizeMode="contain"
            paused={paused}
          />
          {paused ? (
            <View
              style={{
                position: 'absolute',
                top: (height - 56 - 60) / 2 - 25,
                left: width / 2 - 25,
              }}>
              <Ionicons name="play" size={50} color="rgba(255,255,255,0.5)" />
            </View>
          ) : null}
        </Pressable>
      ) : null}
      {watchCounter > 0 ? (
        <View style={[styles.timer, {bottom: 16 + insets.bottom}]}>
          <InterText style={{fontSize: 10, color: '#FFFFFF'}}>
            {Math.max(0, watchCounter)}
          </InterText>
        </View>
      ) : null}
      <ModalBase
        ref={goBackRef}
        title={t('videoAds.goBackTitle')}
        description={t('videoAds.goBackContent')}
        onConfirm={() => {
          goBackRef.current.hide();
          navigation.goBack();
        }}
      />
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
    right: 16,
  },
  ready: {
    position: 'absolute',
    top: 70,
    backgroundColor: '#333333',
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    right: 20,
    alignSelf: 'center',
  },
});
