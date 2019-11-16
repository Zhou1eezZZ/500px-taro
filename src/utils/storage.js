import Taro from '@tarojs/taro'

export default {
    get: key => Taro.getStorageSync(key),
    set: (key, value) => Taro.setStorageSync(key, value),
    delete: key => Taro.removeStorageSync(key),
    clear: () => Taro.clearStorageSync()
}
