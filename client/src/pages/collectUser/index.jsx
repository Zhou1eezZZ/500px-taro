import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import action from '../../utils/action'
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

    componentWillMount() {}

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    goToUserDetail = (id) => {
        Taro.navigateTo({
            url: `/pages/person/index?userId=${id}`,
        })
    }

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
