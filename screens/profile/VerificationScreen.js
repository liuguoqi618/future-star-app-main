import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator, BackHandler, Image, Pressable,
  StyleSheet, TextInput, TouchableOpacity, useWindowDimensions, View,
} from 'react-native'
import { initialWindowMetrics } from 'react-native-safe-area-context'
import {useTranslation} from 'react-i18next'
import * as ImagePicker from 'expo-image-picker'
import { idTypes } from '../../utils/verification'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getVerifyStatus, submitIdVerification, uploadIDPhoto } from '../../apis/verify'

import {InterText, WorkSansText} from '../../components/CustomText'
import CustomScreenHeader from '../../components/CustomScreenHeader'
import DropDownPicker from '../../components/DropDownPicker'
import { convertFileUriToUploadInfo } from '../../utils/imageBase64Utils'
import CountryPicker from '../../components/profile/CountryPicker'

const progressCurrentIcon = require('../../assets/images/Profile/id-progress-current.png')
const progress1Icon = require('../../assets/images/Profile/id-progress-1.png')
const progress2Icon = require('../../assets/images/Profile/id-progress-2.png')
const progressCompleteIcon = require('../../assets/images/Profile/id-progress-complete.png')
const uploadIcon = require('../../assets/images/Profile/upload.png')
const redoIcon = require('../../assets/images/Profile/redo.png')
const submittedIcon = require('../../assets/images/Profile/submitted.png')

