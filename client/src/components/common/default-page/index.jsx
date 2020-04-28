import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

class Index extends Component {
    render() {
        return (
            <View className='default'>
                <Image
                    className='default__img'
                    src='cloud://trollyaar-lkn5m.7472-trollyaar-lkn5m-1301854754/default.png'
                />
                <Text className='default__text'>暂无数据</Text>
            </View>
        )
    }
}
export default Index
