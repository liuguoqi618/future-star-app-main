import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, View } from 'react-native'
import { formatBalance } from '../../utils/numbers'

import { InterText } from '../CustomText'

const defaultAvatarIcon = require('../../assets/images/Friend/default-avatar.png')
const tokenIcon = require('../../assets/images/Friend/token.png')
const starIcon = require('../../assets/images/Friend/star.png')
const starGreyIcon = require('../../assets/images/Friend/star-grey.png')

export default function MemberItem({ user, tier, star, totalSharing }) {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Image
          source={user.avatarUrl ? { uri: user.avatarUrl } : defaultAvatarIcon}
          style={{ height: 46, width: 46, borderRadius: 23 }}
        />
        <View style={{ marginLeft: 8, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <InterText weight={600} style={{ flex: 1, fontSize: 16, color: '#3C464E' }} numberOfLines={1}>
              {user.userName}
            </InterText>
            <View style={styles.tier}>
              <InterText weight={600} style={{ fontSize: 12, color: '#3C464E' }}>
                {t('friend.tier', { tier })}
              </InterText>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <InterText
              weight={500}
              style={{ flex: 1, fontSize: 12, color: '#3C464E' }}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {user.email ? user.email : user.phoneNumber}
            </InterText>
            <InterText weight={500} style={{ fontSize: 10, color: '#9AA6AC' }}>
              {moment(user.createTime).format('MMM DD, YYYY')}
            </InterText>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
        { star >= 0 ?
          <View style={styles.greyWrapper}>
            { star === 0 ?
              <Image source={starGreyIcon} style={{ height: 12, width: 12 }} /> : null
            }
            { Array.from(Array(star).keys()).map(s =>
              <Image key={s} source={starIcon} style={{ height: 12, width: 12 }} />
            )}
          </View> : null
        }
        <View style={{ flex: 1 }} />
        <InterText weight={500} style={{ fontSize: 10, color: '#3C464E', marginRight: 5 }}>
          {t('friend.totalSharing')}
        </InterText>
        <Image source={tokenIcon} style={{ height: 16, width: 16}} />
        <InterText weight={600} style={{ marginLeft: 5, fontSize: 14, color: '#0E73F6' }} numberOfLines={1}>
          {formatBalance(totalSharing)} FSC
        </InterText>
      </View>
      { false ?
        <View style={styles.cannotShare}>
          <InterText style={{ fontSize: 12, color: '#F2271C' }}>
            {t('friend.cannotShare')}
          </InterText>
        </View> : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    marginHorizontal: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
    borderRadius: 4,
  },
  tier: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 22,
    paddingHorizontal: 8,
    backgroundColor: '#EEF0F2',
  },
  greyWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 19,
    paddingHorizontal: 8,
    backgroundColor: '#F6F8F9',
  },
  cannotShare: {
    marginTop: 16,
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#FED6CD',
  },
})
