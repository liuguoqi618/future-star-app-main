import axios from '../utils/axios'

export const getDailySignIn = async () => {
  return await axios.get('/api/attend')
}

export const dailySignIn = async () => {
  return await axios.post('/api/attend')
}

export const getBeginnerTasks = async () => {
  return await axios.get('/api/starter/task')
}

export const getSummary = async () => {
  return await axios.get('/api/user/todaySummary')
}
