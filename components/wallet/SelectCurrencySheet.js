import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import { InterText } from '../CustomText'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const fscToken = require('../../assets/images/Wallet/fsc-token.png')
const usdtToken = require('../../assets/images/Wallet/usdt-token.png')
const bnbToken = require('../../assets/images/Wallet/bnb-token.png')

const SelectCurrencySheet = React.forwardRef((props, ref) => {
  const { exclude = [], onSelect } = props
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  const currencies = [
    { id: 'FSC', image: fscToken, text: 'wallet.fsc' },
    { id: 'USDT', image: usdtToken, text: 'wallet.tether' },
    { id: 'BNB', image: bnbToken, text: 'wallet.binance' },
  ]
  const available = currencies.filter(c => !exclude.includes(c.id))

  return (
    <RBSheet
      ref={ref}
      customStyles={{ container: styles.sheetContainer }}
      animationType="slide"
      keyboardAvoidingViewEnabled
    >
      <View style={styles.sheetHeader}>
        <InterText weight={600} style={{ fontSize: 16, color: '#1A2024' }}>
          {t('wallet.selectCrypto')}
        </InterText>
      </View>

      {available.map(c =>
        <TouchableOpacity
          key={c.id}
          style={styles.item}
          onPress={() => {
            ref.current.close()
            setTimeout(() => {
              requestAnimationFrame(() => {
                onSelect(c.id)
              })
            }, 500)
          }}
        >
          <>
            <Image source={c.image} style={{ height: 27, width: 27 }} />
            <InterText weight={600} style={{ marginLeft: 8, fontSize: 14, color: '#303940' }}>
              {t(c.text)}
            </InterText>
          </>
        </TouchableOpacity>
      )}

      <View style={{ height: insets.bottom + 16 }} />
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

export default SelectCurrencySheet
