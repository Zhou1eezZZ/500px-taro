import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon } from 'taro-ui'
import { bindShow } from '../../../utils/style'
import action from '../../utils/action'
import './index.scss'

import logoPNG from '../../../assets/img/logo.png'

@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    static defaultProps = {
        activeTab: '',
        tabList: [],
        onTabClick: () => {}
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    render() {
        const { activeTab, tabList, onTabClick } = this.props
        return (
            <View className='find-tabbar'>
                <Image className='find-tabbar__logo' src={logoPNG} />
                <View className='find-tabbar__tablist'>
                    {tabList.map(item => (
                        <View
                            className='find-tabbar__tab'
                            key={item.value}
                            onClick={() => onTabClick(item.value)}
                        >
                            <AtIcon
                                prefixClass='icon'
                                value={item.value}
                                size='18'
                                color={
                                    activeTab === item.value
                                        ? '#19b3ff'
                                        : '#111'
                                }
                            ></AtIcon>
                            <Text
                                style={
                                    activeTab === item.value
                                        ? { color: '#19b3ff' }
                                        : {}
                                }
                                className='find-tabbar__tab__label'
                            >
                                {item.label}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        )
    }
}
export default Index
