import axios from '../utils/axios'

export const getStepData = async () => {
  return await axios.get('/api/step/current')
}

export const recordStepData = async (message) => {
  return await axios.post('/api/step', { message })
}

export const getStepHistory = async ({ page, size }) => {
  return await axios.get(
    '/api/step/history?' +
    (page ? `page=${page}&` : '') +
    (size ? `size=${size}&` : '')
  )
}
