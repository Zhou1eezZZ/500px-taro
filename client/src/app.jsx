import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import store from './store'
import action from './utils/action'
import Find from './pages/find/index'
import moment from './utils/moment'

import './styles/taro-ui.scss'
import './styles/reset.scss'
import './assets/icons/iconfont.css'

class App extends Component {
    config = {
        pages: [
            'pages/find/index',
            'pages/user/index',
            'pages/detail/index',
            'pages/person/index',
            'pages/collectPic/index',
            'pages/collectUser/index',
            'pages/recommend/index',
            'pages/about/index',
        ],
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: '500px',
            navigationBarTextStyle: 'black',
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
                    text: '发现',
                },
                {
                    pagePath: 'pages/user/index',
                    iconPath: './assets/tabbarIcon/user.png',
                    selectedIconPath: './assets/tabbarIcon/user_active.png',
                    text: '我的',
                },
            ],
        },
        cloud: true,
    }

    componentDidMount() {
        if (process.env.TARO_ENV === 'weapp') {
            Taro.cloud.init()
        }
        moment.locale('zh-cn')
        // 获取用户openid 并判断用户是否已经授权登录过
        this.login()
    }

    componentDidShow() {}

    componentDidHide() {}

    componentDidCatchError() {}

    login = () => {
        Taro.cloud
            .callFunction({
                name: 'login',
            })
            .then((res) => {
                console.log(res)
                const { openid, userInfo } = res.result
                store.dispatch(action('app/setOpenId', { openId: openid }))
                userInfo &&
                    store.dispatch(action('app/setUserInfo', { userInfo }))
            })
            .catch(console.log)
    }

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
