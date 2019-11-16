import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { bindShow } from '../../../utils/style'
import action from '../../utils/action'
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
                    baseUrl: ''
                }
            }
        }
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    render() {
        const { data } = this.props
        return (
            <View className='find-card'>
                <Image
                    className='find-card__img'
                    src={`${data.url.baseUrl}!p4`}
                    mode='widthFix'
                />
                <View className='find-card__info'>
                    {/* <Text
                        style={bindShow(data.title)}
                        className='find-card__info__title'
                    >{`"${data.title}"`}</Text> */}
                    <View className='find-card__info__detail'>
                        <View className='find-card__info__detail__left'>
                            <AtAvatar
                                circle
                                size='small'
                                image={
                                    data.uploaderInfo.avatar.baseUrl
                                        ? `${data.uploaderInfo.avatar.baseUrl}!p4`
                                        : ''
                                }
                            />
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
