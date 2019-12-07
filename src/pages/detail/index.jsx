import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import action from '../../utils/action'
import { getPicDetail } from '../../api'

import './index.scss'
import { bindShow } from '../../utils/style'

@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    state = {
        picInfo: {
            url: {
                baseUrl:
                    'https://img.500px.me/5fed9c5f6437294ada1331f3506878691_1452676245638.jpg'
            }
        },
        isLoading: false
    }

    config = {
        navigationBarTitleText: '详情页'
    }

    componentWillMount() {}

    componentDidMount() {
        const { id, title } = this.$router.params
        Taro.setNavigationBarTitle({ title: title ? title : '无题' })
        this.getPicDetail({ id })
    }

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    getPicDetail = async ({ id }) => {
        try {
            this.setState({ isLoading: true })
            const res = await getPicDetail({ id })
            this.setState({ picInfo: res, isLoading: false })
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        const { isLoading, picInfo } = this.state
        return isLoading ? (
            <View>loading...</View>
        ) : (
            <View className='detail__page'>
                <Image
                    className='detail__page__img'
                    src={
                        picInfo.url.p5
                            ? picInfo.url.p5
                            : `${picInfo.url.baseUrl}!p4`
                    }
                    mode='widthFix'
                />
                <View>
                    <View className='detail__page__uploader'>
                        <AtAvatar
                            circle
                            size='small'
                            image={
                                picInfo.uploaderInfo &&
                                picInfo.uploaderInfo.avatar &&
                                picInfo.uploaderInfo.avatar.baseUrl
                                    ? `${picInfo.uploaderInfo.avatar.baseUrl}!a1`
                                    : ''
                            }
                        />
                        <View className='detail__page__uploader__info'>
                            <Text className='detail__page__uploader__info__name'>
                                {picInfo.uploaderInfo.nickName}
                            </Text>
                            <Text className='detail__page__uploader__info__fans'>
                                粉丝数 {picInfo.uploaderInfo.userFollowedCount}
                            </Text>
                        </View>
                    </View>
                    <View className='detail__page__des'>
                        <View className='detail__page__des__title'>
                            {picInfo.title}
                        </View>
                        <View className='detail__page__des__content'>
                            {picInfo.description}
                        </View>
                    </View>
                </View>
                <View className='detail__page__detail'>
                    <View className='detail__page__detail__basic'>
                        <View className='detail__page__detail__heat'>
                            <Text>热度</Text>
                            <Text>{picInfo.ratingMax}</Text>
                            <Text>{picInfo.ratingMaxDate}</Text>
                        </View>
                        <View className='detail__page__detail__pv'>
                            <Text>浏览量</Text>
                            <Text>{picInfo.picturePvCount}</Text>
                        </View>
                        <View className='detail__page__detail__like'>
                            <Text>点赞数</Text>
                            <Text>{picInfo.pictureLikeedCount}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
export default Index
