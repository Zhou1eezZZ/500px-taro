import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import store from './store' // 引入全局状态管理的store
import action from './utils/action'
import Find from './pages/find/index'
import moment from './utils/moment' // 引入时间格式化库

import './styles/taro-ui.scss' // 引入taro ui组件的样式
import './styles/reset.scss' // 重置css样式文件
import './assets/icons/iconfont.css' // 引入tabbar图标的字体图标样式

class App extends Component {
    // 小程序总配置项
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

    // 组件挂载时执行的钩子
    componentDidMount() {
        // 初始化项目的云服务
        if (process.env.TARO_ENV === 'weapp') {
            Taro.cloud.init()
        }
        // 初始化moment库的语言为中文
        moment.locale('zh-cn')
        // 调用登录函数，查看当前用户是否已经在本小程序授权，若授权直接返回用户信息实现自动登录
        this.login()
    }

    // 登录函数（调用云服务函数）
    login = () => {
        Taro.cloud
            .callFunction({
                name: 'login',
            })
            .then((res) => {
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
