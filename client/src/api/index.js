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
    type = 'json',
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
            type,
        },
    })
}

// 获取排名上升图片
export const getTrending = ({
    resourceType = '0,2',
    startTime = '',
    page = 1,
    size = 10,
    type = 'json',
}) => {
    return request({
        method: 'GET',
        url: '/community/discover/rankingRise',
        data: {
            resourceType,
            startTime,
            page,
            size,
            type,
        },
    })
}

// 获取新作图片
export const getNew = ({
    resourceType = '0,2',
    startTime = '',
    page = 1,
    size = 10,
    type = 'json',
}) => {
    return request({
        method: 'GET',
        url: '/community/discover/created_date',
        data: {
            resourceType,
            startTime,
            page,
            size,
            type,
        },
    })
}

// 获取编辑推荐图片
export const getRecommend = ({
    resourceType = '0,2',
    startTime = '',
    page = 1,
    size = 10,
    type = 'json',
}) => {
    return request({
        method: 'GET',
        url: '/community/discover/recommendTime',
        data: {
            resourceType,
            startTime,
            page,
            size,
            type,
        },
    })
}

// 获取图片详情
export const getPicDetail = ({
    id,
    type = 'json',
    imgsize = 'p1,p2,p5,p6',
}) => {
    return request({
        method: 'GET',
        url: `/community/photo-details/${id}`,
        data: {
            type,
            imgsize,
        },
    })
}

// 获取图片的评论
export const getPicComments = ({
    resId,
    type = 'json',
    page = 1,
    size = 10,
}) => {
    return request({
        method: 'GET',
        url: `/community/comment/list`,
        data: {
            resId,
            type,
            page,
            size,
        },
    })
}

// 获取某个用户的信息
export const getUserInfo = (queriedUserId) => {
    return request({
        method: 'GET',
        url: `/community/v2/user/indexInfo?queriedUserId=${queriedUserId}`,
    })
}

// 分页获取某个用户的作品
export const getWorkByUserId = ({
    queriedUserId,
    resourceType = '0,2,4',
    imgsize = 'p1,p2,p3',
    page = 1,
    size = 20,
    type = 'json',
}) => {
    return request({
        method: 'GET',
        url: `/community/v2/user/profile`,
        data: {
            queriedUserId,
            resourceType,
            imgsize,
            page,
            size,
            type,
        },
    })
}

// 获取推荐摄影师
export const getRecommendPhotographer = ({
    page = 1,
    size = 20,
    type = 'json',
}) => {
    return request({
        method: 'GET',
        url: `/community/user-details/userInfos`,
        data: {
            page,
            size,
            type,
        },
    })
}
