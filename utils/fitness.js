
// DEPRECATED

// import GoogleFit, {Scopes} from 'react-native-google-fit';
// import AppleHealthKit, {
//   HealthValue,
//   HealthKitPermissions,
// } from 'react-native-health';
// import moment from 'moment';

// export const requestGoogleFit = (onSuccess, onFail, onError) => {
//   const options = {
//     scopes: [Scopes.FITNESS_ACTIVITY_READ],
//   };
//   GoogleFit.authorize(options)
//     .then(authResult => {
//       if (authResult.success) {
//         if (onSuccess) {
//           onSuccess();
//         }
//       } else {
//         console.log('AUTH_DENIED ' + authResult.message);
//         if (onFail) {
//           onFail();
//         }
//       }
//     })
//     .catch(e => {
//       console.log(e);
//       if (onError) {
//         onError();
//       }
//     });
// };

// export const getGoogleSteps = async () => {
//   let startDate = new Date();
//   startDate.setHours(0, 0, 0, 0);

//   try {
//     const result = await GoogleFit.getDailyStepCountSamples({
//       startDate: startDate.toISOString(), // required ISO8601Timestamp
//       endDate: new Date().toISOString(), // required ISO8601Timestamp
//       // bucketUnit: BucketUnit.DAY, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
//       // bucketInterval: 1, // optional - default 1.
//     });

//     let steps = result.find(
//       r => r.source === 'com.google.android.gms:estimated_steps',
//     );
//     if (steps && steps.steps.length > 0) {
//       return steps.steps[0].value;
//     }

//     return 0;
//   } catch (e) {
//     console.log(e);
//     return 0;
//   }
// };

// export const requestAppleHealth = async (onSuccess, onFail, onError) => {
//   const permissions = {
//     permissions: {
//       read: [AppleHealthKit.Constants.Permissions.StepCount],
//       write: [AppleHealthKit.Constants.Permissions.StepCount],
//     },
//   };

//   AppleHealthKit.initHealthKit(permissions, (error, results) => {
//     if (results) {
//       if (onSuccess) {
//         onSuccess();
//       }
//     } else {
//       if (error) {
//         console.log('[ERROR] Cannot grant permissions!');
//         if (onError) {
//           onError();
//         }
//       } else {
//         if (onFail) {
//           onFail();
//         }
//       }
//     }
//   });
// };

// export const getAppleSteps = async onSuccess => {
//   let startDate = new Date();
//   startDate.setHours(0, 0, 0, 0);
//   let stepOptions = {
//     date: moment(startDate.toISOString()).format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
//   };

//   try {
//     AppleHealthKit.getStepCount(stepOptions, (error, results) => {
//       if (error) {
//         console.log('error: ', error);
//         onSuccess(0);
//       }
//       console.log(results.value);
//       onSuccess(results.value);
//     });
//   } catch (e) {
//     console.log(e);
//     onSuccess(0);
//   }
// };
