import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtAvatar, AtIcon } from 'taro-ui'
import { connect } from '@tarojs/redux'
import action from '../../utils/action'
import { getUserInfo, getWorkByUserId } from '../../api'
import Loading from '../../components/common/loading'
import { bindShow } from '../../utils/style'

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
        isCollectShow: false,
        pageIndex: 1,
        projectList: [],
    }

    config = {
        navigationBarTitleText: '作者',
    }

    // 页面挂载时的钩子函数
    componentDidMount() {
        // 通过路由参数获取摄影师id
        const { userId } = this.$router.params
        // 设置摄影师id后分别请求摄影师信息和摄影师作品列表
        this.setState({ userId }, () => {
            this.getUserInfo()
            this.getProject()
        })
    }

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
            Taro.showToast({
                title: error.message,
                icon: 'none',
            })
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
            Taro.showToast({
                title: error.message,
                icon: 'none',
            })
        }
    }

    loadNextPage = () => {
        const { pageIndex } = this.state
        this.setState({ pageIndex: pageIndex + 1 }, () => {
            this.getProject()
        })
    }

    goToImgDetail = (item) => {
        const { id, title, photoCount } = item
        Taro.navigateTo({
            url: `/pages/detail/index?id=${id}&title=${title}&photoCount=${photoCount}`,
        })
    }

    onImgLoad() {
        setTimeout(() => {
            this.setState({ isImgShow: true }, () => {
                setTimeout(() => {
                    this.setState({ isCollectShow: true })
                }, 1500)
            })
        }, 500)
    }

    onImgError(e) {
        console.log(e)
    }

    handleCollectStatusChange = (isCollect) => {
        Taro.showLoading({
            title: '处理中',
        })
        const { dispatch } = this.props
        const { userId } = this.$router.params
        const { userInfo } = this.state
        const photographer = userInfo.nickName
        const photographerAvatar = userInfo.avatar.a1
            ? userInfo.avatar.a1
            : 'https://pic.500px.me/images/default_tx.png'
        const workNum = userInfo.userProfilePhotoCount
        const bg = userInfo.coverUrl.p5 ? userInfo.coverUrl.p5 : ''

        Taro.cloud
            .callFunction({
                name: isCollect ? 'discollectUser' : 'collectUser',
                data: isCollect
                    ? { id: userId }
                    : {
                          id: userId,
                          photographer,
                          photographerAvatar,
                          workNum,
                          bg,
                      },
            })
            .then((res) => {
                const userInfo = res.result
                userInfo && dispatch(action('app/setUserInfo', { userInfo }))
                Taro.hideLoading()
            })
            .catch((error) => {
                Taro.showToast({
                    title: '收藏/取消收藏失败',
                    icon: 'none',
                })
                Taro.hideLoading()
            })
    }

    // 配置当前页面得分享卡片（卡片标题和卡片展示的图像）
    onShareAppMessage() {
        const { userInfo } = this.state
        const { userId } = this.$router.params
        const imageUrl =
            userInfo.avatar && userInfo.avatar.a1
                ? userInfo.avatar.a1
                : 'https://pic.500px.me/images/default_tx.png'
        return {
            title: `摄影师：${userInfo.nickName}`,
            path: `/pages/person/index?userId=${userId}`,
            imageUrl,
        }
    }

    render() {
        const { isImgShow, isCollectShow, userInfo, projectList } = this.state
        const { userInfo: viewerInfo } = this.props
        const { userId } = this.$router.params
        const isCollect = viewerInfo.collectPhotographerList
            ? viewerInfo.collectPhotographerList.some((e) => e.id === userId)
            : false
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
                {!isImgShow ? <Loading /> : null}
                <Image
                    style={bindShow(isImgShow)}
                    className='person__page__img'
                    src={coverUrl.p5 ? coverUrl.p5 : ''}
                    onLoad={this.onImgLoad}
                    onError={() => this.onImgError}
                    mode='widthFix'
                />
                <View className='person__page__info'>
                    {viewerInfo.nickName ? (
                        <View
                            style={bindShow(isCollectShow, true)}
                            className='person__page__info__collect'
                            onClick={() =>
                                this.handleCollectStatusChange(isCollect)
                            }
                        >
                            <AtIcon
                                value={isCollect ? 'heart-2' : 'heart'}
                                size='30'
                                color='#F27788'
                            ></AtIcon>
                        </View>
                    ) : null}
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
