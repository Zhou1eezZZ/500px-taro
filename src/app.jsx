import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import store from './store'
import Find from './pages/find/index'

import './styles/taro-ui.scss'
import './styles/reset.scss'
import './assets/icons/iconfont.css'

class App extends Component {
    config = {
        pages: ['pages/find/index', 'pages/user/index', 'pages/detail/index'],
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: '500px',
            navigationBarTextStyle: 'black'
        },
        tabBar: {
            color: '#333333',
            selectedColor: '#9da8ff',
            backgroundColor: '#ffffff',
            borderStyle: 'white',
            list: [
                {
                    pagePath: 'pages/find/index',
                    iconPath: './assets/tabbarIcon/find.png',
                    selectedIconPath: './assets/tabbarIcon/find_active.png',
                    text: '发现'
                },
                {
                    pagePath: 'pages/user/index',
                    iconPath: './assets/tabbarIcon/user.png',
                    selectedIconPath: './assets/tabbarIcon/user_active.png',
                    text: '我的'
                }
            ]
        }
    }

    componentDidMount() {}

    componentDidShow() {}

    componentDidHide() {}

    componentDidCatchError() {}

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render() {
        return (
            <Provider store={store}>
                <Find />
            </Provider>
        )
    }
}

Taro.render(<App />, document.getElementById('app'))
