import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { MenuProvider } from 'react-native-popup-menu'
import * as SplashScreen from 'expo-splash-screen'
import { enableScreens } from 'react-native-screens'
import * as Linking from 'expo-linking'
import moment from 'moment-timezone'
import * as Sentry from '@sentry/react-native'

import RootNavigator from './navigation'

import {
  useFonts as useWorkSansFonts,
  WorkSans_100Thin,
  WorkSans_200ExtraLight,
  WorkSans_300Light,
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
  WorkSans_800ExtraBold,
  WorkSans_900Black,
  WorkSans_100Thin_Italic,
  WorkSans_200ExtraLight_Italic,
  WorkSans_300Light_Italic,
  WorkSans_400Regular_Italic,
  WorkSans_500Medium_Italic,
  WorkSans_600SemiBold_Italic,
  WorkSans_700Bold_Italic,
  WorkSans_800ExtraBold_Italic,
  WorkSans_900Black_Italic,
} from '@expo-google-fonts/work-sans'
import {
  useFonts as useInterFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter'
import {
  useFonts as usePoppinsFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from '@expo-google-fonts/poppins'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en, zhch, zhhk, pt, es, getCurrentLocale } from './locale'

import GlobalProvider from './context/GlobalContext'

import ToastProvider from './components/Toast'

enableScreens()

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3',
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
        translation: en,
      },
      zhch: {
        translation: zhch,
      },
      zhhk: {
        translation: zhhk,
      },
      es: {
        translation: es,
      },
      pt: {
        translation: pt,
      },
    },
    lng: 'en', // if you're using a language detector, do not define the lng option
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  })

const prefix = Linking.createURL('/')

Sentry.init({
  dsn: 'https://86302863725742e480ac51538bad98f2@o4504141486161920.ingest.sentry.io/4504192755499008',
})

const App = () => {
  let [workSansLoaded] = useWorkSansFonts({
    WorkSans_100Thin,
    WorkSans_200ExtraLight,
    WorkSans_300Light,
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
    WorkSans_800ExtraBold,
    WorkSans_900Black,
    WorkSans_100Thin_Italic,
    WorkSans_200ExtraLight_Italic,
    WorkSans_300Light_Italic,
    WorkSans_400Regular_Italic,
    WorkSans_500Medium_Italic,
    WorkSans_600SemiBold_Italic,
    WorkSans_700Bold_Italic,
    WorkSans_800ExtraBold_Italic,
    WorkSans_900Black_Italic,
  })

  let [interLoaded] = useInterFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  })

  let [poppinsLoaded] = usePoppinsFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  })

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        SplashScreen: '*',
        Main: {
          screens: {
            Home: {
              initialRouteName: 'HomeScreen',
              screens: {
                ReadScreen: 'article/:articleId',
              },
            },
          },
        },
      },
    },
  }

  useEffect(() => {
    const startup = async () => {
      await SplashScreen.preventAutoHideAsync()
      const locale = await getCurrentLocale()
      i18n.changeLanguage(locale)
      moment.tz.setDefault('America/Toronto')
    }

    startup()
  }, [])

  if (!interLoaded || !workSansLoaded || !poppinsLoaded) {
    return null
  }

  return (
    <SafeAreaProvider>
      <GlobalProvider>
        <MenuProvider>
          <NavigationContainer linking={linking}>
            <RootNavigator />
          </NavigationContainer>
        </MenuProvider>
        <ToastProvider />
      </GlobalProvider>
    </SafeAreaProvider>
  )
}

export default Sentry.wrap(App)
// export default App
