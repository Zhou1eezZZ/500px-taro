import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import action from '../../utils/action'
import UserCard from '../../components/collectUser/user-card'

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

    render() {
        const { collectPhotographerList } = this.props.userInfo
        return (
            <View className='collectUser__page'>
                {collectPhotographerList &&
                    collectPhotographerList.map((item) =>
                        item ? (
                            <UserCard
                                key={item.id}
                                data={item}
                                onClick={() => this.goToUserDetail(item.id)}
                            />
                        ) : null
                    )}
            </View>
        )
    }
}
export default Index
