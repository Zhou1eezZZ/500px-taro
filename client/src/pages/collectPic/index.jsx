import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import action from '../../utils/action'
import PicCard from '../../components/collectPic/pic-card'

import './index.scss'

@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    state = {}

    config = {
        navigationBarTitleText: '收藏的作品',
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    goToImgDetail = (item) => {
        const { id, title, photoCount } = item
        Taro.navigateTo({
            url: `/pages/detail/index?id=${id}&title=${title}&photoCount=${photoCount}`,
        })
    }

    render() {
        const { collectPhotoList } = this.props.userInfo
        return (
            <View className='collectPic__page'>
                {collectPhotoList &&
                    collectPhotoList.map((item) =>
                        item ? (
                            <PicCard
                                key={item.id}
                                data={item}
                                onImgClick={() => this.goToImgDetail(item)}
                            />
                        ) : null
                    )}
            </View>
        )
    }
}
export default Index
