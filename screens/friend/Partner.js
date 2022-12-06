import React, { useRef } from 'react'
import { ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import MemberItem from '../../components/friend/MemberItem'
import { InterText, WorkSansText } from '../../components/CustomText'
import DropDownPicker from '../../components/DropDownPicker'

const inviteWhiteIcon = require('../../assets/images/Friend/invite-white.png')
const membersEmpty = require('../../assets/images/Friend/members-empty.png')

function Partner({ navigation, list, loaded, filter, setFilter, getMore }) {
  const { t } = useTranslation()

  const isScrolledBottom = useRef(false);
  const loadingNewPage = useRef(false);
  const dropDownRef = useRef()

  const filterOptions = [
    {label: t('friend.all'), value: -1 },
    {label: t('friend.tier', { tier: 1 }), value: 1 },
    {label: t('friend.tier', { tier: 2 }), value: 2 },
    {label: t('friend.tier', { tier: 3 }), value: 3 },
    {label: t('friend.tier', { tier: 4 }), value: 4 },
    {label: t('friend.tier', { tier: 5 }), value: 5 },
    {label: t('friend.tier', { tier: 6 }), value: 6 },
    {label: t('friend.tier', { tier: 7 }), value: 7 },
    {label: t('friend.tier', { tier: 8 }), value: 8 },
    {label: t('friend.tier', { tier: 9 }), value: 9 },
    {label: t('friend.tier', { tier: 10 }), value: 10 },
  ]

  const onMomentumScrollEnd = async () => {
    if (isScrolledBottom.current && !loadingNewPage.current) {
      try {
        loadingNewPage.current = true;

        await getMore()
      } catch (e) {
        console.log(e);
      } finally {
        loadingNewPage.current = false;
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterWrapper}>
        <DropDownPicker
          ref={dropDownRef}
          value={filter}
          setValue={setFilter}
          options={filterOptions}
        />
      </View>
      <FlatList
        data={list}
        renderItem={({item}) =>
          <MemberItem {...item} />
        }
        ListEmptyComponent={() =>
          !loaded ?
          <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0E73F6" />
          </View> :
          <View style={{ height: 300, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            <Image source={membersEmpty} />
            <WorkSansText weight={700} style={{ fontSize: 22, color: '#303940', marginBottom: 12 }}>
              {t('friend.noMembers1')}
            </WorkSansText>
            <InterText style={{ textAlign: 'center', fontSize: 14, color: '#303940', lineHeight: 20 }}>
              {t('friend.noMembers2')}
            </InterText>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.invite} onPress={() => navigation.navigate('InviteScreen')}>
            <Image source={inviteWhiteIcon} style={{ width: 24, height: 24 }} />
            <InterText weight={600} style={{ marginLeft: 8, fontSize: 16, color: '#FFFFFF' }}>
              {t('friend.invite')}
            </InterText>
          </TouchableOpacity>
        }
        ListHeaderComponent={
          <>
            { loaded ?
              <InterText weight={600} style={{ textAlign: 'center', fontSize: 12, color: '#B0BABF' }}>
                {t('friend.showingUsers', { count: list.length, plural: list.length !== 1 ? 's' : '' })}
              </InterText> : null
            }
          </>
        }
        onScroll={({nativeEvent}) => {
          isScrolledBottom.current = isScrollToBottom(nativeEvent);
        }}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />
    </View>
  )
}

const isScrollToBottom = nativeEvent => {
  const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
};

export default React.memo(Partner)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterWrapper: {
    // height: 72,
    paddingHorizontal: 12,
    paddingVertical: 16,
    // backgroundColor: '#FFFFFF',
    // borderBottomWidth: 1,
    // borderBottomColor: '#EEF0F2',
    // zIndex: 2000,
  },
  filter: {
    height: 40,
    minHeight: 40,
    borderColor: '#DDE2E4',
    borderRadius: 4,
  },
  filterText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#303940',
  },
  filterPlaceholder: {
    color: '#84919A',
  },
  filterDropdown: {
    borderColor: '#DDE2E4',
    borderRadius: 4,
  },
  invite: {
    flexDirection: 'row',
    backgroundColor: '#0E73F6',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 40,
  },
})
