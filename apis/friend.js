import axios from '../utils/axios'

export const getPartners = async ({ tier, page, size }) => {
  return await axios.get(
    '/api/invite/partner?' +
    (tier ? `tier=${tier}&` : '') +
    (page ? `page=${page}&` : '') +
    (size ? `size=${size}&` : '')
  )
}

export const getMembers = async ({ tier, page, size }) => {
  return await axios.get(
    '/api/invite/member?' +
    (tier ? `tier=${tier}&` : '') +
    (page ? `page=${page}&` : '') +
    (size ? `size=${size}&` : '')
  )
}

export const getInviteCode = async () => {
  return await axios.get('api/invite/code')
}
