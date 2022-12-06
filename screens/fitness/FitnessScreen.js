import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { getStepData } from '../../apis/fitness';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import CustomScreenHeader from '../../components/CustomScreenHeader';
import {InterText, WorkSansText} from '../../components/CustomText';

export default function FitnessScreen({navigation}) {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {height} = useWindowDimensions();

  const [steps, setSteps] = useState(0)

  const [isLoading, setIsLoading] = useState(true);
  const [potentialEarn, setPotentialEarn] = useState(0);
  const [targetSteps, setTargetSteps] = useState(4000);

  const targetMet = steps >= targetSteps;

  useEffect(() => {
    const getSteps = () => {
      getStepData()
      .then(result => {
        setPotentialEarn(result.data.data.current.targetIncome);
        setTargetSteps(result.data.data.current.targetSteps);
        setSteps(result.data.data.current.steps)
      })
      .catch(e => {
        console.log(e);
      }).finally(() => {
        setIsLoading(false);
      })
    }

    setIsLoading(true)
    getSteps()

    const interval = setInterval(getSteps, 20000)

    return () => {
      clearInterval(interval)
    }
  }, []);

  return (
    <View style={styles.container}>
      <CustomScreenHeader title={t('fitness.title')} />

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: height * 0.1,
        }}>
        {!isLoading ? (
          <>
            <WorkSansText
              weight={500}
              style={{
                fontSize: 14,
                color: '#84919A',
                marginBottom: 68,
                textAlign: 'center',
              }}>
              {t('fitness.warning')}
            </WorkSansText>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <AnimatedCircularProgress
                size={200}
                width={20}
                lineCap="round"
                fill={Math.min((steps / targetSteps) * 100, 100)}
                tintColor={targetMet ? '#3CA84D' : '#7AD3FF'}
                backgroundColor={targetMet ? '#3CA84D' : '#F1FAFF'}
                arcSweepAngle={270}
                rotation={-135}
              />
              <InterText
                weight={800}
                style={{
                  fontSize: 28,
                  color: targetMet ? '#3CA84D' : '#48535B',
                  textAlign: 'center',
                  position: 'absolute',
                  zIndex: 999,
                }}>
                {targetMet
                  ? t('fitness.finished')
                  : `${steps}\n${t('fitness.steps')}`}
              </InterText>
            </View>
            <WorkSansText weight={700} style={{fontSize: 22, color: '#303940'}}>
              {steps}/{targetSteps} {t('fitness.steps')}
            </WorkSansText>
            <WorkSansText weight={500} style={{fontSize: 14, color: '#0E73F6'}}>
              {t(targetMet ? 'fitness.complete' : 'fitness.keepMoving', {
                amount: potentialEarn,
              })}
            </WorkSansText>
            <TouchableOpacity
              style={{marginTop: 68}}
              onPress={() => navigation.replace('VideoAdScreen')}>
              <WorkSansText
                weight={500}
                style={{
                  fontSize: 14,
                  color: '#84919A',
                  textDecorationLine: 'underline',
                }}>
                {t('fitness.tired')}
              </WorkSansText>
            </TouchableOpacity>
          </>
        ) : (
          <ActivityIndicator size="large" color="#0E73F6" />
        )}
      </View>
      <TouchableOpacity
        style={[styles.history, { marginBottom: insets.bottom + 16 }]}
        onPress={() => navigation.navigate('FitnessHistoryScreen')}
      >
        <InterText
          weight={600}
          style={{ fontSize: 16, color: '#0E73F6' }}
        >
          {t('fitness.viewHistory')}
        </InterText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  history: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0E73F6',
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 12,
  },
});
