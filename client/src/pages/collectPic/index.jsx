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

    onShareAppMessage() {
        return {
            title: '快来发现精彩摄影作品',
            path: `/pages/find/index`,
            imageUrl:
                'https://img.500px.me/photo/ae03b70d9495e84330b87b19d6a7c7743/e6c047e33607430bba923e1001241fdd.jpg!p5',
        }
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
