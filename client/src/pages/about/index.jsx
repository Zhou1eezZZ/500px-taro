import { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { bindShow } from '../../utils/style'
import './index.scss'

@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    config = {
        navigationBarTitleText: '关于',
    }

    state = {
        cardVisible: false,
    }

    // 页面显示时的钩子函数
    componentDidShow() {
        // 设置卡片为可视（提供一种显示的动画）
        setTimeout(() => {
            this.setState({ cardVisible: true })
        }, 800)
    }

    // 页面隐藏时的钩子函数
    componentDidHide() {
        // 设置卡片不可视
        this.setState({ cardVisible: false })
    }

    // 配置当前页面得分享卡片（卡片标题和卡片展示的图像）
    onShareAppMessage() {
        return {
            title: '快来发现精彩摄影作品',
            path: `/pages/find/index`,
            imageUrl:
                'https://img.500px.me/photo/ae03b70d9495e84330b87b19d6a7c7743/e6c047e33607430bba923e1001241fdd.jpg!p5',
        }
    }

    render() {
        const { cardVisible } = this.state
        return (
            <View className='about'>
                <Image
                    className='about__img'
                    src='cloud://trollyaar-lkn5m.7472-trollyaar-lkn5m-1301854754/仙人掌.gif'
                />
                <View
                    style={bindShow(cardVisible, true)}
                    className='about__card'
                >
                    <View>项目须知：</View>
                    <View>1. 本项目所用图片均通过 500px 官网接口获取</View>
                    <View>
                        2. 本项目仅作为作者毕设演示使用，没有任何商业用途
                    </View>
                    <View>3. 本项目不提供任何图片的下载功能</View>
                </View>
                <View className='water-mark'>
                    —— By PeanuTn-T ——
                </View>
            </View>
        )
    }
}
export default Index
