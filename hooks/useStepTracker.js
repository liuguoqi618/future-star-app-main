import { useRef, useEffect, useState } from 'react';
import { Pedometer } from 'expo-sensors';
import CryptoAES from 'crypto-js/aes';
import configs from '../configs';
import { recordStepData } from '../apis/fitness';

export default function useStepTracker(isLoggedIn) {
  const [steps, setSteps] = useState(0)
  const [updateTime, setUpdateTime] = useState(new Date())
  const sentTimeRef = useRef(new Date())
  const subscriptionRef = useRef()

  useEffect(() => {
    const getSteps = async () => {
      subscriptionRef.current = Pedometer.watchStepCount(result => {
        if (isLoggedIn) {
          setSteps(result.steps)
        }
      })
    }

    getSteps()

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove()
      }
    }
  }, [isLoggedIn])

  useEffect(() => {
    setUpdateTime(new Date())
  }, [steps])

  useEffect(() => {
    // console.log('steps: ' + steps + ' updatetime: ' + updateTime)
    if (isLoggedIn && ((steps > 100) || (updateTime - sentTimeRef.current > 30000 && steps > 1))) {
      const message = { steps };
      const cipher = CryptoAES.encrypt(
        JSON.stringify(message),
        configs.ARTICLE_READ_KEY,
      ).toString();
      recordStepData(cipher);

      sentTimeRef.current = new Date()

      subscriptionRef.current.remove()
      subscriptionRef.current = Pedometer.watchStepCount(result => {
        if (isLoggedIn) {
          setSteps(result.steps)
        }
      })
    }
  }, [steps, updateTime, isLoggedIn])

  return {
    steps, updateTime,
  };

  // const enabledRef = useRef()

  // const subscriptionRef = useRef()
  // const stepsRef = useRef(0)
  // const oldStepsRef = useRef(0)

  // const appState = useRef(AppState.currentState);

  // useEffect(() => {
  //   const getSteps = async () => {
  //     enabledRef.current = false
  //     const accepted = await getFitnessAccepted()
  //     if (!accepted || !isLoggedIn) {
  //       return
  //     }

  //     enabledRef.current = true

  //     if (Platform.OS === 'android') {
  //       request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION)
  //     } else {
  //       request(PERMISSIONS.IOS.MOTION)
  //     }

  //     subscriptionRef.current = Pedometer.watchStepCount(result => {
  //       stepsRef.current = result.steps
  //     })
  //   }

  //   getSteps()

  //   if (!isLoggedIn) {
  //     stepsRef.current = 0
  //     oldStepsRef.current = 0
  //   }

  //   return () => {
  //     if (subscriptionRef.current) {
  //       subscriptionRef.current.remove()
  //     }
  //   }
  // }, [isLoggedIn])

  // useEffect(() => {
  //   const updateSteps = () => {
  //     console.log('steps: ' + stepsRef.current)
  //     if (enabledRef.current) {
  //       const message = { steps: stepsRef.current - oldStepsRef.current };
  //       const cipher = CryptoAES.encrypt(
  //         JSON.stringify(message),
  //         configs.ARTICLE_READ_KEY,
  //       ).toString();
  //       recordStepData(cipher);
  //       oldStepsRef.current = stepsRef.current
  //     }
  //   }

  //   const interval = setInterval(updateSteps, 3 * 60000);

  //   // handle app minimize and focus
  //   const subscription = AppState.addEventListener('change', nextAppState => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === 'active'
  //     ) {
  //       setTimeout(updateSteps, 1000)
  //     }

  //     appState.current = nextAppState;
  //   });

  //   return () => {
  //     subscription.remove()
  //     clearInterval(interval)
  //   }
  // }, [])

  // return {
  //   stepsRef,
  // };
}
