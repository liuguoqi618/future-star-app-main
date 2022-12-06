import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'

import StorageKey from '../constants/storage'

export const setRefreshToken = async (token) => {
  try {
    await SecureStore.setItemAsync(StorageKey.REFRESH_TOKEN, token)
  } catch (e) {
    console.log(e)
  }
}

export const getRefreshToken = async () => {
  try {
    return await SecureStore.getItemAsync(StorageKey.REFRESH_TOKEN)
  } catch (e) {
    console.log(e)
  }
}

export const removeRefreshToken = async () => {
  try {
    await SecureStore.deleteItemAsync(StorageKey.REFRESH_TOKEN)
  } catch (e) {
    console.log(e)
  }
}

export const setLoginCredentials = async (credentials) => {
  try {
    await AsyncStorage.setItem(StorageKey.FIRST_INSTALLED, 'installed')
    await SecureStore.setItemAsync(StorageKey.LOGIN_CREDENTIALS, credentials)
  } catch (e) {
    console.log(e)
  }
}

export const getLoginCredentials = async () => {
  try {
    const installed = await AsyncStorage.getItem(StorageKey.FIRST_INSTALLED)

    if (installed) {
      return await SecureStore.getItemAsync(StorageKey.LOGIN_CREDENTIALS)
    } else {
      return null
    }
  } catch (e) {
    console.log(e)
  }
}

export const removeLoginCredentials = async () => {
  try {
    await SecureStore.deleteItemAsync(StorageKey.LOGIN_CREDENTIALS)
  } catch (e) {
    console.log(e)
  }
}

export const setAppLocale = async (locale) => {
  try {
    await AsyncStorage.setItem(StorageKey.APP_LOCALE, locale)
  } catch (e) {
    console.log(e)
  }
}

export const getAppLocale = async () => {
  try {
    return await AsyncStorage.getItem(StorageKey.APP_LOCALE)
  } catch (e) {
    console.log(e)
  }
}

export const removeAppLocale = async () => {
  try {
    await AsyncStorage.removeItem(StorageKey.APP_LOCALE)
  } catch (e) {
    console.log(e)
  }
}

export const setProgressReached = async (value) => {
  try {
    await AsyncStorage.setItem(StorageKey.PROGRESS_REACHED, value)
  } catch (e) {
    console.log(e)
  }
}

export const getProgressReached = async () => {
  try {
    return await AsyncStorage.getItem(StorageKey.PROGRESS_REACHED)
  } catch (e) {
    console.log(e)
  }
}

export const removeProgressReached = async () => {
  try {
    await AsyncStorage.removeItem(StorageKey.PROGRESS_REACHED)
  } catch (e) {
    console.log(e)
  }
}

export const setFitnessRequested = async (value) => {
  try {
    await AsyncStorage.setItem(StorageKey.FITNESS_REQUESTED, value)
  } catch (e) {
    console.log(e)
  }
}

export const getFitnessRequested = async () => {
  try {
    return await AsyncStorage.getItem(StorageKey.FITNESS_REQUESTED)
  } catch (e) {
    console.log(e)
  }
}

export const removeFitnessRequested = async () => {
  try {
    await AsyncStorage.removeItem(StorageKey.FITNESS_REQUESTED)
  } catch (e) {
    console.log(e)
  }
}

export const setFitnessAccepted = async (value) => {
  try {
    await AsyncStorage.setItem(StorageKey.FITNESS_ACCEPTED, value)
  } catch (e) {
    console.log(e)
  }
}

export const getFitnessAccepted = async () => {
  try {
    return await AsyncStorage.getItem(StorageKey.FITNESS_ACCEPTED)
  } catch (e) {
    console.log(e)
  }
}

export const removeFitnessAccepted = async () => {
  try {
    await AsyncStorage.removeItem(StorageKey.FITNESS_ACCEPTED)
  } catch (e) {
    console.log(e)
  }
}

export const setLastStepCount = async (value) => {
  try {
    await AsyncStorage.setItem(StorageKey.LAST_STEP_COUNT, value)
  } catch (e) {
    console.log(e)
  }
}

export const getLastStepCount = async () => {
  try {
    return await AsyncStorage.getItem(StorageKey.LAST_STEP_COUNT)
  } catch (e) {
    console.log(e)
  }
}

export const removeLastStepCount = async () => {
  try {
    await AsyncStorage.removeItem(StorageKey.LAST_STEP_COUNT)
  } catch (e) {
    console.log(e)
  }
}

export const setShowVerificationReminder = async (value) => {
  try {
    await AsyncStorage.setItem(StorageKey.SHOW_VERIFICATION_REMINDER, value)
  } catch (e) {
    console.log(e)
  }
}

export const getShowVerificationReminder = async () => {
  try {
    return await AsyncStorage.getItem(StorageKey.SHOW_VERIFICATION_REMINDER)
  } catch (e) {
    console.log(e)
  }
}

export const removeShowVerificationReminder = async () => {
  try {
    await AsyncStorage.removeItem(StorageKey.SHOW_VERIFICATION_REMINDER)
  } catch (e) {
    console.log(e)
  }
}

export const setShowVerificationFailed = async (value) => {
  try {
    await AsyncStorage.setItem(StorageKey.SHOW_VERIFICATION_FAILED, value)
  } catch (e) {
    console.log(e)
  }
}

export const getShowVerificationFailed = async () => {
  try {
    return await AsyncStorage.getItem(StorageKey.SHOW_VERIFICATION_FAILED)
  } catch (e) {
    console.log(e)
  }
}

export const removeShowVerificationFailed = async () => {
  try {
    await AsyncStorage.removeItem(StorageKey.SHOW_VERIFICATION_FAILED)
  } catch (e) {
    console.log(e)
  }
}
