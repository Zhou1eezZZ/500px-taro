import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtAvatar, AtIcon, AtTextarea, AtButton } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { getPicDetail, getGroupPicDetail, getPicComments } from '../../api'
import { bindShow } from '../../utils/style'
import { debounce } from '../../utils/tools'
import DetailComment from '../../components/detail/detail-comment'
import Loading from '../../components/common/loading'
import action from '../../utils/action'
import moment from '../../utils/moment'

import WxParse from '../../components/wxParse/wxParse'
import '../../components/wxParse/wxParse.wxss'

import './index.scss'

const imgTypeObj = {
    hot: {
        name: '热门',
        icon: 'https://cdn.500px.me/images/photoDetail/honor_popular.svg',
    },
    trending: {
        name: '排名上升',
        icon: 'https://cdn.500px.me/images/photoDetail/honor_upcoming.svg',
    },
    new: {
        name: '新作',
        icon: '',
    },
    recommend: {
        name: '编辑推荐',
        icon:
            'https://cdn.500px.me/images/photoDetail/honor_editors-choice.svg',
    },
}

@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    constructor(props) {
        super(props)
        // 设置收藏函数为防抖函数
        this.handleCollectStatusChange = debounce(
            this.handleCollectStatusChange,
            1000
        )
    }
    state = {
        picInfo: {
            url: {
                baseUrl:
                    'https://img.500px.me/5fed9c5f6437294ada1331f3506878691_1452676245638.jpg',
            },
        },
        imgType: '', // 图片属于首页的哪个板块
        commentsList: [],
        commentTotal: 0,
        isImgShow: false,
        pageIndex: 1,
        commentVal: '',
    }

    config = {
        navigationBarTitleText: '详情页',
    }

    // 页面挂载时的钩子
    componentDidMount() {
        const { id, title, type, photoCount } = this.$router.params
        this.setState({ imgType: type })
        // 设置标题为图片名
        Taro.setNavigationBarTitle({ title: title ? title : '无题' })
        // 通过接口获取图片详情
        this.getPicDetail({ id, isGroup: parseInt(photoCount) ? true : false })
        // 通过接口获取图片的评论
        this.getPicComments({ id })
    }

    // 获取图片详情的函数
    getPicDetail = async ({ id, isGroup }) => {
        try {
            const res = isGroup
                ? await getGroupPicDetail({ id })
                : await getPicDetail({ id })
            this.setState(
                {
                    picInfo: isGroup ? res.data : res,
                },
                () => {
                    WxParse.wxParse(
                        'article',
                        'html',
                        this.state.picInfo.description,
                        this.$scope,
                        5
                    )
                }
            )
        } catch (error) {
            Taro.showToast({
                title: '获取图片详情失败',
                icon: 'none',
            })
        }
    }

    // 获取图片评论的函数
    getPicComments = async ({ id }) => {
        const { pageIndex, commentsList, commentTotal } = this.state
        if (commentTotal <= commentsList.length && pageIndex !== 1) return
        try {
            const res = await getPicComments({ resId: id, page: pageIndex })
            if (res.message != 'sucess') {
                throw new Error(res.message)
            }
            const { comments, commentCount } = res
            const adapterComments = this.commentsAdapter(comments)
            this.setState({
                commentsList: [...commentsList, ...adapterComments],
                commentTotal: commentCount,
            })
        } catch (error) {
            Taro.showToast({
                title: '获取图片评论信息失败',
                icon: 'none',
            })
        }
    }

    // 评论数组的数据处理函数（把通过接口获取到的评论数据处理成我们需要的样子）
    commentsAdapter = (comments) => {
        const result = comments.map((e) => ({
            id: e.id,
            avatarUrl: e.userInfo.avatar.baseUrl
                ? `${e.userInfo.avatar.baseUrl}!a1`
                : 'https://pic.500px.me/images/default_tx.png',
            nickName: e.userInfo.nickName,
            message: e.message,
            createDate: e.createDate,
        }))
        return result
    }

    // 图片加载完时的钩子
    onImgLoad() {
        // 图片加载完时让isImgshow值为true（当这个值为true会有图片显示动画，避免一开始未获取到图片时页面有空白）
        setTimeout(() => {
            this.setState({ isImgShow: true })
        }, 500)
    }

    // 图片出错时的钩子
    onImgError(e) {
        console.log(e)
    }

    // 当页面被滑到最底部时触发的函数（会通过接口去加载评论的下一页）
    loadNextPage = () => {
        const { id } = this.$router.params
        const { pageIndex } = this.state
        this.setState({ pageIndex: pageIndex + 1 }, () => {
            this.getPicComments({ id })
        })
    }

    // 页面中摄影师头像被点击触发的函数
    handleAvatarClick = () => {
        const { id } = this.state.picInfo.uploaderInfo
        Taro.navigateTo({
            url: `/pages/person/index?userId=${id}`,
        })
    }

    // 用户点击收藏图片按钮或取消收藏图片按钮的函数
    handleCollectStatusChange = (isCollect) => {
        // 展示处理中的提示窗
        Taro.showLoading({
            title: '处理中',
        })
        // 定义需要传递给收藏接口的一些参数，包括作者名、作者头像、图片id、图片名、图片地址
        const { dispatch } = this.props
        const { id, title, photoCount } = this.$router.params
        const { picInfo } = this.state
        const uploader = picInfo.uploaderInfo.nickName
        const uploaderId = picInfo.uploaderInfo.id
        const uploaderAvatar = picInfo.uploaderInfo.avatar.baseUrl
            ? `${picInfo.uploaderInfo.avatar.baseUrl}!a1`
            : 'https://pic.500px.me/images/default_tx.png'
        const img = picInfo.url.p5
            ? picInfo.url.p5
            : `${picInfo.url.baseUrl}!p4`

        // 请求收藏/取消收藏的云函数
        Taro.cloud
            .callFunction({
                name: isCollect ? 'discollectPic' : 'collectPic',
                data: isCollect
                    ? { id }
                    : {
                          id,
                          title,
                          uploader,
                          uploaderId,
                          img,
                          uploaderAvatar,
                          photoCount,
                      },
            })
            .then((res) => {
                // 请求成功，更新用户信息
                const userInfo = res.result
                userInfo && dispatch(action('app/setUserInfo', { userInfo }))
                // 隐藏处理中的提示框
                Taro.hideLoading()
            })
            .catch((error) => {
                // 错误处理
                Taro.showToast({
                    title: '收藏/取消收藏失败',
                    icon: 'none',
                })
                // 隐藏处理中的提示框
                Taro.hideLoading()
            })
    }

    // 用户自己评论的input组件的数据绑定函数
    handleChangeComment = (e) => {
        this.setState({ commentVal: e.detail.value })
    }

    // 点击提交评论触发的函数
    handleSubmitComment = () => {
        // 获取用户评论的内容
        const { commentVal } = this.state
        const { id } = this.$router.params
        const { dispatch } = this.props
        if (commentVal) { // 有评论内容时
            // 弹出提交中的提示框
            Taro.showLoading({
                title: '提交中',
            })
            // 请求添加评论的云函数，传递的参数为评论者的id、评论时间、评论内容
            Taro.cloud
                .callFunction({
                    name: 'addComment',
                    data: {
                        id,
                        message: commentVal,
                        createDate: new Date().getTime(),
                    },
                })
                .then((res) => {
                    // 请求成功，更新用户信息
                    const userInfo = res.result
                    userInfo &&
                        dispatch(action('app/setUserInfo', { userInfo }))
                    // 隐藏提示框
                    Taro.hideLoading()
                })
                .catch((error) => {
                    // 错误处理
                    Taro.showToast({
                        title: '评论图片失败',
                        icon: 'none',
                    })
                    // 隐藏提示框
                    Taro.hideLoading()
                })
        } else { // 评论内容为空时
            // 提示用户
            Taro.showToast({
                title: '请输入评论',
                icon: 'none',
            })
        }
    }

    // 配置当前页面得分享卡片（卡片标题和卡片展示的图像）
    onShareAppMessage() {
        // 获取作品名、作品的图片路径和跳转路径需要的路由信息
        const { picInfo } = this.state
        const { id, title, type, photoCount } = this.$router.params
        const imageUrl = picInfo.url.p5
            ? picInfo.url.p5
            : `${picInfo.url.baseUrl}!p4`
        return {
            title: `摄影作品：${title}`, // 分享卡片的标题值，这里是作品的名字
            path: `/pages/detail/index?id=${id}&title=${title}&type=${type}&photoCount=${photoCount}`, // 分享卡片点击后进入的小程序页面路径
            imageUrl, // 分享卡片展示的图片路径，这里是作品图片的链接
        }
    }

    render() {
        const {
            picInfo,
            imgType,
            isImgShow,
            commentsList,
            commentVal,
        } = this.state
        const { userInfo } = this.props
        const { id } = this.$router.params
        const isCollect = userInfo.collectPhotoList
            ? userInfo.collectPhotoList.some((e) => e.id === id)
            : false
        const isComment = userInfo.commentsList
            ? userInfo.commentsList.some((e) => e.id === id)
            : false
        let userComment = {}
        if (isComment) {
            const comment = userInfo.commentsList.find((e) => e.id === id)
            const { message, createDate } = comment
            userComment = {
                avatarUrl: userInfo.avatarUrl,
                nickName: userInfo.nickName,
                message,
                createDate,
            }
        }
        const { exifInfo, category } = picInfo
        return (
            <ScrollView
                scrollY
                enableBackToTop
                onScrollToLower={this.loadNextPage}
                className='detail__page'
            >
                {!isImgShow ? <Loading /> : null}
                <Image
                    style={bindShow(isImgShow)}
                    className='detail__page__img'
                    src={
                        picInfo.url.p5
                            ? picInfo.url.p5
                            : `${picInfo.url.baseUrl}!p4`
                    }
                    onLoad={this.onImgLoad}
                    onError={() => this.onImgError}
                    mode='widthFix'
                />
                <View>
                    <View className='detail__page__uploader'>
                        <View onClick={this.handleAvatarClick}>
                            <AtAvatar
                                circle
                                size='small'
                                image={
                                    picInfo.uploaderInfo &&
                                    picInfo.uploaderInfo.avatar &&
                                    picInfo.uploaderInfo.avatar.baseUrl
                                        ? `${picInfo.uploaderInfo.avatar.baseUrl}!a1`
                                        : 'https://pic.500px.me/images/default_tx.png'
                                }
                            />
                        </View>
                        <View className='detail__page__uploader__info'>
                            <Text className='detail__page__uploader__info__name'>
                                {picInfo.uploaderInfo.nickName}
                            </Text>
                            <Text className='detail__page__uploader__info__fans'>
                                粉丝数 {picInfo.uploaderInfo.userFollowedCount}
                            </Text>
                        </View>
                        {/* 用户登陆时会显示收藏按钮这个模块 */}
                        {userInfo.nickName ? (
                            <View
                                className='detail__page__collect'
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
                    </View>
                    <View className='detail__page__des'>
                        <View className='detail__page__des__title'>
                            {picInfo.title}
                        </View>
                        <View className='detail__page__des__content'>
                            <import src='../../components/wxParse/wxParse.wxml' />
                            <template
                                is='wxParse'
                                data='{{wxParseData:article.nodes}}'
                            />
                        </View>
                    </View>
                </View>
                <View className='detail__page__detail'>
                    <View className='detail__page__detail__basic'>
                        <View className='detail__page__detail__heat'>
                            <Text className='detail__page__detail__heat__title'>
                                热度
                            </Text>
                            <Text className='detail__page__detail__heat__content'>
                                {parseFloat(picInfo.ratingMax).toFixed(1)}
                            </Text>
                            <Text className='detail__page__detail__time'>
                                {moment(picInfo.ratingMaxDate).format(
                                    'YYYY.MM.DD'
                                )}
                            </Text>
                        </View>
                        <View className='detail__page__detail__pv'>
                            <Text className='detail__page__detail__pv__title'>
                                浏览量
                            </Text>
                            <Text>{picInfo.picturePvCount}</Text>
                            <View className='detail__page__detail__placeholder'>
                                {' '}
                            </View>
                        </View>
                        <View className='detail__page__detail__like'>
                            <Text className='detail__page__detail__like__title'>
                                点赞数
                            </Text>
                            <Text>{picInfo.pictureLikeedCount}</Text>
                            <View className='detail__page__detail__placeholder'>
                                {' '}
                            </View>
                        </View>
                        {imgType === 'new' ||
                        (!imgType && !picInfo.riseUpDate) ? null : (
                            <View className='detail__page__detail__hot'>
                                <Text className='detail__page__detail__hot__title'>
                                    {!imgType && picInfo.riseUpDate
                                        ? imgTypeObj.hot.name
                                        : imgTypeObj[imgType].name}
                                </Text>
                                <Image
                                    className='detail__page__detail__hot__icon'
                                    src={
                                        !imgType && picInfo.riseUpDate
                                            ? imgTypeObj.hot.icon
                                            : imgTypeObj[imgType].icon
                                    }
                                ></Image>
                                <Text className='detail__page__detail__time'>
                                    {moment(picInfo.riseUpDate).format(
                                        'YYYY.MM.DD'
                                    )}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
                <View
                    style={bindShow(exifInfo && exifInfo.modelVcg)}
                    className='detail__page__camera'
                >
                    <Text className='detail__page__camera__title'>
                        {exifInfo.modelVcg}
                    </Text>
                    <Text className='detail__page__camera__subtitle'>
                        {exifInfo.lens}
                    </Text>
                    <View className='detail__page__camera__flex'>
                        <View className='detail__page__camera__flex__item'>
                            <Image
                                className='detail__page__camera__flex__item__img'
                                src='https://cdn.500px.me/images/photoDetail/aperture.svg'
                            ></Image>
                            <Text>光圈 {exifInfo.aperture}</Text>
                        </View>
                        <View className='detail__page__camera__flex__item'>
                            <Image
                                className='detail__page__camera__flex__item__img'
                                src='https://cdn.500px.me/images/photoDetail/time.svg'
                            ></Image>
                            <Text>
                                快门速度 {`${exifInfo.exposureTimeVcg} s`}
                            </Text>
                        </View>
                        <View className='detail__page__camera__flex__item'>
                            <Image
                                className='detail__page__camera__flex__item__img'
                                src='https://cdn.500px.me/images/photoDetail/focus.svg'
                            ></Image>
                            <Text>焦距 {exifInfo.focalLength}</Text>
                        </View>
                        <View className='detail__page__camera__flex__item'>
                            <Image
                                className='detail__page__camera__flex__item__img'
                                src='https://cdn.500px.me/images/photoDetail/iso.svg'
                            ></Image>
                            <Text>{`ISO ${exifInfo.iso}`}</Text>
                        </View>
                    </View>
                </View>
                <View className='detail__page__class'>
                    <View className='detail__page__class__line'>
                        <Text className='detail__page__class__line__title'>
                            分类
                        </Text>
                        <Text className='detail__page__class__line__content'>
                            {category.name}
                        </Text>
                    </View>
                    <View className='detail__page__class__line'>
                        <Text className='detail__page__class__line__title'>
                            上传时间
                        </Text>
                        <Text className='detail__page__class__line__content'>
                            {moment(picInfo.uploadedDate).format(
                                'YYYY.MM.DD HH:mm:ss'
                            )}
                        </Text>
                    </View>
                    {exifInfo && exifInfo.dateTime ? (
                        <View className='detail__page__class__line'>
                            <Text className='detail__page__class__line__title'>
                                拍摄时间
                            </Text>
                            <Text className='detail__page__class__line__content'>
                                {moment(exifInfo.dateTime).format(
                                    'YYYY.MM.DD HH:mm:ss'
                                )}
                            </Text>
                        </View>
                    ) : null}
                </View>
                <View className='detail__page__comment'>
                    <View className='detail__page__comment__title'>评 论</View>
                    {/* 用户登录时会显示自己评论的模块 */}
                    {userInfo.nickName ? (
                        <View>
                            <View
                                style={bindShow(isComment)}
                                className='detail__page__comment__isComment'
                            >
                                <Text className='detail__page__comment__isComment__title'>
                                    你的评论：
                                </Text>
                                <DetailComment data={userComment} />
                            </View>
                            {isComment ? null : (
                                <View className='detail__page__comment__userComment'>
                                    <AtTextarea
                                        value={commentVal}
                                        onChange={(e) =>
                                            this.handleChangeComment(e)
                                        }
                                        maxLength={200}
                                        placeholder='在这里输入你的评论或见解...'
                                    />
                                    <View className='detail__page__comment__userComment__btn'>
                                        <AtButton
                                            size='small'
                                            type='primary'
                                            onClick={this.handleSubmitComment}
                                        >
                                            提交
                                        </AtButton>
                                    </View>
                                </View>
                            )}
                        </View>
                    ) : null}
                    {/* 遍历该作品的评论数组并展示 */}
                    {commentsList.map((comment) => (
                        <DetailComment key={comment.id} data={comment} />
                    ))}
                </View>
            </ScrollView>
        )
    }
}
export default Index
