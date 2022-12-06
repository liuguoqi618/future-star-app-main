import axios from '../utils/axios';

export const getHomepageVideo = async ({ language, videoId }) => {
  return axios.get(
    '/api/video?' +
      (language ? `language=${language}&` : '') +
      (videoId ? `videoId=${videoId}&` : '')
  );
};

export const recordVideoView = async message => {
  return axios.post('/api/video/view', {message});
};

export const recordBannerView = async (message) => {
  return axios.post('/api/banner/view', {message});
}
