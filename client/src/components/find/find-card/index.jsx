import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { bindShow } from '../../../utils/style'
import './index.scss'

import firePNG from '../../../assets/img/fire.png'

@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    static defaultProps = {
        data: {
            uploaderInfo: {
                avatar: {
                    baseUrl: '',
                },
            },
        },
        onImgClick: () => {},
    }

    state = {
        isShow: false,
    }

    // 图片加载完时的钩子
    onImgLoad() {
        this.setState({ isShow: true })
    }

    // 图片加载出错时的钩子
    onImgError(e) {
        Taro.showToast({
            title: '图片加载出错',
            icon: 'none',
        })
    }

    // 点击摄影师头像时触发的函数（跳转到摄影师详情页）
    handleAvatarClick = () => {
        const { uploaderId } = this.state.data
        Taro.navigateTo({
            url: `/pages/person/index?userId=${uploaderId}`,
        })
    }

    render() {
        const { data, onImgClick } = this.props
        const { isShow } = this.state
        return (
            <View style={bindShow(isShow)} className='find-card'>
                <Image
                    className='find-card__img'
                    lazy-load
                    src={`${data.url.baseUrl}!p4`}
                    mode='widthFix'
                    onLoad={this.onImgLoad}
                    onError={this.onImgError}
                    onClick={onImgClick}
                />
                <View className='find-card__info'>
                    <View className='find-card__info__detail'>
                        <View className='find-card__info__detail__left'>
                            <View onClick={this.handleAvatarClick}>
                                <AtAvatar
                                    circle
                                    size='small'
                                    image={
                                        data.uploaderInfo.avatar.baseUrl
                                            ? `${data.uploaderInfo.avatar.baseUrl}!a1`
                                            : ''
                                    }
                                />
                            </View>
                            <Text className='find-card__info__detail__left__name'>
                                {data.uploaderInfo.nickName}
                            </Text>
                        </View>
                        <View
                            style={bindShow(data.ratingMax)}
                            className='find-card__info__detail__right'
                        >
                            <Image
                                className='find-card__info__detail__right__fire'
                                src={firePNG}
                            />
                            <Text className='find-card__info__detail__right__num'>
                                {parseFloat(data.ratingMax).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
export default Index
