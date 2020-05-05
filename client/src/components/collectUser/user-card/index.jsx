import { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { bindShow } from '../../../utils/style'
import './index.scss'

@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    static defaultProps = {
        data: {
            id: '',
            photographer: '',
            photographerAvatar: '',
            workNum: 0,
            bg: '',
        },
        onClick: () => {},
    }

    state = {
        isShow: false,
    }

    // 图片加载完成时的钩子
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

    render() {
        const { isShow } = this.state
        const { data, onClick } = this.props
        return (
            <View
                style={bindShow(isShow)}
                className='user-card'
                onClick={onClick}
            >
                <Image
                    className='user-card__bg'
                    lazy-load
                    src={data.bg}
                    mode='widthFix'
                    onLoad={this.onImgLoad}
                    onError={this.onImgError}
                />
                <View className='user-card__bottom'>
                    <View className='user-card__avatar'>
                        <AtAvatar
                            circle
                            size='large'
                            image={data.photographerAvatar}
                        />
                    </View>
                    <Text className='user-card__name'>{data.photographer}</Text>
                    <Text className='user-card__num'>
                        作品数：{data.workNum}
                    </Text>
                </View>
            </View>
        )
    }
}
export default Index
