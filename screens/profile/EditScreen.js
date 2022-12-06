import React, {useEffect, useRef, useState, useContext} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import {initialWindowMetrics} from 'react-native-safe-area-context'
import {InterText} from '../../components/CustomText'
import CustomScreenHeader from '../../components/CustomScreenHeader'
import {
  getUserProfile,
  updateUserName,
  updateUserAvatar,
} from '../../apis/user'
import {GlobalContext} from '../../context/GlobalContext'
import {
  fileToBase64,
  convertFileUriToUploadInfo,
} from '../../utils/imageBase64Utils'
const defaultAvatarIcon = require('../../assets/images/Profile/default-avatar.png')

export default function EditScreen({navigation}) {
  const {t} = useTranslation()
  const {height} = useWindowDimensions()
  const [state, dispatch] = useContext(GlobalContext)

  const [avatar, setAvatar] = useState()
  const [username, setUsername] = useState(state.username)

  const selectPhoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
      })
      setAvatar(result.uri)
    } catch (e) {
      console.log(e)
    }
  }

  const onSave = async () => {
    try {
      if (avatar) {
        const base64Img = await convertFileUriToUploadInfo(avatar)
        const {data} = await updateUserAvatar(base64Img)
        dispatch({
          type: 'CHANGE_AVATAR',
          data: {
            avatarUrl: data.data + '?a=' + Date.now(),
          },
        })
      }

      if (username !== state.username) {
        await updateUserName(username)
        dispatch({
          type: 'CHANGE_USERNAME',
          data: {
            username,
          },
        })
      }

      navigation.goBack()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <View style={[styles.container, {height, paddingBottom: initialWindowMetrics.insets.bottom}]}>
      <CustomScreenHeader title={t('profile.editProfile')} />

      <ScrollView>
        <View style={{alignItems: 'center', marginVertical: 40}}>
          <Image
            source={
              avatar ? { uri: avatar } : (
                state.avatarUrl ? {uri: state.avatarUrl} : defaultAvatarIcon
              )
            }
            style={{height: 80, width: 80, marginBottom: 12, borderRadius: 40}}
          />
          <TouchableOpacity onPress={selectPhoto}>
            <InterText weight={700} style={{fontSize: 14, color: '#0E73F6'}}>
              {t('profile.changePhoto')}
            </InterText>
          </TouchableOpacity>
        </View>

        <View style={{marginHorizontal: 20}}>
          <InterText style={{marginTop: 16, fontSize: 14, color: '#252C32'}}>
            {t('profile.yourUsername')}
          </InterText>

          <View style={styles.inputWrapper}>
            <TextInput
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.confirm}
        onPress={onSave}>
        <InterText weight={600} style={{fontSize: 16, color: '#FFFFFF'}}>
          {t('profile.save')}
        </InterText>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    borderColor: '#DDE2E4',
    borderWidth: 1,
    marginTop: 4,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#252C32',
    marginRight: 16,
    height: 40,
  },
  confirm: {
    flexDirection: 'row',
    backgroundColor: '#0E73F6',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
})
