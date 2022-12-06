import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import TaskScreen from '../screens-v1/task/TaskScreen'

const TaskStack = createStackNavigator()

const TaskNavigator = () => {
  const { Navigator, Screen } = TaskStack

  return (
    <Navigator screenOptions={{
      headerShown: false,
    }}>
      <Screen name="TaskScreen" component={TaskScreen} initialParams={{ callCheckIn: false }} />
    </Navigator>
  )
}

export default TaskNavigator
