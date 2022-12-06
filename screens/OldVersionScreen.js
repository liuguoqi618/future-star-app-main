import React, { useRef } from 'react'
import { Image, Linking, Platform, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { t } from 'i18next'
import configs from '../configs';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RNFetchBlob from 'rn-fetch-blob'

import { InterText } from '../components/CustomText'
import DownloadModal from '../components/oldVersion/DownloadModal'

const newVersionImage = require('../assets/images/Other/new-version.png')

const website = 'https://www.futurestargroup.com?jumpapp=true'
const testflight = 'https://testflight.apple.com/join/LvRqiBAd'
const googleplay = 'https://future-star-prod-asset.s3.amazonaws.com/future-star.apk'

export default function OldVersionScreen() {
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const modalRef = useRef()

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Image source={newVersionImage} style={{ width: width - 40, height: (width - 40) * 0.5637 }} />
        <InterText weight={700} style={{ fontSize: 20, color: '#1A2024', marginTop: 16, textAlign: 'center' }}>
          {t('oldVersion.text3')}{' '}
          <InterText weight={700} style={{ color: '#0E73F6' }}>
            V1.0.{(Number(configs.APP_VERSION) + 1)}
          </InterText>
        </InterText>
      </View>
      <TouchableOpacity onPress={() => {
        // if (Platform.OS === 'android') {
        //   modalRef.current.show()
        //   // Toast.show({ type: 'info', text1: t('oldVersion.text5') })
        //   RNFetchBlob
        //     .config({
        //         addAndroidDownloads : {
        //             useDownloadManager : true, // <-- this is the only thing required
        //             // Optional, override notification setting (default to true)
        //             notification : true,
        //             // Optional, but recommended since android DownloadManager will fail when
        //             // the url does not contains a file extension, by default the mime type will be text/plain
        //             path: RNFetchBlob.fs.dirs.DownloadDir + `/future-star-v1-0-${(Number(configs.APP_VERSION) + 1)}.apk`,
        //             description : 'File downloaded by download manager.',
        //         },
        //     })
        //     .fetch('GET', googleplay)
        //     .then(() => {
        //       modalRef.current.finishLoading()
        //       // Toast.show({ type: 'info', text1: t('oldVersion.text6') })
        //     })
        // } else {
        //   Linking.openURL(testflight)
        // }
        Linking.openURL(website)
      }}>
        <LinearGradient
          colors={['#53B5FF', '#1472FF']}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}
          style={[styles.button, { marginBottom: insets.bottom + 16 }]}
        >
          <InterText weight={600} style={{ fontSize: 14, color: '#FFFFFF' }}>
            {t('oldVersion.text4')}
          </InterText>
        </LinearGradient>
      </TouchableOpacity>
      {/* <WorkSansText weight={700} style={{ fontSize: 26, color: '#303940', textAlign: 'center' }}>
        {t('oldVersion.text1')}
      </WorkSansText>
      <WorkSansText weight={500} style={{ fontSize: 16, color: '#303940', textAlign: 'center' }}>
        {t('oldVersion.text2')}
        <Pressable onPress={() => Linking.openURL(website)}>
          <WorkSansText style={{ color: '#0E73F6', textDecorationLine: 'underline' }}>
            {website}
          </WorkSansText>
        </Pressable>
      </WorkSansText> */}

      <DownloadModal ref={modalRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  button: {
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
