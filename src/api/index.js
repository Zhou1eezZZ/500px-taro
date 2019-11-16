import request from '../utils/request'

// 获取热门图片
export const getHot = ({
    resourceType = '0,2',
    category = '',
    orderBy = 'rating',
    photographerType = '',
    startTime = '',
    page = 1,
    size = 10,
    type = 'json'
}) => {
    return request({
        method: 'GET',
        url: '/discover/rating',
        data: {
            resourceType,
            category,
            orderBy,
            photographerType,
            startTime,
            page,
            size,
            type
        }
    })
}

// 获取排名上升图片
export const getTrending = ({
    resourceType = '0,2',
    startTime = '',
    page = 1,
    size = 10,
    type = 'json'
}) => {
    return request({
        method: 'GET',
        url: '/community/discover/rankingRise',
        data: {
            resourceType,
            startTime,
            page,
            size,
            type
        }
    })
}

// 获取新作图片
export const getNew = ({
    resourceType = '0,2',
    startTime = '',
    page = 1,
    size = 10,
    type = 'json'
}) => {
    return request({
        method: 'GET',
        url: '/community/discover/created_date',
        data: {
            resourceType,
            startTime,
            page,
            size,
            type
        }
    })
}

// 获取编辑推荐图片
export const getRecommend = ({
  resourceType = '0,2',
  startTime = '',
  page = 1,
  size = 10,
  type = 'json'
}) => {
  return request({
      method: 'GET',
      url: '/community/discover/recommendTime',
      data: {
          resourceType,
          startTime,
          page,
          size,
          type
      }
  })
}
