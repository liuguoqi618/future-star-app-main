import StorageKey from '../constants/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Localization from 'expo-localization'
import moment from 'moment'
import 'moment/locale/zh-cn'
import 'moment/locale/zh-hk'
import 'moment/locale/es'
import 'moment/locale/pt'
import { setAppLocale } from '../utils/storage'

export { default as en } from './en';
export { default as zhch } from './zh-ch';
export { default as zhhk } from './zh-hk';
export { default as es } from './es';
export { default as pt } from './pt';

export const getCurrentLocale = async () => {
  const value = await AsyncStorage.getItem(StorageKey.APP_LOCALE)
  if (value !== null) {
    if (value === 'zhch') {
      moment.locale('zh-cn')
    } else if (value === 'zhhk') {
      moment.locale('zh-hk')
    } else {
      moment.locale('en')
    }
    return value
  }

  let locale = Localization.locale
  if (['zh-hant', 'zh_hant', 'zh-cn', 'zh_cn', 'zh'].includes(locale.toLowerCase())) {
    moment.locale('zh-cn')
    return 'zhch'
  } else if (['zh-hans', 'zh_hans', 'zh-hk', 'zh_hk'].includes(locale.toLowerCase())) {
    moment.locale('zh-hk')
    return 'zhhk'
  } else {
    moment.locale('en')
    return 'en'
  }
}

export const storeLocale = (locale) => {
  setAppLocale(locale)

  if (locale === 'zhch') {
    moment.locale('zh-cn')
  } else if (locale === 'zhhk') {
    moment.locale('zh-hk')
  } else if (locale === 'es') {
    moment.locale('es')
  } else if (locale === 'pt') {
    moment.locale('pt')
  } else {
    moment.locale('en')
  }
}

export const languageOptions = [
  { value: 'en', label: 'English'},
  // { value: 'zhhk', label: '繁體中文'},
  { value: 'zhch', label: '简体中文'},
  { value: 'es', label: 'español' },
  { value: 'pt', label: 'Português' },
]

export const languageToFeedFilter = (language) => {
  switch (language) {
    case 'en':
      return 'English'
    case 'zhch':
      return 'Chinese'
    case 'pt':
      return 'Portuguese'
    case 'es':
      return 'Spanish'
    default:
      return ''
  }
}
