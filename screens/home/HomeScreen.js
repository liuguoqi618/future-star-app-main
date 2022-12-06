import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Image,
  View,
  Platform,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {getBanner, getFeed, getSelected} from '../../apis/article';
import PagerView from 'react-native-pager-view';
import {AntDesign, Foundation, Octicons} from '@expo/vector-icons';
import {languageToFeedFilter} from '../../locale';
import {GlobalContext} from '../../context/GlobalContext';
import {requestAppleHealth, requestGoogleFit} from '../../utils/fitness';
import {
  getShowVerificationReminder,
  setFitnessAccepted,
  setShowVerificationReminder,
} from '../../utils/storage';
import {useFocusEffect} from '@react-navigation/native';
import {getVerifyStatus} from '../../apis/verify';

import {WorkSansText} from '../../components/CustomText';
import Header from '../../components/home/ReadHeader';
import NewsItem from '../../components/home/NewsItem';
import ListSeparator from '../../components/ListSeparator';
import PinnedNewsItem from '../../components/home/PinnedNewsItem';
import RequestModal from '../../components/fitness/RequestModal';

const searchIcon = require('../../assets/images/Home/search.png');
const pageSize = 10;

export default function HomeScreen({navigation}) {
  const {t, i18n} = useTranslation();

  const [{isLoggedIn}] = useContext(GlobalContext);

  const [banner, setBanner] = useState([]);
  const [pinned, setPinned] = useState([]);
  const [homePageRefreshing, setHomepageRefreshing] = useState(false);
  const [feed, setFeed] = useState([]);

  const [bannerPosition, setBannerPosition] = useState(0);

  const [showVerifyReminder, setShowVerifyReminder] = useState(0);

  const isScrolledBottom = useRef(false);
  const loadingNewPage = useRef(false);
  const requestFitnessRef = useRef();

  const list = [
    {title: 'pinned', data: pinned},
    {title: 'feed', data: feed},
  ];

  const language = languageToFeedFilter(i18n.language);

  const startup = useCallback(async () => {
    try {
      // await pingUSServer();
      // await pingSingaporeServer();
      const f = await getFeed({page: 1, size: pageSize, language});
      if (f.data.data.articles) {
        setFeed(f.data.data.articles);
      } else {
        throw 'error';
      }

      const b = await getBanner({language});
      if (b.data.data) {
        setBanner(b.data.data);
      }

      const s = await getSelected({language});
      if (s.data.data) {
        setPinned(s.data.data.articles);
      }
    } catch (e) {
      console.log(e);
    }
  }, [language]);

  useEffect(() => {
    startup();
  }, [language, startup]);

  useFocusEffect(
    useCallback(() => {
      getShowVerificationReminder().then(async result => {
        if (!result && isLoggedIn) {
          const status = await getVerifyStatus();
          if (status.data.data.status === -1) {
            setShowVerifyReminder(true);
          } else {
            setShowVerifyReminder(false);
          }
        }
      });
      if (!isLoggedIn) {
        setShowVerifyReminder(false);
      }
    }, [isLoggedIn]),
  );

  const onMomentumScrollEnd = async () => {
    if (isScrolledBottom.current && !loadingNewPage.current) {
      try {
        if (feed.length % pageSize !== 0) {
          return;
        }

        loadingNewPage.current = true;

        const result = await getFeed({
          page: Math.floor(feed.length / pageSize) + 1,
          size: pageSize,
          language,
        });

        setFeed(prev => {
          let arr = [...prev, ...result.data.data.articles];
          return arr.filter(
            (v, i, a) => a.findIndex(v2 => v2._id === v._id) === i,
          );
        });
      } catch (e) {
        console.log(e);
      } finally {
        loadingNewPage.current = false;
      }
    }
  };

  // const tryMoveToEarn = async () => {
  //   if (!isLoggedIn) {
  //     navigation.navigate('Auth')
  //     return
  //   }

  //   const fitness = await getFitnessRequested()
  //   if (!fitness) {
  //     requestFitnessRef.current.show()
  //     setFitnessRequested('true')
  //   } else {
  //     navigation.navigate('FitnessScreen')
  //   }
  // }

  const onFitnessConfirm = async () => {
    requestFitnessRef.current.hide();
    const next = () => navigation.navigate('FitnessScreen');

    const onSuccess = () => {
      setFitnessAccepted('true');
      next();
    };

    if (Platform.OS === 'android') {
      requestGoogleFit(onSuccess, next, next);
    } else {
      requestAppleHealth(onSuccess, next, next);
    }
  };

  const onFitnessDeny = () => {
    requestFitnessRef.current.hide();
  };

  const closeVerifyReminder = () => {
    setShowVerifyReminder(false);
    setShowVerificationReminder('shown');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* <View
        style={{
          height: 54,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'red',
        }}></View> */}

      <PagerView
        style={styles.banner}
        initialPage={bannerPosition}
        onPageSelected={e => setBannerPosition(e.nativeEvent.position)}>
        {banner.map((b, i) => {
          return (
            <TouchableOpacity
              key={i.toString()}
              style={{ borderRadius: 12, overflow: 'hidden' }}
              onPress={() => {
                if (b.type === 'article') {
                  navigation.navigate('ReadScreen', {articleId: b.link});
                } else if (b.type === 'video') {
                  navigation.navigate('VideoScreen', {
                    // videoUrl: b.link,
                    videoUrl: b.videoHLS['1080'].url,
                    watchId: b._id,
                    bannerWatchTime: b.minWatchTime,
                    isAd: true,
                    isBanner: true,
                  });
                }
              }}>
              <Image
                source={{uri: b.img}}
                style={{ height: '100%', width: '100%' }}
              />
              {b.type === 'video' ? (
                <Foundation
                  name="play-video"
                  size={20}
                  color="rgba(180, 180, 180, 0.57)"
                  style={{position: 'absolute', bottom: 5, right: 5}}
                />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </PagerView>
      <View
        style={{
          alignSelf: 'center',
          position: 'absolute',
          bottom: 20,
          flexDirection: 'row',
          zIndex: 99,
        }}>
        {banner.map((b, i) => (
          <Octicons
            key={b._id}
            name="dot-fill"
            size={12}
            color={
              bannerPosition === i ? '#4F4F4F' : 'rgba(180, 180, 180, 0.57)'
            }
            style={{marginHorizontal: 3}}
          />
        ))}
      </View>
      {/* <View
        style={{
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={styles.watchVideoAdButton}
          onPress={() => {
            navigation.navigate('VideoAdScreen');
          }}>
          <InterText
            weight={600}
            style={{fontSize: 14, color: '#FFFFFF', textAlign: 'center'}}>
            {t('home.watchAds')}
          </InterText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.moveToEarnButton}
          onPress={tryMoveToEarn}>
          <InterText
            weight={600}
            style={{fontSize: 14, color: '#FFFFFF', textAlign: 'center'}}>
            {t('home.moveToEarn')}
          </InterText>
        </TouchableOpacity>
      </View> */}
    </View>
  );

  const renderSectionHeader = ({section}) => {
    if (section.title === 'feed') {
      return <View style={{height: 8}} />;
    }

    return (
      <View style={styles.sectionHeader}>
        <WorkSansText
          weight={700}
          style={{flex: 1, fontSize: 18, color: '#303940'}}>
          {t('home.starSelected')}
        </WorkSansText>

        <Pressable onPress={() => navigation.navigate('SearchScreen')}>
          <Image
            source={searchIcon}
            style={{height: 24, width: 24}}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    );
  };

  const renderItem = ({item, section}) => {
    if (section.title === 'pinned') {
      return <PinnedNewsItem article={item} />;
    }

    return <NewsItem article={item} />;
  };

  return (
    <>
      <Header />
      {showVerifyReminder ? (
        <View style={styles.verifyReminder}>
          <WorkSansText
            weight={500}
            style={{flex: 1, fontSize: 14, color: '#FFFFFF'}}>
            {t('home.verify')}{' '}
            <WorkSansText
              onPress={() =>
                navigation.navigate('Profile', {screen: 'VerificationScreen'})
              }
              style={{textDecorationLine: 'underline'}}>
              {t('home.doItNow')}
            </WorkSansText>
          </WorkSansText>
          <TouchableOpacity onPress={closeVerifyReminder}>
            <AntDesign name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ) : null}
      <View style={styles.container}>
        <SectionList
          refreshing={homePageRefreshing}
          sections={list}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          renderSectionHeader={renderSectionHeader}
          ItemSeparatorComponent={() => <ListSeparator />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View
              style={{
                height: 300,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color="#0E73F6" />
            </View>
          )}
          onScroll={({nativeEvent}) => {
            isScrolledBottom.current = isScrollToBottom(nativeEvent);
          }}
          onMomentumScrollEnd={onMomentumScrollEnd}
          refreshControl={
            <RefreshControl
              refreshing={homePageRefreshing}
              colors={['#0E73F6']}
              tintColor="#0E73F6"
              onRefresh={async () => {
                setHomepageRefreshing(true);
                await startup();
                setHomepageRefreshing(false);
              }}
            />
          }
        />

        <RequestModal
          ref={requestFitnessRef}
          onConfirm={onFitnessConfirm}
          onDeny={onFitnessDeny}
        />
      </View>
    </>
  );
}

const isScrollToBottom = nativeEvent => {
  const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF0F2',
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  sectionHeader: {
    paddingVertical: 8,
    // height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  banner: {
    marginVertical: 6,
    height: 190,
    borderRadius: 4,
    // backgroundColor: '#EEF0F2',
  },
  watchVideoAdButton: {
    flexDirection: 'row',
    backgroundColor: '#0E73F6',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
  },
  moveToEarnButton: {
    flexDirection: 'row',
    backgroundColor: '#0E73F6',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
  },
  verifyReminder: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#0E73F6',
    flexDirection: 'row',
  },
});
