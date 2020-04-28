import { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import loadingGif from '../../../assets/img/loading.gif'
import './index.scss'

class Index extends Component {
    render() {
        return (
            <View className='loading'>
                <Image className='loading__img' src={loadingGif} />
            </View>
        )
    }
}
export default Index
