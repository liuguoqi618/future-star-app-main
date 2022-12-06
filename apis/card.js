import axios from '../utils/axios'

export const getCardList = async () => {
  return await axios.get('/api/card/default')
}

export const getMyCards = async () => {
  return await axios.get('/api/card/personal')
}

export const getCardHistory = async (sort = 0) => {
  return await axios.get(`/api/card/history?sort=${sort}`)
}

export const checkPurchaseCard = async (level) => {
  return await axios.get(`/api/card/check?level=${level}`)
}

export const purchaseCard = async (level) => {
  return await axios.post('/api/card/', { level })
}

export const getGuestCards = async () => {
  return await axios.get('/api/card/guest')
}

export const getCardSummary = async () => {
  return await axios.get('/api/card/summary')
}
