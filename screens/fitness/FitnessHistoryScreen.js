import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStepHistory } from '../../apis/fitness';
import moment from 'moment';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { AntDesign } from '@expo/vector-icons';

import CustomScreenHeader from '../../components/CustomScreenHeader';
import { WorkSansText } from '../../components/CustomText';

const notCompleteIcon = require('../../assets/images/Fitness/not-complete.png')

const pageSize = 20

export default function FitnessHistoryScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  const [history, setHistory] = useState([])

  const isScrolledBottom = useRef(false);
  const loadingNewPage = useRef(false);

  useEffect(() => {
    getStepHistory({ page: 1, size: pageSize }).then(result => {
      if (result.data.data) {
        setHistory(result.data.data)
      }
    }).catch(e => {
      console.log(e)
    })
  }, [])

  const onMomentumScrollEnd = async () => {
    if (isScrolledBottom.current && !loadingNewPage.current) {
      try {
        if (history.length % pageSize !== 0) {
          return;
        }

        loadingNewPage.current = true;

        const result = await getStepHistory({
          page: Math.floor(history.length / pageSize) + 1,
          size: pageSize,
        });

        setHistory(prev => {
          let arr = [...prev, ...result.data.data];
          return arr.filter(
            (v, i, a) => a.findIndex(v2 => v2._id === v._id) === i,
          );
        });
      } catch (e) {
        console.log(e);
      } finally {
        loadingNewPage.current = false;
      }
    }
  };

  const renderItem = ({ item }) => {
    const { targetSteps, steps, targetIncome, createTime } = item
    const targetMet = steps >= targetSteps
    return (
      <View style={styles.item}>
        { targetMet ?
          <AntDesign name="checkcircle" size={30} color="#3CA84D" /> :
          <View style={{ height: 30, width: 30, justifyContent: 'center', alignItems: 'center' }}>
            <AnimatedCircularProgress
              size={30}
              width={2}
              lineCap="round"
              fill={Math.min(steps / targetSteps * 100, 100)}
              tintColor="#AAAAAA"
              backgroundColor="#EDEFFE"
              rotation={0}
            />
            <Image source={notCompleteIcon} style={{ height: 15, width: 15, position: 'absolute', zIndex: 999 }} />
          </View>
        }
        <View style={{ marginHorizontal: 8, flex: 1 }}>
          <WorkSansText weight={600} style={{ fontSize: 18, color: '#303940' }} numberOfLines={1}>
            {moment(createTime).format('MMM DD YYYY')}
          </WorkSansText>
          <WorkSansText weight={500} style={{ fontSize: 12, color: '#303940' }} numberOfLines={1}>
            {steps} {t('fitness.steps')}
          </WorkSansText>
        </View>
        <WorkSansText weight={500} style={{ fontSize: 18, color: '#303940' }}>
          {targetMet ? targetIncome : 0} FSC
        </WorkSansText>
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <CustomScreenHeader title={t('fitness.title')} />

      <FlatList
        data={history}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View
            style={{
              height: 300,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="#0E73F6" />
          </View>
        )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  item: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
    backgroundColor: '#FFFFFF',
  },
})
