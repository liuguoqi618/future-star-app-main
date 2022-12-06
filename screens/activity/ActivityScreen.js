import React, {  useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { getTaskProgress } from '../../apis/user';

import CustomScreenHeader from '../../components/CustomScreenHeader';
import {InterText} from '../../components/CustomText';
import ProgressBar from '../../components/progressBar/progressBar';

export default function ActivityScreen({ navigation }) {
  const {t} = useTranslation();

  const [progress, setProgress] = useState(0);
  const [possiblePoints, setPossiblePoints] = useState(0);

  useEffect(() => {
    const init = async () => {
      const {data} = await getTaskProgress();
      setProgress(data.data.total);
      setPossiblePoints(data.data.potentialEarn);
    };
    init();
  }, []);

  return (
    <View style={styles.container}>
      <CustomScreenHeader title={t('activity.title')} />

      <ScrollView>
        <View style={{ paddingHorizontal: 12, paddingVertical: 20 }}>
          <InterText weight={600} style={{fontSize: 14}}>
            {t('activity.subTitle')}
          </InterText>

          <ProgressBar progress={progress} />

          <View style={styles.earn}>
            <InterText weight={600} style={{ fontSize: 14, color: '#FFFFFF' }}>
              {t('activity.youCanEarn')}
            </InterText>
            <InterText weight={800} style={{ color: '#FFFFFF', fontSize: 28, marginVertical: 11 }}>
              {possiblePoints} FSC
            </InterText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InterText weight={500} style={{ marginRight: 5, color: '#FFFFFF', fontSize: 14 }}>
                {t('activity.yourStarCard')}
              </InterText>

              <TouchableOpacity onPress={() => navigation.navigate('Card')}>
                <InterText weight={500} style={{ color: '#FFFFFF', fontSize: 14, textDecorationLine: 'underline' }}>
                  {t('activity.viewCard')}
                </InterText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.calculation}>
            <InterText weight={700} style={{ color: '#3C464E', fontSize: 14, marginHorizontal: 16, marginVertical: 12 }}>
              {t('activity.calculateionMethod')}
            </InterText>
            <View style={styles.method}>
              <InterText weight={700} style={styles.number}>
                01
              </InterText>
              <InterText style={{ flex: 1, color: '#48535B', fontSize: 14 }}>
                {t('activity.method1')}
              </InterText>
            </View>

            <View style={styles.method}>
              <InterText weight={700} style={styles.number}>
                02
              </InterText>
              <InterText style={{ flex: 1, color: '#48535B', fontSize: 14 }}>
                {t('activity.method2')}
              </InterText>
            </View>

            <View style={styles.method}>
              <InterText weight={700} style={styles.number}>
                03
              </InterText>
              <InterText style={{ flex: 1, color: '#48535B', fontSize: 14 }}>
                {t('activity.method3')}
              </InterText>
            </View>

            <View style={styles.method}>
              <InterText weight={700} style={styles.number}>
                04
              </InterText>
              <InterText style={{ flex: 1, color: '#48535B', fontSize: 14 }}>
                {t('activity.method4')}
              </InterText>
            </View>

            {/* <View style={styles.method}>
              <InterText weight={700} style={styles.number}>
                05
              </InterText>
              <InterText style={{ flex: 1, color: '#48535B', fontSize: 14 }}>
                {t('activity.method5')}
              </InterText>
            </View> */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  earn: {
    width: '100%',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0E73F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  calculation: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#EEF0F2',
  },
  number: {
    color: '#B0BABF',
    fontSize: 28,
    marginRight: 15,
  },
});
