import React, {useEffect, useState} from 'react';
import { View } from 'react-native';
import {InterText} from '../../components/CustomText';

export default function ProgressBar({ progress }) {
  const [progressDot, setProgressDot] = useState(0);
  let capped = Math.min(Math.max(progress, 0), 100)

  useEffect(() => {
    const getCalculatedProgress = () => {
      if (capped < 5) {
        setProgressDot(0.2);
      } else if (capped >= 98) {
        setProgressDot(94);
      } else {
        setProgressDot(capped - 4);
      }
    };
    getCalculatedProgress();
  }, [capped]);

  return (
    <View
      style={{
        marginTop: 10,
        paddingBottom: 20,
      }}>
      <View
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 3,
        }}>
        <InterText
          weight={600}
          style={{
            fontSize: 16,
            lineHeight: 22,
            marginLeft: 3,
          }}>
          0
        </InterText>
        <InterText
          weight={600}
          style={{
            fontSize: 16,
            lineHeight: 22,
            marginRight: -6,
          }}>
          100
        </InterText>
      </View>
      <View
        style={{
          position: 'relative',
          width: '100%',
          backgroundColor: '#D5DADD',
          height: 16,
          borderRadius: 100,
        }}>
        <View
          style={{
            width: `${capped}%`,
            backgroundColor: '#0E73F6',
            height: 16,
            borderRadius: 100,
          }} />
        <View
          style={{
            position: 'absolute',
            left: `${progressDot}%`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 16,
              height: 16,
              backgroundColor: '#0452C8',
              borderRadius: 100,
            }}
          />
          <InterText
            weight={600}
            style={{
              fontSize: 16,
              lineHeight: 22,
              color: '#0E73F6',
            }}>
            {progress}
          </InterText>
        </View>
      </View>
    </View>
  );
}
