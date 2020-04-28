import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import { connect } from '@tarojs/redux'
import action from '../../utils/action'
import { bindShow } from '../../utils/style'
import './index.scss'

@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    config = {
        navigationBarTitleText: '',
        navigationStyle: 'custom',
    }

    state = {
        cardVisible: false,
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {
        setTimeout(() => {
            this.setState({ cardVisible: true })
        }, 800)
    }

    componentDidHide() {
        this.setState({ cardVisible: false })
    }

    getUserInfo = (e) => {
        const { dispatch } = this.props
        if (e.detail.cloudID) {
            Taro.cloud
                .callFunction({
                    name: 'getUserInfo',
                    data: { cloudID: e.detail.cloudID },
                })
                .then((res) => {
                    console.log(res)
                    const userInfo = res.result
                    userInfo &&
                        dispatch(action('app/setUserInfo', { userInfo }))
                })
                .catch(console.log)
        }
    }

    goToCollectPic = () => {
        Taro.navigateTo({
            url: `/pages/collectPic/index`,
        })
    }

    goToCollectUser = () => {
        Taro.navigateTo({
            url: `/pages/collectUser/index`,
        })
    }

    goToRecommend = () => {
        Taro.navigateTo({
            url: `/pages/recommend/index`,
        })
    }

    goToAbout = () => {
        Taro.navigateTo({
            url: `/pages/about/index`,
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
        const { userInfo } = this.props
        const { collectPhotoList, collectPhotographerList } = userInfo
        const { cardVisible } = this.state
        return (
            <View className='user'>
                {userInfo.nickName ? (
                    <View className='user__page'>
                        <View className='user__page-wrap'>
                            <Image
                                className='logo'
                                src={userInfo.avatarUrl}
                                mode='widthFix'
                            ></Image>
                            <Text className='user__page-text'>
                                {userInfo.nickName}
                            </Text>
                            <Image
                                className='user__page-wave'
                                src='https://7869-xiaozhou-puioe-1301588312.tcb.qcloud.la/wave.gif?sign=200fc795da4c5aead2263dbae7bcfa2d&t=1584497796'
                                mode='scaleToFill'
                            ></Image>
                        </View>
                        <View className='user__page-collect'>
                            <View
                                className='user__page-collect-block'
                                onClick={this.goToCollectPic}
                            >
                                <Text className='user__page-collect-num orange'>
                                    {collectPhotoList.length}
                                </Text>
                                <Text className='user__page-collect-title'>
                                    收藏的作品
                                </Text>
                            </View>
                            <View
                                className='user__page-collect-block'
                                onClick={this.goToCollectUser}
                            >
                                <Text className='user__page-collect-num blue'>
                                    {collectPhotographerList.length}
                                </Text>
                                <Text className='user__page-collect-title'>
                                    收藏的摄影师
                                </Text>
                            </View>
                        </View>
                        <View className='user__page-list'>
                            <AtList>
                                <AtListItem
                                    title='优质摄影师推荐'
                                    arrow='right'
                                    iconInfo={{
                                        size: 25,
                                        color: '#78A4FA',
                                        value: 'sketch',
                                    }}
                                    onClick={this.goToRecommend}
                                />
                                <AtListItem
                                    title='关于'
                                    arrow='right'
                                    iconInfo={{
                                        size: 25,
                                        color: '#FF4949',
                                        value: 'help',
                                    }}
                                    onClick={this.goToAbout}
                                />
                            </AtList>
                        </View>
                    </View>
                ) : (
                    <View className='user__login'>
                        <Image
                            className='user__login__img'
                            src='cloud://trollyaar-lkn5m.7472-trollyaar-lkn5m-1301854754/login.gif'
                        />
                        <View
                            style={bindShow(cardVisible, true)}
                            className='user__login__card'
                        >
                            <View>
                                -授权登录后可以自由收藏喜爱的照片和摄影师
                            </View>
                            <View>-仅获取您的基本信息用于展示，请放心</View>
                            <View>-授权后下次会自动登录，无需再次操作</View>
                        </View>
                        <Button
                            className='user__login__button'
                            openType='getUserInfo'
                            onGetUserInfo={this.getUserInfo}
                        >
                            微信授权登录
                        </Button>
                    </View>
                )}
            </View>
        )
    }
}
export default Index