export default function VerificationScreen({navigation}) {
  const {t} = useTranslation()
  const {height} = useWindowDimensions()

  const [isLoading, setIsLoading] = useState(true)

  const [step, setStep] = useState(0)

  const step1 = [progressCurrentIcon, progressCompleteIcon, progressCompleteIcon]
  const step2 = [progress1Icon, progressCurrentIcon, progressCompleteIcon]
  const step3 = [progress2Icon, progress2Icon, progressCompleteIcon]

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthday, setBirthday] = useState('')

  const [firstNameError, setFirstNameError] = useState(false)
  const [lastNameError, setLastNameError] = useState(false)
  const [birthdayError, setBirthdayError] = useState(false)

  // const countryDropdownRef = useRef()
  const [country, setCountry] = useState()
  const [countryError, setCountryError] = useState(false)

  const idTypeDropdownRef = useRef()
  const [idType, setIdType] = useState('passport')

  const [idNumber, setIdNumber] = useState('')

  const [idNumberError, setIdNumberError] = useState(0)

  const [idPhoto, setIdPhoto] = useState()

  // const mappedCountries = countries.map(c => ({ ...c, label: t(c.label) }))
  const mappedIdTypes = idTypes.map(it => ({ ...it, label: t(it.label) }))

  const canProceed = step !== 1 || !!idPhoto

  useEffect(() => {
    getVerifyStatus().then(result => {
      if ([0, 1].includes(result.data.data.status)) {
        setStep(2)
      }
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    const backAction = () => {
      if (step === 0 || step === 2) {
        return false
      } else {
        setStep(s => s - 1)
        return true
      }
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => {
      backHandler.remove()
    }
  }, [step])

  const selectPhoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [1, 1],
      })
      setIdPhoto(result.uri)
    } catch (e) {
      console.log(e)
    }
  }

  const goToNextStep = async () => {
    if (step === 0) {
      let step1Fail = false
      if (firstName.length === 0) {
        step1Fail = true
        setFirstNameError(true)
      }
      if (lastName.length === 0) {
        step1Fail = true
        setLastNameError(true)
      }

      const dateRegex = /(19|20)[0-9]{2}[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])/
      let validDate = dateRegex.test(birthday)
      const [y, m, d] = birthday.split('-')
      validDate = validDate && !(['04','06','09','11'].includes(m) && Number(d) > 30)
      validDate = validDate && !(m === '02' && Number(d) > 29)
      if (birthday.length === 0 || !validDate) {
        step1Fail = true
        setBirthdayError(true)
      }

      if (step1Fail) {
        return
      }

      setStep(1)
    } else if (step === 1) {
      let error = false
      if (!country) {
        setCountryError(true)
        error = true
      }

      if (idNumber.length === 0) {
        setIdNumberError(1)
        error = true
      }

      if (error) {
        return
      }

      setIsLoading(true)

      try {
        const base64Img = await convertFileUriToUploadInfo(idPhoto)
        const { data: { data: { doc }}} = await uploadIDPhoto(base64Img)

        await submitIdVerification({
          firstName,
          lastName,
          birthDay: birthday,
          issueCountry: country.country.toLowerCase(),
          IDType: idType,
          IDNumber: idNumber,
          photos: [doc.URL],
        })

        setIsLoading(false)
        setStep(2)
      } catch (e) {
        console.log(e)

        if (e.response.data.message === 'duplicate id number') {
          setIdNumberError(2)
        }
        setIsLoading(false)
      }
    } else {
      navigation.goBack()
    }
  }

  useEffect(() => {
    setFirstNameError(false)
  }, [firstName])

  useEffect(() => {
    setLastNameError(false)
  }, [lastName])

  useEffect(() => {
    setBirthdayError(false)
  }, [birthday])

  const renderStep0 = () =>
    <>
      <WorkSansText weight={600} style={{ fontSize: 18, color: '#303940' }}>
        {t('profile.confirmInfo')}
      </WorkSansText>
      <InterText style={{ fontSize: 14, color: '#84919A' }}>
        {t('profile.confirmInfoDesc')}
      </InterText>

      <InterText style={{ marginTop: 24, fontSize: 14, color: '#252C32' }}>
        {t('profile.firstName')}
      </InterText>

      <View
        style={[styles.inputWrapper, firstNameError && {borderColor: '#F2271C'}]}>
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          placeholder={t('profile.inputFirstName')}
        />
      </View>

      <InterText style={{ marginTop: 16, fontSize: 14, color: '#252C32' }}>
        {t('profile.lastName')}
      </InterText>

      <View
        style={[styles.inputWrapper, lastNameError && {borderColor: '#F2271C'}]}>
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          placeholder={t('profile.inputFirstName')}
        />
      </View>

      <InterText style={{ marginTop: 16, fontSize: 14, color: '#252C32' }}>
        {t('profile.dateOfBirth')} (YYYY-MM-DD)
      </InterText>

      <View
        style={[styles.inputWrapper, birthdayError && {borderColor: '#F2271C'}]}>
        <TextInput
          value={birthday}
          onChangeText={setBirthday}
          style={styles.input}
          placeholder="YYYY-MM-DD"
        />
      </View>
    </>

  const renderStep1 = () =>
    <>
      <InterText style={{ marginTop: 24, marginBottom: 4, fontSize: 14, color: '#252C32' }}>
        {t('profile.chooseCountry')}
      </InterText>

      <CountryPicker
        value={country}
        setValue={setCountry}
        error={countryError}
      />

      <InterText style={{ marginTop: 24, marginBottom: 4, fontSize: 14, color: '#252C32' }}>
        {t('profile.selectIdType')}
      </InterText>

      <DropDownPicker
        ref={idTypeDropdownRef}
        value={idType}
        setValue={setIdType}
        options={mappedIdTypes}
      />

      <InterText style={{ marginTop: 16, fontSize: 14, color: '#252C32' }}>
        {t('profile.inputIdNumber')}
      </InterText>

      <View
        style={[styles.inputWrapper, idNumberError > 0 && {borderColor: '#F2271C'}]}>
        <TextInput
          value={idNumber}
          onChangeText={setIdNumber}
          style={styles.input}
          placeholder={t('profile.inputNumber')}
        />
      </View>

      { idNumberError > 1 ?
        <InterText style={{ fontSize: 12, color: '#F2271C' }}>
          {t('profile.error1')}
        </InterText> : null
      }

      <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center' }}>
        <InterText style={{ flex: 1, fontSize: 14, color: '#252C32' }}>
          {t('profile.uploadPhoto')}
        </InterText>

        { idPhoto ?
          <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={selectPhoto}>
            <Image source={redoIcon} style={{ height: 20, width: 20 }} />
            <InterText weight={600} style={{ fontSize: 16, color: '#0E73F6' }}>
              {t('profile.redo')}
            </InterText>
          </Pressable> : null
        }
      </View>

      { idPhoto ?
        <Image source={{ uri: idPhoto }} style={{ width: '100%', height: 200 }} /> :
        <Pressable style={styles.upload} onPress={selectPhoto}>
          <Image source={uploadIcon} style={{ height: 24, width: 24 }} />
          <InterText style={{ fontSize: 14, color: '#1A2024' }}>
            {t('profile.uploadFile')}
          </InterText>
        </Pressable>
      }
    </>

  const renderStep2 = () =>
    <>
      <View style={{ height: 400, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={submittedIcon} style={{ height: 60, width: 60 }} />
        <WorkSansText weight={600} style={{ marginTop: 16, fontSize: 18, color: '#303940' }}>
          {t('profile.idSubmitted')}
        </WorkSansText>
        <InterText style={{ marginTop: 4, textAlign: 'center', fontSize: 14, color: '#84919A' }}>
          {t('profile.weWillReview')}
        </InterText>
      </View>
    </>

  return (
    <KeyboardAwareScrollView style={[styles.container, {height, paddingBottom: initialWindowMetrics.insets.bottom}]}>
      <CustomScreenHeader
        title={t('profile.idVerif')}
        onBack={() => {
          if (step === 0 || step === 2) {
            navigation.goBack()
          } else {
            setStep(s => s - 1)
          }
        }}
      />

      { isLoading ?
        <View style={{ height: 400, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0E73F6" />
        </View> :
        <>
          <View style={{ paddingHorizontal: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 24 }}>
              <Image source={step1[step]} style={{ height: 32, width: 32 }} />
              <View style={{ flex: 1, height: 2, backgroundColor: step === 0 ? '#D1D5DB' : '#4F46E5' }} />
              <Image source={step2[step]} style={{ height: 32, width: 32 }} />
              <View style={{ flex: 1, height: 2, backgroundColor: step < 2 ? '#D1D5DB' : '#4F46E5' }} />
              <Image source={step3[step]} style={{ height: 32, width: 32 }} />
            </View>

            {step === 0 ? renderStep0() : null}
            {step === 1 ? renderStep1() : null}
            {step === 2 ? renderStep2() : null}
          </View>
          <TouchableOpacity
            style={[styles.confirm, !canProceed && styles.disabled]}
            onPress={goToNextStep}
            disabled={!canProceed}
          >
            <InterText weight={600} style={{fontSize: 16, color: '#FFFFFF'}}>
              {t(step === 0 ? 'profile.next' : (step === 1 ? 'profile.upload' : 'profile.close'))}
            </InterText>
          </TouchableOpacity>
        </>
      }

    </KeyboardAwareScrollView>
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
    paddingHorizontal: 12,
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
    marginHorizontal: 12,
    marginVertical: 20,
  },
  upload: {
    borderColor: '#D5DADD',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 6,
    height: 90,
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#B0BABF',
  },
})
