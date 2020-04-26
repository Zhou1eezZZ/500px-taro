import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import moment from '../../../utils/moment'

import './index.scss'
@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    static defaultProps = {
        data: {
            userInfo: { nickName: '', avatar: { baseUrl: '' } },
            message: '',
            createDate: 0,
        },
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    render() {
        const { userInfo, message, createDate } = this.props.data
        return (
            <View className='comment__item'>
                <View className='comment__left'>
                    <AtAvatar
                        circle
                        size='small'
                        image={
                            userInfo.avatar.baseUrl
                                ? `${userInfo.avatar.baseUrl}!a1`
                                : 'https://pic.500px.me/images/default_tx.png'
                        }
                    />
                </View>
                <View className='comment__right'>
                    <Text className='comment__name'>{userInfo.nickName}</Text>
                    <Text className='comment__message'>{message}</Text>
                    <Text className='comment__time'>
                        {moment(createDate).fromNow()}
                    </Text>
                </View>
            </View>
        )
    }
}
export default Index
