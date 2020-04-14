import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import action from '../../utils/action'
import { getHot, getTrending, getNew, getRecommend } from '../../api'
import { debounce } from '../../utils/tools'
import FindCard from '../../components/find/find-card'
import FindTabbar from '../../components/find/find-tabbar'

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
@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    constructor(props) {
        super(props)
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

    componentWillMount() {}

    componentDidMount() {
        this.getList()
    }

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

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

    getHot = async () => {
        const { pageIndex, list, isLoading } = this.state
        if (isLoading) return
        try {
            this.setState({ isLoading: true })
            const res = await getHot({ page: pageIndex })
            this.setState({ isLoading: false })
            if (res.message !== 'success') {
                throw new Error(res)
            }
            const { data } = res
            this.setState({ list: pageIndex === 1 ? data : [...list, ...data] })
        } catch (error) {
            console.log(error)
        }
    }

    getTrending = async () => {
        const { pageIndex, list, isLoading } = this.state
        if (isLoading) return
        try {
            this.setState({ isLoading: true })
            const res = await getTrending({ page: pageIndex })
            this.setState({ isLoading: false })
            this.setState({ list: pageIndex === 1 ? res : [...list, ...res] })
        } catch (error) {
            console.log(error)
        }
    }

    getNew = async () => {
        const { pageIndex, list, isLoading } = this.state
        if (isLoading) return
        try {
            this.setState({ isLoading: true })
            const res = await getNew({ page: pageIndex })
            this.setState({ isLoading: false })
            this.setState({ list: pageIndex === 1 ? res : [...list, ...res] })
        } catch (error) {
            console.log(error)
        }
    }

    getRecommend = async () => {
        const { pageIndex, list, isLoading } = this.state
        if (isLoading) return
        try {
            this.setState({ isLoading: true })
            const res = await getRecommend({ page: pageIndex })
            this.setState({ isLoading: false })
            this.setState({ list: pageIndex === 1 ? res : [...list, ...res] })
        } catch (error) {
            console.log(error)
        }
    }

    loadNextPage = () => {
        const { pageIndex } = this.state
        this.setState({ pageIndex: pageIndex + 1 }, () => {
            this.getList()
        })
    }

    setActiveTab = (value) => {
        const { activeTab } = this.state
        if (activeTab === value) return
        const title = tabbarList.find((item) => item.value === value).label
        Taro.setNavigationBarTitle({ title })
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

    goToImgDetail = (item) => {
        const { activeTab } = this.state
        Taro.navigateTo({
            url: `/pages/detail/index?id=${item.id}&title=${item.title}&type=${activeTab}`,
        })
    }

    onViewScroll = (event) => {
        const { scrollTop } = event.detail
        this.setState({ topNum: scrollTop })
    }

    render() {
        const { list, activeTab, topNum } = this.state
        return (
            <View style={{ height: '100%' }}>
                <View className='find__page__tabbar'>
                    <FindTabbar
                        activeTab={activeTab}
                        tabList={tabbarList}
                        onTabClick={this.setActiveTab}
                    />
                </View>
                <ScrollView
                    scrollY
                    enableBackToTop
                    onScrollToLower={this.loadNextPage}
                    scrollTop={topNum}
                    onScroll={this.onViewScroll}
                    className='find__page'
                >
                    <View className='find__page__list__wrap'>
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
