import axios from '../utils/axios'

export const getFeed = async ({ page, size, keyword, language }) => {
  return await axios.get(
    '/api/feed?' +
    (page ? `page=${page}&` : '') +
    (size ? `size=${size}&` : '') +
    (keyword ? `keyword=${encodeURI(keyword)}&` : '') +
    (language ? `language=${language}&` : '')
  )
}

export const getArticle = async (articleId, loggedIn) => {
  return await axios.get(
    `/api/article/id/${articleId}/${!loggedIn ? 'guest' : ''}`
  )
}

export const readArticle = async (message) => {
  return await axios.post('/api/article/read', { message })
}

export const likeArticle = async (articleId) => {
  return await axios.put(`/api/article/like/${articleId}`)
}

export const unlikeArticle = async (articleId) => {
  return await axios.put(`/api/article/unlike/${articleId}`)
}

export const getComments = async (articleId, loggedIn, page) => {
  if (page) {
    return await axios.get(
      `/api/comment/article/${articleId}` +
      (loggedIn ? '?' : '/guest?') +
      `page=${page}`
    )
  } else {
    return await axios.get(
      `/api/comment/article/${articleId}` + (loggedIn ? '' : '/guest')
    )
  }
}

export const likeComment = async (commentId) => {
  return await axios.put(`/api/comment/like/${commentId}`)
}

export const unlikeComment = async (commentId) => {
  return await axios.put(`/api/comment/unlike/${commentId}`)
}

export const likeReply = async (commentId) => {
  return await axios.put(`/api/comment/like-reply/${commentId}`)
}

export const unlikeReply = async (commentId) => {
  return await axios.put(`/api/comment/unlike-reply/${commentId}`)
}

export const postComment = async (articleId, content) => {
  return await axios.post(`/api/comment/article/${articleId}`, { content })
}

export const postReply = async (commentId, content) => {
  return await axios.post(`/api/comment/reply/${commentId}`, { content })
}

export const getBanner = async ({ language }) => {
  return await axios.get(
    '/api/banner?' +
    (language ? `language=${language}&` : '')
  )
}

export const getSelected = async ({ page, size, keyword, language }) => {
  return await axios.get(
    '/api/feed/select?' +
    (page ? `page=${page}&` : '') +
    (size ? `size=${size}&` : '') +
    (keyword ? `keyword=${encodeURI(keyword)}&` : '') +
    (language ? `language=${language}&` : '')
  )
}
