import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import action from '../../utils/action'
import { getUserInfo, getWorkByUserId } from '../../api'
import { bindShow } from '../../utils/style'
import FindCard from '../../components/find/find-card'

import './index.scss'
@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    state = {
        userId: '',
        userInfo: {
            coverUrl: {},
            avatar: {},
            nickName: '',
            userPvedCount: 0,
            userFollowedCount: 0,
            userFolloweeCount: 0,
        },
        isImgShow: false,
        pageIndex: 1,
        projectList: [],
    }

    config = {
        navigationBarTitleText: '作者',
    }

    componentWillMount() {}

    componentDidMount() {
        const { userId } = this.$router.params
        this.setState({ userId }, () => {
            this.getUserInfo()
            this.getProject()
        })
    }

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    getUserInfo = async () => {
        try {
            const { userId } = this.state
            const res = await getUserInfo(userId)
            if (res.message !== 'success') {
                throw new Error('获取用户信息出错')
            }
            this.setState({ userInfo: res.data })
            Taro.setNavigationBarTitle({
                title: res.data.nickName ? res.data.nickName : '无名',
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    getProject = async () => {
        try {
            const { pageIndex, userId, projectList } = this.state
            const res = await getWorkByUserId({
                queriedUserId: userId,
                page: pageIndex,
            })
            if (res.message !== 'success') {
                throw new Error('获取作品失败')
            }
            this.setState({ projectList: [...projectList, ...res.data] })
        } catch (error) {
            console.log(error)
        }
    }

    loadNextPage = () => {
        const { pageIndex } = this.state
        this.setState({ pageIndex: pageIndex + 1 }, () => {
            this.getProject()
        })
    }

    goToImgDetail = (item) => {
        const { activeTab } = this.state
        Taro.navigateTo({
            url: `/pages/detail/index?id=${item.id}&title=${item.title}&type=${activeTab}`,
        })
    }

    onImgLoad() {
        setTimeout(() => {
            this.setState({ isImgShow: true })
        }, 500)
    }

    onImgError(e) {
        console.log(e)
    }

    goToImgDetail = (item) => {
        const { activeTab } = this.state
        Taro.navigateTo({
            url: `/pages/detail/index?id=${item.id}&title=${item.title}`,
        })
    }

    render() {
        const { isImgShow, userInfo, projectList } = this.state
        const {
            coverUrl,
            avatar,
            nickName,
            userPvedCount,
            userFollowedCount,
            userFolloweeCount,
        } = userInfo
        return (
            <ScrollView
                scrollY
                enableBackToTop
                onScrollToLower={this.loadNextPage}
                className='person__page'
            >
                <Image
                    style={bindShow(isImgShow)}
                    className='person__page__img'
                    src={coverUrl.p5 ? coverUrl.p5 : ''}
                    onLoad={this.onImgLoad}
                    onError={() => this.onImgError}
                    mode='widthFix'
                />
                <View className='person__page__info'>
                    <View
                        className={
                            isImgShow ? 'person__page__info__avatar' : ''
                        }
                    >
                        <AtAvatar
                            circle
                            size='large'
                            image={
                                avatar && avatar.a1
                                    ? avatar.a1
                                    : 'https://pic.500px.me/images/default_tx.png'
                            }
                        />
                    </View>
                    <Text className='person__page__info__name'>{nickName}</Text>
                    <View className='person__page__info__block'>
                        <Text>被浏览数 {userPvedCount}</Text>
                        <Text style={{ margin: '0 20px' }}>
                            粉丝 {userFollowedCount}
                        </Text>
                        <Text>关注 {userFolloweeCount}</Text>
                    </View>
                </View>
                <View className='person__page__project'>
                    {projectList.map((project) => (
                        <View
                            style={{ position: 'relative' }}
                            key={project.id}
                            onClick={() => this.goToImgDetail(project)}
                        >
                            <Image
                                lazyLoad
                                className='person__page__project__img'
                                src={project.url.p3}
                                mode='widthFix'
                            ></Image>
                            <Text
                                style={bindShow(project.title)}
                                className='person__page__project__title'
                            >
                                {project.title}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        )
    }
}
export default Index
