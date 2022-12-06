import React, { useEffect, useState } from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { TabBar, TabView } from 'react-native-tab-view'
import { getPartners, getMembers } from '../../apis/friend'

import Header from '../../components/friend/Header'
import { InterText } from '../../components/CustomText'
import Partner from './Partner'
import Members from './Members'

const pageSize = 30

export default function FriendScreen({ navigation }) {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'partner', title: 'friend.partner' },
    { key: 'members', title: 'friend.members' },
  ])

  const [partners, setPartners] = useState([])
  const [partnersLoaded, setPartnersLoaded] = useState(false)
  const [partnersFilter, _setPartnersFilter] = useState(-1)
  const [members, setMembers] = useState([])
  const [membersLoaded, setMembersLoaded] = useState(false)
  const [membersFilter, _setMembersFilter] = useState(-1)

  useEffect(() => {
    let filter = { page: 1, size: pageSize }
    if (partnersFilter >= 0) {
      filter = { tier: partnersFilter }
    }
    getPartners(filter).then((result) => {
      setPartners(result.data.data)
    }).catch(e => {
      console.log(e)
    }).finally(() => {
      setPartnersLoaded(true)
    })
  }, [partnersFilter])

  useEffect(() => {
    let filter = { page: 1, size: pageSize }
    if (membersFilter >= 0) {
      filter = { tier: membersFilter }
    }
    getMembers(filter).then((result) => {
      setMembers(result.data.data)
    }).catch(e => {
      console.log(e)
    }).finally(() => {
      setMembersLoaded(true)
    })
  }, [membersFilter])

  const setPartnersFilter = (value) => {
    _setPartnersFilter(v => v === value ? -1 : value)
  }

  const setMembersFilter = (value) => {
    _setMembersFilter(v => v === value ? -1 : value)
  }

  const getMorePartners = async () => {
    if (partners.length % pageSize !== 0) {
      return;
    }

    let filter = {
      page: Math.floor(partners.length / pageSize) + 1,
      size: pageSize,
    }
    if (partnersFilter >= 0) {
      filter = { tier: partnersFilter }
    }

    const result = await getPartners(filter)

    setPartners(prev => {
      let arr = [...prev, ...result.data.data];
      return arr.filter(
        (v, i, a) => a.findIndex(v2 => v2.id === v.id) === i,
      );
    });
  }

  const getMoreMembers = async () => {
    if (members.length % pageSize !== 0) {
      return;
    }

    let filter = {
      page: Math.floor(members.length / pageSize) + 1,
      size: pageSize,
    }
    if (membersFilter >= 0) {
      filter = { tier: membersFilter }
    }

    const result = await getMembers(filter)

    setMembers(prev => {
      let arr = [...prev, ...result.data.data];
      return arr.filter(
        (v, i, a) => a.findIndex(v2 => v2.id === v.id) === i,
      );
    });
  }

  const renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.tabIndicator}
        style={styles.tabBar}
        labelStyle={styles.tabLabel}
        renderLabel={({ route }) =>
          <InterText weight={600} style={styles.tabLabel}>
            {t(route.title)}
          </InterText>
        }
      />
    )
  }

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'partner':
        return (
          <Partner
            navigation={navigation}
            jumpTo={jumpTo}
            list={partners}
            loaded={partnersLoaded}
            filter={partnersFilter}
            setFilter={setPartnersFilter}
            getMore={getMorePartners}
          />
        )
      case 'members':
        return (
          <Members
            navigation={navigation}
            jumpTo={jumpTo}
            list={members}
            loaded={membersLoaded}
            filter={membersFilter}
            setFilter={setMembersFilter}
            getMore={getMoreMembers}
          />
        )
    }
  }

  return (
    <View style={styles.container}>
      <Header />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={renderTabBar}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF0F2',
  },
  tabIndicator: {
    backgroundColor: '#000000',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
  },
  tabLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#3C464E',
  },
})
