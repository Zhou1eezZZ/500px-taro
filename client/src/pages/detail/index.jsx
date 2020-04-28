import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtAvatar, AtIcon, AtTextarea, AtButton } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { getPicDetail, getGroupPicDetail, getPicComments } from '../../api'
import { bindShow } from '../../utils/style'
import { debounce } from '../../utils/tools'
import DetailComment from '../../components/detail/detail-comment'
import action from '../../utils/action'
import moment from '../../utils/moment'

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
        isLoading: false,
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

    componentWillMount() {}

    componentDidMount() {
        const { id, title, type, photoCount } = this.$router.params
        this.setState({ imgType: type })
        Taro.setNavigationBarTitle({ title: title ? title : '无题' })
        this.getPicDetail({ id, isGroup: parseInt(photoCount) ? true : false })
        this.getPicComments({ id })
    }

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    getPicDetail = async ({ id, isGroup }) => {
        try {
            this.setState({ isLoading: true })
            const res = isGroup
                ? await getGroupPicDetail({ id })
                : await getPicDetail({ id })
            this.setState({
                picInfo: isGroup ? res.data : res,
                isLoading: false,
            })
        } catch (error) {
            console.log(error)
        }
    }

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
            console.log(error.message)
        }
    }

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

    onImgLoad() {
        setTimeout(() => {
            this.setState({ isImgShow: true })
        }, 500)
    }

    onImgError(e) {
        console.log(e)
    }

    loadNextPage = () => {
        const { id } = this.$router.params
        const { pageIndex } = this.state
        this.setState({ pageIndex: pageIndex + 1 }, () => {
            this.getPicComments({ id })
        })
    }

    handleAvatarClick = () => {
        const { id } = this.state.picInfo.uploaderInfo
        Taro.navigateTo({
            url: `/pages/person/index?userId=${id}`,
        })
    }

    handleCollectStatusChange = (isCollect) => {
        Taro.showLoading({
            title: '处理中',
        })
        const { dispatch } = this.props
        const { id, title, photoCount } = this.$router.params
        const { picInfo } = this.state
        const uploader = picInfo.uploaderInfo.nickName
        const uploaderAvatar = picInfo.uploaderInfo.avatar.baseUrl
            ? `${picInfo.uploaderInfo.avatar.baseUrl}!a1`
            : 'https://pic.500px.me/images/default_tx.png'
        const img = picInfo.url.p5
            ? picInfo.url.p5
            : `${picInfo.url.baseUrl}!p4`

        Taro.cloud
            .callFunction({
                name: isCollect ? 'discollectPic' : 'collectPic',
                data: isCollect
                    ? { id }
                    : { id, title, uploader, img, uploaderAvatar, photoCount },
            })
            .then((res) => {
                const userInfo = res.result
                userInfo && dispatch(action('app/setUserInfo', { userInfo }))
                Taro.hideLoading()
            })
            .catch((error) => {
                console.log(error)
                Taro.hideLoading()
            })
    }

    handleChangeComment = (e) => {
        this.setState({ commentVal: e.detail.value })
    }

    handleSubmitComment = () => {
        const { commentVal } = this.state
        const { id } = this.$router.params
        const { dispatch } = this.props
        if (commentVal) {
            Taro.showLoading({
                title: '提交中',
            })
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
                    const userInfo = res.result
                    userInfo &&
                        dispatch(action('app/setUserInfo', { userInfo }))
                    Taro.hideLoading()
                })
                .catch((error) => {
                    console.log(error)
                    Taro.hideLoading()
                })
        } else {
            Taro.showToast({
                title: '请输入评论',
                icon: 'none',
            })
        }
    }

    onShareAppMessage() {
        const { picInfo } = this.state
        const { id, title, type, photoCount } = this.$router.params
        const imageUrl = picInfo.url.p5
            ? picInfo.url.p5
            : `${picInfo.url.baseUrl}!p4`
        return {
            title: `摄影作品：${title}`,
            path: `/pages/detail/index?id=${id}&title=${title}&type=${type}&photoCount=${photoCount}`,
            imageUrl,
        }
    }

    render() {
        const {
            isLoading,
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
        return isLoading ? (
            <View>loading...</View>
        ) : (
            <ScrollView
                scrollY
                enableBackToTop
                onScrollToLower={this.loadNextPage}
                className='detail__page'
            >
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
                            {picInfo.description}
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
                <View
                    style={bindShow(commentsList.length > 0)}
                    className='detail__page__comment'
                >
                    <View className='detail__page__comment__title'>评 论</View>
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
                    {commentsList.map((comment) => (
                        <DetailComment key={comment.id} data={comment} />
                    ))}
                </View>
            </ScrollView>
        )
    }
}
export default Index
