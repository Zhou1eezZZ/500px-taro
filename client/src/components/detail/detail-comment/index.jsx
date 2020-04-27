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
            id: '',
            avatarUrl: '',
            nickName: '',
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
        const { avatarUrl, nickName, message, createDate } = this.props.data
        return (
            <View className='comment__item'>
                <View className='comment__left'>
                    <AtAvatar circle size='small' image={avatarUrl} />
                </View>
                <View className='comment__right'>
                    <Text className='comment__name'>{nickName}</Text>
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
