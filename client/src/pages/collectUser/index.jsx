import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import UserCard from '../../components/collectUser/user-card'
import DefaultPage from '../../components/common/default-page'

import './index.scss'

@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    state = {}

    config = {
        navigationBarTitleText: '收藏的摄影师',
    }

    // 跳转到用户详情页的函数
    goToUserDetail = (id) => {
        Taro.navigateTo({
            url: `/pages/person/index?userId=${id}`,
        })
    }

    // 配置当前页面得分享卡片（卡片标题和卡片展示的图像）
    onShareAppMessage() {
        return {
            title: '快来发现精彩摄影作品',
            path: `/pages/find/index`,
            imageUrl:
                'https://img.500px.me/photo/ae03b70d9495e84330b87b19d6a7c7743/e6c047e33607430bba923e1001241fdd.jpg!p5',
        }
    }

    render() {
        const { collectPhotographerList } = this.props.userInfo
        return collectPhotographerList && collectPhotographerList.length > 0 ? (
            <View className='collectUser__page'>
                {/* 遍历出用户收藏的摄影师的卡片列表 */}
                {collectPhotographerList.map((item) =>
                    item ? (
                        <UserCard
                            key={item.id}
                            data={item}
                            onClick={() => this.goToUserDetail(item.id)}
                        />
                    ) : null
                )}
            </View>
        ) : (
            <DefaultPage />
        )
    }
}
export default Index
