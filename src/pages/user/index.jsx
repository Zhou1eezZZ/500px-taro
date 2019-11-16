import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import action from '../../utils/action'
import './index.scss'

@connect(({ app }) => {
  return { ...app }
})
class Index extends Component {

  config = {
    navigationBarTitleText: '发现'
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View className='index'>
        <Text>user page</Text>
      </View>
    )
  }
}
export default Index
