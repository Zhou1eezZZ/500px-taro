import Taro, { Component } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import action from '../../utils/action'
import { getRecommendPhotographer } from '../../api/index'
import UserCard from '../../components/collectUser/user-card'

import './index.scss'

@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    state = {
        recommendList: [],
        pageIndex: 1,
    }

    config = {
        navigationBarTitleText: '摄影师推荐',
    }

    componentWillMount() {}

    componentDidMount() {
        this.getRecommendList()
    }

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    getRecommendList = async () => {
        const { pageIndex, recommendList } = this.state
        try {
            const res = await getRecommendPhotographer({ page: pageIndex })
            const list = this.recommendAdapter(res)
            this.setState({ recommendList: [...recommendList, ...list] })
        } catch (error) {
            console.log(error)
        }
    }

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

    loadNextPage = () => {
        const { pageIndex } = this.state
        this.setState({ pageIndex: pageIndex + 1 }, () => {
            this.getRecommendList()
        })
    }

    goToUserDetail = (id) => {
        Taro.navigateTo({
            url: `/pages/person/index?userId=${id}`,
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
        const { recommendList } = this.state
        return (
            <ScrollView
                scrollY
                enableBackToTop
                onScrollToLower={this.loadNextPage}
                className='recommend__page'
            >
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
