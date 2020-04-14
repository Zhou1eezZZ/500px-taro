import Taro from '@tarojs/taro'
import Config from '../config'

// 请求拦截器
Taro.addInterceptor(chain => {
    const { requestParams } = chain

    return chain.proceed(requestParams)
})

const { baseUrl } = Config.server

export default ({
    method = 'GET',
    url,
    data = {},
    header = { 'Content-Type': 'application/x-www-form-urlencoded' }
}) => {
    return Taro.request({
        method,
        url: `${baseUrl}${url}`,
        data,
        header
    })
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error)
        })
}
