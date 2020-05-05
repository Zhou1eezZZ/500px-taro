import Taro, { Component } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { getRecommendPhotographer } from '../../api/index'
import UserCard from '../../components/collectUser/user-card'
import Loading from '../../components/common/loading'

import './index.scss'

@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    state = {
        recommendList: [],
        pageIndex: 1,
        isLoading: false,
    }

    config = {
        navigationBarTitleText: '摄影师推荐',
    }

    // 页面挂载时的钩子
    componentDidMount() {
        // 获取摄影师的推荐列表
        this.getRecommendList()
    }

    // 获取摄影师推荐列表函数
    getRecommendList = async () => {
        const { pageIndex, recommendList } = this.state
        try {
            this.setState({ isLoading: true })
            // 请求接口
            const res = await getRecommendPhotographer({ page: pageIndex })
            this.setState({ isLoading: false })
            const list = this.recommendAdapter(res)
            this.setState({ recommendList: [...recommendList, ...list] })
        } catch (error) {
            // 错误捕获
            Taro.showToast({
                title: '获取推荐列表失败',
                icon: 'none',
            })
        }
    }

    // 摄影师推荐列表的数据处理函数（把对象处理成我们需要的结构）
    recommendAdapter = (list) => {
        const result = list.map((e) => ({
            id: e.id,
            photographer: e.nickName,
            photographerAvatar: e.avatar.a1
                ? e.avatar.a1
                : 'https://pic.500px.me/images/default_tx.png',
            workNum: e.userUploaderCount,
            bg: e.coverUrl.p5 ? e.coverUrl.p5 : '',
        }))
        return result
    }

    // 当页面被滑到最底部时触发的函数（会通过接口去加载推荐摄影师的下一页）
    loadNextPage = () => {
        const { pageIndex } = this.state
        this.setState({ pageIndex: pageIndex + 1 }, () => {
            this.getRecommendList()
        })
    }

    // 点击摄影师卡片时执行的函数（跳转到摄影师详情页）
    goToUserDetail = (id) => {
        Taro.navigateTo({
            url: `/pages/person/index?userId=${id}`,
        })
    }

    // 配置当前页面的分享卡片（卡片标题和卡片展示的图像）
    onShareAppMessage() {
        return {
            title: '快来发现精彩摄影作品',
            path: `/pages/find/index`,
            imageUrl:
                'https://img.500px.me/photo/ae03b70d9495e84330b87b19d6a7c7743/e6c047e33607430bba923e1001241fdd.jpg!p5',
        }
    }

    render() {
        const { recommendList, isLoading, pageIndex } = this.state
        return (
            <ScrollView
                scrollY
                enableBackToTop
                onScrollToLower={this.loadNextPage}
                className='recommend__page'
            >
                {/* 页面加载时显示loading组件 */}
                {isLoading && pageIndex === 1 ? <Loading /> : null}
                {/* 遍历推荐的摄影师数组并展示 */}
                {recommendList.map((item) =>
                    item ? (
                        <UserCard
                            key={item.id}
                            data={item}
                            onClick={() => this.goToUserDetail(item.id)}
                        />
                    ) : null
                )}
            </ScrollView>
        )
    }
}
export default Index
