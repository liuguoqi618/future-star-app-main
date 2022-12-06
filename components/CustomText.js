import React from 'react'
import { Text } from 'react-native'

export const WorkSansText = ({
  style,
  italics = false,
  weight,
  children,
  ...rest
}) => {
  let family = !italics ? 'WorkSans' : 'WorkSansItalics'
  let selectedFont = weight ? styles[family][weight] : styles[family]['400']

  return (
    <Text style={[ style, selectedFont ]} {...rest}>
      {children}
    </Text>
  )
}

export const InterText = ({
  style,
  weight,
  children,
  ...rest
}) => {
  let family = 'Inter'
  let selectedFont = weight ? styles[family][weight] : styles[family]['400']

  return (
    <Text style={[ style, selectedFont ]} {...rest}>
      {children}
    </Text>
  )
}

export const PoppinsText = ({
  style,
  italics = false,
  weight,
  children,
  ...rest
}) => {
  let family = !italics ? 'Poppins' : 'PoppinsItalics'
  let selectedFont = weight ? styles[family][weight] : styles[family]['400']

  return (
    <Text style={[ style, selectedFont ]} {...rest}>
      {children}
    </Text>
  )
}

const styles = {
  'WorkSans': {
    '100': { fontFamily: 'WorkSans_100Thin' },
    '200': { fontFamily: 'WorkSans_200ExtraLight' },
    '300': { fontFamily: 'WorkSans_300Light' },
    '400': { fontFamily: 'WorkSans_400Regular' },
    '500': { fontFamily: 'WorkSans_500Medium' },
    '600': { fontFamily: 'WorkSans_600SemiBold' },
    '700': { fontFamily: 'WorkSans_700Bold' },
    '800': { fontFamily: 'WorkSans_800ExtraBold' },
    '900': { fontFamily: 'WorkSans_900Black' },
  },
  'WorkSansItalics': {
    '100': { fontFamily: 'WorkSans_100Thin_Italic' },
    '200': { fontFamily: 'WorkSans_200ExtraLight_Italic' },
    '300': { fontFamily: 'WorkSans_300Light_Italic' },
    '400': { fontFamily: 'WorkSans_400Regular_Italic' },
    '500': { fontFamily: 'WorkSans_500Medium_Italic' },
    '600': { fontFamily: 'WorkSans_600SemiBold_Italic' },
    '700': { fontFamily: 'WorkSans_700Bold_Italic' },
    '800': { fontFamily: 'WorkSans_800ExtraBold_Italic' },
    '900': { fontFamily: 'WorkSans_900Black_Italic' },
  },
  'Inter': {
    '100': { fontFamily: 'Inter_100Thin' },
    '200': { fontFamily: 'Inter_200ExtraLight' },
    '300': { fontFamily: 'Inter_300Light' },
    '400': { fontFamily: 'Inter_400Regular' },
    '500': { fontFamily: 'Inter_500Medium' },
    '600': { fontFamily: 'Inter_600SemiBold' },
    '700': { fontFamily: 'Inter_700Bold' },
    '800': { fontFamily: 'Inter_800ExtraBold' },
    '900': { fontFamily: 'Inter_900Black' },
  },
  'Poppins': {
    '100': { fontFamily: 'Poppins_100Thin' },
    '200': { fontFamily: 'Poppins_200ExtraLight' },
    '300': { fontFamily: 'Poppins_300Light' },
    '400': { fontFamily: 'Poppins_400Regular' },
    '500': { fontFamily: 'Poppins_500Medium' },
    '600': { fontFamily: 'Poppins_600SemiBold' },
    '700': { fontFamily: 'Poppins_700Bold' },
    '800': { fontFamily: 'Poppins_800ExtraBold' },
    '900': { fontFamily: 'Poppins_900Black' },
  },
  'PoppinsItalics': {
    '100': { fontFamily: 'Poppins_100Thin_Italic' },
    '200': { fontFamily: 'Poppins_200ExtraLight_Italic' },
    '300': { fontFamily: 'Poppins_300Light_Italic' },
    '400': { fontFamily: 'Poppins_400Regular_Italic' },
    '500': { fontFamily: 'Poppins_500Medium_Italic' },
    '600': { fontFamily: 'Poppins_600SemiBold_Italic' },
    '700': { fontFamily: 'Poppins_700Bold_Italic' },
    '800': { fontFamily: 'Poppins_800ExtraBold_Italic' },
    '900': { fontFamily: 'Poppins_900Black_Italic' },
  },
}
