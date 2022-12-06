import React, {useState, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {changePassword} from '../../cognito';
import CustomScreenHeader from '../../components/CustomScreenHeader';
import {InterText} from '../../components/CustomText';
import {GlobalContext} from '../../context/GlobalContext';
import { setLoginCredentials } from '../../utils/storage';

const eyeIcon = require('../../assets/images/Profile/eye.png');
const eyeCrossIcon = require('../../assets/images/Profile/eye-cross.png');

export default function ResetPasswordScreen({navigation}) {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const [{ email, phoneNumber }] = useContext(GlobalContext);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const onConfirmPressed = () => {
    let userIdentity = email
    if (!email) {
      userIdentity = phoneNumber
    }

    changePassword(
      userIdentity,
      currentPassword,
      newPassword,
      () => {
        setLoginCredentials(JSON.stringify({ email, phoneNumber, newPassword }))
        navigation.goBack();
      },
      err => {
        console.log(err);
      },
    );
  };
  return (
    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
      <CustomScreenHeader title={t('profile.resetPassword')} />

      <KeyboardAwareScrollView>
        <View style={{marginVertical: 32, marginHorizontal: 20}}>
          <InterText weight={700} style={{fontSize: 28, color: '#000000'}}>
            {t('profile.resetPassword')}
          </InterText>
          <InterText style={{fontSize: 14, color: '#000000'}}>
            {t('profile.resetPassDesc')}
          </InterText>
        </View>

        <View style={{paddingHorizontal: 20}}>
          <InterText style={{fontSize: 14, color: '#252C32'}}>
            {t('profile.currentPass')}
          </InterText>

          <View style={styles.inputWrapper}>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              style={styles.input}
            />
            <Pressable onPress={() => setShowCurrentPassword(v => !v)}>
              <Image
                source={showCurrentPassword ? eyeCrossIcon : eyeIcon}
                style={{height: 24, width: 24}}
              />
            </Pressable>
          </View>

          <InterText style={{marginTop: 16, fontSize: 14, color: '#252C32'}}>
            {t('profile.newPass')}
          </InterText>

          <View style={styles.inputWrapper}>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              style={styles.input}
            />
            <Pressable onPress={() => setShowNewPassword(v => !v)}>
              <Image
                source={showNewPassword ? eyeCrossIcon : eyeIcon}
                style={{height: 24, width: 24}}
              />
            </Pressable>
          </View>

          <InterText style={{marginTop: 16, fontSize: 14, color: '#252C32'}}>
            {t('profile.repeatPass')}
          </InterText>

          <View style={styles.inputWrapper}>
            <TextInput
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              secureTextEntry={!showRepeatPassword}
              style={styles.input}
            />
            <Pressable onPress={() => setShowRepeatPassword(v => !v)}>
              <Image
                source={showRepeatPassword ? eyeCrossIcon : eyeIcon}
                style={{height: 24, width: 24}}
              />
            </Pressable>
          </View>
        </View>

        <TouchableOpacity
          style={styles.confirm}
          onPress={() => {
            onConfirmPressed();
          }}>
          <InterText weight={600} style={{fontSize: 16, color: '#FFFFFF'}}>
            {t('profile.confirm')}
          </InterText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancel}
          onPress={() => navigation.goBack()}>
          <InterText weight={600} style={{fontSize: 16, color: '#0E73F6'}}>
            {t('profile.cancel')}
          </InterText>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 40,
    marginHorizontal: 20,
  },
  cancel: {
    flexDirection: 'row',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 20,
  },
});
