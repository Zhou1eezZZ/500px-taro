import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { getHot, getTrending, getNew, getRecommend } from '../../api'
import { debounce } from '../../utils/tools'
import FindCard from '../../components/find/find-card'
import FindTabbar from '../../components/find/find-tabbar'
import Loading from '../../components/common/loading'

import './index.scss'

const tabbarList = [
    {
        value: 'hot',
        label: '热门',
    },
    {
        value: 'trending',
        label: '排名上升',
    },
    {
        value: 'new',
        label: '新作',
    },
    {
        value: 'recommend',
        label: '编辑推荐',
    },
]
// 组件连接store，获取到store中的值
@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    constructor(props) {
        super(props)
        // 设置onViewScroll函数为防抖函数
        this.onViewScroll = debounce(this.onViewScroll, 300)
    }

    state = {
        pageIndex: 1,
        list: [],
        isLoading: false,
        activeTab: 'hot',
        topNum: 0,
    }

    config = {
        navigationBarTitleText: '热门',
    }

    // 页面挂载时执行的钩子
    componentDidMount() {
        // 获取图片列表
        this.getList()
    }

    // 根据当前tabbar选项来确定要请求的图片列表的接口
    getList = () => {
        const { activeTab } = this.state
        switch (activeTab) {
            case 'hot':
                this.getHot()
                break
            case 'trending':
                this.getTrending()
                break
            case 'new':
                this.getNew()
                break
            case 'recommend':
                this.getRecommend()
                break
            default:
                break
        }
    }

    // 获取热门图片
    getHot = async () => {
        const { pageIndex, list, isLoading } = this.state
        if (isLoading) return
        try {
            this.setState({ isLoading: true })
            const res = await getHot({ page: pageIndex })
            this.setState({ isLoading: false })
            if (res.message !== 'success') {
                throw new Error('获取图片失败')
            }
            const { data } = res
            this.setState({ list: [...list, ...data] })
        } catch (error) {
            // 错误捕获，弹出提示框
            Taro.showToast({
                title: error.message,
                icon: 'none',
            })
        }
    }

    // 获取排名上升图片
    getTrending = async () => {
        const { pageIndex, list, isLoading } = this.state
        if (isLoading) return
        try {
            this.setState({ isLoading: true })
            const res = await getTrending({ page: pageIndex })
            this.setState({ isLoading: false })
            this.setState({ list: [...list, ...res] })
        } catch (error) {
            Taro.showToast({
                title: '获取图片失败',
                icon: 'none',
            })
        }
    }

    // 获取最新图片
    getNew = async () => {
        const { pageIndex, list, isLoading } = this.state
        if (isLoading) return
        try {
            this.setState({ isLoading: true })
            const res = await getNew({ page: pageIndex })
            this.setState({ isLoading: false })
            this.setState({ list: [...list, ...res] })
        } catch (error) {
            Taro.showToast({
                title: '获取图片失败',
                icon: 'none',
            })
        }
    }

    // 获取推荐图片
    getRecommend = async () => {
        const { pageIndex, list, isLoading } = this.state
        if (isLoading) return
        try {
            this.setState({ isLoading: true })
            const res = await getRecommend({ page: pageIndex })
            this.setState({ isLoading: false })
            this.setState({ list: [...list, ...res] })
        } catch (error) {
            Taro.showToast({
                title: '获取图片失败',
                icon: 'none',
            })
        }
    }

    // 用户滑到页面底部时触发加载下一页的请求
    loadNextPage = () => {
        const { pageIndex } = this.state
        // 设置分页参数加一后触发获取列表函数
        this.setState({ pageIndex: pageIndex + 1 }, () => {
            this.getList()
        })
    }

    // 设置当前tabbar激活项的函数
    setActiveTab = (value) => {
        // 获取当前激活的导航栏项，如果没有变化的话就不执行下面逻辑了
        const { activeTab } = this.state
        if (activeTab === value) return
        // 设置当前的标题为当前的激活项
        const title = tabbarList.find((item) => item.value === value).label
        Taro.setNavigationBarTitle({ title })
        // 将当前的图片数组以及分页参数等置空，并请求接口获取新的图片数组
        this.setState(
            {
                topNum: 0,
                activeTab: value,
                list: [],
                pageIndex: 1,
                isLoading: false,
            },
            () => {
                this.getList()
            }
        )
    }

    // 卡片的点击函数，点击跳转到详情页
    goToImgDetail = (item) => {
        const { activeTab } = this.state
        const { id, title, photoCount } = item
        Taro.navigateTo({
            url: `/pages/detail/index?id=${id}&title=${title}&type=${activeTab}&photoCount=${photoCount}`,
        })
    }

    // 当scrollview被滑动时触发的函数（设置当前页面滚动的距离）
    onViewScroll = (event) => {
        const { scrollTop } = event.detail
        this.setState({ topNum: scrollTop })
    }

    // 分享页面的配置（配置标题和分享卡片的图片）
    onShareAppMessage() {
        const { activeTab, list } = this.state
        const title = tabbarList.find((item) => item.value === activeTab).label
        const imageUrl = `${list[0].url.baseUrl}!p4`
        return {
            title: `查看今日${title}图片`,
            path: '/pages/find/index',
            imageUrl,
        }
    }

    render() {
        const { list, activeTab, topNum, isLoading, pageIndex } = this.state
        return (
            <View style={{ height: '100%' }}>
                {/* 页面上方的导航栏 */}
                <View className='find__page__tabbar'>
                    <FindTabbar
                        activeTab={activeTab}
                        tabList={tabbarList}
                        onTabClick={this.setActiveTab}
                    />
                </View>
                {/* 当首次加载时显示loading组件 */}
                {isLoading && pageIndex === 1 ? <Loading /> : null}
                <ScrollView
                    scrollY
                    enableBackToTop
                    onScrollToLower={this.loadNextPage}
                    scrollTop={topNum}
                    onScroll={this.onViewScroll}
                    className='find__page'
                >
                    <View className='find__page__list__wrap'>
                        {/* 遍历出要展示的图像卡片 */}
                        {list.map((item) =>
                            item ? (
                                <FindCard
                                    key={item.id}
                                    data={item}
                                    onImgClick={() => this.goToImgDetail(item)}
                                />
                            ) : null
                        )}
                    </View>
                </ScrollView>
            </View>
        )
    }
}
export default Index
