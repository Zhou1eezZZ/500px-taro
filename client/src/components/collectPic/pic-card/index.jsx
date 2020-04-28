import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { bindShow } from '../../../utils/style'
import action from '../../utils/action'
import './index.scss'

@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    static defaultProps = {
        data: {
            id: '',
            img: '',
            title: '',
            uploader: '',
            uploaderAvatar: '',
            uploaderId: '',
        },
        onImgClick: () => {},
    }

    state = {
        isShow: false,
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    onImgLoad() {
        this.setState({ isShow: true })
    }

    onImgError(e) {
        console.log(e)
    }

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
                    src={data.img}
                    mode='widthFix'
                    onLoad={this.onImgLoad}
                    onError={this.onImgError}
                    onClick={onImgClick}
                />
                <View className='find-card__info'>
                    <View className='find-card__info__detail'>
                        <View className='find-card__info__detail__top'>
                            {data.title}
                        </View>
                        <View className='find-card__info__detail__bottom__wrap'>
                            <View className='find-card__info__detail__bottom'>
                                <Text className='find-card__info__detail__bottom__by'>
                                    By
                                </Text>
                                <View onClick={this.handleAvatarClick}>
                                    <AtAvatar
                                        circle
                                        size='small'
                                        image={data.uploaderAvatar}
                                    />
                                </View>
                                <Text className='find-card__info__detail__bottom__name'>
                                    {data.uploader}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
export default Index
