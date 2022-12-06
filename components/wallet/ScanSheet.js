import React, { useRef } from 'react'
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import { InterText } from '../CustomText'
import { AntDesign } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BarCodeScanner } from 'expo-barcode-scanner'

const ScanSheet = React.forwardRef((props, ref) => {
  const { setAddress } = props
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()

  const scanned = useRef(false)

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned.current) {
      scanned.current = true
      setAddress(data)
      ref.current.close()
    }
  }

  return (
    <RBSheet
      ref={ref}
      customStyles={{ container: styles.sheetContainer }}
      animationType="slide"
      keyboardAvoidingViewEnabled
      onOpen={() => {
        scanned.current = false
      }}
    >
      <View style={styles.sheetHeader}>
        <InterText weight={600} style={{ fontSize: 16, color: '#1A2024' }}>
          {t('wallet.scanTitle')}
        </InterText>
        <TouchableOpacity
          onPress={() => ref.current.close()}
          style={{ position: 'absolute', right: 20 }}
        >
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={{ height: width * 16 / 9, justifyContent: 'center', alignItems: 'center' }}>
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      <View style={{ height: insets.bottom }} />
    </RBSheet>
  )
})

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 'auto',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    paddingVertical: 16,
    borderBottomColor: '#EEF0F2',
    borderBottomWidth: 1,
  },
  item: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
})

export default ScanSheet
